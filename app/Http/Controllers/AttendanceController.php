<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\WorkLocation;
use App\Models\Holiday;
use App\Models\LeaveRequest;
use App\Http\Requests\AttendanceRequest;
use App\Services\AttendanceService;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\AttendanceExport;
use Barryvdh\DomPDF\Facade\Pdf;

class AttendanceController extends Controller
{
    use AuthorizesRequests;

    protected $attendanceService;

    public function __construct(AttendanceService $attendanceService)
    {
        $this->attendanceService = $attendanceService;
    }

    public function myAttendance(Request $request)
    {
        $employee = Employee::where('user_id', $request->user()->id)->first();

        if (!$employee) {
            return Inertia::render('attendances/me', [
                'attendances' => [],
                'filters' => [],
                'employee' => null,
                'error' => 'Akun Anda tidak terhubung dengan data karyawan.'
            ]);
        }

        $attendances = Attendance::where('employee_id', $employee->id)
            ->when($request->tanggal_start, fn($q, $v) => $q->where('tanggal', '>=', $v))
            ->when($request->tanggal_end, fn($q, $v) => $q->where('tanggal', '<=', $v))
            ->orderBy('tanggal', 'desc')
            ->paginate(15)
            ->withQueryString();

        $pendingCorrections = \App\Models\AttendanceCorrection::where('employee_id', $employee->id)
            ->where('approval_status', 'pending')
            ->get()
            ->keyBy('tanggal');

        return Inertia::render('attendances/me', [
            'attendances' => $attendances,
            'filters' => $request->only(['tanggal_start', 'tanggal_end']),
            'employee' => $employee->load(['shifts', 'workLocation', 'workingLocation', 'department', 'position']),
            'pendingCorrections' => $pendingCorrections,
        ]);
    }

    public function myAttendancePdf(Request $request)
    {
        $employee = Employee::with(['department', 'position', 'shifts', 'workLocation', 'workingLocation'])
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$employee) abort(403);

        $tanggalStart = $request->input('tanggal_start', now()->startOfMonth()->format('Y-m-d'));
        $tanggalEnd = $request->input('tanggal_end', now()->endOfMonth()->format('Y-m-d'));

        $data = $this->prepareAttendanceData(collect([$employee]), $tanggalStart, $tanggalEnd);

        $pdf = Pdf::loadView('pdf.attendance_report', [
            'data' => $data,
            'tanggalStart' => $tanggalStart,
            'tanggalEnd' => $tanggalEnd,
        ])->setPaper('A4', 'portrait');

        return $pdf->download('Absensi_Saya_' . $employee->nik . '_' . date('Ymd') . '.pdf');
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', Attendance::class);

