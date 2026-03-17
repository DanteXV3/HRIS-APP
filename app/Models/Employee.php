<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'lokasi_kerja',
        'user_id',
        // Data Pribadi
        'nama',
        'nik',
        'tempat_lahir',
        'tanggal_lahir',
        'alamat_tetap',
        'alamat_sekarang',
        'email',
        'gender',
        'status_pernikahan',
        'pendidikan_terakhir',
        'agama',
        'no_telpon_1',
        'no_telpon_2',
        'photo',
        // Identity & Documents
        'no_ktp',
        'npwp',
        'no_bpjs_ketenagakerjaan',
        'no_bpjs_kesehatan',
        'file_ktp',
        'file_npwp',
        'file_kk',
        'file_ijazah',
        'file_lainnya',
        'face_descriptor',
        'department_id',
        'position_id',
        'work_location_id',
        'shift_id',
        'status_kepegawaian',
        'hire_date',
        'end_date',
        'is_active',
        // Banking
        'nama_bank',
        'cabang_bank',
        'no_rekening',
        'nama_rekening',
        // Kontak Darurat
        'nama_kontak_darurat_1',
        'no_kontak_darurat_1',
        'nama_kontak_darurat_2',
        'no_kontak_darurat_2',
        // Gaji & Tunjangan
        'gaji_pokok',
        'tunjangan_jabatan',
        'tunjangan_kehadiran',
        'tunjangan_transportasi',
        'uang_makan',
        'uang_lembur',
        'thr',
        'gaji_bpjs_tk',
        'gaji_bpjs_jkn',
        'gross_up',
        // Potongan
        'pinjaman_koperasi',
        'potongan_lain_1',
        'potongan_lain_2',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_lahir' => 'date',
            'hire_date' => 'date',
            'end_date' => 'date',
            'is_active' => 'boolean',
            'file_lainnya' => 'array',
            'gaji_pokok' => 'decimal:2',
            'tunjangan_jabatan' => 'decimal:2',
            'tunjangan_kehadiran' => 'decimal:2',
            'tunjangan_transportasi' => 'decimal:2',
            'uang_makan' => 'decimal:2',
            'uang_lembur' => 'decimal:2',
            'thr' => 'decimal:2',
            'gaji_bpjs_tk' => 'decimal:2',
            'gaji_bpjs_jkn' => 'decimal:2',
            'gross_up' => 'boolean',
            'pinjaman_koperasi' => 'decimal:2',
            'potongan_lain_1' => 'decimal:2',
            'potongan_lain_2' => 'decimal:2',
        ];
    }

    // === Relationships ===

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    public function workLocation(): BelongsTo
    {
        return $this->belongsTo(WorkLocation::class);
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function leaveBalances(): HasMany
    {
        return $this->hasMany(LeaveBalance::class);
    }

    public function payrollItems(): HasMany
    {
        return $this->hasMany(PayrollItem::class);
    }

    // === Helpers ===

    public function getGradeAttribute(): ?string
    {
        return $this->position?->grade;
    }

    public function getTotalPendapatanAttribute(): float
    {
        return $this->gaji_pokok + $this->tunjangan_jabatan + $this->tunjangan_kehadiran
            + $this->tunjangan_transportasi + $this->uang_makan + $this->uang_lembur
            + $this->thr;
    }

    public function getTotalPotonganAttribute(): float
    {
        return $this->pinjaman_koperasi + $this->potongan_lain_1 + $this->potongan_lain_2;
    }
}
