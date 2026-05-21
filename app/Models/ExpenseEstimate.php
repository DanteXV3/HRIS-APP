<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExpenseEstimate extends Model
{
    protected $fillable = ['month', 'year', 'company_id', 'status', 'created_by'];

    public function company(): BelongsTo { return $this->belongsTo(WorkLocation::class, 'company_id'); }
    public function creator(): BelongsTo { return $this->belongsTo(Employee::class, 'created_by'); }
    public function items(): HasMany { return $this->hasMany(ExpenseEstimateItem::class); }
    public function letters(): HasMany { return $this->hasMany(ExpenseEstimateLetter::class); }

    public function getMonthNameAttribute(): string
    {
        $months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
        return $months[$this->month - 1] ?? '';
    }
}
