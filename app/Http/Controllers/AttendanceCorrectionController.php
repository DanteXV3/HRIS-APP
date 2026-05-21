<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\AttendanceCorrection;
use App\Models\Employee;
use App\Models\User;
use App\Notifications\AttendanceCorrectionNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AttendanceCorrectionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $isManager = $user->hasPermission('attendance.correction.manage');
        
        $query = AttendanceCorrection::with(['employee', 'approvedBy'])
            ->orderBy('created_at', 'desc');

        if (!$isManager) {
            $employee = Employee::where('user_id', $user->id)->first();
            if (!$employee) {
                return Inertia::render('attendances/corrections_index', [
                    'corrections' => [],
                    'isManager' => false,
                    'error' => 'Data karyawan tidak ditemukan.'
                ]);
            }
            $query->where('employee_id', $employee->id);
        }

        return Inertia::render('attendances/corrections_index', [
            'corrections' => $query->paginate(15)->withQueryString(),
            'isManager' => $isManager,
        ]);
    }

    public function store(Request $request)
    {
        $employee = Employee::where('user_id', $request->user()->id)->first();
        if (!$employee) {
            abort(403, 'Data karyawan tidak ditemukan.');
        }

        $validated = $request->validate([
            'tanggal' => 'required|date',
            'clock_in' => 'nullable|date_format:H:i',
            'clock_out' => 'nullable|date_format:H:i',
            'status' => 'required|in:hadir,izin,sakit,cuti,alpha,libur',
            'reason' => 'required|string|min:5',
            'attendance_id' => 'nullable|exists:attendances,id',
        ]);

        $correction = AttendanceCorrection::create([
            'employee_id' => $employee->id,
            'attendance_id' => $validated['attendance_id'],
            'tanggal' => $validated['tanggal'],
            'clock_in' => $validated['clock_in'],
            'clock_out' => $validated['clock_out'],
            'status' => $validated['status'],
            'reason' => $validated['reason'],
            'approval_status' => 'pending',
        ]);

        // Notify admins and users with manage permission
        $approvers = User::where('role', 'admin')
            ->orWhereHas('permissions', fn($q) => $q->where('slug', 'attendance.correction.manage'))
            ->get();

        foreach ($approvers as $approver) {
            $approver->notify(new AttendanceCorrectionNotification($correction));
        }

        return redirect()->back()->with('success', 'Permintaan koreksi absensi telah dikirim.');
    }

    public function update(Request $request, AttendanceCorrection $correction)
    {
        if (!$request->user()->hasPermission('attendance.correction.manage')) {
            abort(403);
        }

        $validated = $request->validate([
            'approval_status' => 'required|in:approved,rejected',
            'admin_notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $correction->update([
                'approval_status' => $validated['approval_status'],
                'admin_notes' => $validated['admin_notes'],
                'approved_by' => $request->user()->id,
            ]);

            if ($validated['approval_status'] === 'approved') {
                $employee = $correction->employee->load(['shifts', 'workingLocation']);
                $selectedShift = $employee->shifts->first(); // Use first shift as default for correction
                
                $tanggalStr = $correction->tanggal->format('Y-m-d');
                
                // Parse clock times in the employee's timezone so metrics are calculated correctly
                $attendanceService = app(\App\Services\AttendanceService::class);
                $empTimezone = $attendanceService->getEmployeeTimezone($employee);
                $clockIn = $correction->clock_in ? Carbon::parse($tanggalStr . ' ' . $correction->clock_in, $empTimezone) : null;
                $clockOut = $correction->clock_out ? Carbon::parse($tanggalStr . ' ' . $correction->clock_out, $empTimezone) : null;
                
                $metricsIn = $clockIn ? $attendanceService->calculateMetrics($employee, $clockIn, $selectedShift, false) : [];
                $metricsOut = $clockOut ? $attendanceService->calculateMetrics($employee, $clockOut, $selectedShift, true) : [];

                $jamMasuk = $selectedShift ? $selectedShift->jam_masuk : null;
                $jamPulang = $selectedShift ? $selectedShift->jam_pulang : null;

                $earlyInMinutes = $metricsIn['early_in_minutes'] ?? 0;
                $lateInMinutes = $metricsIn['late_in_minutes'] ?? 0;
                $earlyOutMinutes = $metricsOut['early_out_minutes'] ?? 0;
                $lateOutMinutes = $metricsOut['late_out_minutes'] ?? 0;
                $overtimeMinutes = $metricsOut['overtime_minutes'] ?? 0;

                Attendance::updateOrCreate(
                    ['employee_id' => $correction->employee_id, 'tanggal' => $tanggalStr, 'shift_id' => $selectedShift?->id],
                    [
                        'clock_in' => $clockIn?->format('Y-m-d H:i:s'),
                        'clock_out' => $clockOut?->format('Y-m-d H:i:s'),
                        'jam_masuk' => $jamMasuk,
                        'jam_pulang' => $jamPulang,
                        'shift_name' => $selectedShift?->name,
                        'shift_id' => $selectedShift?->id,
                        'early_in_minutes' => $earlyInMinutes,
                        'late_in_minutes' => $lateInMinutes,
                        'is_late' => $lateInMinutes > 0,
                        'late_minutes' => $lateInMinutes,
                        'early_out_minutes' => $earlyOutMinutes,
                        'late_out_minutes' => $lateOutMinutes,
                        'status' => $correction->status,
                        'overtime_minutes' => $overtimeMinutes,
                        'notes' => '(Koreksi): ' . $correction->reason,
                    ]
                );
            }

            DB::commit();
            return redirect()->back()->with('success', 'Permintaan koreksi telah diproses.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function destroy(AttendanceCorrection $correction)
    {
        if ($correction->approval_status !== 'pending') {
            abort(403, 'Hanya permintaan pending yang dapat dibatalkan.');
        }
        
        $correction->delete();
        return redirect()->back()->with('success', 'Permintaan koreksi telah dibatalkan.');
    }
}
