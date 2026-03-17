<?php

namespace App\Exports;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class EmployeeExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    use Exportable;

    protected $filters;

    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    public function query()
    {
        return Employee::query()
            ->with(['department', 'position', 'workLocation', 'shift'])
            ->when(isset($this->filters['search']), function (Builder $q) {
                $search = $this->filters['search'];
                $q->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                      ->orWhere('nik', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when(isset($this->filters['department_id']), function (Builder $q) {
                $q->where('department_id', $this->filters['department_id']);
            })
            ->when(isset($this->filters['status_kepegawaian']), function (Builder $q) {
                $q->where('status_kepegawaian', $this->filters['status_kepegawaian']);
            })
            ->when(isset($this->filters['work_location_id']), function (Builder $q) {
                $q->where('work_location_id', $this->filters['work_location_id']);
            })
            ->when(isset($this->filters['lokasi_kerja']), function (Builder $q) {
                $q->where('lokasi_kerja', $this->filters['lokasi_kerja']);
            })
            ->when(isset($this->filters['is_active']) && $this->filters['is_active'] !== '', function (Builder $q) {
                $q->where('is_active', (bool) $this->filters['is_active']);
            })
            ->orderBy('nama');
    }

    public function headings(): array
    {
        return [
            'NIK',
            'Nama Lengkap',
            'Email',
            'Gender',
            'Tempat Lahir',
            'Tanggal Lahir',
            'Agama',
            'Pendidikan',
            'Status Pernikahan',
            'No. Telp 1',
            'No. Telp 2',
            'Alamat Tetap',
            'Alamat Sekarang',
            'No. KTP',
            'NPWP',
            'No. BPJS TK',
            'No. BPJS Kesehatan',
            'Perusahaan / Work Location',
            'Lokasi Kerja',
            'Departemen',
            'Jabatan',
            'Shift',
            'Status Kepegawaian',
            'Tanggal Masuk',
            'Tanggal Berakhir',
            'Status Aktif',
            'Bank',
            'Cabang Bank',
            'No. Rekening',
            'Nama Rekening',
            'Kontak Darurat 1',
            'No. Darurat 1',
            'Kontak Darurat 2',
            'No. Darurat 2',
        ];
    }

    public function map($employee): array
    {
        return [
            $employee->nik,
            $employee->nama,
            $employee->email,
            $employee->gender,
            $employee->tempat_lahir,
            $employee->tanggal_lahir,
            $employee->agama,
            $employee->pendidikan_terakhir,
            $employee->status_pernikahan,
            $employee->no_telpon_1,
            $employee->no_telpon_2,
            $employee->alamat_tetap,
            $employee->alamat_sekarang,
            $employee->no_ktp,
            $employee->npwp,
            $employee->no_bpjs_ketenagakerjaan,
            $employee->no_bpjs_kesehatan,
            $employee->workLocation ? $employee->workLocation->name : '',
            $employee->lokasi_kerja,
            $employee->department ? $employee->department->name : '',
            $employee->position ? $employee->position->name : '',
            $employee->shift ? $employee->shift->name : '',
            ucfirst($employee->status_kepegawaian),
            $employee->hire_date,
            $employee->end_date,
            $employee->is_active ? 'Aktif' : 'Non-aktif',
            $employee->nama_bank,
            $employee->cabang_bank,
            $employee->no_rekening,
            $employee->nama_rekening,
            $employee->nama_kontak_darurat_1,
            $employee->no_kontak_darurat_1,
            $employee->nama_kontak_darurat_2,
            $employee->no_kontak_darurat_2,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
