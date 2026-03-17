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
            $table->integer('payroll_cutoff_date')->nullable()->after('logo')->comment('Tanggal cut-off bulanan, misal 25. Jika null, maka hitungan cut-off adalah akhir bulan (misal 30/31).');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('work_locations', function (Blueprint $table) {
            $table->dropColumn('payroll_cutoff_date');
        });
    }
};
