<?php

namespace App\Services;

use App\Models\DailyWorker;
use App\Models\WorkingLocation;
use App\Models\Position;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\DailyWorkerAttendance;
use App\Models\DailyWorkerActivityReport;
use Carbon\Carbon;

class DailyWorkerService
{
    public function createDailyWorker(array $data, ?array $permissions = null): DailyWorker
    {
        return DB::transaction(function () use ($data, $permissions) {
            // Auto-generate NIK if not provided
            if (empty($data['nik'])) {
                $data['nik'] = $this->generateNik($data['working_location_id'], $data['hire_date']);
            }


            return DailyWorker::create($data);
        });
    }

    public function updateDailyWorker(DailyWorker $dailyWorker, array $data, ?array $permissions = null): DailyWorker
    {
        return DB::transaction(function () use ($dailyWorker, $data, $permissions) {

            $dailyWorker->update($data);

            return $dailyWorker;
        });
    }

    public function handleFileUploads(Request $request, array $validated): array
    {
        $fileFields = ['photo', 'file_ktp', 'file_npwp', 'file_kk', 'file_ijazah'];

        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                // Delete old file if exists
                if ($request->isMethod('put') && $request->route('dailyWorker') && $request->route('dailyWorker')->$field) {
                    Storage::disk('public')->delete($request->route('dailyWorker')->$field);
                }
                $validated[$field] = $request->file($field)->store("daily-workers/{$field}", 'public');
            } else {
                unset($validated[$field]);
            }
        }

        if ($request->hasFile('file_lainnya')) {
            $paths = [];
            foreach ($request->file('file_lainnya') as $file) {
                $paths[] = $file->store('daily-workers/lainnya', 'public');
            }
            $validated['file_lainnya'] = $paths;
        } else {
            unset($validated['file_lainnya']);
        }

        return $validated;
    }

    public function generateNik(int $workingLocationId, string $hireDate): string
    {
        $location = WorkingLocation::findOrFail($workingLocationId);
        $locationCode = strtoupper(substr($location->name, 0, 3));

        $count = DailyWorker::where('working_location_id', $workingLocationId)->count() + 1;
        $seq = str_pad($count, 3, '0', STR_PAD_LEFT);

        $date = Carbon::parse($hireDate);
        $dateFormatted = $date->format('y') . $date->format('d') . $date->format('m');

        return "DW-{$locationCode}-{$seq}-{$dateFormatted}";
    }

    public function generatePayroll(\App\Models\DailyWorkerPayroll $payroll)
    {
        return DB::transaction(function () use ($payroll) {
            // Delete existing items if any (re-generate)
            $payroll->items()->delete();

            $workers = DailyWorker::where('working_location_id', $payroll->working_location_id)
                ->where('is_active', true)
                ->get();

            $startDate = Carbon::parse($payroll->periode_start);
            $endDate = Carbon::parse($payroll->periode_end);
            $daysPeriod = $startDate->diffInDays($endDate) + 1;

            foreach ($workers as $worker) {
                $attendances = DailyWorkerAttendance::where('daily_worker_id', $worker->id)
                    ->whereBetween('tanggal', [$payroll->periode_start, $payroll->periode_end])
                    ->get();

                $daysAttended = $attendances->where('status', 'hadir')->count();
                $lemburMinutes = $attendances->sum('verified_lembur_minutes');
                $lemburHours = $lemburMinutes / 60;

                $gajiPokokTotal = $daysAttended * $worker->gaji_harian;
                
                if (strtolower(trim($worker->tipe_dw)) === 'non lokal' || strtolower(trim($worker->tipe_dw)) === 'non-lokal') {
                    $uangMakanTotal = $daysPeriod * $worker->uang_makan;
                } else {
                    $uangMakanTotal = $daysAttended * $worker->uang_makan;
                }
                $uangLemburTotal = $lemburHours * $worker->uang_lembur;

                $totalPendapatan = $gajiPokokTotal + $uangMakanTotal + $uangLemburTotal;

                $potonganBpjsTk = $payroll->calc_bpjs_tk ? ($worker->gaji_bpjs_tk ?? 0) : 0;
                $potonganBpjsKs = $payroll->calc_bpjs_ks ? ($worker->gaji_bpjs_jkn ?? 0) : 0;
                
                $potonganPph21 = 0;
                $tunjanganPajak = 0;
                if ($payroll->calc_pph21) {
                    // Tax rules dictate that PTKP daily threshold is applied to ACTUAL days worked
                    $effectiveDays = $daysAttended;
                    
                    if ($effectiveDays > 0) {
                        $ptkp = $this->getPtkpAmount($worker->status_pernikahan);
                        $dailyPtkp = $ptkp / 360;
                        
                        $dailyGross = $totalPendapatan / $effectiveDays;
                        if ($dailyGross > $dailyPtkp) {
                            $taxableIncome = $totalPendapatan - ($dailyPtkp * $effectiveDays);
                            
                            if ($worker->gross_up) {
                                // Gross up formula for 5% tier
                                $tunjanganPajak = round(($taxableIncome / 0.95) - $taxableIncome);
                                $potonganPph21 = $tunjanganPajak;
                                $totalPendapatan += $tunjanganPajak;
                            } else {
                                $potonganPph21 = round($taxableIncome * 0.05);
                            }
                        }
                    }
                }

                $totalPotongan = $potonganBpjsTk + $potonganBpjsKs + $potonganPph21 
                    + ($worker->pinjaman_koperasi ?? 0) 
                    + ($worker->potongan_lain_1 ?? 0) 
                    + ($worker->potongan_lain_2 ?? 0);

                $gajiBersih = $totalPendapatan - $totalPotongan;

                \App\Models\DailyWorkerPayrollItem::create([
                    'daily_worker_payroll_id' => $payroll->id,
                    'daily_worker_id' => $worker->id,
                    'worker_name' => $worker->nama,
                    'worker_nik' => $worker->nik,
                    'tipe_dw' => $worker->tipe_dw,
                    'days_attended' => $daysAttended,
                    'days_period' => $daysPeriod,
                    'lembur_hours' => $lemburHours,
                    'gaji_harian' => $worker->gaji_harian,
                    'gaji_pokok_total' => $gajiPokokTotal,
                    'uang_makan' => $worker->uang_makan,
                    'uang_makan_total' => $uangMakanTotal,
                    'uang_lembur_total' => $uangLemburTotal,
                    'total_pendapatan' => $totalPendapatan,
                    'tunjangan_pajak' => $tunjanganPajak,
                    'potongan_bpjs_tk' => $potonganBpjsTk,
                    'potongan_bpjs_ks' => $potonganBpjsKs,
                    'potongan_pph21' => $potonganPph21,
                    'total_potongan' => $totalPotongan,
                    'gaji_bersih' => $gajiBersih,
                ]);
            }

            return $payroll;
        });
    }

    public function syncActivityReportAttendance(DailyWorkerActivityReport $report): void
    {
        // 1. Identify all workers who SHOULD be in this report
        // - Category A: All currently active workers at this location
        $activeWorkerIds = DailyWorker::where('working_location_id', $report->working_location_id)
            ->where('is_active', true)
            ->pluck('id')
            ->toArray();

        // - Category B: Any worker who actually has an attendance record for this date/location
        $attendanceWorkerIds = DailyWorkerAttendance::whereDate('tanggal', $report->tanggal)
            ->whereHas('dailyWorker', function($q) use ($report) {
                $q->where('working_location_id', $report->working_location_id);
            })
            ->pluck('daily_worker_id')
            ->toArray();

        // Unique set of all relevant workers
        $targetWorkerIds = array_unique(array_merge($activeWorkerIds, $attendanceWorkerIds));

        // 2. Ensure an item exists for every target worker
        foreach ($targetWorkerIds as $workerId) {
            \App\Models\DailyWorkerActivityReportItem::firstOrCreate(
                [
                    'daily_worker_activity_report_id' => $report->id,
                    'daily_worker_id' => $workerId,
                ],
                [
                    'status_aktifitas' => 'pending',
                ]
            );
        }

        // 3. Reload items and sync attendance data
        $report->load('items');
        
        $attendances = DailyWorkerAttendance::whereDate('tanggal', $report->tanggal)
            ->whereHas('dailyWorker', function($q) use ($report) {
                $q->where('working_location_id', $report->working_location_id);
            })->get();

        foreach ($report->items as $item) {
            $att = $attendances->firstWhere('daily_worker_id', $item->daily_worker_id);
            if ($att) {
                $item->update([
                    'attendance_status' => $att->status,
                    'jam_masuk' => $att->clock_in ? $att->clock_in->format('H:i') : null,
                    'jam_pulang' => $att->clock_out ? $att->clock_out->format('H:i') : null,
                ]);
            } else {
                if ($report->is_finalized) {
                    $item->update(['attendance_status' => 'alpha']);
                } else {
                    // Reset if attendance was deleted or worker didn't show up yet
                    $item->update([
                        'attendance_status' => null,
                        'jam_masuk' => null,
                        'jam_pulang' => null,
                    ]);
                }
            }
        }
    }

    /**
     * When a DW attendance record is created/updated, ensure an Activity Report
     * draft exists for that date+location and upsert the corresponding item.
     */
    public function syncAttendanceToActivityReport(DailyWorkerAttendance $attendance): void
    {
        $worker = $attendance->dailyWorker;
        if (!$worker) return;

        $tanggal = Carbon::parse($attendance->tanggal)->format('Y-m-d');

        // Find or create the activity report draft for this date + location
        $report = DailyWorkerActivityReport::firstOrCreate(
            [
                'working_location_id' => $worker->working_location_id,
                'tanggal' => $tanggal,
            ],
            [
                'is_finalized' => false,
            ]
        );

        // Don't modify finalized reports
        if ($report->is_finalized) return;

        // Find or create the item for this worker
        $item = \App\Models\DailyWorkerActivityReportItem::firstOrCreate(
            [
                'daily_worker_activity_report_id' => $report->id,
                'daily_worker_id' => $worker->id,
            ],
            [
                'status_aktifitas' => 'pending',
            ]
        );

        // Always update attendance data (but never overwrite status_aktifitas)
        $item->update([
            'attendance_status' => $attendance->status,
            'jam_masuk' => $attendance->clock_in ? Carbon::parse($attendance->clock_in)->format('H:i') : null,
            'jam_pulang' => $attendance->clock_out ? Carbon::parse($attendance->clock_out)->format('H:i') : null,
        ]);
    }

    /**
     * Get PTKP Amount based on marital status
     */
    private function getPtkpAmount(?string $status): float
    {
        $status = strtoupper($status ?? 'TK/0');
        $map = [
            'TK/0' => 54000000,
            'TK/1' => 58500000,
            'TK/2' => 63000000,
            'TK/3' => 67500000,
            'K/0'  => 58500000,
            'K/1'  => 63000000,
            'K/2'  => 67500000,
            'K/3'  => 72000000,
        ];

        return $map[$status] ?? 54000000;
    }
}
