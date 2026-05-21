<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExpenseEstimateLetter extends Model
{
    protected $fillable = [
        'expense_estimate_id', 'letter_number', 'date',
        'total_amount', 'maker_id', 'selected_item_ids',
    ];

    protected $casts = [
        'date' => 'date',
        'total_amount' => 'decimal:2',
        'selected_item_ids' => 'array',
    ];

    public function estimate(): BelongsTo { return $this->belongsTo(ExpenseEstimate::class, 'expense_estimate_id'); }
    public function maker(): BelongsTo { return $this->belongsTo(Employee::class, 'maker_id'); }
    public function files(): HasMany { return $this->hasMany(ExpenseEstimateLetterFile::class); }
}
