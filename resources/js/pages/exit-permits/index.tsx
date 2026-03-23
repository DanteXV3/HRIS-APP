import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, DoorOpen, Clock } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Pagination } from '@/types';

interface ExitPermit {
    id: number;
    employee_id: number;
    tanggal: string;
    jam_mulai: string;
    jam_berakhir: string;
    keperluan: string;
    created_at: string;
    employee?: {
        id: number;
        nama: string;
        nik: string;
        department?: { name: string };
        position?: { name: string };
    };
}

interface Props {
    exitPermits: Pagination<ExitPermit>;
    filters: { tanggal_start?: string; tanggal_end?: string };
    userRole: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Form Keluar', href: '/exit-permits' },
];

export default function ExitPermitIndex() {
    const { exitPermits, filters, userRole } = usePage<{ props: Props }>().props as unknown as Props;
    const [tanggalStart, setTanggalStart] = useState(filters.tanggal_start || '');
    const [tanggalEnd, setTanggalEnd] = useState(filters.tanggal_end || '');

    function handleFilter(e: React.FormEvent) {
        e.preventDefault();
        const query: any = {};
        if (tanggalStart) query.tanggal_start = tanggalStart;
        if (tanggalEnd) query.tanggal_end = tanggalEnd;
        router.get('/exit-permits', query, { preserveState: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Form Keluar" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                            <DoorOpen className="w-6 h-6 text-blue-600" />
                            Form Keluar
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Catatan izin keluar kantor sementara.
                        </p>
                    </div>
                    <Link
                        href="/exit-permits/create"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 w-full sm:w-auto"
                    >
                        <Plus className="h-4 w-4" /> Buat Form Keluar
                    </Link>
                </div>

                <form onSubmit={handleFilter} className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2">
                    <input
                        type="date"
                        value={tanggalStart}
                        onChange={e => setTanggalStart(e.target.value)}
                        className="w-full sm:w-40 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                    />
                    <input
                        type="date"
                        value={tanggalEnd}
                        onChange={e => setTanggalEnd(e.target.value)}
                        className="w-full sm:w-40 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                    />
                    <button type="submit" className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300">
                        Filter
                    </button>
                </form>

                <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-700">
                    <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                            <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Tanggal</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Karyawan</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Jam Mulai</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Jam Berakhir</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Keperluan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
                                {exitPermits.data.length > 0 ? (
                                    exitPermits.data.map(ep => (
                                        <tr key={ep.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-neutral-700 dark:text-neutral-300">
                                            {new Date(ep.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4">
                                            <div className="text-sm font-medium text-neutral-900 dark:text-white">{ep.employee?.nama}</div>
                                            <div className="text-xs text-neutral-500 dark:text-neutral-400">{ep.employee?.department?.name}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-mono text-neutral-700 dark:text-neutral-300">
                                            {ep.jam_mulai?.substring(0, 5)}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-mono text-neutral-700 dark:text-neutral-300">
                                            {ep.jam_berakhir?.substring(0, 5)}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-neutral-700 dark:text-neutral-300 max-w-xs truncate">
                                            {ep.keperluan}
                                        </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
                                            Tidak ada data form keluar ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                {exitPermits.links && exitPermits.links.length > 3 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-neutral-500">Menampilkan {exitPermits.from}-{exitPermits.to} dari {exitPermits.total} data</p>
                        <div className="flex flex-wrap items-center justify-center gap-1">
                            {exitPermits.links.map((link, i) => {
                                const isPrev = link.label.includes('Previous');
                                const isNext = link.label.includes('Next');
                                const label = isPrev ? '«' : isNext ? '»' : link.label;
                                return link.url ? (
                                    <button key={i} onClick={() => router.get(link.url!)} className={`rounded-md px-3 py-1 text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-neutral-700 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300'} border border-neutral-200 dark:border-neutral-700`}>
                                        <span dangerouslySetInnerHTML={{ __html: label }} />
                                    </button>
                                ) : (
                                    <span key={i} className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm text-neutral-400 dark:border-neutral-800">
                                        <span dangerouslySetInnerHTML={{ __html: label }} />
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
