<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use PhpOffice\PhpSpreadsheet\IOFactory;
use App\Models\Employee;
use App\Models\LeaveType;
use App\Models\LeaveRequest;
use App\Models\LeaveBalance;
use App\Services\LeaveBalanceService;
use Carbon\Carbon;

class ImportLeaveRequests extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:leave-requests {file=storage/Employee Form Data.xlsx : Path to the excel file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import historical leave requests from an Excel file';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $file = $this->argument('file');
        
        // Adjust relative paths to absolute using base_path
        if (!file_exists($file)) {
            $file = base_path($file);
        }

        if (!file_exists($file)) {
            $this->error("File not found: {$file}");
            return 1;
        }

        $this->info("Parsing Excel file: {$file}...");

        try {
            $spreadsheet = IOFactory::load($file);
            $sheet = $spreadsheet->getActiveSheet();
            $rows = $sheet->toArray(null, true, true, true);
        } catch (\Exception $e) {
            $this->error("Failed to load Excel file: " . $e->getMessage());
            return 1;
        }

        // Header is raw 1
        $headers = array_shift($rows);
        $this->info("Found " . count($rows) . " rows to process.");

        $successCount = 0;
        $skipCount = 0;
        $failedNiks = [];

        // Track or create generic LeaveType
        $leaveTypesMap = [];

        // Progress bar
        $bar = $this->output->createProgressBar(count($rows));
        $bar->start();

        foreach ($rows as $rowIndex => $row) {
            $nik = trim($row['A'] ?? '');
            $jenisIjin = trim($row['G'] ?? '');
            $tanggalMulai = trim($row['H'] ?? '');
            $tanggalSelesai = trim($row['I'] ?? '');
            $durasi = trim($row['J'] ?? '0');
            $alasan = trim($row['K'] ?? '');
            $timestamp = trim($row['L'] ?? '');
            $approval1 = trim($row['M'] ?? '');
            $approval2 = trim($row['N'] ?? '');

            if (empty($nik)) {
                $skipCount++;
                $bar->advance();
                continue;
            }

            // Find employee
            $employee = Employee::where('nik', $nik)->first();
            if (!$employee) {
                if (!in_array($nik, $failedNiks)) {
                    $failedNiks[] = $nik;
                }
                $skipCount++;
                $bar->advance();
                continue;
            }

            // Find or create LeaveType
            if (empty($jenisIjin)) {
                $jenisIjin = 'Lainnya';
            }
            if (!isset($leaveTypesMap[$jenisIjin])) {
                $leaveType = LeaveType::firstOrCreate(
                    ['name' => $jenisIjin],
                    [
                        'max_days' => 12,
                        'is_paid' => true,
                        'requires_attachment' => false
                    ]
                );
                $leaveTypesMap[$jenisIjin] = $leaveType->id;
            }
            $leaveTypeId = $leaveTypesMap[$jenisIjin];

            // Determine status
            $isApproved1 = (strtolower($approval1) === 'approved');
            $isApproved2 = (strtolower($approval2) === 'approved');
            
            // Per the implementation plan:
            // "All imported records where 'Approval 1' and 'Approval 2' are marked as 'Approved' will be set to the `approved` status"
            $managerStatus = $isApproved2 ? 'approved' : 'pending';
            $supervisorStatus = $isApproved1 ? 'approved' : 'pending';
            $finalStatus = ($isApproved1 && $isApproved2) ? 'approved' : 
                           ($isApproved1 ? 'partially_approved' : 'pending');

            // Handle potential empty timestamps gracefully
            $createdAt = null;
            if (!empty($timestamp)) {
                try {
                    $createdAt = Carbon::parse($timestamp);
                } catch (\Exception $e) {
                    $createdAt = now();
                }
            } else {
                $createdAt = now();
            }

            $startDate = null;
            if (!empty($tanggalMulai)) {
                try {
                    $startDate = Carbon::parse($tanggalMulai)->format('Y-m-d');
                } catch (\Exception $e) { }
            }
            $endDate = null;
            if (!empty($tanggalSelesai)) {
                try {
                    $endDate = Carbon::parse($tanggalSelesai)->format('Y-m-d');
                } catch (\Exception $e) { }
            }

            // Skip if missing critical dates
            if (!$startDate || !$endDate) {
                $skipCount++;
                $bar->advance();
                continue;
            }

            // Check duplicate to prevent double seeding accidentally
            $exists = LeaveRequest::where('employee_id', $employee->id)
                ->where('leave_type_id', $leaveTypeId)
                ->where('tanggal_mulai', $startDate)
                ->where('tanggal_selesai', $endDate)
                ->exists();

            if ($exists) {
                $skipCount++;
                $bar->advance();
                continue;
            }

            // Insert
            $leave = LeaveRequest::create([
                'employee_id' => $employee->id,
                'leave_type_id' => $leaveTypeId,
                'tanggal_mulai' => $startDate,
                'tanggal_selesai' => $endDate,
                'jumlah_hari' => floatval($durasi),
                'alasan' => $alasan,
                'supervisor_status' => $supervisorStatus,
                'manager_status' => $managerStatus,
                'status' => $finalStatus,
                'approved_by_supervisor_id' => $isApproved1 ? $employee->report_to : null,
                'approved_by_manager_id' => $isApproved2 ? ($employee->manager_id ?? $employee->report_to) : null,
                'supervisor_approved_at' => $isApproved1 ? $createdAt->copy()->addHour() : null,
                'manager_approved_at' => $isApproved2 ? $createdAt->copy()->addHours(2) : null,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

            // Deduct balance if it's Cuti Tahunan and approved
            if ($leave->status === 'approved' && $jenisIjin === 'Cuti Tahunan') {
                $year = Carbon::parse($startDate)->year;
                $service = app(LeaveBalanceService::class);
                
                $balance = LeaveBalance::where('employee_id', $employee->id)
                    ->where('leave_type_id', $leaveTypeId)
                    ->where('year', $year)
                    ->first();

                if (!$balance) {
                    $entitlement = $service->calculateAnnualLeaveEntitlement($employee, $year);
                    $balance = LeaveBalance::create([
                        'employee_id' => $employee->id,
                        'leave_type_id' => $leaveTypeId,
                        'year' => $year,
                        'total_days' => $entitlement,
                        'used_days' => 0,
                    ]);
                }
                
                $balance->increment('used_days', $leave->jumlah_hari);
            }

            $successCount++;
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("Import completed!");
        $this->info("- Successfully imported: {$successCount}");
        $this->info("- Skipped or Duplicates: {$skipCount}");

        if (count($failedNiks) > 0) {
            $this->warn("The following NIKs could not be found in the database and their leave records were skipped:");
            foreach ($failedNiks as $fNik) {
                $this->line("- " . $fNik);
            }
        }

        return 0;
    }
}
