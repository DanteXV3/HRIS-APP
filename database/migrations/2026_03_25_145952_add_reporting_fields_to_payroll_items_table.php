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
        Schema::table('payroll_items', function (Blueprint $table) {
            $table->integer('uang_makan_count')->default(0)->after('uang_makan');
            $table->integer('lembur_minutes')->default(0)->after('uang_lembur');
            $table->decimal('bpjs_tk_base', 15, 2)->default(0)->after('potongan_bpjs_tk');
            $table->decimal('bpjs_jkn_base', 15, 2)->default(0)->after('potongan_bpjs_jkn');
            $table->decimal('taxable_gross', 15, 2)->default(0)->after('total_pendapatan');
        });
    }

    public function down(): void
    {
        Schema::table('payroll_items', function (Blueprint $table) {
            $table->dropColumn([
                'uang_makan_count',
                'lembur_minutes',
                'bpjs_tk_base',
                'bpjs_jkn_base',
                'taxable_gross',
            ]);
        });
    }
};
