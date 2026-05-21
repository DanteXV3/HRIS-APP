<?php

namespace App\Http\Controllers;

use App\Models\TerminationLetter;
use App\Models\Employee;
use App\Models\WorkLocation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class TerminationLetterController extends Controller
{
    private function can($user, $perm) { return $user->isAdmin() || $user->hasPermission($perm); }

    private function genNumber($companyCode, $year, $month) {
        $rom = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
        $count = TerminationLetter::whereYear('date', $year)->count() + 1;
        return "PHK-{$companyCode}.HRD-HO-" . str_pad($count, 3, '0', STR_PAD_LEFT) . "-{$rom[$month-1]}-{$year}";
    }

    public function create(Request $request) {
        if (!$this->can($request->user(), 'termination.create')) return redirect()->route('hr-forms.index')->withErrors(['error' => 'No permission.']);
        return Inertia::render('hr-forms/termination-form', [
            'employees' => Employee::select('id','nama','nik')->orderBy('nama')->get(),
            'companies' => WorkLocation::select('id','name','code')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request) {
        if (!$this->can($request->user(), 'termination.create')) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $v = $request->validate([
            'employee_id' => 'required|exists:employees,id', 'company_id' => 'required|exists:work_locations,id',
            'termination_date' => 'required|date', 'reason' => 'required|string',
            'severance_amount' => 'nullable|numeric', 'notes' => 'nullable|string',
        ]);
        $maker = $request->user()->employee;
        if (!$maker || !$maker->signature) return redirect()->back()->withErrors(['error' => 'Maker must have a signature.']);
        $company = WorkLocation::findOrFail($v['company_id']);
        $v['letter_number'] = $this->genNumber(strtoupper($company->code ?? 'BBB'), now()->year, now()->month);
        $v['date'] = now(); $v['maker_id'] = $maker->id;
        TerminationLetter::create($v);
        return redirect()->route('hr-forms.index', ['tab' => 'termination'])->with('success', 'Surat PHK berhasil dibuat.');
    }

    public function edit(Request $request, TerminationLetter $termination) {
        if (!$this->can($request->user(), 'termination.edit')) return redirect()->route('hr-forms.index', ['tab' => 'termination'])->withErrors(['error' => 'No permission.']);
        return Inertia::render('hr-forms/termination-form', [
            'letter' => $termination,
            'employees' => Employee::select('id','nama','nik')->orderBy('nama')->get(),
            'companies' => WorkLocation::select('id','name','code')->orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, TerminationLetter $termination) {
        if (!$this->can($request->user(), 'termination.edit')) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $v = $request->validate([
            'employee_id' => 'required|exists:employees,id', 'company_id' => 'required|exists:work_locations,id',
            'termination_date' => 'required|date', 'reason' => 'required|string',
            'severance_amount' => 'nullable|numeric', 'notes' => 'nullable|string',
        ]);
        $termination->update($v);
        return redirect()->route('hr-forms.index', ['tab' => 'termination'])->with('success', 'Surat PHK berhasil diperbarui.');
    }

    public function destroy(Request $request, TerminationLetter $termination) {
        if (!$this->can($request->user(), 'termination.delete')) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $termination->delete();
        return redirect()->back()->with('success', 'Deleted.');
    }

    public function downloadPdf(Request $request, TerminationLetter $termination) {
        if (!$this->can($request->user(), 'termination.view')) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $termination->load(['employee.position', 'maker.position', 'company']);
        $pdf = Pdf::loadView('pdfs.termination-letter', ['letter' => $termination]);
        return $pdf->download("SuratPHK_{$termination->letter_number}.pdf");
    }
}
