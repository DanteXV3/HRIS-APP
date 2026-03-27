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
        Schema::create('warning_letters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->integer('level')->default(1); // 1: SP-I, 2: SP-II, 3: SP-III
            $table->string('reference_number')->unique();
            $table->text('reason');
            $table->text('description');
            $table->date('issued_date');
            $table->date('valid_until');
            $table->foreignId('issued_by')->constrained('employees')->onDelete('cascade');
            $table->string('status')->default('issued'); // issued, acknowledged
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('warning_letters');
    }
};
