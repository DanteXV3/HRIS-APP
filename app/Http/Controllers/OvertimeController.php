<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Overtime;
use App\Models\WorkLocation;
use App\Models\WorkingLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class OvertimeController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $employee = $user->employee;

        $query = Overtime::with(['creator', 'employees', 'approvedBySupervisor', 'approvedByManager', 'workingLocation'])->latest();

        if ($user->isAdmin() || $user->hasPermission('overtime.view_all')) {
            // See all
        } elseif ($employee) {
            $query->where(function ($q) use ($user, $employee) {
                // Own requests (where I am the creator)
                $q->where('creator_id', $employee->id);

                // Involvement: where I am one of the employees listed
                $q->orWhereHas('employees', function($sq) use ($employee) {
                    $sq->where('employees.id', $employee->id);
                });

                // Approval tasks: 1st approval (report to me)
                if ($user->hasPermission('overtime.first_approval')) {
                    $q->orWhereHas('creator', function($sq) use ($employee) {
                        $sq->where('report_to', $employee->id);
                    });
                }

                // Approval tasks: 2nd approval (pending 2nd approval)
                if ($user->hasPermission('overtime.second_approval')) {
                    $q->orWhere('status', 'partially_approved');
                }
                
                // History: already approved or rejected by me
                $q->orWhere('approved_by_supervisor_id', $employee->id)
                  ->orWhere('approved_by_manager_id', $employee->id);
            });
        } else {
            $query->whereRaw('1=0');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return Inertia::render('overtimes/index', [
            'overtimes' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only('status'),
            'userRole' => $user->role,
            'currentEmployeeId' => $employee?->id,
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        if (!$user->isAdmin() && !$user->hasPermission('overtime.create')) {
            abort(403);
        }

        return Inertia::render('overtimes/create', [
            'employees' => Employee::where('is_active', true)->orderBy('nama')->get(['id', 'nama', 'nik']),
            'workingLocations' => WorkingLocation::all(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $employee = $user->employee;

        if (!$employee) {
            return back()->withErrors(['error' => 'Akun Anda belum terhubung dengan data karyawan.']);
        }

        if (!$user->isAdmin() && !$user->hasPermission('overtime.create')) {
             abort(403);
        }

        $validated = $request->validate([
            'employee_ids' => 'required|array|min:1',
            'employee_ids.*' => 'exists:employees,id',
            'tanggal' => 'required|date',
            'jam_mulai' => 'required',
            'jam_berakhir' => 'required',
            'durasi' => 'required|numeric|min:0',
            'working_location_id' => 'required|exists:working_locations,id',
            'keperluan' => 'required|string|max:1000',
        ]);

        DB::transaction(function () use ($validated, $employee) {
            $overtime = Overtime::create([
                'creator_id' => $employee->id,
                'tanggal' => $validated['tanggal'],
                'jam_mulai' => $validated['jam_mulai'],
                'jam_berakhir' => $validated['jam_berakhir'],
                'durasi' => $validated['durasi'],
                'working_location_id' => $validated['working_location_id'],
                'lokasi_kerja' => WorkingLocation::find($validated['working_location_id'])->name, // Fallback string
                'keperluan' => $validated['keperluan'],
                'status' => 'pending',
                'supervisor_status' => 'pending',
                'manager_status' => 'pending',
            ]);

            $overtime->employees()->sync($validated['employee_ids']);
        });

        return redirect()->route('overtimes.index')->with('success', 'Pengajuan lembur berhasil dikirim.');
    }

    public function show(Overtime $overtime)
    {
        $overtime->load(['creator.department', 'employees.department', 'approvedBySupervisor', 'approvedByManager', 'workingLocation']);
        $user = Auth::user();
        $employee = $user->employee;

        return Inertia::render('overtimes/show', [
            'overtime' => $overtime,
            'canFirstApproval' => ($user->isAdmin() || ($user->hasPermission('overtime.first_approval') && $employee?->id === $overtime->creator->report_to)) && $overtime->status === 'pending',
            'canSecondApproval' => ($user->isAdmin() || $user->hasPermission('overtime.second_approval')) && $overtime->status === 'partially_approved',
            'isAdmin' => $user->isAdmin(),
        ]);
    }

    public function approve(Request $request, Overtime $overtime)
    {
        $user = Auth::user();
        $approver = $user->employee;

        if (!$approver && !$user->isAdmin()) {
            return back()->withErrors(['error' => 'Akun Anda belum terhubung dengan data karyawan.']);
        }

        // Logic check for approver id (fallback to 0 for admin if no employee)
        $approverId = $approver?->id ?? 0;

        if ($overtime->status === 'pending') {
            // First Approval
            if (!$user->isAdmin()) {
                if (!$user->hasPermission('overtime.first_approval') || $approverId !== $overtime->creator->report_to) {
                    return back()->withErrors(['error' => 'Anda tidak memiliki wewenang untuk memberikan persetujuan pertama.']);
                }
            }

            $overtime->update([
                'supervisor_status' => 'approved',
                'approved_by_supervisor_id' => $approverId ?: null,
                'supervisor_approved_at' => now(),
                'supervisor_notes' => $request->notes,
                'status' => 'partially_approved',
            ]);
        } elseif ($overtime->status === 'partially_approved') {
            // Second Approval
            if (!$user->isAdmin() && !$user->hasPermission('overtime.second_approval')) {
                return back()->withErrors(['error' => 'Anda tidak memiliki wewenang untuk memberikan persetujuan kedua.']);
            }

            $overtime->update([
                'manager_status' => 'approved',
                'approved_by_manager_id' => $approverId ?: null,
                'manager_approved_at' => now(),
                'manager_notes' => $request->notes,
                'status' => 'approved',
            ]);
        }

        return back()->with('success', 'Pengajuan lembur berhasil disetujui.');
    }

    public function reject(Request $request, Overtime $overtime)
    {
        $user = Auth::user();
        $approver = $user->employee;
        $approverId = $approver?->id ?? 0;

        if ($overtime->status === 'pending') {
            if (!$user->isAdmin()) {
                if (!$user->hasPermission('overtime.first_approval') || $approverId !== $overtime->creator->report_to) {
                    return back()->withErrors(['error' => 'Anda tidak memiliki wewenang untuk menolak pengajuan ini.']);
                }
            }
            $overtime->update([
                'supervisor_status' => 'rejected',
                'status' => 'rejected',
                'approved_by_supervisor_id' => $approverId ?: null,
                'supervisor_approved_at' => now(),
                'supervisor_notes' => $request->notes,
            ]);
        } elseif ($overtime->status === 'partially_approved') {
            if (!$user->isAdmin() && !$user->hasPermission('overtime.second_approval')) {
                return back()->withErrors(['error' => 'Anda tidak memiliki wewenang untuk menolak pengajuan ini.']);
            }
            $overtime->update([
                'manager_status' => 'rejected',
                'status' => 'rejected',
                'approved_by_manager_id' => $approverId ?: null,
                'manager_approved_at' => now(),
                'manager_notes' => $request->notes,
            ]);
        }

        return back()->with('success', 'Pengajuan lembur telah ditolak.');
    }

    public function downloadPdf(Overtime $overtime)
    {
        $overtime->load(['creator.workLocation', 'employees.department', 'employees.position', 'approvedBySupervisor', 'approvedByManager', 'workingLocation']);
        
        // Use work location of the creator for the logo
        $workLocation = $overtime->creator->workLocation;
        
        $pdf = Pdf::loadView('pdf.overtime', [
            'overtime' => $overtime,
            'workLocation' => $workLocation,
        ]);

        return $pdf->download("Form_Lembur_{$overtime->id}.pdf");
    }

    public function whatsappUrl(Overtime $overtime)
    {
        $overtime->load(['creator.department', 'employees']);
        $creator = $overtime->creator;

        // Find the next approver
        $approver = null;
        if ($overtime->status === 'pending') {
            $approver = $creator->reportTo;
        } elseif ($overtime->status === 'partially_approved') {
            $approver = Employee::whereHas('user', function ($q) {
                $q->whereHas('permissions', fn($sq) => $sq->where('slug', 'overtime.second_approval'))
                  ->orWhere('role', 'admin');
            })->where('id', '!=', $creator->id)->first();
        }

        if (!$approver || !$approver->no_telpon_1) {
            return response()->json(['error' => 'Tidak dapat menemukan atasan atau nomor telepon atasan.'], 422);
        }

        // Format phone
        $phone = $approver->no_telpon_1;
        $phone = preg_replace('/[^0-9]/', '', $phone);
        if (str_starts_with($phone, '0')) {
            $phone = '62' . substr($phone, 1);
        } elseif (!str_starts_with($phone, '62')) {
            $phone = '62' . $phone;
        }

        $deptName = $creator->department->name ?? '-';
        $tanggal = \Carbon\Carbon::parse($overtime->tanggal)->format('d/m/Y');
        $jam = $overtime->jam_mulai . ' - ' . $overtime->jam_berakhir;
        $status = ucfirst($overtime->status);
        $comment = $overtime->status === 'partially_approved' ? ($overtime->supervisor_notes ?: '-') : '-';
        
        // Employee list string
        $employeeNames = $overtime->employees->pluck('nama')->implode(', ');

        $message = "Dear Mr/Mrs {$approver->nama}\n\n" .
                  "Silahkan diproses Pengajuan Lembur untuk :\n\n" .
                  "Dibuat Oleh = {$creator->nama}\n" .
                  "Department = {$deptName}\n" .
                  "Karyawan Lembur = {$employeeNames}\n" .
                  "Tanggal = {$tanggal}\n" .
                  "Jam = {$jam}\n" .
                  "Durasi = {$overtime->durasi} jam\n" .
                  "Keperluan = {$overtime->keperluan}\n" .
                  "Status = {$status}\n" .
                  "Comment = {$comment}\n\n" .
                  "Silahkan klik link dibawah ini untuk membuka aplikasi anda.\n\n" .
                  "https://hris.bangunbejanabaja.com/overtimes/{$overtime->id}";

        $url = 'https://wa.me/' . $phone . '?text=' . urlencode($message);

        return response()->json(['url' => $url, 'approver_name' => $approver->nama]);
    }
}
