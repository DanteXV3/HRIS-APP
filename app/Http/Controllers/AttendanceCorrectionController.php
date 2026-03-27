<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\AttendanceCorrection;
use App\Models\Employee;
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

        AttendanceCorrection::create([
            'employee_id' => $employee->id,
            'attendance_id' => $validated['attendance_id'],
            'tanggal' => $validated['tanggal'],
            'clock_in' => $validated['clock_in'],
            'clock_out' => $validated['clock_out'],
            'status' => $validated['status'],
            'reason' => $validated['reason'],
            'approval_status' => 'pending',
        ]);

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
                $employee = $correction->employee->load('shift');
                $shift = $employee->shift;
                
                $tanggal = $correction->tanggal;
                $clockIn = $correction->clock_in ? Carbon::parse($tanggal . ' ' . $correction->clock_in)->format('Y-m-d H:i:s') : null;
                $clockOut = $correction->clock_out ? Carbon::parse($tanggal . ' ' . $correction->clock_out)->format('Y-m-d H:i:s') : null;
                
                $jamMasuk = $shift ? $shift->jam_masuk : null;
                $jamPulang = $shift ? $shift->jam_pulang : null;

                $earlyInMinutes = 0;
                $lateInMinutes = 0;
                $earlyOutMinutes = 0;
                $lateOutMinutes = 0;
                $overtimeMinutes = 0;

                if ($clockIn && $jamMasuk) {
                    $shiftIn = Carbon::parse($tanggal . ' ' . $jamMasuk);
                    $cIn = Carbon::parse($clockIn);
                    if ($cIn->lt($shiftIn)) {
                        $earlyInMinutes = abs(round($shiftIn->diffInMinutes($cIn)));
                    } elseif ($cIn->gt($shiftIn)) {
                        $lateInMinutes = abs(round($cIn->diffInMinutes($shiftIn)));
                    }
                }

                if ($clockOut && $jamPulang) {
                    $shiftOut = Carbon::parse($tanggal . ' ' . $jamPulang);
                    $cOut = Carbon::parse($clockOut);
                    if ($cOut->lt($shiftOut)) {
                        $earlyOutMinutes = abs(round($shiftOut->diffInMinutes($cOut)));
                    } elseif ($cOut->gt($shiftOut)) {
                        $lateOutMinutes = abs(round($cOut->diffInMinutes($shiftOut)));
                        $overtimeMinutes = $lateOutMinutes;
                    }
                }

                Attendance::updateOrCreate(
                    ['employee_id' => $correction->employee_id, 'tanggal' => $tanggal],
                    [
                        'clock_in' => $clockIn,
                        'clock_out' => $clockOut,
                        'jam_masuk' => $jamMasuk,
                        'jam_pulang' => $jamPulang,
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
