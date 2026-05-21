<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BudgetItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'working_location_id',
        'item_code',
        'nama_budget',
        'budget_unit',
        'qty_budget',
        'nilai_budget_material',
        'nilai_budget_jasa',
        'msr_unit',
        'conversion_unit',
    ];

    protected $casts = [
        'nilai_budget_material' => 'decimal:2',
        'nilai_budget_jasa' => 'decimal:2',
        'qty_budget' => 'decimal:2',
        'conversion_unit' => 'decimal:4',
    ];

    /**
     * Get the working location that owns the budget item.
     */
    public function workingLocation(): BelongsTo
    {
        return $this->belongsTo(WorkingLocation::class);
    }
}
