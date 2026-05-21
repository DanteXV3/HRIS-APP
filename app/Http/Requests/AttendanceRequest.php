<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin() || $this->user()->hasPermission('attendance.create_others') || $this->user()->hasPermission('attendance.edit_others');
    }

    public function rules(): array
    {
        return [
            'employee_id' => 'sometimes|required|exists:employees,id',
            'tanggal' => 'required|date',
            'clock_in' => 'nullable|string',
            'clock_out' => 'nullable|string',
            'status' => 'required|in:hadir,izin,sakit,cuti,alpha,libur',
            'is_holiday' => 'required|boolean',
            'verified_lembur_hours' => 'required|numeric|min:0',
            'jam_masuk' => 'nullable|date_format:H:i',
            'jam_pulang' => 'nullable|date_format:H:i',
            'notes' => 'nullable|string',
        ];
    }
}
