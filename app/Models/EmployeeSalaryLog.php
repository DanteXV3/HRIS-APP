<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeSalaryLog extends Model
{
    protected $fillable = [
        'employee_id',
        'changed_by',
        'before',
        'after',
        'changed_fields',
        'notes',
    ];

    protected $casts = [
        'before'         => 'array',
        'after'          => 'array',
        'changed_fields' => 'array',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
