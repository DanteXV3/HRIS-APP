<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_salary_logs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();

            // Who made the change (user_id of the admin/HR who saved the form)
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();

            // Snapshot of salary fields BEFORE the change
            $table->json('before');

            // Snapshot of salary fields AFTER the change
            $table->json('after');

            // Human-readable list of which fields actually changed
            $table->json('changed_fields');

            // Optional free-text note (e.g. "Annual salary review 2026")
            $table->string('notes')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_salary_logs');
    }
};
