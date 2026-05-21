<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\Attendance;
use Carbon\Carbon;
use App\Services\AttendanceService;

class FaceAttendanceController extends Controller
{
    protected $attendanceService;

    public function __construct(AttendanceService $attendanceService)
    {
        $this->attendanceService = $attendanceService;
    }

    /**
     * API to verify and clock in/out automatically via button click.
     */
    public function verify(Request $request)
    {
        $user = $request->user();
        $employee = $user->employee ?? null;

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Data karyawan tidak ditemukan untuk akun Anda.'
            ], 404);
        }

        $employee->load(['shifts', 'workingLocation', 'workLocation']);

        // FACE REGISTRATION CHECK — no face = no attendance
        if (!$employee->face_descriptor) {
            return response()->json([
                'success' => false,
                'face_not_registered' => true,
                'message' => 'Anda belum mendaftarkan wajah. Silakan daftarkan wajah di halaman Profil terlebih dahulu.'
            ], 422);
        }

        $coords = $request->only(['latitude', 'longitude']);
        $now = $this->attendanceService->now($employee, $coords);
        $today = $now->format('Y-m-d');

        // GEOFENCING CHECK
        $geo = $this->attendanceService->verifyGeofence($employee, $coords);
        if (!$geo['success']) {
            if (!$request->remark) {
                return response()->json([
                    'success' => false,
                    'outside_radius' => true,
                    'distance' => $geo['distance'],
                    'radius' => $geo['radius'],
                    'message' => $geo['message'] . " Silahkan berikan keterangan/catatan."
                ], 400);
            }
        }
        $distance = $geo['distance'] ?? null;

        // Find "Open" attendance record
        $attendance = $this->attendanceService->findOpenAttendance($employee);
        
        // Find most suitable shift context
        $shiftContext = $this->attendanceService->findTargetShift($employee, $now);
        $selectedShift = $shiftContext['shift'];
        $shiftTanggal = $shiftContext['tanggal'];

        // If no open record, check if they already finished THIS specific shift day
        if (!$attendance) {
            $alreadyFinished = Attendance::where('employee_id', $employee->id)
                ->whereDate('tanggal', $shiftTanggal)
                ->whereNotNull('clock_out')
                ->exists();
            
            if ($alreadyFinished) {
                return response()->json([
                    'success' => false,
                    'name' => $employee->nama,
                    'action' => 'already_finished',
                    'message' => 'Maaf ' . $employee->nama . ', Anda sudah melakukan presensi untuk jadwal tanggal ' . Carbon::parse($shiftTanggal)->format('d/m/Y') . '.'
                ], 422);
            }
        }

        // SCENARIO 1: No open record -> Clock In
        if (!$attendance) {
            // We use the shift's intended date as reference for metrics context
            $contextTime = Carbon::parse($shiftTanggal . ' ' . $now->format('H:i:s'), $this->attendanceService->getEmployeeTimezone($employee, $coords));
            $metrics = $this->attendanceService->calculateMetrics($employee, $contextTime, $selectedShift);

            Attendance::create([
                'employee_id' => $employee->id,
                'tanggal' => $shiftTanggal,
                'clock_in' => $now->format('Y-m-d H:i:s'),
                'jam_masuk' => $selectedShift?->jam_masuk,
                'jam_pulang' => $selectedShift?->jam_pulang,
                'shift_name' => $selectedShift?->name,
                'shift_id' => $selectedShift?->id,
                'early_in_minutes' => $metrics['early_in_minutes'],
                'late_in_minutes' => $metrics['late_in_minutes'],
                'is_late' => $metrics['late_in_minutes'] > 0,
                'late_minutes' => $metrics['late_in_minutes'],
                'status' => 'hadir',
                'is_holiday' => false,
                'verified_lembur_minutes' => 0,
                'clock_in_lat' => $request->latitude,
                'clock_in_lng' => $request->longitude,
                'notes' => $request->remark ? '[LUAR RADIUS: ' . round($distance) . 'm] ' . $request->remark : null,
            ]);

            return response()->json([
                'success' => true,
                'name' => $employee->nama,
                'action' => 'clock_in',
                'message' => 'Selamat bekerja, ' . $employee->nama . '!'
            ]);
        }

        // SCENARIO 2: Clock Out
        if ($attendance && !$attendance->clock_out) {
            $timezone = $this->attendanceService->getEmployeeTimezone($employee, $coords);
            $clockInTime = Carbon::parse($attendance->clock_in, $timezone);
            if ($now->diffInMinutes($clockInTime, true) < 5) {
                return response()->json([
                    'success' => false,
                    'name' => $employee->nama,
                    'action' => 'too_soon',
                    'message' => 'Anda baru saja melakukan Clock In. Mohon tunggu setidaknya 5 menit sebelum Clock Out.'
                ], 422);
            }

            // Use assigned shift if possible, or fallback to record's shift
            $employeeShift = $employee->shifts->firstWhere('jam_masuk', $attendance->jam_masuk);
            $metrics = $this->attendanceService->calculateMetrics($employee, $now, $employeeShift ?: (object)['jam_masuk' => $attendance->jam_masuk, 'jam_pulang' => $attendance->jam_pulang], true, $attendance);

            $attendance->update([
                'clock_out' => $now->format('Y-m-d H:i:s'),
                'early_out_minutes' => $metrics['early_out_minutes'],
                'late_out_minutes' => $metrics['late_out_minutes'],
                'overtime_minutes' => $metrics['overtime_minutes'],
                'clock_out_lat' => $request->latitude,
                'clock_out_lng' => $request->longitude,
                'notes' => $request->remark ? ($attendance->notes ? $attendance->notes . ' | ' : '') . '[OUT RADIUS: ' . round($distance) . 'm] ' . $request->remark : $attendance->notes,
            ]);

            return response()->json([
                'success' => true,
                'name' => $employee->nama,
                'action' => 'clock_out',
                'message' => 'Hati-hati di jalan, ' . $employee->nama . '!'
            ]);
        }

        return response()->json([
            'success' => false,
            'name' => $employee->nama,
            'action' => 'error',
            'message' => 'Terjadi kesalahan sistem presensi.'
        ], 500);
    }

    /**
     * Render public face attendance kiosk page.
     */
    public function kiosk()
    {
        return \Inertia\Inertia::render('face-attendance');
    }

    /**
     * Get all registered face descriptors for public kiosk matching.
     */
    public function getDescriptors()
    {
        $employees = Employee::whereNotNull('face_descriptor')
            ->where('is_active', true)
            ->get(['id', 'nama', 'nik', 'face_descriptor']);

        $data = $employees->map(fn($e) => [
            'id' => $e->id,
            'nama' => $e->nama,
            'nik' => $e->nik,
            'descriptor' => json_decode($e->face_descriptor),
        ]);

        return response()->json($data);
    }

    /**
     * Public attendance via face recognition (no auth required).
     */
    public function publicVerify(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $employee = Employee::with(['shifts', 'workingLocation', 'workLocation'])->findOrFail($request->employee_id);

        // Safety: ensure the matched employee actually has a registered face
        if (!$employee->face_descriptor) {
            return response()->json([
                'success' => false,
                'message' => 'Data wajah karyawan tidak terdaftar.'
            ], 422);
        }

        $coords = $request->only(['latitude', 'longitude']);
        $now = $this->attendanceService->now($employee, $coords);
        $today = $now->format('Y-m-d');

        // GEOFENCING CHECK
        $geo = $this->attendanceService->verifyGeofence($employee, $coords);
        if (!$geo['success']) {
            if (!$request->remark) {
                return response()->json([
                    'success' => false,
                    'outside_radius' => true,
                    'distance' => $geo['distance'],
                    'radius' => $geo['radius'],
                    'message' => $geo['message'] . " Silahkan berikan keterangan."
                ], 400);
            }
        }
        $distance = $geo['distance'] ?? null;

        // Find Open attendance record
        $attendance = $this->attendanceService->findOpenAttendance($employee);
        
        // Find most suitable shift context
        $shiftContext = $this->attendanceService->findTargetShift($employee, $now);
        $selectedShift = $shiftContext['shift'];
        $shiftTanggal = $shiftContext['tanggal'];

        if (!$attendance) {
            $alreadyFinished = Attendance::where('employee_id', $employee->id)
                ->whereDate('tanggal', $shiftTanggal)
                ->whereNotNull('clock_out')
                ->exists();
            
            if ($alreadyFinished) {
                return response()->json([
                    'success' => false,
                    'name' => $employee->nama,
                    'action' => 'already_finished',
                    'message' => 'Maaf ' . $employee->nama . ', Anda sudah melakukan presensi untuk jadwal tanggal ' . Carbon::parse($shiftTanggal)->format('d/m/Y') . '.'
                ], 422);
            }
        }

        // SCENARIO 1: Clock In
        if (!$attendance) {
            // We use the shift's intended date as reference for metrics context
            $contextTime = Carbon::parse($shiftTanggal . ' ' . $now->format('H:i:s'), $this->attendanceService->getEmployeeTimezone($employee, $coords));
            $metrics = $this->attendanceService->calculateMetrics($employee, $contextTime, $selectedShift);

            Attendance::create([
                'employee_id' => $employee->id,
                'tanggal' => $shiftTanggal,
                'clock_in' => $now->format('Y-m-d H:i:s'),
                'jam_masuk' => $selectedShift?->jam_masuk,
                'jam_pulang' => $selectedShift?->jam_pulang,
                'shift_name' => $selectedShift?->name,
                'shift_id' => $selectedShift?->id,
                'early_in_minutes' => $metrics['early_in_minutes'],
                'late_in_minutes' => $metrics['late_in_minutes'],
                'is_late' => $metrics['late_in_minutes'] > 0,
                'late_minutes' => $metrics['late_in_minutes'],
                'status' => 'hadir',
                'is_holiday' => false,
                'verified_lembur_minutes' => 0,
                'clock_in_lat' => $request->latitude,
                'clock_in_lng' => $request->longitude,
                'notes' => $request->remark ? '[LUAR RADIUS: ' . round($distance) . 'm] ' . $request->remark . ' (Face Kiosk)' : 'Face Kiosk',
            ]);

            return response()->json([
                'success' => true,
                'name' => $employee->nama,
                'action' => 'clock_in',
                'time' => $now->format('H:i:s'),
                'message' => 'Clock In berhasil! Selamat bekerja, ' . $employee->nama . '!'
            ]);
        }

        // SCENARIO 2: Clock Out
        if ($attendance && !$attendance->clock_out) {
            $timezone = $this->attendanceService->getEmployeeTimezone($employee, $coords);
            $clockInTime = Carbon::parse($attendance->clock_in, $timezone);
            if ($now->diffInMinutes($clockInTime, true) < 5) {
                return response()->json([
                    'success' => false,
                    'name' => $employee->nama,
                    'action' => 'too_soon',
                    'message' => 'Anda baru saja melakukan Clock In. Mohon tunggu setidaknya 5 menit sebelum Clock Out.'
                ], 422);
            }

            $employeeShift = $employee->shifts->firstWhere('jam_masuk', $attendance->jam_masuk);
            $metrics = $this->attendanceService->calculateMetrics($employee, $now, $employeeShift ?: (object)['jam_masuk' => $attendance->jam_masuk, 'jam_pulang' => $attendance->jam_pulang], true, $attendance);

            $attendance->update([
                'clock_out' => $now->format('Y-m-d H:i:s'),
                'early_out_minutes' => $metrics['early_out_minutes'],
                'late_out_minutes' => $metrics['late_out_minutes'],
                'overtime_minutes' => $metrics['overtime_minutes'],
                'clock_out_lat' => $request->latitude,
                'clock_out_lng' => $request->longitude,
                'notes' => $request->remark ? ($attendance->notes ? $attendance->notes . ' | ' : '') . '[OUT RADIUS: ' . round($distance) . 'm] ' . $request->remark : $attendance->notes,
            ]);

            return response()->json([
                'success' => true,
                'name' => $employee->nama,
                'action' => 'clock_out',
                'time' => $now->format('H:i:s'),
                'message' => 'Clock Out berhasil! Hati-hati di jalan, ' . $employee->nama . '!'
            ]);
        }

        return response()->json([
            'success' => false,
            'name' => $employee->nama,
            'action' => 'error',
            'message' => 'Terjadi kesalahan presensi.'
        ], 500);
    }
}
