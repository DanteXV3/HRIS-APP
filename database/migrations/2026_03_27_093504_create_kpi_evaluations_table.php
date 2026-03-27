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
        Schema::create('kpi_evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('evaluator_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->foreignId('hr_id')->nullable()->constrained('employees')->nullOnDelete();
            
            $table->string('period_type'); // 6_month, yearly, specific
            $table->string('period_detail')->nullable();
            $table->date('evaluation_date');
            $table->string('status')->default('pending_hr'); // pending_hr, pending_manager, pending_employee, completed
            
            // Section B: Main KPI (Max 50)
            $table->integer('score_kpi_1')->default(0);
            $table->integer('score_kpi_2')->default(0);
            $table->integer('score_kpi_3')->default(0);
            $table->integer('score_kpi_4')->default(0);
            $table->integer('score_kpi_5')->default(0);
            
            // Section C: General (Max 21)
            $table->integer('score_planning')->default(0);
            $table->integer('score_analysis')->default(0);
            $table->integer('score_independence')->default(0);
            $table->integer('score_attitude')->default(0);
            $table->integer('score_collab_sup')->default(0);
            $table->integer('score_collab_peers')->default(0);
            $table->integer('score_collab_sub')->default(0);
            
            // Section D: Discipline (Max 9)
            $table->integer('score_attendance')->default(0);
            $table->integer('score_punctuality')->default(0);
            $table->integer('score_obedience')->default(0);
            
            // Section E: Recommendations
            $table->text('rec_1')->nullable();
            $table->text('rec_2')->nullable();
            $table->text('rec_3')->nullable();
            
            // Section F: Employee Comment
            $table->text('employee_comment')->nullable();
            
            $table->decimal('total_score', 5, 2)->default(0.00);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kpi_evaluations');
    }
};
