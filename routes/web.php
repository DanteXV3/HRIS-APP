<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\WorkLocationController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\FaceAttendanceController;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\ExitPermitController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::redirect('/', '/login')->name('home');

// Public Face Recognition Kiosk Route
Route::post('api/face-attendance/verify', [FaceAttendanceController::class, 'verify'])->name('face.verify')->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class]);
Route::get('kiosk', function () {
    return inertia('kiosk/index', [
        'employees' => \App\Models\Employee::select('id', 'nama', 'nik', 'face_descriptor')->get()
    ]);
})->name('kiosk');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Admin-only routes
    Route::middleware('role:admin')->group(function () {
        Route::resource('departments', DepartmentController::class)->except('show');
        Route::resource('work-locations', WorkLocationController::class)->except('show');
        Route::resource('positions', PositionController::class)->except('show');
        Route::resource('shifts', ShiftController::class)->except(['show', 'create', 'edit']);
        
        Route::get('employees/export', [EmployeeController::class, 'export'])->name('employees.export');
        Route::resource('employees', EmployeeController::class);

        // Face Recognition Enrollment
        Route::post('employees/{employee}/face-enroll', [FaceAttendanceController::class, 'enroll'])->name('employees.face-enroll');

        // Attendance
        Route::get('attendances/export', [AttendanceController::class, 'export'])->name('attendances.export');
        Route::get('attendances', [AttendanceController::class, 'index'])->name('attendances.index');
        Route::post('attendances', [AttendanceController::class, 'store'])->name('attendances.store');
        Route::post('attendances/import', [AttendanceController::class, 'import'])->name('attendances.import');
        Route::put('attendances/{attendance}', [AttendanceController::class, 'update'])->name('attendances.update');
        Route::delete('attendances/{attendance}', [AttendanceController::class, 'destroy'])->name('attendances.destroy');

        // Payroll
        Route::get('payrolls', [PayrollController::class, 'index'])->name('payrolls.index');
        Route::post('payrolls/generate', [PayrollController::class, 'generate'])->name('payrolls.generate');
        Route::post('payrolls/{payroll}/finalize', [PayrollController::class, 'finalize'])->name('payrolls.finalize');
        Route::get('payrolls/{payroll}/export-excel', [PayrollController::class, 'exportExcel'])->name('payrolls.exportExcel');
        Route::get('payrolls/{payroll}/export-pdf-report', [PayrollController::class, 'exportPdfReport'])->name('payrolls.exportPdfReport');
        Route::get('payrolls/{payroll}', [PayrollController::class, 'show'])->name('payrolls.show');
        Route::get('payrolls/{payroll}/items/{item}/pdf', [PayrollController::class, 'downloadPdf'])->name('payrolls.pdf');
        Route::put('payrolls/{payroll}/items/{item}', [PayrollController::class, 'updateItem'])->name('payrolls.updateItem');
        Route::delete('payrolls/{payroll}', [PayrollController::class, 'destroy'])->name('payrolls.destroy');
    });

    // Leave Requests — all authenticated users
    Route::resource('leaves', LeaveRequestController::class)->only(['index', 'create', 'store', 'show'])->parameters(['leaves' => 'leave']);
    Route::post('leaves/{leave}/approve', [LeaveRequestController::class, 'approve'])->name('leaves.approve');
    Route::post('leaves/{leave}/reject', [LeaveRequestController::class, 'reject'])->name('leaves.reject');
    Route::get('leaves/{leave}/whatsapp', [LeaveRequestController::class, 'whatsappUrl'])->name('leaves.whatsapp');

    // Exit Permits — all authenticated users
    Route::resource('exit-permits', ExitPermitController::class)->only(['index', 'create', 'store']);
});

require __DIR__.'/settings.php';
