<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use App\Services\AttendanceService;
use Illuminate\Http\Request;

class AttendanceApiController extends Controller
{
    /**
     * Get attendance history.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();

        if (!$employee) {
            return response()->json(['message' => 'Akun tidak terhubung dengan data karyawan.'], 404);
        }

        $month = $request->query('month', now()->format('Y-m'));
        $attendances = Attendance::where('employee_id', $employee->id)
            ->where('tanggal', 'like', "$month%")
            ->orderBy('tanggal', 'desc')
            ->get()
            ->map(fn($att) => [
                'id' => $att->id,
                'tanggal' => $att->tanggal,
                'status' => $att->status,
                'clock_in' => $att->clock_in,
                'clock_out' => $att->clock_out,
                'is_late' => (bool)$att->is_late,
                'late_in_minutes' => $att->late_in_minutes,
                'verified_lembur_minutes' => $att->verified_lembur_minutes,
                'remarks' => $att->remarks,
            ]);

        // Summary stats
        $summary = [
            'hadir' => $attendances->where('status', 'hadir')->count(),
            'sakit' => $attendances->where('status', 'sakit')->count(),
            'izin' => $attendances->where('status', 'izin')->count(),
            'cuti' => $attendances->where('status', 'cuti')->count(),
            'alpha' => $attendances->where('status', 'alpha')->count(),
            'late' => $attendances->where('is_late', true)->count(),
        ];

        return response()->json([
            'attendances' => $attendances->values(),
            'summary' => $summary,
            'month' => $month,
        ]);
    }

    /**
     * Clock in or clock out.
     */
    public function clock(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'type' => 'required|in:in,out',
            'remarks' => 'nullable|string|max:255',
            'face_descriptor' => 'required|array|size:128',
        ]);

        $user = $request->user();
        $employee = Employee::with('workingLocation')->where('user_id', $user->id)->first();

        if (!$employee) {
            return response()->json(['message' => 'Akun tidak terhubung dengan data karyawan.'], 404);
        }

        // --- Facial Recognition Verification ---
        $storedDescriptorJson = $employee->face_descriptor;
        if (!$storedDescriptorJson) {
            return response()->json(['message' => 'Data wajah Anda belum terdaftar. Silakan hubungi admin.'], 422);
        }

        $storedDescriptor = is_array($storedDescriptorJson) ? $storedDescriptorJson : json_decode($storedDescriptorJson, true);
        $liveDescriptor = $request->face_descriptor;

        $distance = $this->euclideanDistance($storedDescriptor, $liveDescriptor);

        // Web app uses 0.45 for stricter verification
        if ($distance > 0.45) {
            return response()->json([
                'message' => 'Verifikasi wajah gagal. Pastikan wajah Anda terlihat jelas.',
                'distance' => $distance
            ], 422);
        }

        $today = now()->toDateString();
        $now = now()->format('H:i:s');

        // Geofence check
        $withinGeofence = false;
        $geofenceMessage = null;
        $workingLocation = $employee->workingLocation;

        if ($workingLocation) {
            $geofences = $workingLocation->geofences ?? [];
            if (empty($geofences) && $workingLocation->latitude && $workingLocation->longitude) {
                $geofences = [[
                    'latitude' => $workingLocation->latitude,
                    'longitude' => $workingLocation->longitude,
                    'radius' => $workingLocation->radius ?? 200,
                ]];
            }

            foreach ($geofences as $fence) {
                $dist = $this->haversineDistance(
                    $request->latitude, $request->longitude,
                    $fence['latitude'], $fence['longitude']
                );
                if ($dist <= ($fence['radius'] ?? 200)) {
                    $withinGeofence = true;
                    break;
                }
            }

            if (!$withinGeofence) {
                $geofenceMessage = 'Anda berada di luar area geofence. Absensi tetap dicatat dengan catatan.';
            }
        }

        if ($request->type === 'in') {
            $existing = Attendance::where('employee_id', $employee->id)
                ->where('tanggal', $today)
                ->first();

            if ($existing && $existing->clock_in) {
                return response()->json(['message' => 'Anda sudah clock in hari ini.'], 422);
            }

            $remarks = $request->remarks;
            if (!$withinGeofence && $geofenceMessage) {
                $remarks = ($remarks ? $remarks . ' | ' : '') . 'Di luar geofence';
            }

            // Detect shift
            $attendanceService = app(\App\Services\AttendanceService::class);
            $shiftContext = $attendanceService->findTargetShift($employee, now());
            $shift = $shiftContext['shift'];
            $shiftId = $shift?->id;

            $attendance = Attendance::updateOrCreate(
                ['employee_id' => $employee->id, 'tanggal' => $today, 'shift_id' => $shiftId],
                [
                    'status' => 'hadir',
                    'clock_in' => $now,
                    'clock_in_lat' => $request->latitude,
                    'clock_in_lng' => $request->longitude,
                    'jam_masuk' => $shift?->jam_masuk,
                    'jam_pulang' => $shift?->jam_pulang,
                    'shift_name' => $shift?->name,
                    'shift_id' => $shiftId,
                    'remarks' => $remarks,
                ]
            );

            return response()->json([
                'message' => 'Clock in berhasil (Wajah Terverifikasi).' . ($geofenceMessage ? " ($geofenceMessage)" : ''),
                'attendance' => $attendance,
                'within_geofence' => $withinGeofence,
            ]);
        } else {
            // Use the 16-hour lookback window so night-shift workers
            // who clocked in yesterday can still clock out today.
            $attendanceService = app(AttendanceService::class);
            $attendance = $attendanceService->findOpenAttendance($employee);

            if (!$attendance || !$attendance->clock_in) {
                return response()->json(['message' => 'Anda belum clock in atau sesi telah berakhir.'], 422);
            }

            if ($attendance->clock_out) {
                return response()->json(['message' => 'Anda sudah clock out.'], 422);
            }

            $attendance->update([
                'clock_out' => $now,
                'clock_out_lat' => $request->latitude,
                'clock_out_lng' => $request->longitude,
            ]);

            return response()->json([
                'message' => 'Clock out berhasil (Wajah Terverifikasi).' . ($geofenceMessage ? " ($geofenceMessage)" : ''),
                'attendance' => $attendance->fresh(),
                'within_geofence' => $withinGeofence,
            ]);
        }
    }

    /**
     * Get today's attendance status.
     */
    public function today(Request $request)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();

        if (!$employee) {
            return response()->json(['message' => 'Akun tidak terhubung dengan data karyawan.'], 404);
        }

        $today = now()->toDateString();

        // First try today's attendance record
        $attendance = Attendance::where('employee_id', $employee->id)
            ->where('tanggal', $today)
            ->first();

        // If no record today, check for an open attendance from a previous
        // shift (night shift clock-in from yesterday within 16-hour window)
        if (!$attendance) {
            $attendanceService = app(AttendanceService::class);
            $openAttendance = $attendanceService->findOpenAttendance($employee);
            if ($openAttendance) {
                $attendance = $openAttendance;
            }
        }

        return response()->json([
            'date' => $today,
            'has_clocked_in' => $attendance && $attendance->clock_in ? true : false,
            'has_clocked_out' => $attendance && $attendance->clock_out ? true : false,
            'attendance' => $attendance ? [
                'id' => $attendance->id,
                'status' => $attendance->status,
                'clock_in' => $attendance->clock_in,
                'clock_out' => $attendance->clock_out,
                'is_late' => (bool)$attendance->is_late,
                'late_in_minutes' => $attendance->late_in_minutes,
                'remarks' => $attendance->remarks,
            ] : null,
        ]);
    }

    private function euclideanDistance(array $v1, array $v2): float
    {
        $sum = 0;
        for ($i = 0; $i < count($v1); $i++) {
            $sum += ($v1[$i] - $v2[$i]) ** 2;
        }
        return sqrt($sum);
    }

    private function haversineDistance(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $earthRadius = 6371000;
        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);
        $a = sin($dLat / 2) ** 2 + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLng / 2) ** 2;
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return $earthRadius * $c;
    }
}