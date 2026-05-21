<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('security_report_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('security_report_id')->constrained()->cascadeOnDelete();
            $table->string('area_name');
            $table->string('condition')->nullable(); // safe, unsafe, etc.
            $table->string('photo_path')->nullable();
            $table->text('notes')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->timestamp('checked_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('security_report_items');
    }
};
