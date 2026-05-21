<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class PushSubscriptionController extends Controller
{
    /**
     * Store a new push subscription.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'endpoint' => 'required',
            'keys.auth' => 'required',
            'keys.p256dh' => 'required',
        ]);

        $endpoint = $request->endpoint;
        $key = $request->keys['p256dh'];
        $token = $request->keys['auth'];
        $contentEncoding = $request->content_encoding ?? 'aesgcm';

        $request->user()->updatePushSubscription(
            $endpoint,
            $key,
            $token,
            $contentEncoding
        );

        // Send a test notification to verify
        $request->user()->notify(new \App\Notifications\TestPushNotification());

        return response()->json([
            'success' => true,
            'message' => 'Subscription stored successfully.',
        ]);
    }

    /**
     * Delete a push subscription.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'endpoint' => 'required',
        ]);

        $request->user()->deletePushSubscription($request->endpoint);

        return response()->json([
            'success' => true,
            'message' => 'Subscription deleted successfully.',
        ]);
    }

    /**
     * Send a test notification.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function test(Request $request)
    {
        $request->user()->notify(new \App\Notifications\TestPushNotification());

        return response()->json([
            'success' => true,
            'message' => 'Test notification sent!',
        ]);
    }

    /**
     * Get latest unread notifications for periodic sync.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function unread(Request $request)
    {
        $notifications = $request->user()->unreadNotifications()
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($n) {
                return [
                    'id' => $n->id,
                    'title' => $n->data['title'] ?? 'HRIS Notification',
                    'body' => $n->data['message'] ?? '',
                    'url' => $n->data['url'] ?? '/',
                ];
            });

        return response()->json($notifications);
    }
}
