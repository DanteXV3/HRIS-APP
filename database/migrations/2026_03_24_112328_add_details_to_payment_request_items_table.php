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
        Schema::table('payment_request_items', function (Blueprint $table) {
            $table->string('unit')->default('Pcs');
            $table->decimal('qty', 10, 2)->default(1);
            $table->decimal('price', 15, 2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payment_request_items', function (Blueprint $table) {
            $table->dropColumn(['unit', 'qty', 'price']);
        });
    }
};
