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
        Schema::table('payroll_items', function (Blueprint $table) {
            $table->string('employee_name')->nullable()->after('employee_id');
            $table->string('employee_nik')->nullable()->after('employee_name');
            $table->string('department_name')->nullable()->after('employee_nik');
            $table->string('position_name')->nullable()->after('department_name');
            $table->string('work_location_name')->nullable()->after('position_name');
            $table->string('working_location_name')->nullable()->after('work_location_name');
            $table->string('bank_name')->nullable()->after('working_location_name');
            $table->string('bank_account_no')->nullable()->after('bank_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payroll_items', function (Blueprint $table) {
            $table->dropColumn([
                'employee_name',
                'employee_nik',
                'department_name',
                'position_name',
                'work_location_name',
                'working_location_name',
                'bank_name',
                'bank_account_no',
            ]);
        });
    }
};
