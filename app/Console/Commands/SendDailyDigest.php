<?php

namespace App\Console\Commands;

use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\PaymentRequest;
use App\Models\User;
use App\Notifications\DailyDigestNotification;
use Illuminate\Console\Command;

class SendDailyDigest extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-daily-digest';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send morning digest of pending approvals and tasks at 9:00 AM';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = User::whereHas('employee', function($q) {
            $q->where('is_active', true);
        })->with(['employee.tasksAssigned', 'permissions'])->get();

        $countNotified = 0;

        foreach ($users as $user) {
            $employee = $user->employee;
            
            // 1. Calculate Pending Payment Requests for this user
            $prCount = 0;
            $prPermissions = $user->permissions->pluck('slug')->filter(fn($s) => str_starts_with($s, 'pr.approve.'))->map(fn($s) => str_replace('pr.approve.', '', $s));
            
            if ($prPermissions->isNotEmpty()) {
                foreach ($prPermissions as $level) {
                    $prCount += PaymentRequest::where("{$level}_status", 'pending')
                        ->where(function($q) use ($employee) {
                            // Match same branch or same company logic
                            $q->where('working_location_id', $employee->working_location_id)
                              ->orWhere('company_id', $employee->work_location_id);
                        })->count();
                }
            }

            // 2. Calculate Pending Leave Requests for this user (Supervisor/Manager)
            $leaveCount = 0;
            $leaveCount += LeaveRequest::where('approved_by_supervisor_id', $employee->id)
                ->where('supervisor_status', 'pending')
                ->where('status', 'pending')
                ->count();
            
            $leaveCount += LeaveRequest::where('approved_by_manager_id', $employee->id)
                ->where('manager_status', 'pending')
                ->where('status', 'partially_approved')
                ->count();

            // 3. Calculate Overdue/Pending Tasks
            $taskCount = $employee->tasksAssigned()
                ->where('is_completed', false)
                ->where('is_active', true)
                ->get()
                ->filter(fn($task) => $task->shouldShowReminder())
                ->count();

            // Send notification if anything is pending
            if ($prCount > 0 || $leaveCount > 0 || $taskCount > 0) {
                // Keep the original system notification
                $user->notify(new DailyDigestNotification($prCount, $leaveCount, $taskCount));
                
                // Add Mobile FCM Notification
                \App\Services\FirebaseService::sendToUser(
                    $user, 
                    'Ringkasan Hari Ini', 
                    "Anda memiliki " . ($prCount ? "$prCount PR, " : "") . ($leaveCount ? "$leaveCount Cuti, " : "") . ($taskCount ? "$taskCount Tugas" : "") . " pending.",
                    ['screen' => '/dashboard']
                );
                
                $countNotified++;
            }
        }

        $this->info("Successfully sent daily digests to {$countNotified} users.");
    }
}
