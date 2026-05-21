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
        Schema::table('working_locations', function (Blueprint $table) {
            $table->json('geofences')->nullable()->after('radius');
        });

        // Migrate existing data to geofences array
        $locations = DB::table('working_locations')->get();
        foreach ($locations as $location) {
            if ($location->latitude && $location->longitude) {
                $geofences = [
                    [
                        'latitude' => (float)$location->latitude,
                        'longitude' => (float)$location->longitude,
                        'radius' => (int)$location->radius,
                        'name' => 'Primary Location'
                    ]
                ];
                DB::table('working_locations')
                    ->where('id', $location->id)
                    ->update(['geofences' => json_encode($geofences)]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('working_locations', function (Blueprint $table) {
            $table->dropColumn('geofences');
        });
    }
};
