<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\KpiEvaluation;
use App\Models\Position;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class KpiEvaluationController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $employee = $user->employee;

        $query = KpiEvaluation::with(['employee.department', 'employee.position', 'evaluator', 'hr']);

        if ($user->isAdmin() || $user->hasPermission('kpi.view_others')) {
            // Can see all
        } elseif ($employee) {
            $query->where(function ($q) use ($employee, $user) {
                // Own evaluations
                if ($user->hasPermission('kpi.view_own')) {
                    $q->orWhere('employee_id', $employee->id);
                }
                // Subordinates evaluations
                if ($user->hasPermission('kpi.evaluate')) {
                    $q->orWhere('evaluator_id', $employee->id);
                }
            });
        } else {
            $query->whereRaw('1=0');
        }

        $evaluations = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('kpis/index', [
            'evaluations' => $evaluations,
            'isHR' => $user->isAdmin() || $user->hasPermission('kpi.create'),
        ]);
    }

    public function create()
    {
        if (!auth()->user()->isAdmin() && !auth()->user()->hasPermission('kpi.create')) {
            abort(403);
        }

        return Inertia::render('kpis/form', [
            'employees' => Employee::with('position')->where('is_active', true)->orderBy('nama')->get(['id', 'nama', 'nik', 'department_id', 'position_id', 'hire_date', 'report_to']),
            'isHR' => auth()->user()->isAdmin() || auth()->user()->hasPermission('kpi.create'),
            'isManager' => false,
            'isEmployee' => false,
            'canEdit' => true,
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->isAdmin() && !auth()->user()->hasPermission('kpi.create')) {
            abort(403);
        }

        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'period_type' => 'required|string',
            'period_detail' => 'nullable|string',
            'evaluation_date' => 'required|date',
            'score_attendance' => 'required|integer|min:1|max:3',
            'score_punctuality' => 'required|integer|min:1|max:3',
            'score_obedience' => 'required|integer|min:1|max:3',
        ]);

        $employee = Employee::find($validated['employee_id']);
        
        $evaluation = KpiEvaluation::create([
            ...$validated,
            'evaluator_id' => $employee->report_to,
            'hr_id' => auth()->user()->employee?->id,
            'status' => 'pending_manager',
        ]);

        $evaluation->calculateTotalScore();

        return redirect()->route('kpi-evaluations.index')->with('success', 'Evaluasi KPI berhasil dibuat dan dikirim ke Manager.');
    }

    public function edit(KpiEvaluation $kpiEvaluation)
    {
        $user = auth()->user();
        $employee = $user->employee;
        $kpiEvaluation->load(['employee.department', 'employee.position', 'evaluator', 'hr']);

        // Authorization check
        $canEdit = false;
        if ($user->isAdmin()) $canEdit = true;
        elseif ($kpiEvaluation->status === 'pending_hr' && $user->hasPermission('kpi.create')) $canEdit = true;
        elseif ($kpiEvaluation->status === 'pending_manager' && $employee && $kpiEvaluation->evaluator_id === $employee->id) $canEdit = true;
        elseif ($kpiEvaluation->status === 'pending_employee' && $employee && $kpiEvaluation->employee_id === $employee->id) $canEdit = true;

        if (!$canEdit && !$user->hasPermission('kpi.view_others') && !($employee && $kpiEvaluation->employee_id === $employee->id)) {
            abort(403);
        }

        return Inertia::render('kpis/form', [
            'evaluation' => $kpiEvaluation,
            'isHR' => $user->isAdmin() || $user->hasPermission('kpi.create'),
            'isManager' => $employee && $kpiEvaluation->evaluator_id === $employee->id,
            'isEmployee' => $employee && $kpiEvaluation->employee_id === $employee->id,
            'canEdit' => $canEdit,
        ]);
    }

    public function update(Request $request, KpiEvaluation $kpiEvaluation)
    {
        $user = auth()->user();
        $employee = $user->employee;

        if ($kpiEvaluation->status === 'pending_manager' && (($employee && $kpiEvaluation->evaluator_id === $employee->id) || $user->isAdmin())) {
            $validated = $request->validate([
                'score_kpi_1' => 'nullable|integer|min:0|max:10',
                'score_kpi_2' => 'nullable|integer|min:0|max:10',
                'score_kpi_3' => 'nullable|integer|min:0|max:10',
                'score_kpi_4' => 'nullable|integer|min:0|max:10',
                'score_kpi_5' => 'nullable|integer|min:0|max:10',
                'score_planning' => 'required|integer|min:1|max:3',
                'score_analysis' => 'required|integer|min:1|max:3',
                'score_independence' => 'required|integer|min:1|max:3',
                'score_attitude' => 'required|integer|min:1|max:3',
                'score_collab_sup' => 'required|integer|min:1|max:3',
                'score_collab_peers' => 'required|integer|min:1|max:3',
                'score_collab_sub' => 'required|integer|min:0|max:3',
                'rec_1' => 'nullable|string',
                'rec_2' => 'nullable|string',
                'rec_3' => 'nullable|string',
            ]);

            $kpiEvaluation->update([
                ...$validated,
                'status' => 'pending_employee',
            ]);
        } elseif ($kpiEvaluation->status === 'pending_employee' && $employee && $kpiEvaluation->employee_id === $employee->id) {
            $validated = $request->validate([
                'employee_comment' => 'required|string|max:1000',
            ]);

            $kpiEvaluation->update([
                ...$validated,
                'status' => 'completed',
            ]);
        } elseif ($user->isAdmin()) {
            // Admin can update anything
            $kpiEvaluation->update($request->all());
        } else {
            abort(403);
        }

        $kpiEvaluation->calculateTotalScore();

        return redirect()->route('kpi-evaluations.index')->with('success', 'Evaluasi KPI berhasil diperbarui.');
    }

    public function whatsappUrl(KpiEvaluation $evaluation)
    {
        $evaluation->load(['employee', 'evaluator', 'hr']);
        
        $target = null;
        if ($evaluation->status === 'pending_manager') {
            $target = $evaluation->evaluator;
            $roleName = "Manager/Atasan";
        } elseif ($evaluation->status === 'pending_employee') {
            $target = $evaluation->employee;
            $roleName = "Karyawan";
        } elseif ($evaluation->status === 'completed') {
            $target = $evaluation->hr;
            $roleName = "HRD";
        }

        if (!$target || !$target->no_telpon_1) {
            return response()->json(['error' => 'Nomor telepon tujuan tidak ditemukan.'], 422);
        }

        $phone = preg_replace('/[^0-9]/', '', $target->no_telpon_1);
        if (str_starts_with($phone, '0')) $phone = '62' . substr($phone, 1);
        elseif (!str_starts_with($phone, '62')) $phone = '62' . $phone;

        $siteUrl = config('app.url') . "/kpi-evaluations/{$evaluation->id}/edit";
        
        $message = "Halo {$target->nama},\n\n" .
                  "Pemberitahuan mengenai Evaluasi KPI untuk:\n" .
                  "Nama: {$evaluation->employee->nama}\n" .
                  "Periode: " . str_replace('_', ' ', $evaluation->period_type) . "\n" .
                  "Status Saat Ini: " . str_replace('_', ' ', $evaluation->status) . "\n\n" .
                  "Silakan klik link berikut untuk meninjau/melengkapi data:\n" .
                  "{$siteUrl}";

        return response()->json([
            'url' => "https://wa.me/{$phone}?text=" . urlencode($message),
            'target_name' => $target->nama,
            'target_role' => $roleName,
        ]);
    }

    public function downloadPdf(KpiEvaluation $evaluation)
    {
        $user = auth()->user();
        $employee = $user->employee;
        $evaluation->load(['employee.department', 'employee.position', 'employee.workLocation', 'evaluator', 'hr']);

        // Authorization check
        $canView = false;
        if ($user->isAdmin() || $user->hasPermission('kpi.view_others')) $canView = true;
        elseif ($employee && $evaluation->evaluator_id === $employee->id) $canView = true;
        elseif ($employee && $evaluation->employee_id === $employee->id && $evaluation->status === 'completed') $canView = true;

        if (!$canView) {
            abort(403);
        }

        $pdf = Pdf::loadView('pdf.kpi_evaluation', [
            'evaluation' => $evaluation,
        ]);

        $fileName = 'Evaluasi_KPI_' . $evaluation->employee->nama . '_' . str_replace(' ', '_', $evaluation->period_type) . '.pdf';
        
        return $pdf->download($fileName);
    }
}
