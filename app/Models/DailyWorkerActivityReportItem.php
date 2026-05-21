<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyWorkerActivityReportItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'daily_worker_activity_report_id',
        'daily_worker_id',
        'budget_item_id',
        'aktifitas',
        'status_aktifitas',
        'attendance_status',
        'jam_masuk',
        'jam_pulang',
    ];

    public function report(): BelongsTo
    {
        return $this->belongsTo(DailyWorkerActivityReport::class, 'daily_worker_activity_report_id');
    }

    public function dailyWorker(): BelongsTo
    {
        return $this->belongsTo(DailyWorker::class);
    }

    public function budgetItem(): BelongsTo
    {
        return $this->belongsTo(BudgetItem::class);
    }
}
