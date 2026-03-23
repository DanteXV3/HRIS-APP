<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Payroll;
use App\Models\PayrollItem;
use Illuminate\Support\Facades\DB;
use Exception;

class PayrollService
{
    /**
     * Generate payroll for a given period.
     * Period format: YYYY-MM
     */
    public function generatePayroll(string $periode, int $processedByUserId, ?string $notes = null): Payroll
    {
        // Check if payroll for this period already exists and is not draft
        $existing = Payroll::where('periode', $periode)->first();
        if ($existing && $existing->status !== 'draft') {
            throw new Exception("Payroll for period {$periode} already processed and cannot be regenerated.");
        }

        DB::beginTransaction();
        try {
            if (!$existing) {
                $payroll = Payroll::create([
                    'periode' => $periode,
                    'tanggal_proses' => now()->toDateString(),
                    'status' => 'draft',
                    'processed_by' => $processedByUserId,
                    'notes' => $notes,
                ]);
            } else {
                $payroll = $existing;
                // Clear old items if re-generating a draft
                $payroll->items()->delete();
                $payroll->update([
                    'tanggal_proses' => now()->toDateString(),
                    'processed_by' => $processedByUserId,
                    'notes' => $notes,
                ]);
            }

            $employees = Employee::where('is_active', true)->get();

            foreach ($employees as $employee) {
                $this->calculateAndCreateItem($payroll, $employee);
            }

            DB::commit();
            return $payroll;

        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    private function calculateAndCreateItem(Payroll $payroll, Employee $employee): void
    {
        // Determine if Final PPh21 applies
        $isFinalPph21 = false;
        
        // 1. December Period
        if (str_ends_with($payroll->periode, '-12')) {
            $isFinalPph21 = true;
        }

        // 2. Determine Dynamic Cut-off Window
        $payrollYm = $payroll->periode; // "YYYY-MM"
        $prevMonthDt = (new \DateTime($payroll->periode . '-01'))->modify('-1 month');
        $prevMonthYm = $prevMonthDt->format('Y-m');

        $payrollMonthDays = (int)date('t', strtotime($payrollYm . '-01'));
        $cutoffDate = $payrollMonthDays; // Default to end of month
        if ($employee->workLocation && $employee->workLocation->payroll_cutoff_date) {
            $cutoffDate = $employee->workLocation->payroll_cutoff_date;
        }

        if ($cutoffDate >= $payrollMonthDays || ($cutoffDate >= 28 && $cutoffDate == $payrollMonthDays)) {
            // Cutoff is end of month -> Period is 1st to End of Month
            $attStartDate = $payrollYm . '-01';
            $attEndDate = $payrollYm . '-' . $payrollMonthDays;
            if ($cutoffDate > $payrollMonthDays) $cutoffDate = $payrollMonthDays; // Clamp
        } else {
            // Mid-month Cutoff (e.g., 24th)
            $prevMonthDays = (int)$prevMonthDt->format('t');
            $startDay = $cutoffDate + 1;
            if ($startDay > $prevMonthDays) $startDay = $prevMonthDays;
            
            $attStartDate = $prevMonthYm . '-' . sprintf('%02d', $startDay);
            $attEndDate = $payrollYm . '-' . sprintf('%02d', $cutoffDate);
        }

        // 3. Resigning Employee Calculation (Active but has End Date)
        if (!$isFinalPph21 && $employee->is_active && !empty($employee->end_date)) {
            $endDateYm = $employee->end_date->format('Y-m');
            $endDateDay = (int)$employee->end_date->format('d');
            
            if ($endDateYm === $payrollYm && $endDateDay <= $cutoffDate) {
                $isFinalPph21 = true;
            }
            if ($endDateYm === $prevMonthYm && $endDateDay > $cutoffDate) {
                $isFinalPph21 = true;
            }
        }

        // 4. Dynamic Allowances via Attendance
        $attendances = \App\Models\Attendance::where('employee_id', $employee->id)
            ->whereDate('tanggal', '>=', $attStartDate)
            ->whereDate('tanggal', '<=', $attEndDate)
            ->get();
            
        // Uang Makan: Only count if present, not late, and has both clock in and out
        $uangMakanCount = $attendances->where('status', 'hadir')
            ->filter(function($att) {
                // Check both is_late flag and late_in_minutes for robustness
                $isLate = (bool)$att->is_late || (int)$att->late_in_minutes > 0;
                return !$isLate && !is_null($att->clock_in) && !is_null($att->clock_out);
            })->count();
            
        $totalOvertimeMenit = $attendances->sum('verified_lembur_minutes');

        $uangMakan = $uangMakanCount * (float)$employee->uang_makan;
        $uangLembur = ($totalOvertimeMenit / 60) * (float)$employee->uang_lembur;

        // 5. Snapshot Earnings
        $earnings = [
            'gaji_pokok' => (float)$employee->gaji_pokok,
            'tunjangan_jabatan' => (float)$employee->tunjangan_jabatan,
            'tunjangan_kehadiran' => (float)$employee->tunjangan_kehadiran,
            'tunjangan_transportasi' => (float)$employee->tunjangan_transportasi,
            'uang_makan' => $uangMakan,
            'uang_lembur' => $uangLembur,
            'thr' => (float)$employee->thr,
        ];

        $totalRegularEarnings = array_sum($earnings);

        // 2. BPJS Calculations
        // JKN (Kesehatan): 1% employee, 4% employer
        $bpjsJknBase = (float)$employee->gaji_bpjs_jkn;
        $potonganJkn = round($bpjsJknBase * 0.01);
        $iuranJknPerusahaan = round($bpjsJknBase * 0.04);

        // Jamsostek (TK): 
        // Employee: JHT 2% + JP 1% = 3%
        // Employer: JHT 3.7% + JP 2% + JKK 0.24% + JKM 0.3%
        $bpjsTkBase = (float)$employee->gaji_bpjs_tk;
        $potonganTk = round($bpjsTkBase * 0.03);
        
        $iuranJkk = round($bpjsTkBase * 0.0024);
        $iuranJkm = round($bpjsTkBase * 0.003);
        $iuranTkPerusahaan = round($bpjsTkBase * 0.0624);

        // 3. PPh21 Calculation (TER 2024 vs Final Article 17)
        $taxableGross = $totalRegularEarnings + $iuranJkk + $iuranJkm + $iuranJknPerusahaan;
        $tunjanganPajak = 0;
        $pph21 = 0;

        if (!$isFinalPph21) {
            // Normal Monthly TER
            $terRate = $this->getTerRate($taxableGross, $employee->status_pernikahan);
            $pph21 = round($taxableGross * $terRate);

            if ($employee->gross_up) {
                $tunjanganPajak = round(($taxableGross * $terRate) / (1 - $terRate));
                $pph21 = round(($taxableGross + $tunjanganPajak) * $terRate);
            }
        } else {
            // Final Annualized PPh21 Calculation (Pasal 17)
            $year = substr($payroll->periode, 0, 4);

            // Fetch previous finalized past items in the same year
            $pastItems = PayrollItem::where('employee_id', $employee->id)
                ->whereHas('payroll', function($q) use ($year) {
                    $q->where('periode', 'like', $year.'%')->where('status', 'finalized');
                })->get();

            $monthsWorked = $pastItems->count() + 1;

            $pastGrossTotal = 0;
            $pastPph21Paid = 0;
            $pastTunjanganPajak = 0;

            foreach ($pastItems as $item) {
                // Reconstruct taxable gross for past months
                // Assuming iuran_bpjs_tk_perusahaan was saved as 6.24%, JKK+JKM is (0.24+0.3)/6.24
                $pastJkkJkm = (float)$item->iuran_bpjs_tk_perusahaan * (0.54 / 6.24);
                $pastJkn = (float)$item->iuran_bpjs_jkn_perusahaan;
                $pastTaxableGross = (float)$item->total_pendapatan + $pastJkkJkm + $pastJkn;
                
                $pastGrossTotal += $pastTaxableGross;
                $pastPph21Paid += (float)$item->potongan_pph21;
                $pastTunjanganPajak += (float)$item->tunjangan_pajak;
            }

            // Annualized Gross (Current period + past periods)
            // If gross_up is true, we must iteratively guess the current month's tunjangan pajak 
            // or use a simplified approximation. For final calculation, exact gross up requires iterating.
            // But we will calculate tax on Net first, and if gross_up, we treat it as allowance.
            $annualGross = $pastGrossTotal + $taxableGross; // Base before current month's gross up

            // Biaya Jabatan (5% of gross, max 500k/month * months worked)
            $biayaJabatan = $annualGross * 0.05;
            $maxBiayaJabatan = 500000 * $monthsWorked;
            if ($biayaJabatan > $maxBiayaJabatan) {
                $biayaJabatan = $maxBiayaJabatan;
            }

            // Get PTKP
            $ptkp = $this->getPtkpAmount($employee->status_pernikahan);

            // PKP
            $pkp = $annualGross - $biayaJabatan - $ptkp;
            
            // Round down PKP to nearest 1000
            $pkp = floor($pkp / 1000) * 1000;
            if ($pkp < 0) $pkp = 0;

            // Article 17 Progressive Tax
            $annualTax = $this->calculateArticle17Tax($pkp);

            // Subtract previously paid
            $rawCurrentPph21 = $annualTax - $pastPph21Paid;
            if ($rawCurrentPph21 < 0) $rawCurrentPph21 = 0; // Overpaid (Lebih Bayar) not handled implicitly here

            if ($employee->gross_up) {
                // Approximate gross up for the final month difference
                // We add the tax difference as allowance
                $tunjanganPajak = round($rawCurrentPph21);
                // Recalculate precisely after adding allowance
                $annualGrossWithTax = $annualGross + $tunjanganPajak;
                
                $biayaJabatanNew = $annualGrossWithTax * 0.05;
                if ($biayaJabatanNew > $maxBiayaJabatan) $biayaJabatanNew = $maxBiayaJabatan;
                
                $pkpNew = floor(($annualGrossWithTax - $biayaJabatanNew - $ptkp) / 1000) * 1000;
                if ($pkpNew < 0) $pkpNew = 0;
                
                $annualTaxNew = $this->calculateArticle17Tax($pkpNew);
                $pph21 = round($annualTaxNew - $pastPph21Paid);
                $tunjanganPajak = $pph21; // Match exactly
                if ($pph21 < 0) $pph21 = 0;
            } else {
                $pph21 = round($rawCurrentPph21);
            }
        }

        $totalPendapatan = $totalRegularEarnings + $tunjanganPajak;

        // 5. Snapshot Other Deductions
        $potonganLain = [
            'pinjaman_koperasi' => (float)$employee->pinjaman_koperasi,
            'potongan_lain_1' => (float)$employee->potongan_lain_1,
            'potongan_lain_2' => (float)$employee->potongan_lain_2,
        ];

        $totalPotongan = $potonganJkn + $potonganTk + $pph21 + array_sum($potonganLain);
        
        // 6. Net Pay
        $gajiBersih = $totalPendapatan - $totalPotongan;

        // 7. Save Item
        PayrollItem::create([
            'payroll_id' => $payroll->id,
            'employee_id' => $employee->id,
            // Earnings
            'gaji_pokok' => $earnings['gaji_pokok'],
            'tunjangan_jabatan' => $earnings['tunjangan_jabatan'],
            'tunjangan_kehadiran' => $earnings['tunjangan_kehadiran'],
            'tunjangan_transportasi' => $earnings['tunjangan_transportasi'],
            'uang_makan' => $earnings['uang_makan'],
            'uang_lembur' => $earnings['uang_lembur'],
            'thr' => $earnings['thr'],
            'tunjangan_pajak' => $tunjanganPajak,
            'total_pendapatan' => $totalPendapatan,
            // Deductions
            'potongan_bpjs_tk' => $potonganTk,
            'potongan_bpjs_jkn' => $potonganJkn,
            'potongan_pph21' => $pph21,
            'pinjaman_koperasi' => $potonganLain['pinjaman_koperasi'],
            'potongan_lain_1' => $potonganLain['potongan_lain_1'],
            'potongan_lain_2' => $potonganLain['potongan_lain_2'],
            'total_potongan' => $totalPotongan,
            // Net
            'gaji_bersih' => $gajiBersih,
            // Company costs
            'iuran_bpjs_tk_perusahaan' => $iuranTkPerusahaan,
            'iuran_bpjs_jkn_perusahaan' => $iuranJknPerusahaan,
        ]);
    }

    /**
     * Calculate Progressive Tax mapped to Article 17
     */
    private function calculateArticle17Tax(float $pkp): float
    {
        $tax = 0;
        
        if ($pkp <= 60000000) {
            $tax = $pkp * 0.05;
        } elseif ($pkp <= 250000000) {
            $tax = (60000000 * 0.05) + (($pkp - 60000000) * 0.15);
        } elseif ($pkp <= 500000000) {
            $tax = (60000000 * 0.05) + (190000000 * 0.15) + (($pkp - 250000000) * 0.25);
        } elseif ($pkp <= 5000000000) {
            $tax = (60000000 * 0.05) + (190000000 * 0.15) + (250000000 * 0.25) + (($pkp - 500000000) * 0.30);
        } else {
            $tax = (60000000 * 0.05) + (190000000 * 0.15) + (250000000 * 0.25) + (4500000000 * 0.30) + (($pkp - 5000000000) * 0.35);
        }

        return $tax;
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

    /**
     * Get the TER rate based on gross income and PTKP category.
     * Disclaimer: This uses a simplified approximation of the 2024 TER brackets for demonstration.
     */
    private function getTerRate(float $gross, ?string $ptkp): float
    {
        // 1. Determine Category (A, B, C)
        $ptkp = strtoupper($ptkp ?? 'TK/0');
        $categoryA = ['TK/0', 'TK/1', 'K/0'];
        $categoryB = ['TK/2', 'TK/3', 'K/1', 'K/2'];
        $categoryC = ['K/3'];

        $cat = 'A';
        if (in_array($ptkp, $categoryB)) $cat = 'B';
        if (in_array($ptkp, $categoryC)) $cat = 'C';

        // 2. Simplified TER lookup
        // Actual TER 2024 has ~40 brackets. We use a simplified graded list.
        if ($cat === 'A') {
            if ($gross <= 5400000) return 0.0;
            if ($gross <= 5650000) return 0.0025;
            if ($gross <= 5950000) return 0.005;
            if ($gross <= 6300000) return 0.0075;
            if ($gross <= 6750000) return 0.01;
            if ($gross <= 7500000) return 0.0125;
            if ($gross <= 8500000) return 0.015;
            if ($gross <= 9650000) return 0.0175;
            if ($gross <= 10050000) return 0.02;
            if ($gross <= 10350000) return 0.0225;
            if ($gross <= 10700000) return 0.025;
            if ($gross <= 11050000) return 0.03;
            if ($gross <= 11600000) return 0.035;
            if ($gross <= 12500000) return 0.04;
            if ($gross <= 13750000) return 0.05;
            if ($gross <= 15100000) return 0.06;
            if ($gross <= 16950000) return 0.07;
            if ($gross <= 19750000) return 0.08;
            if ($gross <= 24100000) return 0.09;
            if ($gross <= 26450000) return 0.10;
            if ($gross <= 28000000) return 0.11;
            if ($gross <= 30050000) return 0.12;
            if ($gross <= 32100000) return 0.13;
            if ($gross <= 35400000) return 0.14;
            if ($gross <= 39150000) return 0.15;
            if ($gross <= 43500000) return 0.16;
            if ($gross <= 47800000) return 0.17;
            if ($gross <= 51400000) return 0.18;
            if ($gross <= 56300000) return 0.19;
            if ($gross <= 62200000) return 0.20;
            if ($gross <= 68600000) return 0.21;
            if ($gross <= 77500000) return 0.22;
            if ($gross <= 89000000) return 0.23;
            if ($gross <= 103000000) return 0.24;
            if ($gross <= 125000000) return 0.25;
            if ($gross <= 157000000) return 0.26;
            if ($gross <= 206000000) return 0.27;
            if ($gross <= 337000000) return 0.28;
            if ($gross <= 454000000) return 0.29;
            if ($gross <= 550000000) return 0.30;
            if ($gross <= 895000000) return 0.31;
            if ($gross <= 1400000000) return 0.32;
            if ($gross <= 2000000000) return 0.33;
            return 0.34;
        }

        if ($cat === 'B') {
            if ($gross <= 6200000) return 0.0;
            if ($gross <= 6500000) return 0.0025;
            if ($gross <= 6850000) return 0.005;
            if ($gross <= 7300000) return 0.0075;
            if ($gross <= 9200000) return 0.01;
            if ($gross <= 10750000) return 0.015;
            if ($gross <= 11250000) return 0.02;
            if ($gross <= 11600000) return 0.025;
            if ($gross <= 12600000) return 0.03;
            if ($gross <= 13600000) return 0.04;
            if ($gross <= 14950000) return 0.05;
            if ($gross <= 16400000) return 0.06;
            if ($gross <= 18450000) return 0.07;
            if ($gross <= 21850000) return 0.08;
            if ($gross <= 26000000) return 0.09;
            if ($gross <= 27700000) return 0.10;
            if ($gross <= 29350000) return 0.11;
            if ($gross <= 31450000) return 0.12;
            if ($gross <= 33950000) return 0.13;
            if ($gross <= 37100000) return 0.14;
            if ($gross <= 41100000) return 0.15;
            if ($gross <= 45800000) return 0.16;
            if ($gross <= 49500000) return 0.17;
            if ($gross <= 53800000) return 0.18;
            if ($gross <= 58500000) return 0.19;
            if ($gross <= 64000000) return 0.20;
            if ($gross <= 71000000) return 0.21;
            if ($gross <= 80000000) return 0.22;
            if ($gross <= 93000000) return 0.23;
            if ($gross <= 109000000) return 0.24;
            if ($gross <= 132000000) return 0.25;
            if ($gross <= 168000000) return 0.26;
            if ($gross <= 226000000) return 0.27;
            if ($gross <= 357000000) return 0.28;
            if ($gross <= 486000000) return 0.29;
            if ($gross <= 582000000) return 0.30;
            if ($gross <= 950000000) return 0.31;
            if ($gross <= 1500000000) return 0.32;
            if ($gross <= 2100000000) return 0.33;
            return 0.34;
        }

        if ($cat === 'C') {
            if ($gross <= 6600000) return 0.0;
            if ($gross <= 6950000) return 0.0025;
            if ($gross <= 7350000) return 0.005;
            if ($gross <= 7800000) return 0.0075;
            if ($gross <= 8850000) return 0.01;
            if ($gross <= 9800000) return 0.0125;
            if ($gross <= 10950000) return 0.015;
            if ($gross <= 11200000) return 0.0175;
            if ($gross <= 12050000) return 0.02;
            if ($gross <= 12950000) return 0.03;
            if ($gross <= 14100000) return 0.04;
            if ($gross <= 15550000) return 0.05;
            if ($gross <= 17050000) return 0.06;
            if ($gross <= 19500000) return 0.07;
            if ($gross <= 22700000) return 0.08;
            if ($gross <= 26600000) return 0.09;
            if ($gross <= 28100000) return 0.10;
            if ($gross <= 30100000) return 0.11;
            if ($gross <= 32600000) return 0.12;
            if ($gross <= 35400000) return 0.13;
            if ($gross <= 38900000) return 0.14;
            if ($gross <= 43000000) return 0.15;
            if ($gross <= 47400000) return 0.16;
            if ($gross <= 51200000) return 0.17;
            if ($gross <= 55800000) return 0.18;
            if ($gross <= 60400000) return 0.19;
            if ($gross <= 66700000) return 0.20;
            if ($gross <= 74500000) return 0.21;
            if ($gross <= 83200000) return 0.22;
            if ($gross <= 95600000) return 0.23;
            if ($gross <= 113000000) return 0.24;
            if ($gross <= 137000000) return 0.25;
            if ($gross <= 177000000) return 0.26;
            if ($gross <= 240000000) return 0.27;
            if ($gross <= 381000000) return 0.28;
            if ($gross <= 520000000) return 0.29;
            if ($gross <= 623000000) return 0.30;
            if ($gross <= 1000000000) return 0.31;
            if ($gross <= 1600000000) return 0.32;
            if ($gross <= 2300000000) return 0.33;
            return 0.34;
        }

        return 0; // fallback
    }
}
