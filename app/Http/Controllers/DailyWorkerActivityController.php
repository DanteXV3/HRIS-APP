<?php

namespace App\Http\Controllers;

use App\Models\DailyWorker;
use App\Models\DailyWorkerAttendance;
use App\Models\DailyWorkerActivityReport;
use App\Models\DailyWorkerActivityReportItem;
use App\Models\WorkingLocation;
use App\Models\BudgetItem;
use App\Services\DailyWorkerService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DailyWorkerActivityController extends Controller
{
    protected $dailyWorkerService;

    public function __construct(DailyWorkerService $dailyWorkerService)
    {
        $this->dailyWorkerService = $dailyWorkerService;
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        if (!$user->hasPermission('daily_worker_activity.manage_local') && !$user->hasPermission('daily_worker_activity.manage_all')) {
            abort(403);
        }

        $query = DailyWorkerActivityReport::with(['workingLocation']);

        if (!$user->hasPermission('daily_worker_activity.manage_all')) {
            $myLocationId = $user->employee?->working_location_id;
            $query->where('working_location_id', $myLocationId);
        }

        $reports = $query->latest('tanggal')->paginate(15)->withQueryString();

        return Inertia::render('daily-workers/activities/index', [
            'reports' => $reports,
            'workingLocations' => WorkingLocation::all(),
        ]);
    }

    public function show($id)
    {
        $report = DailyWorkerActivityReport::with(['workingLocation', 'items.dailyWorker', 'items.budgetItem'])
            ->findOrFail($id);

        $user = auth()->user();
        if (!$user->hasPermission('daily_worker_activity.manage_all') && ($user->employee?->working_location_id !== $report->working_location_id)) {
            abort(403);
        }

        if (!$report->is_finalized) {
            $this->dailyWorkerService->syncActivityReportAttendance($report);
            // Completely fresh reload to avoid any caching issues
            $report = DailyWorkerActivityReport::with(['workingLocation', 'items.dailyWorker', 'items.budgetItem'])
                ->findOrFail($id);
        }

        $attendances = \App\Models\DailyWorkerAttendance::whereDate('tanggal', $report->tanggal)
            ->whereIn('daily_worker_id', $report->items->pluck('daily_worker_id'))
            ->get()->keyBy('daily_worker_id');

        foreach ($report->items as $item) {
            $item->verified_lembur_hours = $attendances->has($item->daily_worker_id) 
                ? round($attendances[$item->daily_worker_id]->verified_lembur_minutes / 60, 1) 
                : 0;
        }

        return Inertia::render('daily-workers/activities/show', [
            'report' => $report,
            'budgetItems' => BudgetItem::where('working_location_id', $report->working_location_id)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'working_location_id' => 'required|exists:working_locations,id',
            'tanggal' => 'required|date',
        ]);

        $existing = DailyWorkerActivityReport::where('working_location_id', $request->working_location_id)
            ->whereDate('tanggal', $request->tanggal)
            ->first();

        if ($existing) {
            $this->dailyWorkerService->syncActivityReportAttendance($existing);
            return redirect()->route('daily-worker-activities.show', $existing->id);
        }

        try {
            DB::beginTransaction();

            $report = DailyWorkerActivityReport::create([
                'working_location_id' => $request->working_location_id,
                'tanggal' => $request->tanggal,
                'is_finalized' => false,
            ]);

            // Use the service to populate items correctly
            $this->dailyWorkerService->syncActivityReportAttendance($report);

            DB::commit();
            return redirect()->route('daily-worker-activities.show', $report->id);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function updateItem(Request $request, DailyWorkerActivityReportItem $item)
    {
        $request->validate([
            'budget_item_id' => 'nullable|exists:budget_items,id',
            'aktifitas' => 'nullable|string',
            'status_aktifitas' => 'required|in:continue,done,pending',
            'verified_lembur_hours' => 'nullable|numeric|min:0',
        ]);

        $item->update($request->only('budget_item_id', 'aktifitas', 'status_aktifitas'));

        if ($request->has('verified_lembur_hours')) {
            $item->load('report');
            $att = \App\Models\DailyWorkerAttendance::where('daily_worker_id', $item->daily_worker_id)
                ->whereDate('tanggal', $item->report->tanggal)
                ->first();
            
            if ($att) {
                $att->update([
                    'verified_lembur_minutes' => round($request->verified_lembur_hours * 60),
                ]);
            }
        }

        return redirect()->back()->with('success', 'Line item updated.');
    }

    public function finalize(DailyWorkerActivityReport $report)
    {
        $report->update([
            'is_finalized' => true,
            'finalized_at' => now(),
            'finalized_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Report finalized.');
    }

    public function downloadPdf(DailyWorkerActivityReport $report)
    {
        $report->load(['items.dailyWorker', 'items.budgetItem', 'workingLocation']);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.daily_worker_activity', [
            'report' => $report,
        ]);

        $filename = 'Daily_Worker_Activity_' . $report->workingLocation->name . '_' . $report->tanggal->format('Y-m-d') . '.pdf';
        
        return $pdf->download($filename);
    }
}
