<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentRequestItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_request_id',
        'description',
        'unit',
        'qty',
        'price',
        'amount',
    ];

    protected $casts = [
        'qty' => 'decimal:2',
        'price' => 'decimal:2',
        'amount' => 'decimal:2',
    ];

    public function paymentRequest(): BelongsTo
    {
        return $this->belongsTo(PaymentRequest::class);
    }
}
