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
        DB::table('permissions')->insert([
            [
                'name' => 'View Working Locations',
                'slug' => 'working_location.view',
                'module' => 'Master Data',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Manage Working Locations',
                'slug' => 'working_location.manage',
                'module' => 'Master Data',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('permissions')->whereIn('slug', ['working_location.view', 'working_location.manage'])->delete();
    }
};
