<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_sppd', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sppd_id')->constrained('sppds')->onDelete('cascade');
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->timestamps();
        });

        // Migrate existing data
        $sppds = DB::table('sppds')->get();
        foreach ($sppds as $sppd) {
            DB::table('employee_sppd')->insert([
                'sppd_id' => $sppd->id,
                'employee_id' => $sppd->employee_id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        Schema::table('sppds', function (Blueprint $table) {
            $table->dropForeign(['employee_id']);
            $table->dropColumn('employee_id');
        });
    }

    public function down(): void
    {
        Schema::table('sppds', function (Blueprint $table) {
            $table->foreignId('employee_id')->nullable()->constrained('employees')->onDelete('cascade');
        });

        $relations = DB::table('employee_sppd')->get();
        foreach ($relations as $rel) {
            DB::table('sppds')->where('id', $rel->sppd_id)->update(['employee_id' => $rel->employee_id]);
        }

        Schema::dropIfExists('employee_sppd');
    }
};
