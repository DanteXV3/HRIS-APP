<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ApprovalApiController extends Controller
{
    /**
     * Get pending items that need my approval.
     * GET /api/approvals/pending
     */
    public function pending(Request $request)
    {
        $user = $request->user();
        $pending = [];

        // Leave approvals
        if ($user->hasPermission('leave.first_approval') || $user->hasPermission('leave.approve_all')) {
            $leaveFirstApproval = LeaveRequest::with(['employee.position', 'employee.department', 'leaveType'])
                ->where('status', 'pending')
                ->where('first_approval_status', 'pending')
                ->when(!$user->hasPermission('leave.approve_all'), function ($q) use ($user) {
                    // Filter by same working location
                    $q->whereHas('employee', function ($eq) use ($user) {
                        $eq->where('working_location_id', $user->employee?->working_location_id);
                    });
                })
                ->get()
                ->map(fn($r) => [
                    'type' => 'leave_first_approval',
                    'id' => $r->id,
                    'employee_name' => $r->employee?->nama,
                    'employee_nik' => $r->employee?->nik,
                    'department' => $r->employee?->department?->name,
                    'leave_type' => $r->leaveType?->name,
                    'start_date' => $r->start_date,
                    'end_date' => $r->end_date,
                    'jumlah_hari' => $r->jumlah_hari,
                    'alasan' => $r->alasan,
                    'created_at' => $r->created_at->toIso8601String(),
                ]);

            $pending = array_merge($pending, $leaveFirstApproval->toArray());
        }

        if ($user->hasPermission('leave.second_approval') || $user->hasPermission('leave.approve_all')) {
            $leaveSecondApproval = LeaveRequest::with(['employee.position', 'employee.department', 'leaveType'])
                ->where('status', 'pending')
                ->where('first_approval_status', 'approved')
                ->where('second_approval_status', 'pending')
                ->when(!$user->hasPermission('leave.approve_all'), function ($q) use ($user) {
                    $q->whereHas('employee', function ($eq) use ($user) {
                        $eq->where('working_location_id', $user->employee?->working_location_id);
                    });
                })
                ->get()
                ->map(fn($r) => [
                    'type' => 'leave_second_approval',
                    'id' => $r->id,
                    'employee_name' => $r->employee?->nama,
                    'employee_nik' => $r->employee?->nik,
                    'department' => $r->employee?->department?->name,
                    'leave_type' => $r->leaveType?->name,
                    'start_date' => $r->start_date,
                    'end_date' => $r->end_date,
                    'jumlah_hari' => $r->jumlah_hari,
                    'alasan' => $r->alasan,
                    'created_at' => $r->created_at->toIso8601String(),
                ]);

            $pending = array_merge($pending, $leaveSecondApproval->toArray());
        }

        return response()->json([
            'pending_count' => count($pending),
            'items' => $pending,
        ]);
    }

    /**
     * Approve or reject a leave request.
     * POST /api/approvals/leave/{leaveRequest}
     * Body: { action: "approve"|"reject", rejection_reason? }
     */
    public function processLeave(Request $request, LeaveRequest $leaveRequest)
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
            'rejection_reason' => 'nullable|string|max:500',
        ]);

        $user = $request->user();
        $action = $request->action;

        // Determine which approval stage
        if ($leaveRequest->first_approval_status === 'pending') {
            if (!$user->hasPermission('leave.first_approval') && !$user->hasPermission('leave.approve_all')) {
                return response()->json(['message' => 'Tidak memiliki izin untuk approval pertama.'], 403);
            }

            $leaveRequest->update([
                'first_approval_status' => $action === 'approve' ? 'approved' : 'rejected',
                'first_approval_by' => $user->id,
                'first_approval_at' => now(),
                'status' => $action === 'reject' ? 'rejected' : 'pending',
                'rejection_reason' => $action === 'reject' ? $request->rejection_reason : null,
            ]);
        } elseif ($leaveRequest->second_approval_status === 'pending') {
            if (!$user->hasPermission('leave.second_approval') && !$user->hasPermission('leave.approve_all')) {
                return response()->json(['message' => 'Tidak memiliki izin untuk approval kedua.'], 403);
            }

            $leaveRequest->update([
                'second_approval_status' => $action === 'approve' ? 'approved' : 'rejected',
                'second_approval_by' => $user->id,
                'second_approval_at' => now(),
                'status' => $action === 'approve' ? 'approved' : 'rejected',
                'rejection_reason' => $action === 'reject' ? $request->rejection_reason : null,
            ]);

            // If fully approved, deduct leave balance
            if ($action === 'approve') {
                $balance = \App\Models\LeaveBalance::where('employee_id', $leaveRequest->employee_id)
                    ->where('leave_type_id', $leaveRequest->leave_type_id)
                    ->where('year', \Carbon\Carbon::parse($leaveRequest->start_date)->year)
                    ->first();

                if ($balance) {
                    $balance->increment('used_days', $leaveRequest->jumlah_hari);
                    $balance->decrement('remaining_days', $leaveRequest->jumlah_hari);
                }
            }
        } else {
            return response()->json(['message' => 'Tidak ada approval yang perlu diproses.'], 422);
        }

        return response()->json([
            'message' => $action === 'approve' ? 'Cuti disetujui.' : 'Cuti ditolak.',
            'leave_request' => $leaveRequest->fresh(),
        ]);
    }
}
