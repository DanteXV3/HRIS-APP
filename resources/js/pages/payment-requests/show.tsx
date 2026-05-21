import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { 
    CheckCircle2, XCircle, Clock, FileText, Download, 
    MessageCircle, ArrowLeft, Paperclip, User, Calendar, 
    Building2, Briefcase, Banknote, ShieldCheck, AlertCircle,
    ChevronDown, ChevronUp
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PaymentRequest } from '@/types';
import { useState } from 'react';

interface Props {
    pr: PaymentRequest;
}

export default function PaymentRequestShow() {
    const { pr } = usePage<{ props: Props }>().props as unknown as Props;
    const { auth } = usePage().props as any;
    const currentEmployee = auth.user.employee;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Payment Request', href: '/payment-requests' },
        { title: 'Detail Request', href: '#' },
    ];

    const { data, setData, post, processing } = useForm({
        notes: '',
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const levels = [
        { key: 'tax', label: 'Tax', status: pr.tax_status, approver: pr.tax_approver, date: pr.tax_approved_at, signature: pr.tax_signature_snapshot, notes: pr.tax_notes },
        { key: 'accounting', label: 'Accounting', status: pr.accounting_status, approver: pr.accounting_approver, date: pr.accounting_approved_at, signature: pr.accounting_signature_snapshot, notes: pr.accounting_notes },
        { key: 'cost_control', label: 'Cost Control', status: pr.cost_control_status, approver: pr.cost_control_approver, date: pr.cost_control_approved_at, signature: pr.cost_control_signature_snapshot, notes: pr.cost_control_notes },
        { key: 'head_branch', label: 'Head Branch / General Manager', status: pr.head_branch_status, approver: pr.head_branch_approver, date: pr.head_branch_approved_at, signature: pr.head_branch_signature_snapshot, notes: pr.head_branch_notes },
        { key: 'director', label: 'Director', status: pr.director_status, approver: pr.director_approver, date: pr.director_approved_at, signature: pr.director_signature_snapshot, notes: pr.director_notes },
        { key: 'commissioner', label: 'Commissioner', status: pr.commissioner_status, approver: pr.commissioner_approver, date: pr.commissioner_approved_at, signature: pr.commissioner_signature_snapshot, notes: pr.commissioner_notes },
        { key: 'advisor', label: 'Advisor', status: pr.advisor_status, approver: pr.advisor_approver, date: pr.advisor_approved_at, signature: pr.advisor_signature_snapshot, notes: pr.advisor_notes },
        { key: 'finance', label: 'Finance', status: pr.finance_status, approver: pr.finance_approver, date: pr.finance_approved_at, signature: pr.finance_signature_snapshot, notes: pr.finance_notes },
    ];

    // Find current approval level: first 'pending' status, or first null status after chain of approved/skipped
    const findCurrentLevel = () => {
        const pending = levels.find(l => l.status === 'pending');
        if (pending) return pending.key;
        let allPrevApproved = true;
        for (const l of levels) {
            if (!l.status && allPrevApproved) return l.key;
            if (l.status !== 'approved' && l.status !== 'skipped') allPrevApproved = false;
        }
        return null;
    };
    const currentLevel = findCurrentLevel();
    const canApprove = currentLevel && (auth.user.isAdmin || auth.user.permissions?.includes(`pr.approve.${currentLevel}`));

    const handleApprove = () => {
        if (confirm(`Approve this request as ${currentLevel}?`)) {
            post(`/payment-requests/${pr.id}/approve`);
        }
    };

    const handleReject = () => {
        if (!data.notes) {
            alert('Harap berikan alasan penolakan.');
            return;
        }
        if (confirm(`Reject this request as ${currentLevel}?`)) {
            post(`/payment-requests/${pr.id}/reject`);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case 'rejected': return <XCircle className="h-5 w-5 text-red-500" />;
            case 'skipped': return <ShieldCheck className="h-5 w-5 text-neutral-400" />;
            default: return <Clock className="h-5 w-5 text-yellow-500" />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Payment Request - ${pr.pr_number}`} />

            <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-8">
                <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link href="/payment-requests" className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white shadow-sm hover:bg-neutral-50 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors">
                            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-base sm:text-2xl font-bold text-neutral-900 dark:text-white uppercase truncate">{pr.pr_number}</h1>
                            <p className="text-[10px] sm:text-sm text-neutral-500 truncate">{new Date(pr.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>
                    <div className="flex gap-2 ml-12 sm:ml-0">
                         <a href={`/payment-requests/${pr.id}/pdf`} 
                            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg border border-neutral-300 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 transition-all active:scale-95">
                            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Download</span> PDF
                        </a>
                        <a href={`/payment-requests/${pr.id}/whatsapp`} target="_blank" rel="noreferrer"
                           className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-green-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-green-700 transition-all active:scale-95">
                            <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Kirim</span> WhatsApp
                        </a>
                    </div>
                </div>

                <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {/* Request Card */}
                        <div className="w-full max-w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-3 sm:p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-500">Informasi Pengajuan</h3>
                            </div>
                            <div className="p-4 sm:p-6">
                                <div className="mb-6 sm:mb-8">
                                    <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-2 break-words leading-tight">{pr.subject}</h2>
                                    <p className="text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap break-words text-xs sm:text-sm">{pr.description}</p>
                                </div>

                                <div className="grid gap-4 sm:gap-6 grid-cols-2">
                                     <div className="flex items-start gap-2 sm:gap-3">
                                        <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                            <Banknote className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-400">Jumlah Total</p>
                                            <p className="text-sm sm:text-lg font-bold text-neutral-900 dark:text-white truncate">{formatCurrency(pr.amount)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 sm:gap-3">
                                        <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                                            <User className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-400">Dibayarkan Kepada</p>
                                            <p className="text-sm sm:text-lg font-bold text-neutral-900 dark:text-white truncate">{pr.paid_to}</p>
                                            {pr.bank_name && <p className="text-[10px] sm:text-xs text-neutral-500 truncate">{pr.bank_name} - {pr.bank_account}</p>}
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 sm:gap-3">
                                        <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                                            <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-400">Lokasi Penempatan</p>
                                            <p className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white truncate">{pr.work_location?.name || 'N/A'}</p>
                                            <p className="text-[10px] sm:text-xs text-neutral-500 truncate">{pr.company?.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 sm:gap-3">
                                        <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                                            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-400">Departemen</p>
                                            <p className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white truncate">{pr.department?.name}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 sm:mt-8">
                                    <h3 className="mb-3 sm:mb-4 text-[11px] font-bold uppercase tracking-widest text-neutral-400">Rincian Item</h3>
                                    
                                    {/* Desktop Table */}
                                    <div className="hidden sm:block overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-[600px] text-left text-sm sm:min-w-0">
                                                <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                                                    <tr className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                                                        <th className="px-4 py-3 min-w-[200px]">Deskripsi</th>
                                                        <th className="px-4 py-3 text-center">Satuan</th>
                                                        <th className="px-4 py-3 text-right">Qty</th>
                                                        <th className="px-4 py-3 text-right">Harga</th>
                                                        <th className="px-4 py-3 text-right font-semibold text-neutral-900 dark:text-white min-w-[120px]">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                                    {pr.items?.map((item) => (
                                                        <tr key={item.id}>
                                                            <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300 break-words">{item.description}</td>
                                                            <td className="px-4 py-3 text-center text-neutral-600 dark:text-neutral-400">{item.unit || 'Pcs'}</td>
                                                            <td className="px-4 py-3 text-right text-neutral-600 dark:text-neutral-400">{item.qty || 1}</td>
                                                            <td className="px-4 py-3 text-right text-neutral-600 dark:text-neutral-400">{formatCurrency(item.price || item.amount)}</td>
                                                            <td className="px-4 py-3 text-right font-medium text-neutral-900 dark:text-white">{formatCurrency(item.amount)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-neutral-50/50 font-bold dark:bg-neutral-800/20">
                                                    <tr>
                                                        <td colSpan={4} className="px-4 py-3 text-right text-xs uppercase text-neutral-500">Total Estimasi</td>
                                                        <td className="px-4 py-3 text-right text-blue-600 dark:text-blue-400 text-lg whitespace-nowrap">{formatCurrency(pr.amount)}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Mobile Cards */}
                                    <div className="sm:hidden space-y-2">
                                        {pr.items?.map((item) => (
                                            <div key={item.id} className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-800/30">
                                                <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-2 break-words">{item.description}</p>
                                                <div className="flex items-center justify-between text-xs text-neutral-500">
                                                    <div className="flex items-center gap-3">
                                                        <span>{item.qty || 1} {item.unit || 'Pcs'}</span>
                                                        <span>× {formatCurrency(item.price || item.amount)}</span>
                                                    </div>
                                                    <span className="font-bold text-neutral-900 dark:text-white">{formatCurrency(item.amount)}</span>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-3 dark:border-blue-900/40 dark:bg-blue-900/20">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400">Total Estimasi</span>
                                                <span className="text-base font-bold text-blue-600 dark:text-blue-400">{formatCurrency(pr.amount)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {pr.notes && (
                                    <div className="mt-6 sm:mt-8 rounded-xl bg-neutral-50 p-3 sm:p-4 dark:bg-neutral-800/50">
                                        <p className="text-xs font-bold uppercase text-neutral-400 mb-1">Catatan Tambahan</p>
                                        <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 italic">"{pr.notes}"</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Attachments Card */}
                        <div className="w-full max-w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-3 sm:p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-500">Lampiran ({pr.attachments?.length || 0})</h3>
                            </div>
                            <div className="p-4 sm:p-6">
                                {pr.attachments && pr.attachments.length > 0 ? (
                                    <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                                        {pr.attachments.map((file) => (
                                            <a key={file.id} href={`/storage/${file.file_path}`} target="_blank" rel="noreferrer" 
                                               className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50 transition-colors group">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 group-hover:bg-white dark:bg-neutral-800">
                                                    <Paperclip className="h-5 w-5 text-neutral-400" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-xs sm:text-sm font-medium text-neutral-900 dark:text-white">{file.file_name}</p>
                                                    <p className="text-[10px] text-neutral-500">Klik untuk melihat file</p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-sm text-neutral-500 py-4">Tidak ada lampiran.</p>
                                )}
                            </div>
                        </div>

                        {/* Approval Action Form (Only if can approve) */}
                        {canApprove && (
                            <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/50 p-4 sm:p-6 dark:border-blue-900/30 dark:bg-blue-900/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                                    <h3 className="text-base sm:text-lg font-bold text-blue-900 dark:text-blue-300">Approval Required: {currentLevel?.toUpperCase().replace('_', ' ')}</h3>
                                </div>
                                <textarea 
                                    value={data.notes} 
                                    onChange={e => setData('notes', e.target.value)}
                                    placeholder="Tuliskan catatan atau alasan di sini..."
                                    className="w-full rounded-xl border-neutral-200 bg-white p-3 sm:p-4 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-800 dark:bg-neutral-900"
                                    rows={3}
                                />
                                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                                    <button 
                                        onClick={handleApprove}
                                        disabled={processing}
                                        className="w-full sm:w-auto rounded-xl bg-green-600 px-8 py-3 sm:py-2.5 text-sm font-bold text-white shadow-lg shadow-green-600/20 hover:bg-green-700 active:scale-95 disabled:opacity-50"
                                    >
                                        Approve Request
                                    </button>
                                    <button 
                                        onClick={handleReject}
                                        disabled={processing}
                                        className="w-full sm:w-auto rounded-xl bg-red-600 px-8 py-3 sm:py-2.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 hover:bg-red-700 active:scale-95 disabled:opacity-50"
                                    >
                                        Reject Request
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Approval Steps */}
                    <div className="space-y-4 sm:space-y-6">
                        <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h3 className="mb-4 sm:mb-6 text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-500">Alur Persetujuan</h3>
                            
                            <div className="relative space-y-6 sm:space-y-8">
                                {/* Requester Signature */}
                                <div className="flex gap-3 sm:gap-4">
                                    <div className="relative z-10 flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/20">
                                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                    <div className="flex-1 border-b border-neutral-100 pb-3 sm:pb-4 dark:border-neutral-800">
                                        <p className="text-[10px] sm:text-xs font-bold uppercase text-neutral-400">Requester</p>
                                        <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">{pr.requested_by?.nama}</p>
                                        {pr.requester_signature_snapshot && (
                                            <div className="mt-2 h-12 w-24 sm:h-16 sm:w-32 border border-dashed border-neutral-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800">
                                                <img src={`/storage/${pr.requester_signature_snapshot}`} alt="signature" className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                                            </div>
                                        )}
                                        <p className="mt-1 text-[9px] sm:text-[10px] text-neutral-500">{new Date(pr.requested_at).toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Levels */}
                                {levels.map((level, idx) => (
                                    <div key={level.key} className="relative flex gap-3 sm:gap-4">
                                        {idx !== levels.length - 1 && (
                                            <div className="absolute left-3.5 sm:left-4 top-7 sm:top-8 h-full w-0.5 bg-neutral-100 dark:bg-neutral-800 -translate-x-1/2" />
                                        )}
                                        <div className="relative z-10 flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-white dark:bg-neutral-800 border-2 border-neutral-100 dark:border-neutral-800">
                                            {getStatusIcon(level.status)}
                                        </div>
                                        <div className={`flex-1 min-w-0 ${idx !== levels.length - 1 ? 'border-b border-neutral-100 pb-3 sm:pb-4 dark:border-neutral-800' : ''}`}>
                                            <p className="text-[10px] sm:text-xs font-bold uppercase text-neutral-400">{level.label}</p>
                                            
                                            {level.status === 'approved' ? (
                                                <>
                                                    <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate">{level.approver?.nama}</p>
                                                    {level.signature && (
                                                        <div className="mt-2 h-12 w-24 sm:h-16 sm:w-32 border border-dashed border-neutral-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800">
                                                            <img src={`/storage/${level.signature}`} alt="signature" className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                                                        </div>
                                                    )}
                                                    {level.notes && <p className="mt-1 text-[10px] sm:text-[11px] italic text-neutral-500 break-words">"{level.notes}"</p>}
                                                    <p className="mt-1 text-[9px] sm:text-[10px] text-neutral-500">{new Date(level.date!).toLocaleString()}</p>
                                                </>
                                            ) : level.status === 'rejected' ? (
                                                <>
                                                    <p className="text-xs sm:text-sm font-bold text-red-600 truncate">{level.approver?.nama}</p>
                                                    {level.notes && <p className="mt-1 text-[10px] sm:text-[11px] italic text-red-500 break-words">"{level.notes}"</p>}
                                                    <p className="mt-1 text-[9px] sm:text-[10px] text-neutral-500">{new Date(level.date!).toLocaleString()}</p>
                                                </>
                                            ) : level.status === 'skipped' ? (
                                                <p className="text-[10px] sm:text-xs italic text-neutral-500">Skipped: {level.notes}</p>
                                            ) : (
                                                <p className="text-xs sm:text-sm italic text-neutral-400">Waiting for approval...</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
