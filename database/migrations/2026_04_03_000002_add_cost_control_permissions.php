<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('permissions')->insert([
            ['name' => 'Tampilkan Cost Control', 'slug' => 'cost_control.view', 'module' => 'Cost Control', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Tambah Item Budget', 'slug' => 'cost_control.create', 'module' => 'Cost Control', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Edit Item Budget', 'slug' => 'cost_control.update', 'module' => 'Cost Control', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Hapus Item Budget', 'slug' => 'cost_control.delete', 'module' => 'Cost Control', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('permissions')->where('module', 'Cost Control')->delete();
    }
};
