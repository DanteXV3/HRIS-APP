<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Overtime extends Model
{
    use HasFactory;

    protected $fillable = [
        'creator_id',
        'tanggal',
        'jam_mulai',
        'jam_berakhir',
        'durasi',
        'working_location_id',
        'lokasi_kerja',
        'keperluan',
        'status',
        'supervisor_status',
        'approved_by_supervisor_id',
        'supervisor_approved_at',
        'supervisor_notes',
        'manager_status',
        'approved_by_manager_id',
        'manager_approved_at',
        'manager_notes',
    ];

    protected function casts(): array
    {
        return [
            'tanggal' => 'date',
            'supervisor_approved_at' => 'datetime',
            'manager_approved_at' => 'datetime',
            'durasi' => 'decimal:2',
        ];
    }

    /**
     * The employee who created the overtime form.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'creator_id');
    }

    /**
     * The employees included in this overtime form.
     */
    public function employees(): BelongsToMany
    {
        return $this->belongsToMany(Employee::class, 'overtime_employee');
    }

    public function approvedBySupervisor(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'approved_by_supervisor_id');
    }

    public function approvedByManager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'approved_by_manager_id');
    }

    public function workingLocation(): BelongsTo
    {
        return $this->belongsTo(WorkingLocation::class);
    }
}
