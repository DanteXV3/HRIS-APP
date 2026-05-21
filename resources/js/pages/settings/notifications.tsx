import { Head } from '@inertiajs/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SettingsLayout from '@/layouts/settings/layout';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { Bell, BellOff, Loader2, Send, ShieldAlert } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function NotificationsSettings() {
    const { 
        permissionStatus, 
        isSubscribed, 
        loading, 
        subscribe, 
        unsubscribe, 
        sendTestNotification,
        isSupported 
    } = usePushNotifications();

    const handleToggle = () => {
        if (isSubscribed) {
            unsubscribe();
        } else {
            subscribe();
        }
    };

    return (
        <SettingsLayout>
            <Head title="Notifications Settings" />

            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Notifikasi Push</h3>
                    <p className="text-sm text-muted-foreground">
                        Dapatkan pemberitahuan penting langsung di desktop atau ponsel Anda.
                    </p>
                </div>

                {!isSupported ? (
                    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <ShieldAlert className="h-8 w-8 text-amber-600" />
                            <div>
                                <CardTitle className="text-amber-800 dark:text-amber-400">Tidak Didukung</CardTitle>
                                <CardDescription className="text-amber-700 dark:text-amber-500">
                                    Browser Anda tidak mendukung Web Push Notifications.
                                </CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                ) : (
                    <div className="space-y-8">
                        <Card className="border-none shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    {isSubscribed ? <Bell className="h-4 w-4 text-blue-500" /> : <BellOff className="h-4 w-4 text-muted-foreground" />}
                                    Status Notigikasi
                                </CardTitle>
                                <CardDescription>
                                    Izinkan aplikasi untuk mengirimkan notifikasi.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between space-x-2">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="push-toggle" className="text-sm font-medium">
                                            {isSubscribed ? 'Notifikasi Aktif' : 'Notifikasi Nonaktif'}
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            {permissionStatus === 'denied' 
                                                ? 'Izin ditolak oleh browser. Harap reset izin di pengaturan browser Anda.' 
                                                : 'Terima pemberitahuan tentang kehadiran, payroll, dan pengumuman.'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                                        <Switch
                                            id="push-toggle"
                                            checked={isSubscribed}
                                            onCheckedChange={handleToggle}
                                            disabled={loading || permissionStatus === 'denied'}
                                        />
                                    </div>
                                </div>

                                {isSubscribed && (
                                    <div className="pt-4 border-t">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={sendTestNotification}
                                            disabled={loading}
                                            className="gap-2"
                                        >
                                            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                                            Kirim Notifikasi Tes
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            <h4 className="text-sm font-medium px-1">Tentang Notifikasi</h4>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-lg border p-4 text-sm bg-neutral-50 dark:bg-neutral-900/50">
                                    <p className="font-medium mb-1">Pribadi & Aman</p>
                                    <p className="text-muted-foreground text-xs">
                                        Kami menggunakan enkripsi VAPID untuk memastikan hanya server kami yang bisa mengirim notifikasi ke perangkat Anda.
                                    </p>
                                </div>
                                <div className="rounded-lg border p-4 text-sm bg-neutral-50 dark:bg-neutral-900/50">
                                    <p className="font-medium mb-1">Berfungsi di Latar Belakang</p>
                                    <p className="text-muted-foreground text-xs">
                                        Anda akan tetap menerima notifikasi meskipun aplikasi sedang dalam keadaan tertutup.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SettingsLayout>
    );
}
