<?php

namespace App\Services;

use App\Models\User;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;
use Kreait\Laravel\Firebase\Facades\Firebase;

class FirebaseService
{
    /**
     * Send a notification to a specific user.
     * Best-effort: failures are logged but never throw, so approval flows aren't interrupted.
     */
    public static function sendToUser(User $user, string $title, string $body, array $data = [])
    {
        try {
            if (!$user->fcm_token) {
                return false;
            }

            $messaging = Firebase::messaging();

            // kreait/firebase-php v8.x: withTarget() was removed.
            // Use CloudMessage::new()->withToken() instead.
            $message = CloudMessage::new()
                ->withToken($user->fcm_token)
                ->withNotification(Notification::create($title, $body))
                ->withData($data);

            $messaging->send($message);
            return true;
        } catch (\Exception $e) {
            \Log::error("FCM Send Error for user {$user->id}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Send a notification to multiple users.
     * Best-effort: failures are logged but never throw.
     */
    public static function sendToUsers($users, string $title, string $body, array $data = [])
    {
        try {
            $messaging = Firebase::messaging();
            $tokens = $users->pluck('fcm_token')->filter()->toArray();

            if (empty($tokens)) {
                return false;
            }

            $message = CloudMessage::new()
                ->withNotification(Notification::create($title, $body))
                ->withData($data);

            $messaging->sendMulticast($message, $tokens);
            return true;
        } catch (\Exception $e) {
            \Log::error("FCM Multicast Error: " . $e->getMessage());
            return false;
        }
    }
}
