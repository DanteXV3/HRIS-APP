<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('leave_type_id')->constrained();
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->integer('jumlah_hari');
            $table->text('alasan');
            $table->string('attachment')->nullable();

            // 1st Approval (Supervisor)
            $table->foreignId('approved_by_supervisor_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->enum('supervisor_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->datetime('supervisor_approved_at')->nullable();
            $table->text('supervisor_notes')->nullable();

            // 2nd Approval (Manager)
            $table->foreignId('approved_by_manager_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->enum('manager_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->datetime('manager_approved_at')->nullable();
            $table->text('manager_notes')->nullable();

            // Overall status
            $table->enum('status', ['pending', 'partially_approved', 'approved', 'rejected', 'cancelled'])->default('pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leave_requests');
    }
};
