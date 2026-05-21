<?php

namespace App\Notifications;

use App\Models\ExitPermit;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;
use NotificationChannels\WebPush\WebPushChannel;

class ExitPermitNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $exitPermit;

    public function __construct(ExitPermit $exitPermit)
    {
        $this->exitPermit = $exitPermit;
    }

    public function via($notifiable)
    {
        return ['database', WebPushChannel::class];
    }

    public function toArray($notifiable)
    {
        $employeeName = $this->exitPermit->employee->nama;
        return [
            'title' => 'Izin Keluar',
            'message' => "{$employeeName} telah membuat form izin keluar untuk keperluan: {$this->exitPermit->keperluan}.",
            'url' => route('exit-permits.index'),
            'exit_permit_id' => $this->exitPermit->id,
            'type' => 'exit_permit',
        ];
    }

    public function toWebPush($notifiable, $notification)
    {
        $employeeName = $this->exitPermit->employee->nama;
        return (new WebPushMessage)
            ->title('Izin Keluar')
            ->icon('/icon-192.png')
            ->body("{$employeeName} telah membuat form izin keluar.")
            ->action('Lihat Detail', 'view_exit')
            ->data(['url' => route('exit-permits.index')]);
    }
}
