<?php

namespace App\Http\Controllers;

use App\Models\WorkingLocation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkingLocationController extends Controller
{
    public function index(Request $request)
    {
        if (!auth()->user()->isAdmin() && !auth()->user()->hasPermission('working_location.view')) {
            abort(403);
        }

        $locations = WorkingLocation::withCount('employees')
            ->when($request->search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('working-locations/index', [
            'locations' => $locations,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        if (!auth()->user()->isAdmin() && !auth()->user()->hasPermission('working_location.manage')) {
            abort(403);
        }
        return Inertia::render('working-locations/form');
    }

    public function store(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('working_location.manage')) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'radius' => 'required|integer|min:1',
        ]);

        WorkingLocation::create($validated);

        return redirect()->route('working-locations.index')
            ->with('success', 'Lokasi Kerja berhasil ditambahkan.');
    }

    public function edit(WorkingLocation $workingLocation)
    {
        if (!auth()->user()->isAdmin() && !auth()->user()->hasPermission('working_location.manage')) {
            abort(403);
        }
        return Inertia::render('working-locations/form', [
            'location' => $workingLocation,
        ]);
    }

    public function update(Request $request, WorkingLocation $workingLocation)
    {
        if (!auth()->user()->isAdmin() && !auth()->user()->hasPermission('location.manage')) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'radius' => 'required|integer|min:1',
        ]);

        $workingLocation->update($validated);

        return redirect()->route('working-locations.index')
            ->with('success', 'Lokasi Kerja berhasil diperbarui.');
    }

    public function destroy(WorkingLocation $workingLocation)
    {
        if (!auth()->user()->isAdmin() && !auth()->user()->hasPermission('location.manage')) {
            abort(403);
        }

        if ($workingLocation->employees()->exists()) {
            return back()->with('error', 'Lokasi Kerja tidak bisa dihapus karena masih digunakan oleh karyawan.');
        }

        $workingLocation->delete();

        return redirect()->route('working-locations.index')
            ->with('success', 'Lokasi Kerja berhasil dihapus.');
    }
}
