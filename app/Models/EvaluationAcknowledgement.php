<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EvaluationAcknowledgement extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'type',
        'cycle_date',
        'acknowledged_at',
        'acknowledged_by',
    ];

    protected $casts = [
        'cycle_date' => 'date:Y-m-d',
        'acknowledged_at' => 'datetime',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function acknowledger(): BelongsTo
    {
        return $this->belongsTo(User::class, 'acknowledged_by');
    }
}
