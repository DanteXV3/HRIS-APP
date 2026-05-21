<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Employee;
use App\Models\PaymentRequest;
use App\Models\PaymentRequestAttachment;
use App\Models\User;
use App\Models\WorkLocation;
use App\Notifications\PaymentRequestNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PaymentRequestApiController extends Controller
{
    /**
     * List payment requests.
     * GET /api/payment-requests
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();

        $query = PaymentRequest::with(['requestedBy', 'department', 'company', 'workLocation'])
            ->when($request->search, function ($q, $search) {
                $q->where('pr_number', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%");
            });

        // Visibility: Admin sees all. Others see only their own PRs + PRs pending their approval level.
        if (!$user->isAdmin() && !$user->hasPermission('pr.view_all')) {
            $approvalLevels = [];
            $prApprovalSlugs = ['tax', 'accounting', 'cost_control', 'head_branch', 'director', 'commissioner', 'advisor', 'finance'];
            foreach ($prApprovalSlugs as $level) {
                if ($user->hasPermission("pr.approve.{$level}")) {
                    $approvalLevels[] = $level;
                }
            }

            $query->where(function ($q) use ($employee, $approvalLevels) {
                if ($employee) {
                    $q->where('requested_by_id', $employee->id);
                }
                foreach ($approvalLevels as $level) {
                    $q->orWhere("{$level}_status", 'pending');
                }
            });
        }

        $prs = $query->orderBy('created_at', 'desc')->get()->map(fn($pr) => [
            'id' => $pr->id,
            'pr_number' => $pr->pr_number,
            'date' => $pr->date?->format('Y-m-d'),
            'subject' => $pr->subject,
            'description' => $pr->description,
            'amount' => $pr->amount,
            'status' => $pr->status,
            'paid_to' => $pr->paid_to,
            'requester_name' => $pr->requestedBy?->nama,
            'department_name' => $pr->department?->name,
            'company_name' => $pr->company?->name,
            'location_name' => $pr->workLocation?->name,
            'created_at' => $pr->created_at?->toIso8601String(),
        ]);

        return response()->json(['payment_requests' => $prs]);
    }

    /**
     * Get PR detail with items and approval chain.
     * GET /api/payment-requests/{paymentRequest}
     */
    public function show(PaymentRequest $paymentRequest)
    {
        $paymentRequest->load([
            'requestedBy', 'department', 'company', 'workLocation', 'items',
            'taxApprover', 'accountingApprover', 'costControlApprover',
            'headBranchApprover', 'directorApprover', 'commissionerApprover',
            'advisorApprover', 'financeApprover',
        ]);

        $approvalChain = [];
        $levels = ['tax', 'accounting', 'cost_control', 'head_branch', 'director', 'commissioner', 'advisor', 'finance'];
        foreach ($levels as $level) {
            $approverRelation = str_replace('_', '', ucwords($level, '_')) . 'Approver';
            // Convert to camelCase: tax -> taxApprover, cost_control -> costControlApprover
            $camelLevel = lcfirst(str_replace('_', '', ucwords($level, '_')));
            $approverRelation = $camelLevel . 'Approver';

            $approvalChain[] = [
                'level' => $level,
                'label' => ucwords(str_replace('_', ' ', $level)),
                'status' => $paymentRequest->{"{$level}_status"},
                'approver_name' => $paymentRequest->{$approverRelation}?->nama,
                'approved_at' => $paymentRequest->{"{$level}_approved_at"}?->toIso8601String(),
                'notes' => $paymentRequest->{"{$level}_notes"},
            ];
        }

        return response()->json([
            'payment_request' => [
                'id' => $paymentRequest->id,
                'pr_number' => $paymentRequest->pr_number,
                'date' => $paymentRequest->date?->format('Y-m-d'),
                'subject' => $paymentRequest->subject,
                'description' => $paymentRequest->description,
                'amount' => $paymentRequest->amount,
                'status' => $paymentRequest->status,
                'paid_to' => $paymentRequest->paid_to,
                'bank_name' => $paymentRequest->bank_name,
                'bank_account' => $paymentRequest->bank_account,
                'notes' => $paymentRequest->notes,
                'requester_name' => $paymentRequest->requestedBy?->nama,
                'requester_nik' => $paymentRequest->requestedBy?->nik,
                'department_name' => $paymentRequest->department?->name,
                'company_name' => $paymentRequest->company?->name,
                'location_name' => $paymentRequest->workLocation?->name,
                'items' => $paymentRequest->items->map(fn($item) => [
                    'id' => $item->id,
                    'description' => $item->description,
                    'unit' => $item->unit,
                    'qty' => $item->qty,
                    'price' => $item->price,
                    'amount' => $item->amount,
                ]),
                'approval_chain' => $approvalChain,
                'created_at' => $paymentRequest->created_at?->toIso8601String(),
            ],
        ]);
    }

    /**
     * Get form data for creating a PR.
     * GET /api/payment-requests/form-data
     */
    public function formData()
    {
        $defaultSubjects = [
            'Cicilan Mobil', 'THR Natal', 'BPJS Kesehatan', 'Lembur', 'Gaji',
            'Perjalanan Dinas', 'Pembelian Inventaris', 'Biaya Operasional', 'Lain-lain'
        ];
        $pastSubjects = PaymentRequest::distinct()->pluck('subject')->toArray();
        $allSubjects = collect(array_merge($defaultSubjects, $pastSubjects))->unique()->sort()->values()->toArray();

        return response()->json([
            'companies' => WorkLocation::all(['id', 'name']),
            'departments' => Department::all(['id', 'name']),
            'working_locations' => \App\Models\WorkingLocation::all(['id', 'name']),
            'subjects' => $allSubjects,
            'banks' => [
                'Bank Mandiri', 'BCA', 'BRI', 'BNI', 'BSI', 'CIMB Niaga',
                'Danamon', 'Permata', 'OCBC NISP', 'Maybank', 'Panin',
                'BTN', 'Bank DKI', 'Bank Jatim', 'Bank Jabar Banten', 'Mega', 'Lainnya'
            ],
        ]);
    }

    /**
     * Create a payment request with items and attachments.
     * POST /api/payment-requests
     */
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
            'bank_account' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
            'attachments' => 'nullable|array',
            'attachments.*' => 'nullable|file|max:10240',
            'items' => 'required|string', // JSON string from mobile
        ]);

        $employee = $request->user()->employee;
        if (!$employee) {
            return response()->json(['message' => 'Akun tidak terhubung dengan data karyawan.'], 404);
        }

        if (!$employee->signature) {
            return response()->json(['message' => 'Silakan atur tanda tangan di profil Anda sebelum membuat Payment Request.'], 422);
        }

        // Parse items from JSON string
        $items = json_decode($validated['items'], true);
        if (!is_array($items) || count($items) < 1) {
            return response()->json(['message' => 'Minimal 1 item harus diisi.'], 422);
        }

        // Calculate total amount
        $totalAmount = collect($items)->sum(function ($item) {
            return ($item['qty'] ?? 0) * ($item['price'] ?? 0);
        });

        $pr = DB::transaction(function () use ($validated, $request, $employee, $totalAmount, $items) {
            $company = WorkLocation::find($validated['company_id']);
            $dept = Department::find($validated['department_id']);
            $workingLocation = \App\Models\WorkingLocation::find($validated['working_location_id']);

            $prNumber = $this->generatePrNumber($company, $dept, $workingLocation, $validated['date']);

            $pr = PaymentRequest::create([
                'date' => $validated['date'],
                'company_id' => $validated['company_id'],
                'working_location_id' => $validated['working_location_id'],
                'department_id' => $validated['department_id'],
                'subject' => $validated['subject'],
                'description' => $validated['description'],
                'paid_to' => $validated['paid_to'],
                'bank_name' => $validated['bank_name'],
                'bank_account' => $validated['bank_account'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'amount' => $totalAmount,
                'pr_number' => $prNumber,
                'status' => 'pending',
                'requested_by_id' => $employee->id,
                'requested_at' => now(),
                'requester_signature_snapshot' => $employee->signature,
                'tax_status' => 'pending',
            ]);

            // Check if Head Branch approver exists
            $headBranchApproverExists = Employee::where('work_location_id', $validated['company_id'])
                ->whereHas('user.permissions', function ($q) {
                    $q->where('slug', 'pr.approve.head_branch');
                })->exists();

            if (!$headBranchApproverExists) {
                $pr->update([
                    'head_branch_status' => 'skipped',
                    'head_branch_notes' => 'Auto-skipped: No Head Branch / General Manager approver found for this location.',
                ]);
            }

            // Create items
            foreach ($items as $itemData) {
                $itemAmount = ($itemData['qty'] ?? 0) * ($itemData['price'] ?? 0);
                $pr->items()->create([
                    'description' => $itemData['description'] ?? '',
                    'unit' => $itemData['unit'] ?? 'pcs',
                    'qty' => $itemData['qty'] ?? 1,
                    'price' => $itemData['price'] ?? 0,
                    'amount' => $itemAmount,
                ]);
            }

            // Handle file attachments
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

        // Notify first level approvers (Tax)
        $this->notifyNextApprovers($pr, 'tax');

        return response()->json([
            'message' => 'Payment Request berhasil dibuat.',
            'payment_request' => $pr->load(['items', 'requestedBy']),
        ], 201);
    }

    /**
     * Approve a payment request.
     * POST /api/payment-requests/{paymentRequest}/approve
     */
    public function approve(Request $request, PaymentRequest $paymentRequest)
    {
        $level = $this->getCurrentApprovalLevel($paymentRequest);
        if (!$level) {
            return response()->json(['message' => 'Payment Request ini sudah sepenuhnya disetujui atau ditolak.'], 422);
        }

        $user = $request->user();
        if (!$user->isAdmin() && !$user->hasPermission("pr.approve.{$level}")) {
            return response()->json(['message' => "Anda tidak memiliki izin untuk menyetujui sebagai {$level}."], 403);
        }

        $employee = $user->employee;
        if (!$employee || !$employee->signature) {
            return response()->json(['message' => 'Silakan atur tanda tangan di profil sebelum menyetujui.'], 422);
        }

        $paymentRequest->update([
            "{$level}_status" => 'approved',
            "{$level}_approver_id" => $employee->id,
            "{$level}_approved_at" => now(),
            "{$level}_notes" => $request->notes,
            "{$level}_signature_snapshot" => $employee->signature,
        ]);

        // Check next level
        $nextLevel = $this->getCurrentApprovalLevel($paymentRequest);

        // Auto-skip Head Branch if no approver
        if ($nextLevel === 'head_branch') {
            $approver = Employee::where('work_location_id', $paymentRequest->company_id)
                ->whereHas('user.permissions', fn($q) => $q->where('slug', 'pr.approve.head_branch'))
                ->first();
            if (!$approver) {
                $paymentRequest->update([
                    'head_branch_status' => 'skipped',
                    'head_branch_notes' => 'Auto-skipped: No Head Branch approver found.',
                ]);
                $nextLevel = $this->getCurrentApprovalLevel($paymentRequest);
            }
        }

        if (!$nextLevel) {
            $paymentRequest->update(['status' => 'approved']);
            $paymentRequest->requestedBy->user?->notify(new PaymentRequestNotification($paymentRequest, 'approved'));
        } else {
            $paymentRequest->update([
                'status' => 'partially_approved',
                "{$nextLevel}_status" => 'pending',
            ]);
            $this->notifyNextApprovers($paymentRequest, $nextLevel);
        }

        return response()->json([
            'message' => "Payment Request disetujui di level {$level}.",
            'payment_request' => $paymentRequest->fresh(),
        ]);
    }

    /**
     * Reject a payment request.
     * POST /api/payment-requests/{paymentRequest}/reject
     */
    public function reject(Request $request, PaymentRequest $paymentRequest)
    {
        $level = $this->getCurrentApprovalLevel($paymentRequest);
        if (!$level) {
            return response()->json(['message' => 'Payment Request ini sudah sepenuhnya disetujui atau ditolak.'], 422);
        }

        $user = $request->user();
        if (!$user->isAdmin() && !$user->hasPermission("pr.approve.{$level}")) {
            return response()->json(['message' => "Anda tidak memiliki izin untuk menolak sebagai {$level}."], 403);
        }

        $paymentRequest->update([
            "{$level}_status" => 'rejected',
            "{$level}_approver_id" => $user->employee?->id,
            "{$level}_approved_at" => now(),
            "{$level}_notes" => $request->notes,
            'status' => 'rejected',
        ]);

        $paymentRequest->requestedBy->user?->notify(new PaymentRequestNotification($paymentRequest, 'rejected', null, $request->notes));

        return response()->json([
            'message' => "Payment Request ditolak di level {$level}.",
            'payment_request' => $paymentRequest->fresh(),
        ]);
    }

    private function generatePrNumber(WorkLocation $company, Department $dept, \App\Models\WorkingLocation $workingLocation, string $dateString): string
    {
        $companyCode = strtoupper($company->code ?? 'BBB');
        $deptCode = strtoupper($dept->code ?? 'GA');
        $locationCode = strtoupper(substr(str_replace(' ', '', $workingLocation->name), 0, 3));

        $date = \Carbon\Carbon::parse($dateString);
        $year = $date->year;
        $month = $date->month;

        $monthRomawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
        $romawi = $monthRomawi[$month - 1];

        $count = PaymentRequest::whereYear('date', $year)->count() + 1;
        $formattedCount = str_pad($count, 3, '0', STR_PAD_LEFT);

        return "PR-{$companyCode}.{$deptCode}-{$locationCode}-{$formattedCount}-{$romawi}-{$year}";
    }

    private function getCurrentApprovalLevel(PaymentRequest $pr): ?string
    {
        $levels = ['tax', 'accounting', 'cost_control', 'head_branch', 'director', 'commissioner', 'advisor', 'finance'];

        foreach ($levels as $level) {
            $status = $pr->{"{$level}_status"};
            if ($status === 'pending') return $level;
        }

        $allPrevApproved = true;
        foreach ($levels as $level) {
            $status = $pr->{"{$level}_status"};
            if ($status === null && $allPrevApproved) {
                return $level;
            }
            if ($status !== 'approved' && $status !== 'skipped') {
                $allPrevApproved = false;
            }
        }

        return null;
    }

    private function notifyNextApprovers(PaymentRequest $pr, string $nextLevel)
    {
        $eligibleUsers = User::whereHas('permissions', function ($q) use ($nextLevel) {
            $q->where('slug', "pr.approve.{$nextLevel}");
        })->get();

        if ($eligibleUsers->isEmpty()) return;

        $approvers = $eligibleUsers->filter(fn($user) => $user->employee?->working_location_id === $pr->working_location_id);

        if ($approvers->isEmpty()) {
            $approvers = $eligibleUsers->filter(fn($user) => $user->employee?->work_location_id === $pr->company_id);
        }

        if ($approvers->isEmpty()) {
            $approvers = $eligibleUsers;
        }

        foreach ($approvers as $approver) {
            $approver->notify(new PaymentRequestNotification($pr, 'pending', ucfirst($nextLevel)));
        }
    }
}
