<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;
use NotificationChannels\WebPush\WebPushChannel;

class TaskReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $taskCount;

    public function __construct($taskCount)
    {
        $this->taskCount = $taskCount;
    }

    public function via($notifiable)
    {
        return ['database', WebPushChannel::class];
    }

    public function toArray($notifiable)
    {
        return [
            'title' => 'Pengingat Tugas',
            'message' => "Anda memiliki {$this->taskCount} tugas yang perlu diselesaikan hari ini.",
            'url' => route('dashboard'),
            'type' => 'task_reminder',
        ];
    }

    public function toWebPush($notifiable, $notification)
    {
        return (new WebPushMessage)
            ->title('Pengingat Tugas')
            ->icon('/icon-192.png')
            ->body("Anda memiliki {$this->taskCount} tugas yang perlu diselesaikan hari ini.")
            ->action('Lihat Dashboard', 'view_dashboard')
            ->data(['url' => route('dashboard')]);
    }
}
