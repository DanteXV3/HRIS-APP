<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class InitializeAnnualLeaveBalances extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'leaves:initialize-balances {--year= : The year to initialize balances for} {--employee= : Employee NIK to initialize for only one employee}';
    protected $description = 'Initialize or reset annual leave balances for employees based on hire date rules';

    public function handle(\App\Services\LeaveBalanceService $service)
    {
        $year = $this->option('year') ?: now()->year;
        $nik = $this->option('employee');

        if ($nik) {
            $employee = \App\Models\Employee::where('nik', $nik)->first();
            if (!$employee) {
                $this->error("Employee with NIK {$nik} not found.");
                return 1;
            }
            $entitlement = $service->calculateAnnualLeaveEntitlement($employee, (int)$year);
            \App\Models\LeaveBalance::updateOrCreate(
                [
                    'employee_id' => $employee->id,
                    'leave_type_id' => \App\Models\LeaveType::where('name', 'Cuti Tahunan')->first()->id,
                    'year' => (int)$year,
                ],
                ['total_days' => $entitlement]
            );
            $this->info("Initialized balance for {$employee->nama} for year {$year}: {$entitlement} days.");
        } else {
            $service->initializeYearlyBalances((int)$year);
            $this->info("Initialized annual leave balances for all active employees for year {$year}.");
        }

        return 0;
    }
}
