<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class JobApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid', 'job_opening_id', 'name', 'email', 'phone', 'address',
        'requirement_checklist', 'cv_files', 'status', 'recruitment_form',
        'recruitment_form_submitted_at', 'personality_test_id', 'mbti_test_id', 'notes',
    ];

    protected $casts = [
        'requirement_checklist' => 'array',
        'cv_files' => 'array',
        'recruitment_form' => 'array',
        'recruitment_form_submitted_at' => 'datetime',
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            if (!$model->uuid) {
                // Short alphanumeric string
                $model->uuid = \Illuminate\Support\Str::lower(\Illuminate\Support\Str::random(8));
            }
        });
    }

    public function jobOpening(): BelongsTo
    {
        return $this->belongsTo(JobOpening::class);
    }

    public function discTest(): BelongsTo
    {
        return $this->belongsTo(PersonalityTest::class, 'personality_test_id');
    }

    public function mbtiTest(): BelongsTo
    {
        return $this->belongsTo(PersonalityTest::class, 'mbti_test_id');
    }

    public function getFormLinkAttribute(): string
    {
        return url("/career/form/{$this->uuid}");
    }
}
