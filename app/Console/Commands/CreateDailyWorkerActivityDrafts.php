<?php

namespace App\Console\Commands;

use App\Models\DailyWorker;
use App\Models\DailyWorkerActivityReport;
use App\Models\DailyWorkerActivityReportItem;
use App\Models\WorkingLocation;
use Illuminate\Console\Command;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CreateDailyWorkerActivityDrafts extends Command
{
    protected $signature = 'app:create-dw-activity-drafts';
    protected $description = 'Create daily worker activity report drafts for all locations at 7 AM';

    public function handle()
    {
        $today = Carbon::today();
        $locations = WorkingLocation::all();

        foreach ($locations as $location) {
            $existing = DailyWorkerActivityReport::where('working_location_id', $location->id)
                ->whereDate('tanggal', $today)
                ->exists();

            if (!$existing) {
                DB::transaction(function () use ($location, $today) {
                    $report = DailyWorkerActivityReport::create([
                        'working_location_id' => $location->id,
                        'tanggal' => $today,
                        'is_finalized' => false,
                    ]);

                    // Use the service to populate items correctly
                    (new \App\Services\DailyWorkerService)->syncActivityReportAttendance($report);
                });
                $this->info("Created draft and synced items for location: {$location->name}");
            } else {
                $report = DailyWorkerActivityReport::where('working_location_id', $location->id)
                    ->whereDate('tanggal', $today)
                    ->first();
                (new \App\Services\DailyWorkerService)->syncActivityReportAttendance($report);
                $this->info("Draft already exists, synced items for location: {$location->name}");
            }
        }
    }
}
