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
        Schema::table('daily_workers', function (Blueprint $table) {
            // === Missing Data Pribadi ===
            $table->text('alamat_tetap')->nullable()->after('alamat_sekarang');
            $table->string('pendidikan_terakhir')->nullable()->after('status_pernikahan');
            $table->string('agama')->nullable()->after('pendidikan_terakhir');
            $table->string('no_telpon_2')->nullable()->after('no_telpon_1');

            // === Missing Identity & Documents ===
            $table->string('no_bpjs_ketenagakerjaan')->nullable()->after('npwp');
            $table->string('no_bpjs_kesehatan')->nullable()->after('no_bpjs_ketenagakerjaan');
            $table->string('file_ktp')->nullable()->after('no_bpjs_kesehatan');
            $table->string('file_npwp')->nullable()->after('file_ktp');
            $table->string('file_kk')->nullable()->after('file_npwp');
            $table->string('file_ijazah')->nullable()->after('file_kk');
            $table->json('file_lainnya')->nullable()->after('file_ijazah');

            // === Missing Employment ===
            $table->enum('status_kepegawaian', ['tetap', 'kontrak', 'probation', 'magang', 'harian'])->default('harian')->after('tipe_dw');
            $table->date('end_date')->nullable()->after('hire_date');

            // === Missing Banking ===
            $table->string('cabang_bank')->nullable()->after('nama_bank');

            // === Missing Emergency Contacts ===
            $table->string('nama_kontak_darurat_1')->nullable()->after('nama_rekening');
            $table->string('no_kontak_darurat_1')->nullable()->after('nama_kontak_darurat_1');
            $table->string('nama_kontak_darurat_2')->nullable()->after('no_kontak_darurat_1');
            $table->string('no_kontak_darurat_2')->nullable()->after('nama_kontak_darurat_2');

            // === Missing Financial/Deductions ===
            $table->decimal('thr', 15, 2)->default(0)->after('gaji_bpjs_jkn');
            $table->decimal('pinjaman_koperasi', 15, 2)->default(0)->after('thr');
            $table->decimal('potongan_lain_1', 15, 2)->default(0)->after('pinjaman_koperasi');
            $table->decimal('potongan_lain_2', 15, 2)->default(0)->after('potongan_lain_1');
            $table->boolean('gross_up')->default(false)->after('potongan_lain_2');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('daily_workers', function (Blueprint $table) {
            $table->dropColumn([
                'alamat_tetap', 'pendidikan_terakhir', 'agama', 'no_telpon_2',
                'no_bpjs_ketenagakerjaan', 'no_bpjs_kesehatan', 'file_ktp', 'file_npwp', 'file_kk', 'file_ijazah', 'file_lainnya',
                'status_kepegawaian', 'end_date', 'cabang_bank',
                'nama_kontak_darurat_1', 'no_kontak_darurat_1', 'nama_kontak_darurat_2', 'no_kontak_darurat_2',
                'thr', 'pinjaman_koperasi', 'potongan_lain_1', 'potongan_lain_2', 'gross_up'
            ]);
        });
    }
};
