<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            if (!Schema::hasColumn('attendances', 'shift_id')) {
                $table->foreignId('shift_id')->nullable()->after('employee_id')->constrained()->nullOnDelete();
            }
            
            $indexes = Schema::getIndexes('attendances');
            $indexNames = collect($indexes)->pluck('name')->toArray();
            
            if (!in_array('attendances_employee_id_index', $indexNames)) {
                $table->index('employee_id', 'attendances_employee_id_index');
            }

            // Drop old unique constraint if it exists
            if (in_array('attendances_employee_id_tanggal_unique', $indexNames)) {
                $table->dropUnique(['employee_id', 'tanggal']);
            }
            
            // Add new unique constraint including shift_id if it doesn't exist
            if (!in_array('attendances_employee_id_tanggal_shift_id_unique', $indexNames)) {
                $table->unique(['employee_id', 'tanggal', 'shift_id'], 'attendances_employee_id_tanggal_shift_id_unique');
            }
        });
    }

    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropUnique('attendances_employee_id_tanggal_shift_id_unique');
            $table->unique(['employee_id', 'tanggal'], 'attendances_employee_id_tanggal_unique');
            $table->dropIndex('attendances_employee_id_index');
            if (Schema::hasColumn('attendances', 'shift_id')) {
                $table->dropConstrainedForeignId('shift_id');
            }
        });
    }
};
