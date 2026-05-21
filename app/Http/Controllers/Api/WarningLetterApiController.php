<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\WarningLetter;
use Illuminate\Http\Request;

class WarningLetterApiController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();

        if (!$employee) {
            return response()->json(['message' => 'Akun tidak terhubung dengan data karyawan.'], 404);
        }

        $query = WarningLetter::with(['employee.position', 'employee.department', 'issuer']);
        
        // Force to only show their own warning letters for mobile app
        $query->where('employee_id', $employee->id);

        $letters = $query->orderByDesc('issued_date')
            ->get()
            ->map(fn($sp) => [
                'id' => $sp->id,
                'employee_name' => $sp->employee?->nama,
                'employee_nik' => $sp->employee?->nik,
                'department' => $sp->employee?->department?->name,
                'position' => $sp->employee?->position?->name,
                'level' => $sp->level,
                'level_roman' => $sp->level_roman,
                'reference_number' => $sp->reference_number,
                'reason' => $sp->reason,
                'description' => $sp->description,
                'issued_date' => $sp->issued_date?->format('Y-m-d'),
                'valid_until' => $sp->valid_until?->format('Y-m-d'),
                'issuer_name' => $sp->issuer?->nama,
                'status' => $sp->status,
            ]);

        return response()->json(['warning_letters' => $letters]);
    }
}
