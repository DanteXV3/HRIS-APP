<?php

namespace Database\Seeders;

use App\Models\LeaveType;
use Illuminate\Database\Seeder;

class LeaveTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['name' => 'Cuti Tahunan', 'max_days' => 12, 'is_paid' => true, 'requires_attachment' => false],
            ['name' => 'Cuti Sakit', 'max_days' => 0, 'is_paid' => true, 'requires_attachment' => true],
            ['name' => 'Cuti Melahirkan', 'max_days' => 90, 'is_paid' => true, 'requires_attachment' => true],
            ['name' => 'Cuti Menikah', 'max_days' => 3, 'is_paid' => true, 'requires_attachment' => true],
            ['name' => 'Cuti Kematian Keluarga', 'max_days' => 3, 'is_paid' => true, 'requires_attachment' => false],
            ['name' => 'Izin Tidak Masuk', 'max_days' => 0, 'is_paid' => false, 'requires_attachment' => false],
            ['name' => 'Cuti Khitanan Anak', 'max_days' => 2, 'is_paid' => true, 'requires_attachment' => false],
            ['name' => 'Cuti Baptis Anak', 'max_days' => 2, 'is_paid' => true, 'requires_attachment' => false],
        ];

        foreach ($types as $type) {
            LeaveType::firstOrCreate(['name' => $type['name']], $type);
        }
    }
}
