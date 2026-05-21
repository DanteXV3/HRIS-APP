<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'assigned_from',
        'assigned_to',
        'category',
        'frequency',
        'due_date',
        'last_completed_at',
        'is_completed',
        'is_active',
    ];

    protected $casts = [
        'due_date' => 'date',
        'last_completed_at' => 'datetime',
        'is_completed' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'assigned_from');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'assigned_to');
    }

    /**
     * Determine if the task should be shown as a reminder on the dashboard.
     */
    public function shouldShowReminder(): bool
    {
        if (!$this->is_active) return false;

        $now = Carbon::now();

        // One-time tasks
        if ($this->category === 'one-time') {
            if ($this->is_completed) return false;
            
            // Show if within 7 days of due date
            if ($this->due_date) {
                return $now->diffInDays($this->due_date, false) <= 7;
            }
            return true;
        }

        // Recurring tasks
        if ($this->category === 'recurring') {
            switch ($this->frequency) {
                case 'daily':
                    // Show if not completed today
                    return !$this->last_completed_at || !$this->last_completed_at->isToday();

                case 'weekly':
                    // Logic: Show if due soon (7 days) and not completed in this cycle
                    // For simplicity, we check if last_completed_at is more than 6 days ago
                    // or if it matches the current week boundaries.
                    if ($this->last_completed_at && $this->last_completed_at->diffInDays($now) < 7) {
                        return false;
                    }
                    if ($this->due_date) {
                        return $now->diffInDays($this->calculateNextOccurrence(), false) <= 7;
                    }
                    return true;

                case 'monthly':
                    if ($this->last_completed_at && $this->last_completed_at->month === $now->month && $this->last_completed_at->year === $now->year) {
                        return false;
                    }
                    if ($this->due_date) {
                        return $now->diffInDays($this->calculateNextOccurrence(), false) <= 7;
                    }
                    return true;

                case 'yearly':
                    if ($this->last_completed_at && $this->last_completed_at->year === $now->year) {
                        return false;
                    }
                    if ($this->due_date) {
                        return $now->diffInDays($this->calculateNextOccurrence(), false) <= 7;
                    }
                    return true;
            }
        }

        return false;
    }

    public function calculateNextOccurrence(): Carbon
    {
        $base = $this->due_date ? Carbon::parse($this->due_date) : Carbon::now();
        $now = Carbon::now();

        if ($this->category !== 'recurring') return $base;

        while ($base->lt($now) && !$base->isToday()) {
            if ($this->frequency === 'daily') $base->addDay();
            elseif ($this->frequency === 'weekly') $base->addWeek();
            elseif ($this->frequency === 'monthly') $base->addMonth();
            elseif ($this->frequency === 'yearly') $base->addYear();
            else break;
        }

        return $base;
    }
}
