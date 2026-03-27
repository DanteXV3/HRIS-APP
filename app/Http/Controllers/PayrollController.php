<?php

namespace App\Http\Controllers;

use App\Models\Employee;
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
    public function myPayroll(Request $request)
    {
        $employee = Employee::where('user_id', $request->user()->id)->first();

        if (!$employee) {
            return Inertia::render('payrolls/me', [
                'payrolls' => [
                    'data' => [],
                    'total' => 0,
                ],
                'error' => 'Akun Anda tidak terhubung dengan data karyawan.'
            ]);
        }

        $payrolls = PayrollItem::with(['payroll', 'employee'])
            ->where('employee_id', $employee->id)
            ->whereHas('payroll', function($q) {
                $q->where('status', 'finalized'); // Only show finalized payrolls to employees
            })
            ->orderBy(Payroll::select('periode')->whereColumn('payrolls.id', 'payroll_items.payroll_id'), 'desc')
            ->paginate(10);

        return Inertia::render('payrolls/me', [
            'payrolls' => $payrolls,
        ]);
    }

    public function index(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('payroll.view')) {
            abort(403);
        }
        $payrolls = Payroll::with('processedBy')
                           ->orderByDesc('periode')
                           ->paginate(10);
                           
        return Inertia::render('payrolls/index', [
            'payrolls' => $payrolls,
        ]);
    }

    public function generate(Request $request, PayrollService $payrollService)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('payroll.create')) {
            abort(403);
        }
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

    public function show(Request $request, Payroll $payroll)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('payroll.view')) {
            abort(403);
        }
        $payroll->load(['items.employee.position', 'items.employee.department', 'processedBy']);
        return Inertia::render('payrolls/show', [
            'payroll' => $payroll,
        ]);
    }

    public function destroy(Request $request, Payroll $payroll)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('payroll.create')) {
            abort(403);
        }
        if ($payroll->status === 'finalized') {
            return back()->with('error', 'Payroll yang sudah difinalisasi tidak dapat dihapus.');
        }

        $payroll->delete();
        return redirect()->route('payrolls.index')->with('success', 'Payroll berhasil dihapus.');
    }

    public function finalize(Payroll $payroll)
    {
        if (!auth()->user()->isAdmin() && !auth()->user()->hasPermission('payroll.finalize')) {
            abort(403);
        }
        if ($payroll->status === 'finalized') {
            return back()->with('error', 'Payroll ini sudah dalam status finalisasi.');
        }

        $payroll->update(['status' => 'finalized']);
        
        return back()->with('success', 'Payroll berhasil difinalisasi. Semua data slip gaji pada periode ini telah dikunci.');
    }

    public function updateItem(Request $request, Payroll $payroll, PayrollItem $item)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('payroll.edit')) {
            abort(403);
        }
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

    public function downloadPdf(Request $request, Payroll $payroll, PayrollItem $item)
    {
        if ($item->payroll_id !== $payroll->id) {
            abort(404);
        }

        // Permission check for employees
        $user = $request->user();
        if ($user->role !== 'admin' && !$user->hasPermission('payroll.view')) {
            $employee = Employee::where('user_id', $user->id)->first();
            if (!$employee || $item->employee_id !== $employee->id) {
                abort(403, 'Anda tidak memiliki akses ke slip gaji ini.');
            }
            if ($payroll->status !== 'finalized') {
                abort(403, 'Slip gaji periode ini belum difinalisasi.');
            }
        }

        $item->load(['employee.position', 'employee.department', 'employee.workLocation']);
        
        $pdf = Pdf::loadView('pdf.payslip', [
            'payroll' => $payroll,
            'item' => $item,
        ]);

        $fileName = 'Slip_Gaji_' . $item->employee->nama . '_' . $payroll->periode . '.pdf';
        
        return $pdf->download($fileName);
    }

    public function exportExcel(Request $request, Payroll $payroll)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('payroll.view')) {
            abort(403);
        }
        $payroll->load(['items.employee.workLocation']);
        $fileName = 'Laporan_Payroll_' . $payroll->periode . '.xlsx';
        return Excel::download(new PayrollExport($payroll), $fileName);
    }

    public function exportPdfReport(Request $request, Payroll $payroll)
    {
        return $this->exportThpSummary($request, $payroll);
    }

    public function exportThpSummary(Request $request, Payroll $payroll)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('payroll.view')) {
            abort(403);
        }
        $payroll->load(['items.employee.workLocation', 'items.employee.workingLocation']);
        
        $groupedItems = $payroll->items->groupBy(function($item) {
            return $item->work_location_name ?? ($item->employee->workLocation ? $item->employee->workLocation->name : 'Tanpa Perusahaan');
        })->map(function($companyItems) {
            return $companyItems->groupBy(function($item) {
                return $item->working_location_name ?? ($item->employee->workingLocation ? $item->employee->workingLocation->name : 'Tanpa Lokasi');
            });
        });

        $pdf = Pdf::loadView('pdf.summary_thp', [
            'payroll' => $payroll,
            'groupedItems' => $groupedItems,
        ])->setPaper('A4', 'landscape');

        return $pdf->download('Summary_THP_' . $payroll->periode . '.pdf');
    }

    public function exportUangMakanLembur(Request $request, Payroll $payroll)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('payroll.view')) {
            abort(403);
        }
        $payroll->load(['items.employee.workLocation', 'items.employee.workingLocation']);
        
        $groupedItems = $payroll->items->groupBy(function($item) {
            return $item->work_location_name ?? ($item->employee->workLocation ? $item->employee->workLocation->name : 'Tanpa Perusahaan');
        })->map(function($companyItems) {
            return $companyItems->groupBy(function($item) {
                return $item->working_location_name ?? ($item->employee->workingLocation ? $item->employee->workingLocation->name : 'Tanpa Lokasi');
            });
        });

        $pdf = Pdf::loadView('pdf.summary_uang_makan_lembur', [
            'payroll' => $payroll,
            'groupedItems' => $groupedItems,
        ])->setPaper('A4', 'landscape');

        return $pdf->download('Summary_Uang_Makan_Lembur_' . $payroll->periode . '.pdf');
    }

    public function exportBpjs(Request $request, Payroll $payroll)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('payroll.view')) {
            abort(403);
        }
        $payroll->load(['items.employee.workLocation', 'items.employee.workingLocation']);
        
        $groupedItems = $payroll->items->groupBy(function($item) {
            return $item->work_location_name ?? ($item->employee->workLocation ? $item->employee->workLocation->name : 'Tanpa Perusahaan');
        })->map(function($companyItems) {
            return $companyItems->groupBy(function($item) {
                return $item->working_location_name ?? ($item->employee->workingLocation ? $item->employee->workingLocation->name : 'Tanpa Lokasi');
            });
        });

        $pdf = Pdf::loadView('pdf.summary_bpjs', [
            'payroll' => $payroll,
            'groupedItems' => $groupedItems,
        ])->setPaper('A4', 'landscape');

        return $pdf->download('Summary_BPJS_' . $payroll->periode . '.pdf');
    }

    public function exportPph21(Request $request, Payroll $payroll)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('payroll.view')) {
            abort(403);
        }
        $payroll->load(['items.employee.workLocation', 'items.employee.workingLocation']);
        
        $groupedItems = $payroll->items->groupBy(function($item) {
            return $item->work_location_name ?? ($item->employee->workLocation ? $item->employee->workLocation->name : 'Tanpa Perusahaan');
        })->map(function($companyItems) {
            return $companyItems->groupBy(function($item) {
                return $item->working_location_name ?? ($item->employee->workingLocation ? $item->employee->workingLocation->name : 'Tanpa Lokasi');
            });
        });

        $pdf = Pdf::loadView('pdf.summary_pph21', [
            'payroll' => $payroll,
            'groupedItems' => $groupedItems,
        ])->setPaper('A4', 'landscape');

        return $pdf->download('Summary_PPh21_' . $payroll->periode . '.pdf');
    }

    public function exportAttendance(Request $request, Payroll $payroll)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('payroll.view')) {
            abort(403);
        }
        $payroll->load(['items.employee.workLocation', 'items.employee.workingLocation']);

        // Since we didn't have the full summary stored in previous versions, we calculate it here
        foreach ($payroll->items as $item) {
            $employee = $item->employee;
            
            // Re-calculate cutoff window (matching PayrollService logic)
            $payrollYm = $payroll->periode;
            $prevMonthDt = (new \DateTime($payroll->periode . '-01'))->modify('-1 month');
            $prevMonthYm = $prevMonthDt->format('Y-m');
            $payrollMonthDays = (int)date('t', strtotime($payrollYm . '-01'));
            $cutoffDate = $employee->workLocation->payroll_cutoff_date ?? $payrollMonthDays;

            if ($cutoffDate >= $payrollMonthDays) {
                $attStartDate = $payrollYm . '-01';
                $attEndDate = $payrollYm . '-' . $payrollMonthDays;
            } else {
                $startDay = $cutoffDate + 1;
                $attStartDate = $prevMonthYm . '-' . sprintf('%02d', $startDay);
                $attEndDate = $payrollYm . '-' . sprintf('%02d', $cutoffDate);
            }

            $atts = \App\Models\Attendance::where('employee_id', $employee->id)
                ->whereDate('tanggal', '>=', $attStartDate)
                ->whereDate('tanggal', '<=', $attEndDate)
                ->get();

            $item->attendance_summary = [
                'hadir' => $atts->where('status', 'hadir')->count(),
                'sakit' => $atts->where('status', 'sakit')->count(),
                'izin' => $atts->where('status', 'izin')->count(),
                'cuti' => $atts->where('status', 'cuti')->count(),
                'alpha' => $atts->where('status', 'alpha')->count(),
                'libur' => $atts->where('status', 'libur')->count(),
                'late' => $atts->where('is_late', true)->count(),
            ];
        }
        
        $groupedItems = $payroll->items->groupBy(function($item) {
            return $item->work_location_name ?? ($item->employee->workLocation ? $item->employee->workLocation->name : 'Tanpa Perusahaan');
        })->map(function($companyItems) {
            return $companyItems->groupBy(function($item) {
                return $item->working_location_name ?? ($item->employee->workingLocation ? $item->employee->workingLocation->name : 'Tanpa Lokasi');
            });
        });

        $pdf = Pdf::loadView('pdf.report_attendance', [
            'payroll' => $payroll,
            'groupedItems' => $groupedItems,
        ])->setPaper('A4', 'landscape');

        return $pdf->download('Laporan_Absensi_Payroll_' . $payroll->periode . '.pdf');
    }
}
