import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Clock, Eye, FileText, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Overtime, Pagination } from '@/types';

interface Props {
    overtimes: Pagination<Overtime>;
    filters: { status?: string };
    userRole: string;
    currentEmployeeId: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Form Lembur', href: '/overtimes' },
];

export default function OvertimeIndex() {
    const { overtimes, filters, userRole, currentEmployeeId } = usePage<any>().props as unknown as Props;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"><CheckCircle2 className="w-3 h-3" /> Disetujui</span>;
            case 'rejected':
                return <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400"><XCircle className="w-3 h-3" /> Ditolak</span>;
            case 'partially_approved':
                return <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"><Clock className="w-3 h-3" /> Menunggu Management</span>;
            default:
                return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"><AlertCircle className="w-3 h-3" /> Menunggu Atasan</span>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Form Lembur" />
            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                            <Clock className="w-6 h-6 text-blue-600" />
                            Form Lembur
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola pengajuan lembur karyawan.
                        </p>
                    </div>
                    <Link
                        href="/overtimes/create"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 w-full sm:w-auto"
                    >
                        <Plus className="h-4 w-4" /> Buat Pengajuan
                    </Link>
                </div>

                <div className="flex flex-wrap gap-2">
                    {[
                        { label: 'Semua', value: '' },
                        { label: 'Menunggu Atasan', value: 'pending' },
                        { label: 'Menunggu Management', value: 'partially_approved' },
                        { label: 'Disetujui', value: 'approved' },
                        { label: 'Ditolak', value: 'rejected' }
                    ].map((status) => (
                        <Link
                            key={status.value}
                            href="/overtimes"
                            data={{ status: status.value }}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                (filters.status || '') === status.value
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-neutral-700 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'
                            } border border-neutral-200 dark:border-neutral-800`}
                        >
                            {status.label}
                        </Link>
                    ))}
                </div>

                <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-700">
                    <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700 text-sm">
                        <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-xs">Tanggal</th>
                                <th className="px-4 py-3 text-left font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-xs">Diajukan Oleh</th>
                                <th className="px-4 py-3 text-center font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-xs">Waktu</th>
                                <th className="px-4 py-3 text-left font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-xs">Lokasi</th>
                                <th className="px-4 py-3 text-left font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-xs">Status</th>
                                <th className="px-4 py-3 text-right font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-xs whitespace-nowrap">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
                            {overtimes.data && overtimes.data.length > 0 ? (
                                overtimes.data.map((overtime) => (
                                    <tr key={overtime.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                        <td className="whitespace-nowrap px-4 py-4 text-neutral-700 dark:text-neutral-300">
                                            {new Date(overtime.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="font-medium text-neutral-900 dark:text-white truncate max-w-[150px]">{overtime.creator?.nama}</div>
                                            <div className="text-xs text-neutral-500">{overtime.employees.length} Orang</div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-center">
                                            <div className="font-mono text-neutral-900 dark:text-white">{overtime.jam_mulai.substring(0, 5)} - {overtime.jam_berakhir.substring(0, 5)}</div>
                                            <div className="text-[10px] text-neutral-500 uppercase">{overtime.durasi} Jam</div>
                                        </td>
                                        <td className="px-4 py-4 text-neutral-600 dark:text-neutral-400">
                                            <div className="truncate max-w-[120px]">{overtime.working_location?.name || overtime.lokasi_kerja}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4">
                                            {getStatusBadge(overtime.status)}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-right">
                                            <Link
                                                href={`/overtimes/${overtime.id}`}
                                                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                            >
                                                <Eye className="w-4 h-4" /> Detail
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
                                        Tidak ada data pengajuan lembur.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {overtimes.links && overtimes.links.length > 3 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-neutral-500">Menampilkan {overtimes.from}-{overtimes.to} dari {overtimes.total} data</p>
                        <div className="flex flex-wrap items-center justify-center gap-1">
                            {overtimes.links.map((link, i) => {
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
