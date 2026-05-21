<?php

namespace App\Policies;

use App\Models\Contract;
use App\Models\User;

class ContractPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->hasPermission('contract.view') || $user->hasPermission('contract.create');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Contract $contract): bool
    {
        if ($user->isAdmin() || $user->hasPermission('contract.view') || $user->hasPermission('contract.create')) {
            return true;
        }

        // Employee can view their own contract
        return $user->employee?->id === $contract->employee_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->hasPermission('contract.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Contract $contract): bool
    {
        return $user->isAdmin() || $user->hasPermission('contract.create');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Contract $contract): bool
    {
        return $user->isAdmin() || $user->hasPermission('contract.create');
    }
}
