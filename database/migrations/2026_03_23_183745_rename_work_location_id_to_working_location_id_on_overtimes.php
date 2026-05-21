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
        Schema::table('overtimes', function (Blueprint $table) {
            // Drop old foreign key if it exists
            $table->dropForeign(['work_location_id']);
            
            // Rename column
            $table->renameColumn('work_location_id', 'working_location_id');
        });

        Schema::table('overtimes', function (Blueprint $table) {
            // Add new foreign key
            $table->foreign('working_location_id')
                ->references('id')
                ->on('working_locations')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('overtimes', function (Blueprint $table) {
            $table->dropForeign(['working_location_id']);
            $table->renameColumn('working_location_id', 'work_location_id');
        });

        Schema::table('overtimes', function (Blueprint $table) {
            $table->foreign('work_location_id')
                ->references('id')
                ->on('work_locations')
                ->onDelete('set null');
        });
    }
};
