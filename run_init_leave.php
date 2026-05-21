<?php
require '/opt/hris/vendor/autoload.php';
$app = require_once '/opt/hris/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$service = app(App\Services\LeaveBalanceService::class);
$service->initializeYearlyBalances(2026);
echo "Initialized successfully for 2026\n";
