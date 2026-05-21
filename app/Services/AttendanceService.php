<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class AttendanceService
{
    /**
     * Get the timezone for a given employee based on coordinates.
     */
    public function getEmployeeTimezone(Employee $employee, ?array $coords = null): string
    {
        // 1. If coordinates are provided, find the closest geofence
        if ($coords && $employee->workingLocation) {
            $result = $this->verifyGeofence($employee, $coords);
            if (isset($result['fence']['timezone'])) {
                return $result['fence']['timezone'];
            }
        }

        // 2. Fallback to the first geofence's timezone
        $fences = $employee->workingLocation->geofences ?? [];
        if (is_string($fences)) {
            $fences = json_decode($fences, true) ?? [];
        }
        if (!empty($fences) && isset($fences[0]['timezone'])) {
            return $fences[0]['timezone'];
        }

        // 3. Ultimate fallback
        return config('app.timezone', 'Asia/Jakarta');
    }

    /**
     * Get current time in employee's timezone.
     */
    public function now(Employee $employee, ?array $coords = null): Carbon
    {
        return Carbon::now($this->getEmployeeTimezone($employee, $coords));
    }

    /**
     * Verify geofencing for an employee.
     */
    public function verifyGeofence(Employee $employee, array $coords): array
    {
        $workingLocation = $employee->workingLocation;
        if (!$workingLocation || !isset($coords['latitude']) || !isset($coords['longitude'])) {
            return ['success' => true]; // Skip if no core data
        }

        $lat1 = $coords['latitude'];
        $lon1 = $coords['longitude'];

        // Build list of all authorized geofences
        $fences = $workingLocation->geofences ?? [];
        
        // Include legacy single-point data if not already in JSON
        if ($workingLocation->latitude && $workingLocation->longitude) {
            $fences[] = [
                'latitude' => $workingLocation->latitude,
                'longitude' => $workingLocation->longitude,
                'radius' => $workingLocation->radius,
                'name' => 'Legacy Primary'
            ];
        }

        if (empty($fences)) {
            return ['success' => true];
        }

        $closestDistance = null;
        $matchedFence = null;

        foreach ($fences as $fence) {
            $lat2 = (float)($fence['latitude'] ?? 0);
            $lon2 = (float)($fence['longitude'] ?? 0);
            $radius = (int)($fence['radius'] ?? 200);

            if (!$lat2 || !$lon2) continue;

            $theta = $lon1 - $lon2;
            $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
            $dist = acos(min(max($dist, -1.0), 1.0));
            $dist = rad2deg($dist);
            $miles = $dist * 60 * 1.1515;
            $distance = $miles * 1609.344; // meters

            if ($closestDistance === null || $distance < $closestDistance) {
                $closestDistance = $distance;
                $matchedFence = $fence;
            }

            // If we found a match, we can stop immediately
            if ($distance <= $radius) {
                return ['success' => true, 'distance' => round($distance), 'fence' => $fence];
            }
        }

        // If we get here, no fence was matched
        return [
            'success' => false,
            'distance' => round($closestDistance),
            'radius' => $matchedFence['radius'] ?? 200,
            'fence' => $matchedFence,
            'message' => "Anda berada di luar radius lokasi kerja (" . round($closestDistance) . "m)."
        ];
    }

    /**
     * Find an open attendance record for the employee.
     * Lookback window is 24 hours to safely cover night shifts where
     * employees may clock in early (e.g. 17:45 for a 19:00 shift)
     * and clock out late (e.g. 08:00+ for a 07:00 end).
     */
    public function findOpenAttendance(Employee $employee)
    {
        $timezone = $this->getEmployeeTimezone($employee);
        $cutoff = Carbon::now($timezone)->subHours(24)->format('Y-m-d H:i:s');

        return Attendance::where('employee_id', $employee->id)
            ->whereNull('clock_out')
            ->where('clock_in', '>', $cutoff)
            ->orderBy('clock_in', 'desc')
            ->first();
    }

    /**
     * Find the most relevant shift for a given time, considering today and yesterday.
     */
    public function findTargetShift(Employee $employee, Carbon $time): array
    {
        $shifts = $employee->shifts;
        if ($shifts->isEmpty()) {
            return ['shift' => null, 'tanggal' => $time->format('Y-m-d')];
        }

        $timezone = $this->getEmployeeTimezone($employee);
        $bestShift = null;
        $bestTanggal = $time->format('Y-m-d');
        $minDiff = 999999;

        // Check each shift for Yesterday, Today, and Tomorrow (to be safe)
        $days = [-1, 0, 1];
        foreach ($days as $dayOffset) {
            $refDate = $time->copy()->addDays($dayOffset)->format('Y-m-d');
            foreach ($shifts as $shift) {
                $shiftIn = Carbon::parse($refDate . ' ' . $shift->jam_masuk, $timezone);
                $shiftOut = Carbon::parse($refDate . ' ' . $shift->jam_pulang, $timezone);
                
                // Handle night shifts where clock out is the next day
                if ($shiftOut->lt($shiftIn)) {
                    $shiftOut->addDay();
                }

                $diffIn = abs($time->diffInMinutes($shiftIn));
                $diffOut = abs($time->diffInMinutes($shiftOut));
                $diff = min($diffIn, $diffOut);

                if ($diff < $minDiff) {
                    $minDiff = $diff;
                    $bestShift = $shift;
                    $bestTanggal = $refDate;
                }
            }
        }

        return [
            'shift' => $bestShift,
            'tanggal' => $bestTanggal,
        ];
    }

    /**
     * Calculate attendance metrics (late, early, overtime).
     * Works for both real-time and manual inputs.
     */
    public function calculateMetrics(Employee $employee, Carbon $time, $shift, bool $isClockOut = false, ?Attendance $attendance = null): array
    {
        $metrics = [
            'early_in_minutes' => 0,
            'late_in_minutes' => 0,
            'early_out_minutes' => 0,
            'late_out_minutes' => 0,
            'overtime_minutes' => 0,
        ];

        if (!$shift) return $metrics;

        $timezone = $this->getEmployeeTimezone($employee);

        // CRITICAL: Ensure $time is in the employee's timezone.
        // When clock-in/out comes from the real-time face attendance, $time already has the
        // correct timezone. But when it comes from manual entry, CSV import, or corrections,
        // $time is parsed without timezone (defaulting to server timezone Asia/Jakarta).
        // We need all comparisons to happen in the same timezone as the shift definition.
        // 
        // We use shiftTimezone() which preserves the wall-clock reading (e.g. 08:30 stays 08:30)
        // when the time was already constructed with the correct H:i from user input.
        // However, if the time was constructed from Carbon::now() in the employee's tz, the
        // timezone is already correct and shiftTimezone is a no-op.
        if ($time->timezone->getName() !== $timezone) {
            // The time string represents local employee time but was parsed in the wrong tz.
            // Reconstruct it in the correct timezone preserving the wall-clock time.
            $time = Carbon::parse($time->format('Y-m-d H:i:s'), $timezone);
        }
        
        // Use the attendance clock-in date as reference if it exists (for night shifts)
        // If not, use the supplied date context (relevant for night shift clock-in)
        if ($attendance) {
            // clock_in is stored in the employee's local timezone, so parse it in that timezone
            $dateRef = Carbon::parse($attendance->clock_in, $timezone)->format('Y-m-d');
        } else {
            // If manual date provided via Attendance model's 'tanggal' property
            $dateRef = $time->format('Y-m-d');
        }
        
        $shiftIn = Carbon::parse($dateRef . ' ' . $shift->jam_masuk, $timezone);
        $shiftOut = Carbon::parse($dateRef . ' ' . $shift->jam_pulang, $timezone);

        if ($shiftOut->lt($shiftIn)) {
            $shiftOut->addDay();
        }

        if (!$isClockOut) {
            if ($time->lt($shiftIn)) {
                $metrics['early_in_minutes'] = (int) abs($time->diffInMinutes($shiftIn, true));
            } else {
                $metrics['late_in_minutes'] = (int) abs($time->diffInMinutes($shiftIn, true));
            }
        } else {
            if ($time->lt($shiftOut)) {
                $metrics['early_out_minutes'] = (int) abs($time->diffInMinutes($shiftOut, true));
            } else {
                $metrics['late_out_minutes'] = (int) abs($time->diffInMinutes($shiftOut, true));
                $metrics['overtime_minutes'] = $metrics['late_out_minutes'];
            }
        }

        return $metrics;
    }

    /**
     * Determine attendance status based on data and current date properties.
     */
    public function determineStatus(Carbon $date, ?Employee $employee = null): string
    {
        // Check for holidays
        $isHoliday = \App\Models\Holiday::where('date', $date->format('Y-m-d'))->exists();
        if ($isHoliday) return 'libur';

        // Check for approved leave
        if ($employee) {
            $leaveOnDate = \App\Models\LeaveRequest::with('leaveType')
                ->where('employee_id', $employee->id)
                ->where('status', 'approved')
                ->whereDate('tanggal_mulai', '<=', $date)
                ->whereDate('tanggal_selesai', '>=', $date)
                ->first();

            if ($leaveOnDate) {
                $typeName = strtolower($leaveOnDate->leaveType->name);
                if (str_contains($typeName, 'sakit')) return 'sakit';
                if (str_contains($typeName, 'izin')) return 'izin';
                return 'cuti';
            }
        }

        // Weekend fallback
        if ($date->isWeekend()) return 'off';

        return 'alpha'; // Default fallback
    }
}
