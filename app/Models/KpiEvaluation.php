<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KpiEvaluation extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'evaluator_id',
        'hr_id',
        'period_type',
        'period_detail',
        'evaluation_date',
        'status',
        'score_kpi_1',
        'score_kpi_2',
        'score_kpi_3',
        'score_kpi_4',
        'score_kpi_5',
        'score_planning',
        'score_analysis',
        'score_independence',
        'score_attitude',
        'score_collab_sup',
        'score_collab_peers',
        'score_collab_sub',
        'score_attendance',
        'score_punctuality',
        'score_obedience',
        'rec_1',
        'rec_2',
        'rec_3',
        'employee_comment',
        'total_score',
    ];

    protected $casts = [
        'evaluation_date' => 'date',
        'total_score' => 'decimal:2',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function evaluator(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'evaluator_id');
    }

    public function hr(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'hr_id');
    }

    /**
     * Calculate total weighted score
     */
    public function calculateTotalScore()
    {
        // Section B: Main KPI (Max 50) -> 60%
        $sumB = $this->score_kpi_1 + $this->score_kpi_2 + $this->score_kpi_3 + $this->score_kpi_4 + $this->score_kpi_5;
        $weightedB = ($sumB / 50) * 60;

        // Section C: General (Max 21) -> 30%
        $sumC = $this->score_planning + $this->score_analysis + $this->score_independence + 
                $this->score_attitude + $this->score_collab_sup + $this->score_collab_peers + 
                $this->score_collab_sub;
        $weightedC = ($sumC / 21) * 30;

        // Section D: Discipline (Max 9) -> 10%
        $sumD = $this->score_attendance + $this->score_punctuality + $this->score_obedience;
        $weightedD = ($sumD / 9) * 10;

        $this->total_score = $weightedB + $weightedC + $weightedD;
        $this->save();
        
        return $this->total_score;
    }
}
