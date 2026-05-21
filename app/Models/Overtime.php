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

    public static function booted()
    {
        static::created(function ($ot) {
            $supervisor = $ot->approvedBySupervisor;
            if ($supervisor && $supervisor->user) {
                \App\Services\FirebaseService::sendToUser(
                    $supervisor->user,
                    'Pengajuan Lembur Baru',
                    "Form Lembur baru dari {$ot->creator->nama} menunggu approval.",
                    ['screen' => '/overtimes', 'id' => (string)$ot->id]
                );
            }
        });

        static::updated(function ($ot) {
            if ($ot->isDirty('status')) {
                // Notify all employees involved
                $statusStr = $ot->status === 'approved' ? 'DISETUJUI' : ($ot->status === 'rejected' ? 'DITOLAK' : 'DIUPDATE');
                $employees = $ot->employees;
                foreach ($employees as $employee) {
                    if ($employee->user) {
                        \App\Services\FirebaseService::sendToUser(
                            $employee->user,
                            'Update Pengajuan Lembur',
                            "Form Lembur pada {$ot->tanggal->format('d M')} telah $statusStr.",
                            ['screen' => '/overtimes', 'id' => (string)$ot->id]
                        );
                    }
                }
            }
        });
    }

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
