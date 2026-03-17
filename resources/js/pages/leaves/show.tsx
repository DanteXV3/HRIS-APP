import { Head, Link, usePage, router } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, XCircle, Clock, MessageCircle, Paperclip, Download } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import axios from 'axios';
import type { BreadcrumbItem } from '@/types';

interface Props {
    leaveRequest: any;
    userRole: string;
    currentEmployeeId: number | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pengajuan Cuti', href: '/leaves' },
    { title: 'Detail', href: '#' },
];

const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: 'Menunggu', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    partially_approved: { label: 'Disetujui Sebagian', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    approved: { label: 'Disetujui', color: 'bg-green-100 text-green-800 border-green-200' },
    rejected: { label: 'Ditolak', color: 'bg-red-100 text-red-800 border-red-200' },
    cancelled: { label: 'Dibatalkan', color: 'bg-neutral-100 text-neutral-800 border-neutral-200' },
};

export default function LeaveShow() {
    const { leaveRequest: lr, userRole, currentEmployeeId } = usePage<{ props: Props }>().props as unknown as Props;
    const [sendingWa, setSendingWa] = useState(false);
    const cfg = statusConfig[lr.status] || statusConfig.pending;

    const canApprove = () => {
        if (lr.status === 'approved' || lr.status === 'rejected') return false;
        if (userRole === 'admin') return true;
        if (lr.employee_id === currentEmployeeId) return false;
        if ((userRole === 'manager' || userRole === 'supervisor') && (lr.supervisor_status === 'pending' || lr.manager_status === 'pending')) return true;
        return false;
    };

    async function handleWhatsApp() {
        setSendingWa(true);
        try {
            const res = await axios.get(`/leaves/${lr.id}/whatsapp`);
            window.open(res.data.url, '_blank');
        } catch {
            alert('Gagal membuat link WhatsApp');
        } finally {
            setSendingWa(false);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Pengajuan Cuti" />
            <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/leaves" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Detail Pengajuan</h1>
                        <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium border ${cfg.color}`}>
                            {cfg.label}
                        </span>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Info Card */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div><span className="text-neutral-500 dark:text-neutral-400">Nama Karyawan</span><p className="font-medium text-neutral-900 dark:text-white mt-0.5">{lr.employee?.nama}</p></div>
                            <div><span className="text-neutral-500 dark:text-neutral-400">Departemen</span><p className="font-medium text-neutral-900 dark:text-white mt-0.5">{lr.employee?.department?.name || '-'}</p></div>
                            <div><span className="text-neutral-500 dark:text-neutral-400">Jenis Cuti</span><p className="font-medium text-neutral-900 dark:text-white mt-0.5">{lr.leave_type?.name}</p></div>
                            <div><span className="text-neutral-500 dark:text-neutral-400">Durasi</span><p className="font-medium text-neutral-900 dark:text-white mt-0.5">{lr.jumlah_hari} hari</p></div>
                            <div><span className="text-neutral-500 dark:text-neutral-400">Tanggal Mulai</span><p className="font-medium text-neutral-900 dark:text-white mt-0.5">{new Date(lr.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
                            <div><span className="text-neutral-500 dark:text-neutral-400">Tanggal Berakhir</span><p className="font-medium text-neutral-900 dark:text-white mt-0.5">{new Date(lr.tanggal_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
                            <div className="sm:col-span-2"><span className="text-neutral-500 dark:text-neutral-400">Keperluan</span><p className="font-medium text-neutral-900 dark:text-white mt-0.5">{lr.alasan}</p></div>
                            {lr.yang_menggantikan && (
                                <div className="sm:col-span-2"><span className="text-neutral-500 dark:text-neutral-400">Yang Menggantikan</span><p className="font-medium text-neutral-900 dark:text-white mt-0.5">{lr.yang_menggantikan}</p></div>
                            )}
                            {lr.attachment && (
                                <div className="sm:col-span-2">
                                    <span className="text-neutral-500 dark:text-neutral-400">Lampiran</span>
                                    <a href={`/storage/${lr.attachment}`} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline">
                                        <Paperclip className="w-4 h-4" /> Lihat Lampiran
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Approval Timeline */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Status Persetujuan</h3>
                        <div className="space-y-4">
                            {/* Level 1: Supervisor */}
                            <div className="flex items-start gap-3">
                                {lr.supervisor_status === 'approved' ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /> : lr.supervisor_status === 'rejected' ? <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" /> : <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />}
                                <div>
                                    <p className="text-sm font-medium text-neutral-900 dark:text-white">Persetujuan Level 1 (Supervisor/Manager)</p>
                                    <p className="text-xs text-neutral-500 capitalize">{lr.supervisor_status}</p>
                                    {lr.approved_by_supervisor && <p className="text-xs text-neutral-500 mt-0.5">Oleh: {lr.approved_by_supervisor.nama}</p>}
                                    {lr.supervisor_notes && <p className="text-xs text-neutral-500 mt-0.5 italic">"{lr.supervisor_notes}"</p>}
                                </div>
                            </div>
                            {/* Level 2: Manager */}
                            <div className="flex items-start gap-3">
                                {lr.manager_status === 'approved' ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /> : lr.manager_status === 'rejected' ? <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" /> : <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />}
                                <div>
                                    <p className="text-sm font-medium text-neutral-900 dark:text-white">Persetujuan Level 2 (Manager/Direktur)</p>
                                    <p className="text-xs text-neutral-500 capitalize">{lr.manager_status}</p>
                                    {lr.approved_by_manager && <p className="text-xs text-neutral-500 mt-0.5">Oleh: {lr.approved_by_manager.nama}</p>}
                                    {lr.manager_notes && <p className="text-xs text-neutral-500 mt-0.5 italic">"{lr.manager_notes}"</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                        {canApprove() && (
                            <>
                                <button
                                    onClick={() => { if (confirm('Setujui pengajuan ini?')) router.post(`/leaves/${lr.id}/approve`); }}
                                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700"
                                >
                                    <CheckCircle2 className="w-4 h-4" /> Setujui
                                </button>
                                <button
                                    onClick={() => { const notes = prompt('Alasan penolakan:'); if (notes !== null) router.post(`/leaves/${lr.id}/reject`, { notes }); }}
                                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
                                >
                                    <XCircle className="w-4 h-4" /> Tolak
                                </button>
                            </>
                        )}
                        {(lr.status === 'pending' || lr.status === 'partially_approved') && (
                            <button
                                onClick={handleWhatsApp}
                                disabled={sendingWa}
                                className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-600 disabled:opacity-50"
                            >
                                <MessageCircle className="w-4 h-4" /> {sendingWa ? 'Membuat link...' : 'Kirim WhatsApp ke Atasan'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
