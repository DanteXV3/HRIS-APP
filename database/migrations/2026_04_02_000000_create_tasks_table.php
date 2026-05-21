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
        Schema::create('tasks', function (Blueprint $col) {
            $col->id();
            $col->string('title');
            $col->text('description')->nullable();
            $col->foreignId('assigned_from')->constrained('employees')->cascadeOnDelete();
            $col->foreignId('assigned_to')->constrained('employees')->cascadeOnDelete();
            $col->enum('category', ['one-time', 'recurring'])->default('one-time');
            $col->enum('frequency', ['daily', 'weekly', 'monthly', 'yearly'])->nullable();
            $col->date('due_date')->nullable();
            $col->timestamp('last_completed_at')->nullable();
            $col->boolean('is_completed')->default(false);
            $col->boolean('is_active')->default(true);
            $col->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
