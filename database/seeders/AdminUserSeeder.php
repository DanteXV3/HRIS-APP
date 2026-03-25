<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Position;
use App\Models\User;
use App\Models\WorkLocation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure HR department exists
        $hrDept = Department::firstOrCreate(
            ['code' => 'HR'],
            ['name' => 'Human Resources']
        );

        // Ensure HR Manager position exists
        $hrManagerPosition = Position::firstOrCreate(
            ['name' => 'HR Manager', 'department_id' => $hrDept->id],
            ['grade' => 'manager']
        );

        // Ensure default work location (company)
        $location = WorkLocation::firstOrCreate(
            ['code' => 'PST'], // Kantor Pusat
            ['name' => 'Kantor Pusat', 'address' => 'Jakarta']
        );

        // Create super admin user (no linked employee)
        User::firstOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'Super Admin',
                'role' => 'admin',
                'password' => Hash::make('password'),
            ]
        );

        // Create secondary admin user
        $user = User::firstOrCreate(
            ['email' => 'dante.exreaper@gmail.com'],
            [
                'name' => 'Administrator',
                'role' => 'admin',
                'password' => Hash::make('password'),
            ]
        );

        // Create linked employee record
        Employee::firstOrCreate(
            ['nik' => 'ADM-001'],
            [
                'user_id' => $user->id,
                'nama' => 'Administrator',
                'email' => 'dante.exreaper@gmail.com',
                'department_id' => $hrDept->id,
                'position_id' => $hrManagerPosition->id,
                'work_location_id' => $location->id,
                'status_kepegawaian' => 'tetap',
                'hire_date' => '2026-01-01',
                'is_active' => true,
            ]
        );
    }
}
