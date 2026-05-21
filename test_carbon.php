<?php
require 'vendor/autoload.php';
use Carbon\Carbon;

$a = Carbon::parse('2026-03-19 10:06:21');
$b = Carbon::parse('2026-03-19 08:30:00');

echo "a: " . $a->toDateTimeString() . "\n";
echo "b: " . $b->toDateTimeString() . "\n";
echo "diffInMinutes (default): " . $a->diffInMinutes($b) . "\n";
echo "diffInMinutes (absolute=false): " . $a->diffInMinutes($b, false) . "\n";

$now = Carbon::parse('2026-03-19 10:06:21');
$shiftIn = Carbon::parse('2026-03-19 08:30:00');
if ($now->gt($shiftIn)) {
    echo "now > shiftIn\n";
    echo "diffInMinutes: " . $now->diffInMinutes($shiftIn) . "\n";
}
