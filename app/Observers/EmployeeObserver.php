<?php

namespace App\Observers;

use App\Models\Employee;
use App\Models\EmployeeSalaryLog;
use Illuminate\Support\Facades\Auth;

class EmployeeObserver
{
    /**
     * Salary-related fields to watch for changes.
     * Any change to these fields will be recorded in employee_salary_logs.
     */
    private const SALARY_FIELDS = [
        'gaji_pokok',
        'tunjangan_jabatan',
        'tunjangan_kehadiran',
        'tunjangan_transportasi',
        'uang_makan',
        'uang_lembur',
        'thr',
        'gaji_bpjs_tk',
        'gaji_bpjs_jkn',
        'gross_up',
        'pinjaman_koperasi',
        'potongan_lain_1',
        'potongan_lain_2',
    ];

    /**
     * Handle the Employee "updating" event.
     * Fires BEFORE the save, so we can capture both old and new values.
     */
    public function updating(Employee $employee): void
    {
        $changedFields = [];
        $before        = [];
        $after         = [];

        foreach (self::SALARY_FIELDS as $field) {
            // isDirty() checks if the attribute is different from what's in the DB
            if ($employee->isDirty($field)) {
                $changedFields[] = $field;
                $before[$field]  = $employee->getOriginal($field);
                $after[$field]   = $employee->getAttribute($field);
            }
        }

        // Only write a log entry if at least one salary field actually changed
        if (empty($changedFields)) {
            return;
        }

        EmployeeSalaryLog::create([
            'employee_id'    => $employee->id,
            'changed_by'     => Auth::id(),
            'before'         => $before,
            'after'          => $after,
            'changed_fields' => $changedFields,
        ]);
    }
}
