<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExitPermit extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'tanggal',
        'jam_mulai',
        'jam_berakhir',
        'keperluan',
    ];

    public static function booted()
    {
        static::created(function ($permit) {
            $manager = $permit->employee->reportTo;
            if ($manager && $manager->user) {
                \App\Services\FirebaseService::sendToUser(
                    $manager->user,
                    'Pengajuan Izin Keluar',
                    "Karyawan {$permit->employee->nama} mengajukan izin keluar.",
                    ['screen' => '/exit-permits', 'id' => (string)$permit->id]
                );
            }
        });
    }

    protected function casts(): array
    {
        return [
            'tanggal' => 'date',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
