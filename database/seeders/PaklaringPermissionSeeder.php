<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PaklaringPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            ['name' => 'Can see all paklarings', 'slug' => 'paklaring.view', 'module' => 'Paklaring'],
            ['name' => 'Can create paklarings', 'slug' => 'paklaring.create', 'module' => 'Paklaring'],
            ['name' => 'Can edit paklarings', 'slug' => 'paklaring.edit', 'module' => 'Paklaring'],
            ['name' => 'Can delete paklarings', 'slug' => 'paklaring.delete', 'module' => 'Paklaring'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['slug' => $permission['slug']], $permission);
        }
    }
}
