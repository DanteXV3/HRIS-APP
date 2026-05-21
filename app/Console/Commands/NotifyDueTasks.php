<?php

namespace App\Console\Commands;

use App\Models\Employee;
use App\Notifications\TaskReminderNotification;
use Illuminate\Console\Command;

class NotifyDueTasks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:notify-due-tasks';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send daily task reminders to employees at 9:00 AM';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $employees = Employee::where('is_active', true)
            ->whereNotNull('user_id')
            ->with(['user', 'tasksAssigned'])
            ->get();

        $countNotified = 0;

        foreach ($employees as $employee) {
            if (!$employee->user) continue;

            $taskCount = $employee->tasksAssigned()
                ->where('is_completed', false)
                ->where('is_active', true)
                ->get()
                ->filter(fn($task) => $task->shouldShowReminder())
                ->count();

            if ($taskCount > 0) {
                $employee->user->notify(new TaskReminderNotification($taskCount));
                $countNotified++;
            }
        }

        $this->info("Successfully sent task reminders to {$countNotified} employees.");
    }
}
