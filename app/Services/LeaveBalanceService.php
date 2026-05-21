<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\LeaveBalance;
use App\Models\LeaveType;
use Carbon\Carbon;

class LeaveBalanceService
{
    /**
     * Calculate how many annual leave days an employee is entitled to for a specific year.
     * 
     * Rule:
     * 1. Hire year: 0 days
     * 2. Year after hire: 12 - month(hire_date)
     * 3. Subsequent years: 12 days
     */
    public function calculateAnnualLeaveEntitlement(Employee $employee, int $year): int
    {
        if (!$employee->hire_date) {
            return 0;
        }

        $hireDate = Carbon::parse($employee->hire_date);
        $hireYear = $hireDate->year;
        $hireMonth = $hireDate->month;

        // 1. Employee who join this year could not have annual leave this year
        if ($hireYear >= $year) {
            return 0;
        }

        // 2. Year immediately after hire year (pro-rated)
        if ($hireYear === $year - 1) {
            return max(0, 12 - $hireMonth);
        }

        // 3. Subsequent years
        return 12;
    }

    /**
     * Initialize or reset annual leave balances for all active employees for a given year.
     */
    public function initializeYearlyBalances(int $year)
    {
        $annualLeaveType = LeaveType::where('name', 'Cuti Tahunan')->first();
        if (!$annualLeaveType) {
            return;
        }

        $employees = Employee::where('is_active', true)->get();

        foreach ($employees as $employee) {
            $entitlement = $this->calculateAnnualLeaveEntitlement($employee, $year);

            LeaveBalance::updateOrCreate(
                [
                    'employee_id' => $employee->id,
                    'leave_type_id' => $annualLeaveType->id,
                    'year' => $year,
                ],
                [
                    'total_days' => $entitlement,
                    // If it's a new balance, used_days starts at 0. 
                    // If updating existing, we probably shouldn't reset used_days unless it's a hard reset.
                    // But usually, Jan 1st initialization means used_days = 0.
                ]
            );
        }
    }
}
