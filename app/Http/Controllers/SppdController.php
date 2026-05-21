<?php

namespace App\Http\Controllers;

use App\Models\Sppd;
use App\Models\SppdItem;
use App\Models\Employee;
use App\Models\WorkLocation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class SppdController extends Controller
{
    public function index(Request $request)
    {
        \Illuminate\Support\Facades\Log::info('SPPD Index hit by user: ' . $request->user()->id);
        $user = $request->user();
        $employee = $user->employee;

        $query = Sppd::with(['employees', 'requester', 'maker'])
            ->when($request->search, function ($q, $search) {
                $q->where('letter_number', 'like', "%{$search}%")
                  ->orWhereHas('employees', function($q) use ($search) {
                      $q->where('nama', 'like', "%{$search}%");
                  })
                  ->orWhere('tujuan', 'like', "%{$search}%");
            });

        // Visibility rules
        if (!$user->isAdmin() && !$user->hasPermission('sppd.view_all')) {
            $query->where(function ($q) use ($employee) {
                if ($employee) {
                    $q->whereHas('employees', function($q) use ($employee) {
                        $q->where('employees.id', $employee->id);
                    })
                    ->orWhere('maker_id', $employee->id);
                } else {
                    $q->where('id', 0);
                }
            });
        }

        return Inertia::render('Sppd/Index', [
            'sppds' => $query->orderBy('created_at', 'desc')->paginate(15),
            'filters' => $request->only('search')
        ]);
    }

    public function create()
    {
        if (!request()->user()->isAdmin() && !request()->user()->hasPermission('sppd.create')) {
            return redirect()->route('sppd.index')->withErrors(['error' => 'No permission.']);
        }

        return Inertia::render('Sppd/Form', [
            'employees' => Employee::with(['position'])->select('id', 'nama', 'nik', 'position_id')->orderBy('nama')->get(),
            'workLocations' => WorkLocation::select('id', 'name', 'code')->orderBy('name')->get()
        ]);
    }

    public function store(Request $request)
    {
        if (!request()->user()->isAdmin() && !request()->user()->hasPermission('sppd.create')) {
            return redirect()->back()->withErrors(['error' => 'No permission.']);
        }

        $validated = $request->validate([
            'employee_ids' => 'nullable|array',
            'employee_ids.*' => 'exists:employees,id',
            'external_employees' => 'nullable|array',
            'external_employees.*' => 'string|max:255',
            'tujuan' => 'required|string|max:255',
            'tanggal_berangkat' => 'required|date',
            'tanggal_kembali' => 'required|date|after_or_equal:tanggal_berangkat',
            'atas_permintaan_id' => 'required|exists:employees,id',
            'maksud_perjalanan_dinas' => 'required|string',
            'work_location_id' => 'required|exists:work_locations,id',
        ]);

        $maker = $request->user()->employee;
        if (!$maker) {
            return redirect()->back()->withErrors(['error' => 'Maker must be an employee.']);
        }

        $firstEmployee = null;
        if (!empty($validated['employee_ids'])) {
            $firstEmployee = Employee::with(['workLocation', 'workingLocation'])->find($validated['employee_ids'][0]);
        }
        
        $letterNumber = $this->generateLetterNumber($firstEmployee, $validated['work_location_id']);

        $sppd = Sppd::create([
            ...collect($validated)->except(['employee_ids', 'external_employees'])->toArray(),
            'letter_number' => $letterNumber,
            'maker_id' => $maker->id,
            'status' => 'draft',
            'external_employees' => $validated['external_employees'] ?? [],
        ]);

        if (!empty($validated['employee_ids'])) {
            $sppd->employees()->sync($validated['employee_ids']);
        }

        return redirect()->route('sppd.show', $sppd->id)->with('success', 'SPPD created. Now add itinerary items.');
    }

    public function show(Sppd $sppd)
    {
        $user = request()->user();
        $employee = $user->employee;

        // Visibility check
        if (!$user->isAdmin() && !$user->hasPermission('sppd.view_all')) {
            if (!$sppd->employees()->where('employees.id', $employee?->id)->exists() && $sppd->maker_id !== $employee?->id) {
                return redirect()->route('sppd.index')->withErrors(['error' => 'No permission to view this SPPD.']);
            }
        }

        $sppd->load(['employees.position', 'requester.position', 'maker.position', 'items', 'workLocation']);

        return Inertia::render('Sppd/Show', [
            'sppd' => $sppd,
            'previousDescriptions' => SppdItem::distinct()->pluck('description'),
        ]);
    }

    public function edit(Sppd $sppd)
    {
        if (!request()->user()->isAdmin() && !request()->user()->hasPermission('sppd.edit')) {
            return redirect()->route('sppd.index')->withErrors(['error' => 'No permission.']);
        }

        return Inertia::render('Sppd/Form', [
            'sppd' => $sppd->load('employees'),
            'employees' => Employee::with(['position'])->select('id', 'nama', 'nik', 'position_id')->orderBy('nama')->get(),
            'workLocations' => WorkLocation::select('id', 'name', 'code')->orderBy('name')->get()
        ]);
    }

    public function update(Request $request, Sppd $sppd)
    {
        if (!request()->user()->isAdmin() && !request()->user()->hasPermission('sppd.edit')) {
            return redirect()->back()->withErrors(['error' => 'No permission.']);
        }

        $validated = $request->validate([
            'employee_ids' => 'nullable|array',
            'employee_ids.*' => 'exists:employees,id',
            'external_employees' => 'nullable|array',
            'external_employees.*' => 'string|max:255',
            'tujuan' => 'required|string|max:255',
            'tanggal_berangkat' => 'required|date',
            'tanggal_kembali' => 'required|date|after_or_equal:tanggal_berangkat',
            'atas_permintaan_id' => 'required|exists:employees,id',
            'maksud_perjalanan_dinas' => 'required|string',
            'work_location_id' => 'required|exists:work_locations,id',
            'status' => 'nullable|string',
        ]);

        $sppd->update([
            ...collect($validated)->except(['employee_ids', 'external_employees'])->toArray(),
            'external_employees' => $validated['external_employees'] ?? [],
        ]);

        $sppd->employees()->sync($validated['employee_ids'] ?? []);

        return redirect()->route('sppd.show', $sppd->id)->with('success', 'SPPD updated.');
    }

    public function destroy(Sppd $sppd)
    {
        if (!request()->user()->isAdmin() && !request()->user()->hasPermission('sppd.delete')) {
            return redirect()->back()->withErrors(['error' => 'No permission.']);
        }

        $sppd->delete();

        return redirect()->route('sppd.index')->with('success', 'SPPD deleted.');
    }

    public function addItem(Request $request, Sppd $sppd)
    {
        $validated = $request->validate([
            'hal' => 'required|string',
            'description' => 'required|string',
            'qty' => 'required|numeric|min:0.01',
            'price' => 'required|numeric|min:0',
        ]);

        $totalPrice = $validated['qty'] * $validated['price'];

        $sppd->items()->create([
            ...$validated,
            'total_price' => $totalPrice,
        ]);

        $this->updateTotalAmount($sppd);

        return redirect()->back()->with('success', 'Item added.');
    }

    public function removeItem(SppdItem $item)
    {
        $sppd = $item->sppd;
        $item->delete();

        $this->updateTotalAmount($sppd);

        return redirect()->back()->with('success', 'Item removed.');
    }

    public function downloadPdf(Sppd $sppd)
    {
        $sppd->load(['employees.position', 'employees.workLocation', 'requester.position', 'maker.position', 'maker.workLocation', 'items', 'workLocation']);

        $pdf = Pdf::loadView('pdfs.sppd', ['sppd' => $sppd]);
        
        $safeFilename = str_replace('/', '-', $sppd->letter_number);
        
        return $pdf->download("SPPD_{$safeFilename}.pdf");
    }

    public function uploadSignedPdf(Request $request, Sppd $sppd)
    {
        if (!request()->user()->isAdmin() && !request()->user()->hasPermission('sppd.upload_signed')) {
            return redirect()->back()->withErrors(['error' => 'No permission.']);
        }

        $request->validate([
            'signed_pdf' => 'required|file|mimes:pdf|max:10240',
        ]);

        if ($sppd->signed_pdf_path) {
            Storage::disk('public')->delete($sppd->signed_pdf_path);
        }

        $path = $request->file('signed_pdf')->store('sppds', 'public');
        $sppd->update([
            'signed_pdf_path' => $path,
            'status' => 'signed'
        ]);

        return redirect()->back()->with('success', 'Signed PDF uploaded.');
    }

    private function generateLetterNumber(?Employee $employee, $workLocationId = null): string
    {
        $monthRomawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
        $month = now()->month;
        $romawi = $monthRomawi[$month - 1];
        $year = now()->year;
        
        if ($workLocationId) {
            $wl = WorkLocation::find($workLocationId);
            $companyCode = strtoupper($wl?->code ?? 'BBB');
        } else {
            $companyCode = strtoupper($employee->workLocation?->code ?? 'BBB');
        }

        $locationName = $employee?->workingLocation?->name ?? 'HO';
        $locationCode = strtoupper(substr(str_replace(' ', '', $locationName), 0, 3));
        
        $count = Sppd::whereYear('created_at', $year)->count() + 1;
        $formattedCount = str_pad($count, 3, '0', STR_PAD_LEFT);
        
        return "SPPD-{$companyCode}.ADM-{$locationCode}-{$formattedCount}-{$romawi}-{$year}";
    }

    private function updateTotalAmount(Sppd $sppd)
    {
        $sppd->update([
            'total_amount' => $sppd->items()->sum('total_price')
        ]);
    }
}
