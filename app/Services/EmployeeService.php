<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\WorkLocation;
use App\Models\Position;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class EmployeeService
{
    public function createEmployee(array $data, ?array $shiftIds = null, ?array $permissions = null): Employee
    {
        return DB::transaction(function () use ($data, $shiftIds, $permissions) {
            // Auto-generate NIK
            $data['nik'] = $this->generateNik($data['work_location_id'], $data['hire_date']);

            // Determine role and create user
            $role = $this->determineRole($data['position_id'], $data['department_id']);
            $user = User::create([
                'name' => $data['nama'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => $role,
            ]);

            $data['user_id'] = $user->id;
            $employee = Employee::create($data);

            if ($shiftIds) {
                $employee->shifts()->sync($shiftIds);
            }

            if ($permissions) {
                $user->permissions()->sync($permissions);
            }

            return $employee;
        });
    }

    public function updateEmployee(Employee $employee, array $data, ?array $shiftIds = null, ?array $permissions = null): Employee
    {
        return DB::transaction(function () use ($employee, $data, $shiftIds, $permissions) {
            // Update user account if it exists
            if ($employee->user) {
                $role = $this->determineRole($data['position_id'] ?? $employee->position_id, $data['department_id'] ?? $employee->department_id);
                $userData = [
                    'name' => $data['nama'] ?? $employee->nama,
                    'email' => $data['email'] ?? $employee->email,
                    'role' => $role,
                ];

                if (!empty($data['password'])) {
                    $userData['password'] = Hash::make($data['password']);
                }

                $employee->user->update($userData);

                if ($permissions !== null) {
                    $employee->user->permissions()->sync($permissions);
                }
            }

            $employee->update($data);

            if ($shiftIds !== null) {
                $employee->shifts()->sync($shiftIds);
            }

            return $employee;
        });
    }

    public function handleFileUploads(Request $request, array $validated): array
    {
        $fileFields = ['photo', 'file_ktp', 'file_npwp', 'file_kk', 'file_ijazah'];

        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                $validated[$field] = $request->file($field)->store("employees/{$field}", 'public');
            } else {
                unset($validated[$field]);
            }
        }

        if ($request->hasFile('file_lainnya')) {
            $paths = [];
            foreach ($request->file('file_lainnya') as $file) {
                $paths[] = $file->store('employees/lainnya', 'public');
            }
            $validated['file_lainnya'] = $paths;
        } else {
            unset($validated['file_lainnya']);
        }

        return $validated;
    }

    public function handleSignature(string $base64, ?Employee $employee = null): string
    {
        $image = str_replace(['data:image/png;base64,', 'data:image/jpeg;base64,', ' '], ['', '', '+'], $base64);
        $id = $employee ? $employee->id : 'new';
        $imageName = "signature_{$id}_" . time() . '.png';
        
        if (!Storage::disk('public')->exists('signatures')) {
            Storage::disk('public')->makeDirectory('signatures');
        }

        Storage::disk('public')->put('signatures/' . $imageName, base64_decode($image));
        
        if ($employee && $employee->signature) {
            Storage::disk('public')->delete($employee->signature);
        }

        return "signatures/{$imageName}";
    }

    public function determineRole(int $positionId, int $departmentId): string
    {
        $position = Position::findOrFail($positionId);
        $department = Department::findOrFail($departmentId);

        // HR Manager grade = admin
        if ($position->grade === 'manager' && $department->code === 'HR') {
            return 'admin';
        }

        return $position->grade; // staff, supervisor, or manager
    }

    public function generateNik(int $workLocationId, string $hireDate): string
    {
        $company = WorkLocation::findOrFail($workLocationId);
        $companyCode = strtoupper($company->code);

        // Count existing employees in this company + 1
        $seq = Employee::where('work_location_id', $workLocationId)->count() + 1;
        $seqFormatted = str_pad($seq, 3, '0', STR_PAD_LEFT);

        $date = Carbon::parse($hireDate);
        $dateFormatted = $date->format('y') . $date->format('d') . $date->format('m');

        return "EMP-{$companyCode}-{$seqFormatted}-{$dateFormatted}";
    }
}
