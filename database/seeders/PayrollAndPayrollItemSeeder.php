<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Payroll;
use App\Models\PayrollItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class PayrollAndPayrollItemSeeder extends Seeder
{
    public function run(): void
    {
        $csvFile = base_path('Database Payroll.csv');
        if (!file_exists($csvFile)) {
            $this->command->error("CSV file not found: {$csvFile}");
            return;
        }

        $file = fopen($csvFile, 'r');
        $header = fgetcsv($file, 0, ';');

        $monthMap = [
            'Januari' => '01',
            'Februari' => '02',
            'Maret' => '03',
            'April' => '04',
            'Mei' => '05',
            'Juni' => '06',
            'Juli' => '07',
            'Agustus' => '08',
            'September' => '09',
            'Oktober' => '10',
            'November' => '11',
            'Desember' => '12',
        ];

        DB::beginTransaction();
        try {
            while (($row = fgetcsv($file, 0, ';')) !== FALSE) {
                // Ensure row matches header count
                $row = array_slice($row, 0, count($header));
                if (count($header) !== count($row)) {
                    continue;
                }
                
                $data = array_combine($header, $row);

                $nama = $data['Nama'];
                $nik = $data['NIK'];
                $bulanStr = $data['Bulan'];
                $tahun = $data['Tahun'];

                if (!isset($monthMap[$bulanStr])) {
                    continue;
                }

                $bulan = $monthMap[$bulanStr];
                $periode = "{$tahun}-{$bulan}";

                // Find or create payroll record
                $payroll = Payroll::firstOrCreate(
                    ['periode' => $periode],
                    [
                        'tanggal_proses' => Carbon::createFromFormat('Y-m', $periode)->endOfMonth(),
                        'status' => 'finalized',
                        'notes' => 'Imported from legacy CSV',
                    ]
                );

                // Find employee by Nama (as NIKs are auto-generated and might not match CSV)
                $employee = Employee::where('nama', $nama)->first();
                if (!$employee) {
                    $this->command->warn("Employee not found: {$nama} - Skipping row.");
                    continue;
                }

                // Parse numbers (strip commas)
                $parseNum = function ($val) {
                    return (float) str_replace(',', '', $val ?: 0);
                };

                // Create payroll item
                PayrollItem::updateOrCreate(
                    [
                        'payroll_id' => $payroll->id,
                        'employee_id' => $employee->id,
                    ],
                    [
                        'gaji_pokok' => $parseNum($data['Gaji Pokok']),
                        'tunjangan_jabatan' => $parseNum($data['Tunjangan Jabatan']),
                        'tunjangan_kehadiran' => $parseNum($data['Tunjangan kehadiran']),
                        'tunjangan_transportasi' => $parseNum($data['Tunjangan Transportasi']),
                        'uang_makan' => $parseNum($data['Uang Makan']),
                        'uang_lembur' => $parseNum($data['Uang Lembur']),
                        'thr' => $parseNum($data['THR']),
                        'tunjangan_pajak' => $parseNum($data['Tunjangan Pajak'] ?? 0),
                        
                        // Deductions
                        'potongan_bpjs_tk' => $parseNum($data['JHT Pegawai']) + $parseNum($data['JP Pegawai']),
                        'potongan_bpjs_jkn' => $parseNum($data['BPJS Kes Pegawai']),
                        'potongan_pph21' => $parseNum($data['PPH21 On Salary']) + $parseNum($data['PPH21 On Bonus']),
                        'potongan_lain_1' => $parseNum($data['Potongan 1']),
                        'potongan_lain_2' => $parseNum($data['Potongan 2']),
                        'pinjaman_koperasi' => $parseNum($data['Potongan 3']),
                        
                        // Net Pay
                        'gaji_bersih' => $parseNum($data['THP']),
                        
                        // Company Contributions
                        'iuran_bpjs_tk_perusahaan' => $parseNum($data['JKK Perusahaan']) + $parseNum($data['JKM Perusahaan']) + $parseNum($data['JHT Perusahaan']) + $parseNum($data['JP Perusahaan']),
                        'iuran_bpjs_jkn_perusahaan' => $parseNum($data['BPJS Kes Perusahaan']),
                        
                        // Totals
                        'total_pendapatan' => $parseNum($data['Gross Income']), // Using Gross Income as snapshot of total pendapatan
                        'total_potongan' => $parseNum($data['Gross Income']) - $parseNum($data['Net Income']) + ($parseNum($data['PPH21 On Salary']) + $parseNum($data['PPH21 On Bonus'])), 
                        // Wait, calculation might vary. Let's just use what's in the table if possible, but the table migration calculates it.
                    ]
                );
            }
            DB::commit();
            $this->command->info("Payroll seeding completed successfully.");
        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error("Error seeding payroll: " . $e->getMessage());
        }

        fclose($file);
    }
}