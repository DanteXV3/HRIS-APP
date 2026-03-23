import { Head, router } from '@inertiajs/react';
import { Search, Calendar, Clock, CheckCircle2, XCircle, Filter, RotateCcw } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Pagination } from '@/types';
import { useState } from 'react';

interface Attendance {
    id: number;
    tanggal: string;
    clock_in: string | null;
    clock_out: string | null;
    jam_masuk: string | null;
    jam_pulang: string | null;
    late_in_minutes: number;
    early_out_minutes: number;
    status: string;
    overtime_minutes: number;
    verified_lembur_minutes: number;
    is_holiday: boolean;
    notes: string | null;
}

interface Props {
    attendances: Pagination<Attendance>;
    filters: { tanggal_start?: string, tanggal_end?: string };
    employee: any;
}

export default function MyAttendance({ attendances, filters, employee }: Props) {
    const [tanggalStart, setTanggalStart] = useState(filters.tanggal_start || '');
    const [tanggalEnd, setTanggalEnd] = useState(filters.tanggal_end || '');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Absensi Saya', href: '#' },
    ];

    function handleFilter(e: React.FormEvent) {
        e.preventDefault();
        const query: any = {};
        if (tanggalStart) query.tanggal_start = tanggalStart;
        if (tanggalEnd) query.tanggal_end = tanggalEnd;
        router.get('/my-attendance', query, { preserveState: true });
    }

    function resetFilters() {
        setTanggalStart('');
        setTanggalEnd('');
        router.get('/my-attendance');
    }

    // Helper to format minutes to "HH:mm"
    function formatMinutes(minutes: number) {
        if (!minutes || minutes <= 0) return '00:00';
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Absensi Saya" />
            
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Absensi Saya</h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Lihat riwayat kehadiran dan jam kerja Anda.
                    </p>
                </div>

                {/* Info Card */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <Clock className="size-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Shift Kerja</p>
                            <p className="text-sm font-bold text-neutral-900 dark:text-white">
                                {employee.shift?.name || 'Reguler'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                            <Calendar className="size-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Jam Masuk/Pulang</p>
                            <p className="text-sm font-bold text-neutral-900 dark:text-white">
                                {employee.shift ? `${employee.shift.jam_masuk?.substring(0,5)} - ${employee.shift.jam_pulang?.substring(0,5)}` : '-'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <form onSubmit={handleFilter} className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Filter Tanggal</label>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="date"
                                    className="block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                    value={tanggalStart}
                                    onChange={e => setTanggalStart(e.target.value)}
                                />
                                <span className="text-neutral-400">to</span>
                                <input 
                                    type="date"
                                    className="block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                    value={tanggalEnd}
                                    onChange={e => setTanggalEnd(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-end gap-2 md:col-span-2">
                            <button
                                type="submit"
                                className="inline-flex h-[38px] flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <Search className="size-4" />
                                <span>Filter</span>
                            </button>
                            {(tanggalStart || tanggalEnd) && (
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="inline-flex h-[38px] items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                                >
                                    <RotateCcw className="size-4" />
                                    <span>Reset</span>
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
                            <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                                <tr>
                                    <th className="px-4 py-3 text-left">Tanggal</th>
                                    <th className="px-4 py-3 text-center">Jam (In/Out)</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                    <th className="px-4 py-3 text-center">Terlambat</th>
                                    <th className="px-4 py-3 text-center">Pulang Awal</th>
                                    <th className="px-4 py-3 text-center">Lembur</th>
                                    <th className="px-4 py-3 text-left">Catatan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
                                {attendances.data.length > 0 ? (
                                    attendances.data.map((att) => (
                                        <tr key={att.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                            <td className="px-4 py-4">
                                                <div className="text-sm font-medium text-neutral-900 dark:text-white">
                                                    {new Date(att.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                                {att.is_holiday && <span className="inline-flex items-center rounded-sm bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">Holiday</span>}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <div className="text-sm text-neutral-900 dark:text-white">
                                                    {att.clock_in ? att.clock_in.substring(11, 16) : '-'} — 
                                                    {att.clock_out ? att.clock_out.substring(11, 16) : '-'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                                                    ${att.status === 'hadir' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                                                      att.status === 'sakit' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                                                      att.status === 'izin' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 
                                                      att.status === 'cuti' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' : 
                                                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                    {att.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={att.late_in_minutes > 0 ? "text-sm font-medium text-red-600 dark:text-red-400" : "text-sm text-neutral-400"}>
                                                    {formatMinutes(att.late_in_minutes)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={att.early_out_minutes > 0 ? "text-sm font-medium text-yellow-600 dark:text-yellow-400" : "text-sm text-neutral-400"}>
                                                    {formatMinutes(att.early_out_minutes)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={att.verified_lembur_minutes > 0 ? "text-sm font-bold text-green-600 dark:text-green-400" : "text-sm text-neutral-400"}>
                                                    {formatMinutes(att.verified_lembur_minutes)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-neutral-500 dark:text-neutral-400 truncate max-w-[150px]">
                                                {att.notes || '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
                                            Tidak ada data absensi ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {attendances.links && attendances.links.length > 3 && (
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-sm text-neutral-500">Menampilkan {attendances.from}-{attendances.to} dari {attendances.total} data</p>
                        <div className="flex flex-wrap items-center justify-center gap-1">
                            {attendances.links.map((link, i) => {
                                const isPrev = link.label.includes('Previous');
                                const isNext = link.label.includes('Next');
                                const label = isPrev ? '«' : isNext ? '»' : link.label;
                                
                                return link.url ? (
                                    <button
                                        key={i}
                                        onClick={() => router.get(link.url!)}
                                        className={`rounded-md px-3 py-1 text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-neutral-700 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'} border border-neutral-200 dark:border-neutral-700`}
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: label }}></span>
                                    </button>
                                ) : (
                                    <span key={i} className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900/50">
                                        <span dangerouslySetInnerHTML={{ __html: label }}></span>
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
