<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $permissions = [
            ['name' => 'Kirim Pengajuan Lembur', 'slug' => 'overtime.create', 'module' => 'Lembur'],
            ['name' => 'Persetujuan Pertama Lembur', 'slug' => 'overtime.first_approval', 'module' => 'Lembur'],
            ['name' => 'Persetujuan Kedua Lembur', 'slug' => 'overtime.second_approval', 'module' => 'Lembur'],
            ['name' => 'Lihat Semua Pengajuan Lembur', 'slug' => 'overtime.view_all', 'module' => 'Lembur'],
        ];

        foreach ($permissions as $permission) {
            DB::table('permissions')->updateOrInsert(
                ['slug' => $permission['slug']],
                $permission
            );
        }
    }

    public function down(): void
    {
        DB::table('permissions')->where('module', 'Lembur')->delete();
    }
};
