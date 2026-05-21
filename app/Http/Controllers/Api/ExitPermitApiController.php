<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\ExitPermit;
use App\Notifications\ExitPermitNotification;
use Illuminate\Http\Request;

class ExitPermitApiController extends Controller
{
    /**
     * List exit permits.
     * GET /api/exit-permits
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();

        if (!$employee) {
            return response()->json(['message' => 'Akun tidak terhubung dengan data karyawan.'], 404);
        }

        $query = ExitPermit::with(['employee.department', 'employee.position'])->latest();

        if ($user->role === 'admin' || $user->hasPermission('exit_permit.view_others')) {
            // Admin or user with special permission sees all
        } elseif (in_array($user->role, ['manager', 'supervisor'])) {
            $query->whereHas('employee', function ($q) use ($employee) {
                $q->where('department_id', $employee->department_id);
            });
        } else {
            $query->where('employee_id', $employee->id);
        }

        $exitPermits = $query->get()->map(fn($ep) => [
            'id' => $ep->id,
            'employee_name' => $ep->employee?->nama,
            'employee_nik' => $ep->employee?->nik,
            'department' => $ep->employee?->department?->name,
            'position' => $ep->employee?->position?->name,
            'tanggal' => $ep->tanggal?->format('Y-m-d'),
            'jam_mulai' => $ep->jam_mulai,
            'jam_berakhir' => $ep->jam_berakhir,
            'keperluan' => $ep->keperluan,
            'created_at' => $ep->created_at?->toIso8601String(),
        ]);

        return response()->json(['exit_permits' => $exitPermits]);
    }

    /**
     * Create exit permit.
     * POST /api/exit-permits
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();

        if (!$employee) {
            return response()->json(['message' => 'Akun tidak terhubung dengan data karyawan.'], 404);
        }

        $validated = $request->validate([
            'jam_mulai' => 'required',
            'jam_berakhir' => 'required',
            'keperluan' => 'required|string|max:1000',
        ]);

        $exitPermit = ExitPermit::create([
            'employee_id' => $employee->id,
            'tanggal' => now()->toDateString(),
            'jam_mulai' => $validated['jam_mulai'],
            'jam_berakhir' => $validated['jam_berakhir'],
            'keperluan' => $validated['keperluan'],
        ]);

        // Notify Supervisor
        $supervisor = $employee->reportTo;
        if ($supervisor && $supervisor->user) {
            $supervisor->user->notify(new ExitPermitNotification($exitPermit));
        }

        return response()->json([
            'message' => 'Form keluar berhasil dikirim.',
            'exit_permit' => $exitPermit,
        ], 201);
    }
}
