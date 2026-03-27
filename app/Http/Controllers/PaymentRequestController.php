<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Employee;
use App\Models\PaymentRequest;
use App\Models\PaymentRequestAttachment;
use App\Models\WorkLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PaymentRequestController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $employee = $user->employee;

        $query = PaymentRequest::with(['requestedBy', 'department', 'company', 'workLocation'])
            ->when($request->search, function ($q, $search) {
                $q->where('pr_number', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%");
            });

        // Visibility: Admin sees all. Others see only their own PRs + PRs pending their approval level.
        if (!$user->isAdmin()) {
            $approvalLevels = [];
            $prApprovalSlugs = ['tax', 'accounting', 'cost_control', 'head_branch', 'director', 'commissioner', 'advisor', 'finance'];
            foreach ($prApprovalSlugs as $level) {
                if ($user->hasPermission("pr.approve.{$level}")) {
                    $approvalLevels[] = $level;
                }
            }

            $query->where(function ($q) use ($employee, $approvalLevels) {
                // Always show PRs created by the user
                if ($employee) {
                    $q->where('requested_by_id', $employee->id);
                }
                // Also show PRs that need their approval
                foreach ($approvalLevels as $level) {
                    $q->orWhere("{$level}_status", 'pending');
                }
            });
        }

        $prs = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('payment-requests/index', [
            'prs' => $prs,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        // Check permission: only admin or users with pr.create can access
        if (!request()->user()->isAdmin() && !request()->user()->hasPermission('pr.create')) {
            return redirect()->route('payment-requests.index')->withErrors(['error' => 'You do not have permission to create Payment Requests.']);
        }
        // Merge hardcoded defaults with unique subjects from past PRs
        $defaultSubjects = [
            'Cicilan Mobil', 'THR Natal', 'BPJS Kesehatan', 'Lembur', 'Gaji', 
            'Perjalanan Dinas', 'Pembelian Inventaris', 'Biaya Operasional', 'Lain-lain'
        ];
        $pastSubjects = PaymentRequest::distinct()->pluck('subject')->toArray();
        $allSubjects = collect(array_merge($defaultSubjects, $pastSubjects))->unique()->sort()->values()->toArray();

        return Inertia::render('payment-requests/form', [
            'companies' => WorkLocation::all(),
            'departments' => Department::all(),
            'workingLocations' => \App\Models\WorkingLocation::all(),
            'subjects' => $allSubjects,
            'previousItems' => \App\Models\PaymentRequestItem::distinct()->pluck('description'),
            'banks' => [
                'Bank Mandiri', 'BCA', 'BRI', 'BNI', 'BSI', 'CIMB Niaga', 
                'Danamon', 'Permata', 'OCBC NISP', 'Maybank', 'Panin', 
                'BTN', 'Bank DKI', 'Bank Jatim', 'Bank Jabar Banten', 'Mega', 'Lainnya'
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'company_id' => 'required|exists:work_locations,id',
            'working_location_id' => 'required|exists:working_locations,id',
            'department_id' => 'required|exists:departments,id',
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'paid_to' => 'required|string|max:255',
            'bank_name' => 'required|string|max:100',
            'bank_account' => 'nullable|string|max:50', // Made optional
            'notes' => 'nullable|string',
            'attachments' => 'required|array|min:1',
            'attachments.*' => 'nullable|file|max:10240',
            // Items table
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string|max:255',
            'items.*.unit' => 'required|string|max:20',
            'items.*.qty' => 'required|numeric|min:0.01',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        $employee = $request->user()->employee;
        if (!$employee) {
            return redirect()->back()->withErrors(['error' => 'User profile not found.']);
        }

        if (!$employee->signature) {
            return redirect()->back()->withErrors(['error' => 'Please set up your signature in profile before creating a Payment Request.']);
        }

        // Calculate total amount from items
        $totalAmount = collect($validated['items'])->sum(function($item) {
            return $item['qty'] * $item['price'];
        });

        $pr = DB::transaction(function () use ($validated, $request, $employee, $totalAmount) {
            $company = WorkLocation::find($validated['company_id']);
            $dept = Department::find($validated['department_id']);
            $workingLocation = \App\Models\WorkingLocation::find($validated['working_location_id']);
            
            $prNumber = $this->generatePrNumber($company, $dept, $workingLocation, $validated['date']);
            
            $pr = PaymentRequest::create([
                ...collect($validated)->except('items', 'attachments')->toArray(),
                'amount' => $totalAmount,
                'pr_number' => $prNumber,
                'status' => 'pending',
                'requested_by_id' => $employee->id,
                'requested_at' => now(),
                'requester_signature_snapshot' => $employee->signature,
                'tax_status' => 'pending', // Start the workflow
            ]);

            // Check if Head Branch approver exists using pivot table
            $headBranchApproverExists = Employee::where('work_location_id', $validated['company_id'])
                ->whereHas('user.permissions', function($q) {
                    $q->where('slug', 'pr.approve.head_branch');
                })->exists();

            if (!$headBranchApproverExists) {
                $pr->update([
                    'head_branch_status' => 'skipped',
                    'head_branch_notes' => 'Auto-skipped: No Head Branch approver found for this location.'
                ]);
            }

            // Create items
            foreach ($validated['items'] as $itemData) {
                $itemAmount = $itemData['qty'] * $itemData['price'];
                $pr->items()->create([
                    'description' => $itemData['description'],
                    'unit' => $itemData['unit'],
                    'qty' => $itemData['qty'],
                    'price' => $itemData['price'],
                    'amount' => $itemAmount,
                ]);
            }

            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store('pr-attachments', 'public');
                    PaymentRequestAttachment::create([
                        'payment_request_id' => $pr->id,
                        'file_path' => $path,
                        'file_name' => $file->getClientOriginalName(),
                    ]);
                }
            }

            return $pr;
        });

        return redirect()->route('payment-requests.index')->with('success', 'Payment Request created successfully.');
    }

    public function show(PaymentRequest $paymentRequest)
    {
        $paymentRequest->load(['requestedBy', 'department', 'company', 'workLocation', 'attachments', 'items',
            'taxApprover', 'accountingApprover', 'costControlApprover', 'headBranchApprover', 
            'directorApprover', 'commissionerApprover', 'advisorApprover', 'financeApprover']);

        return Inertia::render('payment-requests/show', [
            'pr' => $paymentRequest,
        ]);
    }

    public function approve(Request $request, PaymentRequest $paymentRequest)
    {
        // Sequential Flow: maker > tax > accounting > cost_control > head_branch > director > commissioner > advisor > finance
        $level = $this->getCurrentApprovalLevel($paymentRequest);
        if (!$level) {
            return redirect()->back()->withErrors(['error' => 'This request is already fully approved or rejected.']);
        }

        // Logic for Skipping Head Branch
        if ($level === 'head_branch') {
           $approver = $this->findApproverForLevel('head_branch', $paymentRequest->work_location_id ?? $paymentRequest->company_id);
           if (!$approver) {
               $paymentRequest->update(['head_branch_status' => 'skipped', 'head_branch_notes' => 'Automatically skipped: No approver found for this location.']);
               $level = $this->getCurrentApprovalLevel($paymentRequest);
               if (!$level) {
                   $paymentRequest->update(['status' => 'approved']);
                   return redirect()->back()->with('success', 'Payment Request fully approved.');
               }
           }
        }

        // Check Permission for the current level
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission("pr.approve.{$level}")) {
             return redirect()->back()->withErrors(['error' => "You do not have permission to approve as {$level}."]);
        }

        $employee = $request->user()->employee;
        if (!$employee || !$employee->signature) {
            return redirect()->back()->withErrors(['error' => 'Please set up your signature in profile before approving.']);
        }

        $paymentRequest->update([
            "{$level}_status" => 'approved',
            "{$level}_approver_id" => $employee->id,
            "{$level}_approved_at" => now(),
            "{$level}_notes" => $request->notes,
            "{$level}_signature_snapshot" => $employee->signature,
        ]);

        // Auto-skip Head Branch if it's the next level and no approver found
        $nextLevel = $this->getCurrentApprovalLevel($paymentRequest);
        if ($nextLevel === 'head_branch') {
            $approver = $this->findApproverForLevel('head_branch', $paymentRequest->work_location_id ?? $paymentRequest->company_id);
            if (!$approver) {
                $paymentRequest->update([
                    'head_branch_status' => 'skipped',
                    'head_branch_notes' => 'Automatically skipped: No Head Branch found for this location.',
                ]);
                $nextLevel = $this->getCurrentApprovalLevel($paymentRequest);
            }
        }

        // If finance (the last level) approves, mark as fully approved
        if (!$nextLevel) {
            $paymentRequest->update(['status' => 'approved']);
        } else {
            $paymentRequest->update(['status' => 'partially_approved']);
        }

        return redirect()->back()->with('success', "Payment Request approved at {$level} level.");
    }

    public function reject(Request $request, PaymentRequest $paymentRequest)
    {
        $level = $this->getCurrentApprovalLevel($paymentRequest);
        if (!$level) {
            return redirect()->back()->withErrors(['error' => 'This request is already fully approved or rejected.']);
        }

        if (!$request->user()->isAdmin() && !$request->user()->hasPermission("pr.approve.{$level}")) {
            return redirect()->back()->withErrors(['error' => "You do not have permission to reject as {$level}."]);
       }

        $paymentRequest->update([
            "{$level}_status" => 'rejected',
            "{$level}_approver_id" => $request->user()->employee?->id,
            "{$level}_approved_at" => now(),
            "{$level}_notes" => $request->notes,
            'status' => 'rejected'
        ]);

        return redirect()->back()->with('success', "Payment Request rejected at {$level} level.");
    }

    public function downloadPdf(PaymentRequest $paymentRequest)
    {
        $paymentRequest->load(['requestedBy', 'department', 'company', 'workLocation', 'attachments', 'items',
            'taxApprover', 'accountingApprover', 'costControlApprover', 'headBranchApprover', 
            'directorApprover', 'commissionerApprover', 'advisorApprover', 'financeApprover']);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdfs.payment-request', ['pr' => $paymentRequest]);
        $pdf->setPaper('a4', 'landscape');
        
        // Sanitize filename: replace / with - for compatibility
        $safeFilename = str_replace('/', '-', $paymentRequest->pr_number);
        
        return $pdf->download("{$safeFilename}.pdf");
    }

    public function whatsappUrl(PaymentRequest $paymentRequest)
    {
        $paymentRequest->load(['requestedBy', 'department', 'company', 'workLocation']);
        
        $level = $this->getCurrentApprovalLevel($paymentRequest);
        if (!$level) {
            return redirect()->back()->withErrors(['error' => 'No pending approval found for this request.']);
        }

        // Skip Head Branch if no approver
        if ($level === 'head_branch') {
            $approver = $this->findApproverForLevel('head_branch', $paymentRequest->company_id);
            if (!$approver) { $level = 'director'; }
        }

        $approver = $this->findApproverForLevel($level, $paymentRequest->company_id);
        if (!$approver) {
            return redirect()->back()->withErrors(['error' => "No approver found for {$level} level."]);
        }

        $approverName = $approver->nama;
        $prNumber = $paymentRequest->pr_number;
        $deptName = $paymentRequest->department->name;
        $companyName = $paymentRequest->company->name;
        $locationName = $paymentRequest->workLocation->name ?? '-';
        $description = $paymentRequest->description;
        $link = "https://hris.bangunbejanabaja.com/payment-requests/{$paymentRequest->id}";

        $message = "Dear {$approverName}\n" .
                   "Mohon dibantu approval untuk\n\n" .
                   "PR No = *{$prNumber}*\n" .
                   "Department = *{$deptName}*\n" .
                   "Perusahaan = *{$companyName}*\n" .
                   "Penempatan = *{$locationName}*\n" .
                   "Description = *{$description}*\n\n" .
                   "Silahkan klik link dibawah ini untuk membuka aplikasi anda.\n\n" .
                   "{$link}";

        $phone = $approver->no_telpon_1;
        if (!$phone) {
             return redirect()->back()->withErrors(['error' => "Approver {$approverName} does not have a phone number set."]);
        }
        
        if (str_starts_with($phone, '0')) {
            $phone = '62' . substr($phone, 1);
        }

        $url = "https://api.whatsapp.com/send?phone={$phone}&text=" . urlencode($message);

        return \Inertia\Inertia::location($url);
    }

    private function generatePrNumber(WorkLocation $company, Department $dept, \App\Models\WorkingLocation $workingLocation, string $dateString): string
    {
        $companyCode = strtoupper($company->code ?? 'BBB'); 
        $deptCode = strtoupper($dept->code ?? 'GA');
        // For WorkingLocation name, take first 3 chars or use 'HDO' as default
        $locationCode = strtoupper(substr(str_replace(' ', '', $workingLocation->name), 0, 3)); 
        
        $date = \Carbon\Carbon::parse($dateString);
        $year = $date->year;
        $month = $date->format('m');
        
        // Count PRs for this year only to reset annually
        $count = PaymentRequest::whereYear('date', $year)
            ->count() + 1;
        
        $formattedCount = str_pad($count, 3, '0', STR_PAD_LEFT);

        return "PR-{$companyCode}.{$deptCode}-{$locationCode}-{$formattedCount}-{$month}-{$year}";
    }

    private function getCurrentApprovalLevel(PaymentRequest $pr): ?string
    {
        // Flow: tax > accounting > cost_control > head_branch > director > commissioner > advisor > finance
        $levels = ['tax', 'accounting', 'cost_control', 'head_branch', 'director', 'commissioner', 'advisor', 'finance'];
        foreach ($levels as $level) {
            $status = $pr->{"{$level}_status"};
            if ($status === 'pending' || ($status === null && $level !== 'head_branch')) {
                // For levels after tax, they become "pending" implicitly when the previous level approves
                // But we only return them if there's no explicit status yet (null = waiting for previous)
                // The first null level after a chain of approved/skipped is the current one
                if ($status === 'pending') return $level;
            }
        }
        
        // Check for first null status after all approved/skipped levels
        $allPrevApproved = true;
        foreach ($levels as $level) {
            $status = $pr->{"{$level}_status"};
            if ($status === null && $allPrevApproved) {
                return $level; // This is the next level to approve
            }
            if ($status !== 'approved' && $status !== 'skipped') {
                $allPrevApproved = false;
            }
        }
        
        return null; // All approved
    }

    private function findApproverForLevel(string $level, int $locationId): ?Employee
    {
        // Use pivot table query (permissions is a BelongsToMany)
        return Employee::where('work_location_id', $locationId)
            ->whereHas('user.permissions', function($q) use ($level) {
                $q->where('slug', "pr.approve.{$level}");
            })->first();
    }
}
