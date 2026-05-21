<?php

namespace App\Notifications;

use App\Models\AttendanceCorrection;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;
use NotificationChannels\WebPush\WebPushChannel;

class AttendanceCorrectionNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $correction;

    public function __construct(AttendanceCorrection $correction)
    {
        $this->correction = $correction;
    }

    public function via($notifiable)
    {
        return ['database', WebPushChannel::class];
    }

    public function toArray($notifiable)
    {
        $employeeName = $this->correction->employee->nama;
        return [
            'title' => 'Koreksi Absensi',
            'message' => "{$employeeName} mengajukan koreksi absensi untuk tanggal {$this->correction->tanggal->format('d/m/Y')}.",
            'url' => route('attendance-corrections.index'),
            'correction_id' => $this->correction->id,
            'type' => 'attendance_correction_request',
        ];
    }

    public function toWebPush($notifiable, $notification)
    {
        $employeeName = $this->correction->employee->nama;
        return (new WebPushMessage)
            ->title('Koreksi Absensi')
            ->icon('/icon-192.png')
            ->body("Permintaan koreksi absensi baru dari {$employeeName}.")
            ->action('Lihat Permintaan', 'view_corrections')
            ->data(['url' => route('attendance-corrections.index')]);
    }
}
