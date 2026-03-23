import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Pagination } from '@/types';
import { FileText, Download, ReceiptText } from 'lucide-react';

interface PayrollItem {
    id: number;
    payroll_id: number;
    employee_id: number;
    total_pendapatan: number;
    total_potongan: number;
    gaji_bersih: number;
    payroll: {
        id: number;
        periode: string;
        status: string;
    };
}

interface Props {
    payrolls: Pagination<PayrollItem>;
}

export default function MyPayroll({ payrolls }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Gaji Saya', href: '#' },
    ];

    // Format YYYY-MM to Indonesian Month Year
    const formatPeriode = (periode: string) => {
        if (!periode) return '-';
        const [year, month] = periode.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gaji Saya" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Gaji Saya</h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Daftar slip gaji Anda yang sudah difinalisasi.
                    </p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
                            <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                                <tr>
                                    <th className="px-4 py-3 text-left">Periode</th>
                                    <th className="px-4 py-3 text-right">Pendapatan</th>
                                    <th className="px-4 py-3 text-right">Potongan</th>
                                    <th className="px-4 py-3 text-right">Gaji Bersih</th>
                                    <th className="px-4 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
                                {payrolls.data.length > 0 ? (
                                    payrolls.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                            <td className="px-4 py-4 font-medium text-neutral-900 dark:text-white">
                                                {formatPeriode(item.payroll?.periode)}
                                            </td>
                                            <td className="px-4 py-4 text-right text-sm text-neutral-600 dark:text-neutral-300">
                                                {formatCurrency(item.total_pendapatan)}
                                            </td>
                                            <td className="px-4 py-4 text-right text-sm text-red-600 dark:text-red-400">
                                                {formatCurrency(item.total_potongan)}
                                            </td>
                                            <td className="px-4 py-4 text-right text-sm font-bold text-green-600 dark:text-green-400">
                                                {formatCurrency(item.gaji_bersih)}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <a
                                                    href={`/payrolls/${item.payroll_id}/items/${item.id}/pdf`}
                                                    className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                                                >
                                                    <Download className="size-3.5" />
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
                                            <div className="flex flex-col items-center">
                                                <ReceiptText className="h-10 w-10 text-neutral-300 dark:text-neutral-700 mb-3" />
                                                <p>Belum ada slip gaji yang tersedia.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {payrolls.links && payrolls.links.length > 3 && (
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-sm text-neutral-500">Menampilkan {payrolls.from}-{payrolls.to} dari {payrolls.total} data</p>
                        <div className="flex flex-wrap items-center justify-center gap-1">
                            {payrolls.links.map((link, i) => (
                                <a
                                    key={i}
                                    href={link.url || '#'}
                                    className={`rounded-md px-3 py-1 text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-neutral-700 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'} border border-neutral-200 dark:border-neutral-700`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
