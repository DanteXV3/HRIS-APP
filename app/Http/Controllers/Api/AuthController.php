<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login and issue a Sanctum token.
     * POST /api/auth/login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
            'device_name' => 'required|string', // e.g. "Samsung Galaxy S24"
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        // Create token with abilities matching user's permissions
        $token = $user->createToken($request->device_name)->plainTextToken;

        // Load employee + permissions
        $user->load(['employee.position', 'employee.department', 'employee.workLocation', 'employee.workingLocation', 'permissions']);

        $permissions = $user->isAdmin()
            ? \App\Models\Permission::pluck('slug')->toArray()
            : $user->permissions->pluck('slug')->toArray();

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'permissions' => $permissions,
                'employee' => $user->employee ? [
                    'id' => $user->employee->id,
                    'nama' => $user->employee->nama,
                    'nik' => $user->employee->nik,
                    'email' => $user->employee->email,
                    'phone' => $user->employee->no_telpon_1,
                    'address' => $user->employee->alamat_sekarang,
                    'gender' => $user->employee->gender,
                    'birth_date' => $user->employee->tanggal_lahir?->format('Y-m-d'),
                    'hire_date' => $user->employee->hire_date?->format('Y-m-d'),
                    'bank_name' => $user->employee->nama_bank,
                    'bank_account' => $user->employee->no_rekening,
                    'photo' => $user->employee->photo,
                    'position' => $user->employee->position?->name,
                    'department' => $user->employee->department?->name,
                    'work_location' => $user->employee->workLocation?->name,
                    'working_location' => $user->employee->workingLocation?->name,
                    'working_location_id' => $user->employee->working_location_id,
                ] : null,
            ],
        ]);
    }

    /**
     * Logout (revoke current token).
     * POST /api/auth/logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Berhasil logout.']);
    }

    /**
     * Update FCM Token for push notifications
     * POST /api/auth/fcm-token
     */
    public function updateFcmToken(Request $request)
    {
        $request->validate([
            'fcm_token' => 'required|string',
        ]);

        $user = $request->user();
        $user->fcm_token = $request->fcm_token;
        $user->save();

        return response()->json(['message' => 'FCM Token updated.']);
    }

    /**
     * Get current authenticated user profile.
     * GET /api/me
     */
    public function me(Request $request)
    {
        $user = $request->user();
        $user->load(['employee.position', 'employee.department', 'employee.workLocation', 'employee.workingLocation', 'permissions']);

        $permissions = $user->isAdmin()
            ? \App\Models\Permission::pluck('slug')->toArray()
            : $user->permissions->pluck('slug')->toArray();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'permissions' => $permissions,
                'employee' => $user->employee ? [
                    'id' => $user->employee->id,
                    'nama' => $user->employee->nama,
                    'nik' => $user->employee->nik,
                    'email' => $user->employee->email,
                    'phone' => $user->employee->no_telpon_1,
                    'address' => $user->employee->alamat_sekarang,
                    'gender' => $user->employee->gender,
                    'birth_date' => $user->employee->tanggal_lahir?->format('Y-m-d'),
                    'hire_date' => $user->employee->hire_date?->format('Y-m-d'),
                    'bank_name' => $user->employee->nama_bank,
                    'bank_account' => $user->employee->no_rekening,
                    'photo' => $user->employee->photo,
                    'position' => $user->employee->position?->name,
                    'department' => $user->employee->department?->name,
                    'work_location' => $user->employee->workLocation?->name,
                    'working_location' => $user->employee->workingLocation?->name,
                    'working_location_id' => $user->employee->working_location_id,
                ] : null,
            ],
        ]);
    }
}