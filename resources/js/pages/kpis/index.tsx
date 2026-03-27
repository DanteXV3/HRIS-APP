import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Pagination } from '@/types';
import { FileText, Plus, MessageCircle, Eye, Edit3 } from 'lucide-react';

interface KpiEvaluation {
    id: number;
    employee: {
        nama: string;
        nik: string;
        department?: { name: string };
        position?: { name: string };
    };
    evaluator?: { nama: string };
    hr?: { nama: string };
    period_type: string;
    period_detail: string | null;
    evaluation_date: string;
    status: 'pending_hr' | 'pending_manager' | 'pending_employee' | 'completed';
    total_score: number;
}

interface Props {
    evaluations: Pagination<KpiEvaluation>;
    isHR: boolean;
}

export default function KpiIndex({ evaluations, isHR }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Evaluasi KPI', href: '#' },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending_hr': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 border border-amber-200">Menunggu HR</span>;
            case 'pending_manager': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">Menunggu Manager</span>;
            case 'pending_employee': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">Menunggu Karyawan</span>;
            case 'completed': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">Selesai</span>;
            default: return <span className="px-2 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200">{status}</span>;
        }
    };

    const handleWA = (id: number) => {
        fetch(`/kpi-evaluations/${id}/whatsapp`)
            .then(res => res.json())
            .then(data => {
                if (data.url) window.open(data.url, '_blank');
                else alert(data.error || 'Terjadi kesalahan');
            });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Evaluasi KPI" />
            
            <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                            <FileText className="w-6 h-6 text-blue-600" />
                            Evaluasi KPI Karyawan
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Kelola dan pantau proses evaluasi kinerja berkala.
                        </p>
                    </div>

                    {isHR && (
                        <Link
                            href="/kpi-evaluations/create"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Buat Evaluasi Baru
                        </Link>
                    )}
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 font-medium uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Karyawan</th>
                                    <th className="px-6 py-4">Periode</th>
                                    <th className="px-6 py-4">Tanggal Eval</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Skor (1-10)</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {evaluations.data.length > 0 ? (
                                    evaluations.data.map((evalu) => (
                                        <tr key={evalu.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-neutral-900 dark:text-white">{evalu.employee.nama}</div>
                                                <div className="text-xs text-neutral-500 dark:text-neutral-400">{evalu.employee.nik} • {evalu.employee.position?.name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-neutral-700 dark:text-neutral-300 capitalize">{evalu.period_type.replace(/_/g, ' ')}</div>
                                                {evalu.period_detail && <div className="text-xs text-neutral-500">{evalu.period_detail}</div>}
                                            </td>
                                            <td className="px-6 py-4 text-neutral-700 dark:text-neutral-300">
                                                {new Date(evalu.evaluation_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(evalu.status)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`font-bold text-lg ${(evalu.total_score / 10) >= 7.5 ? 'text-emerald-600' : (evalu.total_score / 10) >= 5 ? 'text-blue-600' : 'text-amber-600'}`}>
                                                    {(evalu.total_score / 10).toFixed(1)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => window.open(`/kpi-evaluations/${evalu.id}/pdf`, '_blank')}
                                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        title="Cetak PDF"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleWA(evalu.id)}
                                                        className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                                                        title="Kirim Notifikasi WA"
                                                    >
                                                        <MessageCircle className="w-4 h-4" />
                                                    </button>
                                                    <Link
                                                        href={`/kpi-evaluations/${evalu.id}/edit`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                        title="Detail / Edit"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-neutral-500 dark:text-neutral-400">
                                            Belum ada data evaluasi KPI.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
