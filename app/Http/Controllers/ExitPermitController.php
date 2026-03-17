<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\ExitPermit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExitPermitController extends Controller
{
    /**
     * List exit permits:
     *  - Staff: own only
     *  - Supervisor/Manager: same department
     *  - Admin: all
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $employee = $user->employee;

        $query = ExitPermit::with(['employee.department', 'employee.position'])->latest();

        if ($user->role === 'admin') {
            // Admin sees all
        } elseif (in_array($user->role, ['manager', 'supervisor'])) {
            // Supervisor/Manager sees same department
            $query->whereHas('employee', function ($q) use ($employee) {
                $q->where('department_id', $employee->department_id);
            });
        } else {
            // Staff sees only own
            $query->where('employee_id', $employee?->id);
        }

        if ($request->filled('tanggal_start')) {
            $query->where('tanggal', '>=', $request->tanggal_start);
        }
        if ($request->filled('tanggal_end')) {
            $query->where('tanggal', '<=', $request->tanggal_end);
        }

        return Inertia::render('exit-permits/index', [
            'exitPermits' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only('tanggal_start', 'tanggal_end'),
            'userRole' => $user->role,
        ]);
    }

    public function create()
    {
        return Inertia::render('exit-permits/create');
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $employee = $user->employee;

        if (!$employee) {
            return back()->withErrors(['error' => 'Akun Anda belum terhubung dengan data karyawan.']);
        }

        $validated = $request->validate([
            'jam_mulai' => 'required',
            'jam_berakhir' => 'required',
            'keperluan' => 'required|string|max:1000',
        ]);

        ExitPermit::create([
            'employee_id' => $employee->id,
            'tanggal' => now()->toDateString(),
            'jam_mulai' => $validated['jam_mulai'],
            'jam_berakhir' => $validated['jam_berakhir'],
            'keperluan' => $validated['keperluan'],
        ]);

        return redirect()->route('exit-permits.index')->with('success', 'Form keluar berhasil dikirim.');
    }
}
