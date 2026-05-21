<?php

namespace App\Services;

use App\Models\DailyWorker;
use App\Models\DailyWorkerAttendance;
use App\Models\WorkingLocation;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Exception;

class DailyWorkerAttendanceService
{
    /**
     * Calculate metrics like late minutes, early in, etc.
     */
    public function calculateMetrics(DailyWorker $worker, Carbon $clockTime, $targetShift, bool $isClockOut): array
    {
        $jamMasuk = $targetShift->jam_masuk ?? '08:00';
        $jamPulang = $targetShift->jam_pulang ?? '17:00';
        
        $targetIn = Carbon::parse($clockTime->toDateString() . ' ' . $jamMasuk, $clockTime->timezone);
        $targetOut = Carbon::parse($clockTime->toDateString() . ' ' . $jamPulang, $clockTime->timezone);

        $metrics = [
            'early_in_minutes' => 0,
            'late_in_minutes' => 0,
            'early_out_minutes' => 0,
            'late_out_minutes' => 0,
        ];

        if (!$isClockOut) {
            // Clock In
            if ($clockTime->lt($targetIn)) {
                $metrics['early_in_minutes'] = $targetIn->diffInMinutes($clockTime);
            } elseif ($clockTime->gt($targetIn)) {
                $metrics['late_in_minutes'] = $clockTime->diffInMinutes($targetIn);
            }
        } else {
            // Clock Out
            if ($clockTime->lt($targetOut)) {
                $metrics['early_out_minutes'] = $targetOut->diffInMinutes($clockTime);
            } elseif ($clockTime->gt($targetOut)) {
                $metrics['late_out_minutes'] = $clockTime->diffInMinutes($targetOut);
            }
        }

        return $metrics;
    }

    public function handlePhoto($base64Image, $type = 'in')
    {
        if (!$base64Image) return null;
        
        $img = $base64Image;
        $img = str_replace('data:image/png;base64,', '', $img);
        $img = str_replace('data:image/jpeg;base64,', '', $img);
        $img = str_replace(' ', '+', $img);
        $data = base64_decode($img);
        
        $filename = 'dw_attendance/' . $type . '_' . uniqid() . '.jpg';
        Storage::disk('public')->put($filename, $data);
        
        return $filename;
    }

    public function getWorkerTimezone(DailyWorker $worker): string
    {
        return $worker->workingLocation?->timezone ?? config('app.timezone', 'UTC');
    }
}
