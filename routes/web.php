<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\WorkLocationController;
use App\Http\Controllers\WorkingLocationController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\FaceAttendanceController;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\ExitPermitController;
use App\Http\Controllers\OvertimeController;
use App\Http\Controllers\PaymentRequestController;
use App\Http\Controllers\HolidayController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::redirect('/', '/login')->name('home');

// Public Attendance Verify (still public but logic will handle auth if needed or we can move it inside auth)
Route::post('api/attendance/verify', [FaceAttendanceController::class, 'verify'])->name('attendance.verify')->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class]);

// Public Face Attendance Kiosk
Route::get('face-attendance', [FaceAttendanceController::class, 'kiosk'])->name('face-attendance.kiosk');
Route::get('api/face-descriptors', [FaceAttendanceController::class, 'getDescriptors'])->name('face-attendance.descriptors');
Route::post('api/face-attendance/verify', [FaceAttendanceController::class, 'publicVerify'])->name('face-attendance.verify')->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class]);

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('dashboard/acknowledge-evaluation', [DashboardController::class, 'acknowledgeEvaluation'])->name('dashboard.acknowledgeEvaluation');

    // Administrative routes (Now handled by granular Permissions in controllers)
    Route::resource('departments', DepartmentController::class)->except('show');
    Route::resource('work-locations', WorkLocationController::class)->except('show');
    Route::resource('working-locations', WorkingLocationController::class)->except('show');
    Route::resource('positions', PositionController::class)->except('show');
    Route::resource('shifts', ShiftController::class)->except(['show', 'create', 'edit']);
    Route::resource('holidays', HolidayController::class)->except(['show']);
    
    Route::get('employees/export', [EmployeeController::class, 'export'])->name('employees.export');
    Route::resource('employees', EmployeeController::class);

    // Payroll
    Route::get('payrolls', [PayrollController::class, 'index'])->name('payrolls.index');
    Route::post('payrolls/generate', [PayrollController::class, 'generate'])->name('payrolls.generate');
    Route::post('payrolls/{payroll}/finalize', [PayrollController::class, 'finalize'])->name('payrolls.finalize');
    Route::get('payrolls/{payroll}/export-excel', [PayrollController::class, 'exportExcel'])->name('payrolls.exportExcel');
    Route::get('payrolls/{payroll}/export-pdf-report', [PayrollController::class, 'exportPdfReport'])->name('payrolls.exportPdfReport');
    Route::get('payrolls/{payroll}/export-uang-makan-lembur', [PayrollController::class, 'exportUangMakanLembur'])->name('payrolls.exportUangMakanLembur');
    Route::get('payrolls/{payroll}/export-bpjs', [PayrollController::class, 'exportBpjs'])->name('payrolls.exportBpjs');
    Route::get('payrolls/{payroll}/export-pph21', [PayrollController::class, 'exportPph21'])->name('payrolls.exportPph21');
    Route::get('payrolls/{payroll}/export-attendance', [PayrollController::class, 'exportAttendance'])->name('payrolls.exportAttendance');
    Route::get('payrolls/{payroll}', [PayrollController::class, 'show'])->name('payrolls.show');
    Route::delete('payrolls/{payroll}', [PayrollController::class, 'destroy'])->name('payrolls.destroy');

    // Attendance (Modular Permissions)
    Route::get('attendances', [AttendanceController::class, 'index'])->name('attendances.index');
    Route::post('attendances', [AttendanceController::class, 'store'])->name('attendances.store');
    Route::get('attendances/my', [AttendanceController::class, 'myAttendance'])->name('attendances.my');
    Route::get('attendances/export', [AttendanceController::class, 'export'])->name('attendances.export');
    Route::get('attendances/export-pdf', [AttendanceController::class, 'exportPdf'])->name('attendances.exportPdf');
    Route::post('attendances/import', [AttendanceController::class, 'import'])->name('attendances.import');
    Route::put('attendances/{attendance}', [AttendanceController::class, 'update'])->name('attendances.update');
    // Attendance Corrections
    Route::get('attendance-corrections', [\App\Http\Controllers\AttendanceCorrectionController::class, 'index'])->name('attendance-corrections.index');
    Route::post('attendance-corrections', [\App\Http\Controllers\AttendanceCorrectionController::class, 'store'])->name('attendance-corrections.store');
    Route::put('attendance-corrections/{correction}', [\App\Http\Controllers\AttendanceCorrectionController::class, 'update'])->name('attendance-corrections.update');
    Route::delete('attendance-corrections/{correction}', [\App\Http\Controllers\AttendanceCorrectionController::class, 'destroy'])->name('attendance-corrections.destroy');

    // KPI Evaluations
    Route::resource('kpi-evaluations', \App\Http\Controllers\KpiEvaluationController::class);
    Route::get('kpi-evaluations/{evaluation}/whatsapp', [\App\Http\Controllers\KpiEvaluationController::class, 'whatsappUrl'])->name('kpi-evaluations.whatsapp');
    Route::get('kpi-evaluations/{evaluation}/pdf', [\App\Http\Controllers\KpiEvaluationController::class, 'downloadPdf'])->name('kpi-evaluations.pdf');

    // Warning Letters (SP)
    Route::resource('warning-letters', \App\Http\Controllers\WarningLetterController::class);
    Route::get('warning-letters/{warningLetter}/pdf', [\App\Http\Controllers\WarningLetterController::class, 'downloadPdf'])->name('warning-letters.pdf');

    Route::delete('attendances/{attendance}', [AttendanceController::class, 'destroy'])->name('attendances.destroy');

    Route::get('payrolls/{payroll}/items/{item}/pdf', [PayrollController::class, 'downloadPdf'])->name('payrolls.pdf');

    // Leave Requests — all authenticated users
    Route::resource('leaves', LeaveRequestController::class)->only(['index', 'create', 'store', 'show'])->parameters(['leaves' => 'leave']);
    Route::post('leaves/{leave}/approve', [LeaveRequestController::class, 'approve'])->name('leaves.approve');
    Route::post('leaves/{leave}/reject', [LeaveRequestController::class, 'reject'])->name('leaves.reject');
    Route::get('leaves/{leave}/whatsapp', [LeaveRequestController::class, 'whatsappUrl'])->name('leaves.whatsapp');

    // Exit Permits — all authenticated users
    Route::resource('exit-permits', ExitPermitController::class)->only(['index', 'create', 'store']);

    // Overtime — all authenticated users
    Route::resource('overtimes', OvertimeController::class)->only(['index', 'create', 'store', 'show'])->parameters(['overtimes' => 'overtime']);
    Route::post('overtimes/{overtime}/approve', [OvertimeController::class, 'approve'])->name('overtimes.approve');
    Route::post('overtimes/{overtime}/reject', [OvertimeController::class, 'reject'])->name('overtimes.reject');
    Route::get('overtimes/{overtime}/pdf', [OvertimeController::class, 'downloadPdf'])->name('overtimes.pdf');
    Route::get('overtimes/{overtime}/whatsapp-url', [OvertimeController::class, 'whatsappUrl'])->name('overtimes.whatsappUrl');

    // Payment Request
    Route::resource('payment-requests', PaymentRequestController::class);
    Route::post('payment-requests/{payment_request}/approve', [PaymentRequestController::class, 'approve'])->name('payment-requests.approve');
    Route::post('payment-requests/{payment_request}/reject', [PaymentRequestController::class, 'reject'])->name('payment-requests.reject');
    Route::get('payment-requests/{payment_request}/pdf', [PaymentRequestController::class, 'downloadPdf'])->name('payment-requests.pdf');
    Route::get('payment-requests/{payment_request}/whatsapp', [PaymentRequestController::class, 'whatsappUrl'])->name('payment-requests.whatsapp');

    // Employee Self-Service
    Route::get('profile', [EmployeeController::class, 'me'])->name('profile.me');
    Route::put('profile', [EmployeeController::class, 'updateMe'])->name('profile.update-me');
    Route::post('profile/signature', [EmployeeController::class, 'updateSignature'])->name('profile.signature');
    Route::post('profile/face-descriptor', [EmployeeController::class, 'updateFaceDescriptor'])->name('profile.face-descriptor');
    Route::post('employees/{employee}/signature', [EmployeeController::class, 'updateSignature'])->name('employees.signature');
    Route::get('my-attendance', [AttendanceController::class, 'myAttendance'])->name('attendances.me');
    Route::get('my-attendance/pdf', [AttendanceController::class, 'myAttendancePdf'])->name('attendances.me.pdf');
    Route::get('my-payroll', [PayrollController::class, 'myPayroll'])->name('payrolls.me');
});

require __DIR__.'/settings.php';
