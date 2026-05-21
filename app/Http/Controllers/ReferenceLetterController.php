<?php

namespace App\Http\Controllers;

use App\Models\ReferenceLetter;
use App\Models\Employee;
use App\Models\WorkLocation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ReferenceLetterController extends Controller
{
    private function can($user, $perm) { return $user->isAdmin() || $user->hasPermission($perm); }

    private function genNumber($companyCode, $year, $month) {
        $rom = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
        $count = ReferenceLetter::whereYear('date', $year)->count() + 1;
        return "SRF-{$companyCode}.HRD-HO-" . str_pad($count, 3, '0', STR_PAD_LEFT) . "-{$rom[$month-1]}-{$year}";
    }

    public function create(Request $request) {
        if (!$this->can($request->user(), 'reference.create')) return redirect()->route('hr-forms.index')->withErrors(['error' => 'No permission.']);
        return Inertia::render('hr-forms/reference-form', [
            'employees' => Employee::select('id','nama','nik')->orderBy('nama')->get(),
            'companies' => WorkLocation::select('id','name','code')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request) {
        if (!$this->can($request->user(), 'reference.create')) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $v = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'company_id' => 'required|exists:work_locations,id',
            'work_location_text' => 'nullable|string',
            'from_date' => 'required|date',
            'to_date' => 'required|date|after_or_equal:from_date',
            'qualities' => 'nullable|string',
            'recommendation_text' => 'nullable|string',
        ]);
        $maker = $request->user()->employee;
        if (!$maker || !$maker->signature) return redirect()->back()->withErrors(['error' => 'Maker must have a signature.']);
        $company = WorkLocation::findOrFail($v['company_id']);
        $v['letter_number'] = $this->genNumber(strtoupper($company->code ?? 'BBB'), now()->year, now()->month);
        $v['date'] = now();
        $v['maker_id'] = $maker->id;
        ReferenceLetter::create($v);
        return redirect()->route('hr-forms.index', ['tab' => 'reference'])->with('success', 'Surat Referensi berhasil dibuat.');
    }

    public function edit(Request $request, ReferenceLetter $reference) {
        if (!$this->can($request->user(), 'reference.edit')) return redirect()->route('hr-forms.index', ['tab' => 'reference'])->withErrors(['error' => 'No permission.']);
        return Inertia::render('hr-forms/reference-form', [
            'letter' => $reference,
            'employees' => Employee::select('id','nama','nik')->orderBy('nama')->get(),
            'companies' => WorkLocation::select('id','name','code')->orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, ReferenceLetter $reference) {
        if (!$this->can($request->user(), 'reference.edit')) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $v = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'company_id' => 'required|exists:work_locations,id',
            'work_location_text' => 'nullable|string',
            'from_date' => 'required|date',
            'to_date' => 'required|date|after_or_equal:from_date',
            'qualities' => 'nullable|string',
            'recommendation_text' => 'nullable|string',
        ]);
        $reference->update($v);
        return redirect()->route('hr-forms.index', ['tab' => 'reference'])->with('success', 'Surat Referensi berhasil diperbarui.');
    }

    public function destroy(Request $request, ReferenceLetter $reference) {
        if (!$this->can($request->user(), 'reference.delete')) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $reference->delete();
        return redirect()->back()->with('success', 'Surat Referensi berhasil dihapus.');
    }

    public function downloadPdf(Request $request, ReferenceLetter $reference) {
        if (!$this->can($request->user(), 'reference.view')) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $reference->load(['employee.position', 'maker.position', 'company']);
        $pdf = Pdf::loadView('pdfs.reference-letter', ['letter' => $reference]);
        return $pdf->download("SuratReferensi_{$reference->letter_number}.pdf");
    }
}
