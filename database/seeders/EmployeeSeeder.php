<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Position;
use App\Models\WorkLocation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $csvFile = base_path('Database Employee.csv');
        if (!file_exists($csvFile)) {
            $this->command->error("CSV file not found: {$csvFile}");
            return;
        }

        $file = fopen($csvFile, 'r');
        $header = fgetcsv($file, 0, ';');

        DB::beginTransaction();
        try {
            while (($row = fgetcsv($file, 0, ';')) !== FALSE) {
                $this->command->info("Processing row: " . json_encode($row));
                // Skip empty rows or rows with no name
                if (!isset($row[1]) || empty($row[1])) continue;
                
                // Ensure row matches header count
                $row = array_slice($row, 0, count($header));
                if (count($header) !== count($row)) {
                    $this->command->warn("Column count mismatch for row with name: " . ($row[1] ?? 'unknown'));
                    continue;
                }
                
                $data = array_combine($header, $row);

                // 1. Handle Work Location (Perusahaan)
                $locationName = $data['Perusahaan'] ?: 'PST';
                $locationCode = strtoupper(substr($locationName, 0, 4)); // e.g., KPLU
                $location = WorkLocation::firstOrCreate(
                    ['code' => $locationCode],
                    ['name' => $locationName, 'address' => 'Jakarta']
                );

                // 2. Handle Department
                $deptName = $data['Departement'];
                $deptCode = strtoupper(substr($deptName, 0, 3));
                $department = Department::firstOrCreate(
                    ['name' => $deptName],
                    ['code' => $deptCode]
                );

                // 3. Handle Position
                $posName = $data['Jabatan'];
                // Determine grade based on title
                $grade = 'staff';
                if (stripos($posName, 'Manager') !== false) $grade = 'manager';
                elseif (stripos($posName, 'Supervisor') !== false) $grade = 'supervisor';
                elseif (stripos($posName, 'Director') !== false || stripos($posName, 'Head') !== false) $grade = 'manager';
                elseif (stripos($posName, 'Kepala') !== false) $grade = 'supervisor';

                $position = Position::firstOrCreate(
                    ['name' => $posName, 'department_id' => $department->id],
                    ['grade' => $grade]
                );

                // 4. Parse Helpers
                $parseNum = function ($val) {
                    if (is_numeric($val)) return (float) $val;
                    return (float) str_replace(',', '', $val ?: 0);
                };

                $parseDate = function($val) {
                    if (empty($val) || $val == '0000-00-00') return null;
                    try {
                        // Handle multiple formats if needed (d/m/Y or Y-m-d)
                        if (str_contains($val, '/')) {
                            return Carbon::createFromFormat('d/m/Y', $val)->format('Y-m-d');
                        }
                        return Carbon::parse($val)->format('Y-m-d');
                    } catch (\Exception $e) {
                        return null;
                    }
                };

                // 5. Generate NIK (EMP-[CompanyCode]-[Seq]-[YYDDMM])
                $hireDateRaw = $data['Hire Date'];
                $hireDate = $parseDate($hireDateRaw) ?: now()->format('Y-m-d');
                
                // Sequence for this location
                $seq = Employee::where('work_location_id', $location->id)->count() + 1;
                $seqFormatted = str_pad($seq, 3, '0', STR_PAD_LEFT);
                $dateObj = Carbon::parse($hireDate);
                $dateFormatted = $dateObj->format('y') . $dateObj->format('d') . $dateObj->format('m');
                $generatedNik = "EMP-{$location->code}-{$seqFormatted}-{$dateFormatted}";

                // 6. Create User Account
                $user = \App\Models\User::firstOrCreate(
                    ['email' => $data['Email'] ?: 'emp'.time().'@example.com'],
                    [
                        'name' => $data['Nama'],
                        'password' => \Illuminate\Support\Facades\Hash::make('password'),
                        'role' => $grade,
                    ]
                );

                // 7. Create/Update Employee
                Employee::updateOrCreate(
                    ['nama' => $data['Nama']],
                    [
                        'nik' => $generatedNik,
                        'user_id' => $user->id,
                        'nama' => $data['Nama'],
                        'email' => $data['Email'],
                        'department_id' => $department->id,
                        'position_id' => $position->id,
                        'work_location_id' => $location->id,
                        'status_kepegawaian' => strtolower($data['Status Kepegawaian']),
                        'hire_date' => $hireDate,
                        'end_date' => $parseDate($data['End Date']),
                        'is_active' => empty($data['End Date']) || $data['End Date'] == '0000-00-00',
                        'tempat_lahir' => $data['Tempat Lahir'],
                        'tanggal_lahir' => $parseDate($data['Tanggal Lahir']),
                        'alamat_tetap' => $data['Alamat Tetap'],
                        'alamat_sekarang' => $data['Alamat Sekarang'],
                        'gender' => strtolower($data['Gender']) == 'pria' || strtolower($data['Gender']) == 'laki-laki' ? 'laki-laki' : 'perempuan',
                        'status_pernikahan' => strtolower($data['Status Pernikahan']),
                        'pendidikan_terakhir' => $data['Pendidikan Terakhir'],
                        'agama' => $data['Agama'],
                        'no_telpon_1' => $data['No Telpon 1'],
                        'no_telpon_2' => $data['No Telpon 2'],
                        'no_ktp' => $data['No KTP'],
                        'npwp' => $data['NPWP'],
                        'no_bpjs_ketenagakerjaan' => $data['BPJS Ketenagakerjaan'],
                        'no_bpjs_kesehatan' => $data['BPJS Kesehatan'],
                        'nama_bank' => $data['Nama Bank'],
                        'cabang_bank' => $data['Cabang Bank'],
                        'no_rekening' => $data['No Rekening'],
                        'nama_rekening' => $data['Nama Rekening'],
                        'nama_kontak_darurat_1' => $data['Nama Kontak Darurat 1'],
                        'no_kontak_darurat_1' => $data['No Kontak Darurat 1'],
                        'nama_kontak_darurat_2' => $data['Nama Kontak Darurat 2'],
                        'no_kontak_darurat_2' => $data['No Kontak Darurat 2'],
                        'gaji_pokok' => $parseNum($data['Gaji Pokok']),
                        'tunjangan_jabatan' => $parseNum($data['Tunjangan Jabatan']),
                        'tunjangan_kehadiran' => $parseNum($data['Tunjangan kehadiran']),
                        'tunjangan_transportasi' => $parseNum($data['Tunjangan Transportasi']),
                        'uang_makan' => $parseNum($data['Uang Makan']),
                        'uang_lembur' => $parseNum($data['Uang Lembur']),
                        'thr' => $parseNum($data['THR']),
                        'gaji_bpjs_tk' => $parseNum($data['Gaji BPJS TK']),
                        'gaji_bpjs_jkn' => $parseNum($data['Gaji BPJS JKN']),
                        'pinjaman_koperasi' => $parseNum($data['Pinjaman Koperasi']),
                        'potongan_lain_1' => $parseNum($data['Potongan Lain-lain 1']),
                        'potongan_lain_2' => $parseNum($data['Potongan Lain-lain 2']),
                    ]
                );
            }
            DB::commit();
            $this->command->info("Employee seeding completed successfully.");
        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error("Error seeding employees: " . $e->getMessage() . " at " . $e->getLine());
        }

        fclose($file);
    }
}
