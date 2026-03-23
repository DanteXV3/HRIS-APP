<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\WorkLocation;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\AttendanceExport;

class AttendanceController extends Controller
{
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

        $tanggalStart = $request->input('tanggal_start');
        $tanggalEnd = $request->input('tanggal_end');

        $attendances = Attendance::where('employee_id', $employee->id)
            ->when($tanggalStart, function ($query, $tanggalStart) {
                $query->where('tanggal', '>=', $tanggalStart);
            })
            ->when($tanggalEnd, function ($query, $tanggalEnd) {
                $query->where('tanggal', '<=', $tanggalEnd);
            })
            ->orderBy('tanggal', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('attendances/me', [
            'attendances' => $attendances,
            'filters' => $request->only(['tanggal_start', 'tanggal_end']),
            'employee' => $employee->load('shift'),
        ]);
    }

    public function index(Request $request)
    {
        if (!$request->user()->hasPermission('attendance.view_others')) {
            abort(403);
        }
        $search = $request->input('search');
        $tanggalStart = $request->input('tanggal_start');
        $tanggalEnd = $request->input('tanggal_end');
        $workLocationId = $request->input('work_location_id');

        $attendances = Attendance::with(['employee:id,nama,nik,department_id,position_id,shift_id,work_location_id', 'employee.department', 'employee.position', 'employee.shift', 'employee.workLocation'])
            ->when($search, function ($query, $search) {
                $query->whereHas('employee', function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                      ->orWhere('nik', 'like', "%{$search}%");
                });
            })
            ->when($tanggalStart, function ($query, $tanggalStart) {
                $query->where('tanggal', '>=', $tanggalStart);
            })
            ->when($tanggalEnd, function ($query, $tanggalEnd) {
                $query->where('tanggal', '<=', $tanggalEnd);
            })
            ->when($workLocationId, function ($query, $workLocationId) {
                $query->whereHas('employee', function ($q) use ($workLocationId) {
                    $q->where('work_location_id', $workLocationId);
                });
            })
            ->orderBy('tanggal', 'desc')
            ->paginate(15)
            ->withQueryString();

        $employees = Employee::with('shift')->where('is_active', true)->orderBy('nama')->get(['id', 'nik', 'nama', 'shift_id']);
        $workLocations = WorkLocation::orderBy('name')->get(['id', 'name']);

