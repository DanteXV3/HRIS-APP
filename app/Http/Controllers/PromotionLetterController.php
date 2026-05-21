<?php

namespace App\Http\Controllers;

use App\Models\PromotionLetter;
use App\Models\Employee;
use App\Models\WorkLocation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class PromotionLetterController extends Controller
{
    private function can($user, $perm) { return $user->isAdmin() || $user->hasPermission($perm); }

    private function genNumber($companyCode, $year, $month) {
        $rom = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
        $count = PromotionLetter::whereYear('date', $year)->count() + 1;
        return "SPD-{$companyCode}.HRD-HO-" . str_pad($count, 3, '0', STR_PAD_LEFT) . "-{$rom[$month-1]}-{$year}";
    }

    public function create(Request $request) {
        if (!$this->can($request->user(), 'promotion.create')) return redirect()->route('hr-forms.index')->withErrors(['error' => 'No permission.']);
        return Inertia::render('hr-forms/promotion-form', [
            'employees' => Employee::select('id','nama','nik')->orderBy('nama')->get(),
            'companies' => WorkLocation::select('id','name','code')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request) {
        if (!$this->can($request->user(), 'promotion.create')) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $v = $request->validate([
            'employee_id' => 'required|exists:employees,id', 'company_id' => 'required|exists:work_locations,id',
            'type' => 'required|in:promosi,demosi', 'from_position' => 'required|string', 'to_position' => 'required|string',
            'from_department' => 'nullable|string', 'to_department' => 'nullable|string',
            'effective_date' => 'required|date', 'new_salary' => 'nullable|numeric', 'reason' => 'nullable|string',
        ]);
        $maker = $request->user()->employee;
        if (!$maker || !$maker->signature) return redirect()->back()->withErrors(['error' => 'Maker must have a signature.']);
        $company = WorkLocation::findOrFail($v['company_id']);
        $v['letter_number'] = $this->genNumber(strtoupper($company->code ?? 'BBB'), now()->year, now()->month);
        $v['date'] = now(); $v['maker_id'] = $maker->id;
        PromotionLetter::create($v);
        return redirect()->route('hr-forms.index', ['tab' => 'promotion'])->with('success', 'Surat Promosi/Demosi berhasil dibuat.');
    }

    public function edit(Request $request, PromotionLetter $promotion) {
        if (!$this->can($request->user(), 'promotion.edit')) return redirect()->route('hr-forms.index', ['tab' => 'promotion'])->withErrors(['error' => 'No permission.']);
        return Inertia::render('hr-forms/promotion-form', [
            'letter' => $promotion,
            'employees' => Employee::select('id','nama','nik')->orderBy('nama')->get(),
            'companies' => WorkLocation::select('id','name','code')->orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, PromotionLetter $promotion) {
        if (!$this->can($request->user(), 'promotion.edit')) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $v = $request->validate([
            'employee_id' => 'required|exists:employees,id', 'company_id' => 'required|exists:work_locations,id',
            'type' => 'required|in:promosi,demosi', 'from_position' => 'required|string', 'to_position' => 'required|string',
            'from_department' => 'nullable|string', 'to_department' => 'nullable|string',
            'effective_date' => 'required|date', 'new_salary' => 'nullable|numeric', 'reason' => 'nullable|string',
        ]);
        $promotion->update($v);
        return redirect()->route('hr-forms.index', ['tab' => 'promotion'])->with('success', 'Surat berhasil diperbarui.');
    }

    public function destroy(Request $request, PromotionLetter $promotion) {
        if (!$this->can($request->user(), 'promotion.delete')) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $promotion->delete();
        return redirect()->back()->with('success', 'Deleted.');
    }

    public function downloadPdf(Request $request, PromotionLetter $promotion) {
        if (!$this->can($request->user(), 'promotion.view')) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $promotion->load(['employee.position', 'maker.position', 'company']);
        $pdf = Pdf::loadView('pdfs.promotion-letter', ['letter' => $promotion]);
        return $pdf->download("SuratPromosi_{$promotion->letter_number}.pdf");
    }
}
