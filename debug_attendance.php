<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Attendance;
use App\Models\Employee;

$employee = Employee::where('nik', 'ADM-001')->first();
if (!$employee) {
    echo "Employee ADM-001 not found\n";
    exit;
}

$attendances = Attendance::where('employee_id', $employee->id)
    ->orderBy('tanggal', 'desc')
    ->limit(5)
    ->get();

if ($attendances->isEmpty()) {
    echo "No attendances found for ADM-001\n";
    exit;
}

foreach ($attendances as $attendance) {
    echo "--- Attendance Data for " . $attendance->tanggal . " ---\n";
    echo "Clock In: " . $attendance->clock_in . "\n";
    echo "Clock Out: " . $attendance->clock_out . "\n";
    echo "Jam Masuk: " . $attendance->jam_masuk . "\n";
    echo "Jam Pulang: " . $attendance->jam_pulang . "\n";
    echo "Late In Minutes: " . $attendance->late_in_minutes . "\n";
    echo "Early Out Minutes: " . $attendance->early_out_minutes . "\n";
    echo "Overtime Minutes: " . $attendance->overtime_minutes . "\n";
    echo "Status: " . $attendance->status . "\n";
}
