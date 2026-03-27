import { Head, router, useForm } from '@inertiajs/react';
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Edit3, Trash2, CheckCircle, XCircle as XCircleIcon } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Pagination } from '@/types';
import { useState } from 'react';

interface Correction {
    id: number;
    employee_id: number;
    employee?: { nama: string; nik: string };
    tanggal: string;
    clock_in: string | null;
    clock_out: string | null;
    status: string;
    reason: string;
    approval_status: 'pending' | 'approved' | 'rejected';
    admin_notes: string | null;
    approved_by?: { name: string };
    created_at: string;
}

interface Props {
    corrections: Pagination<Correction>;
    isManager: boolean;
}

export default function CorrectionsIndex({ corrections, isManager }: Props) {
    const [selectedCorrection, setSelectedCorrection] = useState<Correction | null>(null);
    const [isApproveMode, setIsApproveMode] = useState(false);
    const [isRejectMode, setIsRejectMode] = useState(false);
    
    const { data, setData, put, processing, reset } = useForm({
        approval_status: '' as 'approved' | 'rejected',
        admin_notes: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Koreksi Absensi', href: '#' },
    ];

    function handleAction(correction: Correction, type: 'approved' | 'rejected') {
        setSelectedCorrection(correction);
        setData({
            approval_status: type,
            admin_notes: '',
        });
        if (type === 'approved') setIsApproveMode(true);
        else setIsRejectMode(true);
    }

    function submitAction(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedCorrection) return;
        
        put(`/attendance-corrections/${selectedCorrection.id}`, {
            onSuccess: () => {
                setIsApproveMode(false);
                setIsRejectMode(false);
                setSelectedCorrection(null);
                reset();
            },
        });
    }

    function handleDelete(id: number) {
        if (confirm('Apakah Anda yakin ingin membatalkan permintaan ini?')) {
            router.delete(`/attendance-corrections/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Koreksi Absensi" />
            
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                        {isManager ? 'Persetujuan Koreksi Absensi' : 'Riwayat Koreksi Absensi'}
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {isManager 
                            ? 'Tinjau dan proses permintaan koreksi absensi dari karyawan.' 
                            : 'Lihat status permintaan koreksi absensi yang telah Anda ajukan.'}
                    </p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
                        <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                            <tr>
                                {isManager && <th className="px-4 py-3 text-left">Karyawan</th>}
                                <th className="px-4 py-3 text-left">Tanggal</th>
                                <th className="px-4 py-3 text-center">Waktu Koreksi</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-4 py-3 text-left">Alasan</th>
                                <th className="px-4 py-3 text-center">Persetujuan</th>
                                <th className="px-4 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
                            {corrections.data.length > 0 ? (
                                corrections.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                        {isManager && (
                                            <td className="px-4 py-4">
                                                <div className="text-sm font-medium text-neutral-900 dark:text-white">{item.employee?.nama}</div>
                                                <div className="text-xs text-neutral-500">{item.employee?.nik}</div>
                                            </td>
                                        )}
                                        <td className="px-4 py-4 text-sm text-neutral-900 dark:text-white">
                                            {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-4 py-4 text-center text-sm text-neutral-900 dark:text-white font-mono">
                                            {item.clock_in?.substring(0, 5) || '--:--'} — {item.clock_out?.substring(0, 5) || '--:--'}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 capitalize">
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-neutral-500 dark:text-neutral-400 max-w-[200px] truncate">
                                            {item.reason}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                                                ${item.approval_status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                                                  item.approval_status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                                                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                {item.approval_status === 'pending' && <AlertCircle className="size-3" />}
                                                {item.approval_status === 'approved' && <CheckCircle2 className="size-3" />}
                                                {item.approval_status === 'rejected' && <XCircle className="size-3" />}
                                                {item.approval_status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            {isManager && item.approval_status === 'pending' ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <button 
                                                        onClick={() => handleAction(item, 'approved')}
                                                        className="size-8 flex items-center justify-center rounded-lg bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                                                    >
                                                        <CheckCircle className="size-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleAction(item, 'rejected')}
                                                        className="size-8 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                                                    >
                                                        <XCircleIcon className="size-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                !isManager && item.approval_status === 'pending' ? (
                                                    <button 
                                                        onClick={() => handleDelete(item.id)}
                                                        className="size-8 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                ) : '-'
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={isManager ? 7 : 6} className="px-6 py-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
                                        Tidak ada permintaan koreksi.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {corrections.links && corrections.links.length > 3 && (
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-sm text-neutral-500">Menampilkan {corrections.from}-{corrections.to} dari {corrections.total} data</p>
                        <div className="flex flex-wrap items-center justify-center gap-1">
                            {corrections.links.map((link, i) => (
                                <button
                                    key={i}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    className={`rounded-md px-3 py-1 text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-neutral-700 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'} border border-neutral-200 dark:border-neutral-700 disabled:opacity-50`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Approve/Reject Modal */}
            {(isApproveMode || isRejectMode) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                        <h2 className={`text-lg font-bold mb-4 ${isApproveMode ? 'text-green-600' : 'text-red-600'}`}>
                            {isApproveMode ? 'Setujui Koreksi' : 'Tolak Koreksi'}
                        </h2>
                        
                        <div className="mb-4 rounded-lg bg-neutral-50 p-3 text-sm dark:bg-neutral-800/50">
                            <p className="font-medium text-neutral-900 dark:text-white">{selectedCorrection?.employee?.nama}</p>
                            <p className="text-neutral-500">{new Date(selectedCorrection?.tanggal || '').toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                            <p className="mt-2 italic text-neutral-600 dark:text-neutral-400">"{selectedCorrection?.reason}"</p>
                        </div>

                        <form onSubmit={submitAction} className="flex flex-col gap-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400">Catatan Admin (Opsional)</label>
                                <textarea 
                                    rows={3}
                                    className="block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                    value={data.admin_notes}
                                    onChange={e => setData('admin_notes', e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setIsApproveMode(false); setIsRejectMode(false); }}
                                    className="flex-1 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus:ring-2 disabled:opacity-50
                                        ${isApproveMode ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'}`}
                                >
                                    {processing ? 'Memproses...' : (isApproveMode ? 'Ya, Setujui' : 'Ya, Tolak')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
