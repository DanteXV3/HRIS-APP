<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use Illuminate\Http\Request;

class LeaveApiController extends Controller
{
    public function balances(Request $request)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();

        if (!$employee) {
            return response()->json(['balances' => []]);
        }

        $balances = LeaveBalance::with('leaveType')
            ->where('employee_id', $employee->id)
            ->where('year', now()->year)
            ->get()
            ->map(fn($b) => [
                'id' => $b->id,
                'leave_type' => $b->leaveType?->name,
                'total_days' => $b->total_days,
                'used_days' => $b->used_days,
                'remaining_days' => $b->remaining_days,
                'year' => $b->year,
            ]);

        return response()->json(['balances' => $balances]);
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();
        $filter = $request->query('filter', 'created');

        $query = LeaveRequest::with(['employee.department', 'leaveType']);

        if ($filter === 'need_approval') {
            if (!$employee && !$user->isAdmin()) {
                return response()->json(['leave_requests' => []]);
            }
            $empId = $employee?->id;

            $query->where('employee_id', '!=', $empId)
                ->where(function ($q) use ($user, $empId) {
                    // Step 1: Pending supervisor approval where employee is report_to
                    $q->where(function ($q1) use ($user, $empId) {
                        $q1->whereIn('status', ['pending', 'partially_approved'])
                           ->where('supervisor_status', 'pending');
                        if (!$user->isAdmin() && !$user->hasPermission('leave.approve_all')) {
                            $q1->whereHas('employee', function ($eq) use ($empId) {
                                $eq->where('report_to', $empId);
                            });
                        }
                    })
                    // Step 2: Pending manager approval (partially_approved) where employee is manager_id
                    ->orWhere(function ($q2) use ($user, $empId) {
                        $q2->whereIn('status', ['pending', 'partially_approved'])
                           ->where('supervisor_status', 'approved')
                           ->where('manager_status', 'pending');
                        if (!$user->isAdmin() && !$user->hasPermission('leave.approve_all')) {
                            $q2->whereHas('employee', function ($eq) use ($empId) {
                                $eq->where('manager_id', $empId);
                            });
                        }
                    });
                });
        } elseif ($filter === 'completed') {
            if (!$employee && !$user->isAdmin()) {
                return response()->json(['leave_requests' => []]);
            }
            $empId = $employee?->id;

            $query->where(function ($q) use ($user, $empId) {
                if ($empId) {
                    $q->where('approved_by_supervisor_id', $empId)
                      ->orWhere('approved_by_manager_id', $empId);
                }
                if ($user->isAdmin() || $user->hasPermission('leave.approve_all')) {
                    $q->orWhereIn('status', ['approved', 'rejected']);
                }
            });
        } else {
            // Default "created": submitted by logged-in user
            if ($employee) {
                $query->where('employee_id', $employee->id);
            }
        }

