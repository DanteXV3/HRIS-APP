<?php
require '/var/www/html/vendor/autoload.php';
$app = require_once '/var/www/html/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$service = app(App\Services\LeaveBalanceService::class);
$service->initializeYearlyBalances(2026);
echo "Leave balances initialized for 2026 for all active employees!\n";
