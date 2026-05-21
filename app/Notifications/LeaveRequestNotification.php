<?php

namespace App\Notifications;

use App\Models\LeaveRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;
use NotificationChannels\WebPush\WebPushChannel;

class LeaveRequestNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $leaveRequest;
    protected $type; // 'submitted', 'approved', 'rejected'

    public function __construct(LeaveRequest $leaveRequest, $type)
    {
        $this->leaveRequest = $leaveRequest;
        $this->type = $type;
    }

    public function via($notifiable)
    {
        return ['database', WebPushChannel::class];
    }

    public function getMessage()
    {
        $employeeName = $this->leaveRequest->employee->nama;
        switch ($this->type) {
            case 'submitted':
                return "Pengajuan cuti baru dari {$employeeName} menunggu persetujuan Anda.";
            case 'approved':
                return "Pengajuan cuti Anda telah disetujui.";
            case 'rejected':
                return "Pengajuan cuti Anda telah ditolak.";
            case 'partially_approved':
                return "Pengajuan cuti {$employeeName} telah disetujui tahap pertama dan menunggu persetujuan Anda.";
            default:
                return "Pembaruan status pengajuan cuti.";
        }
    }

    public function toArray($notifiable)
    {
        return [
            'title' => 'Pengajuan Cuti',
            'message' => $this->getMessage(),
            'url' => route('leaves.show', $this->leaveRequest->id),
            'leave_request_id' => $this->leaveRequest->id,
            'type' => 'leave_request_' . $this->type,
        ];
    }

    public function toWebPush($notifiable, $notification)
    {
        return (new WebPushMessage)
            ->title('Pengajuan Cuti')
            ->icon('/icon-192.png')
            ->body($this->getMessage())
            ->action('Lihat Detail', 'view_leave')
            ->data(['url' => route('leaves.show', $this->leaveRequest->id)]);
    }
}
