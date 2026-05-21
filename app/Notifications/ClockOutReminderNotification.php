<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;
use NotificationChannels\WebPush\WebPushChannel;

class ClockOutReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $shiftEndTime;

    public function __construct($shiftEndTime)
    {
        $this->shiftEndTime = $shiftEndTime;
    }

    public function via($notifiable)
    {
        return ['database', WebPushChannel::class];
    }

    public function toArray($notifiable)
    {
        return [
            'title' => 'Pengingat Clock Out',
            'message' => "Anda belum melakukan Clock Out (Jam pulang: {$this->shiftEndTime}). Jangan lupa mencatat kepulangan Anda!",
            'url' => route('attendances.me'),
            'type' => 'clock_out_reminder',
        ];
    }

    public function toWebPush($notifiable, $notification)
    {
        return (new WebPushMessage)
            ->title('Pengingat Clock Out')
            ->icon('/icon-192.png')
            ->body("Anda belum melakukan Clock Out (Jam pulang: {$this->shiftEndTime}).")
            ->action('Absensi Saya', 'view_attendance')
            ->data(['url' => route('attendances.me')]);
    }
}
