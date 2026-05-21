<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExpenseEstimateLetterFile extends Model
{
    protected $fillable = ['expense_estimate_letter_id', 'file_path', 'original_name'];

    public function letter(): BelongsTo { return $this->belongsTo(ExpenseEstimateLetter::class, 'expense_estimate_letter_id'); }
}
