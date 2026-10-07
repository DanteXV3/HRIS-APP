<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AttendanceApiController;
use App\Http\Controllers\Api\AttendanceCorrectionApiController;
use App\Http\Controllers\Api\LeaveApiController;
use App\Http\Controllers\Api\PayslipApiController;
use App\Http\Controllers\Api\ApprovalApiController;
use App\Http\Controllers\Api\NotificationApiController;
use App\Http\Controllers\Api\ExitPermitApiController;
use App\Http\Controllers\Api\TaskApiController;
use App\Http\Controllers\Api\PaymentRequestApiController;
use App\Http\Controllers\Api\OvertimeApiController;
use App\Http\Controllers\Api\WarningLetterApiController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::post('auth/fcm-token', [AuthController::class, 'updateFcmToken']);
    Route::get('me', [AuthController::class, 'me']);

    // Attendance
    Route::get('attendances', [AttendanceApiController::class, 'index']);
    Route::get('attendances/today', [AttendanceApiController::class, 'today']);
    Route::post('attendances/clock', [AttendanceApiController::class, 'clock']);

    // Attendance Corrections
    Route::get('attendance-corrections', [AttendanceCorrectionApiController::class, 'index']);
    Route::post('attendance-corrections', [AttendanceCorrectionApiController::class, 'store']);

    // Leave
    Route::get('leaves/types', [LeaveApiController::class, 'types']);
    Route::get('leaves/balances', [LeaveApiController::class, 'balances']);
    Route::get('leaves', [LeaveApiController::class, 'index']);
    Route::post('leaves', [LeaveApiController::class, 'store']);

    // Payslips
    Route::get('payslips', [PayslipApiController::class, 'index']);
    Route::get('payslips/{payrollItem}', [PayslipApiController::class, 'show']);
    Route::get('payslips/{payrollItem}/pdf', [PayslipApiController::class, 'downloadPdf']);

    // Approvals
    Route::get('approvals/pending', [ApprovalApiController::class, 'pending']);
    Route::post('approvals/leave/{leaveRequest}', [ApprovalApiController::class, 'processLeave']);

    // Notifications
    Route::get('notifications', [NotificationApiController::class, 'index']);
    Route::post('notifications/read-all', [NotificationApiController::class, 'markAllAsRead']);
    Route::post('notifications/{id}/read', [NotificationApiController::class, 'markAsRead']);

    // Exit Permits
    Route::get('exit-permits', [ExitPermitApiController::class, 'index']);
    Route::post('exit-permits', [ExitPermitApiController::class, 'store']);

    // Tasks
    Route::get('tasks', [TaskApiController::class, 'index']);
    Route::get('tasks/employees', [TaskApiController::class, 'employees']);
    Route::post('tasks', [TaskApiController::class, 'store']);
    Route::post('tasks/{task}/complete', [TaskApiController::class, 'complete']);
    Route::delete('tasks/{task}', [TaskApiController::class, 'destroy']);

    // Payment Requests
    Route::get('payment-requests/form-data', [PaymentRequestApiController::class, 'formData']);
    Route::get('payment-requests', [PaymentRequestApiController::class, 'index']);
    Route::get('payment-requests/{paymentRequest}', [PaymentRequestApiController::class, 'show']);
    Route::post('payment-requests', [PaymentRequestApiController::class, 'store']);
    Route::post('payment-requests/{paymentRequest}/approve', [PaymentRequestApiController::class, 'approve']);
    Route::post('payment-requests/{paymentRequest}/reject', [PaymentRequestApiController::class, 'reject']);

    // Overtime
    Route::get('overtimes/form-data', [OvertimeApiController::class, 'formData']);
    Route::get('overtimes', [OvertimeApiController::class, 'index']);
    Route::post('overtimes', [OvertimeApiController::class, 'store']);

    // Mobile Face Clock
    Route::post('attendances/clock-mobile', [\App\Http\Controllers\Api\MobileAttendanceController::class, 'clockWithImage']);

    // Warning Letters
    Route::get('warning-letters', [WarningLetterApiController::class, 'index']);
});

    Route::post('leaves/{leaveRequest}/approve', [LeaveApiController::class, 'approve']);
    Route::post('leaves/{leaveRequest}/reject', [LeaveApiController::class, 'reject']);
    Route::post('overtimes/{overtime}/approve', [OvertimeApiController::class, 'approve']);
    Route::post('overtimes/{overtime}/reject', [OvertimeApiController::class, 'reject']);
