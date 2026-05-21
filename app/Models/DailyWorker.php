<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DailyWorker extends Model
{
    use HasFactory;

    protected $fillable = [
        'working_location_id', 'department_id', 'position_id',
        'nama', 'nik', 'email', 'gender', 'status_pernikahan', 'pendidikan_terakhir', 'agama',
        'tempat_lahir', 'tanggal_lahir', 'alamat_tetap', 'alamat_sekarang',
        'no_telpon_1', 'no_telpon_2', 'photo',
        'no_ktp', 'npwp', 'no_bpjs_ketenagakerjaan', 'no_bpjs_kesehatan',
        'file_ktp', 'file_npwp', 'file_kk', 'file_ijazah', 'file_lainnya',
        'tipe_dw', 'status_kepegawaian', 'hire_date', 'end_date', 'is_active',
        'nama_bank', 'cabang_bank', 'no_rekening', 'nama_rekening',
        'nama_kontak_darurat_1', 'no_kontak_darurat_1', 'nama_kontak_darurat_2', 'no_kontak_darurat_2',
        'gaji_harian', 'gaji_per_jam', 'uang_makan', 'uang_lembur', 'gaji_bpjs_tk', 'gaji_bpjs_jkn',
        'thr', 'pinjaman_koperasi', 'potongan_lain_1', 'potongan_lain_2', 'gross_up', 'work_location_id', 'face_descriptor'
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'hire_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
        'gross_up' => 'boolean',
        'file_lainnya' => 'array',
        'gaji_harian' => 'decimal:2',
        'gaji_per_jam' => 'decimal:2',
        'uang_makan' => 'decimal:2',
        'uang_lembur' => 'decimal:2',
        'gaji_bpjs_tk' => 'decimal:2',
        'gaji_bpjs_jkn' => 'decimal:2',
        'thr' => 'decimal:2',
        'pinjaman_koperasi' => 'decimal:2',
        'potongan_lain_1' => 'decimal:2',
        'potongan_lain_2' => 'decimal:2',
    ];


    public function workingLocation()
    {
        return $this->belongsTo(WorkingLocation::class);
    }

    public function workLocation()
    {
        return $this->belongsTo(WorkLocation::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(DailyWorkerAttendance::class);
    }

    public function activityReportItems(): HasMany
    {
        return $this->hasMany(DailyWorkerActivityReportItem::class);
    }
}
