<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExpenseEstimateItem extends Model
{
    protected $fillable = [
        'expense_estimate_id', 'uraian_penggunaan', 'working_location_id',
        'fase_pembayaran', 'tanggal_jatuh_tempo', 'nominal',
        'tanggal_bayar', 'nominal_dibayarkan', 'status', 'keterangan',
    ];

    protected $casts = [
        'tanggal_jatuh_tempo' => 'date',
        'tanggal_bayar' => 'date',
        'nominal' => 'decimal:2',
        'nominal_dibayarkan' => 'decimal:2',
    ];

    protected $appends = ['sisa_pembayaran'];

    public function estimate(): BelongsTo { return $this->belongsTo(ExpenseEstimate::class, 'expense_estimate_id'); }
    public function workingLocation(): BelongsTo { return $this->belongsTo(WorkingLocation::class); }

    public function getSisaPembayaranAttribute(): float
    {
        return (float)$this->nominal - (float)$this->nominal_dibayarkan;
    }
}
