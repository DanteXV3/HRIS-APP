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
    /**
     * Get my leave balances.
     * GET /api/leaves/balances
     */
    public function balances(Request $request)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();

        if (!$employee) {
            return response()->json(['message' => 'Akun tidak terhubung dengan data karyawan.'], 404);
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

    /**
     * Get my leave request history.
     * GET /api/leaves?year=2026
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();

        if (!$employee) {
            return response()->json(['message' => 'Akun tidak terhubung dengan data karyawan.'], 404);
        }

        $year = $request->query('year', now()->year);

        $requests = LeaveRequest::with('leaveType')
            ->where('employee_id', $employee->id)
            ->whereYear('tanggal_mulai', $year)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'leave_type' => $r->leaveType?->name,
                'start_date' => $r->tanggal_mulai?->format('Y-m-d'),
                'end_date' => $r->tanggal_selesai?->format('Y-m-d'),
                'jumlah_hari' => $r->jumlah_hari,
                'alasan' => $r->alasan,
                'status' => $r->status,
                'supervisor_status' => $r->supervisor_status,
                'manager_status' => $r->manager_status,
                'attachment' => $r->attachment ? url('storage/' . $r->attachment) : null,
                'created_at' => $r->created_at->toIso8601String(),
            ]);

        return response()->json(['leave_requests' => $requests]);
    }

    /**
     * Submit a new leave request with optional attachment.
     * POST /api/leaves
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();

        if (!$employee) {
            return response()->json(['message' => 'Akun tidak terhubung dengan data karyawan.'], 404);
        }

        $validated = $request->validate([
            'leave_type_id' => 'required|exists:leave_types,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'alasan' => 'required|string|max:500',
            'attachment' => 'nullable|file|max:5120',
        ]);

        // Calculate business days
        $start = \Carbon\Carbon::parse($validated['start_date']);
        $end = \Carbon\Carbon::parse($validated['end_date']);
        $jumlahHari = 0;
        $current = $start->copy();
        while ($current <= $end) {
            if (!$current->isWeekend()) $jumlahHari++;
            $current->addDay();
        }

        // Check balance
        $balance = LeaveBalance::where('employee_id', $employee->id)
            ->where('leave_type_id', $validated['leave_type_id'])
            ->where('year', $start->year)
            ->first();

        if ($balance && $balance->remaining_days < $jumlahHari) {
            return response()->json([
                'message' => "Sisa cuti tidak mencukupi. Sisa: {$balance->remaining_days} hari, diajukan: {$jumlahHari} hari.",
            ], 422);
        }

        // Handle file upload
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
        ]);

        return response()->json([
            'message' => 'Pengajuan cuti berhasil dikirim.',
            'leave_request' => $leaveRequest,
        ], 201);
    }

    /**
     * Get leave types for dropdown.
     * GET /api/leaves/types
     */
    public function types()
    {
        $types = LeaveType::select('id', 'name')->orderBy('name')->get();
        return response()->json(['leave_types' => $types]);
    }
}
