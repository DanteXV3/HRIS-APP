import React, { useState } from 'react';
import { MapPin, Loader2, XCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { router } from '@inertiajs/react';

interface AttendanceWidgetProps {
    employee: any;
    todayAttendance: any;
}

export function AttendanceWidget({ employee, todayAttendance }: AttendanceWidgetProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [successMessage, setSuccessMessage] = useState<{title: string, message: string, type: 'in'|'out'|'error'} | null>(null);

    const handleAttendance = async () => {
        if (!employee || isProcessing) return;
        setIsProcessing(true);
        setSuccessMessage(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const params: any = { latitude, longitude };
                    
                    const performVerify = async (extraParams = {}) => {
                        try {
                            const response = await axios.post('/api/attendance/verify', { ...params, ...extraParams });
                            const data = response.data;

                            if (data.success) {
                                setSuccessMessage({ title: data.name, message: data.message, type: data.action === 'clock_in' ? 'in' : 'out' });
                                setTimeout(() => {
                                    setSuccessMessage(null);
                                    router.reload();
                                }, 4000);
                            }
                        } catch (err: any) {
                            if (err.response?.status === 400 && err.response?.data?.outside_radius) {
                                const remark = window.prompt(err.response.data.message);
                                if (remark) {
                                    await performVerify({ remark });
                                } else {
                                    setSuccessMessage({ title: 'Dibatalkan', message: 'Presensi dibatalkan karena Anda berada di luar radius dan tidak memberikan keterangan.', type: 'error' });
                                    setTimeout(() => setSuccessMessage(null), 3000);
                                }
                            } else {
                                throw err;
                            }
                        }
                    };

                    await performVerify();

                } catch (error: any) {
                    const message = error.response?.data?.message || 'Terjadi kesalahan sistem. Silahkan coba lagi.';
                    setSuccessMessage({ title: 'Gagal', message, type: 'error' });
                    setTimeout(() => setSuccessMessage(null), 3000);
                } finally {
                    setIsProcessing(false);
                }
            },
            (error) => {
                console.error(error);
                let msg = 'Gagal mendapatkan lokasi. Pastikan GPS aktif dan izinkan akses lokasi.';
                if (error.code === error.PERMISSION_DENIED) msg = 'Akses lokasi ditolak. Buka pengaturan browser untuk mengizinkan akses lokasi.';
                
                setSuccessMessage({ title: 'Lokasi Dibutuhkan', message: msg, type: 'error' });
                setIsProcessing(false);
                setTimeout(() => setSuccessMessage(null), 5000);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    if (!employee) return null;

    return (
        <div className="rounded-xl border border-blue-500/20 bg-blue-50/50 p-6 dark:border-blue-500/10 dark:bg-blue-900/10 mb-2">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Presensi Hari Ini
                    </h2>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                        {todayAttendance 
                            ? (todayAttendance.clock_out ? 'Anda sudah menyelesaikan absensi hari ini.' : `Anda telah Clock In pada ${new Date(todayAttendance.clock_in).toLocaleTimeString()}. Silahkan Clock Out saat pulang.`)
                            : 'Anda belum absen hari ini.'}
                    </p>
                </div>
                
                {!todayAttendance?.clock_out && (
                    <button
                        onClick={handleAttendance}
                        disabled={isProcessing}
                        className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-3 disabled:opacity-50
                            ${todayAttendance ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-500/20' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/20'}
                        `}
                    >
                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                        {todayAttendance ? 'Absen Pulang Sekarang' : 'Absen Masuk Sekarang'}
                    </button>
                )}
            </div>

            {successMessage && (
                <div className={`mt-4 p-4 rounded-xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 
                    ${successMessage.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:border-red-500/30' : 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:border-green-500/30'}
                `}>
                    {successMessage.type === 'error' ? <XCircle className="w-8 h-8 flex-shrink-0" /> : <CheckCircle2 className="w-8 h-8 flex-shrink-0 text-green-500" />}
                    <div>
                        <h4 className="font-bold">{successMessage.title}</h4>
                        <p className="text-sm opacity-90">{successMessage.message}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
