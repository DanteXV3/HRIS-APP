<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class JobOpening extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid', 'company', 'position', 'working_location', 'requested_by',
        'salary_min', 'salary_max', 'contract_duration', 'requirements',
        'status', 'created_by',
    ];

    protected $casts = [
        'requirements' => 'array',
        'salary_min' => 'decimal:2',
        'salary_max' => 'decimal:2',
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            if (!$model->uuid) {
                // Short alphanumeric string instead of long UUID
                $model->uuid = \Illuminate\Support\Str::lower(\Illuminate\Support\Str::random(8));
            }
        });
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }

    public function getPublicUrlAttribute(): string
    {
        return url("/career/{$this->uuid}");
    }
}
