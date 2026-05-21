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
        Schema::create('paklarings', function (Blueprint $table) {
            $table->id();
            $table->string('letter_number')->unique();
            $table->date('date');
            
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('maker_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->foreignId('company_id')->nullable()->constrained('work_locations')->nullOnDelete();
            
            $table->string('work_location_text')->nullable();
            $table->date('from_date');
            $table->date('to_date');
            $table->text('reason_for_leaving')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paklarings');
    }
};
