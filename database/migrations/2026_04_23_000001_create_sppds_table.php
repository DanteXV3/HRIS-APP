<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sppds', function (Blueprint $table) {
            $table->id();
            $table->string('letter_number')->unique();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->string('tujuan');
            $table->date('tanggal_berangkat');
            $table->date('tanggal_kembali');
            $table->foreignId('atas_permintaan_id')->constrained('employees')->onDelete('cascade');
            $table->text('maksud_perjalanan_dinas');
            $table->string('signed_pdf_path')->nullable();
            $table->foreignId('maker_id')->constrained('employees')->onDelete('cascade');
            $table->string('status')->default('draft'); // draft, submitted, signed
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sppds');
    }
};
