<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Shift;
use App\Services\AttendanceService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MobileAttendanceController extends Controller
{
    public function clock(Request $request)
    {
        return $this->clockWithImage($request);
    }

    /**
     * Clock in or out from mobile app with face image.
     * The face image is processed server-side using face-api.js
     * to extract a compatible 128-float descriptor.
     */
    public function clockWithImage(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'type' => 'required|in:in,out',
            'remarks' => 'nullable|string|max:255',
            'face_image' => 'required|string', // base64 encoded JPEG
        ]);

        $user = $request->user();
        $employee = Employee::with('workingLocation')->where('user_id', $user->id)->first();

        if (!$employee) {
            return response()->json(['message' => 'Akun tidak terhubung dengan data karyawan.'], 404);
        }

        // Check if face is registered
        $storedDescriptorJson = $employee->face_descriptor;
        if (!$storedDescriptorJson) {
            return response()->json(['message' => 'Data wajah Anda belum terdaftar. Silakan hubungi admin.'], 422);
        }

        try {
            // Clean base64 image input
            $cleanImage = preg_replace('#^data:image/\w+;base64,#i', '', $request->face_image);
            $cleanImage = str_replace(["\r", "\n", " ", "\\"], "", $cleanImage);

            // Call standalone face extraction microservice
            $extractUrl = config('services.face_extraction.url', env('FACE_EXTRACTION_URL', 'http://172.17.0.1:3000/api/extract'));
            $response = \Illuminate\Support\Facades\Http::timeout(30)
                ->post($extractUrl, [
                    'image' => $cleanImage
                ]);

            if ($response->status() === 422) {
                return response()->json([
                    'message' => 'Wajah tidak terdeteksi dalam foto. Pastikan wajah terlihat jelas.'
                ], 422);
            }

            if (!$response->successful()) {
                Log::error('Face descriptor extraction service failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return response()->json([
                    'message' => 'Gagal memproses verifikasi wajah. Silakan coba lagi.'
                ], 500);
            }

            $liveDescriptor = $response->json('descriptor');
            if (!is_array($liveDescriptor) || count($liveDescriptor) !== 128) {
                Log::error('Invalid descriptor output from service', ['response' => $response->body()]);
                return response()->json([
                    'message' => 'Gagal mengekstrak data wajah. Silakan coba lagi.'
                ], 500);
            }

            // Compare descriptors using Euclidean distance
            $storedDescriptor = is_array($storedDescriptorJson)
                ? $storedDescriptorJson
                : json_decode($storedDescriptorJson, true);

            $distance = $this->euclideanDistance($storedDescriptor, $liveDescriptor);

            if ($distance > 0.45) {
                return response()->json([
                    'message' => 'Verifikasi wajah gagal. Pastikan wajah Anda terlihat jelas.',
                    'distance' => $distance
                ], 422);
            }

            // --- Geofence check ---
            $withinGeofence = false;
            $geofenceMessage = null;
            $workingLocation = $employee->workingLocation;

            if ($workingLocation) {
                $geofences = $workingLocation->geofences ?? [];
                if (is_string($geofences)) {
                    $geofences = json_decode($geofences, true) ?: [];
                }

                if (empty($geofences) && $workingLocation->latitude && $workingLocation->longitude) {
                    $geofences = [[
                        'latitude' => (float) $workingLocation->latitude,
                        'longitude' => (float) $workingLocation->longitude,
                        'radius' => (float) ($workingLocation->radius ?? 200),
                    ]];
                }

                foreach ($geofences as $fence) {
                    $fenceArr = (array) $fence;
                    $fLat = (float) ($fenceArr['latitude'] ?? $fenceArr['lat'] ?? 0);
                    $fLng = (float) ($fenceArr['longitude'] ?? $fenceArr['lng'] ?? 0);
                    $fRad = (float) ($fenceArr['radius'] ?? $workingLocation->radius ?? 200);

                    if ($fLat != 0.0 && $fLng != 0.0) {
                        $dist = $this->haversineDistance(
                            (float) $request->latitude, (float) $request->longitude,
                            $fLat, $fLng
                        );
                        if ($dist <= $fRad) {
                            $withinGeofence = true;
                            break;
                        }
                    }
                }

                // Fallback check against main working location lat/lng if geofences array produced no match
                if (!$withinGeofence && $workingLocation->latitude && $workingLocation->longitude) {
                    $dist = $this->haversineDistance(
                        (float) $request->latitude, (float) $request->longitude,
                        (float) $workingLocation->latitude, (float) $workingLocation->longitude
                    );
                    if ($dist <= (float) ($workingLocation->radius ?? 200)) {
                        $withinGeofence = true;
                    }
                }

                if (!$withinGeofence) {
                    $geofenceMessage = 'Anda berada di luar area geofence. Absensi tetap dicatat dengan catatan.';
                }
            } else {
                // No working location set -> default to true
                $withinGeofence = true;
            }

            $attendanceService = app(AttendanceService::class);
            $timezone = $attendanceService->getEmployeeTimezone($employee);
            $nowCarbon = \Carbon\Carbon::now($timezone);
            $shiftContext = $attendanceService->findTargetShift($employee, $nowCarbon);
            $shift = $shiftContext['shift'];
            $targetTanggal = $shiftContext['tanggal'] ?? $nowCarbon->toDateString();
            $nowTime = $nowCarbon->format('Y-m-d H:i:s');

            $attendanceService = app(AttendanceService::class);

            if ($request->type === 'in') {
                $existing = Attendance::where('employee_id', $employee->id)
                    ->where('tanggal', $targetTanggal)
                    ->first();

                if ($existing && $existing->clock_in) {
                    if ($request->filled('remarks')) {
                        $existingRemarks = $existing->remarks;
                        $reqRemark = $request->remarks;
                        $newRemarks = $existingRemarks 
                            ? (str_contains($existingRemarks, $reqRemark) ? $existingRemarks : $existingRemarks . ' | ' . $reqRemark)
                            : $reqRemark;
                        $existing->update(['remarks' => $newRemarks]);
                        return response()->json([
                            'message' => 'Catatan presensi berhasil diperbarui.',
                            'attendance' => $existing->fresh(),
                            'within_geofence' => $withinGeofence,
                        ]);
                    }
                    return response()->json(['message' => 'Anda sudah clock in hari ini.'], 422);
                }

                $remarks = $request->remarks;
                if (!$withinGeofence && $geofenceMessage) {
                    $remarks = ($remarks ? $remarks . ' | ' : '') . 'Di luar geofence';
                }

                $shiftContext = $attendanceService->findTargetShift($employee, $nowCarbon);
                $shift = $shiftContext['shift'];
                $shiftId = $shift?->id;

                // Calculate metrics for clock-in (late, early)
                $metrics = $attendanceService->calculateMetrics($employee, $nowCarbon, $shift, false);

                $attendance = Attendance::updateOrCreate(
                    ['employee_id' => $employee->id, 'tanggal' => $targetTanggal],
                    [
                        'status' => 'hadir',
                        'clock_in' => $nowTime,
                        'clock_in_lat' => $request->latitude,
                        'clock_in_lng' => $request->longitude,
                        'jam_masuk' => $shift?->jam_masuk,
                        'jam_pulang' => $shift?->jam_pulang,
                        'shift_name' => $shift?->name,
                        'shift_id' => $shiftId,
                        'is_late' => ($metrics['late_in_minutes'] > 0),
                        'late_in_minutes' => $metrics['late_in_minutes'],
                        'early_in_minutes' => $metrics['early_in_minutes'],
                        'remarks' => $remarks,
                    ]
                );

                return response()->json([
                    'message' => 'Clock in berhasil (Wajah Terverifikasi).' . ($geofenceMessage ? " ($geofenceMessage)" : ''),
                    'attendance' => $attendance,
                    'within_geofence' => $withinGeofence,
                ]);
            } else {
                $attendance = $attendanceService->findOpenAttendance($employee);

                if (!$attendance || !$attendance->clock_in) {
                    return response()->json(['message' => 'Anda belum clock in atau sesi telah berakhir.'], 422);
                }

                if ($attendance->clock_out) {
                    if ($request->filled('remarks')) {
                        $existingRemarks = $attendance->remarks;
                        $reqRemark = $request->remarks;
                        $newRemarks = $existingRemarks 
                            ? (str_contains($existingRemarks, $reqRemark) ? $existingRemarks : $existingRemarks . ' | ' . $reqRemark)
                            : $reqRemark;
                        $attendance->update(['remarks' => $newRemarks]);
                        return response()->json([
                            'message' => 'Catatan presensi berhasil diperbarui.',
                            'attendance' => $attendance->fresh(),
                            'within_geofence' => $withinGeofence,
                        ]);
                    }
                    return response()->json(['message' => 'Anda sudah clock out.'], 422);
                }

                $remarks = $request->remarks ?: $attendance->remarks;
                if (!$withinGeofence && $geofenceMessage) {
                    $remarks = ($remarks ? $remarks . ' | ' : '') . 'Di luar geofence';
                }

                $shift = $attendance->shift_id ? Shift::find($attendance->shift_id) : null;
                if (!$shift) {
                    $shiftContext = $attendanceService->findTargetShift($employee, $nowCarbon);
                    $shift = $shiftContext['shift'];
                }

                // Calculate metrics for clock-out (early checkout, late checkout, overtime)
                $metrics = $attendanceService->calculateMetrics($employee, $nowCarbon, $shift, true, $attendance);

                $existingRemarks = $attendance->remarks;
                $combinedRemarks = $existingRemarks 
                    ? ($remarks ? (str_contains($existingRemarks, $remarks) ? $existingRemarks : $existingRemarks . ' | ' . $remarks) : $existingRemarks)
                    : $remarks;

                $attendance->update([
                    'clock_out' => $nowTime,
                    'clock_out_lat' => $request->latitude,
                    'clock_out_lng' => $request->longitude,
                    'early_out_minutes' => $metrics['early_out_minutes'],
                    'late_out_minutes' => $metrics['late_out_minutes'],
                    'overtime_minutes' => $metrics['overtime_minutes'],
                    'remarks' => $combinedRemarks,
                ]);

                return response()->json([
                    'message' => 'Clock out berhasil (Wajah Terverifikasi).' . ($geofenceMessage ? " ($geofenceMessage)" : ''),
                    'attendance' => $attendance->fresh(),
                    'within_geofence' => $withinGeofence,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('Face clock exception', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Terjadi kesalahan sistem saat verifikasi wajah. Silakan coba lagi.'
            ], 500);
        }
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