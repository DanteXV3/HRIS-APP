<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Payroll;
use App\Models\PayrollItem;
use Illuminate\Http\Request;

class PayslipApiController extends Controller
{
    /**
     * Get my payslip history.
     * GET /api/payslips
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();

        if (!$employee) {
            return response()->json(['message' => 'Akun tidak terhubung dengan data karyawan.'], 404);
        }

        $payslips = PayrollItem::with('payroll')
            ->where('employee_id', $employee->id)
            ->whereHas('payroll', fn($q) => $q->where('status', 'finalized'))
            ->get()
            ->sortByDesc(fn($item) => $item->payroll->periode)
            ->values()
            ->map(fn($item) => [
                'id' => $item->id,
                'payroll_id' => $item->payroll_id,
                'periode' => $item->payroll->periode,
                'gaji_pokok' => (float)$item->gaji_pokok,
                'total_pendapatan' => (float)$item->total_pendapatan,
                'total_potongan' => (float)$item->total_potongan,
                'gaji_bersih' => (float)$item->gaji_bersih,
            ]);

        return response()->json(['payslips' => $payslips]);
    }

    /**
     * Get single payslip detail.
     * GET /api/payslips/{payrollItem}
     */
    public function show(Request $request, PayrollItem $payrollItem)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();

        if (!$employee || $payrollItem->employee_id !== $employee->id) {
            return response()->json(['message' => 'Tidak diizinkan melihat slip gaji ini.'], 403);
        }

        // Only allow viewing finalized payslips
        $payrollItem->load('payroll');
        if ($payrollItem->payroll->status !== 'finalized') {
            return response()->json(['message' => 'Slip gaji belum difinalisasi.'], 403);
        }

        return response()->json([
            'payslip' => [
                'id' => $payrollItem->id,
                'periode' => $payrollItem->payroll->periode,
                'employee_name' => $payrollItem->employee_name,
                'employee_nik' => $payrollItem->employee_nik,
                'position' => $payrollItem->position_name,
                'department' => $payrollItem->department_name,
                // Earnings
                'gaji_pokok' => (float)$payrollItem->gaji_pokok,
                'tunjangan_jabatan' => (float)$payrollItem->tunjangan_jabatan,
                'tunjangan_kehadiran' => (float)$payrollItem->tunjangan_kehadiran,
                'tunjangan_transportasi' => (float)$payrollItem->tunjangan_transportasi,
                'uang_makan' => (float)$payrollItem->uang_makan,
                'uang_lembur' => (float)$payrollItem->uang_lembur,
                'thr' => (float)$payrollItem->thr,
                'tunjangan_pajak' => (float)$payrollItem->tunjangan_pajak,
                'total_pendapatan' => (float)$payrollItem->total_pendapatan,
                // Deductions
                'potongan_bpjs_tk' => (float)$payrollItem->potongan_bpjs_tk,
                'potongan_bpjs_jkn' => (float)$payrollItem->potongan_bpjs_jkn,
                'potongan_pph21' => (float)$payrollItem->potongan_pph21,
                'pinjaman_koperasi' => (float)$payrollItem->pinjaman_koperasi,
                'potongan_lain_1' => (float)$payrollItem->potongan_lain_1,
                'potongan_lain_2' => (float)$payrollItem->potongan_lain_2,
                'total_potongan' => (float)$payrollItem->total_potongan,
                // Net
                'gaji_bersih' => (float)$payrollItem->gaji_bersih,
            ],
        ]);
    }

    /**
     * Download payslip PDF.
     * GET /api/payslips/{payrollItem}/pdf
     */
    public function downloadPdf(Request $request, PayrollItem $payrollItem)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();

        if (!$employee || $payrollItem->employee_id !== $employee->id) {
            return response()->json(['message' => 'Tidak diizinkan mengunduh slip gaji ini.'], 403);
        }

        $payrollItem->load(['payroll', 'employee.position', 'employee.department', 'employee.workLocation']);
        
        if ($payrollItem->payroll->status !== 'finalized') {
            return response()->json(['message' => 'Slip gaji belum difinalisasi.'], 403);
        }

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.payslip', [
            'payroll' => $payrollItem->payroll,
            'item' => $payrollItem
        ]);

        $empName = str_replace(' ', '_', $payrollItem->employee->nama ?? 'Karyawan');
        $fileName = "Slip_Gaji_{$empName}_{$payrollItem->payroll->periode}.pdf";

        return $pdf->download($fileName);
    }
}
