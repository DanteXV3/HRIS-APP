<?php

namespace App\Console\Commands;

use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DeactivateResignedEmployees extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'app:deactivate-resigned-employees
                            {--dry-run : List employees that would be deactivated, without making changes}';

    /**
     * The console command description.
     */
    protected $description = 'Automatically deactivate employees whose end_date has passed';

    /**
     * Salary fields that are snapshotted by the payroll engine.
     * These are the fields we watch for audit trail.
     */
    private array $salaryFields = [
        'gaji_pokok', 'tunjangan_jabatan', 'tunjangan_kehadiran',
        'tunjangan_transportasi', 'uang_makan', 'uang_lembur',
        'thr', 'gaji_bpjs_tk', 'gaji_bpjs_jkn',
        'pinjaman_koperasi', 'potongan_lain_1', 'potongan_lain_2',
        'gross_up',
    ];

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $isDryRun = $this->option('dry-run');
        $today    = Carbon::today()->toDateString();

        // Find all active employees whose contract has expired
        $resigned = Employee::where('is_active', true)
            ->whereNotNull('end_date')
            ->where('end_date', '<', $today)
            ->with(['user'])
            ->get();

        if ($resigned->isEmpty()) {
            $this->info('No resigned employees to deactivate. All clear!');
            return;
        }

        $this->info("Found {$resigned->count()} employee(s) to deactivate:");

        $table = $resigned->map(fn ($e) => [
            $e->nik,
            $e->nama,
            $e->end_date->format('Y-m-d'),
        ])->toArray();

        $this->table(['NIK', 'Name', 'End Date'], $table);

        if ($isDryRun) {
            $this->warn('[DRY RUN] No changes were made.');
            return;
        }

        $deactivated = 0;

        DB::transaction(function () use ($resigned, &$deactivated) {
            foreach ($resigned as $employee) {
                // 1. Deactivate the employee record
                $employee->update(['is_active' => false]);

                // 2. Downgrade user login role to 'staff' so they lose HR access
                if ($employee->user) {
                    $employee->user->update(['role' => 'staff']);
                }

                $deactivated++;

                Log::info("[DeactivateResignedEmployees] Deactivated employee", [
                    'employee_id' => $employee->id,
                    'nik'         => $employee->nik,
                    'nama'        => $employee->nama,
                    'end_date'    => $employee->end_date->toDateString(),
                ]);
            }
        });

        $this->info("Successfully deactivated {$deactivated} employee(s).");
    }
}
