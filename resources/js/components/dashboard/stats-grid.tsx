import React from 'react';
import { Users, Building2, CalendarPlus, UserPlus, DoorOpen } from 'lucide-react';
import { StatCard } from './stat-card';
import { DashboardStats } from '@/types';

interface StatsGridProps {
    stats: any; // Dynamic based on config
    config: {
        personal_stats?: boolean;
        approval_stats?: boolean;
        admin_stats?: boolean;
    };
}

export function StatsGrid({ stats, config }: StatsGridProps) {
    return (
        <div className="space-y-6">
            {/* Admin Stats Module */}
            {config.admin_stats && (
                <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Ringkasan Perusahaan</h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                            title="Pengajuan Cuti Pending (Global)"
                            value={stats.pengajuan_cuti_pending_admin ?? 0}
                            icon={CalendarPlus}
                            color="bg-gradient-to-br from-amber-500 to-amber-600"
                        />
                        <StatCard
                            title="Pengajuan Lembur (Global)"
                            value={stats.pengajuan_lembur_pending_admin ?? 0}
                            icon={CalendarPlus}
                            color="bg-gradient-to-br from-indigo-500 to-indigo-600"
                        />
                        <StatCard
                            title="Karyawan Baru Bulan Ini"
                            value={stats.karyawan_baru_bulan_ini ?? 0}
                            icon={UserPlus}
                            color="bg-gradient-to-br from-purple-500 to-purple-600"
                        />
                        <StatCard
                            title="Karyawan Cuti Hari Ini"
                            value={stats.karyawan_cuti_hari_ini_admin ?? 0}
                            icon={CalendarPlus}
                            color="bg-gradient-to-br from-teal-500 to-teal-600"
                        />
                        <StatCard
                            title="Form Keluar Hari Ini"
                            value={stats.form_keluar_hari_ini_admin ?? 0}
                            icon={DoorOpen}
                            color="bg-gradient-to-br from-rose-500 to-rose-600"
                        />
                    </div>
                </div>
            )}

            {/* Approval Stats Module */}
            {config.approval_stats && (
                <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Ringkasan Tim (Bawahan)</h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Cuti Pending (First Appr)"
                            value={stats.pengajuan_cuti_pending_approval ?? 0}
                            icon={CalendarPlus}
                            color="bg-gradient-to-br from-amber-500 to-amber-600"
                        />
                        <StatCard
                            title="Bawahan Belum Absen"
                            value={stats.belum_absen_hari_ini ?? 0}
                            icon={Users}
                            color="bg-gradient-to-br from-red-500 to-red-600"
                        />
                        <StatCard
                            title="Bawahan Cuti Hari Ini"
                            value={stats.karyawan_cuti_hari_ini_approval ?? 0}
                            icon={CalendarPlus}
                            color="bg-gradient-to-br from-teal-500 to-teal-600"
                        />
                        <StatCard
                            title="Form Keluar Bawahan"
                            value={stats.form_keluar_hari_ini_approval ?? 0}
                            icon={DoorOpen}
                            color="bg-gradient-to-br from-purple-500 to-purple-600"
                        />
                        <StatCard
                            title="Lembur Pending (Appr)"
                            value={stats.pengajuan_lembur_pending_approval ?? 0}
                            icon={CalendarPlus}
                            color="bg-gradient-to-br from-indigo-500 to-indigo-600"
                        />
                    </div>
                </div>
            )}

            {/* Personal Stats Module */}
            {config.personal_stats && (
                <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Status Saya</h3>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Pengajuan Cuti Pending"
                            value={stats.pengajuan_cuti_pending_personal ?? 0}
                            icon={CalendarPlus}
                            color="bg-gradient-to-br from-amber-500 to-amber-600"
                        />
                        <StatCard
                            title="Lembur Pending"
                            value={stats.pengajuan_lembur_pending_personal ?? 0}
                            icon={CalendarPlus}
                            color="bg-gradient-to-br from-indigo-500 to-indigo-600"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
