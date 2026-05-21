<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MaterialServiceRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'msr_number', 'date', 'company_id', 'work_location_id', 'department_id',
        'subject', 'description', 'total_amount', 'notes', 'status',
        'requested_by_id', 'requested_at', 'requester_signature_snapshot',
        'supervisor_status', 'supervisor_approver_id', 'supervisor_approved_at', 'supervisor_notes', 'supervisor_signature_snapshot',
        'manager_status', 'manager_approver_id', 'manager_approved_at', 'manager_notes', 'manager_signature_snapshot',
        'pr_maker_status', 'pr_maker_approver_id', 'pr_maker_approved_at', 'pr_maker_notes', 'pr_maker_signature_snapshot',
        'finance_status', 'finance_approver_id', 'finance_approved_at', 'finance_notes', 'finance_signature_snapshot',
    ];

    protected $casts = [
        'date' => 'date',
        'total_amount' => 'decimal:2',
        'requested_at' => 'datetime',
        'supervisor_approved_at' => 'datetime',
        'manager_approved_at' => 'datetime',
        'pr_maker_approved_at' => 'datetime',
        'finance_approved_at' => 'datetime',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(MaterialServiceRequestItem::class, 'msr_id');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(MaterialServiceRequestAttachment::class, 'msr_id');
    }

    public function requestedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'requested_by_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(WorkLocation::class, 'company_id');
    }

    public function workLocation(): BelongsTo
    {
        return $this->belongsTo(WorkingLocation::class, 'work_location_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    // Approver relations
    public function supervisorApprover(): BelongsTo { return $this->belongsTo(Employee::class, 'supervisor_approver_id'); }
    public function managerApprover(): BelongsTo { return $this->belongsTo(Employee::class, 'manager_approver_id'); }
    public function prMakerApprover(): BelongsTo { return $this->belongsTo(Employee::class, 'pr_maker_approver_id'); }
    public function financeApprover(): BelongsTo { return $this->belongsTo(Employee::class, 'finance_approver_id'); }
}
