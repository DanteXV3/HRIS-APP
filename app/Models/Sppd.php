<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sppd extends Model
{
    use HasFactory;

    protected $fillable = [
        'letter_number',
        'tujuan',
        'tanggal_berangkat',
        'tanggal_kembali',
        'atas_permintaan_id',
        'maksud_perjalanan_dinas',
        'signed_pdf_path',
        'maker_id',
        'status',
        'total_amount',
        'work_location_id',
        'external_employees',
    ];

    protected $casts = [
        'tanggal_berangkat' => 'date',
        'tanggal_kembali' => 'date',
        'total_amount' => 'decimal:2',
        'external_employees' => 'array',
    ];

    public function workLocation(): BelongsTo
    {
        return $this->belongsTo(WorkLocation::class);
    }

    public function employees(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Employee::class, 'employee_sppd');
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'atas_permintaan_id');
    }

    public function maker(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'maker_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(SppdItem::class);
    }
}
