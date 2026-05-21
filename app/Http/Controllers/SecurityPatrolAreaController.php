<?php

namespace App\Http\Controllers;

use App\Models\SecurityPatrolArea;
use App\Models\WorkingLocation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SecurityPatrolAreaController extends Controller
{
    public function index()
    {
        if (!auth()->user()->hasPermission('security_report.manage_settings')) {
            abort(403);
        }

        $workingLocations = WorkingLocation::with(['securityPatrolAreas' => function($q) {
            $q->orderBy('sequence');
        }])->get();

        return Inertia::render('security/areas/index', [
            'workingLocations' => $workingLocations,
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasPermission('security_report.manage_settings')) abort(403);

        $request->validate([
            'working_location_id' => 'required|exists:working_locations,id',
            'name' => 'required|string|max:255',
            'sequence' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        SecurityPatrolArea::create($request->all());

        return back()->with('success', 'Area added successfully.');
    }

    public function update(Request $request, SecurityPatrolArea $patrol_area)
    {
        if (!auth()->user()->hasPermission('security_report.manage_settings')) abort(403);

        $request->validate([
            'name' => 'required|string|max:255',
            'sequence' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $patrol_area->update($request->all());

        return back()->with('success', 'Area updated successfully.');
    }

    public function destroy(SecurityPatrolArea $patrol_area)
    {
        if (!auth()->user()->hasPermission('security_report.manage_settings')) abort(403);

        $patrol_area->delete();

        return back()->with('success', 'Area deleted successfully.');
    }
}
