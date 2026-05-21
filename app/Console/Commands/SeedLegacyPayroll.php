<?php

namespace App\Console\Commands;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Payroll;
use App\Models\PayrollItem;
use App\Models\Position;
use App\Models\WorkLocation;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SeedLegacyPayroll extends Command
{
    protected $signature = 'payroll:seed-legacy {path=Payroll Data B3.csv}';
    protected $description = 'Seed legacy payroll data from CSV';

    private $monthMap = [
        'Januari' => 1,
        'Februari' => 2,
        'Maret' => 3,
        'April' => 4,
        'Mei' => 5,
        'Juni' => 6,
        'Juli' => 7,
        'Agustus' => 8,
        'September' => 9,
        'Oktober' => 10,
        'November' => 11,
        'Desember' => 12,
    ];

    public function handle()
    {
        $path = $this->argument('path');
        if (!file_exists($path)) {
            $this->error("File not found: {$path}");
            return;
        }

        $handle = fopen($path, 'r');
        
        // Handle BOM if present
        $bom = fread($handle, 3);
        if ($bom !== "\xEF\xBB\xBF") {
            rewind($handle);
        }

        $rawHeaders = fgetcsv($handle, 0, ';'); 
        $headers = [];
        $counts = [];
        foreach ($rawHeaders as $h) {
            $h = trim(preg_replace('/[\x00-\x1F\x7F-\xFF]/', '', $h));
            if (!isset($counts[$h])) {
                $counts[$h] = 0;
                $headers[] = $h;
            } else {
                $counts[$h]++;
                $headers[] = $h . '_' . $counts[$h];
            }
        }

        $this->info("Headers found: " . implode(', ', $headers));
        $this->info("Starting import...");

        DB::beginTransaction();
        try {
            $index = 0;
            while (($data = fgetcsv($handle, 0, ';')) !== false) {
                if (count($headers) !== count($data)) {
                    $this->warn("Row {$index}: Column count mismatch. Skipping.");
                    continue;
                }
                $row = array_combine($headers, $data);
                $index++;

                $nik = trim($row['NIK']);
                $monthName = trim($row['Bulan']);
                $year = trim($row['Tahun']);

                if (!$monthName || !$year) {
                    continue;
                }

                $month = $this->monthMap[$monthName] ?? null;
                if (!$month) {
                    $this->warn("Row {$index}: Unknown month '{$monthName}'");
                    continue;
                }

                $periode = Carbon::create($year, $month, 1)->format('Y-m');

                // 1. Get or Create Payroll Parent
                $payroll = Payroll::firstOrCreate(
                    ['periode' => $periode],
                    [
                        'tanggal_proses' => now(),
                        'status' => 'finalized',
                        'processed_by' => 76, // Arief Adyatma Budiman
                        'notes' => 'Imported from legacy CSV',
                    ]
                );

                // 2. Employee Resolution
                $employee = Employee::with(['department', 'position', 'workLocation', 'workingLocation'])
                    ->where('nik', $nik)
                    ->first();

                if (!$employee) {
                    // Entity Resolution ONLY if employee not found (Fallback)
                    $dept = $this->getDept($row['Departement'] ?? 'Legacy');
                    $pos = $this->getPos($row['Posisi'] ?? 'Legacy Position', $dept->id);
                    $loc = $this->getLoc($row['Perusahaan / Work Location'] ?? 'Default');

                    $employee = Employee::create([
                        'nama' => $row['Nama'],
                        'nik' => $nik,
                        'email' => $row['Email'] ?: "legacy_{$nik}@example.com",
                        'department_id' => $dept->id,
                        'position_id' => $pos->id,
                        'work_location_id' => $loc->id,
                        'hire_date' => '2023-01-01', 
                        'is_active' => false,
                        'status_kepegawaian' => 'tetap',
                        'status_pernikahan' => $row['Status Pernikahan'],
                    ]);
                }

                // 3. Metadata Snapshots (Prioritize Profile over CSV)
                $deptName = $employee->department?->name ?? ($row['Departement'] ?? 'Legacy');
                $posName = $employee->position?->name ?? ($row['Posisi'] ?? 'Legacy Position');
                $workLocName = $employee->workLocation?->name ?? ($row['Perusahaan / Work Location'] ?? 'Default');
                $workingLocName = $employee->workingLocation?->name ?? ($row['Lokasi Kerja'] ?? null);

                // 4. Create Payroll Item
                $gajiPokok = $this->parseCurrency($row['Gaji Pokok']);
                $tunjanganJabatan = $this->parseCurrency($row['Tunjangan Jabatan']);
                $tunjanganKehadiran = $this->parseCurrency($row['Tunjangan kehadiran']);
                $tunjanganTransportasi = $this->parseCurrency($row['Tunjangan Transportasi']);
                $uangMakan = $this->parseCurrency($row['Uang Makan']);
                $uangLembur = $this->parseCurrency($row['Uang Lembur']);
                $thr = $this->parseCurrency($row['THR']);
                $tunjanganPajak = $this->parseCurrency($row['Tunjangan Pajak']);

                $totalPendapatan = $gajiPokok + $tunjanganJabatan + $tunjanganKehadiran + $tunjanganTransportasi + $uangMakan + $uangLembur + $thr + $tunjanganPajak;

                $potonganBpjsTk = $this->parseCurrency($row['JHT Pegawai']) + $this->parseCurrency($row['JP Pegawai']);
                $potonganBpjsJkn = $this->parseCurrency($row['BPJS Kes Pegawai']);
                $potonganPph21 = $this->parseCurrency($row['PPH21 On Salary']) + $this->parseCurrency($row['PPH21 On Bonus'] ?? 0);
                $pinjamanKoperasi = $this->parseCurrency($row['Potongan 1']);
                $potonganLain1 = $this->parseCurrency($row['Potongan 2']);
                $potonganLain2 = $this->parseCurrency($row['Potongan 3']);

                $totalPotongan = $potonganBpjsTk + $potonganBpjsJkn + $potonganPph21 + $pinjamanKoperasi + $potonganLain1 + $potonganLain2;
                $gajiBersih = $this->parseCurrency($row['THP']);

                PayrollItem::updateOrCreate(
                    [
                        'payroll_id' => $payroll->id,
                        'employee_id' => $employee->id,
                    ],
                    [
                        'employee_name' => $row['Nama'],
                        'employee_nik' => $nik,
                        'department_name' => trim($deptName),
                        'position_name' => trim($posName),
                        'work_location_name' => trim($workLocName),
                        'working_location_name' => trim($workingLocName),
                        'bank_account_no' => $row['No Rekening'] ?? null,
                        'employee_npwp' => $row['NPWP'] ?? null,
                        
                        'gaji_pokok' => $gajiPokok,
                        'tunjangan_jabatan' => $tunjanganJabatan,
                        'tunjangan_kehadiran' => $tunjanganKehadiran,
                        'tunjangan_transportasi' => $tunjanganTransportasi,
                        'uang_makan' => $uangMakan,
                        'uang_lembur' => $uangLembur,
                        'thr' => $thr,
                        'tunjangan_pajak' => $tunjanganPajak,
                        'total_pendapatan' => $totalPendapatan,
                        
                        'potongan_bpjs_tk' => $potonganBpjsTk,
                        'potongan_bpjs_jkn' => $potonganBpjsJkn,
                        'potongan_pph21' => $potonganPph21,
                        'pinjaman_koperasi' => $pinjamanKoperasi,
                        'potongan_lain_1' => $potonganLain1,
                        'potongan_lain_2' => $potonganLain2,
                        
                        'total_potongan' => $totalPotongan,
                        'gaji_bersih' => $gajiBersih,
                        
                        'iuran_bpjs_tk_perusahaan' => $this->parseCurrency($row['JKK Perusahaan']) + $this->parseCurrency($row['JKM Perusahaan']) + $this->parseCurrency($row['JHT Perusahaan']) + $this->parseCurrency($row['JP Perusahaan']),
                        'iuran_bpjs_jkn_perusahaan' => $this->parseCurrency($row['BPJS Kes Perusahaan']),
                    ]
                );

                if ($index % 100 === 0) {
                    $this->line("Processed {$index} rows...");
                }
            }

            DB::commit();
            fclose($handle);
            $this->info("Import completed successfully! Total rows: {$index}");
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("Failed to import: " . $e->getMessage());
            $this->error($e->getTraceAsString());
        }
    }

    private function getDept($name)
    {
        $name = trim($name ?: 'Legacy');
        $dept = Department::where('name', $name)->first();
        if ($dept) return $dept;

        $code = strtoupper(substr($name, 0, 3));
        while (Department::where('code', $code)->exists()) {
            $code = strtoupper(substr($name, 0, 3)) . rand(10, 99);
        }

        return Department::create(['name' => $name, 'code' => $code]);
    }

    private function getPos($name, $deptId)
    {
        $name = trim($name ?: 'Legacy Position');
        return Position::firstOrCreate(
            ['name' => $name, 'department_id' => $deptId],
            ['grade' => 'staff']
        );
    }

    private function getLoc($name)
    {
        $name = trim($name ?: 'Default');
        $loc = WorkLocation::where('name', $name)->first();
        if ($loc) return $loc;

        $code = strtoupper(substr($name, 0, 3));
        if (strlen($code) > 10) $code = substr($code, 0, 10);
        
        while (WorkLocation::where('code', $code)->exists()) {
            $rand = rand(10, 99);
            $code = substr(strtoupper(substr($name, 0, 8)), 0, 7) . $rand;
        }

        return WorkLocation::create(['name' => $name, 'code' => $code]);
    }

    private function parseCurrency($value)
    {
        if (!$value || $value === '-') return 0;
        // Remove commas and handle European/standard formats if any
        $clean = str_replace(',', '', $value);
        return (float) $clean;
    }
}
