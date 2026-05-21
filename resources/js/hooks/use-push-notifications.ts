import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * Convert base64 VAPID key to Uint8Array for browser consumption
 */
function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function usePushNotifications() {
    const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(
        typeof Notification !== 'undefined' ? Notification.permission : 'default'
    );
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);

    // Check existing subscription on mount
    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.pushManager.getSubscription().then(async (subscription) => {
                    setIsSubscribed(!!subscription);

                    // Auto-register periodic sync if subscribed
                    if (subscription && 'periodicSync' in registration) {
                        try {
                            // @ts-ignore
                            const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
                            if (status.state === 'granted') {
                                // @ts-ignore
                                await registration.periodicSync.register('check-notifications', {
                                    minInterval: 60 * 60 * 1000,
                                });
                            }
                        } catch (e) {
                            console.warn('Auto-register periodic sync failed:', e);
                        }
                    }
                });
            });
        }
    }, []);

    const subscribe = useCallback(async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.error('Push notifications are not supported in this browser.');
            return;
        }

        setLoading(true);

        try {
            // 1. Request Permission
            const permission = await Notification.requestPermission();
            setPermissionStatus(permission);

            if (permission !== 'granted') {
                throw new Error('Notification permission denied');
            }

            // 2. Get VAPID public key from meta tag
            const vapidPublicKey = document.head
                .querySelector('meta[name="vapid-public-key"]')
                ?.getAttribute('content');

            if (!vapidPublicKey) {
                throw new Error('VAPID public key not found in meta tags');
            }

            // 3. Register for Push
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
            });

            // 4. Send subscription to Laravel backend
            await axios.post('/push-subscriptions', subscription.toJSON());
            
            // 5. Register for Periodic Background Sync if supported
            if ('periodicSync' in registration) {
                try {
                    // @ts-ignore
                    const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
                    if (status.state === 'granted') {
                        // @ts-ignore
                        await registration.periodicSync.register('check-notifications', {
                            minInterval: 60 * 60 * 1000, // Check every hour
                        });
                        console.log('Periodic background sync registered!');
                    }
                } catch (e) {
                    console.warn('Periodic background sync could not be registered:', e);
                }
            }
            
            setIsSubscribed(true);
        } catch (error) {
            console.error('Failed to subscribe to push notifications:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const unsubscribe = useCallback(async () => {
        setLoading(true);
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                // Inform backend to remove subscription
                await axios.post('/push-subscriptions/delete', {
                    endpoint: subscription.endpoint,
                });
                
                // Remove from browser
                await subscription.unsubscribe();
                setIsSubscribed(false);
            }
        } catch (error) {
            console.error('Failed to unsubscribe from push notifications:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const sendTestNotification = useCallback(async () => {
        setLoading(true);
        try {
            await axios.post('/push-subscriptions/test', {});
        } catch (error) {
            console.error('Failed to send test notification:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        permissionStatus,
        isSubscribed,
        loading,
        subscribe,
        unsubscribe,
        sendTestNotification,
        isSupported: typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window,
    };
}