        $attendances = Attendance::with(['employee.department', 'employee.position', 'employee.workLocation', 'employee.shifts'])
            ->when($request->search, function ($query, $search) {
                $query->whereHas('employee', function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                      ->orWhere('nik', 'like', "%{$search}%");
                });
            })
            ->when($request->employee_ids, function ($query, $ids) {
                $query->whereIn('employee_id', (array) $ids);
            })
            ->when($request->tanggal_start, fn($q, $v) => $q->where('tanggal', '>=', $v))
            ->when($request->tanggal_end, fn($q, $v) => $q->where('tanggal', '<=', $v))
            ->when($request->work_location_id, function ($query, $v) {
                $query->whereHas('employee', fn($q) => $q->where('work_location_id', $v));
            })
            ->orderBy('tanggal', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('attendances/index', [
            'attendances' => $attendances,
            'filters' => $request->only(['search', 'employee_ids', 'tanggal_start', 'tanggal_end', 'work_location_id']),
            'employees' => Employee::with(['shifts'])->where('is_active', true)->orderBy('nama')->get(),
            'workLocations' => WorkLocation::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function export(Request $request)
    {
        $this->authorize('viewAny', Attendance::class);

        $filters = $request->only(['search', 'tanggal_start', 'tanggal_end', 'work_location_id']);
        $fileName = 'Laporan_Absensi_' . date('Ymd_His') . '.xlsx';

        return Excel::download(new AttendanceExport($filters), $fileName);
    }

    public function import(Request $request)
    {
        $this->authorize('create', Attendance::class);

        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:5120',
        ]);

        $file = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');

        if (!$handle) {
            return redirect()->back()->withErrors(['file' => 'Gagal membaca file CSV.']);
        }

        // Auto-detect delimiter (comma or semicolon)
        $firstLine = fgets($handle);
        rewind($handle);
        $delimiter = (substr_count($firstLine, ';') > substr_count($firstLine, ',')) ? ';' : ',';

        // Skip header row
        $header = fgetcsv($handle, 0, $delimiter);
        if (!$header) {
            fclose($handle);
            return redirect()->back()->withErrors(['file' => 'File CSV kosong.']);
        }

        $imported = 0;
        $skipped = 0;
        $errors = [];
        $lineNumber = 1;

        // Cache employees by NIK for performance
        $employeeCache = [];

        while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
            $lineNumber++;

            // Skip empty rows
            if (!$row || (count($row) === 1 && empty(trim($row[0] ?? '')))) {
                continue;
            }

            // Ensure minimum columns: NIK, Tanggal, Clock In, Clock Out, Status, Overtime, Notes
            if (count($row) < 5) {
                $errors[] = "Baris {$lineNumber}: Kolom tidak lengkap (minimal 5 kolom).";
                $skipped++;
                continue;
            }

            $nik = trim($row[0] ?? '');
            $tanggal = trim($row[1] ?? '');
            $clockInTime = trim($row[2] ?? '');
            $clockOutTime = trim($row[3] ?? '');
            $status = strtolower(trim($row[4] ?? 'hadir'));
            $overtimeMinutes = (int) trim($row[5] ?? '0');
            $notes = trim($row[6] ?? '');

            if (empty($nik) || empty($tanggal)) {
                $errors[] = "Baris {$lineNumber}: NIK atau Tanggal kosong.";
                $skipped++;
                continue;
            }

            // Validate date format
            try {
                $tanggalParsed = Carbon::parse($tanggal)->format('Y-m-d');
            } catch (\Exception $e) {
                $errors[] = "Baris {$lineNumber}: Format tanggal tidak valid ({$tanggal}).";
                $skipped++;
                continue;
            }

            // Look up employee by NIK
            if (!isset($employeeCache[$nik])) {
                $employee = Employee::with(['shifts', 'workingLocation'])->where('nik', $nik)->first();
                $employeeCache[$nik] = $employee;
            }
            $employee = $employeeCache[$nik];

            if (!$employee) {
                $errors[] = "Baris {$lineNumber}: Karyawan dengan NIK '{$nik}' tidak ditemukan.";
                $skipped++;
                continue;
            }

            $shift = $employee->shifts->first();

            // Parse clock in/out in the employee's timezone
            $clockIn = null;
            $clockOut = null;
            $empTimezone = $this->attendanceService->getEmployeeTimezone($employee);

            if (!empty($clockInTime)) {
                try {
                    $clockIn = Carbon::parse($tanggalParsed . ' ' . $clockInTime, $empTimezone);
                } catch (\Exception $e) {
                    $errors[] = "Baris {$lineNumber}: Format jam masuk tidak valid ({$clockInTime}).";
                }
            }

            if (!empty($clockOutTime)) {
                try {
                    $clockOut = Carbon::parse($tanggalParsed . ' ' . $clockOutTime, $empTimezone);
                } catch (\Exception $e) {
                    $errors[] = "Baris {$lineNumber}: Format jam pulang tidak valid ({$clockOutTime}).";
                }
            }

            // Determine the target shift for this row based on clock in/out times
            $shiftContext = $this->attendanceService->findTargetShift($employee, $clockIn ?? $clockOut ?? Carbon::parse($tanggalParsed));
            $shift = $shiftContext['shift'];
            $shiftId = $shift?->id;

            // Calculate metrics using AttendanceService
            $metricsIn = $clockIn ? $this->attendanceService->calculateMetrics($employee, $clockIn, $shift, false) : [];
            $metricsOut = $clockOut ? $this->attendanceService->calculateMetrics($employee, $clockOut, $shift, true) : [];

            // Validate status
            $validStatuses = ['hadir', 'izin', 'sakit', 'cuti', 'alpha', 'libur', 'off'];
            if (!in_array($status, $validStatuses)) {
                $status = 'hadir';
            }

            Attendance::updateOrCreate(
                ['employee_id' => $employee->id, 'tanggal' => $tanggalParsed, 'shift_id' => $shiftId],
                [
                    'clock_in' => $clockIn?->format('Y-m-d H:i:s'),
                    'clock_out' => $clockOut?->format('Y-m-d H:i:s'),
                    'jam_masuk' => $shift?->jam_masuk,
                    'jam_pulang' => $shift?->jam_pulang,
                    'shift_name' => $shift?->name,
                    'shift_id' => $shiftId,
                    'early_in_minutes' => $metricsIn['early_in_minutes'] ?? 0,
                    'late_in_minutes' => $metricsIn['late_in_minutes'] ?? 0,
                    'is_late' => ($metricsIn['late_in_minutes'] ?? 0) > 0,
                    'late_minutes' => $metricsIn['late_in_minutes'] ?? 0,
                    'early_out_minutes' => $metricsOut['early_out_minutes'] ?? 0,
                    'late_out_minutes' => $metricsOut['late_out_minutes'] ?? 0,
                    'status' => $status,
                    'overtime_minutes' => $metricsOut['overtime_minutes'] ?? 0,
                    'verified_lembur_minutes' => $overtimeMinutes,
                    'is_holiday' => $status === 'libur',
                    'notes' => $notes,
                ]
            );

            $imported++;
        }

        fclose($handle);

        $message = "Berhasil mengimport {$imported} data absensi.";
        if ($skipped > 0) {
            $message .= " {$skipped} baris dilewati.";
        }

        if (!empty($errors)) {
            return redirect()->back()
                ->with('success', $message)
                ->with('importErrors', array_slice($errors, 0, 10));
        }

        return redirect()->back()->with('success', $message);
    }

    public function store(AttendanceRequest $request)
    {
        $validated = $request->validated();
        
        $employee = Employee::with(['shifts', 'workingLocation'])->findOrFail($validated['employee_id']);
        $shift = $employee->shifts->first();

        // Parse clock times in the employee's timezone so metrics are calculated correctly
        $timezone = $this->attendanceService->getEmployeeTimezone($employee);
        $clockInStr = $validated['clock_in'] ?? null;
        if ($clockInStr) {
            $clockInStr = strlen($clockInStr) > 8 ? $clockInStr : $validated['tanggal'] . ' ' . $clockInStr;
        }
        $clockIn = $clockInStr ? Carbon::parse($clockInStr, $timezone) : null;

        $clockOutStr = $validated['clock_out'] ?? null;
        if ($clockOutStr) {
            $clockOutStr = strlen($clockOutStr) > 8 ? $clockOutStr : $validated['tanggal'] . ' ' . $clockOutStr;
        }
        $clockOut = $clockOutStr ? Carbon::parse($clockOutStr, $timezone) : null;
        
        $jamMasuk = $validated['jam_masuk'] ?? $shift?->jam_masuk;
        $jamPulang = $validated['jam_pulang'] ?? $shift?->jam_pulang;

        $targetShift = (object)[
            'jam_masuk' => $jamMasuk,
            'jam_pulang' => $jamPulang,
            'name' => $shift?->name
        ];

        $metricsIn = $clockIn ? $this->attendanceService->calculateMetrics($employee, $clockIn, $targetShift, false) : [];
        $metricsOut = $clockOut ? $this->attendanceService->calculateMetrics($employee, $clockOut, $targetShift, true) : [];

        $shiftId = $shift?->id;

        Attendance::updateOrCreate(
            ['employee_id' => $validated['employee_id'], 'tanggal' => $validated['tanggal'], 'shift_id' => $shiftId],
            [
                'clock_in' => $clockIn?->format('Y-m-d H:i:s'),
                'clock_out' => $clockOut?->format('Y-m-d H:i:s'),
                'jam_masuk' => $jamMasuk,
                'jam_pulang' => $jamPulang,
                'shift_name' => $shift?->name,
                'shift_id' => $shiftId,
                'early_in_minutes' => $metricsIn['early_in_minutes'] ?? 0,
                'late_in_minutes' => $metricsIn['late_in_minutes'] ?? 0,
                'is_late' => ($metricsIn['late_in_minutes'] ?? 0) > 0,
                'late_minutes' => $metricsIn['late_in_minutes'] ?? 0,
                'early_out_minutes' => $metricsOut['early_out_minutes'] ?? 0,
                'late_out_minutes' => $metricsOut['late_out_minutes'] ?? 0,
                'status' => $validated['status'],
                'overtime_minutes' => $metricsOut['overtime_minutes'] ?? 0,
                'verified_lembur_minutes' => round($validated['verified_lembur_hours'] * 60),
                'is_holiday' => $validated['is_holiday'],
                'notes' => $validated['notes'],
            ]
        );

        return redirect()->back()->with('success', 'Data absensi berhasil ditambahkan.');
    }

    public function update(AttendanceRequest $request, Attendance $attendance)
    {
        $this->authorize('update', $attendance);
        $validated = $request->validated();

        $employee = Employee::with(['shifts', 'workingLocation'])->findOrFail($attendance->employee_id);
        
        // Fix: Use the attendance record's original assigned shift to prevent erasing metrics on edit.
        // Also allow overriding via request.
        $jamMasuk = $validated['jam_masuk'] ?? $attendance->jam_masuk;
        $jamPulang = $validated['jam_pulang'] ?? $attendance->jam_pulang;

        $shift = (object)[
            'jam_masuk' => $jamMasuk,
            'jam_pulang' => $jamPulang,
            'name' => $attendance->shift_name
        ];

        // Parse clock times in the employee's timezone so metrics are calculated correctly
        $timezone = $this->attendanceService->getEmployeeTimezone($employee);
        $clockInStr = $validated['clock_in'] ?? null;
        if ($clockInStr) {
            $clockInStr = strlen($clockInStr) > 8 ? $clockInStr : $validated['tanggal'] . ' ' . $clockInStr;
        }
        $clockIn = $clockInStr ? Carbon::parse($clockInStr, $timezone) : null;

        $clockOutStr = $validated['clock_out'] ?? null;
        if ($clockOutStr) {
            $clockOutStr = strlen($clockOutStr) > 8 ? $clockOutStr : $validated['tanggal'] . ' ' . $clockOutStr;
        }
        $clockOut = $clockOutStr ? Carbon::parse($clockOutStr, $timezone) : null;

        $metricsIn = $clockIn ? $this->attendanceService->calculateMetrics($employee, $clockIn, $shift, false, $attendance) : [];
        $metricsOut = $clockOut ? $this->attendanceService->calculateMetrics($employee, $clockOut, $shift, true, $attendance) : [];

        $attendance->update([
            'tanggal' => $validated['tanggal'],
            'clock_in' => $clockIn?->format('Y-m-d H:i:s'),
            'clock_out' => $clockOut?->format('Y-m-d H:i:s'),
            'jam_masuk' => $jamMasuk,
            'jam_pulang' => $jamPulang,
            'early_in_minutes' => $metricsIn['early_in_minutes'] ?? 0,
            'late_in_minutes' => $metricsIn['late_in_minutes'] ?? 0,
            'is_late' => ($metricsIn['late_in_minutes'] ?? 0) > 0,
            'late_minutes' => $metricsIn['late_in_minutes'] ?? 0,
            'early_out_minutes' => $metricsOut['early_out_minutes'] ?? 0,
            'late_out_minutes' => $metricsOut['late_out_minutes'] ?? 0,
            'overtime_minutes' => $metricsOut['overtime_minutes'] ?? 0,
            'status' => $validated['status'],
            'is_holiday' => $validated['is_holiday'],
            'verified_lembur_minutes' => round($validated['verified_lembur_hours'] * 60),
            'notes' => $validated['notes'],
        ]);

        return redirect()->back()->with('success', 'Data absensi berhasil diperbarui.');
    }

    public function destroy(Attendance $attendance)
    {
        $this->authorize('delete', $attendance);
        
        $attendance->delete();

        return redirect()->back()->with('success', 'Data absensi berhasil dihapus.');
    }

    public function exportPdf(Request $request)
    {
        $this->authorize('viewAny', Attendance::class);

        $tanggalStart = $request->input('tanggal_start', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $tanggalEnd = $request->input('tanggal_end', Carbon::now()->endOfMonth()->format('Y-m-d'));

        $employees = Employee::distinct()
            ->with(['department', 'position', 'shifts', 'workLocation', 'workingLocation'])
            ->when($request->search, function($q, $search) {
                $q->where('nama', 'like', "%{$search}%")->orWhere('nik', 'like', "%{$search}%");
            })
            ->when($request->employee_ids, function($q, $ids) {
                $q->whereIn('id', (array)$ids);
            })
            ->when($request->work_location_id, fn($q, $v) => $q->where('work_location_id', $v))
            ->get()
            ->unique(fn($e) => (string)$e->id)
            ->values();

        $data = $this->prepareAttendanceData($employees, $tanggalStart, $tanggalEnd);

        $pdf = Pdf::loadView('pdf.attendance_report', [
            'data' => $data,
            'tanggalStart' => $tanggalStart,
            'tanggalEnd' => $tanggalEnd,
        ])->setPaper('A4', 'portrait');

        return $pdf->download('Laporan_Absensi_' . date('Ymd_His') . '.pdf');
    }

    public function exportRecapPdf(Request $request)
    {
        $this->authorize('viewAny', Attendance::class);

        $tanggalStart = $request->input('tanggal_start', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $tanggalEnd = $request->input('tanggal_end', Carbon::now()->endOfMonth()->format('Y-m-d'));

        $employees = Employee::distinct()
            ->with(['department', 'position', 'shifts', 'workLocation', 'workingLocation'])
            ->where('is_active', true)
            ->when($request->search, function($q, $search) {
                $q->where('nama', 'like', "%{$search}%")->orWhere('nik', 'like', "%{$search}%");
            })
            ->when($request->employee_ids, function($q, $ids) {
                $q->whereIn('id', (array)$ids);
            })
            ->when($request->work_location_id, fn($q, $v) => $q->where('work_location_id', $v))
            ->orderBy('nama')
            ->get()
            ->unique(fn($e) => (string)$e->id)
            ->values();

        $data = $this->prepareAttendanceData($employees, $tanggalStart, $tanggalEnd);

        // Build daily records grouped by work location
        // We do this in a single pass to avoid PHP reference leaks and ensure data integrity
        $dailyByLocation = [];
        foreach ($data as $index => $row) {
            // Calculate late minutes summary for this employee
            $data[$index]['summary']['total_late_mins'] = $row['attendances']->sum('late_in_minutes');
            
            $locationName = $row['employee']->workLocation->name ?? 'Tanpa Lokasi';
            if (!isset($dailyByLocation[$locationName])) {
                $dailyByLocation[$locationName] = [];
            }
            
            foreach ($row['attendances'] as $att) {
                $dailyByLocation[$locationName][] = [
                    'employee' => $row['employee'],
                    'attendance' => $att,
                ];
            }
        }

        // Sort each location's records by date, then employee name
        foreach ($dailyByLocation as &$records) {
            usort($records, function ($a, $b) {
                $dateA = $a['attendance']->tanggal instanceof \Carbon\Carbon ? $a['attendance']->tanggal->format('Y-m-d') : $a['attendance']->tanggal;
                $dateB = $b['attendance']->tanggal instanceof \Carbon\Carbon ? $b['attendance']->tanggal->format('Y-m-d') : $b['attendance']->tanggal;
                $cmp = strcmp($dateA, $dateB);
                if ($cmp !== 0) return $cmp;
                return strcmp($a['employee']->nama, $b['employee']->nama);
            });
        }

        // Build per-location summaries from employee data
        $dataByLocation = collect($data)->groupBy(function ($row) {
            return $row['employee']->workLocation->name ?? 'Tanpa Lokasi';
        });

        $locationSummaries = [];
        foreach ($dataByLocation as $locName => $locEmployees) {
            $locationSummaries[$locName] = [
                'total_employees' => $locEmployees->count(),
                'total_days' => $locEmployees->sum(fn($r) => $r['summary']['total_days']),
                'hadir' => $locEmployees->sum(fn($r) => $r['summary']['hadir']),
                'sakit' => $locEmployees->sum(fn($r) => $r['summary']['sakit']),
                'izin' => $locEmployees->sum(fn($r) => $r['summary']['izin']),
                'cuti' => $locEmployees->sum(fn($r) => $r['summary']['cuti']),
                'alpha' => $locEmployees->sum(fn($r) => $r['summary']['alpha']),
                'libur' => $locEmployees->sum(fn($r) => $r['summary']['libur']),
                'off' => $locEmployees->sum(fn($r) => $r['summary']['off']),
                'late' => $locEmployees->sum(fn($r) => $r['summary']['late']),
                'overtime_mins' => $locEmployees->sum(fn($r) => $r['summary']['overtime_mins']),
            ];
        }

        $pdf = Pdf::loadView('pdf.attendance_recap', [
            'dailyByLocation' => $dailyByLocation,
            'locationSummaries' => $locationSummaries,
            'tanggalStart' => $tanggalStart,
            'tanggalEnd' => $tanggalEnd,
        ])->setPaper('A4', 'landscape');

        return $pdf->download('Rekap_Absensi_Harian_' . date('Ymd_His') . '.pdf');
    }

    /**
     * Common logic to prepare attendance data for reports.
     * Hardens robustness by filling gaps (alpha/libur/off) consistently.
     */
    private function prepareAttendanceData($employees, $start, $end)
    {
        $tanggalStart = Carbon::parse($start);
        $tanggalEnd = Carbon::parse($end);
        
        $holidays = Holiday::whereBetween('date', [$start, $end])->pluck('name', 'date');
        $allLeaves = LeaveRequest::with('leaveType')
            ->where('status', 'approved')
            ->where(function ($q) use ($start, $end) {
                $q->whereBetween('tanggal_mulai', [$start, $end])
                  ->orWhereBetween('tanggal_selesai', [$start, $end]);
            })
            ->get();

        $allAttendances = Attendance::whereIn('employee_id', $employees->pluck('id'))
            ->whereDate('tanggal', '>=', $start)
            ->whereDate('tanggal', '<=', $end)
            ->get()
            ->groupBy(fn($a) => $a->employee_id);

        $data = [];
        $processedEmployeeIds = [];
        
        foreach ($employees as $employee) {
            $empId = (string)$employee->id;
            if (in_array($empId, $processedEmployeeIds)) continue;
            $processedEmployeeIds[] = $empId;
            
            // Group by date, but keep ALL records (to support double shifts)
            $empAttendances = $allAttendances->get($employee->id, collect())->groupBy(function ($item) {
                $date = $item->tanggal instanceof \Carbon\Carbon ? $item->tanggal : Carbon::parse($item->tanggal);
                return $date->format('Y-m-d');
            });

            $filledAttendances = [];
            
            $current = $tanggalStart->copy();
            while ($current <= $tanggalEnd) {
                $dateStr = $current->format('Y-m-d');
                
                if ($empAttendances->has($dateStr)) {
                    foreach ($empAttendances->get($dateStr) as $att) {
                        $filledAttendances[] = $att;
                    }
                } else {
                    $status = $this->attendanceService->determineStatus($current, $employee);
                    $att = new Attendance([
                        'tanggal' => $dateStr,
                        'status' => $status,
                        'is_holiday' => $status === 'libur',
                        'notes' => $status === 'libur' ? $holidays->get($dateStr) : '',
                        'employee_id' => $employee->id,
                        'jam_masuk' => $employee->shifts->first()?->jam_masuk,
                        'jam_pulang' => $employee->shifts->first()?->jam_pulang,
                        'shift_name' => $employee->shifts->first()?->name,
                    ]);
                    $att->setRelation('employee', $employee);
                    $filledAttendances[] = $att;
                }
                $current->addDay();
            }

            $filledAttendances = collect($filledAttendances);
            $data[] = [
                'employee' => $employee,
                'attendances' => $filledAttendances,
                'summary' => [
                    'hadir' => $filledAttendances->where('status', 'hadir')->count(),
                    'sakit' => $filledAttendances->where('status', 'sakit')->count(),
                    'izin' => $filledAttendances->where('status', 'izin')->count(),
                    'cuti' => $filledAttendances->where('status', 'cuti')->count(),
                    'alpha' => $filledAttendances->where('status', 'alpha')->count(),
                    'libur' => $filledAttendances->where('status', 'libur')->count(),
                    'off' => $filledAttendances->where('status', 'off')->count(),
                    'late' => $filledAttendances->where('is_late', true)->count(),
                    'overtime_mins' => $filledAttendances->sum('verified_lembur_minutes'),
                    'total_days' => $filledAttendances->count(),
                ]
            ];
        }

        return $data;
    }
}
