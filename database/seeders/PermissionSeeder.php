<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // Attendance
            ['name' => 'Can see others absensi', 'slug' => 'attendance.view_others', 'module' => 'Attendance'],
            ['name' => 'Can add others absensi', 'slug' => 'attendance.create_others', 'module' => 'Attendance'],
            ['name' => 'Can modify others absensi', 'slug' => 'attendance.edit_others', 'module' => 'Attendance'],
            
            // Leave
            ['name' => 'Can perform first approval for leave', 'slug' => 'leave.first_approval', 'module' => 'Leave'],
            ['name' => 'Can perform second approval for leave', 'slug' => 'leave.second_approval', 'module' => 'Leave'],
            ['name' => 'Can see all leave requests', 'slug' => 'leave.view_others', 'module' => 'Leave'],
            ['name' => 'Can see all leave history', 'slug' => 'leave.view_history', 'module' => 'Leave'],

            // Evaluation
            ['name' => 'Can see evaluation reminders', 'slug' => 'evaluation.view', 'module' => 'Evaluation'],
            ['name' => 'Can manage (mark done) evaluations', 'slug' => 'evaluation.manage', 'module' => 'Evaluation'],

            // Employee
            ['name' => 'Can see all employees', 'slug' => 'employee.view', 'module' => 'Employee'],
            ['name' => 'Can create employees', 'slug' => 'employee.create', 'module' => 'Employee'],
            ['name' => 'Can edit employees', 'slug' => 'employee.edit', 'module' => 'Employee'],

            // Payroll
            ['name' => 'Can see payroll history', 'slug' => 'payroll.view', 'module' => 'Payroll'],
            ['name' => 'Can generate payroll', 'slug' => 'payroll.create', 'module' => 'Payroll'],
            ['name' => 'Can modify payroll data', 'slug' => 'payroll.edit', 'module' => 'Payroll'],
            ['name' => 'Can finalize payroll', 'slug' => 'payroll.finalize', 'module' => 'Payroll'],

            // Master Data (Kamus)
            ['name' => 'Can manage departments', 'slug' => 'department.manage', 'module' => 'Master Data'],
            ['name' => 'Can manage positions', 'slug' => 'position.manage', 'module' => 'Master Data'],
            ['name' => 'Can manage shifts', 'slug' => 'shift.manage', 'module' => 'Master Data'],
            ['name' => 'Can manage work locations', 'slug' => 'location.manage', 'module' => 'Master Data'],

            // Exit Permit
            ['name' => 'Can see others exit permits', 'slug' => 'exit_permit.view_others', 'module' => 'Exit Permit'],
        ];

        foreach ($permissions as $permission) {
            \App\Models\Permission::firstOrCreate(['slug' => $permission['slug']], $permission);
        }
    }
}
