<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Employee;
use App\Models\PaymentRequest;
use App\Models\WorkLocation;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PaymentRequestSeeder extends Seeder
{
    public function run(): void
    {
        $cdm = WorkLocation::where('code', 'CDM')->first();
        $kplu = WorkLocation::where('code', 'KPLU')->first();
        
        $hrd = Department::where('name', 'like', 'Human Resources%')->first();
        $finance = Department::where('name', 'like', 'Accounting%')->first();
        $ga = Department::where('name', 'like', '%General Affair%')->first();

        $employee = Employee::first(); // Assume at least one employee exists
        if (!$employee) return;

        $prs = [
            [
                'pr_number' => 'PR\CDM-GA\1\XI\2025',
                'date' => '2025-11-15',
                'company_id' => $cdm->id,
                'work_location_id' => $cdm->id,
                'department_id' => $ga->id,
                'subject' => 'Cicilan Mobil',
                'description' => 'Peminjaman Pihak Ke 3 Ardy Kusuma',
                'amount' => 5000000,
                'paid_to' => 'Ardy Kusuma Thejalaksana',
                'bank_name' => 'Bank Central Asia',
                'bank_account' => '8705471238',
                'status' => 'approved',
                'requested_by_id' => $employee->id,
                'requested_at' => '2025-11-15 13:32:26',
            ],
            [
                'pr_number' => 'PR\CDM-HRD\2\XII\2025',
                'date' => '2025-12-19',
                'company_id' => $cdm->id,
                'work_location_id' => $cdm->id,
                'department_id' => $hrd->id,
                'subject' => 'THR Natal',
                'description' => 'Pembayaran THR Natal Desember 2025',
                'amount' => 25000000,
                'paid_to' => 'Raphael Tjioenaldy',
                'bank_name' => 'Mandiri',
                'bank_account' => '60012213488',
                'status' => 'pending',
                'requested_by_id' => $employee->id,
                'requested_at' => '2025-12-19 09:38:57',
            ],
            [
                'pr_number' => 'PR\KPLU-HRD\1\I\2026',
                'date' => '2026-01-20',
                'company_id' => $kplu->id,
                'work_location_id' => $kplu->id,
                'department_id' => $hrd->id,
                'subject' => 'BPJS Kesehatan',
                'description' => 'Pembayaran iuran BPJS Kesehatan Periode Januari 2026',
                'amount' => 12500000,
                'paid_to' => 'VA BPJS Kesehatan',
                'bank_name' => 'Mandiri',
                'bank_account' => '8988890003423948',
                'status' => 'partially_approved',
                'requested_by_id' => $employee->id,
                'requested_at' => '2026-01-20 08:45:32',
                'tax_status' => 'approved',
                'tax_approver_id' => $employee->id,
                'tax_approved_at' => '2026-01-20 08:59:19',
            ]
        ];

        foreach ($prs as $data) {
            PaymentRequest::create($data);
        }
    }
}
