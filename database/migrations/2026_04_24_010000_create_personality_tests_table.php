<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('personality_tests', function (Blueprint $table) {
            $table->id();
            $table->string('candidate_name');
            $table->string('candidate_info')->nullable(); // e.g. Phone or Position applied for
            $table->enum('test_type', ['disc', 'mbti']);
            $table->json('answers');
            $table->json('results')->nullable();
            $table->foreignId('tester_id')->nullable()->constrained('employees')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personality_tests');
    }
};