        $requests = $query->orderByDesc('created_at')
            ->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'employee_name' => $r->employee?->nama,
                'employee_nik' => $r->employee?->nik,
                'department' => $r->employee?->department?->name,
                'leave_type' => $r->leaveType?->name,
                'start_date' => $r->tanggal_mulai?->format('Y-m-d'),
                'end_date' => $r->tanggal_selesai?->format('Y-m-d'),
                'jumlah_hari' => $r->jumlah_hari,
                'alasan' => $r->alasan,
                'status' => $r->status,
                'supervisor_status' => $r->supervisor_status,
                'manager_status' => $r->manager_status,
                'rejection_reason' => $r->rejection_reason ?? $r->supervisor_notes ?? $r->manager_notes,
                'attachment' => $r->attachment ? url('storage/' . $r->attachment) : null,
                'created_at' => $r->created_at?->toIso8601String(),
            ]);

        return response()->json(['leave_requests' => $requests]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();

        if (!$employee) {
            return response()->json(['message' => 'Akun tidak terhubung dengan data karyawan.'], 404);
        }

        // Check if the selected leave type requires an attachment
        $leaveTypeForValidation = \App\Models\LeaveType::find($request->input('leave_type_id'));
        $attachmentRule = $leaveTypeForValidation && $leaveTypeForValidation->requires_attachment
            ? 'required|file|max:5120'
            : 'nullable|file|max:5120';

        $validated = $request->validate([
            'leave_type_id' => 'required|exists:leave_types,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'alasan' => 'required|string|max:500',
            'attachment' => $attachmentRule,
            'jumlah_hari' => 'nullable|numeric|min:0.5',
        ]);

        $start = \Carbon\Carbon::parse($validated['start_date']);
        $end = \Carbon\Carbon::parse($validated['end_date']);
        $calculatedDays = 0;
        $current = $start->copy();
        while ($current <= $end) {
            if (!$current->isWeekend()) $calculatedDays++;
            $current->addDay();
        }

        $jumlahHari = isset($validated['jumlah_hari']) && $validated['jumlah_hari'] > 0
            ? (float) $validated['jumlah_hari']
            : $calculatedDays;

        $balance = LeaveBalance::where('employee_id', $employee->id)
            ->where('leave_type_id', $validated['leave_type_id'])
            ->where('year', $start->year)
            ->first();

        if ($balance && $balance->remaining_days < $jumlahHari) {
            return response()->json([
                'message' => "Sisa cuti tidak mencukupi. Sisa: {$balance->remaining_days} hari, diajukan: {$jumlahHari} hari.",
            ], 422);
        }

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('leave-attachments', 'public');
        }

        $leaveRequest = LeaveRequest::create([
            'employee_id' => $employee->id,
            'leave_type_id' => $validated['leave_type_id'],
            'tanggal_mulai' => $validated['start_date'],
            'tanggal_selesai' => $validated['end_date'],
            'jumlah_hari' => $jumlahHari,
            'alasan' => $validated['alasan'],
            'attachment' => $attachmentPath,
            'status' => 'pending',
            'supervisor_status' => 'pending',
            'manager_status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Pengajuan cuti berhasil dikirim.',
            'leave_request' => $leaveRequest,
        ], 201);
    }

    public function approve(Request $request, LeaveRequest $leaveRequest)
    {
        $user = $request->user();
        $approver = $user->employee;
        $notes = $request->input('notes') ?? $request->input('rejection_reason');
        $submitter = $leaveRequest->employee;

        if ($leaveRequest->supervisor_status === 'pending') {
            $isSickLeave = $leaveRequest->leaveType?->name === 'Cuti Sakit';
            $isSingleApprover = empty($submitter?->manager_id) || $submitter?->manager_id === $submitter?->report_to;

            if ($isSickLeave || $isSingleApprover || $user->isAdmin()) {
                $leaveRequest->update([
                    'supervisor_status' => 'approved',
                    'approved_by_supervisor_id' => $approver?->id,
                    'supervisor_approved_at' => now(),
                    'manager_status' => 'approved',
                    'approved_by_manager_id' => $approver?->id,
                    'manager_approved_at' => now(),
                    'supervisor_notes' => $notes,
                    'status' => 'approved',
                ]);
            } else {
                $leaveRequest->update([
                    'supervisor_status' => 'approved',
                    'approved_by_supervisor_id' => $approver?->id,
                    'supervisor_approved_at' => now(),
                    'supervisor_notes' => $notes,
                    'status' => 'partially_approved',
                ]);
            }
        } else {
            $leaveRequest->update([
                'manager_status' => 'approved',
                'approved_by_manager_id' => $approver?->id,
                'manager_approved_at' => now(),
                'manager_notes' => $notes,
                'status' => 'approved',
            ]);
        }

        return response()->json(['message' => 'Pengajuan cuti berhasil disetujui.']);
    }

    public function reject(Request $request, LeaveRequest $leaveRequest)
    {
        $user = $request->user();
        $approver = $user->employee;
        $notes = $request->input('notes') ?? $request->input('rejection_reason') ?? 'Ditolak';

        $leaveRequest->update([
            'status' => 'rejected',
            'supervisor_status' => $leaveRequest->supervisor_status === 'pending' ? 'rejected' : $leaveRequest->supervisor_status,
            'manager_status' => 'rejected',
            'supervisor_notes' => $leaveRequest->supervisor_status === 'pending' ? $notes : $leaveRequest->supervisor_notes,
            'manager_notes' => $leaveRequest->supervisor_status !== 'pending' ? $notes : $leaveRequest->manager_notes,
            'rejection_reason' => $notes,
        ]);

        return response()->json(['message' => 'Pengajuan cuti ditolak.']);
    }

    public function types()
    {
        $types = LeaveType::select('id', 'name', 'max_days', 'is_paid', 'requires_attachment')->orderBy('name')->get();
        return response()->json(['leave_types' => $types]);
    }
}
