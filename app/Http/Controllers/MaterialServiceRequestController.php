<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Employee;
use App\Models\MaterialServiceRequest;
use App\Models\MaterialServiceRequestAttachment;
use App\Models\MaterialServiceRequestItem;
use App\Models\WorkLocation;
use App\Models\WorkingLocation;
use App\Models\BudgetItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class MaterialServiceRequestController extends Controller
{
    private const SUBJECT_CHART = [
        'Permanent' => 'msr.approve_procurement',
        'Consumable' => 'msr.approve_procurement',
        'Others' => 'msr.approve_ga',
        'Tools' => 'msr.approve_ga',
        'Equipment' => 'msr.approve_ga',
        'Jasa - Subcon' => 'msr.approve_procurement',
        'Jasa Pemeliharaan' => 'msr.approve_procurement',
        'Jasa Logistik' => 'msr.approve_procurement',
        'Jasa - Lainnya' => 'msr.approve_procurement',
        'Sewa' => 'msr.approve_ga',
        'APD / Seragam / HSE' => 'msr.approve_hrd',
        'Asset' => 'msr.approve_ga',
    ];

    public function index(Request $request)
    {
        $user = $request->user();
        $employee = $user->employee;

        $query = MaterialServiceRequest::with(['requestedBy', 'department', 'company', 'workLocation'])
            ->when($request->search, function ($q, $search) {
                $q->where('msr_number', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%");
            });

        // Visibility logic mirrored from PR
        if (!$user->isAdmin() && !$user->hasPermission('msr.view_all')) {
            $approvalPermissions = [
                'msr.approve_supervisor' => 'supervisor',
                'msr.approve_manager' => 'manager',
                'msr.approve_hrd' => 'pr_maker',
                'msr.approve_procurement' => 'pr_maker',
                'msr.approve_ga' => 'pr_maker',
                'msr.approve_finance' => 'finance',
            ];

            $activeApprovals = [];
            foreach ($approvalPermissions as $perm => $level) {
                if ($user->hasPermission($perm)) {
                    $activeApprovals[] = $level;
                }
            }

            $query->where(function ($q) use ($employee, $activeApprovals) {
                if ($employee) {
                    $q->where('requested_by_id', $employee->id);
                }
                foreach ($activeApprovals as $level) {
                    $q->orWhere("{$level}_status", 'pending');
                }
            });
        }

        $msrs = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('msr/index', [
            'msrs' => $msrs,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        if (!request()->user()->isAdmin() && !request()->user()->hasPermission('msr.create')) {
            return redirect()->route('msr.index')->withErrors(['error' => 'No permission to create MSR.']);
        }

        return Inertia::render('msr/form', [
            'companies' => WorkLocation::all(),
            'departments' => Department::all(),
            'workingLocations' => WorkingLocation::all(),
            'subjects' => array_keys(self::SUBJECT_CHART),
            'materialUnits' => MaterialServiceRequestItem::distinct()->pluck('unit')->toArray() ?: ['Pcs', 'Mtr', 'Roll', 'Set'],
            'materialNames' => MaterialServiceRequestItem::distinct()->pluck('material')->toArray() ?: [],
            'budgetItems' => BudgetItem::select(['id', 'item_code', 'nama_budget', 'working_location_id', 'msr_unit'])->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'company_id' => 'required|exists:work_locations,id',
            'work_location_id' => 'required|exists:working_locations,id',
            'department_id' => 'required|exists:departments,id',
            'subject' => 'required|in:' . implode(',', array_keys(self::SUBJECT_CHART)),
            'description' => 'required|string',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.category' => 'required|in:Material,Jasa',
            'items.*.budget_item_id' => 'nullable|exists:budget_items,id',
            'items.*.item_name' => 'required|string',
            'items.*.qty' => 'required|numeric|min:0.01',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.unit' => 'required|string',
            'items.*.material' => 'nullable|string',
            'items.*.size' => 'nullable|string',
            'items.*.keterangan' => 'nullable|string',
            'attachments' => 'nullable|array',
            'attachments.*' => 'nullable|file|max:10240',
        ]);

        $employee = $request->user()->employee;
        if (!$employee || !$employee->signature) {
            return redirect()->back()->withErrors(['error' => 'Signature required.']);
        }

        $msr = DB::transaction(function () use ($validated, $request, $employee) {
            $company = WorkLocation::find($validated['company_id']);
            $dept = Department::find($validated['department_id']);
            $location = WorkingLocation::find($validated['work_location_id']);
            
            $msrNumber = $this->generateMsrNumber($company, $dept, $location, $validated['date']);
            $totalAmount = collect($validated['items'])->sum(fn($i) => $i['qty'] * $i['price']);

            $msr = MaterialServiceRequest::create([
                ...collect($validated)->except(['items', 'attachments'])->toArray(),
                'msr_number' => $msrNumber,
                'total_amount' => $totalAmount,
                'requested_by_id' => $employee->id,
                'requested_at' => now(),
                'requester_signature_snapshot' => $employee->signature,
            ]);

            foreach ($validated['items'] as $item) {
                $msr->items()->create([
                    ...$item,
                    'total_price' => $item['qty'] * $item['price']
                ]);
            }

            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store('msr-attachments', 'public');
                    $msr->attachments()->create([
                        'file_path' => $path,
                        'file_name' => $file->getClientOriginalName(),
                    ]);
                }
            }

            return $msr;
        });

        return redirect()->route('msr.index')->with('success', 'MSR created successfully.');
    }

    public function show(MaterialServiceRequest $msr)
    {
        $msr->load(['requestedBy', 'department', 'company', 'workLocation', 'items', 'attachments',
            'supervisorApprover', 'managerApprover', 'prMakerApprover', 'financeApprover']);

        return Inertia::render('msr/show', [
            'msr' => $msr,
        ]);
    }

    public function approve(Request $request, MaterialServiceRequest $msr)
    {
        $level = $this->getCurrentLevel($msr);
        if (!$level) return redirect()->back()->withErrors(['error' => 'No pending approval.']);

        $perm = $this->getRequiredPermission($level, $msr);
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission($perm)) {
            return redirect()->back()->withErrors(['error' => "No permission to approve as {$level}."]);
        }

        $employee = $request->user()->employee;
        if (!$employee || !$employee->signature) {
            return redirect()->back()->withErrors(['error' => 'Signature required.']);
        }

        // Logic for Item Editing by Approver
        if ($request->has('items') && in_array($level, ['supervisor', 'manager', 'pr_maker'])) {
            $request->validate([
                'items' => 'required|array',
                'items.*.id' => 'required|exists:material_service_request_items,id',
                'items.*.qty' => 'required|numeric|min:0.01',
                'items.*.price' => 'required|numeric|min:0',
            ]);

            foreach ($request->items as $itemData) {
                $item = MaterialServiceRequestItem::find($itemData['id']);
                $item->update([
                    'qty' => $itemData['qty'],
                    'price' => $itemData['price'],
                    'total_price' => $itemData['qty'] * $itemData['price'],
                ]);
            }
            $msr->update(['total_amount' => $msr->items()->sum('total_price')]);
        }

        $msr->update([
            "{$level}_status" => 'approved',
            "{$level}_approver_id" => $employee->id,
            "{$level}_approved_at" => now(),
            "{$level}_notes" => $request->notes,
            "{$level}_signature_snapshot" => $employee->signature,
        ]);

        $next = $this->getCurrentLevel($msr);
        if (!$next) {
            $msr->update(['status' => 'approved']);
        } else {
            $msr->update(['status' => 'partially_approved']);
        }

        return redirect()->back()->with('success', 'MSR approved.');
    }

    public function reject(Request $request, MaterialServiceRequest $msr)
    {
        $level = $this->getCurrentLevel($msr);
        $perm = $this->getRequiredPermission($level, $msr);
        
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission($perm)) {
            return redirect()->back()->withErrors(['error' => "No permission."]);
        }

        $msr->update([
            "{$level}_status" => 'rejected',
            "{$level}_approver_id" => $request->user()->employee?->id,
            "{$level}_approved_at" => now(),
            "{$level}_notes" => $request->notes,
            'status' => 'rejected'
        ]);

        return redirect()->back()->with('success', 'MSR rejected.');
    }

    public function downloadPdf(MaterialServiceRequest $msr)
    {
        $msr->load(['requestedBy', 'department', 'company', 'workLocation', 'items', 'attachments',
            'supervisorApprover', 'managerApprover', 'prMakerApprover', 'financeApprover']);

        $pdf = Pdf::loadView('pdfs.msr-request', ['msr' => $msr]);
        $pdf->setPaper('a4', 'landscape');
        $safeFilename = str_replace('/', '-', $msr->msr_number);
        return $pdf->download("{$safeFilename}.pdf");
    }

    public function whatsappUrl(MaterialServiceRequest $msr)
    {
        $level = $this->getCurrentLevel($msr);
        if (!$level) return redirect()->back()->withErrors(['error' => 'No pending approval.']);

        $perm = $this->getRequiredPermission($level, $msr);
        $approverQuery = Employee::whereHas('user.permissions', fn($q) => $q->where('slug', $perm))
            ->where('work_location_id', $msr->company_id);
            
        $approver = (clone $approverQuery)->where('working_location_id', $msr->work_location_id)->first();
        
        if (!$approver) {
            $approver = $approverQuery->first();
        }

        if (!$approver || !$approver->no_telpon_1) {
            return redirect()->back()->withErrors(['error' => 'Approver contact not found.']);
        }

        $phone = $approver->no_telpon_1;
        if (str_starts_with($phone, '0')) $phone = '62' . substr($phone, 1);

        $message = "Dear {$approver->nama}\n" .
                   "Mohon dibantu approval untuk\n\n" .
                   "MSR No = *{$msr->msr_number}*\n" .
                   "Department = *{$msr->department->name}*\n" .
                   "Perusahaan = *{$msr->company->name}*\n" .
                   "Penempatan = *{$msr->workLocation->name}*\n" .
                   "Description = *{$msr->description}*\n\n" .
                   "Link: " . url("/msr/{$msr->id}");

        return Inertia::location("https://api.whatsapp.com/send?phone={$phone}&text=" . urlencode($message));
    }

    private function generateMsrNumber($company, $dept, $location, $dateString): string
    {
        $companyCode = strtoupper($company->code ?? 'BBB');
        $deptCode = strtoupper($dept->code ?? 'GA');
        $locationCode = strtoupper(substr(str_replace(' ', '', $location->name), 0, 3));
        $date = \Carbon\Carbon::parse($dateString);
        
        $year = $date->year;
        $month = $date->month;
        $monthRomawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
        $romawi = $monthRomawi[$month - 1];

        $count = MaterialServiceRequest::whereYear('date', $year)->count() + 1;
        $formattedCount = str_pad($count, 3, '0', STR_PAD_LEFT);

        return "MSR-{$companyCode}.{$deptCode}-{$locationCode}-{$formattedCount}-{$romawi}-{$year}";
    }

    private function getCurrentLevel(MaterialServiceRequest $msr): ?string
    {
        $levels = ['supervisor', 'manager', 'pr_maker', 'finance'];
        foreach ($levels as $level) {
            if ($msr->{"{$level}_status"} === 'pending') {
                $prevIndex = array_search($level, $levels) - 1;
                if ($prevIndex < 0 || $msr->{$levels[$prevIndex] . "_status"} === 'approved') {
                     return $level;
                }
            }
        }
        return null;
    }

    private function getRequiredPermission(string $level, MaterialServiceRequest $msr): string
    {
        return match($level) {
            'supervisor' => 'msr.approve_supervisor',
            'manager' => 'msr.approve_manager',
            'pr_maker' => self::SUBJECT_CHART[$msr->subject],
            'finance' => 'msr.approve_finance',
        };
    }
}
