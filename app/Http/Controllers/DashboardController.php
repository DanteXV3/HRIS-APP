<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Attendance;
use App\Models\ExitPermit;
use App\Models\LeaveRequest;
use App\Models\Overtime;
use Illuminate\Http\Request;
use App\Models\EvaluationAcknowledgement;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $employee = $user->employee;

        $stats = [];
        $todayAttendance = null;

        if ($employee) {
            $todayAttendance = Attendance::where('employee_id', $employee->id)
                ->whereDate('tanggal', Carbon::today())
                ->first();
        }

        $today = Carbon::today();
        $subordinateIds = collect([]);
        if ($employee) {
            $subordinateIds = Employee::where('report_to', $employee->id)->where('is_active', true)->pluck('id');
        }

        $config = $employee?->dashboard_config ?? [
            'attendance_widget' => true,
            'quick_actions' => true,
            'personal_stats' => true,
            'approval_stats' => ($user->isManager() || $user->isSupervisor()),
            'admin_stats' => $user->isAdmin(),
        ];

        $evaluationReminders = [];
        if ($user->isAdmin() || $user->hasPermission('evaluation.view')) {
            $evaluationReminders = $this->getEvaluationReminders();
        }

        $stats = [];
        // ... (existing stats logic) ...
        if (!empty($config['admin_stats'])) {
            $stats = array_merge($stats, [
                'total_karyawan' => Employee::where('is_active', true)->count(),
                'total_departemen' => Department::count(),
                'pengajuan_cuti_pending_admin' => LeaveRequest::whereIn('status', ['pending', 'partially_approved'])->count(),
                'karyawan_baru_bulan_ini' => Employee::where('is_active', true)
                    ->whereMonth('hire_date', now()->month)
                    ->whereYear('hire_date', now()->year)
                    ->count(),
                'karyawan_cuti_hari_ini_admin' => LeaveRequest::where('status', 'approved')
                    ->where('tanggal_mulai', '<=', $today)
                    ->where('tanggal_selesai', '>=', $today)
                    ->count(),
                'form_keluar_hari_ini_admin' => ExitPermit::whereDate('tanggal', $today)->count(),
                'pengajuan_lembur_pending_admin' => Overtime::whereIn('status', ['pending', 'partially_approved'])->count(),
                'reminder_evaluasi_count' => count($evaluationReminders),
            ]);
        }

        if (!empty($config['approval_stats']) && $employee) {
            $stats = array_merge($stats, [
                'pengajuan_cuti_pending_approval' => LeaveRequest::whereIn('employee_id', $subordinateIds)
                    ->where('supervisor_status', 'pending')
                    ->where('status', 'pending')
                    ->count(),
                'pengajuan_lembur_pending_approval' => Overtime::whereHas('creator', fn($q) => $q->where('report_to', $employee->id))
                    ->where('supervisor_status', 'pending')
                    ->count() + Overtime::where('status', 'partially_approved')->whereRaw($user->hasPermission('overtime.second_approval') ? '1=1' : '1=0')->count(),
                'belum_absen_hari_ini' => max(0, $subordinateIds->count() - Attendance::whereIn('employee_id', $subordinateIds)
                    ->whereDate('tanggal', $today)->count()),
                'karyawan_cuti_hari_ini_approval' => LeaveRequest::whereIn('employee_id', $subordinateIds)
                    ->where('status', 'approved')
                    ->where('tanggal_mulai', '<=', $today)
                    ->where('tanggal_selesai', '>=', $today)
                    ->count(),
                'form_keluar_hari_ini_approval' => ExitPermit::whereIn('employee_id', $subordinateIds)
                    ->whereDate('tanggal', $today)->count(),
            ]);
        }

        if (!empty($config['personal_stats']) && $employee) {
            $stats['pengajuan_cuti_pending_personal'] = LeaveRequest::where('employee_id', $employee->id)
                ->whereIn('status', ['pending', 'partially_approved'])
                ->count();
            $stats['pengajuan_lembur_pending_personal'] = Overtime::where('creator_id', $employee->id)
                ->whereIn('status', ['pending', 'partially_approved'])
                ->count();
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'userRole' => $user->role,
            'employee' => $employee,
            'todayAttendance' => $todayAttendance,
            'dashboardConfig' => $config,
            'evaluationReminders' => $evaluationReminders,
        ]);
    }

    public function acknowledgeEvaluation(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'type' => 'required|in:6-month,yearly',
            'cycle_date' => 'required|date',
        ]);

        EvaluationAcknowledgement::updateOrCreate(
            [
                'employee_id' => $request->employee_id,
                'type' => $request->type,
                'cycle_date' => \Carbon\Carbon::parse($request->cycle_date)->format('Y-m-d'),
            ],
            [
                'acknowledged_at' => now(),
                'acknowledged_by' => $request->user()->id,
            ]
        );

        return back()->with('success', 'Evaluasi telah ditandai sebagai selesai.');
    }

    private function getEvaluationReminders()
    {
        $employees = Employee::where('is_active', true)->whereNotNull('hire_date')->get();
        $today = Carbon::today();
        $reminders = [];

        foreach ($employees as $emp) {
            $hireDate = Carbon::parse($emp->hire_date);
            $yearsSinceHire = $hireDate->diffInYears($today);

            // Check current year and next year anniversaries
            $milestones = [
                ['type' => 'yearly', 'date' => $hireDate->copy()->addYears($yearsSinceHire)], // This year's anniversary
                ['type' => 'yearly', 'date' => $hireDate->copy()->addYears($yearsSinceHire + 1)], // Next year's
                ['type' => '6-month', 'date' => $hireDate->copy()->addYears($yearsSinceHire)->addMonths(6)], // This year's 6m
                ['type' => '6-month', 'date' => $hireDate->copy()->addYears($yearsSinceHire)->subMonths(6)], // Past 6m (if hire was in late year)
            ];

            foreach ($milestones as $m) {
                $targetDate = $m['date'];
                
                // Show if we are within 1 month before or any time after (until done)
                if ($today->gte($targetDate->copy()->subMonth())) {
                    // Check if already acknowledged
                    $exists = EvaluationAcknowledgement::where('employee_id', $emp->id)
                        ->where('type', $m['type'])
                        ->where('cycle_date', $targetDate->format('Y-m-d'))
                        ->exists();

                    if (!$exists) {
                        $reminders[] = [
                            'employee_id' => $emp->id,
                            'employee_name' => $emp->nama,
                            'employee_nik' => $emp->nik,
                            'type' => $m['type'],
                            'type_label' => $m['type'] === '6-month' ? 'Evaluasi 6 Bulan' : 'Evaluasi Tahunan',
                            'cycle_date' => $targetDate->format('Y-m-d'),
                            'due_date' => $targetDate->format('d/m/Y'),
                            'days_diff' => $today->diffInDays($targetDate, false),
                        ];
                    }
                }
            }
        }

        // Sort by due date (nearest first)
        usort($reminders, fn($a, $b) => strcmp($a['cycle_date'], $b['cycle_date']));

        return $reminders;
    }
}
