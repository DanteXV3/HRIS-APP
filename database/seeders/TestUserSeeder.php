<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Position;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    public function run(): void
    {
        // Create positions in Operations (dept 5) if needed
        $spvPosition = Position::firstOrCreate(
            ['name' => 'Operations Supervisor', 'department_id' => 5],
            ['grade' => 'supervisor']
        );
        $mgrPosition = Position::firstOrCreate(
            ['name' => 'Operations Manager', 'department_id' => 5],
            ['grade' => 'manager']
        );
        $staffPosition = Position::firstOrCreate(
            ['name' => 'Operations Staff', 'department_id' => 5],
            ['grade' => 'staff']
        );

        // --- Staff User ---
        $staffUser = User::firstOrCreate(
            ['email' => 'staff@test.com'],
            ['name' => 'Budi Santoso', 'password' => Hash::make('password'), 'role' => 'staff']
        );
        Employee::firstOrCreate(
            ['user_id' => $staffUser->id],
            [
                'nama' => 'Budi Santoso',
                'nik' => 'EMP-STAFF-001',
                'email' => 'staff@test.com',
                'department_id' => 5,
                'position_id' => $staffPosition->id,
                'status_kepegawaian' => 'Tetap',
                'hire_date' => '2024-01-15',
                'is_active' => true,
                'no_telpon_1' => '081234567001',
                'gaji_pokok' => 5000000,
            ]
        );

        // --- Supervisor User ---
        $spvUser = User::firstOrCreate(
            ['email' => 'supervisor@test.com'],
            ['name' => 'Siti Rahmawati', 'password' => Hash::make('password'), 'role' => 'supervisor']
        );
        Employee::firstOrCreate(
            ['user_id' => $spvUser->id],
            [
                'nama' => 'Siti Rahmawati',
                'nik' => 'EMP-SPV-001',
                'email' => 'supervisor@test.com',
                'department_id' => 5,
                'position_id' => $spvPosition->id,
                'status_kepegawaian' => 'Tetap',
                'hire_date' => '2022-06-01',
                'is_active' => true,
                'no_telpon_1' => '081234567002',
                'gaji_pokok' => 8000000,
            ]
        );

        // --- Manager User ---
        $mgrUser = User::firstOrCreate(
            ['email' => 'manager@test.com'],
            ['name' => 'Andi Wijaya', 'password' => Hash::make('password'), 'role' => 'manager']
        );
        Employee::firstOrCreate(
            ['user_id' => $mgrUser->id],
            [
                'nama' => 'Andi Wijaya',
                'nik' => 'EMP-MGR-001',
                'email' => 'manager@test.com',
                'department_id' => 5,
                'position_id' => $mgrPosition->id,
                'status_kepegawaian' => 'Tetap',
                'hire_date' => '2020-03-10',
                'is_active' => true,
                'no_telpon_1' => '081234567003',
                'gaji_pokok' => 15000000,
            ]
        );

        $this->command->info('Test users seeded:');
        $this->command->table(
            ['Email', 'Password', 'Role', 'Name', 'Department'],
            [
                ['staff@test.com', 'password', 'staff', 'Budi Santoso', 'Operations'],
                ['supervisor@test.com', 'password', 'supervisor', 'Siti Rahmawati', 'Operations'],
                ['manager@test.com', 'password', 'manager', 'Andi Wijaya', 'Operations'],
            ]
        );
    }
}
