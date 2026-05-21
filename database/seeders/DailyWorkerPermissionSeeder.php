<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class DailyWorkerPermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Daily Worker List
            [
                'name' => 'Manage Local Daily Workers',
                'slug' => 'daily_worker.manage_local',
                'module' => 'Daily Worker',
            ],
            [
                'name' => 'Manage All Daily Workers',
                'slug' => 'daily_worker.manage_all',
                'module' => 'Daily Worker',
            ],
            // Attendance
            [
                'name' => 'Manage Local DW Attendance',
                'slug' => 'daily_worker_attendance.manage_local',
                'module' => 'Daily Worker',
            ],
            [
                'name' => 'Manage All DW Attendance',
                'slug' => 'daily_worker_attendance.manage_all',
                'module' => 'Daily Worker',
            ],
            // Activity Reports
            [
                'name' => 'Manage Local DW Activity',
                'slug' => 'daily_worker_activity.manage_local',
                'module' => 'Daily Worker',
            ],
            [
                'name' => 'Manage All DW Activity',
                'slug' => 'daily_worker_activity.manage_all',
                'module' => 'Daily Worker',
            ],
            // Payroll
            [
                'name' => 'Manage Local DW Payroll',
                'slug' => 'daily_worker_payroll.manage_local',
                'module' => 'Daily Worker',
            ],
            [
                'name' => 'Manage All DW Payroll',
                'slug' => 'daily_worker_payroll.manage_all',
                'module' => 'Daily Worker',
            ],
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['slug' => $perm['slug']], $perm);
        }
    }
}
