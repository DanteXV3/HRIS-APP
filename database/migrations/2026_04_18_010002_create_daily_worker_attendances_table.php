<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_worker_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('daily_worker_id')->constrained('daily_workers')->cascadeOnDelete();
            $table->date('tanggal');
            $table->datetime('clock_in')->nullable();
            $table->datetime('clock_out')->nullable();
            $table->string('clock_in_photo')->nullable();
            $table->string('clock_out_photo')->nullable();
            $table->decimal('clock_in_lat', 10, 7)->nullable();
            $table->decimal('clock_in_lng', 10, 7)->nullable();
            $table->decimal('clock_out_lat', 10, 7)->nullable();
            $table->decimal('clock_out_lng', 10, 7)->nullable();
            $table->string('jam_masuk')->nullable();
            $table->string('jam_pulang')->nullable();
            $table->integer('early_in_minutes')->default(0);
            $table->integer('late_in_minutes')->default(0);
            $table->integer('early_out_minutes')->default(0);
            $table->integer('late_out_minutes')->default(0);
            $table->boolean('is_late')->default(false);
            $table->integer('late_minutes')->default(0);
            $table->boolean('is_holiday')->default(false);
            $table->integer('overtime_minutes')->default(0);
            $table->integer('verified_lembur_minutes')->default(0);
            $table->enum('status', ['hadir', 'izin', 'sakit', 'cuti', 'alpha', 'libur'])->default('hadir');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['daily_worker_id', 'tanggal'], 'dw_attendance_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_worker_attendances');
    }
};
