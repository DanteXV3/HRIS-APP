<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sppd_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sppd_id')->constrained('sppds')->onDelete('cascade');
            $table->string('hal'); // Transportasi & Tiket, Lodging, Uang Makan, Lain-lain
            $table->string('description');
            $table->integer('qty');
            $table->decimal('price', 15, 2);
            $table->decimal('total_price', 15, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sppd_items');
    }
};
