import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Pagination } from '@/types';
import { FileText, Play, Trash2, Eye } from 'lucide-react';

interface Payroll {
    id: number;
    periode: string; // YYYY-MM
    tanggal_proses: string;
    status: string;
    notes: string | null;
    processed_by?: { id: number; name: string };
    created_at: string;
}

interface Props {
    payrolls: Pagination<Payroll>;
    flash?: { success?: string; error?: string };
}

export default function PayrollIndex({ payrolls, flash }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Payroll', href: '/payrolls' },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        periode: new Date().toISOString().substring(0, 7), // defaults to current YYYY-MM
        notes: '',
    });

    const [isGenerating, setIsGenerating] = useState(false);

    function handleGenerate(e: React.FormEvent) {
        e.preventDefault();
        
        if (confirm(`Apakah Anda yakin ingin memproses payroll untuk periode ${data.periode}?\nIni akan mengkalkulasi ulang data untuk semua karyawan aktif.`)) {
            setIsGenerating(true);
            post('/payrolls/generate', {
                onFinish: () => {
                    setIsGenerating(false);
                    // Hide modal or reset if we had one
                }
            });
        }
    }

    function handleDelete(id: number, periode: string) {
        if (confirm(`Hapus data payroll periode ${periode}? Data payslip karyawan untuk bulan ini juga akan terhapus!`)) {
            router.delete(`/payrolls/${id}`);
        }
    }

    // Format YYYY-MM to Indonesian Month Year
    const formatPeriode = (periode: string) => {
        const [year, month] = periode.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Payroll" />
            <div className="mx-auto max-w-7xl p-6">
                
                {/* Header & Generate Card */}
                <div className="mb-8 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                <FileText className="size-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Proses Payroll Bulanan</h1>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">Generate perhitungan gaji, BPJS, dan PPh21 untuk seluruh karyawan aktif.</p>
                            </div>
                        </div>
                    </div>
                    
                    <form onSubmit={handleGenerate} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-end">
                        <div className="flex-1">
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Pilih Periode (Bulan & Tahun)
                            </label>
                            <input
                                type="month"
                                value={data.periode}
                                onChange={e => setData('periode', e.target.value)}
                                className="block w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                required
                            />
                            {errors.periode && <p className="mt-1 text-xs text-red-500">{errors.periode}</p>}
                        </div>
                        <div className="flex-1">
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Catatan (Opsional)
                            </label>
                            <input
                                type="text"
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                                placeholder="Misal: Termasuk bonus Q1"
                                className="block w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={processing || isGenerating}
                            className="inline-flex h-[38px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Play className="size-4" />
                            {processing || isGenerating ? 'Memproses...' : 'Generate Payroll'}
                        </button>
                    </form>
                </div>

                {/* Payroll History List */}
                <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
                        <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Riwayat Payroll</h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-neutral-600 dark:text-neutral-400">
                            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
                                <tr>
                                    <th className="px-6 py-4">Periode</th>
                                    <th className="px-6 py-4">Tanggal Proses</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Diproses Oleh</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {payrolls.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                                            Belum ada data payroll yang diproses.
                                        </td>
                                    </tr>
                                ) : (
                                    payrolls.data.map((payroll) => (
                                        <tr key={payroll.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                            <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">
                                                {formatPeriode(payroll.periode)}
                                                {payroll.notes && <div className="mt-1 text-xs font-normal text-neutral-500">{payroll.notes}</div>}
                                            </td>
                                            <td className="px-6 py-4">{new Date(payroll.tanggal_proses).toLocaleDateString('id-ID')}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    payroll.status === 'finalized' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }`}>
                                                    {payroll.status === 'finalized' ? 'Final' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{payroll.processed_by?.name || '-'}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <Link href={`/payrolls/${payroll.id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" title="Lihat Detail & Slip Gaji">
                                                        <Eye className="size-4.5" />
                                                    </Link>
                                                    {payroll.status !== 'finalized' && (
                                                        <button onClick={() => handleDelete(payroll.id, payroll.periode)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Hapus Data">
                                                            <Trash2 className="size-4.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {payrolls.links && payrolls.links.length > 3 && (
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-1">
                        {payrolls.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`rounded-md px-3 py-1 text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-neutral-700 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'} border border-neutral-200 dark:border-neutral-700 ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
