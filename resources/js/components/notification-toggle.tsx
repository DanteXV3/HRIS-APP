import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import axios from "axios";

const NotificationToggle = () => {
    const [isSupported, setIsSupported] = useState(true);
    const [isEnabled, setIsEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
            setIsSupported(false);
            setLoading(false);
            return;
        }

        checkSubscription();
    }, []);

    const checkSubscription = async () => {
        try {
            const registration = await Promise.race([
                navigator.serviceWorker.ready,
                new Promise<never>((_, reject) =>
                    setTimeout(() => reject(new Error("SW timeout")), 5000)
                ),
            ]);
            const subscription = await registration.pushManager.getSubscription();
            setIsEnabled(!!subscription);
        } catch (error: any) {
            console.warn("SW check:", error?.message || error);
            setIsEnabled(false);
        } finally {
            setLoading(false);
        }
    };

    const urlBase64ToUint8Array = (base64String: string) => {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const handleToggle = async (checked: boolean) => {
        setLoading(true);
        setStatusMessage("");
        try {
            if (checked) {
                await subscribe();
            } else {
                await unsubscribe();
            }
        } catch (error: any) {
            console.error("Notification toggle error:", error);
            setStatusMessage("Failed to update notification settings.");
        } finally {
            setLoading(false);
        }
    };

    const subscribe = async () => {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            setStatusMessage("Notification permission was denied by the browser.");
            return;
        }

        const registration = await navigator.serviceWorker.ready;
        const vapidPublicKey = document.querySelector('meta[name="vapid-public-key"]')?.getAttribute("content");

        if (!vapidPublicKey) {
            setStatusMessage("VAPID public key not found. Contact admin.");
            return;
        }

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });

        await axios.post("/push-subscriptions", subscription.toJSON());
        setIsEnabled(true);
        setStatusMessage("Notifications enabled successfully!");
    };

    const unsubscribe = async () => {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            await axios.post("/push-subscriptions/delete", { endpoint: subscription.endpoint });
            await subscription.unsubscribe();
        }

        setIsEnabled(false);
        setStatusMessage("Notifications disabled.");
    };

    if (!isSupported) {
        return (
            <div className="text-sm text-muted-foreground italic">
                Push notifications are not supported by your browser.
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                    <Label htmlFor="notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                        Receive alerts about attendance, payroll, and tasks.
                    </p>
                </div>
                <Switch
                    id="notifications"
                    checked={isEnabled}
                    onCheckedChange={handleToggle}
                    disabled={loading}
                />
            </div>
            {isEnabled && (
                <div className="flex justify-start">
                    <button
                        onClick={async () => {
                            setLoading(true);
                            try {
                                const response = await axios.post("/push-subscriptions/test");
                                setStatusMessage(response.data.message);
                            } catch (error) {
                                console.error("Test notification error:", error);
                                setStatusMessage("Failed to send test notification.");
                            } finally {
                                setLoading(false);
                            }
                        }}
                        disabled={loading}
                        className="text-xs text-primary hover:underline font-medium"
                    >
                        {loading ? "Sending..." : "Send Test Notification"}
                    </button>
                </div>
            )}
            {statusMessage && (
                <p className="text-sm text-muted-foreground">{statusMessage}</p>
            )}
        </div>
    );
};

export default NotificationToggle;
