<?php

namespace App\Notifications;

use App\Models\PaymentRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;
use NotificationChannels\WebPush\WebPushChannel;

class PaymentRequestNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $pr;
    protected $status; // 'pending', 'approved', 'rejected'
    protected $level;  // e.g., 'tax', 'finance'
    protected $rejectionNotes;

    public function __construct(PaymentRequest $pr, string $status, ?string $level = null, ?string $rejectionNotes = null)
    {
        $this->pr = $pr;
        $this->status = $status;
        $this->level = $level;
        $this->rejectionNotes = $rejectionNotes;
    }

    public function via($notifiable)
    {
        return ['database', WebPushChannel::class];
    }

    public function toArray($notifiable)
    {
        $data = [
            'pr_id' => $this->pr->id,
            'pr_number' => $this->pr->pr_number,
            'url' => route('payment-requests.show', $this->pr->id),
        ];

        if ($this->status === 'pending') {
            $data['title'] = 'Persetujuan Payment Request';
            $data['message'] = "Menunggu persetujuan Anda ({$this->level}) untuk PR {$this->pr->pr_number} - {$this->pr->subject}";
            $data['type'] = 'pr_pending_approval';
        } elseif ($this->status === 'approved') {
            $data['title'] = 'Payment Request Disetujui';
            $data['message'] = "Pengajuan Payment Request {$this->pr->pr_number} Anda telah disetujui sepenuhnya.";
            $data['type'] = 'pr_fully_approved';
        } elseif ($this->status === 'rejected') {
            $data['title'] = 'Payment Request Ditolak';
            $data['message'] = "Pengajuan PR {$this->pr->pr_number} ditolak. Alasan: " . ($this->rejectionNotes ?: 'Tidak ada alasan yang diberikan.');
            $data['type'] = 'pr_rejected';
        }

        return $data;
    }

    public function toWebPush($notifiable, $notification)
    {
        $body = '';
        $title = '';
        
        if ($this->status === 'pending') {
            $title = 'Persetujuan Payment Request';
            $body = "Butuh persetujuan Anda untuk PR {$this->pr->pr_number}";
        } elseif ($this->status === 'approved') {
            $title = 'PR Disetujui';
            $body = "PR {$this->pr->pr_number} Anda telah disetujui sepenuhnya.";
        } elseif ($this->status === 'rejected') {
            $title = 'PR Ditolak';
            $body = "PR {$this->pr->pr_number} Anda ditolak: {$this->rejectionNotes}";
        }

        return (new WebPushMessage)
            ->title($title)
            ->icon('/icon-192.png')
            ->body($body)
            ->action('Buka PR', 'view_pr')
            ->data(['url' => route('payment-requests.show', $this->pr->id)]);
    }
}
