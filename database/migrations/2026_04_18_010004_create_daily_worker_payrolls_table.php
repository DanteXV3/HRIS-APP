<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_worker_payrolls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('working_location_id')->constrained()->cascadeOnDelete();
            $table->date('periode_start');
            $table->date('periode_end');
            $table->boolean('calc_bpjs_tk')->default(false);
            $table->boolean('calc_bpjs_ks')->default(false);
            $table->boolean('calc_pph21')->default(false);
            $table->enum('status', ['draft', 'finalized'])->default('draft');
            $table->foreignId('processed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('daily_worker_payroll_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('daily_worker_payroll_id')->constrained('daily_worker_payrolls', 'id', 'dw_payroll_items_id_fk')->cascadeOnDelete();
            $table->foreignId('daily_worker_id')->constrained()->cascadeOnDelete();
            
            // Snapshot Data
            $table->string('worker_name');
            $table->string('worker_nik');
            $table->string('tipe_dw');
            
            // Calculation Bases
            $table->integer('days_attended')->default(0);
            $table->integer('days_period')->default(0);
            $table->decimal('lembur_hours', 10, 2)->default(0);
            
            // Financials
            $table->decimal('gaji_harian', 15, 2)->default(0);
            $table->decimal('gaji_pokok_total', 15, 2)->default(0); // This is (gaji_harian * days)
            $table->decimal('uang_makan', 15, 2)->default(0);
            $table->decimal('uang_makan_total', 15, 2)->default(0);
            $table->decimal('uang_lembur_total', 15, 2)->default(0);
            $table->decimal('total_pendapatan', 15, 2)->default(0);
            
            // Deductions
            $table->decimal('potongan_bpjs_tk', 15, 2)->default(0);
            $table->decimal('potongan_bpjs_ks', 15, 2)->default(0);
            $table->decimal('potongan_pph21', 15, 2)->default(0);
            $table->decimal('total_potongan', 15, 2)->default(0);
            
            // Net
            $table->decimal('gaji_bersih', 15, 2)->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_worker_payroll_items');
        Schema::dropIfExists('daily_worker_payrolls');
    }
};
