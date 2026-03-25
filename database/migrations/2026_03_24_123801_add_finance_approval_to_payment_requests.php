<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payment_requests', function (Blueprint $table) {
            $table->string('finance_status')->nullable()->after('advisor_signature_snapshot');
            $table->unsignedBigInteger('finance_approver_id')->nullable()->after('finance_status');
            $table->timestamp('finance_approved_at')->nullable()->after('finance_approver_id');
            $table->text('finance_notes')->nullable()->after('finance_approved_at');
            $table->string('finance_signature_snapshot')->nullable()->after('finance_notes');
        });
    }

    public function down(): void
    {
        Schema::table('payment_requests', function (Blueprint $table) {
            $table->dropColumn([
                'finance_status', 'finance_approver_id', 'finance_approved_at', 
                'finance_notes', 'finance_signature_snapshot',
            ]);
        });
    }
};
