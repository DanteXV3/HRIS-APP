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
        Schema::table('employees', function (Blueprint $table) {
            $table->foreignId('working_location_id')->nullable()->after('work_location_id')->constrained('working_locations')->nullOnDelete();
            // We keep the string lokasi_kerja for now or drop it?
            // The user wants a "new page" so we use the ID.
            $table->dropColumn('lokasi_kerja');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropConstrainedForeignId('working_location_id');
            $table->string('lokasi_kerja')->nullable()->after('work_location_id');
        });
    }
};
