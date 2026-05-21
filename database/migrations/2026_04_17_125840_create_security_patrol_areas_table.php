<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('security_patrol_areas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('working_location_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->integer('sequence')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('security_patrol_areas');
    }
};
