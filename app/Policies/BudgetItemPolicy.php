<?php

namespace App\Policies;

use App\Models\BudgetItem;
use App\Models\User;

class BudgetItemPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->hasPermission('cost_control.view');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->hasPermission('cost_control.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ?BudgetItem $budgetItem = null): bool
    {
        return $user->isAdmin() || $user->hasPermission('cost_control.update');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ?BudgetItem $budgetItem = null): bool
    {
        return $user->isAdmin() || $user->hasPermission('cost_control.delete');
    }
}
