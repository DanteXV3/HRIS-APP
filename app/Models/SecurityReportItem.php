<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SecurityReportItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'security_report_id',
        'area_name',
        'condition',
        'photo_path',
        'notes',
        'latitude',
        'longitude',
        'checked_at',
    ];

    protected function casts(): array
    {
        return [
            'checked_at' => 'datetime',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
        ];
    }

    public function securityReport(): BelongsTo
    {
        return $this->belongsTo(SecurityReport::class);
    }
}
