import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Holiday } from '@/types';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Hari Libur', href: '/holidays' },
];

export default function HolidayIndex() {
    const { holidays } = usePage<{ holidays: Holiday[] }>().props;
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    function handleDelete(id: number) {
        if (confirm('Apakah Anda yakin ingin menghapus hari libur ini?')) {
            router.delete(`/holidays/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hari Libur" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Hari Libur</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Kelola daftar hari libur nasional untuk perhitungan absensi</p>
                    </div>
                    <button
                        onClick={() => router.get('/holidays/create')}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 w-full sm:w-auto"
                    >
                        <Plus className="h-4 w-4" /> Tambah Hari Libur
                    </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-700">
                    <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                        <thead className="bg-neutral-50 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Tanggal</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Nama Hari Libur</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-700 dark:bg-neutral-900">
                            {holidays.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-sm text-neutral-500">Belum ada data hari libur.</td>
                                </tr>
                            ) : (
                                holidays.map((holiday) => (
                                    <tr key={holiday.id} className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-neutral-900 dark:text-white">
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="h-4 w-4 text-neutral-400" />
                                                {new Date(holiday.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-neutral-900 dark:text-white">{holiday.name}</td>
                                        <td className="whitespace-nowrap px-4 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => router.get(`/holidays/${holiday.id}/edit`)}
                                                    className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-blue-600 dark:hover:bg-neutral-800"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(holiday.id)}
                                                    className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
