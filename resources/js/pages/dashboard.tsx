import { Head, usePage, router } from '@inertiajs/react';
import React, { useState } from 'react';
import axios from 'axios';
import { Building2, CalendarPlus, UserPlus, Users, Camera, XCircle, CheckCircle2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import FaceScanner from '@/components/FaceScanner';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, DashboardStats, Employee } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

interface Props {
    stats: DashboardStats;
    userRole: string;
    employee: Employee | null;
    todayAttendance: any | null;
    allEmployees: Employee[];
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: number | string; icon: React.ElementType; color: string }) {
    return (
        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-sidebar-border dark:bg-neutral-900">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">{value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { stats, userRole, employee, todayAttendance, allEmployees } = usePage<{ props: Props }>().props as unknown as Props;
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [successMessage, setSuccessMessage] = useState<{title: string, message: string, type: 'in'|'out'|'error'} | null>(null);

    const handleMatch = async (matchedId: number, distance: number, location?: { latitude: number, longitude: number } | null) => {
        if (!employee || matchedId !== employee.id) {
            setSuccessMessage({ title: 'Gagal Memverifikasi', message: 'Wajah tidak cocok dengan akun login Anda. Silahkan coba lagi.', type: 'error' });
            setTimeout(() => setSuccessMessage(null), 3000);
            return;
        }

        if (isProcessing) return;
        setIsProcessing(true);

        try {
            const response = await axios.post('/api/face-attendance/verify', {
                employee_id: matchedId,
                latitude: location?.latitude,
                longitude: location?.longitude
            });
            const data = response.data;

            if (data.success) {
                setIsCameraOpen(false);
                setSuccessMessage({ title: data.name, message: data.message, type: data.action === 'clock_in' ? 'in' : 'out' });
                setTimeout(() => {
                    setSuccessMessage(null);
                    router.reload(); // Refresh to update attendance state
                }, 4000);
            } else {
                setSuccessMessage({ title: 'Peringatan', message: data.message, type: 'error' });
                setTimeout(() => setSuccessMessage(null), 3000);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                        Selamat Datang! 👋
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Berikut ringkasan data HRIS Anda.
                    </p>
                </div>

                {/* Clock In / Out Widget */}
                {employee && (
                    <div className="rounded-xl border border-blue-500/20 bg-blue-50/50 p-6 dark:border-blue-500/10 dark:bg-blue-900/10 mb-2">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                                    <Camera className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    Presensi Hari Ini
                                </h2>
                                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                                    {todayAttendance 
                                        ? (todayAttendance.clock_out ? 'Anda sudah menyelesaikan absensi hari ini.' : `Anda telah Clock In pada ${new Date(todayAttendance.clock_in).toLocaleTimeString()}. Silahkan Clock Out saat pulang.`)
                                        : 'Anda belum absen hari ini. Silahkan gunakan kamera untuk Clock In.'}
                                </p>
                            </div>
                            
                            {!todayAttendance?.clock_out && (
                                <button
                                    onClick={() => setIsCameraOpen(true)}
                                    className={`px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-all flex items-center gap-2
                                        ${todayAttendance ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}
                                    `}
                                >
                                    <Camera className="w-5 h-5" />
                                    {todayAttendance ? 'Clock Out (Wajah)' : 'Clock In (Wajah)'}
                                </button>
                            )}
                        </div>

                        {/* Success Message display */}
                        {successMessage && !isCameraOpen && (
                            <div className={`mt-4 p-4 rounded-lg flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 
                                ${successMessage.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}
                            `}>
                                {successMessage.type === 'error' ? <XCircle className="w-8 h-8 flex-shrink-0" /> : <CheckCircle2 className="w-8 h-8 flex-shrink-0 text-green-500" />}
                                <div>
                                    <h4 className="font-bold">{successMessage.title}</h4>
                                    <p className="text-sm opacity-90">{successMessage.message}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Camera Modal */}
                {isCameraOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="relative w-full max-w-lg">
                            <button 
                                onClick={() => setIsCameraOpen(false)}
                                className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors flex items-center gap-2"
                            >
                                Tutup <XCircle className="w-6 h-6" />
                            </button>
                            
                            {successMessage ? (
                                <div className="bg-neutral-900 rounded-2xl p-8 text-center text-white border border-neutral-800 shadow-2xl">
                                    {successMessage.type === 'error' ? <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" /> : <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500 flex-shrink-0" />}
                                    <h3 className="text-2xl font-bold">{successMessage.title}</h3>
                                    <p className="text-neutral-400 mt-2">{successMessage.message}</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 flex justify-between items-center text-white">
                                        <h3 className="font-semibold">{todayAttendance ? 'Absen Pulang' : 'Absen Masuk'}</h3>
                                        <p className="text-xs text-neutral-400">Verifikasi Wajah: {employee?.nama}</p>
                                    </div>
                                    <FaceScanner 
                                        employees={allEmployees as any} 
                                        onMatch={handleMatch} 
                                        isProcessing={isProcessing} 
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {(userRole === 'admin' || userRole === 'manager') && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Total Karyawan Aktif"
                            value={stats.total_karyawan ?? 0}
                            icon={Users}
                            color="bg-gradient-to-br from-blue-500 to-blue-600"
                        />
                        <StatCard
                            title="Total Departemen"
                            value={stats.total_departemen ?? 0}
                            icon={Building2}
                            color="bg-gradient-to-br from-emerald-500 to-emerald-600"
                        />
                        <StatCard
                            title="Pengajuan Cuti Pending"
                            value={stats.pengajuan_cuti_pending ?? 0}
                            icon={CalendarPlus}
                            color="bg-gradient-to-br from-amber-500 to-amber-600"
                        />
                        <StatCard
                            title="Karyawan Baru Bulan Ini"
                            value={stats.karyawan_baru_bulan_ini ?? 0}
                            icon={UserPlus}
                            color="bg-gradient-to-br from-purple-500 to-purple-600"
                        />
                    </div>
                )}

                {userRole === 'supervisor' && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Anggota Tim"
                            value={stats.total_anggota_tim ?? 0}
                            icon={Users}
                            color="bg-gradient-to-br from-blue-500 to-blue-600"
                        />
                        <StatCard
                            title="Pengajuan Cuti Pending"
                            value={stats.pengajuan_cuti_pending ?? 0}
                            icon={CalendarPlus}
                            color="bg-gradient-to-br from-amber-500 to-amber-600"
                        />
                    </div>
                )}

                {userRole === 'staff' && (
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-8 text-center dark:border-sidebar-border dark:bg-neutral-900">
                        <p className="text-neutral-500 dark:text-neutral-400">
                            Fitur self-service akan segera hadir. Anda dapat mengakses slip gaji, absensi, dan pengajuan cuti di sini.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
