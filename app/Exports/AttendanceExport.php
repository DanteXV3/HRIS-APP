<?php

namespace App\Exports;

use App\Models\Attendance;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use App\Models\Employee;
use Carbon\Carbon;

class AttendanceExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    use Exportable;

    protected $filters;

    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $search = $this->filters['search'] ?? null;
        $tanggalStart = $this->filters['tanggal_start'] ?? null;
        $tanggalEnd = $this->filters['tanggal_end'] ?? null;
        $workLocationId = $this->filters['work_location_id'] ?? null;

        $attendances = Attendance::with(['employee:id,nama,nik,department_id,position_id,shift_id,work_location_id', 'employee.shift'])
            ->when($tanggalStart, fn($q, $v) => $q->where('tanggal', '>=', $v))
            ->when($tanggalEnd, fn($q, $v) => $q->where('tanggal', '<=', $v))
            ->when($workLocationId, function ($query, $workLocationId) {
                $query->whereHas('employee', function ($q) use ($workLocationId) {
                    $q->where('work_location_id', $workLocationId);
                });
            })
            ->get();

        $holidays = \App\Models\Holiday::whereBetween('date', [$tanggalStart, $tanggalEnd])->pluck('name', 'date');
        
        $dateRange = [];
        if ($tanggalStart && $tanggalEnd) {
            $currentDate = Carbon::parse($tanggalStart);
            $endDate = Carbon::parse($tanggalEnd);
            while ($currentDate <= $endDate) {
                $dateRange[] = $currentDate->format('Y-m-d');
                $currentDate->addDay();
            }
        } else {
            // Fallback to distinct dates in result if no range provided
            $dateRange = $attendances->pluck('tanggal')->map(fn($d) => $d instanceof Carbon ? $d->format('Y-m-d') : Carbon::parse($d)->format('Y-m-d'))->unique()->sort()->toArray();
        }

        $employees = Employee::with(['shift', 'department', 'position', 'workLocation'])
            ->whereHas('attendances', function($q) use ($tanggalStart, $tanggalEnd) {
                if ($tanggalStart) $q->where('tanggal', '>=', $tanggalStart);
                if ($tanggalEnd) $q->where('tanggal', '<=', $tanggalEnd);
            })
            ->orWhereIn('id', $attendances->pluck('employee_id')->unique())
            ->get();

        if ($search) {
            $employees = Employee::with(['shift', 'department', 'position', 'workLocation'])
                ->where(function($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                      ->orWhere('nik', 'like', "%{$search}%");
                })
                ->get();
        }

        if ($workLocationId) {
            $employees = $employees->where('work_location_id', $workLocationId);
        }

        $allData = collect();
        foreach ($employees as $employee) {
            // Ensure keys are strings "Y-m-d" to prevent search errors with Carbon objects
            $empAttendances = $attendances->where('employee_id', $employee->id)->mapWithKeys(function ($item) {
                $dateStr = $item->tanggal instanceof Carbon ? $item->tanggal->format('Y-m-d') : Carbon::parse($item->tanggal)->format('Y-m-d');
                return [$dateStr => $item];
            });
            
            foreach ($dateRange as $date) {
                if ($empAttendances->has($date)) {
                    $allData->push($empAttendances->get($date));
                } else {
                    $carbonDate = Carbon::parse($date);
                    $status = 'alpha';
                    $isHoliday = false;
                    $notes = '';

                    if ($holidays->has($date)) {
                        $status = 'libur';
                        $isHoliday = true;
                        $notes = $holidays->get($date);
                    } elseif ($carbonDate->isWeekend()) {
                        $status = 'off';
                    }

                    // Create a virtual attendance object
                    $att = new Attendance([
                        'tanggal' => $date,
                        'employee_id' => $employee->id,
                        'status' => $status,
                        'clock_in' => null,
                        'clock_out' => null,
                        'jam_masuk' => $employee->shift->jam_masuk ?? null,
                        'jam_pulang' => $employee->shift->jam_pulang ?? null,
                        'late_in_minutes' => 0,
                        'early_in_minutes' => 0,
                        'late_out_minutes' => 0,
                        'early_out_minutes' => 0,
                        'is_late' => false,
                        'is_holiday' => $isHoliday,
                        'notes' => $notes,
                        'verified_lembur_minutes' => 0
                    ]);
                    $att->setRelation('employee', $employee);
                    $allData->push($att);
                }
            }
        }

        return $allData;
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
