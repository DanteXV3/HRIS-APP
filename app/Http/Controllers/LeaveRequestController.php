<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
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

        $query = LeaveRequest::with([
            'employee.department',
            'employee.position',
            'leaveType',
            'approvedBySupervisor',
            'approvedByManager',
        ])->latest();

        if ($user->role === 'admin') {
            // Admin sees all
        } elseif ($user->role === 'manager') {
            // Manager sees own department + own requests
            $query->whereHas('employee', function ($q) use ($employee) {
                $q->where('department_id', $employee->department_id);
            });
        } elseif ($user->role === 'supervisor') {
            // Supervisor sees own department
            $query->whereHas('employee', function ($q) use ($employee) {
                $q->where('department_id', $employee->department_id);
            });
        } else {
            // Staff sees only own
            $query->where('employee_id', $employee->id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $attendancesPending = 0;
        if (in_array($user->role, ['admin', 'manager', 'supervisor'])) {
            $pendingQ = LeaveRequest::where(function ($q) {
                $q->where('status', 'pending')
                  ->orWhere('status', 'partially_approved');
            });

            if ($user->role !== 'admin' && $employee) {
                $pendingQ->whereHas('employee', function ($q) use ($employee) {
                    $q->where('department_id', $employee->department_id);
                });
            }
            $attendancesPending = $pendingQ->count();
        }

        return Inertia::render('leaves/index', [
            'leaveRequests' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only('status'),
            'pendingCount' => $attendancesPending,
            'userRole' => $user->role,
            'currentEmployeeId' => $employee?->id,
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

        LeaveRequest::create([
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

        return redirect()->route('leaves.index')->with('success', 'Pengajuan cuti berhasil dikirim.');
    }

    public function show(LeaveRequest $leave)
    {
        $leave->load(['employee.department', 'employee.position', 'leaveType', 'approvedBySupervisor', 'approvedByManager']);

        return Inertia::render('leaves/show', [
            'leaveRequest' => $leave,
            'userRole' => Auth::user()->role,
            'currentEmployeeId' => Auth::user()->employee?->id,
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
        $submitterRole = $submitter->user?->role ?? 'staff';

        // Determine which level to approve
        if ($user->role === 'admin') {
            // Admin can fully approve
            $leave->update([
                'supervisor_status' => 'approved',
                'approved_by_supervisor_id' => $approver->id,
                'supervisor_approved_at' => now(),
                'manager_status' => 'approved',
                'approved_by_manager_id' => $approver->id,
                'manager_approved_at' => now(),
                'status' => 'approved',
            ]);
        } elseif ($leave->supervisor_status === 'pending') {
            // First level: supervisor/manager approving supervisor_status
            $leave->update([
                'supervisor_status' => 'approved',
                'approved_by_supervisor_id' => $approver->id,
                'supervisor_approved_at' => now(),
                'supervisor_notes' => $request->input('notes'),
                'status' => 'partially_approved',
            ]);
        } elseif ($leave->supervisor_status === 'approved' && $leave->manager_status === 'pending') {
            // Second level: manager/director approving manager_status
            $leave->update([
                'manager_status' => 'approved',
                'approved_by_manager_id' => $approver->id,
                'manager_approved_at' => now(),
                'manager_notes' => $request->input('notes'),
                'status' => 'approved',
            ]);
        }

        // If fully approved and it's Cuti Tahunan, decrement balance
        if ($leave->status === 'approved') {
            $leaveType = $leave->leaveType;
            if ($leaveType->name === 'Cuti Tahunan') {
                $balance = LeaveBalance::firstOrCreate(
                    ['employee_id' => $leave->employee_id, 'leave_type_id' => $leaveType->id, 'year' => now()->year],
                    ['total_days' => $leaveType->max_days, 'used_days' => 0]
                );
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

        $notes = $request->input('notes', '');

        if ($user->role === 'admin') {
            $leave->update([
                'status' => 'rejected',
                'manager_status' => 'rejected',
                'approved_by_manager_id' => $approver->id,
                'manager_approved_at' => now(),
                'manager_notes' => $notes,
            ]);
        } elseif ($leave->supervisor_status === 'pending') {
            $leave->update([
                'supervisor_status' => 'rejected',
                'approved_by_supervisor_id' => $approver->id,
                'supervisor_approved_at' => now(),
                'supervisor_notes' => $notes,
                'status' => 'rejected',
            ]);
        } elseif ($leave->manager_status === 'pending') {
            $leave->update([
                'manager_status' => 'rejected',
                'approved_by_manager_id' => $approver->id,
                'manager_approved_at' => now(),
                'manager_notes' => $notes,
                'status' => 'rejected',
            ]);
        }

        return back()->with('success', 'Pengajuan cuti telah ditolak.');
    }

    /**
     * Generate a WhatsApp deep-link URL for the next approver.
     */
    public function whatsappUrl(LeaveRequest $leave)
    {
        $leave->load('employee.department');
        $submitter = $leave->employee;
        $submitterRole = $submitter->user?->role ?? 'staff';

        // Find the next approver
        $approver = null;

        if ($leave->supervisor_status === 'pending') {
            // Need supervisor or manager of same department
            $approver = Employee::whereHas('user', function ($q) {
                $q->whereIn('role', ['supervisor', 'manager']);
            })->where('department_id', $submitter->department_id)
              ->where('id', '!=', $submitter->id)
              ->first();
        } elseif ($leave->manager_status === 'pending') {
            // First: try manager of same department
            $approver = Employee::whereHas('user', function ($q) {
                $q->where('role', 'manager');
            })->where('department_id', $submitter->department_id)
              ->where('id', '!=', $submitter->id)
              ->first();

            // Fallback: admin (cross-department)
            if (!$approver) {
                $approver = Employee::whereHas('user', function ($q) {
                    $q->where('role', 'admin');
                })->where('id', '!=', $submitter->id)->first();
            }
        }

        if (!$approver || !$approver->no_telpon_1) {
            return back()->withErrors(['error' => 'Tidak dapat menemukan atasan atau nomor telepon atasan.']);
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
        $message = "Pengajuan {$leaveType} dari {$submitter->nama} ({$deptName}) menunggu persetujuan Anda.\nPeriode: {$leave->tanggal_mulai->format('d/m/Y')} - {$leave->tanggal_selesai->format('d/m/Y')} ({$leave->jumlah_hari} hari)\nKeperluan: {$leave->alasan}\n\nSilahkan cek di dashboard HRIS.";

        $url = 'https://wa.me/' . $phone . '?text=' . urlencode($message);

        return response()->json(['url' => $url, 'approver_name' => $approver->nama]);
    }
}
