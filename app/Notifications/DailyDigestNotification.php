<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;
use NotificationChannels\WebPush\WebPushChannel;

class DailyDigestNotification extends Notification
{
    use Queueable;

    protected $prCount;
    protected $leaveCount;
    protected $taskCount;

    public function __construct($prCount, $leaveCount, $taskCount)
    {
        $this->prCount = $prCount;
        $this->leaveCount = $leaveCount;
        $this->taskCount = $taskCount;
    }

    public function via($notifiable)
    {
        return ['database', WebPushChannel::class];
    }

    public function toArray($notifiable)
    {
        return [
            'title' => 'Ringkasan Tugas & Persetujuan Hari Ini',
            'message' => $this->getMessage(),
            'pr_count' => $this->prCount,
            'leave_count' => $this->leaveCount,
            'task_count' => $this->taskCount,
            'type' => 'daily_digest',
        ];
    }

    public function toWebPush($notifiable, $notification)
    {
        return (new WebPushMessage)
            ->title('Ringkasan Hari Ini')
            ->icon('/icon-192.png')
            ->body($this->getMessage())
            ->action('Buka Dashboard', 'view_dashboard')
            ->data(['url' => route('dashboard')]);
    }

    protected function getMessage()
    {
        $parts = [];
        if ($this->prCount > 0) {
            $parts[] = "{$this->prCount} Payment Request";
        }
        if ($this->leaveCount > 0) {
            $parts[] = "{$this->leaveCount} Pengajuan Cuti";
        }
        if ($this->taskCount > 0) {
            $parts[] = "{$this->taskCount} Tugas";
        }

        $summary = implode(', ', $parts);
        return "Selamat pagi! Anda memiliki {$summary} yang menunggu persetujuan atau penyelesaian hari ini.";
    }
}
