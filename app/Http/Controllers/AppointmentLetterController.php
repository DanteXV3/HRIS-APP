<?php

namespace App\Http\Controllers;

use App\Models\AppointmentLetter;
use App\Models\Employee;
use App\Models\WorkLocation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class AppointmentLetterController extends Controller
{
    private function can($user, $perm) { return $user->isAdmin() || $user->hasPermission($perm); }

    private function genNumber($companyCode, $year, $month) {
        $rom = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
        $count = AppointmentLetter::whereYear('date', $year)->count() + 1;
        return "SPA-{$companyCode}.HRD-HO-" . str_pad($count, 3, '0', STR_PAD_LEFT) . "-{$rom[$month-1]}-{$year}";
    }

    public function create(Request $request) {
        if (!$this->can($request->user(), 'appointment.create')) return redirect()->route('hr-forms.index')->withErrors(['error' => 'No permission.']);
        return Inertia::render('hr-forms/appointment-form', [
            'employees' => Employee::select('id','nama','nik')->orderBy('nama')->get(),
            'companies' => WorkLocation::select('id','name','code')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request) {
        if (!$this->can($request->user(), 'appointment.create')) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $v = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'company_id' => 'required|exists:work_locations,id',
            'previous_status' => 'required|string',
            'new_status' => 'required|string',
            'effective_date' => 'required|date',
            'new_salary' => 'nullable|numeric',
            'notes' => 'nullable|string',
        ]);
        $maker = $request->user()->employee;
        if (!$maker || !$maker->signature) return redirect()->back()->withErrors(['error' => 'Maker must have a signature.']);
        $company = WorkLocation::findOrFail($v['company_id']);
        $v['letter_number'] = $this->genNumber(strtoupper($company->code ?? 'BBB'), now()->year, now()->month);
        $v['date'] = now();
        $v['maker_id'] = $maker->id;
        AppointmentLetter::create($v);
        return redirect()->route('hr-forms.index', ['tab' => 'appointment'])->with('success', 'Surat Pengangkatan berhasil dibuat.');
    }

    public function edit(Request $request, AppointmentLetter $appointment) {
        if (!$this->can($request->user(), 'appointment.edit')) return redirect()->route('hr-forms.index', ['tab' => 'appointment'])->withErrors(['error' => 'No permission.']);
        return Inertia::render('hr-forms/appointment-form', [
            'letter' => $appointment,
            'employees' => Employee::select('id','nama','nik')->orderBy('nama')->get(),
            'companies' => WorkLocation::select('id','name','code')->orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, AppointmentLetter $appointment) {
        if (!$this->can($request->user(), 'appointment.edit')) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $v = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'company_id' => 'required|exists:work_locations,id',
            'previous_status' => 'required|string',
            'new_status' => 'required|string',
            'effective_date' => 'required|date',
            'new_salary' => 'nullable|numeric',
            'notes' => 'nullable|string',
        ]);
        $appointment->update($v);
        return redirect()->route('hr-forms.index', ['tab' => 'appointment'])->with('success', 'Surat Pengangkatan berhasil diperbarui.');
    }

    public function destroy(Request $request, AppointmentLetter $appointment) {
        if (!$this->can($request->user(), 'appointment.delete')) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $appointment->delete();
        return redirect()->back()->with('success', 'Surat Pengangkatan berhasil dihapus.');
    }

    public function downloadPdf(Request $request, AppointmentLetter $appointment) {
        if (!$this->can($request->user(), 'appointment.view')) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $appointment->load(['employee.position', 'maker.position', 'company']);
        $pdf = Pdf::loadView('pdfs.appointment-letter', ['letter' => $appointment]);
        return $pdf->download("SuratPengangkatan_{$appointment->letter_number}.pdf");
    }
}
