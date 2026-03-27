<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayrollItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'payroll_id',
        'employee_id',
        'employee_name',
        'employee_nik',
        'department_name',
        'position_name',
        'work_location_name',
        'working_location_name',
        'bank_name',
        'bank_account_no',
        'gaji_pokok',
        'tunjangan_jabatan',
        'tunjangan_kehadiran',
        'tunjangan_transportasi',
        'uang_makan',
        'uang_lembur',
        'thr',
        'tunjangan_pajak',
        'total_pendapatan',
        'potongan_bpjs_tk',
        'potongan_bpjs_jkn',
        'potongan_pph21',
        'pinjaman_koperasi',
        'potongan_lain_1',
        'potongan_lain_2',
        'total_potongan',
        'gaji_bersih',
        'iuran_bpjs_tk_perusahaan',
        'iuran_bpjs_jkn_perusahaan',
        'uang_makan_count',
        'lembur_minutes',
        'bpjs_tk_base',
        'bpjs_jkn_base',
        'taxable_gross',
    ];

    protected function casts(): array
    {
        return [
            'gaji_pokok' => 'decimal:2',
            'tunjangan_jabatan' => 'decimal:2',
            'tunjangan_kehadiran' => 'decimal:2',
            'tunjangan_transportasi' => 'decimal:2',
            'uang_makan' => 'decimal:2',
            'uang_lembur' => 'decimal:2',
            'thr' => 'decimal:2',
            'tunjangan_pajak' => 'decimal:2',
            'total_pendapatan' => 'decimal:2',
            'potongan_bpjs_tk' => 'decimal:2',
            'potongan_bpjs_jkn' => 'decimal:2',
            'potongan_pph21' => 'decimal:2',
            'pinjaman_koperasi' => 'decimal:2',
            'potongan_lain_1' => 'decimal:2',
            'potongan_lain_2' => 'decimal:2',
            'total_potongan' => 'decimal:2',
            'gaji_bersih' => 'decimal:2',
            'iuran_bpjs_tk_perusahaan' => 'decimal:2',
            'iuran_bpjs_jkn_perusahaan' => 'decimal:2',
            'uang_makan_count' => 'integer',
            'lembur_minutes' => 'integer',
            'bpjs_tk_base' => 'decimal:2',
            'bpjs_jkn_base' => 'decimal:2',
            'taxable_gross' => 'decimal:2',
        ];
    }

    public function payroll(): BelongsTo
    {
        return $this->belongsTo(Payroll::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
