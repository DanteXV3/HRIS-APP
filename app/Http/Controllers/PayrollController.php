<?php

namespace App\Http\Controllers;

use App\Models\Payroll;
use App\Models\PayrollItem;
use App\Models\WorkLocation;
use App\Services\PayrollService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\PayrollExport;
use Exception;

class PayrollController extends Controller
{
    public function index(Request $request)
    {
        $payrolls = Payroll::with('processedBy')
                           ->orderByDesc('periode')
                           ->paginate(10);
                           
        return Inertia::render('payrolls/index', [
            'payrolls' => $payrolls,
        ]);
    }

    public function generate(Request $request, PayrollService $payrollService)
    {
        $validated = $request->validate([
            'periode' => 'required|string|regex:/^\d{4}-\d{2}$/', // YYYY-MM
            'notes' => 'nullable|string',
        ]);

        try {
            $payrollService->generatePayroll(
                $validated['periode'], 
                $request->user()->id, 
                $validated['notes'] ?? null
            );

            return redirect()->route('payrolls.index')
                             ->with('success', 'Payroll periode ' . $validated['periode'] . ' berhasil diproses.');
        } catch (Exception $e) {
            return back()->with('error', 'Gagal memproses payroll: ' . $e->getMessage());
        }
    }

    public function show(Payroll $payroll)
    {
        $payroll->load(['items.employee.position', 'items.employee.department', 'processedBy']);
        return Inertia::render('payrolls/show', [
            'payroll' => $payroll,
        ]);
    }

    public function destroy(Payroll $payroll)
    {
        if ($payroll->status === 'finalized') {
            return back()->with('error', 'Payroll yang sudah difinalisasi tidak dapat dihapus.');
        }

        $payroll->delete();
        return redirect()->route('payrolls.index')->with('success', 'Payroll berhasil dihapus.');
    }

    public function finalize(Payroll $payroll)
    {
        if ($payroll->status === 'finalized') {
            return back()->with('error', 'Payroll ini sudah dalam status finalisasi.');
        }

        $payroll->update(['status' => 'finalized']);
        
        return back()->with('success', 'Payroll berhasil difinalisasi. Semua data slip gaji pada periode ini telah dikunci.');
    }

    public function updateItem(Request $request, Payroll $payroll, PayrollItem $item)
    {
        if ($payroll->status === 'finalized') {
            return back()->with('error', 'Payroll yang sudah difinalisasi tidak dapat diubah.');
        }

        if ($item->payroll_id !== $payroll->id) {
            abort(404);
        }

        $validated = $request->validate([
            'gaji_pokok' => 'required|numeric|min:0',
            'tunjangan_jabatan' => 'required|numeric|min:0',
            'tunjangan_kehadiran' => 'required|numeric|min:0',
            'tunjangan_transportasi' => 'required|numeric|min:0',
            'uang_makan' => 'required|numeric|min:0',
            'uang_lembur' => 'required|numeric|min:0',
            'thr' => 'required|numeric|min:0',
            'tunjangan_pajak' => 'required|numeric|min:0',
            'potongan_bpjs_tk' => 'required|numeric|min:0',
            'potongan_bpjs_jkn' => 'required|numeric|min:0',
            'potongan_pph21' => 'required|numeric|min:0',
            'pinjaman_koperasi' => 'required|numeric|min:0',
            'potongan_lain_1' => 'required|numeric|min:0',
            'potongan_lain_2' => 'required|numeric|min:0',
        ]);

        $totalPendapatan = 
            $validated['gaji_pokok'] + 
            $validated['tunjangan_jabatan'] + 
            $validated['tunjangan_kehadiran'] + 
            $validated['tunjangan_transportasi'] + 
            $validated['uang_makan'] + 
            $validated['uang_lembur'] + 
            $validated['thr'] + 
            $validated['tunjangan_pajak'];

        $totalPotongan = 
            $validated['potongan_bpjs_tk'] + 
            $validated['potongan_bpjs_jkn'] + 
            $validated['potongan_pph21'] + 
            $validated['pinjaman_koperasi'] + 
            $validated['potongan_lain_1'] + 
            $validated['potongan_lain_2'];

        $gajiBersih = $totalPendapatan - $totalPotongan;

        $item->update(array_merge($validated, [
            'total_pendapatan' => $totalPendapatan,
            'total_potongan' => $totalPotongan,
            'gaji_bersih' => $gajiBersih,
        ]));

        return back()->with('success', 'Rincian gaji berhasil diperbarui.');
    }

    public function downloadPdf(Payroll $payroll, PayrollItem $item)
    {
        if ($item->payroll_id !== $payroll->id) {
            abort(404);
        }

        $item->load(['employee.position', 'employee.department', 'employee.workLocation']);
        
        $pdf = Pdf::loadView('pdf.payslip', [
            'payroll' => $payroll,
            'item' => $item,
        ]);

        $fileName = 'Slip_Gaji_' . $item->employee->nama . '_' . $payroll->periode . '.pdf';
        
        return $pdf->download($fileName);
    }

    public function exportExcel(Payroll $payroll)
    {
        $payroll->load(['items.employee.workLocation']);
        $fileName = 'Laporan_Payroll_' . $payroll->periode . '.xlsx';
        return Excel::download(new PayrollExport($payroll), $fileName);
    }

    public function exportPdfReport(Payroll $payroll)
    {
        $payroll->load(['items.employee.workLocation']);
        
        // Group items by company (work location)
        $groupedItems = $payroll->items->groupBy(function($item) {
            return $item->employee->workLocation ? $item->employee->workLocation->name : 'Tanpa Perusahaan';
        });

        $pdf = Pdf::loadView('pdf.payroll_report', [
            'payroll' => $payroll,
            'groupedItems' => $groupedItems,
        ])->setPaper('A4', 'landscape');

        $fileName = 'Laporan_Ringkasan_Payroll_' . $payroll->periode . '.pdf';
        
        return $pdf->download($fileName);
    }
}
