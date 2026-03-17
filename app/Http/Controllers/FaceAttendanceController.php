<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\Attendance;
use Carbon\Carbon;

class FaceAttendanceController extends Controller
{
    /**
     * API to enroll an employee's face descriptor.
     */
    public function enroll(Request $request, Employee $employee)
    {
        $request->validate([
            'descriptor' => 'required|array',
        ]);

        $employee->update([
            'face_descriptor' => $request->descriptor,
        ]);

        return response()->json(['message' => 'Face successfully enrolled.']);
    }

    /**
     * API to verify a face descriptor and clock in/out automatically.
     */
    public function verify(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
        ]);

        $employee = Employee::with('shift')->findOrFail($request->employee_id);
        $today = Carbon::today('Asia/Jakarta')->format('Y-m-d');
        $nowStr = Carbon::now('Asia/Jakarta')->format('H:i:s');
        $now = Carbon::now('Asia/Jakarta');

        // 1. Check if Attendance already exists today
        $attendance = Attendance::where('employee_id', $employee->id)
            ->whereDate('tanggal', $today)
            ->first();

        // SCENARIO 1: No attendance record today -> Clock In
        if (!$attendance) {
            $shift = $employee->shift;
            $jamMasuk = $shift ? $shift->jam_masuk : null;
            $jamPulang = $shift ? $shift->jam_pulang : null;

            $earlyInMinutes = 0;
            $lateInMinutes = 0;

            if ($jamMasuk) {
                $shiftIn = Carbon::parse($today . ' ' . $jamMasuk, 'Asia/Jakarta');
                if ($now->lt($shiftIn)) {
                    $earlyInMinutes = $shiftIn->diffInMinutes($now);
                } elseif ($now->gt($shiftIn)) {
                    $lateInMinutes = $now->diffInMinutes($shiftIn);
                }
            }

            Attendance::create([
                'employee_id' => $employee->id,
                'tanggal' => $today,
                'clock_in' => $now->format('Y-m-d H:i:s'),
                'jam_masuk' => $jamMasuk,
                'jam_pulang' => $jamPulang,
                'early_in_minutes' => $earlyInMinutes,
                'late_in_minutes' => $lateInMinutes,
                'status' => 'hadir',
                'is_holiday' => false,
                'verified_lembur_minutes' => 0,
                'clock_in_lat' => $request->latitude,
                'clock_in_lng' => $request->longitude,
            ]);

            return response()->json([
                'success' => true,
                'name' => $employee->nama,
                'action' => 'clock_in',
                'message' => 'Happy Work ' . $employee->nama
            ]);
        }

        // SCENARIO 2: Clocked In but NOT Clocked Out -> Clock Out
        if ($attendance && !$attendance->clock_out) {
            $shiftOut = $attendance->jam_pulang ? Carbon::parse($today . ' ' . $attendance->jam_pulang, 'Asia/Jakarta') : null;
            
            $earlyOutMinutes = 0;
            $lateOutMinutes = 0;
            $overtimeMinutes = 0;

            if ($shiftOut) {
                if ($now->lt($shiftOut)) {
                    $earlyOutMinutes = $shiftOut->diffInMinutes($now);
                } elseif ($now->gt($shiftOut)) {
                    $lateOutMinutes = $now->diffInMinutes($shiftOut);
                    $overtimeMinutes = $lateOutMinutes;
                }
            }

            $attendance->update([
                'clock_out' => $now->format('Y-m-d H:i:s'),
                'early_out_minutes' => $earlyOutMinutes,
                'late_out_minutes' => $lateOutMinutes,
                'overtime_minutes' => $overtimeMinutes,
                'clock_out_lat' => $request->latitude,
                'clock_out_lng' => $request->longitude,
            ]);

            return response()->json([
                'success' => true,
                'name' => $employee->nama,
                'action' => 'clock_out',
                'message' => 'Hati-hati dijalan yaaa ' . $employee->nama
            ]);
        }

        // SCENARIO 3: Already Clocked In and Clocked Out
        return response()->json([
            'success' => false,
            'name' => $employee->nama,
            'action' => 'already_finished',
            'message' => 'Maaf ' . $employee->nama . ', Anda sudah melakukan presensi pulang hari ini.'
        ], 422);
    }
}
