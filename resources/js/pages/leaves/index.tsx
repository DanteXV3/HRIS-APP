import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, CheckCircle2, XCircle, Clock, Eye, MessageCircle, Filter } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import axios from 'axios';
import type { BreadcrumbItem, Pagination } from '@/types';

interface LeaveRequest {
    id: number;
    employee_id: number;
    leave_type_id: number;
    tanggal_mulai: string;
    tanggal_selesai: string;
    jumlah_hari: number;
    alasan: string;
    yang_menggantikan: string | null;
    attachment: string | null;
    supervisor_status: string;
    manager_status: string;
    status: string;
    created_at: string;
    employee?: {
        id: number;
        nama: string;
        nik: string;
        department?: { name: string };
        position?: { name: string };
    };
    leave_type?: { id: number; name: string; max_days: number };
    approved_by_supervisor?: { nama: string } | null;
    approved_by_manager?: { nama: string } | null;
}

interface Props {
    leaveRequests: Pagination<LeaveRequest>;
    filters: { status?: string };
    pendingCount: number;
    userRole: string;
    currentEmployeeId: number | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pengajuan Cuti', href: '/leaves' },
];

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    pending: { label: 'Menunggu Persetujuan 1', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock },
    partially_approved: { label: 'Menunggu Persetujuan 2', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: Clock },
    approved: { label: 'Disetujui', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle2 },
    rejected: { label: 'Ditolak', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
    cancelled: { label: 'Dibatalkan', color: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300', icon: XCircle },
};

export default function LeaveIndex() {
    const { leaveRequests, filters, pendingCount, userRole, currentEmployeeId } = usePage<{ props: Props }>().props as unknown as Props;
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [rejectNotes, setRejectNotes] = useState('');
    const [sendingWa, setSendingWa] = useState<number | null>(null);

    function handleFilter(e: React.FormEvent) {
        e.preventDefault();
        const query: any = {};
        if (statusFilter) query.status = statusFilter;
        router.get('/leaves', query, { preserveState: true });
    }

    function handleApprove(id: number) {
        if (!confirm('Setujui pengajuan cuti ini?')) return;
        router.post(`/leaves/${id}/approve`, {}, { preserveState: false });
    }

    function handleReject(id: number) {
        setRejectingId(id);
        setRejectNotes('');
    }

    function submitReject() {
        if (!rejectingId) return;
        router.post(`/leaves/${rejectingId}/reject`, { notes: rejectNotes }, {
            preserveState: false,
            onSuccess: () => setRejectingId(null),
        });
    }

    async function handleWhatsApp(id: number) {
        setSendingWa(id);
        try {
            const res = await axios.get(`/leaves/${id}/whatsapp`);
            window.open(res.data.url, '_blank');
        } catch (err: any) {
            alert(err.response?.data?.errors?.error || 'Gagal mengirim notifikasi WhatsApp');
        } finally {
            setSendingWa(null);
        }
    }

    function canApprove(lr: LeaveRequest): boolean {
        if (lr.status === 'approved' || lr.status === 'rejected' || lr.status === 'cancelled') return false;
        if (userRole === 'admin') return true;
        if (lr.employee_id === currentEmployeeId) return false; // Can't approve own
        if (userRole === 'manager' || userRole === 'supervisor') {
            if (lr.supervisor_status === 'pending' || lr.manager_status === 'pending') return true;
        }
        return false;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengajuan Cuti" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Pengajuan Cuti / Izin</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola pengajuan cuti, izin, dan sakit karyawan.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {pendingCount > 0 && (userRole === 'admin' || userRole === 'manager' || userRole === 'supervisor') && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800 w-full sm:w-auto justify-center">
                                <Clock className="w-4 h-4" />
                                {pendingCount} menunggu
                            </span>
                        )}
                        <Link
                            href="/leaves/create"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 w-full sm:w-auto"
                        >
                            <Plus className="h-4 w-4" /> Ajukan Cuti
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleFilter} className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2">
                    <div className="w-full sm:w-48">
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                        >
                            <option value="">Semua Status</option>
                            <option value="pending">Menunggu</option>
                            <option value="partially_approved">Disetujui Sebagian</option>
                            <option value="approved">Disetujui</option>
                            <option value="rejected">Ditolak</option>
                        </select>
                    </div>
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
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Jenis</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Periode</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Durasi</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Approval</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Status</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
                                {leaveRequests.data.length > 0 ? (
                                    leaveRequests.data.map(lr => {
                                        const cfg = statusConfig[lr.status] || statusConfig.pending;
                                        const StatusIcon = cfg.icon;
                                        return (
                                            <tr key={lr.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                                <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">
                                                    {new Date(lr.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3">
                                                    <div className="text-sm font-medium text-neutral-900 dark:text-white">{lr.employee?.nama}</div>
                                                    <div className="text-xs text-neutral-500 dark:text-neutral-400">{lr.employee?.department?.name}</div>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                                                    {lr.leave_type?.name || '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-neutral-700 dark:text-neutral-300">
                                                    {new Date(lr.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(lr.tanggal_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-neutral-900 dark:text-white">
                                                    {lr.jumlah_hari} hari
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-center">
                                                    <div className="flex flex-col items-center gap-1 text-[10px]">
                                                        <span className={`px-1.5 py-0.5 rounded font-medium ${lr.supervisor_status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : lr.supervisor_status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'}`}>
                                                            1st: {lr.supervisor_status === 'approved' ? 'OK' : lr.supervisor_status === 'rejected' ? 'NO' : 'WAIT'}
                                                        </span>
                                                        <span className={`px-1.5 py-0.5 rounded font-medium ${lr.manager_status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : lr.manager_status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'}`}>
                                                            2nd: {lr.manager_status === 'approved' ? 'OK' : lr.manager_status === 'rejected' ? 'NO' : 'WAIT'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-center">
                                                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.color}`}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        {cfg.label}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Link href={`/leaves/${lr.id}`} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-blue-600 dark:hover:bg-neutral-800" title="Detail">
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                        {canApprove(lr) && (
                                                            <>
                                                                <button onClick={() => handleApprove(lr.id)} className="rounded-lg p-1.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20" title="Setujui">
                                                                    <CheckCircle2 className="h-4 w-4" />
                                                                </button>
                                                                <button onClick={() => handleReject(lr.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" title="Tolak">
                                                                    <XCircle className="h-4 w-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                        {(lr.status === 'pending' || lr.status === 'partially_approved') && (
                                                            <button
                                                                onClick={() => handleWhatsApp(lr.id)}
                                                                disabled={sendingWa === lr.id}
                                                                className="rounded-lg p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                                title="Kirim WhatsApp ke Atasan"
                                                            >
                                                                <MessageCircle className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
                                            Tidak ada data pengajuan cuti ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                {leaveRequests.links && leaveRequests.links.length > 3 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-neutral-500">Menampilkan {leaveRequests.from}-{leaveRequests.to} dari {leaveRequests.total} data</p>
                        <div className="flex flex-wrap items-center justify-center gap-1">
                            {leaveRequests.links.map((link, i) => {
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

            {/* Reject Modal */}
            {rejectingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-neutral-900">
                        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 dark:border-neutral-800">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                                <XCircle className="w-5 h-5 text-red-600" />
                                Tolak Pengajuan Cuti
                            </h3>
                            <button onClick={() => setRejectingId(null)} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300">×</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Alasan Penolakan</label>
                                <textarea
                                    value={rejectNotes}
                                    onChange={e => setRejectNotes(e.target.value)}
                                    rows={3}
                                    className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                    placeholder="Berikan alasan penolakan..."
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setRejectingId(null)} className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">
                                    Batal
                                </button>
                                <button onClick={submitReject} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700">
                                    Tolak Pengajuan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
