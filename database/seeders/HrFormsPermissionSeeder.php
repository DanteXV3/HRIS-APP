<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class HrFormsPermissionSeeder extends Seeder
{
    public function run(): void
    {
        $modules = [
            ['slug_prefix' => 'appointment', 'module' => 'Surat Pengangkatan'],
            ['slug_prefix' => 'offering', 'module' => 'Offering Letter'],
            ['slug_prefix' => 'transfer', 'module' => 'Surat Mutasi'],
            ['slug_prefix' => 'reference', 'module' => 'Surat Referensi'],
            ['slug_prefix' => 'termination', 'module' => 'Surat PHK'],
            ['slug_prefix' => 'promotion', 'module' => 'Surat Promosi/Demosi'],
        ];

        $actions = [
            'view' => 'Can see all',
            'create' => 'Can create',
            'edit' => 'Can edit',
            'delete' => 'Can delete',
        ];

        foreach ($modules as $mod) {
            foreach ($actions as $action => $label) {
                Permission::firstOrCreate(
                    ['slug' => "{$mod['slug_prefix']}.{$action}"],
                    ['name' => "{$label} {$mod['module']}", 'slug' => "{$mod['slug_prefix']}.{$action}", 'module' => $mod['module']]
                );
            }
        }
    }
}
