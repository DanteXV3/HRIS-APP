<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Paklaring extends Model
{
    use HasFactory;

    protected $fillable = [
        'letter_number',
        'date',
        'employee_id',
        'maker_id',
        'company_id',
        'work_location_text',
        'from_date',
        'to_date',
        'reason_for_leaving',
    ];

    protected $casts = [
        'date' => 'date',
        'from_date' => 'date',
        'to_date' => 'date',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    public function maker(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'maker_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(WorkLocation::class, 'company_id');
    }
}
