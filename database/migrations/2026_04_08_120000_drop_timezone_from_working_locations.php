<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Move existing timezone into each geofence
        $locations = DB::table('working_locations')->get();
        foreach ($locations as $location) {
            $tz = $location->timezone ?? 'Asia/Jakarta';
            if ($location->geofences) {
                $geofences = json_decode($location->geofences, true) ?? [];
                if (!empty($geofences)) {
                    foreach ($geofences as &$fence) {
                        $fence['timezone'] = $tz;
                    }
                    DB::table('working_locations')
                        ->where('id', $location->id)
                        ->update(['geofences' => json_encode($geofences)]);
                }
            }
        }

        // 2. Drop the original timezone column
        Schema::table('working_locations', function (Blueprint $table) {
            $table->dropColumn('timezone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('working_locations', function (Blueprint $table) {
            $table->string('timezone')->default('Asia/Jakarta')->after('name');
        });

        // Try to revert by taking the first fence's timezone
        $locations = DB::table('working_locations')->get();
        foreach ($locations as $location) {
            $geofences = json_decode($location->geofences, true) ?? [];
            if (!empty($geofences) && isset($geofences[0]['timezone'])) {
                DB::table('working_locations')
                    ->where('id', $location->id)
                    ->update(['timezone' => $geofences[0]['timezone']]);
            }
        }
    }
};
