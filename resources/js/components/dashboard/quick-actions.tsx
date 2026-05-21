import React from 'react';
import { FileText, DoorOpen, CalendarPlus } from 'lucide-react';

export function QuickActions({ employee }: { employee: any }) {
    if (!employee) return null;

    return (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
            <a href="/leaves/create" className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-blue-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-700">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">Ajukan Cuti</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Form Cuti / Izin</p>
                </div>
            </a>
            <a href="/exit-permits/create" className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-amber-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-amber-700">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <DoorOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">Form Keluar</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Izin Keluar Kantor</p>
                </div>
            </a>
            <a href="/leaves" className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-green-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-green-700">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                    <CalendarPlus className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">Riwayat Cuti</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Lihat Pengajuan</p>
                </div>
            </a>
            <a href="/exit-permits" className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-purple-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-purple-700">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <DoorOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">Riwayat Keluar</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Lihat Form Keluar</p>
                </div>
            </a>
        </div>
    );
}
