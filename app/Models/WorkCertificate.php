<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkCertificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'letter_number',
        'date',
        'purpose',
        'employee_id',
        'maker_id',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    public function maker(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'maker_id');
    }
}
