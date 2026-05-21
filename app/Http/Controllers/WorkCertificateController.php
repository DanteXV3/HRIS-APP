<?php

namespace App\Http\Controllers;

use App\Models\WorkCertificate;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;

class WorkCertificateController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('skb.view')) {
            return redirect()->route('dashboard')->withErrors(['error' => 'No permission.']);
        }

        $query = WorkCertificate::with(['employee', 'maker'])
            ->when($request->search, function ($q, $search) {
                $q->where('letter_number', 'like', "%{$search}%")
                  ->orWhereHas('employee', function($q) use ($search) {
                      $q->where('nama', 'like', "%{$search}%");
                  });
            })
            ->orderBy('created_at', 'desc');

        return Inertia::render('skb/index', [
            'certificates' => $query->paginate(15),
            'filters' => $request->only('search')
        ]);
    }

    public function create(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('skb.create')) {
            return redirect()->route('hr-forms.index', ['tab' => 'skb'])->withErrors(['error' => 'No permission.']);
        }

        return Inertia::render('skb/form', [
            'employees' => Employee::select('id', 'nama', 'nik')->orderBy('nama')->get()
        ]);
    }

    public function store(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('skb.create')) {
            return redirect()->back()->withErrors(['error' => 'No permission.']);
        }

        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'purpose' => 'required|string',
        ]);

        $maker = $request->user()->employee;
        if (!$maker) {
            return redirect()->back()->withErrors(['error' => 'Maker must be an employee.']);
        }
        if (!$maker->signature) {
            return redirect()->back()->withErrors(['error' => 'Maker must have a signature configured.']);
        }

        $employee = Employee::with(['workLocation', 'workingLocation'])->find($validated['employee_id']);
        
        // Generate letter number: e.g. 30/HRD-LT/XII/2025
        $monthRomawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
        $month = now()->month;
        $romawi = $monthRomawi[$month - 1];
        $year = now()->year;
        
        $companyCode = strtoupper($employee->workLocation?->code ?? 'BBB');
        $locationName = $employee->workingLocation?->name ?? 'HO';
        $locationCode = strtoupper(substr(str_replace(' ', '', $locationName), 0, 3));
        
        // Count for this year
        $count = WorkCertificate::whereYear('date', $year)->count() + 1;
        $formattedCount = str_pad($count, 3, '0', STR_PAD_LEFT);
        $letterNumber = "SKB-{$companyCode}.HRD-{$locationCode}-{$formattedCount}-{$romawi}-{$year}";

        WorkCertificate::create([
            'letter_number' => $letterNumber,
            'date' => now(),
            'purpose' => $validated['purpose'],
            'employee_id' => $validated['employee_id'],
            'maker_id' => $maker->id,
        ]);

        return redirect()->route('hr-forms.index', ['tab' => 'skb'])->with('success', 'SKB created successfully.');
    }

    public function edit(Request $request, WorkCertificate $skb)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('skb.edit')) {
            return redirect()->route('hr-forms.index', ['tab' => 'skb'])->withErrors(['error' => 'No permission.']);
        }

        return Inertia::render('skb/form', [
            'certificate' => $skb,
            'employees' => Employee::select('id', 'nama', 'nik')->orderBy('nama')->get()
        ]);
    }

    public function update(Request $request, WorkCertificate $skb)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('skb.edit')) {
            return redirect()->back()->withErrors(['error' => 'No permission.']);
        }

        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'purpose' => 'required|string',
        ]);

        $skb->update($validated);

        return redirect()->route('hr-forms.index', ['tab' => 'skb'])->with('success', 'SKB updated successfully.');
    }

    public function destroy(Request $request, WorkCertificate $skb)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('skb.delete')) {
            return redirect()->back()->withErrors(['error' => 'No permission.']);
        }

        $skb->delete();

        return redirect()->back()->with('success', 'SKB deleted.');
    }

    public function downloadPdf(Request $request, WorkCertificate $skb)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('skb.view')) {
            return redirect()->back()->withErrors(['error' => 'No permission.']);
        }

        $skb->load(['employee.workLocation', 'employee.position', 'maker.position']);

        $pdf = Pdf::loadView('pdfs.skb-letter', ['skb' => $skb]);
        
        $safeFilename = str_replace('/', '-', $skb->letter_number);
        
        return $pdf->download("SKB_{$safeFilename}.pdf");
    }
}
