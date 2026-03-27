<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\Attendance;
use Carbon\Carbon;

class FaceAttendanceController extends Controller
{
    /**
     * API to verify and clock in/out automatically via button click.
     */
    public function verify(Request $request)
    {
        $user = $request->user();
        $employee = $user->employee ?? null;

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Data karyawan tidak ditemukan untuk akun Anda.'
            ], 404);
        }

        $employee->load(['shift', 'workingLocation']);
        $today = Carbon::today('Asia/Jakarta')->format('Y-m-d');
        $now = Carbon::now('Asia/Jakarta');

        // GEOFENCING CHECK
        $isOutsideRadius = false;
        $distance = null;
        $workingLocation = $employee->workingLocation;

        if ($workingLocation && $workingLocation->latitude && $workingLocation->longitude && $request->latitude && $request->longitude) {
            $theta = $request->longitude - $workingLocation->longitude;
            $dist = sin(deg2rad($request->latitude)) * sin(deg2rad((float)$workingLocation->latitude)) +  cos(deg2rad($request->latitude)) * cos(deg2rad((float)$workingLocation->latitude)) * cos(deg2rad($theta));
            $dist = acos($dist);
            $dist = rad2deg($dist);
            $miles = $dist * 60 * 1.1515;
            $distance = $miles * 1609.344; // convert to meters

            if ($distance > $workingLocation->radius) {
                $isOutsideRadius = true;
                if (!$request->remark) {
                    return response()->json([
                        'success' => false,
                        'outside_radius' => true,
                        'distance' => round($distance),
                        'radius' => $workingLocation->radius,
                        'message' => 'Anda berada di luar radius lokasi kerja (' . round($distance) . 'm). Silahkan berikan keterangan/catatan.'
                    ], 400);
                }
            }
        }

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
                    $earlyInMinutes = abs(round($shiftIn->diffInMinutes($now)));
                } elseif ($now->gt($shiftIn)) {
                    $lateInMinutes = abs(round($now->diffInMinutes($shiftIn)));
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
                'is_late' => $lateInMinutes > 0,
                'late_minutes' => $lateInMinutes,
                'status' => 'hadir',
                'is_holiday' => false,
                'verified_lembur_minutes' => 0,
                'clock_in_lat' => $request->latitude,
                'clock_in_lng' => $request->longitude,
                'notes' => $request->remark ? '[LUAR RADIUS: ' . round($distance) . 'm] ' . $request->remark : null,
            ]);

            return response()->json([
                'success' => true,
                'name' => $employee->nama,
                'action' => 'clock_in',
                'message' => 'Selamat bekerja, ' . $employee->nama . '!'
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
                    $earlyOutMinutes = abs(round($shiftOut->diffInMinutes($now)));
                } elseif ($now->gt($shiftOut)) {
                    $lateOutMinutes = abs(round($now->diffInMinutes($shiftOut)));
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
                'notes' => $request->remark ? ($attendance->notes ? $attendance->notes . ' | ' : '') . '[OUT RADIUS: ' . round($distance) . 'm] ' . $request->remark : $attendance->notes,
            ]);

            return response()->json([
                'success' => true,
                'name' => $employee->nama,
                'action' => 'clock_out',
                'message' => 'Hati-hati di jalan, ' . $employee->nama . '!'
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

    /**
     * Render public face attendance kiosk page.
     */
    public function kiosk()
    {
        return \Inertia\Inertia::render('face-attendance');
    }

    /**
     * Get all registered face descriptors for public kiosk matching.
     */
    public function getDescriptors()
    {
        $employees = Employee::whereNotNull('face_descriptor')
            ->where('is_active', true)
            ->get(['id', 'nama', 'nik', 'face_descriptor']);

        $data = $employees->map(fn($e) => [
            'id' => $e->id,
            'nama' => $e->nama,
            'nik' => $e->nik,
            'descriptor' => json_decode($e->face_descriptor),
        ]);

        return response()->json($data);
    }

    /**
     * Public attendance via face recognition (no auth required).
     */
    public function publicVerify(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $employee = Employee::with(['shift', 'workingLocation'])->findOrFail($request->employee_id);
        $today = Carbon::today('Asia/Jakarta')->format('Y-m-d');
        $now = Carbon::now('Asia/Jakarta');

        // GEOFENCING CHECK
        $isOutsideRadius = false;
        $distance = null;
        $workingLocation = $employee->workingLocation;

        if ($workingLocation && $workingLocation->latitude && $workingLocation->longitude && $request->latitude && $request->longitude) {
            $theta = $request->longitude - $workingLocation->longitude;
            $dist = sin(deg2rad($request->latitude)) * sin(deg2rad((float)$workingLocation->latitude)) +  cos(deg2rad($request->latitude)) * cos(deg2rad((float)$workingLocation->latitude)) * cos(deg2rad($theta));
            $dist = acos($dist);
            $dist = rad2deg($dist);
            $miles = $dist * 60 * 1.1515;
            $distance = $miles * 1609.344; // convert to meters

            if ($distance > $workingLocation->radius) {
                $isOutsideRadius = true;
                if (!$request->remark) {
                    return response()->json([
                        'success' => false,
                        'outside_radius' => true,
                        'distance' => round($distance),
                        'radius' => $workingLocation->radius,
                        'message' => 'Anda berada di luar radius lokasi kerja (' . round($distance) . 'm). Silahkan berikan keterangan.'
                    ], 400);
                }
            }
        }

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
                    $earlyInMinutes = abs(round($shiftIn->diffInMinutes($now)));
                } elseif ($now->gt($shiftIn)) {
                    $lateInMinutes = abs(round($now->diffInMinutes($shiftIn)));
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
                'is_late' => $lateInMinutes > 0,
                'late_minutes' => $lateInMinutes,
                'status' => 'hadir',
                'is_holiday' => false,
                'verified_lembur_minutes' => 0,
                'clock_in_lat' => $request->latitude,
                'clock_in_lng' => $request->longitude,
                'notes' => $request->remark ? '[LUAR RADIUS: ' . round($distance) . 'm] ' . $request->remark . ' (Face Kiosk)' : 'Face Kiosk',
            ]);

            return response()->json([
                'success' => true,
                'name' => $employee->nama,
                'action' => 'clock_in',
                'time' => $now->format('H:i:s'),
                'message' => 'Clock In berhasil! Selamat bekerja, ' . $employee->nama . '!'
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
                    $earlyOutMinutes = abs(round($shiftOut->diffInMinutes($now)));
                } elseif ($now->gt($shiftOut)) {
                    $lateOutMinutes = abs(round($now->diffInMinutes($shiftOut)));
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
                'notes' => $request->remark ? ($attendance->notes ? $attendance->notes . ' | ' : '') . '[OUT RADIUS: ' . round($distance) . 'm] ' . $request->remark : $attendance->notes,
            ]);

            return response()->json([
                'success' => true,
                'name' => $employee->nama,
                'action' => 'clock_out',
                'time' => $now->format('H:i:s'),
                'message' => 'Clock Out berhasil! Hati-hati di jalan, ' . $employee->nama . '!'
            ]);
        }

        // SCENARIO 3: Already Clocked In and Clocked Out
        return response()->json([
            'success' => false,
            'name' => $employee->nama,
            'action' => 'already_finished',
            'message' => 'Maaf ' . $employee->nama . ', Anda sudah melakukan presensi hari ini.'
        ], 422);
    }
}
