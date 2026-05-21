<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin() || $this->user()->hasPermission('employee.create');
    }

    public function rules(): array
    {
        return [
            // Data Pribadi
            'nama' => 'required|string|max:255',
            'tempat_lahir' => 'nullable|string|max:255',
            'tanggal_lahir' => 'nullable|date',
            'alamat_tetap' => 'nullable|string',
            'alamat_sekarang' => 'nullable|string',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'gender' => 'nullable|in:laki-laki,perempuan',
            'status_pernikahan' => 'nullable|string|max:10',
            'pendidikan_terakhir' => 'nullable|string|max:20',
            'agama' => 'nullable|string|max:20',
            'no_telpon_1' => 'nullable|string|max:20',
            'no_telpon_2' => 'nullable|string|max:20',
            // Identity
            'no_ktp' => 'nullable|string|max:20',
            'npwp' => 'nullable|string|max:30',
            'no_bpjs_ketenagakerjaan' => 'nullable|string|max:30',
            'no_bpjs_kesehatan' => 'nullable|string|max:30',
            // Employment
            'report_to' => 'nullable|exists:employees,id',
            'manager_id' => 'nullable|exists:employees,id',
            'department_id' => 'required|exists:departments,id',
            'position_id' => 'required|exists:positions,id',
            'work_location_id' => 'required|exists:work_locations,id',
            'working_location_id' => 'nullable|exists:working_locations,id',
            'shift_ids' => 'nullable|array',
            'shift_ids.*' => 'exists:shifts,id',
            'machine_id' => 'nullable|integer',
            'status_kepegawaian' => 'required|in:tetap,kontrak,probation,magang',
            'hire_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:hire_date',
            // Banking
            'nama_bank' => 'nullable|string|max:100',
            'cabang_bank' => 'nullable|string|max:100',
            'no_rekening' => 'nullable|string|max:30',
            'nama_rekening' => 'nullable|string|max:255',
            // Emergency contacts
            'nama_kontak_darurat_1' => 'nullable|string|max:255',
            'no_kontak_darurat_1' => 'nullable|string|max:20',
            'nama_kontak_darurat_2' => 'nullable|string|max:255',
            'no_kontak_darurat_2' => 'nullable|string|max:20',
            // Salary
            'gaji_pokok' => 'nullable|numeric|min:0',
            'tunjangan_jabatan' => 'nullable|numeric|min:0',
            'tunjangan_kehadiran' => 'nullable|numeric|min:0',
            'tunjangan_transportasi' => 'nullable|numeric|min:0',
            'uang_makan' => 'nullable|numeric|min:0',
            'uang_lembur' => 'nullable|numeric|min:0',
            'thr' => 'nullable|numeric|min:0',
            'gaji_bpjs_tk' => 'nullable|numeric|min:0',
            'gaji_bpjs_jkn' => 'nullable|numeric|min:0',
            'gross_up' => 'nullable|boolean',
            'pinjaman_koperasi' => 'nullable|numeric|min:0',
            'potongan_lain_1' => 'nullable|numeric|min:0',
            'potongan_lain_2' => 'nullable|numeric|min:0',
            // Files
            'photo' => 'nullable|image|max:2048',
            'file_ktp' => 'nullable|file|max:5120',
            'file_npwp' => 'nullable|file|max:5120',
            'file_kk' => 'nullable|file|max:5120',
            'file_ijazah' => 'nullable|file|max:5120',
            'file_lainnya.*' => 'nullable|file|max:5120',
            'signature' => 'nullable|string',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ];
    }
}
