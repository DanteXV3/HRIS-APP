<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Attendance;

$affectedCount = 0;
// Fix all negative durations to positive integers
$attendances = Attendance::where('late_in_minutes', '<', 0)
    ->orWhere('early_out_minutes', '<', 0)
    ->orWhere('late_out_minutes', '<', 0)
    ->orWhere('early_in_minutes', '<', 0)
    ->get();

foreach ($attendances as $att) {
    $att->update([
        'late_in_minutes' => abs(round($att->late_in_minutes)),
        'early_out_minutes' => abs(round($att->early_out_minutes)),
        'late_out_minutes' => abs(round($att->late_out_minutes)),
        'early_in_minutes' => abs(round($att->early_in_minutes)),
        'overtime_minutes' => abs(round($att->overtime_minutes)),
        'verified_lembur_minutes' => abs(round($att->verified_lembur_minutes)),
    ]);
    $affectedCount++;
}

echo "Fixed $affectedCount attendance records.\n";
