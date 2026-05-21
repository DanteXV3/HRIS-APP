<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PersonalityTest extends Model
{
    use HasFactory;

    protected $fillable = [
        'candidate_name',
        'candidate_info',
        'test_type',
        'answers',
        'results',
        'tester_id',
    ];

    protected $casts = [
        'answers' => 'array',
        'results' => 'array',
    ];

    public function tester(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'tester_id');
    }
}
