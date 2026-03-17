<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Position;
use App\Models\User;
use App\Models\Shift;
use App\Models\WorkLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\EmployeeExport;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $employees = Employee::with(['department', 'position', 'workLocation'])
            ->when($request->search, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                      ->orWhere('nik', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->department_id, fn($q, $v) => $q->where('department_id', $v))
            ->when($request->work_location_id, fn($q, $v) => $q->where('work_location_id', $v))
            ->when($request->lokasi_kerja, fn($q, $v) => $q->where('lokasi_kerja', $v))
            ->when($request->status_kepegawaian, fn($q, $v) => $q->where('status_kepegawaian', $v))
            ->when($request->is_active !== null && $request->is_active !== '', function ($q) use ($request) {
                $q->where('is_active', $request->boolean('is_active'));
            })
            ->orderBy('nama')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('employees/index', [
            'employees' => $employees,
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'workLocations' => WorkLocation::orderBy('name')->get(['id', 'name']),
            'lokasiKerjaList' => Employee::whereNotNull('lokasi_kerja')->where('lokasi_kerja', '!=', '')->distinct()->pluck('lokasi_kerja'),
            'filters' => $request->only('search', 'department_id', 'status_kepegawaian', 'is_active', 'work_location_id', 'lokasi_kerja'),
        ]);
    }
    public function export(Request $request)
    {
        return Excel::download(new EmployeeExport($request->all()), 'data_karyawan_'.date('Ymd').'.xlsx');
    }

    public function create()
    {
        return Inertia::render('employees/form', [
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'positions' => Position::with('department')->orderBy('name')->get(['id', 'name', 'department_id', 'grade']),
            'workLocations' => WorkLocation::orderBy('name')->get(['id', 'name', 'code']),
            'shifts' => Shift::orderBy('name')->get(['id', 'name', 'jam_masuk', 'jam_pulang']),
            'lokasiKerjaList' => Employee::whereNotNull('lokasi_kerja')->where('lokasi_kerja', '!=', '')->distinct()->pluck('lokasi_kerja'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateEmployee($request);

        DB::transaction(function () use ($validated, $request) {
            // Handle file uploads
            $validated = $this->handleFileUploads($request, $validated);

            // Auto-generate NIK: EMP-(company code)-(seq)-(YYDDMM)
            $validated['nik'] = $this->generateNik($validated['work_location_id'], $validated['hire_date']);

            // Determine role from position
            $position = Position::find($validated['position_id']);
            $department = Department::find($validated['department_id']);
            $role = $this->determineRole($position, $department);

            // Create user account
            $user = User::create([
                'name' => $validated['nama'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $role,
            ]);

            $validated['user_id'] = $user->id;

            Employee::create($validated);
        });

        return redirect()->route('employees.index')
            ->with('success', 'Karyawan berhasil ditambahkan.');
    }

    public function show(Employee $employee)
    {
        $employee->load(['department', 'position', 'workLocation', 'user']);

        return Inertia::render('employees/show', [
            'employee' => $employee,
        ]);
    }

    public function edit(Employee $employee)
    {
        return Inertia::render('employees/form', [
            'employee' => $employee,
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'positions' => Position::with('department')->orderBy('name')->get(['id', 'name', 'department_id', 'grade']),
            'workLocations' => WorkLocation::orderBy('name')->get(['id', 'name', 'code']),
            'shifts' => Shift::orderBy('name')->get(['id', 'name', 'jam_masuk', 'jam_pulang']),
            'lokasiKerjaList' => Employee::whereNotNull('lokasi_kerja')->where('lokasi_kerja', '!=', '')->distinct()->pluck('lokasi_kerja'),
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $this->validateEmployee($request, $employee->id);

        DB::transaction(function () use ($validated, $request, $employee) {
            $validated = $this->handleFileUploads($request, $validated);

            // Update user role if position changed
            $position = Position::find($validated['position_id']);
            $department = Department::find($validated['department_id']);
            $role = $this->determineRole($position, $department);

            if ($employee->user) {
                $userData = [
                    'name' => $validated['nama'],
                    'email' => $validated['email'],
                    'role' => $role,
                ];

                if (!empty($validated['password'])) {
                    $userData['password'] = Hash::make($validated['password']);
                }

                $employee->user->update($userData);
            }

            $employee->update($validated);
        });

        return redirect()->route('employees.index')
            ->with('success', 'Data karyawan berhasil diperbarui.');
    }

    public function destroy(Employee $employee)
    {
        DB::transaction(function () use ($employee) {
            // Deactivate instead of delete
            $employee->update(['is_active' => false, 'end_date' => now()]);

            if ($employee->user) {
                $employee->user->update(['role' => 'staff']);
            }
        });

        return redirect()->route('employees.index')
            ->with('success', 'Karyawan berhasil dinonaktifkan.');
    }

    // === Private Helpers ===

    private function validateEmployee(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            // Data Pribadi
            'nama' => 'required|string|max:255',
            'tempat_lahir' => 'nullable|string|max:255',
            'tanggal_lahir' => 'nullable|date',
            'alamat_tetap' => 'nullable|string',
            'alamat_sekarang' => 'nullable|string',
            'email' => 'required|email|max:255',
            'password' => $ignoreId ? 'nullable|string|min:8' : 'required|string|min:8',
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
            'department_id' => 'required|exists:departments,id',
            'position_id' => 'required|exists:positions,id',
            'work_location_id' => 'required|exists:work_locations,id',
            'shift_id' => 'nullable|exists:shifts,id',
            'status_kepegawaian' => 'required|in:tetap,kontrak,probation,magang',
            'lokasi_kerja' => 'nullable|string|max:255',
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
            // Deductions
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
        ]);
    }

    private function handleFileUploads(Request $request, array $validated): array
    {
        $fileFields = ['photo', 'file_ktp', 'file_npwp', 'file_kk', 'file_ijazah'];

        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                $validated[$field] = $request->file($field)->store("employees/{$field}", 'public');
            } else {
                unset($validated[$field]);
            }
        }

        if ($request->hasFile('file_lainnya')) {
            $paths = [];
            foreach ($request->file('file_lainnya') as $file) {
                $paths[] = $file->store('employees/lainnya', 'public');
            }
            $validated['file_lainnya'] = $paths;
        } else {
            unset($validated['file_lainnya']);
        }

        return $validated;
    }

    private function determineRole(Position $position, Department $department): string
    {
        // HR Manager grade = admin
        if ($position->grade === 'manager' && $department->code === 'HR') {
            return 'admin';
        }

        return $position->grade; // staff, supervisor, or manager
    }

    private function generateNik(int $workLocationId, string $hireDate): string
    {
        $company = WorkLocation::findOrFail($workLocationId);
        $companyCode = strtoupper($company->code);

        // Count existing employees in this company + 1
        $seq = Employee::where('work_location_id', $workLocationId)->count() + 1;
        $seqFormatted = str_pad($seq, 3, '0', STR_PAD_LEFT);

        // Format hire date as YYDDMM
        $date = \Carbon\Carbon::parse($hireDate);
        $dateFormatted = $date->format('y') . $date->format('d') . $date->format('m');

        return "EMP-{$companyCode}-{$seqFormatted}-{$dateFormatted}";
    }
}
