<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SecurityReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'creator_id',
        'working_location_id',
        'status',
        'patrol_date',
        'shift_name',
    ];

    protected function casts(): array
    {
        return [
            'patrol_date' => 'date',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function workingLocation(): BelongsTo
    {
        return $this->belongsTo(WorkingLocation::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(SecurityReportItem::class);
    }
}
