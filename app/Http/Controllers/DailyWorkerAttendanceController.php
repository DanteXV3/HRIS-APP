<?php

namespace App\Http\Controllers;

use App\Models\DailyWorker;
use App\Models\DailyWorkerAttendance;
use App\Models\WorkingLocation;
use App\Services\DailyWorkerAttendanceService;
use App\Services\DailyWorkerService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DailyWorkerAttendanceController extends Controller
{
    protected $attendanceService;
    protected $dailyWorkerService;

    public function __construct(DailyWorkerAttendanceService $attendanceService, DailyWorkerService $dailyWorkerService)
    {
        $this->attendanceService = $attendanceService;
        $this->dailyWorkerService = $dailyWorkerService;
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        if (!$user->hasPermission('daily_worker_attendance.manage_local') && !$user->hasPermission('daily_worker_attendance.manage_all')) {
            abort(403);
        }

        $query = DailyWorkerAttendance::with(['dailyWorker.workingLocation']);

        if (!$user->hasPermission('daily_worker_attendance.manage_all')) {
            $myLocationId = $user->employee?->working_location_id;
            $query->whereHas('dailyWorker', function($q) use ($myLocationId) {
                $q->where('working_location_id', $myLocationId);
            });
        }

        $attendances = $query->when($request->date, function ($q, $date) {
                $q->whereDate('tanggal', $date);
            }, function ($q) {
                $q->whereDate('tanggal', Carbon::today());
            })
            ->when($request->working_location_id, function ($q, $v) {
                $q->whereHas('dailyWorker', fn($qw) => $qw->where('working_location_id', $v));
            })
            ->latest('tanggal')
            ->paginate(30)
            ->withQueryString();

        return Inertia::render('daily-workers/attendance', [
            'attendances' => $attendances,
            'workingLocations' => WorkingLocation::all(),
            'dailyWorkers' => DailyWorker::where('is_active', true)->orderBy('nama')->get(['id', 'nik', 'nama']),
            'filters' => $request->only('date', 'working_location_id'),
        ]);
    }

    public function import(Request $request)
    {
        $user = auth()->user();
        if (!$user->hasPermission('daily_worker_attendance.manage_local') && !$user->hasPermission('daily_worker_attendance.manage_all')) {
            abort(403);
        }

        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:5120',
        ]);

        $file = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');

        if (!$handle) {
            return redirect()->back()->withErrors(['file' => 'Gagal membaca file CSV.']);
        }

        // Skip header row
        $header = fgetcsv($handle);
        
        $imported = 0;
        $skipped = 0;
        $errors = [];
        $lineNumber = 1;

        $workerCache = [];

        while (($row = fgetcsv($handle)) !== false) {
            $lineNumber++;

            if (empty($row) || count($row) < 2) continue;

            $nik = trim($row[0] ?? '');
            $tanggal = trim($row[1] ?? '');
            $clockInTime = trim($row[2] ?? '');
            $clockOutTime = trim($row[3] ?? '');
            $status = strtolower(trim($row[4] ?? 'hadir'));
            $overtimeMinutes = (int) trim($row[5] ?? '0');
            $notes = trim($row[6] ?? '');

            if (empty($nik) || empty($tanggal)) {
                $errors[] = "Line {$lineNumber}: NIK or Date is empty.";
                $skipped++;
                continue;
            }

            if (!isset($workerCache[$nik])) {
                $workerCache[$nik] = DailyWorker::where('nik', $nik)->first();
            }
            $worker = $workerCache[$nik];

            if (!$worker) {
                $errors[] = "Line {$lineNumber}: Daily Worker with NIK '{$nik}' not found.";
                $skipped++;
                continue;
            }

            try {
                $tanggalParsed = Carbon::parse($tanggal)->format('Y-m-d');
            } catch (\Exception $e) {
                $errors[] = "Line {$lineNumber}: Invalid date format ({$tanggal}).";
                $skipped++;
                continue;
            }

            $timezone = $this->attendanceService->getWorkerTimezone($worker);
            $clockIn = $clockInTime ? Carbon::parse($tanggalParsed . ' ' . $clockInTime, $timezone) : null;
            $clockOut = $clockOutTime ? Carbon::parse($tanggalParsed . ' ' . $clockOutTime, $timezone) : null;

            $shift = (object)['jam_masuk' => '08:00', 'jam_pulang' => '17:00']; // Default base shift
            
            $metricsIn = $clockIn ? $this->attendanceService->calculateMetrics($worker, $clockIn, $shift, false) : [];

            $attendance = DailyWorkerAttendance::updateOrCreate(
                ['daily_worker_id' => $worker->id, 'tanggal' => $tanggalParsed],
                [
                    'clock_in' => $clockIn?->format('Y-m-d H:i:s'),
                    'clock_out' => $clockOut?->format('Y-m-d H:i:s'),
                    'status' => $status,
                    'is_late' => ($metricsIn['late_in_minutes'] ?? 0) > 0,
                    'late_minutes' => $metricsIn['late_in_minutes'] ?? 0,
                    'notes' => $notes,
                ]
            );

            // Auto-sync to activity report
            $this->dailyWorkerService->syncAttendanceToActivityReport($attendance);

            $imported++;
        }

        fclose($handle);

        $message = "Successfully imported {$imported} attendance records.";
        if ($skipped > 0) $message .= " {$skipped} records skipped.";

        return redirect()->back()->with('success', $message)->with('importErrors', $errors);
    }

    public function store(Request $request)
    {
        $request->validate([
            'daily_worker_id' => 'required|exists:daily_workers,id',
            'tanggal' => 'required|date',
            'clock_in' => 'nullable',
            'clock_out' => 'nullable',
            'status' => 'required|in:hadir,izin,sakit,cuti,alpha,libur',
        ]);

        $worker = DailyWorker::findOrFail($request->daily_worker_id);
        $timezone = $this->attendanceService->getWorkerTimezone($worker);
        
        $clockIn = $request->clock_in ? Carbon::parse($request->tanggal . ' ' . $request->clock_in, $timezone) : null;
        $clockOut = $request->clock_out ? Carbon::parse($request->tanggal . ' ' . $request->clock_out, $timezone) : null;

        $shift = (object)['jam_masuk' => '08:00', 'jam_pulang' => '17:00']; // Placeholder or pull from DW settings
        
        $metricsIn = $clockIn ? $this->attendanceService->calculateMetrics($worker, $clockIn, $shift, false) : [];
        $metricsOut = $clockOut ? $this->attendanceService->calculateMetrics($worker, $clockOut, $shift, true) : [];

        $attendance = DailyWorkerAttendance::updateOrCreate(
            ['daily_worker_id' => $request->daily_worker_id, 'tanggal' => $request->tanggal],
            [
                'clock_in' => $clockIn?->format('Y-m-d H:i:s'),
                'clock_out' => $clockOut?->format('Y-m-d H:i:s'),
                'status' => $request->status,
                'is_late' => ($metricsIn['late_in_minutes'] ?? 0) > 0,
                'late_minutes' => $metricsIn['late_in_minutes'] ?? 0,
                'notes' => $request->notes,
            ]
        );

        // Auto-sync to activity report
        $this->dailyWorkerService->syncAttendanceToActivityReport($attendance);

        return redirect()->back()->with('success', 'Attendance record saved.');
    }

    public function exportPdf(Request $request)
    {
        $user = auth()->user();
        $date = $request->date ?: Carbon::today()->format('Y-m-d');
        $locationId = $request->working_location_id;

        $query = DailyWorkerAttendance::with(['dailyWorker.workingLocation'])
            ->whereDate('tanggal', $date);

        if ($locationId) {
            $query->whereHas('dailyWorker', fn($q) => $q->where('working_location_id', $locationId));
        }

        if (!$user->hasPermission('daily_worker_attendance.manage_all')) {
            $myLocationId = $user->employee?->working_location_id;
            $query->whereHas('dailyWorker', function($q) use ($myLocationId) {
                $q->where('working_location_id', $myLocationId);
            });
        }

        $attendances = $query->get();
        $locationName = $locationId ? WorkingLocation::find($locationId)?->name : 'Semua Lokasi';

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.daily_worker_attendance', [
            'attendances' => $attendances,
            'date' => $date,
            'locationName' => $locationName,
        ]);

        $filename = 'Attendance_DW_' . str_replace(' ', '_', $locationName) . '_' . $date . '.pdf';
        
        return $pdf->download($filename);
    }
}
