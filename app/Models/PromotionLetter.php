<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PromotionLetter extends Model
{
    protected $fillable = [
        'letter_number', 'date', 'employee_id', 'maker_id', 'company_id',
        'type', 'from_position', 'to_position', 'from_department', 'to_department',
        'effective_date', 'new_salary', 'reason',
    ];

    protected $casts = [
        'date' => 'date',
        'effective_date' => 'date',
        'new_salary' => 'decimal:2',
    ];

    public function employee(): BelongsTo { return $this->belongsTo(Employee::class); }
    public function maker(): BelongsTo { return $this->belongsTo(Employee::class, 'maker_id'); }
    public function company(): BelongsTo { return $this->belongsTo(WorkLocation::class, 'company_id'); }
}
