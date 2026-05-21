<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Overtime;
use App\Models\WorkingLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OvertimeApiController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();

        if (!$employee) {
            return response()->json(['message' => 'Akun tidak terhubung dengan data karyawan.'], 404);
        }

        $overtimes = Overtime::with(['creator.department', 'employees', 'workingLocation'])
            ->where('creator_id', $employee->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($o) => [
                'id' => $o->id,
                'creator_name' => $o->creator?->nama,
                'department' => $o->creator?->department?->name,
                'tanggal' => $o->tanggal?->format('Y-m-d'),
                'jam_mulai' => $o->jam_mulai,
                'jam_berakhir' => $o->jam_berakhir,
                'durasi' => (float)$o->durasi,
                'lokasi_kerja' => $o->workingLocation?->name ?? $o->lokasi_kerja,
                'keperluan' => $o->keperluan,
                'status' => $o->status,
                'employees' => $o->employees->map(fn($e) => [
                    'id' => $e->id,
                    'nama' => $e->nama,
                ])->values(),
                'created_at' => $o->created_at->toIso8601String(),
            ]);

        return response()->json(['overtimes' => $overtimes]);
    }

    public function formData(Request $request)
    {
        $employees = Employee::select('id', 'nama', 'nik')->orderBy('nama')->get();
        $locations = WorkingLocation::select('id', 'name')->orderBy('name')->get();

        return response()->json([
            'employees' => $employees,
            'working_locations' => $locations,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();

        if (!$employee) {
            return response()->json(['message' => 'Akun tidak terhubung dengan data karyawan.'], 404);
        }

        $validated = $request->validate([
            'tanggal' => 'required|date',
            'jam_mulai' => 'required',
            'jam_berakhir' => 'required',
            'durasi' => 'required|numeric|min:0.5',
            'working_location_id' => 'required|exists:working_locations,id',
            'keperluan' => 'required|string|max:500',
            'employee_ids' => 'required|array|min:1',
            'employee_ids.*' => 'exists:employees,id',
        ]);

        DB::transaction(function () use ($validated, $employee) {
            $overtime = Overtime::create([
                'creator_id' => $employee->id,
                'tanggal' => $validated['tanggal'],
                'jam_mulai' => $validated['jam_mulai'],
                'jam_berakhir' => $validated['jam_berakhir'],
                'durasi' => $validated['durasi'],
                'working_location_id' => $validated['working_location_id'],
                'lokasi_kerja' => WorkingLocation::find($validated['working_location_id'])->name,
                'keperluan' => $validated['keperluan'],
                'status' => 'pending',
                'supervisor_status' => 'pending',
                'manager_status' => 'pending',
            ]);

            $overtime->employees()->sync($validated['employee_ids']);
        });

        return response()->json(['message' => 'Pengajuan lembur berhasil dikirim.'], 201);
    }
}
