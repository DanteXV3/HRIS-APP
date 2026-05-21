<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SecurityPatrolArea extends Model
{
    use HasFactory;

    protected $fillable = [
        'working_location_id',
        'name',
        'sequence',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sequence' => 'integer',
        ];
    }

    public function workingLocation(): BelongsTo
    {
        return $this->belongsTo(WorkingLocation::class);
    }
}
