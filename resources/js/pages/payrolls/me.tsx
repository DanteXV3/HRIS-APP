import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Pagination } from '@/types';
import { Download, ReceiptText, Calendar } from 'lucide-react';
import React from 'react';

interface PayrollItem {
    id: number;
    payroll_id: number;
    employee_id: number;
    total_pendapatan: number | string;
    total_potongan: number | string;
    gaji_bersih: number | string;
    payroll: {
        id: number;
        periode: string;
        status: string;
    };
}

interface Props {
    payrolls: Pagination<PayrollItem>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Gaji Saya', href: '/my-payroll' },
];

function formatCurrency(value: number | string): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (!num || num === 0) return '-';
    return `Rp ${num.toLocaleString('id-ID')}`;
}

export default function MyPayroll() {
    const { payrolls } = usePage<{ props: Props }>().props as unknown as Props;

    const formatPeriode = (periode: string) => {
        if (!periode) return '-';
        const [year, month] = periode.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gaji Saya" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Gaji Saya</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Daftar slip gaji Anda yang telah difinalisasi</p>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900 shadow-sm">
                    <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700 text-sm">
                        <thead className="bg-neutral-50 dark:bg-neutral-800 font-semibold uppercase text-neutral-500 text-xs">
                            <tr>
                                <th className="px-6 py-4 text-left">Periode</th>
                                <th className="px-6 py-4 text-right">Total Pendapatan</th>
                                <th className="px-6 py-4 text-right">Potongan</th>
                                <th className="px-6 py-4 text-right text-blue-600">Gaji Bersih (THP)</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-700 dark:bg-neutral-900">
                            {payrolls.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <ReceiptText className="h-10 w-10 text-neutral-200 dark:text-neutral-800" />
                                            <p className="italic">Belum ada slip gaji yang tersedia.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                payrolls.data.map((item) => (
                                    <tr key={item.id} className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                        <td className="px-6 py-4 font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                                                <Calendar className="h-4 w-4 text-blue-600" />
                                            </div>
                                            {formatPeriode(item.payroll?.periode)}
                                        </td>
                                        <td className="px-6 py-4 text-right tabular-nums">{formatCurrency(item.total_pendapatan)}</td>
                                        <td className="px-6 py-4 text-right tabular-nums text-red-500">-{formatCurrency(item.total_potongan)}</td>
                                        <td className="px-6 py-4 text-right tabular-nums font-bold text-blue-600 dark:text-blue-400">{formatCurrency(item.gaji_bersih)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <a href={`/payrolls/${item.payroll_id}/items/${item.id}/pdf`} target="_blank"
                                                className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors">
                                                <Download className="h-3.5 w-3.5" /> Download PDF
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {payrolls.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-700">
                        <p className="text-sm text-neutral-500 italic">Menampilkan {payrolls.from}-{payrolls.to} dari {payrolls.total} data</p>
                        <div className="flex gap-1">
                            {payrolls.links.map((link, i) => (
                                <Link key={i} href={link.url ?? '#'} className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${link.active ? 'bg-blue-600 text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'}`} dangerouslySetInnerHTML={{ __html: link.label }} preserveState />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
