<?php

namespace App\Console\Commands;

use App\Models\Attendance;
use App\Models\Employee;
use App\Services\AttendanceService;
use Illuminate\Console\Command;
use Jmrashed\Zkteco\Lib\ZKTeco;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SyncX601Attendance extends Command
{
    protected $signature = 'sync:x601';
    protected $description = 'Pulls attendance records from the X601 ZKTeco machine and syncs them intelligently.';

    private AttendanceService $attendanceService;

    public function __construct(AttendanceService $attendanceService)
    {
        parent::__construct();
        $this->attendanceService = $attendanceService;
    }

    public function handle()
    {
        $ip = '192.168.1.173';
        $port = 4370;

        $this->info("Connecting to X601 Machine at {$ip}:{$port}");
        
        $zk = new ZKTeco($ip, $port);
        
        if (!$zk->connect()) {
            $this->error("Failed to connect to the X601 machine. It might be offline or unreachable on port {$port}.");
            Log::error("X601 Sync Failed: Could not connect to {$ip}:{$port}");
            return;
        }

        $this->info("Connected successfully. Fetching attendance logs...");
        
        $zk->disableDevice();
        // Standard pull - No clear.
        $attendanceLogs = $zk->getAttendance(); 
        $zk->enableDevice();
        $zk->disconnect();

        if (empty($attendanceLogs)) {
            $this->info("No attendance logs found on the machine.");
            return;
        }

        $this->info("Fetched " . count($attendanceLogs) . " logs. Processing...");

        // Strategy: Group logs by Employee, Logical Date, and Shift.
        // Structure: [ 'date' => [ 'machine_id' => [ 'shift_id' => [ 'logs' => [ts, ts, ...] ] ] ] ]
        $buckets = [];
        $employeeCache = [];

        foreach ($attendanceLogs as $log) {
            $timestamp = Carbon::parse($log['timestamp']);
            $machineId = (string) $log['id'];

            // Ignore logs older than 3 days
            if ($timestamp->copy()->startOfDay()->diffInDays(Carbon::now()->startOfDay()) > 3) {
                continue;
            }

            if (!isset($employeeCache[$machineId])) {
                $employeeCache[$machineId] = Employee::with(['shifts', 'workingLocation'])->where('machine_id', $machineId)->first();
            }
            $employee = $employeeCache[$machineId];
            
            if (!$employee) continue;

            $shiftContext = $this->attendanceService->findTargetShift($employee, $timestamp);
            $shift = $shiftContext['shift'];
            $logicalDate = $shiftContext['tanggal'];
            $shiftId = $shift ? $shift->id : 0;

            if (!isset($buckets[$logicalDate])) $buckets[$logicalDate] = [];
            if (!isset($buckets[$logicalDate][$machineId])) $buckets[$logicalDate][$machineId] = [];
            if (!isset($buckets[$logicalDate][$machineId][$shiftId])) $buckets[$logicalDate][$machineId][$shiftId] = ['logs' => [], 'shift' => $shift, 'employee' => $employee];

            $buckets[$logicalDate][$machineId][$shiftId]['logs'][] = $timestamp->copy();
        }

        $updatedCount = 0;
        $createdCount = 0;

        foreach ($buckets as $date => $machineGroup) {
            foreach ($machineGroup as $machineId => $shiftGroup) {
                foreach ($shiftGroup as $shiftId => $data) {
                    $employee = $data['employee'];
                    $shift = $data['shift'];
                    $logs = collect($data['logs'])->sort();
                    
                    $machineFirst = $logs->first();
                    $machineLast = $logs->last();

                    // If only one tap or taps within 5 mins, treat as one distinct event
                    if ($logs->count() > 1 && abs($machineLast->diffInMinutes($machineFirst)) <= 5) {
                        $machineLast = null;
                    } elseif ($logs->count() === 1) {
                        $machineLast = null;
                    }

                    $this->info("Processing {$employee->nama} for Date: {$date} | Shift: " . ($shift ? $shift->name : 'None'));

                    $empTimezone = $this->attendanceService->getEmployeeTimezone($employee);
                    $machineClockIn = Carbon::parse($machineFirst->format('Y-m-d H:i:s'), $empTimezone);
                    $machineClockOut = $machineLast ? Carbon::parse($machineLast->format('Y-m-d H:i:s'), $empTimezone) : null;

                    // Single Tap classification
                    if ($machineClockIn && $machineClockOut === null && $shift) {
                        $shiftStart = Carbon::parse($date . ' ' . $shift->jam_masuk, $empTimezone);
                        $shiftEnd = Carbon::parse($date . ' ' . $shift->jam_pulang, $empTimezone);
                        if ($shiftEnd->lt($shiftStart)) $shiftEnd->addDay();
                        
                        $midpoint = $shiftStart->copy()->addMinutes($shiftStart->diffInMinutes($shiftEnd) / 2);
                        if ($machineClockIn->gt($midpoint)) {
                            $machineClockOut = $machineClockIn;
                            $machineClockIn = null;
                        }
                    }

                    $existingAttendance = Attendance::where('employee_id', $employee->id)
                        ->where('tanggal', $date)
                        ->where('shift_id', $shiftId > 0 ? $shiftId : null)
                        ->first();

                    if ($existingAttendance) {
                        $appClockIn = $existingAttendance->clock_in ? Carbon::parse($existingAttendance->clock_in, $empTimezone) : null;
                        $appClockOut = $existingAttendance->clock_out ? Carbon::parse($existingAttendance->clock_out, $empTimezone) : null;

                        // Earliest IN / Latest OUT logic
                        $finalClockIn = $appClockIn;
                        if ($machineClockIn) {
                            if (!$appClockIn || $appClockIn->format('H:i:s') === '00:00:00' || $machineClockIn->lt($appClockIn)) {
                                $finalClockIn = $machineClockIn;
                            }
                        }

                        $finalClockOut = $appClockOut;
                        if ($machineClockOut) {
                            if (!$appClockOut || $machineClockOut->gt($appClockOut)) {
                                $finalClockOut = $machineClockOut;
                            }
                        }

                        $hasChanged = false;
                        if ($finalClockIn && (!$appClockIn || $finalClockIn->toDateTimeString() !== $appClockIn->toDateTimeString())) $hasChanged = true;
                        if ($finalClockOut && (!$appClockOut || ($appClockOut && $finalClockOut->toDateTimeString() !== $appClockOut->toDateTimeString()) || !$appClockOut)) $hasChanged = true;

                        if ($hasChanged) {
                            $metricsIn = $finalClockIn ? $this->attendanceService->calculateMetrics($employee, $finalClockIn, $shift, false, $existingAttendance) : [];
                            $metricsOut = $finalClockOut ? $this->attendanceService->calculateMetrics($employee, $finalClockOut, $shift, true, $existingAttendance) : [];

                            $existingAttendance->update([
                                'clock_in' => $finalClockIn?->format('Y-m-d H:i:s'),
                                'clock_out' => $finalClockOut?->format('Y-m-d H:i:s'),
                                'early_in_minutes' => $metricsIn['early_in_minutes'] ?? $existingAttendance->early_in_minutes,
                                'late_in_minutes' => $metricsIn['late_in_minutes'] ?? $existingAttendance->late_in_minutes,
                                'is_late' => isset($metricsIn['late_in_minutes']) ? $metricsIn['late_in_minutes'] > 0 : $existingAttendance->is_late,
                                'late_minutes' => $metricsIn['late_in_minutes'] ?? $existingAttendance->late_minutes,
                                'early_out_minutes' => $metricsOut['early_out_minutes'] ?? $existingAttendance->early_out_minutes,
                                'late_out_minutes' => $metricsOut['late_out_minutes'] ?? $existingAttendance->late_out_minutes,
                                'overtime_minutes' => $metricsOut['overtime_minutes'] ?? $existingAttendance->overtime_minutes,
                            ]);
                            $updatedCount++;
                        }
                    } else {
                        // Create NEW
                        $metricsIn = $machineClockIn ? $this->attendanceService->calculateMetrics($employee, $machineClockIn, $shift, false) : [];
                        $metricsOut = $machineClockOut ? $this->attendanceService->calculateMetrics($employee, $machineClockOut, $shift, true) : [];

                        Attendance::create([
                            'employee_id' => $employee->id,
                            'tanggal' => $date,
                            'shift_id' => $shiftId > 0 ? $shiftId : null,
                            'clock_in' => $machineClockIn?->format('Y-m-d H:i:s'),
                            'clock_out' => $machineClockOut?->format('Y-m-d H:i:s'),
                            'jam_masuk' => $shift?->jam_masuk,
                            'jam_pulang' => $shift?->jam_pulang,
                            'shift_name' => $shift?->name,
                            'status' => 'hadir',
                            'early_in_minutes' => $metricsIn['early_in_minutes'] ?? 0,
                            'late_in_minutes' => $metricsIn['late_in_minutes'] ?? 0,
                            'is_late' => ($metricsIn['late_in_minutes'] ?? 0) > 0,
                            'late_minutes' => $metricsIn['late_in_minutes'] ?? 0,
                            'early_out_minutes' => $metricsOut['early_out_minutes'] ?? 0,
                            'late_out_minutes' => $metricsOut['late_out_minutes'] ?? 0,
                            'overtime_minutes' => $metricsOut['overtime_minutes'] ?? 0,
                            'notes' => '[X601 Machine]',
                        ]);
                        $createdCount++;
                    }
                }
            }
        }
        
        $this->info("Sync Complete! Created: {$createdCount}, Updated: {$updatedCount}.");
        
        $this->info("Sync Complete! Created: {$createdCount}, Updated: {$updatedCount}.");
    }
}
