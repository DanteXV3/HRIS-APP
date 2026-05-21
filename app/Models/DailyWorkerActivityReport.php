<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DailyWorkerActivityReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'working_location_id',
        'tanggal',
        'is_finalized',
        'finalized_at',
        'finalized_by',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'is_finalized' => 'boolean',
        'finalized_at' => 'datetime',
    ];

    public function workingLocation(): BelongsTo
    {
        return $this->belongsTo(WorkingLocation::class);
    }

    public function finalizedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'finalized_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(DailyWorkerActivityReportItem::class);
    }
}
