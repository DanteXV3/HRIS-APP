<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payroll_id')->constrained()->cascadeOnDelete();
            $table->foreignId('employee_id')->constrained();

            // Earnings (snapshot)
            $table->decimal('gaji_pokok', 15, 2)->default(0);
            $table->decimal('tunjangan_jabatan', 15, 2)->default(0);
            $table->decimal('tunjangan_kehadiran', 15, 2)->default(0);
            $table->decimal('tunjangan_transportasi', 15, 2)->default(0);
            $table->decimal('uang_makan', 15, 2)->default(0);
            $table->decimal('uang_lembur', 15, 2)->default(0);
            $table->decimal('thr', 15, 2)->default(0);
            $table->decimal('tunjangan_pajak', 15, 2)->default(0);
            $table->decimal('total_pendapatan', 15, 2)->default(0);

            // Deductions (snapshot)
            $table->decimal('potongan_bpjs_tk', 15, 2)->default(0);
            $table->decimal('potongan_bpjs_jkn', 15, 2)->default(0);
            $table->decimal('potongan_pph21', 15, 2)->default(0);
            $table->decimal('pinjaman_koperasi', 15, 2)->default(0);
            $table->decimal('potongan_lain_1', 15, 2)->default(0);
            $table->decimal('potongan_lain_2', 15, 2)->default(0);
            $table->decimal('total_potongan', 15, 2)->default(0);

            // Net pay
            $table->decimal('gaji_bersih', 15, 2)->default(0);

            // Company contributions (info)
            $table->decimal('iuran_bpjs_tk_perusahaan', 15, 2)->default(0);
            $table->decimal('iuran_bpjs_jkn_perusahaan', 15, 2)->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_items');
    }
};
