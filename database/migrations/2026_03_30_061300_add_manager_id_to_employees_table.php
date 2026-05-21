<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->unsignedBigInteger('manager_id')->nullable()->after('report_to');
            $table->foreign('manager_id')->references('id')->on('employees')->nullOnDelete();
        });

        // Insert new permission directly so we don't need to re-seed
        DB::table('permissions')->insertOrIgnore([
            'name' => 'Can approve all leave forms',
            'slug' => 'leave.approve_all',
            'module' => 'Leave',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropForeign(['manager_id']);
            $table->dropColumn('manager_id');
        });

        DB::table('permissions')->where('slug', 'leave.approve_all')->delete();
    }
};
