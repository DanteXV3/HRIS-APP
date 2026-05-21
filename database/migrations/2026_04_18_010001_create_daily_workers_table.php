<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_workers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('working_location_id')->nullable()->constrained()->nullOnDelete();
            
            // === Data Pribadi ===
            $table->string('nama');
            $table->string('nik')->unique();
            $table->string('email');
            $table->enum('gender', ['laki-laki', 'perempuan'])->nullable();
            $table->string('status_pernikahan')->nullable(); 
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->text('alamat_sekarang')->nullable();
            $table->string('no_telpon_1')->nullable();
            $table->string('photo')->nullable();

            // === Data Kepegawaian ===
            $table->foreignId('department_id')->nullable()->constrained();
            $table->foreignId('position_id')->nullable()->constrained();
            $table->enum('tipe_dw', ['lokal', 'non lokal'])->default('lokal');
            $table->date('hire_date')->nullable();
            $table->boolean('is_active')->default(true);

            // === Identity & Banking ===
            $table->string('no_ktp')->nullable();
            $table->string('npwp')->nullable();
            $table->string('nama_bank')->nullable();
            $table->string('no_rekening')->nullable();
            $table->string('nama_rekening')->nullable();

            // === Gaji & Tunjangan (Daily Worker Specific) ===
            $table->decimal('gaji_harian', 15, 2)->default(0);
            $table->decimal('gaji_per_jam', 15, 2)->default(0);
            $table->decimal('uang_makan', 15, 2)->default(0);
            $table->decimal('uang_lembur', 15, 2)->default(0);
            $table->decimal('gaji_bpjs_tk', 15, 2)->default(0);
            $table->decimal('gaji_bpjs_jkn', 15, 2)->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_workers');
    }
};
