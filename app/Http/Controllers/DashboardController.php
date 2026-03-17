<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;
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

        if ($user->isAdmin() || $user->isManager()) {
            $stats = [
                'total_karyawan' => Employee::where('is_active', true)->count(),
                'total_departemen' => Department::count(),
                'pengajuan_cuti_pending' => LeaveRequest::where('status', 'pending')->count(),
                'karyawan_baru_bulan_ini' => Employee::where('is_active', true)
                    ->whereMonth('hire_date', now()->month)
                    ->whereYear('hire_date', now()->year)
                    ->count(),
            ];
        } elseif ($user->isSupervisor() && $employee) {
            $stats = [
                'total_anggota_tim' => Employee::where('department_id', $employee->department_id)
                    ->where('is_active', true)->count(),
                'pengajuan_cuti_pending' => LeaveRequest::whereHas('employee', function ($q) use ($employee) {
                    $q->where('department_id', $employee->department_id);
                })->where('supervisor_status', 'pending')->count(),
            ];
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'userRole' => $user->role,
            'employee' => $employee,
            'todayAttendance' => $todayAttendance,
            'allEmployees' => Employee::select('id', 'nama', 'nik', 'face_descriptor')->get()
        ]);
    }
}
