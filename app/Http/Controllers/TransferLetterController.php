<?php

namespace App\Http\Controllers;

use App\Models\TransferLetter;
use App\Models\Employee;
use App\Models\WorkLocation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class TransferLetterController extends Controller
{
    private function can($user, $perm) { return $user->isAdmin() || $user->hasPermission($perm); }

    private function genNumber($companyCode, $year, $month) {
        $rom = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
        $count = TransferLetter::whereYear('date', $year)->count() + 1;
        return "SMT-{$companyCode}.HRD-HO-" . str_pad($count, 3, '0', STR_PAD_LEFT) . "-{$rom[$month-1]}-{$year}";
    }

    public function create(Request $request) {
        if (!$this->can($request->user(), 'transfer.create')) return redirect()->route('hr-forms.index')->withErrors(['error' => 'No permission.']);
        return Inertia::render('hr-forms/transfer-form', [
            'employees' => Employee::select('id','nama','nik')->orderBy('nama')->get(),
            'companies' => WorkLocation::select('id','name','code')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request) {
        if (!$this->can($request->user(), 'transfer.create')) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $v = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'company_id' => 'required|exists:work_locations,id',
            'from_location' => 'required|string',
            'to_location' => 'required|string',
            'from_position' => 'nullable|string',
            'to_position' => 'nullable|string',
            'effective_date' => 'required|date',
            'reason' => 'nullable|string',
        ]);
        $maker = $request->user()->employee;
        if (!$maker || !$maker->signature) return redirect()->back()->withErrors(['error' => 'Maker must have a signature.']);
        $company = WorkLocation::findOrFail($v['company_id']);
        $v['letter_number'] = $this->genNumber(strtoupper($company->code ?? 'BBB'), now()->year, now()->month);
        $v['date'] = now();
        $v['maker_id'] = $maker->id;
        TransferLetter::create($v);
        return redirect()->route('hr-forms.index', ['tab' => 'transfer'])->with('success', 'Surat Mutasi berhasil dibuat.');
    }

    public function edit(Request $request, TransferLetter $transfer) {
        if (!$this->can($request->user(), 'transfer.edit')) return redirect()->route('hr-forms.index', ['tab' => 'transfer'])->withErrors(['error' => 'No permission.']);
        return Inertia::render('hr-forms/transfer-form', [
            'letter' => $transfer,
            'employees' => Employee::select('id','nama','nik')->orderBy('nama')->get(),
            'companies' => WorkLocation::select('id','name','code')->orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, TransferLetter $transfer) {
        if (!$this->can($request->user(), 'transfer.edit')) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $v = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'company_id' => 'required|exists:work_locations,id',
            'from_location' => 'required|string',
            'to_location' => 'required|string',
            'from_position' => 'nullable|string',
            'to_position' => 'nullable|string',
            'effective_date' => 'required|date',
            'reason' => 'nullable|string',
        ]);
        $transfer->update($v);
        return redirect()->route('hr-forms.index', ['tab' => 'transfer'])->with('success', 'Surat Mutasi berhasil diperbarui.');
    }

    public function destroy(Request $request, TransferLetter $transfer) {
        if (!$this->can($request->user(), 'transfer.delete')) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $transfer->delete();
        return redirect()->back()->with('success', 'Surat Mutasi berhasil dihapus.');
    }

    public function downloadPdf(Request $request, TransferLetter $transfer) {
        if (!$this->can($request->user(), 'transfer.view')) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $transfer->load(['employee.position', 'maker.position', 'company']);
        $pdf = Pdf::loadView('pdfs.transfer-letter', ['letter' => $transfer]);
        return $pdf->download("SuratMutasi_{$transfer->letter_number}.pdf");
    }
}
