<?php

namespace App\Console\Commands;

use App\Models\Attendance;
use App\Notifications\ClockOutReminderNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;

class RemindClockOut extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:remind-clock-out';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remind employees to clock out 1 hour after their shift ends';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = now()->toDateString();
        $now = now();

        $attendances = Attendance::where('tanggal', $today)
            ->whereNotNull('clock_in')
            ->whereNull('clock_out')
            ->with(['employee.shifts', 'employee.user'])
            ->get();

        $countNotified = 0;

        foreach ($attendances as $attendance) {
            $employee = $attendance->employee;
            if (!$employee || !$employee->user) continue;

            $shift = $employee->shifts->first();
            if (!$shift || !$shift->jam_pulang) continue;

            // Shift end time as a Carbon instance on the current day
            try {
                $shiftEnd = Carbon::createFromFormat('H:i:s', $shift->jam_pulang);
                $reminderTime = $shiftEnd->copy()->addHour();

                // If currently it's past shift end + 1 hour, send reminder
                if ($now->greaterThan($reminderTime)) {
                    // Check if we already notified recently to avoid spam (e.g., notify once per day)
                    // For now, we'll send it. Ideally, we track last_notified_at.
                    // But if this runs every 15-30 mins, it might be okay for urgent alerts.
                    $employee->user->notify(new ClockOutReminderNotification($shift->jam_pulang));
                    $countNotified++;
                }
            } catch (\Exception $e) {
                continue;
            }
        }

        $this->info("Successfully sent clock-out reminders to {$countNotified} employees.");
    }
}
