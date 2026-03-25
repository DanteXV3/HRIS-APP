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
        Schema::create('payment_requests', function (Blueprint $table) {
            $table->id();
            $table->string('pr_number')->unique();
            $table->date('date');
            
            $table->foreignId('company_id')->constrained('work_locations')->onDelete('cascade');
            $table->foreignId('work_location_id')->constrained('work_locations')->onDelete('cascade');
            $table->foreignId('department_id')->constrained('departments')->onDelete('cascade');
            
            $table->string('subject');
            $table->text('description')->nullable();
            $table->decimal('amount', 15, 2);
            $table->string('paid_to');
            $table->string('bank_name')->nullable();
            $table->string('bank_account')->nullable();
            $table->text('notes')->nullable();
            
            $table->string('status')->default('pending'); // pending, partially_approved, approved, rejected, cancelled
            
            $table->foreignId('requested_by_id')->constrained('employees')->onDelete('cascade');
            $table->timestamp('requested_at')->nullable();
            $table->string('requester_signature_snapshot')->nullable();

            // Approval Levels 1-7
            $levels = [
                'tax', 'accounting', 'cost_control', 'head_branch', 
                'director', 'commissioner', 'advisor'
            ];
            
            foreach ($levels as $index => $level) {
                $table->string("{$level}_status")->default('pending'); // pending, approved, rejected
                $table->foreignId("{$level}_approver_id")->nullable()->constrained('employees')->onDelete('set null');
                $table->timestamp("{$level}_approved_at")->nullable();
                $table->text("{$level}_notes")->nullable();
                $table->string("{$level}_signature_snapshot")->nullable();
            }

            $table->string('payment_evidence')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_requests');
    }
};
