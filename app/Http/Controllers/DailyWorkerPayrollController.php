<?php

namespace App\Http\Controllers;

use App\Models\DailyWorkerPayroll;
use App\Models\DailyWorkerPayrollItem;
use App\Models\WorkingLocation;
use App\Services\DailyWorkerService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DailyWorkerPayrollController extends Controller
{
    protected $payrollService;

    public function __construct(DailyWorkerService $payrollService)
    {
        $this->payrollService = $payrollService;
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        if (!$user->hasPermission('daily_worker_payroll.manage_local') && !$user->hasPermission('daily_worker_payroll.manage_all')) {
            abort(403);
        }

        $query = DailyWorkerPayroll::with(['workingLocation', 'processor']);

        if (!$user->hasPermission('daily_worker_payroll.manage_all')) {
            $myLocationId = $user->employee?->working_location_id;
            $query->where('working_location_id', $myLocationId);
        }

        $payrolls = $query->latest('periode_end')->paginate(15)->withQueryString();

        return Inertia::render('daily-workers/payroll/index', [
            'payrolls' => $payrolls,
            'workingLocations' => WorkingLocation::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'working_location_id' => 'required|exists:working_locations,id',
            'periode_start' => 'required|date',
            'periode_end' => 'required|date|after_or_equal:periode_start',
            'calc_bpjs_tk' => 'boolean',
            'calc_bpjs_ks' => 'boolean',
            'calc_pph21' => 'boolean',
        ]);

        $payroll = DailyWorkerPayroll::create([
            'working_location_id' => $request->working_location_id,
            'periode_start' => $request->periode_start,
            'periode_end' => $request->periode_end,
            'calc_bpjs_tk' => $request->calc_bpjs_tk,
            'calc_bpjs_ks' => $request->calc_bpjs_ks,
            'calc_pph21' => $request->calc_pph21,
            'processed_by' => auth()->id(),
            'status' => 'draft',
        ]);

        $this->payrollService->generatePayroll($payroll);

        return redirect()->route('daily-worker-payrolls.show', $payroll->id)->with('success', 'Payroll draft generated.');
    }

    public function show(DailyWorkerPayroll $payroll)
    {
        $payroll->load(['items.dailyWorker', 'workingLocation', 'processor']);
        
        return Inertia::render('daily-workers/payroll/show', [
            'payroll' => $payroll,
        ]);
    }

    public function finalize(DailyWorkerPayroll $payroll)
    {
        $payroll->update(['status' => 'finalized']);
        return redirect()->back()->with('success', 'Payroll finalized.');
    }

    public function destroy(DailyWorkerPayroll $payroll)
    {
        $user = auth()->user();
        if (!$user->hasPermission('daily_worker_payroll.manage_all')) {
            if ($user->employee?->working_location_id !== $payroll->working_location_id) {
                abort(403);
            }
        }

        if ($payroll->status === 'finalized') {
            return redirect()->back()->with('error', 'Cannot delete finalized payroll.');
        }

        // Explicitly delete items just in case DB cascade fails
        $payroll->items()->delete();
        $payroll->delete();

        return redirect()->route('daily-worker-payrolls.index')->with('success', 'Payroll draft deleted.');
    }

    public function exportPdf(DailyWorkerPayroll $payroll)
    {
        $payroll->load(['workingLocation', 'items', 'processor']);
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.daily_worker_payroll', compact('payroll'))->setPaper('a4', 'landscape');
        return $pdf->download('Payroll_DW_' . ($payroll->workingLocation->name ?? 'Unknown') . '_' . $payroll->periode_start->format('Ymd') . '.pdf');
    }
}