        return Inertia::render('attendances/index', [
            'attendances' => $attendances,
            'filters' => $request->only(['search', 'tanggal_start', 'tanggal_end', 'work_location_id']),
            'employees' => $employees,
            'workLocations' => $workLocations,
        ]);
    }

    public function export(Request $request)
    {
        if (!$request->user()->hasPermission('attendance.view_others')) {
            abort(403);
        }

        return Excel::download(
            new AttendanceExport($request->only(['search', 'tanggal_start', 'tanggal_end', 'work_location_id'])),
            'data_absensi_' . date('Ymd') . '.xlsx'
        );
    }

    public function import(Request $request)
    {
        if (!$request->user()->hasPermission('attendance.create_others')) {
            abort(403);
        }

        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:5120',
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $handle = fopen($file->path(), 'r');

            $firstLine = fgets($handle);
            $delimiter = strpos($firstLine, ';') !== false ? ';' : ',';
            rewind($handle);

            $header = fgetcsv($handle, 1000, $delimiter);

            // Simple validation of header
            // Expected: NIK, Tanggal (YYYY-MM-DD), Clock In (HH:mm), Clock Out (HH:mm), Status, Overtime (menit)
            $employees = Employee::with('shift')->get()->keyBy('nik');
            
            DB::beginTransaction();
            try {
                $rowNum = 1;
                $importedCount = 0;
                $errors = [];
                while (($data = fgetcsv($handle, 1000, $delimiter)) !== false) {
                    $rowNum++;
                    // Skip empty lines
                    if (!isset($data[0]) || trim($data[0]) === '') continue;

                    $nik = trim($data[0]);
                    $tanggalRaw = trim($data[1] ?? '');
                    $clockInStr = trim($data[2] ?? '');
                    $clockOutStr = trim($data[3] ?? '');
                    $status = trim(strtolower($data[4] ?? 'hadir'));
                    $notes = trim($data[6] ?? '');

                    if (!isset($employees[$nik])) {
                        $errors[] = "Baris {$rowNum}: NIK {$nik} tidak ditemukan.";
                        continue; // Skip unknown NIK
                    }

                    try {
                        $tanggal = Carbon::parse($tanggalRaw)->format('Y-m-d');
                    } catch (\Exception $e) {
                        $errors[] = "Baris {$rowNum}: Format tanggal tidak valid ({$tanggalRaw}).";
                        continue;
                    }

                    $employee = $employees[$nik];
                    $employeeId = $employee->id;
                    $shift = $employee->shift;

                    // Parse datetime safely
                    $clockIn = null;
                    if ($clockInStr !== '') {
                        try { $clockIn = Carbon::parse($tanggal . ' ' . $clockInStr)->format('Y-m-d H:i:s'); } catch (\Exception $e) {}
                    }
                    
                    $clockOut = null;
                    if ($clockOutStr !== '') {
                        try { $clockOut = Carbon::parse($tanggal . ' ' . $clockOutStr)->format('Y-m-d H:i:s'); } catch (\Exception $e) {}
                    }

                    $jamMasuk = $shift ? $shift->jam_masuk : null;
                    $jamPulang = $shift ? $shift->jam_pulang : null;

                    $earlyInMinutes = 0;
                    $lateInMinutes = 0;
                    $earlyOutMinutes = 0;
                    $lateOutMinutes = 0;
                    $overtimeMinutes = (int) trim($data[5] ?? '0');

                    if ($clockIn && $jamMasuk) {
                        $shiftIn = Carbon::parse($tanggal . ' ' . $jamMasuk);
                        $cIn = Carbon::parse($clockIn);
                        if ($cIn->lt($shiftIn)) {
                            $earlyInMinutes = abs(round($shiftIn->diffInMinutes($cIn)));
                        } elseif ($cIn->gt($shiftIn)) {
                            $lateInMinutes = abs(round($cIn->diffInMinutes($shiftIn)));
                        }
                    }

                    if ($clockOut && $jamPulang) {
                        $shiftOut = Carbon::parse($tanggal . ' ' . $jamPulang);
                        $cOut = Carbon::parse($clockOut);
                        if ($cOut->lt($shiftOut)) {
                            $earlyOutMinutes = abs(round($shiftOut->diffInMinutes($cOut)));
                        } elseif ($cOut->gt($shiftOut)) {
                            $lateOutMinutes = abs(round($cOut->diffInMinutes($shiftOut)));
                            // Auto calculate basic overtime as late out if not specified
                            if ($overtimeMinutes === 0) {
                                $overtimeMinutes = $lateOutMinutes;
                            }
                        }
                    }

                    // Strict enum fallback
                    $allowedStatuses = ['hadir', 'izin', 'sakit', 'cuti', 'alpha', 'libur'];
                    if (!in_array($status, $allowedStatuses)) {
                        $status = 'hadir';
                    }

                    Attendance::updateOrCreate(
                        ['employee_id' => $employeeId, 'tanggal' => $tanggal],
                        [
                            'clock_in' => $clockIn,
                            'clock_out' => $clockOut,
                            'jam_masuk' => $jamMasuk,
                            'jam_pulang' => $jamPulang,
                            'early_in_minutes' => $earlyInMinutes,
                            'late_in_minutes' => $lateInMinutes,
                            'is_late' => $lateInMinutes > 0,
                            'late_minutes' => $lateInMinutes,
                            'early_out_minutes' => $earlyOutMinutes,
                            'late_out_minutes' => $lateOutMinutes,
                            'status' => $status,
                            'overtime_minutes' => $overtimeMinutes,
                            'notes' => $notes,
                        ]
                    );
                    $importedCount++;
                }

                DB::commit();
                fclose($handle);

                if (count($errors) > 0) {
                    $errorMsg = "Berhasil import {$importedCount} data, namun ada beberapa error: " . implode(', ', array_slice($errors, 0, 3));
                    if (count($errors) > 3) $errorMsg .= " (dan " . (count($errors) - 3) . " error lainnya).";
                    return redirect()->back()->with('error', $errorMsg);
                }

                return redirect()->back()->with('success', "Berhasil import {$importedCount} data absensi.");

            } catch (\Exception $e) {
                DB::rollBack();
                fclose($handle);
                return redirect()->back()->with('error', "Gagal import pada baris {$rowNum}: " . $e->getMessage());
            }
        }

        return redirect()->back()->with('error', "Gagal membaca file CSV.");
    }

    public function update(Request $request, Attendance $attendance)
    {
        if (!$request->user()->hasPermission('attendance.edit_others')) {
            abort(403);
        }

        $validated = $request->validate([
            'tanggal' => 'required|date',
            'clock_in' => 'nullable|date_format:H:i',
            'clock_out' => 'nullable|date_format:H:i',
            'status' => 'required|in:hadir,izin,sakit,cuti,alpha,libur',
            'is_holiday' => 'required|boolean',
            'verified_lembur_hours' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $employee = Employee::with('shift')->find($attendance->employee_id);
        $shift = $employee->shift;

        $clockIn = $validated['clock_in'] ? Carbon::parse($validated['tanggal'] . ' ' . $validated['clock_in'])->format('Y-m-d H:i:s') : null;
        $clockOut = $validated['clock_out'] ? Carbon::parse($validated['tanggal'] . ' ' . $validated['clock_out'])->format('Y-m-d H:i:s') : null;

        $jamMasuk = $shift ? $shift->jam_masuk : null;
        $jamPulang = $shift ? $shift->jam_pulang : null;

        $earlyInMinutes = 0;
        $lateInMinutes = 0;
        $earlyOutMinutes = 0;
        $lateOutMinutes = 0;
        $overtimeMinutes = 0;

        if ($clockIn && $jamMasuk) {
            $shiftIn = Carbon::parse($validated['tanggal'] . ' ' . $jamMasuk);
            $cIn = Carbon::parse($clockIn);
            if ($cIn->lt($shiftIn)) {
                $earlyInMinutes = abs(round($shiftIn->diffInMinutes($cIn)));
            } elseif ($cIn->gt($shiftIn)) {
                $lateInMinutes = abs(round($cIn->diffInMinutes($shiftIn)));
            }
        }

        if ($clockOut && $jamPulang) {
            $shiftOut = Carbon::parse($validated['tanggal'] . ' ' . $jamPulang);
            $cOut = Carbon::parse($clockOut);
            if ($cOut->lt($shiftOut)) {
                $earlyOutMinutes = abs(round($shiftOut->diffInMinutes($cOut)));
            } elseif ($cOut->gt($shiftOut)) {
                $lateOutMinutes = abs(round($cOut->diffInMinutes($shiftOut)));
                $overtimeMinutes = $lateOutMinutes;
            }
        }

        $attendance->update([
            'tanggal' => $validated['tanggal'],
            'clock_in' => $clockIn,
            'clock_out' => $clockOut,
            'jam_masuk' => $jamMasuk,
            'jam_pulang' => $jamPulang,
            'early_in_minutes' => $earlyInMinutes,
            'late_in_minutes' => $lateInMinutes,
            'is_late' => $lateInMinutes > 0,
            'late_minutes' => $lateInMinutes,
            'early_out_minutes' => $earlyOutMinutes,
            'late_out_minutes' => $lateOutMinutes,
            'overtime_minutes' => $overtimeMinutes,
            'status' => $validated['status'],
            'is_holiday' => $validated['is_holiday'],
            'verified_lembur_minutes' => round($validated['verified_lembur_hours'] * 60),
            'notes' => $validated['notes'],
        ]);

        return redirect()->back()->with('success', 'Data absensi berhasil diperbarui.');
    }

    public function store(Request $request)
    {
        if (!$request->user()->hasPermission('attendance.create_others')) {
            abort(403);
        }

        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'tanggal' => 'required|date',
            'status' => 'required|in:hadir,izin,sakit,cuti,alpha,libur',
            'clock_in' => 'nullable|date_format:H:i',
            'clock_out' => 'nullable|date_format:H:i',
            'is_holiday' => 'required|boolean',
            'verified_lembur_hours' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $exists = Attendance::where('employee_id', $validated['employee_id'])
            ->where('tanggal', $validated['tanggal'])
            ->exists();

        if ($exists) {
            return redirect()->back()->withErrors(['tanggal' => 'Karyawan ini sudah memiliki data absensi pada tanggal tersebut.']);
        }

        $employee = Employee::with('shift')->findOrFail($validated['employee_id']);
        $shift = $employee->shift;

        $clockIn = $validated['clock_in'] ? Carbon::parse($validated['tanggal'] . ' ' . $validated['clock_in'])->format('Y-m-d H:i:s') : null;
        $clockOut = $validated['clock_out'] ? Carbon::parse($validated['tanggal'] . ' ' . $validated['clock_out'])->format('Y-m-d H:i:s') : null;
        
        $jamMasuk = $shift ? $shift->jam_masuk : null;
        $jamPulang = $shift ? $shift->jam_pulang : null;

        $earlyInMinutes = 0;
        $lateInMinutes = 0;
        $earlyOutMinutes = 0;
        $lateOutMinutes = 0;
        $overtimeMinutes = 0;

        if ($clockIn && $jamMasuk) {
            $shiftIn = Carbon::parse($validated['tanggal'] . ' ' . $jamMasuk);
            $cIn = Carbon::parse($clockIn);
            if ($cIn->lt($shiftIn)) {
                $earlyInMinutes = abs(round($shiftIn->diffInMinutes($cIn)));
            } elseif ($cIn->gt($shiftIn)) {
                $lateInMinutes = abs(round($cIn->diffInMinutes($shiftIn)));
            }
        }

        if ($clockOut && $jamPulang) {
            $shiftOut = Carbon::parse($validated['tanggal'] . ' ' . $jamPulang);
            $cOut = Carbon::parse($clockOut);
            if ($cOut->lt($shiftOut)) {
                $earlyOutMinutes = abs(round($shiftOut->diffInMinutes($cOut)));
            } elseif ($cOut->gt($shiftOut)) {
                $lateOutMinutes = abs(round($cOut->diffInMinutes($shiftOut)));
                $overtimeMinutes = $lateOutMinutes;
            }
        }

        Attendance::updateOrCreate(
            ['employee_id' => $validated['employee_id'], 'tanggal' => $validated['tanggal']],
            [
                'clock_in' => $clockIn,
                'clock_out' => $clockOut,
                'jam_masuk' => $jamMasuk,
                'jam_pulang' => $jamPulang,
                'early_in_minutes' => $earlyInMinutes,
                'late_in_minutes' => $lateInMinutes,
                'is_late' => $lateInMinutes > 0,
                'late_minutes' => $lateInMinutes,
                'early_out_minutes' => $earlyOutMinutes,
                'late_out_minutes' => $lateOutMinutes,
                'status' => $validated['status'],
                'overtime_minutes' => $overtimeMinutes,
                'verified_lembur_minutes' => round($validated['verified_lembur_hours'] * 60),
                'is_holiday' => $validated['is_holiday'],
                'notes' => $validated['notes'],
            ]
        );

        return redirect()->back()->with('success', 'Data absensi manual berhasil ditambahkan.');
    }

    public function destroy(Request $request, Attendance $attendance)
    {
        if (!$request->user()->hasPermission('attendance.edit_others')) { // Or delete_others if we add it
            abort(403);
        }

        $attendance->delete();

        return redirect()->back()->with('success', 'Data absensi berhasil dihapus.');
    }
}
