<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SppdItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'sppd_id',
        'hal',
        'description',
        'qty',
        'price',
        'total_price',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    public function sppd(): BelongsTo
    {
        return $this->belongsTo(Sppd::class);
    }
}
