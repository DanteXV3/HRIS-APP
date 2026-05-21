<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyWorkerAttendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'daily_worker_id',
        'tanggal',
        'clock_in',
        'clock_out',
        'clock_in_photo',
        'clock_out_photo',
        'clock_in_lat',
        'clock_in_lng',
        'clock_out_lat',
        'clock_out_lng',
        'jam_masuk',
        'jam_pulang',
        'early_in_minutes',
        'late_in_minutes',
        'early_out_minutes',
        'late_out_minutes',
        'is_late',
        'late_minutes',
        'is_holiday',
        'overtime_minutes',
        'verified_lembur_minutes',
        'status',
        'notes',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'clock_in' => 'datetime',
        'clock_out' => 'datetime',
        'is_late' => 'boolean',
        'is_holiday' => 'boolean',
    ];

    public function dailyWorker(): BelongsTo
    {
        return $this->belongsTo(DailyWorker::class);
    }
}
