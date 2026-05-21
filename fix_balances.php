<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\LeaveRequest;
use App\Models\LeaveBalance;
use App\Models\LeaveType;
use App\Services\LeaveBalanceService;
use Carbon\Carbon;

// Reset all used_days to 0 for Cuti Tahunan for all years
LeaveBalance::query()->update(['used_days' => 0]);

$cutiTahunan = LeaveType::where('name', 'Cuti Tahunan')->first();
if (!$cutiTahunan) die("Cuti Tahunan not found");

$leaves = LeaveRequest::where('status', 'approved')->where('leave_type_id', $cutiTahunan->id)->get();
$service = app(LeaveBalanceService::class);

foreach($leaves as $leave) {
    if (!$leave->employee) continue;

    $year = Carbon::parse($leave->tanggal_mulai)->year;
    
    $balance = LeaveBalance::where('employee_id', $leave->employee_id)
        ->where('leave_type_id', $leave->leave_type_id)
        ->where('year', $year)
        ->first();

    if (!$balance) {
        $entitlement = $service->calculateAnnualLeaveEntitlement($leave->employee, $year);
        $balance = LeaveBalance::create([
            'employee_id' => $leave->employee_id,
            'leave_type_id' => $leave->leave_type_id,
            'year' => $year,
            'total_days' => $entitlement,
            'used_days' => 0,
        ]);
    }
    
    $balance->increment('used_days', $leave->jumlah_hari);
}
echo "All balances fixed based on actual approved requests.\n";
