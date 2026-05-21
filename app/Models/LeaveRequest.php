<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaveRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'leave_type_id',
        'tanggal_mulai',
        'tanggal_selesai',
        'jumlah_hari',
        'alasan',
        'yang_menggantikan',
        'attachment',
        'approved_by_supervisor_id',
        'supervisor_status',
        'supervisor_approved_at',
        'supervisor_notes',
        'approved_by_manager_id',
        'manager_status',
        'manager_approved_at',
        'manager_notes',
        'status',
    ];

    public static function booted()
    {
        static::created(function ($leave) {
            $supervisor = $leave->approvedBySupervisor;
            if ($supervisor && $supervisor->user) {
                \App\Services\FirebaseService::sendToUser(
                    $supervisor->user,
                    'Pengajuan Cuti Baru',
                    "Karyawan {$leave->employee->nama} mengajukan cuti baru.",
                    ['screen' => '/approvals', 'id' => (string)$leave->id]
                );
            }
        });

        static::updated(function ($leave) {
            // Notify employee when status changes
            if ($leave->isDirty('supervisor_status') || $leave->isDirty('manager_status') || $leave->isDirty('status')) {
                $employee = $leave->employee;
                if ($employee && $employee->user) {
                    $statusStr = $leave->status === 'approved' ? 'DISETUJUI' : ($leave->status === 'rejected' ? 'DITOLAK' : 'DIPROSES');
                    \App\Services\FirebaseService::sendToUser(
                        $employee->user,
                        'Update Pengajuan Cuti',
                        "Pengajuan cuti Anda telah $statusStr.",
                        ['screen' => '/leaves', 'id' => (string)$leave->id]
                    );
                }
            }

            // Notify Manager when Supervisor approves
            if ($leave->isDirty('supervisor_status') && $leave->supervisor_status === 'approved') {
                $manager = $leave->approvedByManager;
                if ($manager && $manager->user) {
                    \App\Services\FirebaseService::sendToUser(
                        $manager->user,
                        'Persetujuan Cuti (Level Manager)',
                        "Persetujuan Cuti {$leave->employee->nama} menunggu approval Anda.",
                        ['screen' => '/approvals', 'id' => (string)$leave->id]
                    );
                }
            }
        });
    }

    protected function casts(): array
    {
        return [
            'tanggal_mulai' => 'date:Y-m-d',
            'tanggal_selesai' => 'date:Y-m-d',
            'supervisor_approved_at' => 'datetime',
            'manager_approved_at' => 'datetime',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function leaveType(): BelongsTo
    {
        return $this->belongsTo(LeaveType::class);
    }

    public function approvedBySupervisor(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'approved_by_supervisor_id');
    }

    public function approvedByManager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'approved_by_manager_id');
    }

    public function isPendingFirstApproval(): bool
    {
        return $this->supervisor_status === 'pending' && $this->status === 'pending';
    }

    public function isPendingSecondApproval(): bool
    {
        return $this->supervisor_status === 'approved' && $this->manager_status === 'pending' && $this->status === 'partially_approved';
    }
}
