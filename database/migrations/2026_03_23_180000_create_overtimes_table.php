<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('overtimes', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('creator_id')->constrained('employees')->onDelete('cascade');
            $blueprint->date('tanggal');
            $blueprint->time('jam_mulai');
            $blueprint->time('jam_berakhir');
            $blueprint->decimal('durasi', 8, 2);
            $blueprint->string('lokasi_kerja');
            $blueprint->text('keperluan');
            
            // Approval Status
            $blueprint->enum('status', ['pending', 'partially_approved', 'approved', 'rejected'])->default('pending');
            
            // First Approval (Supervisor/Report To)
            $blueprint->enum('supervisor_status', ['pending', 'approved', 'rejected'])->default('pending');
            $blueprint->foreignId('approved_by_supervisor_id')->nullable()->constrained('employees');
            $blueprint->timestamp('supervisor_approved_at')->nullable();
            $blueprint->text('supervisor_notes')->nullable();
            
            // Second Approval (Management/HR)
            $blueprint->enum('manager_status', ['pending', 'approved', 'rejected'])->default('pending');
            $blueprint->foreignId('approved_by_manager_id')->nullable()->constrained('employees');
            $blueprint->timestamp('manager_approved_at')->nullable();
            $blueprint->text('manager_notes')->nullable();
            
            $blueprint->timestamps();
        });

        Schema::create('overtime_employee', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('overtime_id')->constrained()->onDelete('cascade');
            $blueprint->foreignId('employee_id')->constrained()->onDelete('cascade');
            $blueprint->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('overtime_employee');
        Schema::dropIfExists('overtimes');
    }
};
