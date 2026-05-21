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
            $table->string('director_name')->nullable();
            $table->string('director_position')->nullable();
            $table->string('director_address')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('work_locations', function (Blueprint $table) {
            $table->dropColumn(['director_name', 'director_position', 'director_address']);
        });
    }
};
