<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class MaterialServiceRequestPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            ['name' => 'can create MSR', 'slug' => 'msr.create', 'module' => 'Material & Service Request'],
            ['name' => 'can approve as supervisor / manager', 'slug' => 'msr.approve_supervisor', 'module' => 'Material & Service Request'],
            ['name' => 'can approve as manager', 'slug' => 'msr.approve_manager', 'module' => 'Material & Service Request'],
            ['name' => 'can approve as HRD', 'slug' => 'msr.approve_hrd', 'module' => 'Material & Service Request'],
            ['name' => 'can approve as Procurement', 'slug' => 'msr.approve_procurement', 'module' => 'Material & Service Request'],
            ['name' => 'can approve as GA', 'slug' => 'msr.approve_ga', 'module' => 'Material & Service Request'],
            ['name' => 'can approve as finance', 'slug' => 'msr.approve_finance', 'module' => 'Material & Service Request'],
            // View All standard for HR/Admin
            ['name' => 'view all Material & Service Request', 'slug' => 'msr.view_all', 'module' => 'Material & Service Request'],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(['slug' => $permission['slug']], $permission);
        }
    }
}
