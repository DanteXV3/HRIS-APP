<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Surat Pengangkatan (Appointment Letter)
        Schema::create('appointment_letters', function (Blueprint $table) {
            $table->id();
            $table->string('letter_number')->unique();
            $table->date('date');
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('maker_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->foreignId('company_id')->nullable()->constrained('work_locations')->nullOnDelete();
            $table->string('previous_status');
            $table->string('new_status');
            $table->date('effective_date');
            $table->decimal('new_salary', 15, 2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 2. Offering Letter
        Schema::create('offering_letters', function (Blueprint $table) {
            $table->id();
            $table->string('letter_number')->unique();
            $table->date('date');
            $table->string('candidate_name');
            $table->text('candidate_address')->nullable();
            $table->foreignId('maker_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->foreignId('company_id')->nullable()->constrained('work_locations')->nullOnDelete();
            $table->string('position_offered');
            $table->string('department_text')->nullable();
            $table->date('start_date');
            $table->decimal('offered_salary', 15, 2)->nullable();
            $table->string('employment_type')->default('kontrak');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 3. Surat Mutasi (Transfer Letter)
        Schema::create('transfer_letters', function (Blueprint $table) {
            $table->id();
            $table->string('letter_number')->unique();
            $table->date('date');
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('maker_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->foreignId('company_id')->nullable()->constrained('work_locations')->nullOnDelete();
            $table->string('from_location');
            $table->string('to_location');
            $table->string('from_position')->nullable();
            $table->string('to_position')->nullable();
            $table->date('effective_date');
            $table->text('reason')->nullable();
            $table->timestamps();
        });

        // 4. Surat Referensi (Reference Letter)
        Schema::create('reference_letters', function (Blueprint $table) {
            $table->id();
            $table->string('letter_number')->unique();
            $table->date('date');
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('maker_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->foreignId('company_id')->nullable()->constrained('work_locations')->nullOnDelete();
            $table->string('work_location_text')->nullable();
            $table->date('from_date');
            $table->date('to_date');
            $table->text('qualities')->nullable();
            $table->text('recommendation_text')->nullable();
            $table->timestamps();
        });

        // 5. Surat PHK / Terminasi (Termination Letter)
        Schema::create('termination_letters', function (Blueprint $table) {
            $table->id();
            $table->string('letter_number')->unique();
            $table->date('date');
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('maker_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->foreignId('company_id')->nullable()->constrained('work_locations')->nullOnDelete();
            $table->date('termination_date');
            $table->text('reason');
            $table->decimal('severance_amount', 15, 2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 6. Surat Promosi/Demosi (Promotion/Demotion Letter)
        Schema::create('promotion_letters', function (Blueprint $table) {
            $table->id();
            $table->string('letter_number')->unique();
            $table->date('date');
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('maker_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->foreignId('company_id')->nullable()->constrained('work_locations')->nullOnDelete();
            $table->string('type')->default('promosi'); // promosi or demosi
            $table->string('from_position');
            $table->string('to_position');
            $table->string('from_department')->nullable();
            $table->string('to_department')->nullable();
            $table->date('effective_date');
            $table->decimal('new_salary', 15, 2)->nullable();
            $table->text('reason')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promotion_letters');
        Schema::dropIfExists('termination_letters');
        Schema::dropIfExists('reference_letters');
        Schema::dropIfExists('transfer_letters');
        Schema::dropIfExists('offering_letters');
        Schema::dropIfExists('appointment_letters');
    }
};
