<?php

namespace App\Notifications;

use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;
use NotificationChannels\WebPush\WebPushChannel;

class TaskAssignedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $task;

    public function __construct(Task $task)
    {
        $this->task = $task;
    }

    public function via($notifiable)
    {
        return ['database', WebPushChannel::class];
    }

    public function toArray($notifiable)
    {
        $creatorName = $this->task->creator->nama ?? 'Seseorang';
        return [
            'title' => 'Tugas Baru',
            'message' => "{$creatorName} telah memberikan Anda tugas baru: {$this->task->title}",
            'url' => route('tasks.index'),
            'task_id' => $this->task->id,
            'type' => 'task_assigned',
        ];
    }

    public function toWebPush($notifiable, $notification)
    {
        $creatorName = $this->task->creator->nama ?? 'Seseorang';
        return (new WebPushMessage)
            ->title('Tugas Baru')
            ->icon('/icon-192.png')
            ->body("{$creatorName} memberikan Anda tugas: {$this->task->title}")
            ->action('Lihat Tugas', 'view_tasks')
            ->data(['url' => route('tasks.index')]);
    }
}
