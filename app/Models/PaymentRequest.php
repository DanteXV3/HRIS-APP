<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaymentRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'pr_number', 'date', 'company_id', 'working_location_id', 'department_id',
        'subject', 'description', 'amount', 'paid_to', 'bank_name', 'bank_account',
        'notes', 'status', 'requested_by_id', 'requested_at', 'requester_signature_snapshot',
        'tax_status', 'tax_approver_id', 'tax_approved_at', 'tax_notes', 'tax_signature_snapshot',
        'accounting_status', 'accounting_approver_id', 'accounting_approved_at', 'accounting_notes', 'accounting_signature_snapshot',
        'cost_control_status', 'cost_control_approver_id', 'cost_control_approved_at', 'cost_control_notes', 'cost_control_signature_snapshot',
        'head_branch_status', 'head_branch_approver_id', 'head_branch_approved_at', 'head_branch_notes', 'head_branch_signature_snapshot',
        'director_status', 'director_approver_id', 'director_approved_at', 'director_notes', 'director_signature_snapshot',
        'commissioner_status', 'commissioner_approver_id', 'commissioner_approved_at', 'commissioner_notes', 'commissioner_signature_snapshot',
        'advisor_status', 'advisor_approver_id', 'advisor_approved_at', 'advisor_notes', 'advisor_signature_snapshot',
        'finance_status', 'finance_approver_id', 'finance_approved_at', 'finance_notes', 'finance_signature_snapshot',
        'payment_evidence'
    ];

    protected $casts = [
        'date' => 'date',
        'amount' => 'decimal:2',
        'requested_at' => 'datetime',
        'tax_approved_at' => 'datetime',
        'accounting_approved_at' => 'datetime',
        'cost_control_approved_at' => 'datetime',
        'head_branch_approved_at' => 'datetime',
        'director_approved_at' => 'datetime',
        'commissioner_approved_at' => 'datetime',
        'advisor_approved_at' => 'datetime',
        'finance_approved_at' => 'datetime',
    ];

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
        return $this->belongsTo(WorkingLocation::class, 'working_location_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(PaymentRequestAttachment::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(PaymentRequestItem::class);
    }

    // Approver Relationships
    public function taxApprover(): BelongsTo { return $this->belongsTo(Employee::class, 'tax_approver_id'); }
    public function accountingApprover(): BelongsTo { return $this->belongsTo(Employee::class, 'accounting_approver_id'); }
    public function costControlApprover(): BelongsTo { return $this->belongsTo(Employee::class, 'cost_control_approver_id'); }
    public function headBranchApprover(): BelongsTo { return $this->belongsTo(Employee::class, 'head_branch_approver_id'); }
    public function directorApprover(): BelongsTo { return $this->belongsTo(Employee::class, 'director_approver_id'); }
    public function commissionerApprover(): BelongsTo { return $this->belongsTo(Employee::class, 'commissioner_approver_id'); }
    public function advisorApprover(): BelongsTo { return $this->belongsTo(Employee::class, 'advisor_approver_id'); }
    public function financeApprover(): BelongsTo { return $this->belongsTo(Employee::class, 'finance_approver_id'); }
}
