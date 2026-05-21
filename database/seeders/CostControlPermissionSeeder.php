<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class CostControlPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            ['name' => 'view budget items', 'slug' => 'cost_control.view', 'module' => 'Cost Control'],
            ['name' => 'create budget items', 'slug' => 'cost_control.create', 'module' => 'Cost Control'],
            ['name' => 'update budget items', 'slug' => 'cost_control.update', 'module' => 'Cost Control'],
            ['name' => 'delete budget items', 'slug' => 'cost_control.delete', 'module' => 'Cost Control'],
            ['name' => 'view summary budgeting', 'slug' => 'cost_control.view_summary', 'module' => 'Cost Control'],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(['slug' => $permission['slug']], $permission);
        }
    }
}
