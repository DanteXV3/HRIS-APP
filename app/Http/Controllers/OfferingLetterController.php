<?php

namespace App\Http\Controllers;

use App\Models\OfferingLetter;
use App\Models\WorkLocation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class OfferingLetterController extends Controller
{
    private function can($user, $perm) { return $user->isAdmin() || $user->hasPermission($perm); }

    private function genNumber($companyCode, $year, $month) {
        $rom = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
        $count = OfferingLetter::whereYear('date', $year)->count() + 1;
        return "OFR-{$companyCode}.HRD-HO-" . str_pad($count, 3, '0', STR_PAD_LEFT) . "-{$rom[$month-1]}-{$year}";
    }

    public function create(Request $request) {
        if (!$this->can($request->user(), 'offering.create')) return redirect()->route('hr-forms.index')->withErrors(['error' => 'No permission.']);
        return Inertia::render('hr-forms/offering-form', [
            'companies' => WorkLocation::select('id','name','code')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request) {
        if (!$this->can($request->user(), 'offering.create')) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $v = $request->validate([
            'company_id' => 'required|exists:work_locations,id',
            'candidate_name' => 'required|string',
            'candidate_address' => 'nullable|string',
            'position_offered' => 'required|string',
            'department_text' => 'nullable|string',
            'start_date' => 'required|date',
            'offered_salary' => 'nullable|numeric',
            'employment_type' => 'required|string',
            'notes' => 'nullable|string',
        ]);
        $maker = $request->user()->employee;
        if (!$maker || !$maker->signature) return redirect()->back()->withErrors(['error' => 'Maker must have a signature.']);
        $company = WorkLocation::findOrFail($v['company_id']);
        $v['letter_number'] = $this->genNumber(strtoupper($company->code ?? 'BBB'), now()->year, now()->month);
        $v['date'] = now();
        $v['maker_id'] = $maker->id;
        OfferingLetter::create($v);
        return redirect()->route('hr-forms.index', ['tab' => 'offering'])->with('success', 'Offering Letter berhasil dibuat.');
    }

    public function edit(Request $request, OfferingLetter $offering) {
        if (!$this->can($request->user(), 'offering.edit')) return redirect()->route('hr-forms.index', ['tab' => 'offering'])->withErrors(['error' => 'No permission.']);
        return Inertia::render('hr-forms/offering-form', [
            'letter' => $offering,
            'companies' => WorkLocation::select('id','name','code')->orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, OfferingLetter $offering) {
        if (!$this->can($request->user(), 'offering.edit')) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $v = $request->validate([
            'company_id' => 'required|exists:work_locations,id',
            'candidate_name' => 'required|string',
            'candidate_address' => 'nullable|string',
            'position_offered' => 'required|string',
            'department_text' => 'nullable|string',
            'start_date' => 'required|date',
            'offered_salary' => 'nullable|numeric',
            'employment_type' => 'required|string',
            'notes' => 'nullable|string',
        ]);
        $offering->update($v);
        return redirect()->route('hr-forms.index', ['tab' => 'offering'])->with('success', 'Offering Letter berhasil diperbarui.');
    }

    public function destroy(Request $request, OfferingLetter $offering) {
        if (!$this->can($request->user(), 'offering.delete')) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $offering->delete();
        return redirect()->back()->with('success', 'Offering Letter berhasil dihapus.');
    }

    public function downloadPdf(Request $request, OfferingLetter $offering) {
        if (!$this->can($request->user(), 'offering.view')) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $offering->load(['maker.position', 'company']);
        $pdf = Pdf::loadView('pdfs.offering-letter', ['letter' => $offering]);
        return $pdf->download("OfferingLetter_{$offering->letter_number}.pdf");
    }
}
