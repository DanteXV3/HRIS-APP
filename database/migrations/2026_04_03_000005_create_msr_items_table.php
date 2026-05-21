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
        Schema::create('material_service_request_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('msr_id')->constrained('material_service_requests')->onDelete('cascade');
            $table->enum('category', ['Material', 'Jasa']);
            $table->foreignId('budget_item_id')->nullable()->constrained('budget_items')->onDelete('set null');
            
            $table->string('item_code')->nullable();
            $table->string('item_name');
            $table->string('size')->nullable();
            $table->string('material')->nullable();
            $table->string('unit')->default('Pcs');
            
            $table->decimal('qty', 15, 2);
            $table->decimal('price', 15, 2);
            $table->decimal('total_price', 15, 2);
            $table->text('keterangan')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('material_service_request_items');
    }
};
