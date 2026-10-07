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
use App\Http\Controllers\TaskController;
use App\Http\Controllers\OvertimeController;
use App\Http\Controllers\PaymentRequestController;
use App\Http\Controllers\HolidayController;
use App\Http\Controllers\CostControl\BudgetItemController;
use App\Http\Controllers\CostControl\SummaryBudgetingController;
use App\Http\Controllers\MaterialServiceRequestController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\PushSubscriptionController;
use App\Http\Controllers\SecurityPatrolAreaController;
use App\Http\Controllers\SecurityReportController;
use App\Http\Controllers\DailyWorkerController;
use App\Http\Controllers\DailyWorkerAttendanceController;
use App\Http\Controllers\DailyWorkerActivityController;
use App\Http\Controllers\DailyWorkerPayrollController;
use App\Http\Controllers\PersonalityTestController;
use App\Http\Controllers\JobOpeningController;
use App\Http\Controllers\PublicRecruitmentController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::redirect('/', '/login')->name('home');

// Public Attendance Verify (still public but logic will handle auth if needed or we can move it inside auth)
Route::post('api/attendance/verify', [FaceAttendanceController::class, 'verify'])->name('attendance.verify')->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class]);

// Public Face Attendance Kiosk
Route::get('face-attendance', [FaceAttendanceController::class, 'kiosk'])->name('face-attendance.kiosk');
Route::get('api/face-descriptors', [FaceAttendanceController::class, 'getDescriptors'])->name('face-attendance.descriptors');
Route::post('api/face-attendance/verify', [FaceAttendanceController::class, 'publicVerify'])->name('face-attendance.verify')->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class]);

