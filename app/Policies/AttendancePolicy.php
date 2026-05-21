<?php

namespace App\Policies;

use App\Models\Attendance;
use App\Models\User;

class AttendancePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->hasPermission('attendance.view_others');
    }

    public function view(User $user, Attendance $attendance): bool
    {
        if ($user->isAdmin() || $user->hasPermission('attendance.view_others')) {
            return true;
        }
        return $user->id === $attendance->employee?->user_id;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->hasPermission('attendance.create_others');
    }

    public function update(User $user, Attendance $attendance): bool
    {
        return $user->isAdmin() || $user->hasPermission('attendance.edit_others');
    }

    public function delete(User $user, Attendance $attendance): bool
    {
        return $user->isAdmin() || $user->hasPermission('attendance.edit_others');
    }
}
