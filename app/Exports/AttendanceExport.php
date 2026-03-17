<?php

namespace App\Exports;

use App\Models\Attendance;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AttendanceExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    use Exportable;

    protected $filters;

    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    public function query()
    {
        // Must return a query builder, exactly like how index() fetches it
        return Attendance::query()
            ->with(['employee:id,nama,nik,shift_id', 'employee.shift'])
            ->when(isset($this->filters['search']), function (Builder $query) {
                $search = $this->filters['search'];
                $query->whereHas('employee', function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                      ->orWhere('nik', 'like', "%{$search}%");
                });
            })
            ->when(isset($this->filters['tanggal_start']), function (Builder $query) {
                $query->where('tanggal', '>=', $this->filters['tanggal_start']);
            })
            ->when(isset($this->filters['tanggal_end']), function (Builder $query) {
                $query->where('tanggal', '<=', $this->filters['tanggal_end']);
            })
            ->when(isset($this->filters['work_location_id']), function (Builder $query) {
                $query->whereHas('employee', function ($q) {
                    $q->where('work_location_id', $this->filters['work_location_id']);
                });
            })
            ->orderBy('tanggal', 'desc');
    }

    public function headings(): array
    {
        return [
            'Tanggal',
            'Nama Karyawan',
            'Shift (Masuk - Pulang)',
            'Absen (Datang - Pulang)',
            'Keterlambatan (Late / Early)',
            'Status',
        ];
    }

    public function map($attendance): array
    {
        $shiftStr = ($attendance->jam_masuk ?? '-') . ' s/d ' . ($attendance->jam_pulang ?? '-');
        
        $absenMasuk = $attendance->clock_in ? \Carbon\Carbon::parse($attendance->clock_in)->format('H:i') : '-';
        $absenPulang = $attendance->clock_out ? \Carbon\Carbon::parse($attendance->clock_out)->format('H:i') : '-';
        $absenStr = $absenMasuk . ' s/d ' . $absenPulang;

        $lateStr = '';
        if ($attendance->late_in_minutes > 0) {
            $lateStr .= 'Terlambat ' . $attendance->late_in_minutes . 'm';
        } elseif ($attendance->early_in_minutes > 0) {
            $lateStr .= 'Awal ' . $attendance->early_in_minutes . 'm';
        } else {
            $lateStr .= 'Tepat Waktu';
        }

        return [
            \Carbon\Carbon::parse($attendance->tanggal)->format('Y-m-d'),
            $attendance->employee ? $attendance->employee->nama : '',
            $shiftStr,
            $absenStr,
            $lateStr,
            ucfirst($attendance->status),
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
