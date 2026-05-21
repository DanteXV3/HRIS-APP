<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaterialServiceRequestItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'msr_id', 'category', 'budget_item_id', 'item_code', 'item_name',
        'size', 'material', 'unit', 'qty', 'price', 'total_price', 'keterangan',
    ];

    protected $casts = [
        'qty' => 'decimal:2',
        'price' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    public function msr(): BelongsTo
    {
        return $this->belongsTo(MaterialServiceRequest::class, 'msr_id');
    }

    public function budgetItem(): BelongsTo
    {
        return $this->belongsTo(BudgetItem::class, 'budget_item_id');
    }
}
