<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Attendance;
use App\Models\ExitPermit;
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

        $today = Carbon::today();

        if ($user->isAdmin()) {
            // Admin sees global overview
            $stats = [
                'total_karyawan' => Employee::where('is_active', true)->count(),
                'total_departemen' => Department::count(),
                'pengajuan_cuti_pending' => LeaveRequest::whereIn('status', ['pending', 'partially_approved'])->count(),
                'karyawan_baru_bulan_ini' => Employee::where('is_active', true)
                    ->whereMonth('hire_date', now()->month)
                    ->whereYear('hire_date', now()->year)
                    ->count(),
                // Employees currently on leave today
                'karyawan_cuti_hari_ini' => LeaveRequest::where('status', 'approved')
                    ->where('tanggal_mulai', '<=', $today)
                    ->where('tanggal_selesai', '>=', $today)
                    ->count(),
                // Exit permits today
                'form_keluar_hari_ini' => ExitPermit::whereDate('tanggal', $today)->count(),
            ];
        } elseif ($user->isManager() && $employee) {
            $deptId = $employee->department_id;
            $deptEmployeeIds = Employee::where('department_id', $deptId)->where('is_active', true)->pluck('id');

            $stats = [
                'pengajuan_cuti_pending' => LeaveRequest::whereIn('employee_id', $deptEmployeeIds)
                    ->whereIn('status', ['pending', 'partially_approved'])->count(),
                'belum_absen_hari_ini' => $deptEmployeeIds->count() - Attendance::whereIn('employee_id', $deptEmployeeIds)
                    ->whereDate('tanggal', $today)->count(),
                'karyawan_cuti_hari_ini' => LeaveRequest::whereIn('employee_id', $deptEmployeeIds)
                    ->where('status', 'approved')
                    ->where('tanggal_mulai', '<=', $today)
                    ->where('tanggal_selesai', '>=', $today)
                    ->count(),
                'form_keluar_hari_ini' => ExitPermit::whereIn('employee_id', $deptEmployeeIds)
                    ->whereDate('tanggal', $today)->count(),
            ];
        } elseif ($user->isSupervisor() && $employee) {
            $deptId = $employee->department_id;
            $deptEmployeeIds = Employee::where('department_id', $deptId)->where('is_active', true)->pluck('id');

            $stats = [
                'pengajuan_cuti_pending' => LeaveRequest::whereIn('employee_id', $deptEmployeeIds)
                    ->whereIn('status', ['pending', 'partially_approved'])->count(),
                'belum_absen_hari_ini' => $deptEmployeeIds->count() - Attendance::whereIn('employee_id', $deptEmployeeIds)
                    ->whereDate('tanggal', $today)->count(),
                'karyawan_cuti_hari_ini' => LeaveRequest::whereIn('employee_id', $deptEmployeeIds)
                    ->where('status', 'approved')
                    ->where('tanggal_mulai', '<=', $today)
                    ->where('tanggal_selesai', '>=', $today)
                    ->count(),
                'form_keluar_hari_ini' => ExitPermit::whereIn('employee_id', $deptEmployeeIds)
                    ->whereDate('tanggal', $today)->count(),
            ];
        } else {
            // Staff
            if ($employee) {
                $stats = [
                    'pengajuan_cuti_pending' => LeaveRequest::where('employee_id', $employee->id)
                        ->whereIn('status', ['pending', 'partially_approved'])->count(),
                ];
            }
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
