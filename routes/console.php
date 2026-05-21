<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Daily Task Reminders at 9:00 AM
Schedule::command('app:notify-due-tasks')->dailyAt('09:00');

// Daily Worker Activity Report Drafts at 7:00 AM
// Schedule::command('app:create-dw-activity-drafts')->dailyAt('07:00');

// Clock-out reminders every 30 minutes
Schedule::command('app:remind-clock-out')->everyThirtyMinutes();

// Sync X601 Machine Attendance every 5 minutes
Schedule::command('sync:x601')->everyFiveMinutes()->withoutOverlapping();
