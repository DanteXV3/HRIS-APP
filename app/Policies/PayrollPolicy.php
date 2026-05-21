<?php

namespace App\Policies;

use App\Models\Payroll;
use App\Models\User;

class PayrollPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->hasPermission('payroll.view');
    }

    public function view(User $user, Payroll $payroll): bool
    {
        if ($user->isAdmin() || $user->hasPermission('payroll.view')) {
            return true;
        }

        // Karyawan can view their own payroll if finalized
        if ($payroll->status === 'finalized') {
            return $payroll->items()->where('employee_id', $user->employee?->id)->exists();
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->hasPermission('payroll.create');
    }

    public function update(User $user, Payroll $payroll): bool
    {
        return $user->isAdmin() || $user->hasPermission('payroll.edit');
    }

    public function delete(User $user, Payroll $payroll): bool
    {
        return $user->isAdmin() || $user->hasPermission('payroll.create');
    }

    public function finalize(User $user, Payroll $payroll): bool
    {
        return $user->isAdmin() || $user->hasPermission('payroll.finalize');
    }
}
