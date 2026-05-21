<?php

namespace App\Http\Controllers\CostControl;

use App\Http\Controllers\Controller;
use App\Models\BudgetItem;
use App\Models\WorkingLocation;
use App\Models\MaterialServiceRequestItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class SummaryBudgetingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $workingLocationId = $request->input('working_location_id');
        $workingLocations = WorkingLocation::orderBy('name')->get(['id', 'name']);
        
        $summary = [];
        if ($workingLocationId) {
            $summary = BudgetItem::where('working_location_id', $workingLocationId)
                ->select([
                    'budget_items.*',
                    DB::raw("(SELECT SUM(total_price) FROM material_service_request_items 
                              JOIN material_service_requests ON material_service_requests.id = material_service_request_items.msr_id 
                              WHERE material_service_request_items.budget_item_id = budget_items.id 
                              AND material_service_requests.status = 'approved'
                              AND material_service_request_items.category = 'Material') as nilai_msr_material"),
                    DB::raw("(SELECT SUM(total_price) FROM material_service_request_items 
                              JOIN material_service_requests ON material_service_requests.id = material_service_request_items.msr_id 
                              WHERE material_service_request_items.budget_item_id = budget_items.id 
                              AND material_service_requests.status = 'approved'
                              AND material_service_request_items.category = 'Jasa') as nilai_msr_jasa"),
                    DB::raw("(SELECT SUM(qty) FROM material_service_request_items 
                              JOIN material_service_requests ON material_service_requests.id = material_service_request_items.msr_id 
                              WHERE material_service_request_items.budget_item_id = budget_items.id 
                              AND material_service_requests.status = 'approved') as total_qty_msr")
                ])
                ->get();

            // Perform final calculations in collection for readability or stay in SQL if needed
            $summary->transform(function($item) {
                $item->nilai_msr_material = $item->nilai_msr_material ?? 0;
                $item->nilai_msr_jasa = $item->nilai_msr_jasa ?? 0;
                $item->total_qty_msr = $item->total_qty_msr ?? 0;
                
                $item->sisa_budget_material = $item->nilai_budget_material - $item->nilai_msr_material;
                $item->sisa_budget_jasa = $item->nilai_budget_jasa - $item->nilai_msr_jasa;
                
                $item->qty_material_terpakai = $item->total_qty_msr * ($item->conversion_unit ?: 1);
                $item->sisa_qty_budget = $item->qty_budget - $item->qty_material_terpakai;
                
                return $item;
            });
        }

        return Inertia::render('cost-control/summary/index', [
            'workingLocations' => $workingLocations,
            'summary' => $summary,
            'selectedLocationId' => $workingLocationId ? (int)$workingLocationId : null,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(BudgetItem $budgetItem)
    {
        $budgetItem->load(['workingLocation']);
        
        $msrItems = MaterialServiceRequestItem::with(['msr.requestedBy'])
            ->where('budget_item_id', $budgetItem->id)
            ->whereHas('msr', function($q) {
                $q->where('status', 'approved');
            })
            ->get();

        return Inertia::render('cost-control/summary/show', [
            'budgetItem' => $budgetItem,
            'msrItems' => $msrItems
        ]);
    }

    /**
     * Download PDF report.
     */
    public function downloadPdf(WorkingLocation $workingLocation)
    {
        $summary = BudgetItem::where('working_location_id', $workingLocation->id)
            ->select([
                'budget_items.*',
                DB::raw("(SELECT SUM(total_price) FROM material_service_request_items 
                          JOIN material_service_requests ON material_service_requests.id = material_service_request_items.msr_id 
                          WHERE material_service_request_items.budget_item_id = budget_items.id 
                          AND material_service_requests.status = 'approved'
                          AND material_service_request_items.category = 'Material') as nilai_msr_material"),
                DB::raw("(SELECT SUM(total_price) FROM material_service_request_items 
                          JOIN material_service_requests ON material_service_requests.id = material_service_request_items.msr_id 
                          WHERE material_service_request_items.budget_item_id = budget_items.id 
                          AND material_service_requests.status = 'approved'
                          AND material_service_request_items.category = 'Jasa') as nilai_msr_jasa"),
                DB::raw("(SELECT SUM(qty) FROM material_service_request_items 
                          JOIN material_service_requests ON material_service_requests.id = material_service_request_items.msr_id 
                          WHERE material_service_request_items.budget_item_id = budget_items.id 
                          AND material_service_requests.status = 'approved') as total_qty_msr")
            ])
            ->get();

        $summary->transform(function($item) {
            $item->nilai_msr_material = $item->nilai_msr_material ?? 0;
            $item->nilai_msr_jasa = $item->nilai_msr_jasa ?? 0;
            $item->total_qty_msr = $item->total_qty_msr ?? 0;
            $item->qty_material_terpakai = $item->total_qty_msr * ($item->conversion_unit ?: 1);
            return $item;
        });

        $pdf = Pdf::loadView('pdfs.budget-summary', [
            'workingLocation' => $workingLocation,
            'summary' => $summary,
            'generatedAt' => now()->format('d M Y H:i')
        ]);

        $pdf->setPaper('a4', 'landscape');
        
        return $pdf->download("Budget_Summary_{$workingLocation->name}.pdf");
    }
}
