<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            // === Data Pribadi ===
            $table->string('nama');
            $table->string('nik')->unique();
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->text('alamat_tetap')->nullable();
            $table->text('alamat_sekarang')->nullable();
            $table->string('email');
            $table->enum('gender', ['laki-laki', 'perempuan'])->nullable();
            $table->string('status_pernikahan')->nullable(); // TK/0, K/1, K/2, etc. for PPh21
            $table->string('pendidikan_terakhir')->nullable();
            $table->string('agama')->nullable();
            $table->string('no_telpon_1')->nullable();
            $table->string('no_telpon_2')->nullable();
            $table->string('photo')->nullable();

            // === Identity & Tax Documents ===
            $table->string('no_ktp')->nullable();
            $table->string('npwp')->nullable();
            $table->string('no_bpjs_ketenagakerjaan')->nullable();
            $table->string('no_bpjs_kesehatan')->nullable();
            $table->string('file_ktp')->nullable();
            $table->string('file_npwp')->nullable();
            $table->string('file_kk')->nullable();
            $table->string('file_ijazah')->nullable();
            $table->json('file_lainnya')->nullable();

            // === Data Kepegawaian ===
            $table->foreignId('department_id')->constrained();
            $table->foreignId('position_id')->constrained();
            $table->foreignId('work_location_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('status_kepegawaian', ['tetap', 'kontrak', 'probation', 'magang'])->default('tetap');
            $table->date('hire_date');
            $table->date('end_date')->nullable();
            $table->boolean('is_active')->default(true);

            // === Banking ===
            $table->string('nama_bank')->nullable();
            $table->string('cabang_bank')->nullable();
            $table->string('no_rekening')->nullable();
            $table->string('nama_rekening')->nullable();

            // === Kontak Darurat ===
            $table->string('nama_kontak_darurat_1')->nullable();
            $table->string('no_kontak_darurat_1')->nullable();
            $table->string('nama_kontak_darurat_2')->nullable();
            $table->string('no_kontak_darurat_2')->nullable();

            // === Gaji & Tunjangan ===
            $table->decimal('gaji_pokok', 15, 2)->default(0);
            $table->decimal('tunjangan_jabatan', 15, 2)->default(0);
            $table->decimal('tunjangan_kehadiran', 15, 2)->default(0);
            $table->decimal('tunjangan_transportasi', 15, 2)->default(0);
            $table->decimal('uang_makan', 15, 2)->default(0);
            $table->decimal('uang_lembur', 15, 2)->default(0);
            $table->decimal('thr', 15, 2)->default(0);
            $table->decimal('gaji_bpjs_tk', 15, 2)->default(0);
            $table->decimal('gaji_bpjs_jkn', 15, 2)->default(0);
            $table->boolean('gross_up')->default(false); // If true, company pays PPh21; if false, PPh21 deducted from employee

            // === Potongan ===
            $table->decimal('pinjaman_koperasi', 15, 2)->default(0);
            $table->decimal('potongan_lain_1', 15, 2)->default(0);
            $table->decimal('potongan_lain_2', 15, 2)->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
