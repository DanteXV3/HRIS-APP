<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReferenceLetter extends Model
{
    protected $fillable = [
        'letter_number', 'date', 'employee_id', 'maker_id', 'company_id',
        'work_location_text', 'from_date', 'to_date', 'qualities', 'recommendation_text',
    ];

    protected $casts = [
        'date' => 'date',
        'from_date' => 'date',
        'to_date' => 'date',
    ];

    public function employee(): BelongsTo { return $this->belongsTo(Employee::class); }
    public function maker(): BelongsTo { return $this->belongsTo(Employee::class, 'maker_id'); }
    public function company(): BelongsTo { return $this->belongsTo(WorkLocation::class, 'company_id'); }
}
