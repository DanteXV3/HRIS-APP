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
        Schema::create('budget_items', function (Blueprint $col) {
            $col->id();
            $col->foreignId('working_location_id')->constrained('working_locations')->cascadeOnDelete();
            $col->string('item_code');
            $col->string('nama_budget');
            $col->string('budget_unit');
            $col->decimal('nilai_budget_material', 15, 2)->default(0);
            $col->decimal('nilai_budget_jasa', 15, 2)->default(0);
            $col->string('msr_unit')->nullable();
            $col->decimal('conversion_unit', 12, 4)->default(1);
            $col->timestamps();

            $col->unique(['working_location_id', 'item_code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('budget_items');
    }
};
