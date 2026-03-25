import { Head, Link, usePage } from '@inertiajs/react';
import { Plus, Search, Eye, Clock, CheckCircle2, XCircle, FileText, MessageCircle, ShieldCheck, Download } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Pagination, PaymentRequest } from '@/types';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface Props {
    prs: Pagination<PaymentRequest>;
    filters: { search?: string };
}

export default function PaymentRequestIndex() {
    const { prs, filters } = usePage<{ props: Props }>().props as unknown as Props;
    const { auth } = usePage().props as any;
    const [search, setSearch] = useState(filters.search || '');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Payment Request', href: '#' },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/payment-requests', { search }, { preserveState: true });
    };

    // Determine current approval level for a PR
    const getCurrentLevel = (pr: PaymentRequest) => {
        const levels = ['tax', 'accounting', 'cost_control', 'head_branch', 'director', 'commissioner', 'advisor', 'finance'];
        const pending = levels.find(l => (pr as any)[`${l}_status`] === 'pending');
        if (pending) return pending;
        let allPrevApproved = true;
        for (const l of levels) {
            const status = (pr as any)[`${l}_status`];
            if (!status && allPrevApproved) return l;
            if (status !== 'approved' && status !== 'skipped') allPrevApproved = false;
        }
        return null;
    };

    const canApproveRow = (pr: PaymentRequest) => {
        const level = getCurrentLevel(pr);
        if (!level) return false;
        return auth.user?.isAdmin || auth.user?.permissions?.includes(`pr.approve.${level}`);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"><CheckCircle2 className="h-3 w-3" /> Approved</span>;
            case 'rejected':
                return <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400"><XCircle className="h-3 w-3" /> Rejected</span>;
            case 'partially_approved':
                return <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"><Clock className="h-3 w-3" /> In Progress</span>;
            default:
                return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"><Clock className="h-3 w-3" /> Pending</span>;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment Request" />

            <div className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white text-[25px]">Payment Request</h1>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Kelola pengajuan pembayaran dan persetujuan bertingkat.</p>
                    </div>
                    <Link
                        href="/payment-requests/create"
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-95"
                    >
                        <Plus className="h-4 w-4" /> Buat Pengajuan
                    </Link>
                </div>

                <div className="mt-8 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="border-b border-neutral-200 p-4 dark:border-neutral-800">
                        <form onSubmit={handleSearch} className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Cari No. PR atau Perihal..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 bg-neutral-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            />
                        </form>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-neutral-50 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:bg-neutral-800/50 dark:text-neutral-400">
                                <tr>
                                    <th className="px-6 py-4">No. PR & Tanggal</th>
                                    <th className="px-6 py-4">Perihal</th>
                                    <th className="px-6 py-4">Pengaju</th>
                                    <th className="px-6 py-4">Dept / Comp</th>
                                    <th className="px-6 py-4">Jumlah</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {prs.data.length > 0 ? (
                                    prs.data.map((pr) => (
                                        <tr key={pr.id} className="group transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-neutral-900 dark:text-white">{pr.pr_number}</div>
                                                <div className="text-xs text-neutral-500">{new Date(pr.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="max-w-[200px] truncate font-medium text-neutral-900 dark:text-white" title={pr.subject}>
                                                    {pr.subject}
                                                </div>
                                                <div className="max-w-[200px] truncate text-xs text-neutral-500">
                                                    {pr.paid_to}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-neutral-900 dark:text-white">{pr.requested_by?.nama}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-neutral-900 dark:text-white">{pr.department?.name}</div>
                                                <div className="text-xs text-neutral-500">{pr.company?.name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-neutral-900 dark:text-white">{formatCurrency(pr.amount)}</div>
                                            </td>
                                            <td className="px-6 py-4 lowercase">
                                                {getStatusBadge(pr.status)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={`/payment-requests/${pr.id}`}
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-neutral-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                                                        title="Detail"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                    <a
                                                        href={`/payment-requests/${pr.id}/pdf`}
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                                                        title="Download PDF"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </a>
                                                    {pr.status !== 'rejected' && pr.status !== 'approved' && (
                                                        <a
                                                            href={`/payment-requests/${pr.id}/whatsapp`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-green-500 transition-colors hover:bg-green-50 hover:text-green-700 dark:text-green-400 dark:hover:bg-green-900/30 dark:hover:text-green-300"
                                                            title="Kirim WhatsApp"
                                                        >
                                                            <MessageCircle className="h-4 w-4" />
                                                        </a>
                                                    )}
                                                    {canApproveRow(pr) && (
                                                        <Link
                                                            href={`/payment-requests/${pr.id}`}
                                                            className="inline-flex h-8 items-center justify-center gap-1 rounded-lg bg-green-600 px-2 text-xs font-bold text-white shadow-sm hover:bg-green-700 transition-all active:scale-95"
                                                            title="Approve"
                                                        >
                                                            <ShieldCheck className="h-3.5 w-3.5" /> Approve
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-neutral-500">
                                            <FileText className="mx-auto h-12 w-12 opacity-20" />
                                            <p className="mt-2 text-sm">Tidak ada data Payment Request.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {prs.links.length > 3 && (
                         <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
                            {/* Simple Pagination can be added here if needed */}
                         </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
