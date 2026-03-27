<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Position;
use App\Models\User;
use App\Models\Shift;
use App\Models\WorkLocation;
use App\Models\WorkingLocation;
use App\Models\Permission;
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
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('employee.view')) {
            abort(403);
        }
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
            ->when($request->working_location_id, fn($q, $v) => $q->where('working_location_id', $v))
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
            'workLocations' => WorkLocation::all(),
            'workingLocations' => WorkingLocation::all(),
            'filters' => $request->only('search', 'department_id', 'status_kepegawaian', 'is_active', 'work_location_id', 'working_location_id'),
        ]);
    }
    public function export(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('employee.view')) {
            abort(403);
        }
        return Excel::download(new EmployeeExport($request->all()), 'data_karyawan_'.date('Ymd').'.xlsx');
    }

    public function create()
    {
        if (!auth()->user()->isAdmin() && !auth()->user()->hasPermission('employee.create')) {
            abort(403);
        }
        return Inertia::render('employees/form', [
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'positions' => Position::with('department')->orderBy('name')->get(['id', 'name', 'department_id', 'grade']),
            'workLocations' => WorkLocation::orderBy('name')->get(['id', 'name', 'code']),
            'workingLocations' => WorkingLocation::orderBy('name')->get(['id', 'name']),
            'shifts' => Shift::orderBy('name')->get(['id', 'name', 'jam_masuk', 'jam_pulang']),
            'permissions' => Permission::orderBy('module')->orderBy('name')->get(),
            'allEmployees' => Employee::orderBy('nama')->get(['id', 'nama', 'nik']),
        ]);
    }

    public function store(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('employee.create')) {
            abort(403);
        }
        $validated = $this->validateEmployee($request);

        DB::transaction(function () use ($validated, $request) {
            // Handle file uploads
            $validated = $this->handleFileUploads($request, $validated);

            // Handle signature if provided
            if ($request->filled('signature') && str_starts_with($request->signature, 'data:image')) {
                $base64 = $request->signature;
                $image = str_replace('data:image/png;base64,', '', $base64);
                $image = str_replace(' ', '+', $image);
                $imageName = 'signature_new_' . time() . '.png';
                Storage::disk('public')->put('signatures/' . $imageName, base64_decode($image));
                $validated['signature'] = 'signatures/' . $imageName;
            }

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

            // Sync permissions
            if ($request->has('permissions')) {
                $user->permissions()->sync($request->permissions);
            }
        });

        return redirect()->route('employees.index')
            ->with('success', 'Karyawan berhasil ditambahkan.');
    }

    public function show(Request $request, Employee $employee)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('employee.view')) {
            // Also allow if viewing self?
            if ($request->user()->employee?->id !== $employee->id) {
                abort(403);
            }
        }
        $employee->load(['department', 'position', 'workLocation', 'user']);

        return Inertia::render('employees/show', [
            'employee' => $employee,
        ]);
    }

    public function edit(Employee $employee)
    {
        if (!auth()->user()->isAdmin() && !auth()->user()->hasPermission('employee.edit')) {
            abort(403);
        }
        return Inertia::render('employees/form', [
            'employee' => $employee,
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'positions' => Position::with('department')->orderBy('name')->get(['id', 'name', 'department_id', 'grade']),
            'workLocations' => WorkLocation::orderBy('name')->get(['id', 'name', 'code']),
            'workingLocations' => WorkingLocation::orderBy('name')->get(['id', 'name']),
            'shifts' => Shift::orderBy('name')->get(['id', 'name', 'jam_masuk', 'jam_pulang']),
            'permissions' => Permission::orderBy('module')->orderBy('name')->get(),
            'userPermissions' => $employee->user ? $employee->user->permissions->pluck('id') : [],
            'allEmployees' => Employee::where('id', '!=', $employee->id)->orderBy('nama')->get(['id', 'nama', 'nik']),
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('employee.edit')) {
            abort(403);
        }
        $validated = $this->validateEmployee($request, $employee->id);

        DB::transaction(function () use ($validated, $request, $employee) {
            $validated = $this->handleFileUploads($request, $validated);

            // Handle signature if provided
            if ($request->filled('signature') && str_starts_with($request->signature, 'data:image')) {
                $base64 = $request->signature;
                $image = str_replace('data:image/png;base64,', '', $base64);
                $image = str_replace(' ', '+', $image);
                $imageName = 'signature_' . ($employee->id ?? 'new') . '_' . time() . '.png';
                Storage::disk('public')->put('signatures/' . $imageName, base64_decode($image));
                if ($employee && $employee->signature) {
                    Storage::disk('public')->delete($employee->signature);
                }
                $validated['signature'] = 'signatures/' . $imageName;
            }

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

            // Sync permissions
            if ($employee->user && $request->has('permissions')) {
                $employee->user->permissions()->sync($request->permissions);
            }
        });

        return redirect()->route('employees.index')
            ->with('success', 'Data karyawan berhasil diperbarui.');
    }

    public function destroy(Employee $employee)
    {
        if (!auth()->user()->isAdmin() && !auth()->user()->hasPermission('employee.edit')) {
            abort(403);
        }
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

    public function me(Request $request)
    {
        $employee = Employee::with(['department', 'position', 'workLocation', 'user', 'shift'])
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$employee) {
            return redirect()->route('dashboard')
                ->with('error', 'Profil karyawan belum terdaftar. Hubungi administrator.');
        }

        return Inertia::render('profile/edit', [
            'employee' => $employee,
        ]);
    }

    public function updateMe(Request $request)
    {
        $employee = Employee::where('user_id', $request->user()->id)->firstOrFail();

        $validated = $request->validate([
            // Data Pribadi
            'nama' => 'required|string|max:255',
            'tempat_lahir' => 'nullable|string|max:255',
            'tanggal_lahir' => 'nullable|date',
            'alamat_tetap' => 'nullable|string',
            'alamat_sekarang' => 'nullable|string',
            'email' => 'required|email|max:255|unique:users,email,' . $request->user()->id,
            'password' => 'nullable|string|min:8|confirmed',
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
            // Files
            'photo' => 'nullable|image|max:2048',
            'file_ktp' => 'nullable|file|max:5120',
            'file_npwp' => 'nullable|file|max:5120',
            'file_kk' => 'nullable|file|max:5120',
            'file_ijazah' => 'nullable|file|max:5120',
            'file_lainnya.*' => 'nullable|file|max:5120',
            'signature' => 'nullable|string', // Support saving along with main form
        ]);

        DB::transaction(function () use ($validated, $request, $employee) {
            $validated = $this->handleFileUploads($request, $validated);

            // Handle signature if provided as base64
            if (!empty($validated['signature']) && str_starts_with($validated['signature'], 'data:image')) {
                $base64 = $validated['signature'];
                $image = str_replace(['data:image/png;base64,', 'data:image/jpeg;base64,', ' '], ['', '', '+'], $base64);
                $imageName = 'signature_' . $employee->id . '_' . time() . '.png';
                
                if (!Storage::disk('public')->exists('signatures')) {
                    Storage::disk('public')->makeDirectory('signatures');
                }
                
                Storage::disk('public')->put('signatures/' . $imageName, base64_decode($image));
                
                if ($employee->signature) {
                    Storage::disk('public')->delete($employee->signature);
                }
                $validated['signature'] = 'signatures/' . $imageName;
            } else {
                unset($validated['signature']);
            }

            if ($employee->user) {
                $userData = [
                    'name' => $validated['nama'],
                    'email' => $validated['email'],
                ];

                if (!empty($validated['password'])) {
                    $userData['password'] = Hash::make($validated['password']);
                }

                $employee->user->update($userData);
            }

            $employee->update($validated);
        });

        return redirect()->back()
            ->with('success', 'Profil Anda berhasil diperbarui.');
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
            'report_to' => 'nullable|exists:employees,id',
            'department_id' => 'required|exists:departments,id',
            'position_id' => 'required|exists:positions,id',
            'work_location_id' => 'required|exists:work_locations,id',
            'working_location_id' => 'nullable|exists:working_locations,id',
            'shift_id' => 'nullable|exists:shifts,id',
            'status_kepegawaian' => 'required|in:tetap,kontrak,probation,magang',
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
            'dashboard_config' => 'nullable|array',
            // Files
            'photo' => 'nullable|image|max:2048',
            'file_ktp' => 'nullable|file|max:5120',
            'file_npwp' => 'nullable|file|max:5120',
            'file_kk' => 'nullable|file|max:5120',
            'file_ijazah' => 'nullable|file|max:5120',
            'file_lainnya.*' => 'nullable|file|max:5120',
            'signature' => 'nullable|string',
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
    public function updateSignature(Request $request, ?Employee $employee = null)
    {
        if (!$employee || !$employee->exists) {
            $employee = Employee::where('user_id', $request->user()->id)->firstOrFail();
        } else {
            // Check if admin/hr
            if (!$request->user()->isAdmin() && !$request->user()->hasPermission('employee.edit')) {
                abort(403);
            }
        }

        $request->validate([
            'signature' => 'required|string', // base64
        ]);

        $base64 = $request->signature;
        $image = str_replace(['data:image/png;base64,', 'data:image/jpeg;base64,', ' '], ['', '', '+'], $base64);
        $imageName = 'signature_' . $employee->id . '_' . time() . '.png';
        
        if (!Storage::disk('public')->exists('signatures')) {
            Storage::disk('public')->makeDirectory('signatures');
        }

        Storage::disk('public')->put('signatures/' . $imageName, base64_decode($image));
        
        // Delete old signature if exists
        if ($employee->signature) {
            Storage::disk('public')->delete($employee->signature);
        }

        $employee->update(['signature' => 'signatures/' . $imageName]);

        return redirect()->back()->with('success', 'Tanda tangan berhasil diperbarui.');
    }

    public function updateFaceDescriptor(Request $request)
    {
        $employee = $request->user()->employee;
        if (!$employee) {
            return response()->json(['success' => false, 'message' => 'Data karyawan tidak ditemukan.'], 404);
        }

        $request->validate([
            'descriptor' => 'required|string',
        ]);

        $employee->update([
            'face_descriptor' => $request->descriptor
        ]);

        return response()->json(['success' => true, 'message' => 'Wajah berhasil didaftarkan.']);
    }
}
