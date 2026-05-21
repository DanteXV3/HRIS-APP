<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class ExpenseEstimatePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $perms = [
            ['name' => 'Can create expense estimates', 'slug' => 'expense_estimate.create', 'module' => 'Estimasi Pengeluaran'],
            ['name' => 'Can edit as Cost Control', 'slug' => 'expense_estimate.edit_cc', 'module' => 'Estimasi Pengeluaran'],
            ['name' => 'Can edit as Finance', 'slug' => 'expense_estimate.edit_finance', 'module' => 'Estimasi Pengeluaran'],
        ];
        foreach ($perms as $p) {
            Permission::firstOrCreate(['slug' => $p['slug']], $p);
        }
    }
}
