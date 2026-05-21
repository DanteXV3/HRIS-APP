<?php

namespace App\Console\Commands;

use App\Models\Employee;
use Illuminate\Console\Command;
use PhpOffice\PhpSpreadsheet\IOFactory;

class MapX601Users extends Command
{
    protected $signature = 'attendance:map-x601-users';
    protected $description = 'Maps X601 machine user IDs to employees from the provided Excel file';

    public function handle()
    {
        $filePath = storage_path('Daftar_Account.xlsx');
        
        if (!file_exists($filePath)) {
            // Also try to check the root directory as fallback
            $fallbackPath = base_path('Daftar Account dari Mesin X601.xlsx');
            if (file_exists($fallbackPath)) {
                $filePath = $fallbackPath;
            } else {
                $this->error("Excel file not found at {$filePath} or {$fallbackPath}");
                return 1;
            }
        }

        $this->info("Loading Excel file: {$filePath}...");
        
        try {
            $spreadsheet = IOFactory::load($filePath);
        } catch (\Exception $e) {
            $this->error("Failed to load Excel file: " . $e->getMessage());
            return 1;
        }

        $worksheet = $spreadsheet->getActiveSheet();
        
        $mapped = 0;
        $missing = 0;
        
        $this->info("Mapping users...");

        // Start from row 2 assuming row 1 is header
        foreach ($worksheet->getRowIterator(2) as $row) {
            $cellIterator = $row->getCellIterator();
            $cellIterator->setIterateOnlyExistingCells(false);
            
            $rowData = [];
            foreach ($cellIterator as $cell) {
                $rowData[] = $cell->getValue();
            }
            
            $machineId = $rowData[0] ?? null;
            $name = $rowData[1] ?? null;
            
            if (!$machineId || !$name) {
                continue;
            }
            
            // Look up by exact match first
            $employee = Employee::where('nama', $name)->first();
            
            // If not found, try partial match (case insensitive)
            if (!$employee) {
                $employee = Employee::where('nama', 'LIKE', '%' . $name . '%')->first();
            }
            
            if ($employee) {
                $employee->update(['machine_id' => $machineId]);
                $this->info("Mapped: {$name} -> Employee: {$employee->nama} (Machine ID: {$machineId})");
                $mapped++;
            } else {
                $this->warn("NOT FOUND: No matching employee for name '{$name}'");
                $missing++;
            }
        }
        
        $this->newLine();
        $this->info("Done! Successfully mapped: {$mapped}, Missing/Unmapped: {$missing}");
        return 0;
    }
}
