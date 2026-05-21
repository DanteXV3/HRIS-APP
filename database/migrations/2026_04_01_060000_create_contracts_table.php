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
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('work_location_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('working_location_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('position_id')->nullable()->constrained()->nullOnDelete();
            
            // Contract Metadata
            $table->string('contract_number')->unique();
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['active', 'expired', 'terminated'])->default('active');
            
            // Snapshot of Pihak Pertama (Company/Director)
            $table->string('first_party_name');
            $table->string('first_party_position');
            $table->string('first_party_address');
            
            // Snapshot of Pihak Kedua (Employee)
            $table->string('second_party_name');
            $table->string('second_party_nik');
            $table->enum('second_party_gender', ['laki-laki', 'perempuan']);
            $table->string('second_party_pob');
            $table->date('second_party_dob');
            $table->string('second_party_address');
            $table->string('second_party_position');
            
            // Snapshot of Salary/Allowances
            $table->decimal('base_salary', 15, 2);
            $table->decimal('position_allowance', 15, 2)->default(0);
            $table->decimal('attendance_allowance', 15, 2)->default(0);
            $table->decimal('transport_allowance', 15, 2)->default(0);
            $table->decimal('meal_allowance', 15, 2)->default(0);
            $table->decimal('overtime_allowance', 15, 2)->default(0);
            
            // Files
            $table->string('signed_file')->nullable();
            
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
