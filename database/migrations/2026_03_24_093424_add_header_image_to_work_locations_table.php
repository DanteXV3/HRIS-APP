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
        Schema::table('work_locations', function (Blueprint $table) {
            $table->string('header_image')->nullable()->after('payroll_cutoff_date');
            if (!Schema::hasColumn('work_locations', 'logo')) {
                $table->string('logo')->nullable()->after('address');
            }
        });
    }

    public function down(): void
    {
        Schema::table('work_locations', function (Blueprint $table) {
            $table->dropColumn(['header_image', 'logo']);
        });
    }
};
