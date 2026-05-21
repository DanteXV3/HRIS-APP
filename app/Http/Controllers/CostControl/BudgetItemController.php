<?php

namespace App\Http\Controllers\CostControl;

use App\Http\Controllers\Controller;
use App\Models\BudgetItem;
use App\Models\WorkingLocation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class BudgetItemController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', BudgetItem::class);

        $workingLocationId = $request->input('working_location_id');
        
        $workingLocations = WorkingLocation::orderBy('name')->get(['id', 'name']);
        
        $budgetItems = [];
        if ($workingLocationId) {
            $budgetItems = BudgetItem::where('working_location_id', $workingLocationId)
                ->orderBy('item_code')
                ->get();
        }

        return Inertia::render('cost-control/budget-items/index', [
            'workingLocations' => $workingLocations,
            'budgetItems' => $budgetItems,
            'selectedLocationId' => $workingLocationId ? (int)$workingLocationId : null,
            'can' => [
                'create' => $request->user()->can('create', BudgetItem::class),
                'edit' => $request->user()->can('update', BudgetItem::class),
                'delete' => $request->user()->can('delete', BudgetItem::class),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', BudgetItem::class);

        $validated = $request->validate([
            'working_location_id' => 'required|exists:working_locations,id',
            'item_code' => [
                'required',
                'string',
                Rule::unique('budget_items')->where(function ($query) use ($request) {
                    return $query->where('working_location_id', $request->working_location_id);
                }),
            ],
            'nama_budget' => 'required|string|max:255',
            'budget_unit' => 'required|string|max:50',
            'qty_budget' => 'required|numeric|min:0',
            'nilai_budget_material' => 'required|numeric|min:0',
            'nilai_budget_jasa' => 'required|numeric|min:0',
            'msr_unit' => 'nullable|string|max:50',
            'conversion_unit' => 'required|numeric|min:0',
        ]);

        BudgetItem::create($validated);

        return Redirect::back()->with('success', 'Item budget berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BudgetItem $budgetItem)
    {
        $this->authorize('update', $budgetItem);

        $validated = $request->validate([
            'item_code' => [
                'required',
                'string',
                Rule::unique('budget_items')->where(function ($query) use ($budgetItem) {
                    return $query->where('working_location_id', $budgetItem->working_location_id);
                })->ignore($budgetItem->id),
            ],
            'nama_budget' => 'required|string|max:255',
            'budget_unit' => 'required|string|max:50',
            'qty_budget' => 'required|numeric|min:0',
            'nilai_budget_material' => 'required|numeric|min:0',
            'nilai_budget_jasa' => 'required|numeric|min:0',
            'msr_unit' => 'nullable|string|max:50',
            'conversion_unit' => 'required|numeric|min:0',
        ]);

        $budgetItem->update($validated);

        return Redirect::back()->with('success', 'Item budget berhasil diperbarui.');
    }

    /**
     * Remove the specified resource in storage.
     */
    public function destroy(BudgetItem $budgetItem)
    {
        $this->authorize('delete', $budgetItem);

        $budgetItem->delete();

        return Redirect::back()->with('success', 'Item budget berhasil dihapus.');
    }
}
