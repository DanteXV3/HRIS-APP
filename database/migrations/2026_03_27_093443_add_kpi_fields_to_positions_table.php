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
        Schema::table('positions', function (Blueprint $table) {
            $table->string('kpi_1')->nullable();
            $table->string('kpi_2')->nullable();
            $table->string('kpi_3')->nullable();
            $table->string('kpi_4')->nullable();
            $table->string('kpi_5')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('positions', function (Blueprint $table) {
            $table->dropColumn(['kpi_1', 'kpi_2', 'kpi_3', 'kpi_4', 'kpi_5']);
        });
    }
};
