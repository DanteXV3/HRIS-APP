<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\WarningLetter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class WarningLetterController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $employee = $user->employee;

        $query = WarningLetter::with(['employee.position', 'employee.department', 'issuer']);

        $canSeeAll = $user->isAdmin() || $user->hasPermission('sp.view_others') || $user->hasPermission('sp.create');

        if (!$canSeeAll) {
            if ($employee) {
                $query->where('employee_id', $employee->id);
            } else {
                return Inertia::render('warning-letters/index', [
                    'warningLetters' => [],
                    'isHR' => false
                ]);
            }
        }

        $warningLetters = $query->orderBy('issued_date', 'desc')->paginate(10);

        return Inertia::render('warning-letters/index', [
            'warningLetters' => $warningLetters,
            'isHR' => $user->isAdmin() || $user->hasPermission('sp.create')
        ]);
    }

    public function create()
    {
        if (!auth()->user()->isAdmin() && !auth()->user()->hasPermission('sp.create')) {
            abort(403);
        }

        return Inertia::render('warning-letters/form', [
            'employees' => Employee::select('id', 'nama', 'nik')->orderBy('nama')->get(),
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->isAdmin() && !auth()->user()->hasPermission('sp.create')) {
            abort(403);
        }

        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'level' => 'required|integer|between:1,3',
            'reason' => 'required|string',
            'description' => 'required|string',
            'issued_date' => 'required|date',
            'valid_months' => 'required|integer|min:1',
        ]);

        $issuedDate = Carbon::parse($validated['issued_date']);
        $validUntil = $issuedDate->copy()->addMonths($validated['valid_months']);

        $employee = Employee::with(['workLocation', 'workingLocation'])->find($validated['employee_id']);
        $companyCode = strtoupper($employee->workLocation?->code ?? 'BBB');
        $locationCode = $employee->workingLocation ? strtoupper(substr(str_replace(' ', '', $employee->workingLocation->name), 0, 3)) : 'HO';
        
        $year = $issuedDate->year;
        $month = $issuedDate->month;
        
        $monthRomawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
        $romawi = $monthRomawi[$month - 1];

        $lastSp = WarningLetter::whereYear('issued_date', $year)
            ->orderByRaw('CAST(SUBSTRING_INDEX(reference_number, "-", 4) AS UNSIGNED) DESC') // Updated for new format
            ->first();

        $nextSeq = 1;
        if ($lastSp) {
            $parts = explode('-', $lastSp->reference_number);
            if (count($parts) >= 4) {
                // Number is now the 4th part: SP-KPLU.HRD-HO-001-IV-2026
                $nextSeq = (int)$parts[3] + 1;
            } else {
                // Fallback for old format
                $nextSeq = (int)$parts[0] + 1;
            }
        }

        $formattedCount = str_pad($nextSeq, 3, '0', STR_PAD_LEFT);
        $referenceNumber = "SP-{$companyCode}.HRD-{$locationCode}-{$formattedCount}-{$romawi}-{$year}";

        WarningLetter::create([
            'employee_id' => $validated['employee_id'],
            'level' => $validated['level'],
            'reference_number' => $referenceNumber,
            'reason' => $validated['reason'],
            'description' => $validated['description'],
            'issued_date' => $validated['issued_date'],
            'valid_until' => $validUntil,
            'issued_by' => auth()->user()->employee?->id,
            'status' => 'issued',
        ]);

        return redirect()->route('warning-letters.index')->with('success', 'Surat Peringatan berhasil dibuat.');
    }

    public function show(WarningLetter $warningLetter)
    {
        $user = auth()->user();
        $employee = $user->employee;

        if (!$user->isAdmin() && !$user->hasPermission('sp.view_others')) {
            if (!$employee || $warningLetter->employee_id !== $employee->id) {
                abort(403);
            }
        }

        $warningLetter->load(['employee.department', 'employee.position', 'issuer']);
        
        return Inertia::render('warning-letters/show', [
            'warningLetter' => $warningLetter
        ]);
    }

    public function destroy(WarningLetter $warningLetter)
    {
        if (!auth()->user()->isAdmin() && !auth()->user()->hasPermission('sp.delete')) {
            abort(403);
        }

        $warningLetter->delete();
        return back()->with('success', 'Surat Peringatan berhasil dihapus.');
    }

    public function downloadPdf(WarningLetter $warningLetter)
    {
        $user = auth()->user();
        $employee = $user->employee;

        if (!$user->isAdmin() && !$user->hasPermission('sp.view_others')) {
            if (!$employee || $warningLetter->employee_id !== $employee->id) {
                abort(403);
            }
        }

        $warningLetter->load(['employee.department', 'employee.position', 'employee.workLocation', 'issuer']);

        $pdf = Pdf::loadView('pdf.sp_template', [
            'sp' => $warningLetter,
        ]);

        return $pdf->download('SP_' . $warningLetter->level_roman . '_' . $warningLetter->employee->nama . '.pdf');
    }
}
