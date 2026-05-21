<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('working_locations', function (Blueprint $table) {
            $table->decimal('latitude', 10, 7)->nullable()->default(null)->change();
            $table->decimal('longitude', 10, 7)->nullable()->default(null)->change();
        });
    }

    public function down(): void
    {
        Schema::table('working_locations', function (Blueprint $table) {
            $table->decimal('latitude', 10, 7)->change();
            $table->decimal('longitude', 10, 7)->change();
        });
    }
};
