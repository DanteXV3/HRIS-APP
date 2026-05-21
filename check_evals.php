<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\EvaluationAcknowledgement;
$docs = EvaluationAcknowledgement::all();
foreach ($docs as $d) {
    echo "ID: {$d->id}, Emp: {$d->employee_id}, Type: {$d->type}, Date: '{$d->getRawOriginal('cycle_date')}'\n";
}
