<?php

return [

    /**
     * These are the keys for authentication.
     *
     * @see https://tools.ietf.org/html/rfc8292
     */
    'vapid' => [
        'subject' => env('VAPID_SUBJECT', 'mailto:admin@hris.bangunbejanabaja.com'),
        'public_key' => env('VAPID_PUBLIC_KEY'),
        'private_key' => env('VAPID_PRIVATE_KEY'),
        'pem_file' => env('VAPID_PEM_FILE'),
    ],

    /**
     * This is the Model that will be using the HasPushSubscriptions trait.
     */
    'model' => \NotificationChannels\WebPush\PushSubscription::class,

    /**
     * The Guzzle client options.
     */
    'client_options' => [],

];
