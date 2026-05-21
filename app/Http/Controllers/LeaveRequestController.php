<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Notifications\LeaveRequestNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LeaveRequestController extends Controller
{
    /**
     * List leave requests based on user role:
     *  - staff: own requests only
     *  - supervisor: own + same department staff
     *  - manager: own + same department
     *  - admin: all
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $employee = $user->employee;

        if (!$employee) {
            return Inertia::render('leaves/index', [
                'leaveRequests' => LeaveRequest::whereRaw('1=0')->paginate(15),
                'filters' => $request->only('status'),
                'pendingCount' => 0,
                'userRole' => $user->role,
                'currentEmployeeId' => null,
                'pageType' => 'personal',
            ]);
        }

        $query = LeaveRequest::with([
            'employee.department',
            'employee.position',
            'leaveType',
            'approvedBySupervisor',
            'approvedByManager',
        ])
        ->where('employee_id', $employee->id)
        ->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('leave_type_id')) {
            $query->where('leave_type_id', $request->leave_type_id);
        }

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('alasan', 'like', '%' . $request->search . '%')
                  ->orWhereHas('leaveType', fn($sq) => $sq->where('name', 'like', '%' . $request->search . '%'));
            });
        }

        if ($request->filled('date_from')) {
            $query->where('tanggal_mulai', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('tanggal_mulai', '<=', $request->date_to);
        }

        return Inertia::render('leaves/index', [
            'leaveRequests' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only(['status', 'search', 'date_from', 'date_to', 'leave_type_id']),
            'leaveTypes' => LeaveType::all(),
            'pendingCount' => 0, // No badge in personal view to avoid confusion
            'userRole' => $user->role,
            'currentEmployeeId' => $employee->id,
            'pageType' => 'personal',
        ]);
    }

    /**
     * Management view for approvers and Admins
     */
    public function management(Request $request)
    {
        $user = Auth::user();
        $employee = $user->employee;

        $query = LeaveRequest::with([
            'employee.department',
            'employee.position',
            'leaveType',
            'approvedBySupervisor',
            'approvedByManager',
        ])->latest();

        if ($user->isAdmin() || $user->hasPermission('leave.view_others') || $user->hasPermission('leave.approve_all')) {
            // Admin or HR with view_others sees all
        } elseif ($employee) {
            $query->where(function ($q) use ($user, $employee) {
                // Focus ONLY on what they need to approve or have approved
                
                // 1. Requests from subordinates (First Approval)
                if ($user->hasPermission('leave.first_approval')) {
                    $q->orWhereHas('employee', function ($sq) use ($employee) {
                        $sq->where('report_to', $employee->id);
                    });
                }

                // 2. Requests pending second approval
                if ($user->hasPermission('leave.second_approval')) {
                    $q->orWhere(function($sq) use ($employee) {
                        $sq->where('status', 'partially_approved')
                           ->whereHas('employee', fn($ssq) => $ssq->where('manager_id', $employee->id));
                    });
                }

                // 3. Involvement History
                $q->orWhere('approved_by_supervisor_id', $employee->id)
                  ->orWhere('approved_by_manager_id', $employee->id);

                // Global History Permission
                if ($user->hasPermission('leave.view_history')) {
                    $q->orWhereIn('status', ['approved', 'rejected', 'cancelled']);
                }
            });
        } else {
            $query->whereRaw('1=0');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('leave_type_id')) {
            $query->where('leave_type_id', $request->leave_type_id);
        }

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->whereHas('employee', function($sq) use ($request) {
                    $sq->where('nama', 'like', '%' . $request->search . '%')
                       ->orWhere('nik', 'like', '%' . $request->search . '%');
                })->orWhere('alasan', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('date_from')) {
            $query->where('tanggal_mulai', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('tanggal_mulai', '<=', $request->date_to);
        }

        $attendancesPending = 0;
        if ($user->isAdmin() || $user->hasPermission('leave.first_approval') || $user->hasPermission('leave.second_approval') || $user->hasPermission('leave.approve_all')) {
            $pendingQ = LeaveRequest::query();
            
            if (!$user->isAdmin()) {
                $pendingQ->where(function($q) use ($user, $employee) {
                    if ($user->hasPermission('leave.first_approval')) {
                        $q->orWhere(function($sq) use ($employee) {
                            $sq->where('status', 'pending')
                               ->whereHas('employee', fn($ssq) => $ssq->where('report_to', $employee->id));
                        });
                    }
                    if ($user->hasPermission('leave.second_approval')) {
                        $q->orWhere(function($sq) use ($employee) {
                            $sq->where('status', 'partially_approved')
                               ->whereHas('employee', fn($ssq) => $ssq->where('manager_id', $employee->id));
                        });
                    }
                    if ($user->hasPermission('leave.approve_all')) {
                        $q->orWhereIn('status', ['pending', 'partially_approved']);
                    }
                });
            } else {
                $pendingQ->whereIn('status', ['pending', 'partially_approved']);
            }
            
            $attendancesPending = $pendingQ->count();
        }

        return Inertia::render('leaves/index', [
            'leaveRequests' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only(['status', 'search', 'date_from', 'date_to', 'leave_type_id']),
            'leaveTypes' => LeaveType::all(),
            'pendingCount' => $attendancesPending,
            'userRole' => $user->role,
            'currentEmployeeId' => $employee?->id,
            'pageType' => 'management',
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        $employee = $user->employee;

        $leaveTypes = LeaveType::all();

        // Get leave balances for the current year
        $balances = [];
        if ($employee) {
            $balances = LeaveBalance::where('employee_id', $employee->id)
                ->where('year', now()->year)
                ->get()
                ->keyBy('leave_type_id');
        }

        // Get employees in same department for "Yang Menggantikan"
        $departmentEmployees = [];
        if ($employee) {
            $departmentEmployees = Employee::where('department_id', $employee->department_id)
                ->where('id', '!=', $employee->id)
                ->where('is_active', true)
                ->select('id', 'nama', 'nik')
                ->get();
        }

        return Inertia::render('leaves/create', [
            'leaveTypes' => $leaveTypes,
            'balances' => $balances,
            'departmentEmployees' => $departmentEmployees,
            'employee' => $employee,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $employee = $user->employee;

        if (!$employee) {
            return back()->withErrors(['error' => 'Akun Anda belum terhubung dengan data karyawan.']);
        }

        $validated = $request->validate([
            'leave_type_id' => 'required|exists:leave_types,id',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'alasan' => 'required|string|max:1000',
            'yang_menggantikan' => 'nullable|string|max:255',
            'attachment' => 'nullable|file|max:5120',
        ]);

        // Check for overlapping requests
        $overlap = LeaveRequest::where('employee_id', $employee->id)
            ->whereIn('status', ['pending', 'partially_approved', 'approved'])
            ->where(function ($q) use ($validated) {
                $q->where(function ($q) use ($validated) {
                    $q->where('tanggal_mulai', '<=', $validated['tanggal_mulai'])
                        ->where('tanggal_selesai', '>=', $validated['tanggal_mulai']);
                })->orWhere(function ($q) use ($validated) {
                    $q->where('tanggal_mulai', '<=', $validated['tanggal_selesai'])
                        ->where('tanggal_selesai', '>=', $validated['tanggal_selesai']);
                })->orWhere(function ($q) use ($validated) {
                    $q->where('tanggal_mulai', '>=', $validated['tanggal_mulai'])
                        ->where('tanggal_selesai', '<=', $validated['tanggal_selesai']);
                });
            })->exists();

        if ($overlap) {
            return back()->withErrors(['tanggal_mulai' => "Anda sudah memiliki pengajuan cuti/izin pada tanggal tersebut yang sedang diproses atau sudah disetujui."]);
        }

        // Handle file upload
        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('leave-attachments', 'public');
        }

        // Calculate jumlah_hari
        $start = \Carbon\Carbon::parse($validated['tanggal_mulai']);
        $end = \Carbon\Carbon::parse($validated['tanggal_selesai']);
        $calculatedJumlahHari = $start->diffInDays($end) + 1;
        
        $jumlahHari = $request->input('jumlah_hari', $calculatedJumlahHari);

        // Validation: Check max_days for the leave type
        $leaveType = LeaveType::find($validated['leave_type_id']);
        if ($leaveType->name === 'Cuti Tahunan') {
            $balance = LeaveBalance::where('employee_id', $employee->id)
                ->where('leave_type_id', $leaveType->id)
                ->where('year', now()->year)
                ->first();
            
            $remaining = $balance ? $balance->remaining_days : 0;
            if ($jumlahHari > $remaining) {
                return back()->withErrors(['jumlah_hari' => "Sisa cuti tahunan Anda tidak mencukupi (Sisa: {$remaining} hari)."]);
            }
        } elseif ($leaveType->max_days > 0) {
            if ($jumlahHari > $leaveType->max_days) {
                return back()->withErrors(['jumlah_hari' => "Maksimal pengambilan cuti {$leaveType->name} adalah {$leaveType->max_days} hari."]);
            }
        }

        $leave = LeaveRequest::create([
            'employee_id' => $employee->id,
            'leave_type_id' => $validated['leave_type_id'],
            'tanggal_mulai' => $validated['tanggal_mulai'],
            'tanggal_selesai' => $validated['tanggal_selesai'],
            'jumlah_hari' => $jumlahHari,
            'alasan' => $validated['alasan'],
            'yang_menggantikan' => $validated['yang_menggantikan'] ?? null,
            'attachment' => $attachmentPath,
            'status' => 'pending',
            'supervisor_status' => 'pending',
            'manager_status' => 'pending',
        ]);

        // Notify Supervisor
        $supervisor = $employee->reportTo;
        if ($supervisor && $supervisor->user) {
            $supervisor->user->notify(new LeaveRequestNotification($leave, 'submitted'));
        }

        return redirect()->route('leaves.index')->with('success', 'Pengajuan cuti berhasil dikirim.');
    }

    public function show(LeaveRequest $leave)
    {
        $leave->load(['employee.department', 'employee.position', 'leaveType', 'approvedBySupervisor', 'approvedByManager']);

        return Inertia::render('leaves/show', [
            'leaveRequest' => $leave,
            'userRole' => Auth::user()->role,
            'currentEmployeeId' => Auth::user()->employee?->id,
            'canFirstApproval' => Auth::user()->hasPermission('leave.first_approval') && Auth::user()->employee?->id === $leave->employee->report_to,
            'canSecondApproval' => Auth::user()->hasPermission('leave.second_approval'),
            'isAdmin' => Auth::user()->isAdmin(),
        ]);
    }

    /**
     * Approve a leave request at the appropriate level.
     * Hierarchy:
     *  - Staff submits → Supervisor/Manager of same dept approves (supervisor_status)
     *  - Then Manager/Director approves (manager_status)
     *  - If submitter is Supervisor → skip to manager_status
     *  - If submitter is Manager → directly approve
     *  - Admin can approve at any level
     */
    public function approve(Request $request, LeaveRequest $leave)
    {
        $user = Auth::user();
        $approver = $user->employee;

        if (!$approver) {
            return back()->withErrors(['error' => 'Akun Anda belum terhubung dengan data karyawan.']);
        }

        $submitter = $leave->employee;

        // Step 1: First Approval (Report To)
        if ($leave->status === 'pending' && $leave->supervisor_status === 'pending') {
            // Is this the right person?
            $isReportTo = $approver->id === $submitter->report_to;
            $hasPerm = $user->hasPermission('leave.first_approval');

            if (!$user->isAdmin() && !$user->hasPermission('leave.approve_all') && (!$isReportTo || !$hasPerm)) {
                return back()->withErrors(['error' => 'Anda tidak memiliki wewenang untuk memberikan persetujuan pertama pada pengajuan ini.']);
            }

            $isSickLeave = $leave->leaveType->name === 'Cuti Sakit';
            $isSingleApprover = empty($submitter->manager_id) || $submitter->manager_id === $submitter->report_to;

            if ($isSickLeave || $isSingleApprover) {
                $leave->update([
                    'supervisor_status' => 'approved',
                    'approved_by_supervisor_id' => $approver->id,
                    'supervisor_approved_at' => now(),
                    'manager_status' => 'approved',
                    'approved_by_manager_id' => $approver->id,
                    'manager_approved_at' => now(),
                    'supervisor_notes' => $request->input('notes'),
                    'status' => 'approved',
                ]);

                // Notify Employee (Final Approval)
                if ($submitter->user) {
                    $submitter->user->notify(new LeaveRequestNotification($leave, 'approved'));
                }
            } else {
                $leave->update([
                    'supervisor_status' => 'approved',
                    'approved_by_supervisor_id' => $approver->id,
                    'supervisor_approved_at' => now(),
                    'supervisor_notes' => $request->input('notes'),
                    'status' => 'partially_approved',
                ]);

                // Notify Manager for second approval
                $manager = $submitter->manager;
                if ($manager && $manager->user) {
                    $manager->user->notify(new LeaveRequestNotification($leave, 'partially_approved'));
                }
            }
        } 
        // Step 2: Second Approval
        elseif ($leave->status === 'partially_approved' && $leave->manager_status === 'pending') {
            $isManager = $approver->id === $submitter->manager_id;
            $hasPerm = $user->hasPermission('leave.second_approval');

            if (!$user->isAdmin() && !$user->hasPermission('leave.approve_all') && (!$isManager || !$hasPerm)) {
                if (!$submitter->manager_id) {
                    return back()->withErrors(['error' => 'Karyawan ini belum memiliki Atasan Tahap 2 yang ditetapkan. Harap hubungi HR untuk menggunakan fitur persetujuan ini.']);
                }
                return back()->withErrors(['error' => 'Anda tidak memiliki wewenang untuk memberikan persetujuan kedua.']);
            }

            $leave->update([
                'manager_status' => 'approved',
                'approved_by_manager_id' => $approver->id,
                'manager_approved_at' => now(),
                'manager_notes' => $request->input('notes'),
                'status' => 'approved',
            ]);

            // Notify Employee (Final Approval)
            if ($submitter->user) {
                $submitter->user->notify(new LeaveRequestNotification($leave, 'approved'));
            }
        } else {
            // If admin wants to force approve everything at once
            if ($user->isAdmin()) {
                $leave->update([
                    'supervisor_status' => 'approved',
                    'approved_by_supervisor_id' => $approver->id,
                    'supervisor_approved_at' => now(),
                    'manager_status' => 'approved',
                    'approved_by_manager_id' => $approver->id,
                    'manager_approved_at' => now(),
                    'status' => 'approved',
                ]);
            }
        }

        // If fully approved and it's Cuti Tahunan, decrement balance
        if ($leave->status === 'approved') {
            $leaveType = $leave->leaveType;
            if ($leaveType->name === 'Cuti Tahunan') {
                $service = app(\App\Services\LeaveBalanceService::class);
                $balance = LeaveBalance::where('employee_id', $leave->employee_id)
                    ->where('leave_type_id', $leaveType->id)
                    ->where('year', now()->year)
                    ->first();

                if (!$balance) {
                    $entitlement = $service->calculateAnnualLeaveEntitlement($leave->employee, now()->year);
                    $balance = LeaveBalance::create([
                        'employee_id' => $leave->employee_id,
                        'leave_type_id' => $leaveType->id,
                        'year' => now()->year,
                        'total_days' => $entitlement,
                        'used_days' => 0,
                    ]);
                }
                
                $balance->increment('used_days', $leave->jumlah_hari);
            }
        }

        return back()->with('success', 'Pengajuan cuti berhasil disetujui.');
    }

    public function reject(Request $request, LeaveRequest $leave)
    {
        $user = Auth::user();
        $approver = $user->employee;

        if (!$approver) {
            return back()->withErrors(['error' => 'Akun Anda belum terhubung dengan data karyawan.']);
        }

        $submitter = $leave->employee;
        $notes = $request->input('notes', '');

        // If admin, we can reject immediately
        if ($user->isAdmin()) {
            $leave->update([
                'status' => 'rejected',
                'manager_status' => 'rejected',
                'approved_by_manager_id' => $approver->id,
                'manager_approved_at' => now(),
                'manager_notes' => $notes,
            ]);

            // Notify Employee
            if ($submitter->user) {
                $submitter->user->notify(new LeaveRequestNotification($leave, 'rejected'));
            }
            return back()->with('success', 'Pengajuan cuti telah ditolak oleh Admin.');
        }

        if ($leave->status === 'pending') {
            // First level check
            $isReportTo = $approver->id === $submitter->report_to;
            $hasPerm = $user->hasPermission('leave.first_approval');

            if (!$user->isAdmin() && !$user->hasPermission('leave.approve_all') && (!$isReportTo || !$hasPerm)) {
                 return back()->withErrors(['error' => 'Anda tidak memiliki wewenang untuk menolak pengajuan ini.']);
            }

            $leave->update([
                'supervisor_status' => 'rejected',
                'approved_by_supervisor_id' => $approver->id,
                'supervisor_approved_at' => now(),
                'supervisor_notes' => $notes,
                'status' => 'rejected',
            ]);

            // Notify Employee
            if ($submitter->user) {
                $submitter->user->notify(new LeaveRequestNotification($leave, 'rejected'));
            }
        } elseif ($leave->status === 'partially_approved') {
            $isManager = $approver->id === $submitter->manager_id;
            $hasPerm = $user->hasPermission('leave.second_approval');
            
            if (!$user->isAdmin() && !$user->hasPermission('leave.approve_all') && (!$isManager || !$hasPerm)) {
                if (!$submitter->manager_id) {
                    return back()->withErrors(['error' => 'Karyawan ini belum memiliki Atasan Tahap 2 yang ditetapkan. Harap hubungi HR.']);
                }
                return back()->withErrors(['error' => 'Anda tidak memiliki wewenang untuk menolak pengajuan ini pada tahap kedua.']);
            }

            $leave->update([
                'manager_status' => 'rejected',
                'approved_by_manager_id' => $approver->id,
                'manager_approved_at' => now(),
                'manager_notes' => $notes,
                'status' => 'rejected',
            ]);

            // Notify Employee
            if ($submitter->user) {
                $submitter->user->notify(new LeaveRequestNotification($leave, 'rejected'));
            }
        }

        return back()->with('success', 'Pengajuan cuti telah ditolak.');
    }

    /**
     * Generate a WhatsApp deep-link URL for the next approver.
     */
    public function whatsappUrl(LeaveRequest $leave)
    {
        $leave->load(['employee.department', 'employee.user']);
        $submitter = $leave->employee;

        // Find the next approver
        $approver = null;

        if ($leave->status === 'pending') {
            // Need the Report To person
            $approver = $submitter->reportTo;

            // Check if they have the permission
            if ($approver && $approver->user && !$approver->user->hasPermission('leave.first_approval') && !$approver->user->isAdmin()) {
                 // They don't have permission! Maybe notify admin?
            }
        } elseif ($leave->status === 'partially_approved') {
            // Need the appointed manager
            $approver = $submitter->manager;
            
            if (!$approver) {
                return redirect()->back()->with('error', 'Karyawan ini belum memiliki Atasan Tahap 2 yang ditetapkan untuk persetujuan.');
            }
        }

        if (!$approver || !$approver->no_telpon_1) {
            return redirect()->back()->with('error', 'Tidak dapat menemukan atasan atau nomor telepon atasan.');
        }

        // Format phone: remove leading 0, add 62
        $phone = $approver->no_telpon_1;
        $phone = preg_replace('/[^0-9]/', '', $phone);
        if (str_starts_with($phone, '0')) {
            $phone = '62' . substr($phone, 1);
        } elseif (!str_starts_with($phone, '62')) {
            $phone = '62' . $phone;
        }

        $leaveType = $leave->leaveType->name ?? 'Cuti';
        $deptName = $submitter->department->name ?? '-';
        $startDate = $leave->tanggal_mulai->format('d/m/Y');
        $endDate = $leave->tanggal_selesai->format('d/m/Y');
        $status = ucfirst($leave->status);
        $comment = $leave->status === 'partially_approved' ? ($leave->supervisor_notes ?: '-') : '-';
        $approverName = $approver->nama;

        $message = "Dear Mr/Mrs {$approverName}\n\n" .
                  "Silahkan diproses {$leaveType} untuk :\n\n" .
                  "Nama = {$submitter->nama}\n" .
                  "Department = {$deptName}\n" .
                  "Jenis Izin = {$leaveType}\n" .
                  "Dari Tanggal = {$startDate}\n" .
                  "Hingga Tanggal = {$endDate}\n" .
                  "Durasi = {$leave->jumlah_hari} hari\n" .
                  "Alasan = {$leave->alasan}\n" .
                  "Status = {$status}\n" .
                  "Comment = {$comment}\n\n" .
                  "Silahkan klik link dibawah ini untuk membuka aplikasi anda.\n\n" .
                  "https://hris.bangunbejanabaja.com/leaves/{$leave->id}";

        $url = 'https://wa.me/' . $phone . '?text=' . urlencode($message);

        return redirect()->away($url);
    }
}
