<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('work_locations', function (Blueprint $table) {
            $table->string('timezone')->default('Asia/Jakarta')->after('name');
        });
    }

    public function down(): void
    {
        Schema::table('work_locations', function (Blueprint $table) {
            $table->dropColumn('timezone');
        });
    }
};
