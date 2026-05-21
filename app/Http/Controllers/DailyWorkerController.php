<?php

namespace App\Http\Controllers;

use App\Models\DailyWorker;
use App\Models\Department;
use App\Models\Position;
use App\Models\WorkLocation;
use App\Models\WorkingLocation;
use App\Models\User;
use App\Models\Permission;
use App\Models\Employee;
use App\Services\DailyWorkerService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class DailyWorkerController extends Controller
{
    protected $service;

    public function __construct(DailyWorkerService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        if (!$user->hasPermission('daily_worker.manage_local') && !$user->hasPermission('daily_worker.manage_all')) {
            abort(403);
        }

        $query = DailyWorker::with(['workingLocation', 'department', 'position']);

        if (!$user->hasPermission('daily_worker.manage_all')) {
            $myLocationId = $user->employee?->working_location_id;
            $query->where('working_location_id', $myLocationId);
        }

        $workers = $query->when($request->search, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                      ->orWhere('nik', 'like', "%{$search}%");
                });
            })
            ->when($request->working_location_id, fn($q, $v) => $q->where('working_location_id', $v))
            ->when($request->tipe_dw, fn($q, $v) => $q->where('tipe_dw', $v))
            ->orderBy('nama')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('daily-workers/index', [
            'workers' => $workers,
            'workingLocations' => WorkingLocation::orderBy('name')->get(['id', 'name']),
            'workLocations' => WorkLocation::orderBy('name')->get(['id', 'name']),
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'positions' => Position::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only('search', 'working_location_id', 'tipe_dw'),
        ]);
    }

    public function create()
    {
        $user = auth()->user();
        if (!$user->hasPermission('daily_worker.manage_local') && !$user->hasPermission('daily_worker.manage_all')) {
            abort(403);
        }

        return Inertia::render('daily-workers/form', [
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'positions' => Position::with('department')->orderBy('name')->get(['id', 'name', 'department_id', 'grade']),
            'workingLocations' => WorkingLocation::orderBy('name')->get(['id', 'name']),
            'workLocations' => WorkLocation::orderBy('name')->get(['id', 'name']),
            'permissions' => Permission::orderBy('module')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'nik' => 'nullable|string|unique:daily_workers,nik',
            'email' => 'required|email|unique:daily_workers,email',
            'tipe_dw' => 'required|in:lokal,non lokal',
            'working_location_id' => 'required|exists:working_locations,id',
            'work_location_id' => 'nullable|exists:work_locations,id',
            'gaji_harian' => 'required|numeric',
            'gaji_per_jam' => 'nullable|numeric',
            'hire_date' => 'required|date',
            'status_pernikahan' => 'nullable|string',
            'gender' => 'nullable|in:laki-laki,perempuan',
            'department_id' => 'nullable|exists:departments,id',
            'file_ijazah' => 'nullable|file|max:5120',
            'file_lainnya.*' => 'nullable|file|max:5120',
        ]);

        $validated = $this->service->handleFileUploads($request, $validated);
        $allData = array_merge($request->all(), $validated);

        $this->service->createDailyWorker($allData, $request->permissions);

        return redirect()->route('daily-workers.index')->with('success', 'Daily worker added successfully.');
    }

    public function edit(DailyWorker $dailyWorker)
    {
        $user = auth()->user();
        if (!$user->hasPermission('daily_worker.manage_local') && !$user->hasPermission('daily_worker.manage_all')) {
            abort(403);
        }

        return Inertia::render('daily-workers/form', [
            'dailyWorker' => $dailyWorker,
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'positions' => Position::with('department')->orderBy('name')->get(['id', 'name', 'department_id', 'grade']),
            'workingLocations' => WorkingLocation::orderBy('name')->get(['id', 'name']),
            'workLocations' => WorkLocation::orderBy('name')->get(['id', 'name']),
            'permissions' => Permission::orderBy('module')->orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, DailyWorker $dailyWorker)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'nik' => 'required|string|unique:daily_workers,nik,' . $dailyWorker->id,
            'email' => 'required|email|unique:daily_workers,email,' . $dailyWorker->id,
            'tipe_dw' => 'required|in:lokal,non lokal',
            'working_location_id' => 'required|exists:working_locations,id',
            'work_location_id' => 'nullable|exists:work_locations,id',
            'gaji_harian' => 'required|numeric',
        ]);

        $validated = $this->service->handleFileUploads($request, $validated);
        $allData = array_merge($request->all(), $validated);

        $this->service->updateDailyWorker($dailyWorker, $allData, $request->permissions);

        return redirect()->route('daily-workers.index')->with('success', 'Daily worker updated successfully.');
    }

    public function destroy(DailyWorker $dailyWorker)
    {
        $dailyWorker->delete();
        return redirect()->back()->with('success', 'Daily worker deleted.');
    }

}
