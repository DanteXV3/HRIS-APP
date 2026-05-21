<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_worker_activity_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('working_location_id')->constrained()->cascadeOnDelete();
            $table->date('tanggal');
            $table->boolean('is_finalized')->default(false);
            $table->datetime('finalized_at')->nullable();
            $table->foreignId('finalized_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['working_location_id', 'tanggal'], 'dw_activity_report_unique');
        });

        Schema::create('daily_worker_activity_report_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('daily_worker_activity_report_id')->constrained('daily_worker_activity_reports', 'id', 'dw_report_items_id_fk')->cascadeOnDelete();
            $table->foreignId('daily_worker_id')->constrained()->cascadeOnDelete();
            $table->foreignId('budget_item_id')->nullable()->constrained()->nullOnDelete();
            $table->string('aktifitas')->nullable();
            $table->enum('status_aktifitas', ['continue', 'done', 'pending'])->default('pending');
            $table->string('attendance_status')->nullable();
            $table->string('jam_masuk')->nullable();
            $table->string('jam_pulang')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_worker_activity_report_items');
        Schema::dropIfExists('daily_worker_activity_reports');
    }
};
