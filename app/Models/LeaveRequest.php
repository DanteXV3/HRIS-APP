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
