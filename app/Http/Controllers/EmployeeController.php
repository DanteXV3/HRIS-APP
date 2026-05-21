<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Position;
use App\Models\Shift;
use App\Models\WorkLocation;
use App\Models\WorkingLocation;
use App\Models\Permission;
use App\Http\Requests\EmployeeStoreRequest;
use App\Http\Requests\EmployeeUpdateRequest;
use App\Services\EmployeeService;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\EmployeeExport;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    use AuthorizesRequests;

    protected $employeeService;

    public function __construct(EmployeeService $employeeService)
    {
        $this->employeeService = $employeeService;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', Employee::class);

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
        $this->authorize('viewAny', Employee::class);
        return Excel::download(new EmployeeExport($request->all()), 'data_karyawan_'.date('Ymd').'.xlsx');
    }

    public function create()
    {
        $this->authorize('create', Employee::class);
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

    public function store(EmployeeStoreRequest $request)
    {
        $validated = $request->validated();
        $validated = $this->employeeService->handleFileUploads($request, $validated);

        if ($request->filled('signature')) {
            $validated['signature'] = $this->employeeService->handleSignature($request->signature);
        }

        $this->employeeService->createEmployee(
            $validated,
            $request->shift_ids,
            $request->permissions
        );

        return redirect()->route('employees.index')
            ->with('success', 'Karyawan berhasil ditambahkan.');
    }

    public function show(Request $request, Employee $employee)
    {
        $this->authorize('view', $employee);
        $employee->load(['department', 'position', 'workLocation', 'user']);

        return Inertia::render('employees/show', [
            'employee' => $employee,
        ]);
    }

    public function edit(Employee $employee)
    {
        $this->authorize('update', $employee);
        return Inertia::render('employees/form', [
            'employee' => $employee,
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'positions' => Position::with('department')->orderBy('name')->get(['id', 'name', 'department_id', 'grade']),
            'workLocations' => WorkLocation::orderBy('name')->get(['id', 'name', 'code']),
            'workingLocations' => WorkingLocation::orderBy('name')->get(['id', 'name']),
            'shifts' => Shift::orderBy('name')->get(['id', 'name', 'jam_masuk', 'jam_pulang']),
            'permissions' => Permission::orderBy('module')->orderBy('name')->get(),
            'userPermissions' => $employee->user ? $employee->user->permissions->pluck('id') : [],
            'employeeShiftIds' => $employee->shifts->pluck('id'),
            'allEmployees' => Employee::where('id', '!=', $employee->id)->orderBy('nama')->get(['id', 'nama', 'nik']),
        ]);
    }

    public function update(EmployeeUpdateRequest $request, Employee $employee)
    {
        $validated = $request->validated();
        $validated = $this->employeeService->handleFileUploads($request, $validated);

        if ($request->filled('signature') && str_starts_with($request->signature, 'data:image')) {
            $validated['signature'] = $this->employeeService->handleSignature($request->signature, $employee);
        }

        $this->employeeService->updateEmployee(
            $employee,
            $validated,
            $request->shift_ids,
            $request->permissions
        );

        return redirect()->route('employees.index')
            ->with('success', 'Data karyawan berhasil diperbarui.');
    }

    public function destroy(Employee $employee)
    {
        $this->authorize('delete', $employee);
        
        \Illuminate\Support\Facades\DB::transaction(function () use ($employee) {
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
        $employee = Employee::with(['department', 'position', 'workLocation', 'user', 'shifts'])
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
            'no_ktp' => 'nullable|string|max:20',
            'npwp' => 'nullable|string|max:30',
            'no_bpjs_ketenagakerjaan' => 'nullable|string|max:30',
            'no_bpjs_kesehatan' => 'nullable|string|max:30',
            'nama_bank' => 'nullable|string|max:100',
            'cabang_bank' => 'nullable|string|max:100',
            'no_rekening' => 'nullable|string|max:30',
            'nama_rekening' => 'nullable|string|max:255',
            'nama_kontak_darurat_1' => 'nullable|string|max:255',
            'no_kontak_darurat_1' => 'nullable|string|max:20',
            'nama_kontak_darurat_2' => 'nullable|string|max:255',
            'no_kontak_darurat_2' => 'nullable|string|max:20',
            'photo' => 'nullable|image|max:2048',
            'file_ktp' => 'nullable|file|max:5120',
            'file_npwp' => 'nullable|file|max:5120',
            'file_kk' => 'nullable|file|max:5120',
            'file_ijazah' => 'nullable|file|max:5120',
            'file_lainnya.*' => 'nullable|file|max:5120',
            'signature' => 'nullable|string',
        ]);

        $validated = $this->employeeService->handleFileUploads($request, $validated);

        if ($request->filled('signature') && str_starts_with($request->signature, 'data:image')) {
            $validated['signature'] = $this->employeeService->handleSignature($request->signature, $employee);
        }

        $this->employeeService->updateEmployee($employee, $validated);

        return redirect()->back()
            ->with('success', 'Profil Anda berhasil diperbarui.');
    }

    public function updateSignature(Request $request, ?Employee $employee = null)
    {
        if (!$employee || !$employee->exists) {
            $employee = Employee::where('user_id', $request->user()->id)->firstOrFail();
        } else {
            $this->authorize('update', $employee);
        }

        $request->validate(['signature' => 'required|string']);
        $path = $this->employeeService->handleSignature($request->signature, $employee);
        $employee->update(['signature' => $path]);

        return redirect()->back()->with('success', 'Tanda tangan berhasil diperbarui.');
    }

    public function updateFaceDescriptor(Request $request)
    {
        $employee = $request->user()->employee;
        if (!$employee) {
            return response()->json(['success' => false, 'message' => 'Data karyawan tidak ditemukan.'], 404);
        }

        $request->validate(['descriptor' => 'required|string']);

        $newDescriptor = json_decode($request->descriptor, true);
        if (!is_array($newDescriptor) || count($newDescriptor) !== 128) {
            return response()->json(['success' => false, 'message' => 'Format data wajah tidak valid.'], 422);
        }

        // Check for duplicate faces against all other active employees
        $existingEmployees = Employee::whereNotNull('face_descriptor')
            ->where('id', '!=', $employee->id)
            ->where('is_active', true)
            ->get(['id', 'nama', 'nik', 'face_descriptor']);

        foreach ($existingEmployees as $existing) {
            $storedDescriptor = is_array($existing->face_descriptor)
                ? $existing->face_descriptor
                : json_decode($existing->face_descriptor, true);
            if (!is_array($storedDescriptor) || count($storedDescriptor) !== 128) continue;

            $distance = $this->euclideanDistance($newDescriptor, $storedDescriptor);
            if ($distance < 0.35) {
                return response()->json([
                    'success' => false,
                    'duplicate' => true,
                    'message' => "Wajah ini terlalu mirip dengan karyawan {$existing->nama} ({$existing->nik}). Tidak dapat mendaftarkan wajah yang sama.",
                ], 422);
            }
        }

        // Also check against daily workers
        $existingDailyWorkers = \App\Models\DailyWorker::whereNotNull('face_descriptor')
            ->where('is_active', true)
            ->get(['id', 'nama', 'face_descriptor']);

        foreach ($existingDailyWorkers as $dw) {
            $storedDescriptor = is_array($dw->face_descriptor)
                ? $dw->face_descriptor
                : json_decode($dw->face_descriptor, true);
            if (!is_array($storedDescriptor) || count($storedDescriptor) !== 128) continue;

            $distance = $this->euclideanDistance($newDescriptor, $storedDescriptor);
            if ($distance < 0.35) {
                return response()->json([
                    'success' => false,
                    'duplicate' => true,
                    'message' => "Wajah ini terlalu mirip dengan pekerja harian {$dw->nama}. Tidak dapat mendaftarkan wajah yang sama.",
                ], 422);
            }
        }

        $employee->update(['face_descriptor' => $request->descriptor]);

        return response()->json(['success' => true, 'message' => 'Wajah berhasil didaftarkan.']);
    }

    private function euclideanDistance(array $v1, array $v2): float
    {
        $sum = 0;
        $count = min(count($v1), count($v2));
        for ($i = 0; $i < $count; $i++) {
            $sum += ($v1[$i] - $v2[$i]) ** 2;
        }
        return sqrt($sum);
    }
}
