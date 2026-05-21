<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->time('jam_masuk')->nullable()->after('clock_out');
            $table->time('jam_pulang')->nullable()->after('jam_masuk');
            $table->integer('early_in_minutes')->default(0)->after('jam_pulang');
            $table->integer('late_in_minutes')->default(0)->after('early_in_minutes');
            $table->integer('early_out_minutes')->default(0)->after('late_in_minutes');
            $table->integer('late_out_minutes')->default(0)->after('early_out_minutes');
            $table->boolean('is_holiday')->default(false)->after('status');
            $table->integer('verified_lembur_minutes')->default(0)->after('overtime_minutes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropColumn([
                'jam_masuk',
                'jam_pulang',
                'early_in_minutes',
                'late_in_minutes',
                'early_out_minutes',
                'late_out_minutes',
                'is_holiday',
                'verified_lembur_minutes',
            ]);
        });
    }
};