// Public Recruitment / Career Pages (no auth required)
Route::prefix('career')->name('career.')->group(function () {
    Route::get('/{uuid}', [PublicRecruitmentController::class, 'apply'])->name('apply');
    Route::post('/{uuid}/apply', [PublicRecruitmentController::class, 'submitApplication'])->name('submit-application');
    Route::get('/form/{uuid}', [PublicRecruitmentController::class, 'recruitmentForm'])->name('form');
    Route::post('/form/{uuid}', [PublicRecruitmentController::class, 'submitRecruitmentForm'])->name('submit-form');
    Route::get('/disc/{uuid}', [PublicRecruitmentController::class, 'discTest'])->name('disc');
    Route::post('/disc/{uuid}', [PublicRecruitmentController::class, 'submitDiscTest'])->name('submit-disc');
    Route::get('/mbti/{uuid}', [PublicRecruitmentController::class, 'mbtiTest'])->name('mbti');
    Route::post('/mbti/{uuid}', [PublicRecruitmentController::class, 'submitMbtiTest'])->name('submit-mbti');
});

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
    
    // HR Forms (Unified)
    Route::get('hr-forms', [\App\Http\Controllers\HrFormController::class, 'index'])->name('hr-forms.index');

    // Surat Keterangan Bekerja (SKB)
    Route::get('skb/{skb}/pdf', [\App\Http\Controllers\WorkCertificateController::class, 'downloadPdf'])->name('skb.pdf');
    Route::resource('skb', \App\Http\Controllers\WorkCertificateController::class)->except(['show', 'index']);

    // Paklaring (Certificate of Employment)
    Route::get('paklarings/{paklaring}/pdf', [\App\Http\Controllers\PaklaringController::class, 'downloadPdf'])->name('paklarings.pdf');
    Route::resource('paklarings', \App\Http\Controllers\PaklaringController::class)->except(['show', 'index']);

    // Surat Pengangkatan (Appointment Letter)
    Route::get('appointments/{appointment}/pdf', [\App\Http\Controllers\AppointmentLetterController::class, 'downloadPdf'])->name('appointments.pdf');
    Route::resource('appointments', \App\Http\Controllers\AppointmentLetterController::class)->except(['show', 'index']);

    // Offering Letter
    Route::get('offerings/{offering}/pdf', [\App\Http\Controllers\OfferingLetterController::class, 'downloadPdf'])->name('offerings.pdf');
    Route::resource('offerings', \App\Http\Controllers\OfferingLetterController::class)->except(['show', 'index']);

    // Surat Mutasi (Transfer Letter)
    Route::get('transfers/{transfer}/pdf', [\App\Http\Controllers\TransferLetterController::class, 'downloadPdf'])->name('transfers.pdf');
    Route::resource('transfers', \App\Http\Controllers\TransferLetterController::class)->except(['show', 'index']);

    // Surat Referensi (Reference Letter)
    Route::get('references/{reference}/pdf', [\App\Http\Controllers\ReferenceLetterController::class, 'downloadPdf'])->name('references.pdf');
    Route::resource('references', \App\Http\Controllers\ReferenceLetterController::class)->except(['show', 'index']);

    // Surat PHK / Terminasi (Termination Letter)
    Route::get('terminations/{termination}/pdf', [\App\Http\Controllers\TerminationLetterController::class, 'downloadPdf'])->name('terminations.pdf');
    Route::resource('terminations', \App\Http\Controllers\TerminationLetterController::class)->except(['show', 'index']);

    // Surat Promosi/Demosi (Promotion Letter)
    Route::get('promotions/{promotion}/pdf', [\App\Http\Controllers\PromotionLetterController::class, 'downloadPdf'])->name('promotions.pdf');
    Route::resource('promotions', \App\Http\Controllers\PromotionLetterController::class)->except(['show', 'index']);

    // SPPD (Surat Perintah Perjalanan Dinas)
    Route::get('sppd/{sppd}/pdf', [\App\Http\Controllers\SppdController::class, 'downloadPdf'])->name('sppd.pdf');
    Route::post('sppd/{sppd}/items', [\App\Http\Controllers\SppdController::class, 'addItem'])->name('sppd.items.add');
    Route::delete('sppd/items/{item}', [\App\Http\Controllers\SppdController::class, 'removeItem'])->name('sppd.items.remove');
    Route::post('sppd/{sppd}/upload-signed', [\App\Http\Controllers\SppdController::class, 'uploadSignedPdf'])->name('sppd.upload-signed');
    Route::resource('sppd', \App\Http\Controllers\SppdController::class);

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
    Route::put('payrolls/{payroll}/items/{item}', [PayrollController::class, 'updateItem'])->name('payrolls.items.update');
    Route::delete('payrolls/{payroll}', [PayrollController::class, 'destroy'])->name('payrolls.destroy');

    // Attendance (Modular Permissions)
    Route::get('attendances', [AttendanceController::class, 'index'])->name('attendances.index');
    Route::post('attendances', [AttendanceController::class, 'store'])->name('attendances.store');
    Route::get('attendances/my', [AttendanceController::class, 'myAttendance'])->name('attendances.my');
    Route::get('attendances/export', [AttendanceController::class, 'export'])->name('attendances.export');
    Route::get('attendances/export-pdf', [AttendanceController::class, 'exportPdf'])->name('attendances.exportPdf');
    Route::get('attendances/export-recap-pdf', [AttendanceController::class, 'exportRecapPdf'])->name('attendances.exportRecapPdf');
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
    Route::get('leave-management', [LeaveRequestController::class, 'management'])->name('leaves.management');
    Route::resource('leaves', LeaveRequestController::class)->only(['index', 'create', 'store', 'show'])->parameters(['leaves' => 'leave']);
    Route::post('leaves/{leave}/approve', [LeaveRequestController::class, 'approve'])->name('leaves.approve');
    Route::post('leaves/{leave}/reject', [LeaveRequestController::class, 'reject'])->name('leaves.reject');
    Route::get('leaves/{leave}/whatsapp', [LeaveRequestController::class, 'whatsappUrl'])->name('leaves.whatsapp');

    // Exit Permits — all authenticated users
    Route::resource('exit-permits', ExitPermitController::class)->only(['index', 'create', 'store']);

    // Overtime — all authenticated users
    Route::get('overtime-management', [OvertimeController::class, 'management'])->name('overtimes.management');
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

    // Push Notifications
    Route::post('push-subscriptions', [PushSubscriptionController::class, 'store'])->name('push-subscriptions.store');
    Route::post('push-subscriptions/delete', [PushSubscriptionController::class, 'destroy'])->name('push-subscriptions.destroy');
    Route::post('push-subscriptions/test', [PushSubscriptionController::class, 'test'])->name('push-subscriptions.test');
    Route::get('notifications/unread', [PushSubscriptionController::class, 'unread'])->name('notifications.unread');

    // Contracts
    Route::get('/contracts', [ContractController::class, 'index'])->name('contracts.index');
    Route::get('/contracts/create', [ContractController::class, 'create'])->name('contracts.create');
    Route::post('/contracts', [ContractController::class, 'store'])->name('contracts.store');
    Route::get('/contracts/{contract}', [ContractController::class, 'show'])->name('contracts.show');
    Route::get('/contracts/{contract}/download', [ContractController::class, 'downloadPdf'])->name('contracts.download');
    Route::post('/contracts/{contract}/upload-signed', [ContractController::class, 'uploadSigned'])->name('contracts.upload-signed');
    Route::delete('/contracts/{contract}', [ContractController::class, 'destroy'])->name('contracts.destroy');

    // My Contract (Personal)
    Route::get('/my-contract', [ContractController::class, 'myContract'])->name('contracts.me');

    // Cost Control
    Route::prefix('cost-control')->name('cost-control.')->group(function () {
        Route::resource('budget-items', BudgetItemController::class);
        Route::get('summary-budgeting', [SummaryBudgetingController::class, 'index'])->name('summary-budgeting.index');
        Route::get('summary-budgeting/download-pdf/{workingLocation}', [SummaryBudgetingController::class, 'downloadPdf'])->name('summary-budgeting.pdf');
        Route::get('summary-budgeting/{budgetItem}', [SummaryBudgetingController::class, 'show'])->name('summary-budgeting.show');

        // Estimasi Pengeluaran
        Route::get('expense-estimates', [\App\Http\Controllers\CostControl\ExpenseEstimateController::class, 'index'])->name('expense-estimates.index');
        Route::post('expense-estimates', [\App\Http\Controllers\CostControl\ExpenseEstimateController::class, 'store'])->name('expense-estimates.store');
        Route::get('expense-estimates/{expense_estimate}', [\App\Http\Controllers\CostControl\ExpenseEstimateController::class, 'show'])->name('expense-estimates.show');
        Route::delete('expense-estimates/{expense_estimate}', [\App\Http\Controllers\CostControl\ExpenseEstimateController::class, 'destroy'])->name('expense-estimates.destroy');
        Route::post('expense-estimates/{expense_estimate}/items', [\App\Http\Controllers\CostControl\ExpenseEstimateController::class, 'storeItem'])->name('expense-estimates.items.store');
        Route::put('expense-estimate-items/{item}', [\App\Http\Controllers\CostControl\ExpenseEstimateController::class, 'updateItem'])->name('expense-estimates.items.update');
        Route::put('expense-estimate-items/{item}/payment', [\App\Http\Controllers\CostControl\ExpenseEstimateController::class, 'updateItemPayment'])->name('expense-estimates.items.payment');
        Route::delete('expense-estimate-items/{item}', [\App\Http\Controllers\CostControl\ExpenseEstimateController::class, 'destroyItem'])->name('expense-estimates.items.destroy');
        Route::post('expense-estimates/{expense_estimate}/generate-letter', [\App\Http\Controllers\CostControl\ExpenseEstimateController::class, 'generateLetter'])->name('expense-estimates.generate-letter');
        Route::get('expense-estimates/{expense_estimate}/report-pdf', [\App\Http\Controllers\CostControl\ExpenseEstimateController::class, 'downloadReport'])->name('expense-estimates.report-pdf');
        Route::get('expense-estimate-letters/{letter}/pdf', [\App\Http\Controllers\CostControl\ExpenseEstimateController::class, 'downloadLetter'])->name('expense-estimates.letter-pdf');
        Route::post('expense-estimate-letters/{letter}/upload', [\App\Http\Controllers\CostControl\ExpenseEstimateController::class, 'uploadSignedFile'])->name('expense-estimates.letter-upload');
        Route::delete('expense-estimate-letters/{letter}', [\App\Http\Controllers\CostControl\ExpenseEstimateController::class, 'destroyLetter'])->name('expense-estimates.letter-destroy');
        Route::delete('expense-estimate-letter-files/{file}', [\App\Http\Controllers\CostControl\ExpenseEstimateController::class, 'deleteSignedFile'])->name('expense-estimates.file-delete');
    });

    // Material & Service Request (MSR)
    Route::prefix('msr')->name('msr.')->group(function () {
        Route::get('/', [MaterialServiceRequestController::class, 'index'])->name('index');
        Route::get('/create', [MaterialServiceRequestController::class, 'create'])->name('create');
        Route::post('/', [MaterialServiceRequestController::class, 'store'])->name('store');
        Route::get('/{msr}', [MaterialServiceRequestController::class, 'show'])->name('show');
        Route::post('/{msr}/approve', [MaterialServiceRequestController::class, 'approve'])->name('approve');
        Route::post('/{msr}/reject', [MaterialServiceRequestController::class, 'reject'])->name('reject');
        Route::get('/{msr}/pdf', [MaterialServiceRequestController::class, 'downloadPdf'])->name('pdf');
        Route::get('/{msr}/whatsapp', [MaterialServiceRequestController::class, 'whatsappUrl'])->name('whatsapp');
    });

    // Task Management
    Route::get('/tasks', [TaskController::class, 'index'])->name('tasks.index');
    Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::post('/tasks/{task}/complete', [TaskController::class, 'complete'])->name('tasks.complete');
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');
    Route::get('/tasks/{task}/whatsapp', [TaskController::class, 'whatsappUrl'])->name('tasks.whatsapp');

    // Security Reports
    Route::prefix('security')->group(function () {
        Route::resource('patrol-areas', SecurityPatrolAreaController::class)->names('security-patrol-areas')->except(['create', 'show', 'edit']);
        Route::resource('reports', SecurityReportController::class)->names('security-reports');
        Route::post('reports/{report}/finalize', [SecurityReportController::class, 'finalize'])->name('security-reports.finalize');
        Route::post('reports/{report}/items/{item}', [SecurityReportController::class, 'updateItem'])->name('security-reports.items.update');
    });

    Route::resource('daily-workers', DailyWorkerController::class);
    Route::post('daily-worker-attendance/import', [DailyWorkerAttendanceController::class, 'import'])->name('daily-worker-attendance.import');
    Route::get('daily-worker-attendance/pdf', [DailyWorkerAttendanceController::class, 'exportPdf'])->name('daily-worker-attendance.pdf');
    Route::resource('daily-worker-attendance', DailyWorkerAttendanceController::class)->only(['index', 'store']);
    Route::resource('daily-worker-activities', DailyWorkerActivityController::class)->only(['index', 'show', 'store']);
    Route::get('daily-worker-activities/{report}/pdf', [DailyWorkerActivityController::class, 'downloadPdf'])->name('daily-worker-activities.pdf');
    Route::post('daily-worker-activities/{report}/finalize', [DailyWorkerActivityController::class, 'finalize'])->name('daily-worker-activities.finalize');
    Route::post('daily-worker-activities/items/{item}', [DailyWorkerActivityController::class, 'updateItem'])->name('daily-worker-activities.items.update');

    Route::resource('daily-worker-payrolls', DailyWorkerPayrollController::class)->parameters(['daily-worker-payrolls' => 'payroll'])->only(['index', 'show', 'store', 'destroy']);
    Route::post('daily-worker-payrolls/{payroll}/finalize', [DailyWorkerPayrollController::class, 'finalize'])->name('daily-worker-payrolls.finalize');
    Route::get('daily-worker-payrolls/{payroll}/pdf', [DailyWorkerPayrollController::class, 'exportPdf'])->name('daily-worker-payrolls.pdf');

    // Recruitment (Formerly Psikotes)
    Route::prefix('recruitment')->name('recruitment.')->group(function () {
        Route::get('/', [PersonalityTestController::class, 'index'])->name('index');
        Route::get('/disc/create', [PersonalityTestController::class, 'createDisc'])->name('disc.create');
        Route::post('/disc', [PersonalityTestController::class, 'storeDisc'])->name('disc.store');
        Route::get('/mbti/create', [PersonalityTestController::class, 'createMbti'])->name('mbti.create');
        Route::post('/mbti', [PersonalityTestController::class, 'storeMbti'])->name('mbti.store');
        Route::get('/{test}', [PersonalityTestController::class, 'show'])->name('show');
        Route::patch('/{test}', [PersonalityTestController::class, 'update'])->name('update');
        Route::delete('/{test}', [PersonalityTestController::class, 'destroy'])->name('destroy');
        Route::get('/{test}/pdf', [PersonalityTestController::class, 'downloadPdf'])->name('pdf');
        Route::get('/blank/disc', [PersonalityTestController::class, 'downloadBlankDisc'])->name('blank.disc');
        Route::get('/blank/mbti', [PersonalityTestController::class, 'downloadBlankMbti'])->name('blank.mbti');
    });

    // Job Openings
    Route::prefix('job-openings')->name('job-openings.')->group(function () {
        Route::get('/', [JobOpeningController::class, 'index'])->name('index');
        Route::get('/create', [JobOpeningController::class, 'create'])->name('create');
        Route::post('/', [JobOpeningController::class, 'store'])->name('store');
        Route::get('/{jobOpening}', [JobOpeningController::class, 'show'])->name('show');
        Route::patch('/{jobOpening}', [JobOpeningController::class, 'update'])->name('update');
        Route::delete('/{jobOpening}', [JobOpeningController::class, 'destroy'])->name('destroy');
        Route::patch('/applications/{application}/status', [JobOpeningController::class, 'updateApplicationStatus'])->name('application.status');
        Route::get('/applications/{application}', [JobOpeningController::class, 'showApplication'])->name('application.show');
        Route::get('/applications/{application}/pdf', [JobOpeningController::class, 'printApplicationPdf'])->name('application.pdf');
    });
});

require __DIR__.'/settings.php';
