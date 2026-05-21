<?php
require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

$inputFile = 'storage/Employee Form Data.xlsx';
try {
    if (!file_exists($inputFile)) {
        die("File not found: " . $inputFile);
    }
    $spreadsheet = IOFactory::load($inputFile);
    $sheet = $spreadsheet->getActiveSheet();
    $rows = $sheet->toArray(null, true, true, true);
    $headers = array_shift($rows);
    echo json_encode($headers, JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
