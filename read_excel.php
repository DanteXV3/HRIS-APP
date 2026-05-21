<?php
require 'vendor/autoload.php';

$reader = new \PhpOffice\PhpSpreadsheet\Reader\Xlsx();
$spreadsheet = $reader->load('Payment Request.xlsx');
$worksheet = $spreadsheet->getActiveSheet();
$data = $worksheet->toArray();

foreach (array_slice($data, 0, 100) as $row) {
    if (isset($row[7]) && is_numeric($row[7])) {
        echo implode("\t", array_map(fn($v) => (string)$v, $row)) . "\n";
    }
}
