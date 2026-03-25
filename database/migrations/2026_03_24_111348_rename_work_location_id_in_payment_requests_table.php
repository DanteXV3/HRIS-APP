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
        Schema::table('payment_requests', function (Blueprint $table) {
            $table->dropForeign(['work_location_id']);
            $table->renameColumn('work_location_id', 'working_location_id');
        });

        Schema::table('payment_requests', function (Blueprint $table) {
            $table->foreign('working_location_id')->references('id')->on('working_locations')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payment_requests', function (Blueprint $table) {
            $table->dropForeign(['working_location_id']);
            $table->renameColumn('working_location_id', 'work_location_id');
        });

        Schema::table('payment_requests', function (Blueprint $table) {
            $table->foreign('work_location_id')->references('id')->on('work_locations')->onDelete('cascade');
        });
    }
};
