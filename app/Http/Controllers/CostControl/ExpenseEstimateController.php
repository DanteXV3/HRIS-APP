<?php

namespace App\Http\Controllers\CostControl;

use App\Http\Controllers\Controller;
use App\Models\ExpenseEstimate;
use App\Models\ExpenseEstimateItem;
use App\Models\ExpenseEstimateLetter;
use App\Models\ExpenseEstimateLetterFile;
use App\Models\WorkLocation;
use App\Models\WorkingLocation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ExpenseEstimateController extends Controller
{
    private function canAny($user): bool
    {
        return $user->isAdmin() || $user->hasPermission('expense_estimate.create')
            || $user->hasPermission('expense_estimate.edit_cc')
            || $user->hasPermission('expense_estimate.edit_finance');
    }

    private function canCreate($user): bool { return $user->isAdmin() || $user->hasPermission('expense_estimate.create') || $user->hasPermission('expense_estimate.edit_cc'); }
    private function canEditCC($user): bool { return $user->isAdmin() || $user->hasPermission('expense_estimate.edit_cc'); }
    private function canEditFinance($user): bool { return $user->isAdmin() || $user->hasPermission('expense_estimate.edit_finance'); }

    /**
     * Index: list all monthly drafts
     */
    public function index(Request $request)
    {
        if (!$this->canAny($request->user())) return redirect()->route('dashboard');

        $estimates = ExpenseEstimate::with(['company', 'creator'])
            ->withCount('items')
            ->withSum('items', 'nominal')
            ->withSum('items', 'nominal_dibayarkan')
            ->orderBy('year', 'desc')->orderBy('month', 'desc')
            ->paginate(12)->withQueryString();

        return Inertia::render('cost-control/expense-estimates/index', [
            'estimates' => $estimates,
            'companies' => WorkLocation::select('id', 'name', 'code')->orderBy('name')->get(),
            'canCreate' => $this->canCreate($request->user()),
        ]);
    }

    /**
     * Store: create a new monthly draft
     */
    public function store(Request $request)
    {
        if (!$this->canCreate($request->user())) return redirect()->back()->withErrors(['error' => 'No permission.']);

        $v = $request->validate([
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2024|max:2050',
            'company_id' => 'required|exists:work_locations,id',
            'copy_last_month' => 'nullable|boolean',
        ]);

        $exists = ExpenseEstimate::where('month', $v['month'])->where('year', $v['year'])->where('company_id', $v['company_id'])->exists();
        if ($exists) return redirect()->back()->withErrors(['error' => 'Draft untuk bulan dan perusahaan ini sudah ada.']);

        $maker = $request->user()->employee;
        $copyLastMonth = $v['copy_last_month'] ?? false;
        unset($v['copy_last_month']);
        $v['created_by'] = $maker?->id;

        $estimate = ExpenseEstimate::create($v);

        // Copy items from previous month if requested
        if ($copyLastMonth) {
            $prevMonth = $v['month'] == 1 ? 12 : $v['month'] - 1;
            $prevYear = $v['month'] == 1 ? $v['year'] - 1 : $v['year'];
            $prev = ExpenseEstimate::where('month', $prevMonth)->where('year', $prevYear)->where('company_id', $v['company_id'])->first();
            if ($prev) {
                foreach ($prev->items as $item) {
                    ExpenseEstimateItem::create([
                        'expense_estimate_id' => $estimate->id,
                        'uraian_penggunaan' => $item->uraian_penggunaan,
                        'working_location_id' => $item->working_location_id,
                        'fase_pembayaran' => $item->fase_pembayaran,
                        'tanggal_jatuh_tempo' => $item->tanggal_jatuh_tempo,
                        'nominal' => $item->nominal,
                        'status' => 'Pending',
                        'keterangan' => $item->keterangan,
                    ]);
                }
            }
        }

        return redirect()->route('cost-control.expense-estimates.show', $estimate->id)->with('success', 'Draft berhasil dibuat.' . ($copyLastMonth ? ' Item dari bulan lalu telah disalin.' : ''));
    }

    /**
     * Show: detail page with items + letters
     */
    public function show(Request $request, ExpenseEstimate $expense_estimate)
    {
        if (!$this->canAny($request->user())) return redirect()->route('dashboard');

        $expense_estimate->load([
            'company', 'creator',
            'items.workingLocation',
            'letters.maker', 'letters.files',
        ]);

        return Inertia::render('cost-control/expense-estimates/show', [
            'estimate' => $expense_estimate,
            'workingLocations' => WorkingLocation::select('id', 'name')->orderBy('name')->get(),
            'canEditCC' => $this->canEditCC($request->user()),
            'canEditFinance' => $this->canEditFinance($request->user()),
        ]);
    }

    /**
     * Store item
     */
    public function storeItem(Request $request, ExpenseEstimate $expense_estimate)
    {
        if (!$this->canEditCC($request->user())) return redirect()->back()->withErrors(['error' => 'No permission.']);

        $v = $request->validate([
            'uraian_penggunaan' => 'required|string',
            'working_location_id' => 'nullable|exists:working_locations,id',
            'fase_pembayaran' => 'required|in:Fase 1,Fase 2,Fase 3,Fase 4,Fase 5',
            'tanggal_jatuh_tempo' => 'nullable|date',
            'nominal' => 'required|numeric|min:0',
            'status' => 'required|in:Pending,Paid,Next Phase,Rejected',
            'keterangan' => 'nullable|string',
        ]);

        $v['expense_estimate_id'] = $expense_estimate->id;
        ExpenseEstimateItem::create($v);

        return redirect()->back()->with('success', 'Item berhasil ditambahkan.');
    }

    /**
     * Update item (CC fields)
     */
    public function updateItem(Request $request, ExpenseEstimateItem $item)
    {
        if (!$this->canEditCC($request->user())) return redirect()->back()->withErrors(['error' => 'No permission.']);

        $v = $request->validate([
            'uraian_penggunaan' => 'required|string',
            'working_location_id' => 'nullable|exists:working_locations,id',
            'fase_pembayaran' => 'required|in:Fase 1,Fase 2,Fase 3,Fase 4,Fase 5',
            'tanggal_jatuh_tempo' => 'nullable|date',
            'nominal' => 'required|numeric|min:0',
            'status' => 'required|in:Pending,Paid,Next Phase,Rejected',
            'keterangan' => 'nullable|string',
        ]);

        $item->update($v);
        return redirect()->back()->with('success', 'Item berhasil diperbarui.');
    }

    /**
     * Update item payment (Finance fields only)
     */
    public function updateItemPayment(Request $request, ExpenseEstimateItem $item)
    {
        if (!$this->canEditFinance($request->user())) return redirect()->back()->withErrors(['error' => 'No permission.']);

        $v = $request->validate([
            'tanggal_bayar' => 'nullable|date',
            'nominal_dibayarkan' => 'required|numeric|min:0',
            'status' => 'required|in:Pending,Paid,Next Phase,Rejected',
        ]);

        if ($v['status'] === 'Paid' && $v['nominal_dibayarkan'] != $item->nominal) {
            return redirect()->back()->withErrors(['error' => 'Status tidak bisa Paid jika nominal dibayarkan tidak sama dengan estimasi.']);
        }

        $item->update($v);
        return redirect()->back()->with('success', 'Pembayaran berhasil diperbarui.');
    }

    /**
     * Delete item
     */
    public function destroyItem(Request $request, ExpenseEstimateItem $item)
    {
        if (!$this->canEditCC($request->user())) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $item->delete();
        return redirect()->back()->with('success', 'Item berhasil dihapus.');
    }

    /**
     * Generate letter PDF from selected items
     */
    public function generateLetter(Request $request, ExpenseEstimate $expense_estimate)
    {
        if (!$this->canEditFinance($request->user())) return redirect()->back()->withErrors(['error' => 'No permission.']);

        $v = $request->validate([
            'selected_item_ids' => 'required|array|min:1',
            'selected_item_ids.*' => 'exists:expense_estimate_items,id',
            'custom_total_amount' => 'nullable|numeric|min:0',
        ]);

        $maker = $request->user()->employee;
        if (!$maker) return redirect()->back()->withErrors(['error' => 'Akun Anda belum terhubung ke data karyawan.']);

        $items = ExpenseEstimateItem::whereIn('id', $v['selected_item_ids'])
            ->where('expense_estimate_id', $expense_estimate->id)->get();

        if ($items->isEmpty()) return redirect()->back()->withErrors(['error' => 'Tidak ada item yang dipilih.']);

        $calculatedTotal = $items->sum('nominal');
        $totalAmount = $request->filled('custom_total_amount') ? $v['custom_total_amount'] : $calculatedTotal;
        $company = $expense_estimate->company;
        $companyCode = strtoupper($company->code ?? 'BBB');

        // Generate letter number: {seq}/{code}-FIN/{roman_month}/{year}
        $rom = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
        $count = ExpenseEstimateLetter::whereHas('estimate', fn($q) => $q->where('company_id', $expense_estimate->company_id))
            ->whereYear('date', now()->year)->count() + 1;
        $letterNumber = str_pad($count, 3, '0', STR_PAD_LEFT) . "/{$companyCode}-FIN/{$rom[now()->month - 1]}/" . now()->year;

        $letter = ExpenseEstimateLetter::create([
            'expense_estimate_id' => $expense_estimate->id,
            'letter_number' => $letterNumber,
            'date' => now(),
            'total_amount' => $totalAmount,
            'maker_id' => $maker->id,
            'selected_item_ids' => $v['selected_item_ids'],
        ]);

        return redirect()->back()->with('success', "Surat #{$letter->letter_number} berhasil dibuat.");
    }

    /**
     * Download letter PDF
     */
    public function downloadLetter(Request $request, ExpenseEstimateLetter $letter)
    {
        if (!$this->canAny($request->user())) return redirect()->back()->withErrors(['error' => 'No permission.']);

        $letter->load(['estimate.company', 'maker.position']);

        $pdf = Pdf::loadView('pdfs.expense-estimate-letter', ['letter' => $letter]);
        return $pdf->download("SuratPeminjamanDana_" . str_replace('/', '-', $letter->letter_number) . ".pdf");
    }

    /**
     * Upload signed file(s)
     */
    public function uploadSignedFile(Request $request, ExpenseEstimateLetter $letter)
    {
        if (!$this->canAny($request->user())) return redirect()->back()->withErrors(['error' => 'No permission.']);

        $request->validate(['files' => 'required|array|min:1', 'files.*' => 'file|mimes:pdf,jpg,jpeg,png|max:10240']);

        foreach ($request->file('files') as $file) {
            $path = $file->store('expense-estimate-signed', 'public');
            ExpenseEstimateLetterFile::create([
                'expense_estimate_letter_id' => $letter->id,
                'file_path' => $path,
                'original_name' => $file->getClientOriginalName(),
            ]);
        }

        return redirect()->back()->with('success', 'File berhasil diupload.');
    }

    /**
     * Delete signed file
     */
    public function deleteSignedFile(Request $request, ExpenseEstimateLetterFile $file)
    {
        if (!$this->canEditCC($request->user())) return redirect()->back()->withErrors(['error' => 'No permission.']);

        \Storage::disk('public')->delete($file->file_path);
        $file->delete();
        return redirect()->back()->with('success', 'File berhasil dihapus.');
    }

    /**
     * Download PDF report (items grouped by working location, page break per location)
     */
    public function downloadReport(Request $request, ExpenseEstimate $expense_estimate)
    {
        if (!$this->canAny($request->user())) return redirect()->back()->withErrors(['error' => 'No permission.']);

        $expense_estimate->load(['company', 'items.workingLocation']);
        $grouped = $expense_estimate->items->groupBy(fn($i) => $i->workingLocation->name ?? 'Tanpa Lokasi');

        $pdf = Pdf::loadView('pdfs.expense-estimate-report', [
            'estimate' => $expense_estimate,
            'grouped' => $grouped,
        ]);
        $pdf->setPaper('a4', 'landscape');
        return $pdf->download("EstimasiPengeluaran_{$expense_estimate->company->code}_{$expense_estimate->month}_{$expense_estimate->year}.pdf");
    }

    /**
     * Delete letter (only if no signed files uploaded)
     */
    public function destroyLetter(Request $request, ExpenseEstimateLetter $letter)
    {
        if (!$this->canEditCC($request->user())) return redirect()->back()->withErrors(['error' => 'No permission.']);

        if ($letter->files()->count() > 0) {
            return redirect()->back()->withErrors(['error' => 'Tidak bisa menghapus surat yang sudah ada dokumen tertandatangani.']);
        }

        $letter->delete();
        return redirect()->back()->with('success', 'Surat berhasil dihapus.');
    }

    /**
     * Delete draft
     */
    public function destroy(Request $request, ExpenseEstimate $expense_estimate)
    {
        if (!$this->canEditCC($request->user())) return redirect()->back()->withErrors(['error' => 'No permission.']);
        $expense_estimate->delete();
        return redirect()->route('cost-control.expense-estimates.index')->with('success', 'Draft berhasil dihapus.');
    }
}
