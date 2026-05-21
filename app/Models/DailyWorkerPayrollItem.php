<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyWorkerPayrollItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'daily_worker_payroll_id',
        'daily_worker_id',
        'worker_name',
        'worker_nik',
        'tipe_dw',
        'days_attended',
        'days_period',
        'lembur_hours',
        'gaji_harian',
        'gaji_pokok_total',
        'uang_makan',
        'uang_makan_total',
        'uang_lembur_total',
        'total_pendapatan',
        'tunjangan_pajak',
        'potongan_bpjs_tk',
        'potongan_bpjs_ks',
        'potongan_pph21',
        'total_potongan',
        'gaji_bersih',
    ];

    protected $casts = [
        'gaji_harian' => 'decimal:2',
        'gaji_pokok_total' => 'decimal:2',
        'uang_makan' => 'decimal:2',
        'uang_makan_total' => 'decimal:2',
        'uang_lembur_total' => 'decimal:2',
        'total_pendapatan' => 'decimal:2',
        'tunjangan_pajak' => 'decimal:2',
        'potongan_bpjs_tk' => 'decimal:2',
        'potongan_bpjs_ks' => 'decimal:2',
        'potongan_pph21' => 'decimal:2',
        'total_potongan' => 'decimal:2',
        'gaji_bersih' => 'decimal:2',
    ];

    public function payroll(): BelongsTo
    {
        return $this->belongsTo(DailyWorkerPayroll::class, 'daily_worker_payroll_id');
    }

    public function dailyWorker(): BelongsTo
    {
        return $this->belongsTo(DailyWorker::class);
    }
}
