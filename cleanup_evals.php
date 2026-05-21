<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\EvaluationAcknowledgement;
use Illuminate\Support\Facades\DB;

$docs = EvaluationAcknowledgement::all();
foreach ($docs as $d) {
    $rawDate = $d->getRawOriginal('cycle_date');
    $normalized = \Carbon\Carbon::parse($rawDate)->format('Y-m-d');
    
    if ($rawDate !== $normalized) {
        echo "Updating ID {$d->id}: '{$rawDate}' => '{$normalized}'\n";
        try {
            DB::table('evaluation_acknowledgements')->where('id', $d->id)->update(['cycle_date' => $normalized]);
        } catch (\Exception $e) {
            echo "Error updating ID {$d->id} (possible duplicate): " . $e->getMessage() . "\n";
            echo "Deleting ID {$d->id} as it is a duplicate.\n";
            $d->delete();
        }
    }
}
echo "Cleanup complete.\n";
