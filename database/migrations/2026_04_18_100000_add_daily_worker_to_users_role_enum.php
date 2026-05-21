<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Using raw SQL because change() on enum columns requires doctrine/dbal and can be tricky with types
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'manager', 'supervisor', 'staff', 'daily_worker') NOT NULL DEFAULT 'staff'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'manager', 'supervisor', 'staff') NOT NULL DEFAULT 'staff'");
    }
};
