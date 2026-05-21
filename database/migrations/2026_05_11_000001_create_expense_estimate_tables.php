<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expense_estimates', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('month');
            $table->unsignedSmallInteger('year');
            $table->foreignId('company_id')->constrained('work_locations')->cascadeOnDelete();
            $table->string('status')->default('draft'); // draft, finalized
            $table->foreignId('created_by')->nullable()->constrained('employees')->nullOnDelete();
            $table->timestamps();
            $table->unique(['month', 'year', 'company_id']);
        });

        Schema::create('expense_estimate_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('expense_estimate_id')->constrained()->cascadeOnDelete();
            $table->text('uraian_penggunaan');
            $table->foreignId('working_location_id')->nullable()->constrained()->nullOnDelete();
            $table->string('fase_pembayaran')->default('Fase 1');
            $table->date('tanggal_jatuh_tempo');
            $table->decimal('nominal', 15, 2)->default(0);
            $table->date('tanggal_bayar')->nullable();
            $table->decimal('nominal_dibayarkan', 15, 2)->default(0);
            $table->string('status')->default('Pending'); // Pending, Paid, Next Phase
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        Schema::create('expense_estimate_letters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('expense_estimate_id')->constrained()->cascadeOnDelete();
            $table->string('letter_number')->unique();
            $table->date('date');
            $table->decimal('total_amount', 15, 2);
            $table->foreignId('maker_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->json('selected_item_ids');
            $table->timestamps();
        });

        Schema::create('expense_estimate_letter_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('expense_estimate_letter_id')->constrained()->cascadeOnDelete();
            $table->string('file_path');
            $table->string('original_name');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expense_estimate_letter_files');
        Schema::dropIfExists('expense_estimate_letters');
        Schema::dropIfExists('expense_estimate_items');
        Schema::dropIfExists('expense_estimates');
    }
};
