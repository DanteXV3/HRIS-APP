<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contract extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'work_location_id',
        'working_location_id',
        'position_id',
        'contract_number',
        'start_date',
        'end_date',
        'status',
        'first_party_name',
        'first_party_position',
        'first_party_address',
        'second_party_name',
        'second_party_nik',
        'second_party_gender',
        'second_party_pob',
        'second_party_dob',
        'second_party_address',
        'second_party_position',
        'base_salary',
        'position_allowance',
        'attendance_allowance',
        'transport_allowance',
        'meal_allowance',
        'uang_makan_site',
        'overtime_allowance',
        'signed_file',
        'created_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'second_party_dob' => 'date',
        'base_salary' => 'decimal:2',
        'position_allowance' => 'decimal:2',
        'attendance_allowance' => 'decimal:2',
        'transport_allowance' => 'decimal:2',
        'meal_allowance' => 'decimal:2',
        'uang_makan_site' => 'decimal:2',
        'overtime_allowance' => 'decimal:2',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function workLocation(): BelongsTo
    {
        return $this->belongsTo(WorkLocation::class);
    }

    public function workingLocation(): BelongsTo
    {
        return $this->belongsTo(WorkingLocation::class);
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    
    public function getSignedFileUrlAttribute(): ?string
    {
        return $this->signed_file ? asset('storage/' . $this->signed_file) : null;
    }
}
