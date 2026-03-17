<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['name' => 'Human Resources', 'code' => 'HR'],
            ['name' => 'Finance & Accounting', 'code' => 'FIN'],
            ['name' => 'Information Technology', 'code' => 'IT'],
            ['name' => 'Marketing', 'code' => 'MKT'],
            ['name' => 'Operations', 'code' => 'OPS'],
            ['name' => 'Sales', 'code' => 'SLS'],
            ['name' => 'General Affairs', 'code' => 'GA'],
            ['name' => 'Legal', 'code' => 'LGL'],
            ['name' => 'Procurement', 'code' => 'PRC'],
            ['name' => 'Production', 'code' => 'PRD'],
        ];

        foreach ($departments as $dept) {
            Department::firstOrCreate(['code' => $dept['code']], $dept);
        }
    }
}
