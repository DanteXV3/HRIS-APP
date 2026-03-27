<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class WarningLetter extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'level',
        'reference_number',
        'reason',
        'description',
        'issued_date',
        'valid_until',
        'issued_by',
        'status',
    ];

    protected $casts = [
        'issued_date' => 'date',
        'valid_until' => 'date',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function issuer(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'issued_by');
    }

    /**
     * Get level as Roman numeral string
     */
    public function getLevelRomanAttribute(): string
    {
        switch ($this->level) {
            case 1: return 'I';
            case 2: return 'II';
            case 3: return 'III';
            default: return (string)$this->level;
        }
    }
}
