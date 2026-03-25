<?php

namespace App\Http\Controllers;

use App\Models\WorkLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class WorkLocationController extends Controller
{
    public function index(Request $request)
    {
        if (!auth()->user()->isAdmin() && !auth()->user()->hasPermission('location.manage')) {
            abort(403);
        }
        $locations = WorkLocation::withCount('employees')
            ->when($request->search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('work-locations/index', [
            'locations' => $locations,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        if (!auth()->user()->isAdmin() && !auth()->user()->hasPermission('location.manage')) {
            abort(403);
        }
        return Inertia::render('work-locations/form');
    }

    public function store(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('location.manage')) {
            abort(403);
        }
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:work_locations,code',
            'address' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
            'header_image' => 'nullable|image|max:2048',
            'payroll_cutoff_date' => 'nullable|integer|min:1|max:31',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('company_logos', 'public');
        }

        if ($request->hasFile('header_image')) {
            $validated['header_image'] = $request->file('header_image')->store('company_headers', 'public');
        }

        WorkLocation::create($validated);

        return redirect()->route('work-locations.index')
            ->with('success', 'Perusahaan berhasil ditambahkan.');
    }

    public function edit(WorkLocation $workLocation)
    {
        if (!auth()->user()->isAdmin() && !auth()->user()->hasPermission('location.manage')) {
            abort(403);
        }
        return Inertia::render('work-locations/form', [
            'location' => $workLocation,
        ]);
    }

    public function update(Request $request, WorkLocation $workLocation)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('location.manage')) {
            abort(403);
        }
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:work_locations,code,' . $workLocation->id,
            'address' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
            'header_image' => 'nullable|image|max:2048',
            'payroll_cutoff_date' => 'nullable|integer|min:1|max:31',
        ]);

        if ($request->hasFile('logo')) {
            if ($workLocation->logo) {
                Storage::disk('public')->delete($workLocation->logo);
            }
            $validated['logo'] = $request->file('logo')->store('company_logos', 'public');
        }

        if ($request->hasFile('header_image')) {
            if ($workLocation->header_image) {
                Storage::disk('public')->delete($workLocation->header_image);
            }
            $validated['header_image'] = $request->file('header_image')->store('company_headers', 'public');
        }

        $workLocation->update($validated);

        return redirect()->route('work-locations.index')
            ->with('success', 'Perusahaan berhasil diperbarui.');
    }

    public function destroy(WorkLocation $workLocation)
    {
        if (!auth()->user()->isAdmin() && !auth()->user()->hasPermission('location.manage')) {
            abort(403);
        }
        if ($workLocation->employees()->exists()) {
            return back()->with('error', 'Perusahaan tidak bisa dihapus karena masih memiliki karyawan.');
        }

        if ($workLocation->logo) {
            Storage::disk('public')->delete($workLocation->logo);
        }

        if ($workLocation->header_image) {
            Storage::disk('public')->delete($workLocation->header_image);
        }

        $workLocation->delete();

        return redirect()->route('work-locations.index')
            ->with('success', 'Perusahaan berhasil dihapus.');
    }
}
