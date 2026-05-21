<?php

namespace App\Http\Controllers;

use App\Models\Paklaring;
use App\Models\Employee;
use App\Models\WorkLocation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class PaklaringController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('paklaring.view')) {
            return redirect()->route('dashboard')->withErrors(['error' => 'No permission.']);
        }

        $query = Paklaring::with(['employee', 'maker', 'company'])
            ->when($request->search, function ($q, $search) {
                $q->where('letter_number', 'like', "%{$search}%")
                  ->orWhereHas('employee', function($q) use ($search) {
                      $q->where('nama', 'like', "%{$search}%");
                  });
            })
            ->orderBy('created_at', 'desc');

        return Inertia::render('paklarings/index', [
            'paklarings' => $query->paginate(15),
            'filters' => $request->only('search')
        ]);
    }

    public function create(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('paklaring.create')) {
            return redirect()->route('hr-forms.index', ['tab' => 'paklaring'])->withErrors(['error' => 'No permission.']);
        }

        return Inertia::render('paklarings/form', [
            'employees' => Employee::select('id', 'nama', 'nik')->orderBy('nama')->get(),
            'companies' => WorkLocation::select('id', 'name', 'code')->orderBy('name')->get()
        ]);
    }

    public function store(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('paklaring.create')) {
            return redirect()->back()->withErrors(['error' => 'No permission.']);
        }

        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'company_id' => 'required|exists:work_locations,id',
            'work_location_text' => 'required|string',
            'from_date' => 'required|date',
            'to_date' => 'required|date|after_or_equal:from_date',
            'reason_for_leaving' => 'required|string',
        ]);

        $maker = $request->user()->employee;
        if (!$maker) {
            return redirect()->back()->withErrors(['error' => 'Maker must be an employee.']);
        }
        if (!$maker->signature) {
            return redirect()->back()->withErrors(['error' => 'Maker must have a signature configured.']);
        }

        $company = WorkLocation::findOrFail($validated['company_id']);
        
        // Generate letter number: e.g. PKL-COMPANY.HRD-LOC-001-XII-2025
        $monthRomawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
        $month = now()->month;
        $romawi = $monthRomawi[$month - 1];
        $year = now()->year;
        
        $companyCode = strtoupper($company->code ?? 'BBB');
        $locationCode = 'HO'; // Or generate from work_location_text if needed, but 'HO' is standard per SKB
        
        // Count for this year
        $count = Paklaring::whereYear('date', $year)->count() + 1;
        $formattedCount = str_pad($count, 3, '0', STR_PAD_LEFT);
        $letterNumber = "PKL-{$companyCode}.HRD-{$locationCode}-{$formattedCount}-{$romawi}-{$year}";

        Paklaring::create(array_merge($validated, [
            'letter_number' => $letterNumber,
            'date' => now(),
            'maker_id' => $maker->id,
        ]));

        return redirect()->route('hr-forms.index', ['tab' => 'paklaring'])->with('success', 'Paklaring created successfully.');
    }

    public function edit(Request $request, Paklaring $paklaring)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('paklaring.edit')) {
            return redirect()->route('hr-forms.index', ['tab' => 'paklaring'])->withErrors(['error' => 'No permission.']);
        }

        return Inertia::render('paklarings/form', [
            'paklaring' => $paklaring,
            'employees' => Employee::select('id', 'nama', 'nik')->orderBy('nama')->get(),
            'companies' => WorkLocation::select('id', 'name', 'code')->orderBy('name')->get()
        ]);
    }

    public function update(Request $request, Paklaring $paklaring)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('paklaring.edit')) {
            return redirect()->back()->withErrors(['error' => 'No permission.']);
        }

        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'company_id' => 'required|exists:work_locations,id',
            'work_location_text' => 'required|string',
            'from_date' => 'required|date',
            'to_date' => 'required|date|after_or_equal:from_date',
            'reason_for_leaving' => 'required|string',
        ]);

        $paklaring->update($validated);

        return redirect()->route('hr-forms.index', ['tab' => 'paklaring'])->with('success', 'Paklaring updated successfully.');
    }

    public function destroy(Request $request, Paklaring $paklaring)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('paklaring.delete')) {
            return redirect()->back()->withErrors(['error' => 'No permission.']);
        }

        $paklaring->delete();

        return redirect()->back()->with('success', 'Paklaring deleted.');
    }

    public function downloadPdf(Request $request, Paklaring $paklaring)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('paklaring.view')) {
            return redirect()->back()->withErrors(['error' => 'No permission.']);
        }

        $paklaring->load(['employee.workLocation', 'employee.position', 'maker.position', 'company']);

        $pdf = Pdf::loadView('pdfs.paklaring-letter', ['paklaring' => $paklaring]);
        
        $safeFilename = str_replace('/', '-', $paklaring->letter_number);
        
        return $pdf->download("Paklaring_{$safeFilename}.pdf");
    }
}
