<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OfferingLetter extends Model
{
    protected $fillable = [
        'letter_number', 'date', 'candidate_name', 'candidate_address',
        'maker_id', 'company_id', 'position_offered', 'department_text',
        'start_date', 'offered_salary', 'employment_type', 'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'start_date' => 'date',
        'offered_salary' => 'decimal:2',
    ];

    public function maker(): BelongsTo { return $this->belongsTo(Employee::class, 'maker_id'); }
    public function company(): BelongsTo { return $this->belongsTo(WorkLocation::class, 'company_id'); }
}
