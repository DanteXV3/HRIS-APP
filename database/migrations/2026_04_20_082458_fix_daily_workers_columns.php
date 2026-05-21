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
        Schema::table('daily_workers', function (Blueprint $table) {
            if (!Schema::hasColumn('daily_workers', 'work_location_id')) {
                $table->foreignId('work_location_id')->nullable()->after('working_location_id')->constrained('work_locations')->onDelete('set null');
            }
            if (!Schema::hasColumn('daily_workers', 'signature')) {
                $table->text('signature')->nullable()->after('no_kontak_darurat_2');
            }
            if (!Schema::hasColumn('daily_workers', 'face_descriptor')) {
                $table->text('face_descriptor')->nullable()->after('signature');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('daily_workers', function (Blueprint $table) {
            if (Schema::hasColumn('daily_workers', 'work_location_id')) {
                $table->dropForeign(['work_location_id']);
                $table->dropColumn('work_location_id');
            }
            if (Schema::hasColumn('daily_workers', 'signature')) {
                $table->dropColumn('signature');
            }
            if (Schema::hasColumn('daily_workers', 'face_descriptor')) {
                $table->dropColumn('face_descriptor');
            }
        });
    }
};
