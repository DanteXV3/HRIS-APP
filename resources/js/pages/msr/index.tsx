import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, FileText, CheckCircle2, Clock, XCircle, ChevronRight, MessageSquare, Download } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { useState } from 'react';

interface MSR {
    id: number;
    msr_number: string;
    date: string;
    subject: string;
    status: string;
    total_amount: number;
    requested_by: { nama: string };
    company: { name: string };
    work_location: { name: string };
    department: { name: string };
}

interface Props {
    msrs: {
        data: MSR[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Material & Service Request', href: '/msr' },
];

export default function MSRIndex({ msrs, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/msr', { search }, { preserveState: true });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"><CheckCircle2 className="h-3 w-3" /> Approved</span>;
            case 'rejected':
                return <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20"><XCircle className="h-3 w-3" /> Rejected</span>;
            case 'partially_approved':
                return <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20"><Clock className="h-3 w-3" /> In Progress</span>;
            default:
                return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20"><Clock className="h-3 w-3" /> Pending</span>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Material & Service Request" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                             <FileText className="h-7 w-7 text-indigo-600" />
                             Material & Service Request
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Kelola permintaan material dan jasa untuk proyek.</p>
                    </div>
                    <Link
                        href="/msr/create"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <Plus className="h-4 w-4" /> Buat MSR Baru
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <form onSubmit={handleSearch} className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Cari No MSR atau Subjek..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border-neutral-300 bg-neutral-50 pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                        />
                    </form>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-neutral-50 text-[10px] uppercase tracking-wider text-neutral-500 dark:bg-neutral-800/50 dark:text-neutral-400">
                                <tr>
                                    <th className="px-6 py-4 font-bold">No MSR</th>
                                    <th className="px-6 py-4 font-bold">Tanggal</th>
                                    <th className="px-6 py-4 font-bold">Subjek / Kategori</th>
                                    <th className="px-6 py-4 font-bold">Pemohon</th>
                                    <th className="px-6 py-4 font-bold">Penempatan</th>
                                    <th className="px-6 py-4 font-bold text-right">Total Amount</th>
                                    <th className="px-6 py-4 font-bold text-center">Status</th>
                                    <th className="px-6 py-4 font-bold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {msrs.data.map((msr) => (
                                    <tr key={msr.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <Link href={`/msr/${msr.id}`} className="font-mono text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400">
                                                {msr.msr_number}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">
                                            {new Date(msr.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-neutral-900 dark:text-neutral-100">{msr.subject}</div>
                                            <div className="text-[10px] text-neutral-500">{msr.department.name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400 font-medium">
                                            {msr.requested_by.nama}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">
                                            {msr.work_location.name}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                                            Rp {new Intl.NumberFormat('id-ID').format(msr.total_amount)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {getStatusBadge(msr.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/msr/${msr.id}`}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {msrs.data.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-neutral-500 italic">
                                            Tidak ada data Material & Service Request.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination (Simplified) */}
                {msrs.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                         {/* standard pagination logic would go here */}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
