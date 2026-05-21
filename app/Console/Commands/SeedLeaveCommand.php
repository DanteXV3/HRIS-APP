<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Employee;
use App\Models\LeaveType;
use App\Models\LeaveRequest;
use App\Models\LeaveBalance;
use App\Services\LeaveBalanceService;
use Carbon\Carbon;

class SeedLeaveCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:seed-leave {file=/opt/hris/SeedLeave.csv : Path to the csv file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import SeedLeave.csv and recalculate balances';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $file = $this->argument('file');
        
        if (!file_exists($file)) {
            $this->error("File not found: {$file}");
            return 1;
        }

        $this->info("Parsing CSV file: {$file}...");
        
        $handle = fopen($file, "r");
        if ($handle === FALSE) {
            $this->error("Failed to open file.");
            return 1;
        }

        // Get header
        $header = fgetcsv($handle, 1000, ";");
        if (!$header) {
            $this->error("File is empty or invalid format.");
            return 1;
        }

        $successCount = 0;
        $skipCount = 0;
        $failedNiks = [];
        $processedEmployeeIds = [];

        while (($row = fgetcsv($handle, 1000, ";")) !== FALSE) {
            // No;Nama;Jenis Ijin;Tanggal Mulai;Tanggal Berakhir;Durasi;Alasan
            $nik = trim($row[0] ?? '');
            
            // Skip empty rows often found at the bottom of the CSV
            if (empty($nik)) {
                continue;
            }

            $nama = trim($row[1] ?? '');
            $jenisIjin = trim($row[2] ?? '');
            $tanggalMulai = trim($row[3] ?? '');
            $tanggalSelesai = trim($row[4] ?? '');
            $durasiStr = trim($row[5] ?? '0');
            $alasan = trim($row[6] ?? '');

            // Ensure Durasi is numeric (handle commas if any)
            $durasiStr = str_replace(',', '.', $durasiStr);
            $durasi = floatval($durasiStr);

            $employee = Employee::where('nik', $nik)->first();
            if (!$employee) {
                if (!in_array($nik, $failedNiks)) {
                    $failedNiks[] = $nik;
                }
                $skipCount++;
                continue;
            }

            // Mappings
            // Cuti Tahunan -> Cuti Tahunan (ID 1)
            // Ijin Sakit -> Cuti Sakit (ID 2)
            // Ijin Tidak Masuk Kerja -> Izin Tidak Masuk (ID 6)
            $leaveTypeId = null;
            if ($jenisIjin === 'Cuti Tahunan') {
                $leaveTypeId = 1;
            } elseif ($jenisIjin === 'Ijin Sakit') {
                $leaveTypeId = 2;
            } elseif ($jenisIjin === 'Ijin Tidak Masuk Kerja') {
                $leaveTypeId = 6;
            } else {
                // If it doesn't match any of the exactly 3 requested, skip
                $skipCount++;
                continue;
            }

            // Skip if missing critical dates
            if (empty($tanggalMulai) || empty($tanggalSelesai)) {
                $skipCount++;
                continue;
            }

            // Check duplicate
            $exists = LeaveRequest::where('employee_id', $employee->id)
                ->where('leave_type_id', $leaveTypeId)
                ->where('tanggal_mulai', $tanggalMulai)
                ->where('tanggal_selesai', $tanggalSelesai)
                ->exists();

            if ($exists) {
                $skipCount++;
                continue;
            }

            // Insert records making them all approved
            LeaveRequest::create([
                'employee_id' => $employee->id,
                'leave_type_id' => $leaveTypeId,
                'tanggal_mulai' => $tanggalMulai,
                'tanggal_selesai' => $tanggalSelesai,
                'jumlah_hari' => $durasi,
                'alasan' => $alasan,
                'supervisor_status' => 'approved',
                'manager_status' => 'approved',
                'status' => 'approved',
                'approved_by_supervisor_id' => $employee->report_to,
                'approved_by_manager_id' => $employee->manager_id ?? $employee->report_to,
                'supervisor_approved_at' => now(),
                'manager_approved_at' => now(),
            ]);

            // Add to processed
            if (!in_array($employee->id, $processedEmployeeIds)) {
                $processedEmployeeIds[] = $employee->id;
            }

            $successCount++;
        }
        fclose($handle);

        $this->info("Import finished!");
        $this->info("- Inserted: {$successCount}");
        $this->info("- Skipped/Duplicates: {$skipCount}");

        if (count($failedNiks) > 0) {
            $this->warn("Following NIKs were not found in database:");
            foreach ($failedNiks as $fNik) {
                $this->line("- " . $fNik);
            }
        }

        $this->info("Recalculating leave balances for affected employees...");
        // Recalculate Balance
        $balanceService = app(LeaveBalanceService::class);

        foreach ($processedEmployeeIds as $empId) {
            $employee = Employee::find($empId);
            if (!$employee) continue;

            // Recalculate entitlement for 2026 based on their hire date 
            $year = 2026;
            $entitlement = $balanceService->calculateAnnualLeaveEntitlement($employee, $year);

            // Sum all "Cuti Tahunan" requested in 2026 that have been approved.
            // Note: Since everything seeded is approved and mapped correctly, this covers old + newly seeded data.
            $usedDays = LeaveRequest::where('employee_id', $employee->id)
                ->where('leave_type_id', 1)
                ->where('status', 'approved')
                ->whereYear('tanggal_mulai', $year)
                ->sum('jumlah_hari');

            LeaveBalance::updateOrCreate(
                [
                    'employee_id' => $employee->id,
                    'leave_type_id' => 1,
                    'year' => $year,
                ],
                [
                    'total_days' => $entitlement,
                    'used_days' => (float)$usedDays,
                ]
            );
        }

        $this->info("Balances updated successfully for " . count($processedEmployeeIds) . " employees.");

        return 0;
    }
}
