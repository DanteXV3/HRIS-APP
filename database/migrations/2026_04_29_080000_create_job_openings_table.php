<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_openings', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('company');
            $table->string('position');
            $table->string('working_location');
            $table->string('requested_by');
            $table->decimal('salary_min', 15, 2)->nullable();
            $table->decimal('salary_max', 15, 2)->nullable();
            $table->string('contract_duration')->nullable();
            $table->json('requirements')->nullable();
            $table->enum('status', ['open', 'closed'])->default('open');
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('job_opening_id')->constrained('job_openings')->onDelete('cascade');
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone');
            $table->text('address')->nullable();
            $table->json('requirement_checklist')->nullable();
            $table->json('cv_files')->nullable();
            $table->enum('status', ['pending', 'rejected', 'interview', 'form_filling', 'testing', 'completed', 'accepted'])->default('pending');
            $table->json('recruitment_form')->nullable();
            $table->timestamp('recruitment_form_submitted_at')->nullable();
            $table->foreignId('personality_test_id')->nullable()->constrained('personality_tests')->onDelete('set null');
            $table->foreignId('mbti_test_id')->nullable()->constrained('personality_tests')->onDelete('set null');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_applications');
        Schema::dropIfExists('job_openings');
    }
};
