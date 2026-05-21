<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransferLetter extends Model
{
    protected $fillable = [
        'letter_number', 'date', 'employee_id', 'maker_id', 'company_id',
        'from_location', 'to_location', 'from_position', 'to_position',
        'effective_date', 'reason',
    ];

    protected $casts = [
        'date' => 'date',
        'effective_date' => 'date',
    ];

    public function employee(): BelongsTo { return $this->belongsTo(Employee::class); }
    public function maker(): BelongsTo { return $this->belongsTo(Employee::class, 'maker_id'); }
    public function company(): BelongsTo { return $this->belongsTo(WorkLocation::class, 'company_id'); }
}
