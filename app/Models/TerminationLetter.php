<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TerminationLetter extends Model
{
    protected $fillable = [
        'letter_number', 'date', 'employee_id', 'maker_id', 'company_id',
        'termination_date', 'reason', 'severance_amount', 'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'termination_date' => 'date',
        'severance_amount' => 'decimal:2',
    ];

    public function employee(): BelongsTo { return $this->belongsTo(Employee::class); }
    public function maker(): BelongsTo { return $this->belongsTo(Employee::class, 'maker_id'); }
    public function company(): BelongsTo { return $this->belongsTo(WorkLocation::class, 'company_id'); }
}
