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
        Schema::create('material_service_requests', function (Blueprint $table) {
            $table->id();
            $table->string('msr_number')->unique();
            $table->date('date');
            
            $table->foreignId('company_id')->constrained('work_locations')->onDelete('cascade');
            $table->foreignId('work_location_id')->constrained('working_locations')->onDelete('cascade');
            $table->foreignId('department_id')->constrained('departments')->onDelete('cascade');
            
            $table->string('subject');
            $table->text('description')->nullable();
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->text('notes')->nullable();
            $table->string('status')->default('pending');

            $table->foreignId('requested_by_id')->constrained('employees')->onDelete('cascade');
            $table->timestamp('requested_at')->nullable();
            $table->string('requester_signature_snapshot')->nullable();

            // Approval Stages: supervisor, manager, pr_maker, finance
            $stages = ['supervisor', 'manager', 'pr_maker', 'finance'];
            foreach ($stages as $stage) {
                $table->string("{$stage}_status")->default('pending');
                $table->foreignId("{$stage}_approver_id")->nullable()->constrained('employees')->onDelete('set null');
                $table->timestamp("{$stage}_approved_at")->nullable();
                $table->text("{$stage}_notes")->nullable();
                $table->string("{$stage}_signature_snapshot")->nullable();
            }

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('material_service_requests');
    }
};
