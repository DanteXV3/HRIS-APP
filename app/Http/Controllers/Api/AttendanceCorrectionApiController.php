<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\AttendanceCorrection;
use App\Models\Employee;
use Illuminate\Http\Request;

class AttendanceCorrectionApiController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();

        if (!$employee) {
            return response()->json(['message' => 'Akun tidak terhubung dengan data karyawan.'], 404);
        }

        $corrections = AttendanceCorrection::with(['approvedBy'])
            ->where('employee_id', $employee->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'tanggal' => $c->tanggal,
                'clock_in' => $c->clock_in,
                'clock_out' => $c->clock_out,
                'status' => $c->status,
                'reason' => $c->reason,
                'approval_status' => $c->approval_status,
                'approved_by' => $c->approvedBy?->name,
                'admin_notes' => $c->admin_notes,
                'created_at' => $c->created_at->toIso8601String(),
            ]);

        return response()->json(['corrections' => $corrections]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();

        if (!$employee) {
            return response()->json(['message' => 'Akun tidak terhubung dengan data karyawan.'], 404);
        }

        $validated = $request->validate([
            'tanggal' => 'required|date',
            'clock_in' => 'nullable|date_format:H:i',
            'clock_out' => 'nullable|date_format:H:i',
            'status' => 'required|in:hadir,izin,sakit,cuti,alpha,libur',
            'reason' => 'required|string|min:5',
        ]);

        // Find existing attendance for reference
        $attendance = Attendance::where('employee_id', $employee->id)
            ->where('tanggal', $validated['tanggal'])
            ->first();

        $correction = AttendanceCorrection::create([
            'employee_id' => $employee->id,
            'attendance_id' => $attendance?->id,
            'tanggal' => $validated['tanggal'],
            'clock_in' => $validated['clock_in'],
            'clock_out' => $validated['clock_out'],
            'status' => $validated['status'],
            'reason' => $validated['reason'],
            'approval_status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Permintaan koreksi absensi berhasil dikirim.',
            'correction' => $correction,
        ], 201);
    }
}
