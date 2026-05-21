<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sppds', function (Blueprint $table) {
            $table->foreignId('work_location_id')->nullable()->constrained('work_locations')->onDelete('set null');
            $table->text('external_employees')->nullable(); // For manual name insertion
        });
    }

    public function down(): void
    {
        Schema::table('sppds', function (Blueprint $table) {
            $table->dropForeign(['work_location_id']);
            $table->dropColumn(['work_location_id', 'external_employees']);
        });
    }
};
