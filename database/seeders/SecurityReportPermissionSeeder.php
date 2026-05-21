<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class SecurityReportPermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            [
                'name' => 'View All Security Reports',
                'slug' => 'security_report.view_all',
                'module' => 'Security Report',
            ],
            [
                'name' => 'Create Security Reports',
                'slug' => 'security_report.create',
                'module' => 'Security Report',
            ],
            [
                'name' => 'Edit Final Security Reports',
                'slug' => 'security_report.edit',
                'module' => 'Security Report',
            ],
            [
                'name' => 'Delete Security Reports',
                'slug' => 'security_report.delete',
                'module' => 'Security Report',
            ],
            [
                'name' => 'Manage Security Areas',
                'slug' => 'security_report.manage_settings',
                'module' => 'Security Report',
            ],
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['slug' => $perm['slug']], $perm);
        }
    }
}
