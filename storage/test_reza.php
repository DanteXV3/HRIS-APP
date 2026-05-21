<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::find(43); // M. Reza
$perm = $user->hasPermission('msr.approve_supervisor');
echo "Has Permission: " . ($perm ? 'Yes' : 'No') . "\n";
