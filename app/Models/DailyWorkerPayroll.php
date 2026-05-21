<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DailyWorkerPayroll extends Model
{
    use HasFactory;

    protected $fillable = [
        'working_location_id',
        'periode_start',
        'periode_end',
        'calc_bpjs_tk',
        'calc_bpjs_ks',
        'calc_pph21',
        'status',
        'processed_by',
        'notes',
    ];

    protected $casts = [
        'periode_start' => 'date',
        'periode_end' => 'date',
        'calc_bpjs_tk' => 'boolean',
        'calc_bpjs_ks' => 'boolean',
        'calc_pph21' => 'boolean',
    ];

    public function workingLocation(): BelongsTo
    {
        return $this->belongsTo(WorkingLocation::class);
    }

    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(DailyWorkerPayrollItem::class);
    }
}
