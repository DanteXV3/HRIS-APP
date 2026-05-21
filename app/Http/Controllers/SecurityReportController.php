<?php

namespace App\Http\Controllers;

use App\Models\SecurityReport;
use App\Models\SecurityReportItem;
use App\Models\SecurityPatrolArea;
use App\Models\WorkingLocation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class SecurityReportController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        if (!$user->hasPermission('security_report.view_all') && !$user->hasPermission('security_report.create')) {
            abort(403);
        }

        $query = SecurityReport::with(['creator.employee', 'workingLocation'])
            ->latest('patrol_date');

        if (!$user->hasPermission('security_report.view_all')) {
            $query->where('creator_id', $user->id);
        }

        $reports = $query->paginate(15);
        $workingLocations = WorkingLocation::all();

        return Inertia::render('security/reports/index', [
            'reports' => $reports,
            'workingLocations' => $workingLocations,
            'canCreate' => $user->hasPermission('security_report.create'),
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        if (!$user->hasPermission('security_report.create')) abort(403);

        $request->validate([
            'working_location_id' => 'required|exists:working_locations,id',
            'shift_name' => 'nullable|string',
        ]);

        $existingDraft = SecurityReport::where('creator_id', $user->id)
            ->where('status', 'draft')
            ->first();

        if ($existingDraft) {
            return redirect()->route('security-reports.show', $existingDraft->id)
                ->with('error', 'You have an active draft report. Please complete it first.');
        }

        $areas = SecurityPatrolArea::where('working_location_id', $request->working_location_id)
            ->where('is_active', true)
            ->orderBy('sequence')
            ->get();

        if ($areas->isEmpty()) {
            return back()->with('error', 'No active patrol areas found for this location. Please contact admin.');
        }

        $report = SecurityReport::create([
            'creator_id' => $user->id,
            'working_location_id' => $request->working_location_id,
            'patrol_date' => Carbon::today(),
            'shift_name' => $request->shift_name,
            'status' => 'draft',
        ]);

        foreach ($areas as $area) {
            SecurityReportItem::create([
                'security_report_id' => $report->id,
                'area_name' => $area->name,
            ]);
        }

        return redirect()->route('security-reports.show', $report->id)->with('success', 'Report drafted. Please complete the checklist.');
    }

    public function show(SecurityReport $report)
    {
        $user = auth()->user();
        $isCreator = $report->creator_id === $user->id;
        
        if (!$user->hasPermission('security_report.view_all') && !$isCreator) {
            abort(403);
        }

        $report->load(['items', 'workingLocation', 'creator.employee']);

        return Inertia::render('security/reports/show', [
            'report' => $report,
            'canEdit' => ($isCreator && $report->status === 'draft') || $user->hasPermission('security_report.edit'),
        ]);
    }

    public function updateItem(Request $request, SecurityReport $report, SecurityReportItem $item)
    {
        $user = auth()->user();
        $isCreator = $report->creator_id === $user->id;

        if (!(($isCreator && $report->status === 'draft') || $user->hasPermission('security_report.edit'))) {
            abort(403);
        }

        if ($item->security_report_id !== $report->id) {
            abort(404);
        }

        $request->validate([
            'condition' => 'required|string',
            'notes' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'photo' => 'nullable|image|max:10240',
        ]);

        $data = [
            'condition' => $request->condition,
            'notes' => $request->notes,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'checked_at' => now(),
        ];

        if ($request->hasFile('photo')) {
            if ($item->photo_path) {
                Storage::disk('public')->delete($item->photo_path);
            }
            $data['photo_path'] = $request->file('photo')->store('security_reports', 'public');
        }

        $item->update($data);

        return back()->with('success', 'Area marked as checked.');
    }

    public function finalize(SecurityReport $report)
    {
        $user = auth()->user();
        if ($report->creator_id !== $user->id && !$user->hasPermission('security_report.edit')) {
            abort(403);
        }

        $pendingItems = $report->items()->whereNull('checked_at')->count();

        if ($pendingItems > 0) {
            return back()->with('error', 'Cannot finalize report until all areas are checked.');
        }

        $report->update(['status' => 'final']);

        return redirect()->route('security-reports.index')->with('success', 'Report finalized successfully.');
    }

    public function destroy(SecurityReport $report)
    {
        if (!auth()->user()->hasPermission('security_report.delete')) abort(403);

        foreach($report->items as $item) {
            if ($item->photo_path) Storage::disk('public')->delete($item->photo_path);
        }

        $report->delete();

        return redirect()->route('security-reports.index')->with('success', 'Report deleted.');
    }
}
