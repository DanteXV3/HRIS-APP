<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class WorkCertificatePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            ['slug' => 'skb.view', 'name' => 'View Work Certificates (SKB)'],
            ['slug' => 'skb.create', 'name' => 'Create Work Certificates (SKB)'],
            ['slug' => 'skb.edit', 'name' => 'Edit Work Certificates (SKB)'],
            ['slug' => 'skb.delete', 'name' => 'Delete Work Certificates (SKB)'],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(['slug' => $permission['slug']], $permission);
        }
    }
}
