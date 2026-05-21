import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { 
    CheckCircle2, XCircle, Clock, FileText, Download, 
    MessageCircle, ArrowLeft, Paperclip, User, Calendar, 
    Building2, Briefcase, Banknote, ShieldCheck, AlertCircle,
    Edit3, Save, X
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { useState, useEffect } from 'react';

interface MSRItem {
    id: number;
    category: 'Material' | 'Jasa';
    item_name: string;
    item_code?: string;
    size?: string;
    material?: string;
    unit: string;
    qty: number;
    price: number;
    total_price: number;
    keterangan?: string;
}

interface MSR {
    id: number;
    msr_number: string;
    date: string;
    subject: string;
    description: string;
    total_amount: number;
    notes?: string;
    status: string;
    requested_by: { nama: string };
    company: { name: string };
    work_location: { name: string };
    department: { name: string };
    requester_signature_snapshot?: string;
    requested_at: string;
    items: MSRItem[];
    attachments: { id: number, file_path: string, file_name: string }[];
    
    supervisor_status: string;
    supervisor_approver?: { nama: string };
    supervisor_approved_at?: string;
    supervisor_signature_snapshot?: string;
    supervisor_notes?: string;

    manager_status: string;
    manager_approver?: { nama: string };
    manager_approved_at?: string;
    manager_signature_snapshot?: string;
    manager_notes?: string;

    pr_maker_status: string;
    pr_maker_approver?: { nama: string };
    pr_maker_approved_at?: string;
    pr_maker_signature_snapshot?: string;
    pr_maker_notes?: string;

    finance_status: string;
    finance_approver?: { nama: string };
    finance_approved_at?: string;
    finance_signature_snapshot?: string;
    finance_notes?: string;
}

interface Props {
    msr: MSR;
}

export default function MSRShow() {
    const { msr } = usePage<{ props: Props }>().props as unknown as Props;
    const { auth } = usePage().props as any;
    const currentEmployee = auth.user.employee;

    const [isEditingItems, setIsEditingItems] = useState(false);
    const [editedItems, setEditedItems] = useState<MSRItem[]>(msr.items);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Material & Service Request', href: '/msr' },
        { title: 'Detail Request', href: '#' },
    ];

    const { data, setData, post, processing, transform } = useForm({
        notes: '',
        items: [] as any[],
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const levels = [
        { key: 'supervisor', label: 'Site Supervisor / Manager', status: msr.supervisor_status, approver: msr.supervisor_approver, date: msr.supervisor_approved_at, signature: msr.supervisor_signature_snapshot, notes: msr.supervisor_notes, perm: 'msr.approve_supervisor' },
        { key: 'manager', label: 'General Manager', status: msr.manager_status, approver: msr.manager_approver, date: msr.manager_approved_at, signature: msr.manager_signature_snapshot, notes: msr.manager_notes, perm: 'msr.approve_manager' },
        { 
            key: 'pr_maker', 
            label: 'PR Maker (Dept)', 
            status: msr.pr_maker_status, 
            approver: msr.pr_maker_approver, 
            date: msr.pr_maker_approved_at, 
            signature: msr.pr_maker_signature_snapshot, 
            notes: msr.pr_maker_notes, 
            perm: 'msr.approve_pr_maker' // This is dynamic in backend, but for UI check we use logic
        },
        { key: 'finance', label: 'Finance', status: msr.finance_status, approver: msr.finance_approver, date: msr.finance_approved_at, signature: msr.finance_signature_snapshot, notes: msr.finance_notes, perm: 'msr.approve_finance' },
    ];

    const findCurrentLevel = () => {
        const pending = levels.find(l => l.status === 'pending');
        if (pending) return pending.key;
        return null;
    };

    const currentLevelKey = findCurrentLevel();
    const currentLevel = levels.find(l => l.key === currentLevelKey);

    // Permission check
    const canApprove = () => {
        if (!currentLevelKey) return false;
        if (auth.user.isAdmin) return true;
        
        // Dynamic check for PR Maker
        if (currentLevelKey === 'pr_maker') {
            const prMakerPerms = ['msr.approve_procurement', 'msr.approve_ga', 'msr.approve_hrd'];
            return prMakerPerms.some(p => auth.user.permissions?.includes(p));
        }

        return auth.user.permissions?.includes(currentLevel?.perm);
    };

    const handleApprove = () => {
        if (confirm(`Setujui pengajuan ini sebagai ${currentLevel?.label}?`)) {
            transform((data) => ({
                notes: data.notes,
                ...(isEditingItems ? { items: editedItems.map(i => ({ id: i.id, qty: i.qty, price: i.price })) } : {})
            }));
            post(`/msr/${msr.id}/approve`, {
                onSuccess: () => setIsEditingItems(false)
            });
        }
    };

    const handleReject = () => {
        if (!data.notes) {
            alert('Mohon berikan alasan penolakan pada kolom catatan.');
            return;
        }
        if (confirm('Tolak pengajuan ini?')) {
            transform((data) => ({ notes: data.notes }));
            post(`/msr/${msr.id}/reject`);
        }
    };

    const updateEditedItem = (id: number, field: string, value: number) => {
        setEditedItems(items => items.map(item => item.id === id ? { ...item, [field]: value, total_price: field === 'qty' ? value * item.price : item.qty * value } : item));
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case 'rejected': return <XCircle className="h-5 w-5 text-red-500" />;
            default: return <Clock className="h-5 w-5 text-yellow-500" />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`MSR - ${msr.msr_number}`} />

            <div className="mx-auto max-w-6xl px-4 py-4 sm:p-6">
                <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link href="/msr" className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white shadow-sm hover:bg-neutral-50 dark:bg-neutral-800 transition-colors">
                            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-base sm:text-2xl font-bold text-neutral-900 dark:text-white uppercase tracking-tight truncate">{msr.msr_number}</h1>
                            <p className="text-[10px] sm:text-xs font-medium text-neutral-500 uppercase truncate">{new Date(msr.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-12 sm:ml-0">
                        <a href={`/msr/${msr.id}/pdf`}
                           className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg border border-neutral-300 bg-white px-3 sm:px-4 py-2 text-xs font-bold text-neutral-700 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> PDF
                        </a>
                        <a href={`/msr/${msr.id}/whatsapp`} target="_blank" rel="noreferrer"
                           className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-green-600 px-3 sm:px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-green-700">
                            <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> WhatsApp
                        </a>
                    </div>
                </div>

                <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {/* Info Card */}
                        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="border-b border-neutral-100 bg-neutral-50/50 px-4 py-3 sm:p-4 dark:border-neutral-800">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Informasi Permintaan</h3>
                            </div>
                            <div className="p-4 sm:p-6">
                                <div className="mb-6 sm:mb-8">
                                    <h2 className="text-lg sm:text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-2 break-words">{msr.subject}</h2>
                                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap leading-relaxed">{msr.description}</p>
                                </div>

                                <div className="grid gap-4 sm:gap-6 grid-cols-2">
                                     <div className="flex items-start gap-2 sm:gap-3">
                                        <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20">
                                            <Banknote className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[9px] sm:text-[10px] font-bold uppercase text-neutral-400">Total Estimasi</p>
                                            <p className="text-sm sm:text-lg font-black text-indigo-600 dark:text-indigo-400 truncate">
                                                {formatCurrency(isEditingItems ? editedItems.reduce((acc, i) => acc + (i.qty * i.price), 0) : msr.total_amount)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 sm:gap-3">
                                        <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-900/20">
                                            <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[9px] sm:text-[10px] font-bold uppercase text-neutral-400">Lokasi Proyek</p>
                                            <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate">{msr.work_location?.name}</p>
                                            <p className="text-[9px] sm:text-[10px] text-neutral-500 uppercase truncate">{msr.company?.name}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Items Table */}
                                <div className="mt-6 sm:mt-8">
                                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Rincian Material & Jasa</h3>
                                        {canApprove() && !isEditingItems && currentLevelKey !== 'finance' && (
                                            <button onClick={() => setIsEditingItems(true)} className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 uppercase hover:underline">
                                                <Edit3 className="h-3 w-3" /> Edit Qty/Price
                                            </button>
                                        )}
                                        {isEditingItems && (
                                            <button onClick={() => {setIsEditingItems(false); setEditedItems(msr.items);}} className="flex items-center gap-1 text-[10px] font-bold text-red-600 uppercase hover:underline">
                                                <X className="h-3 w-3" /> Cancel Edit
                                            </button>
                                        )}
                                    </div>

                                    {/* Desktop Table */}
                                    <div className="hidden sm:block overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-xs min-w-[600px]">
                                                <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                                                    <tr className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                                                        <th className="px-4 py-3">Kategori</th>
                                                        <th className="px-4 py-3">Item / Spesifikasi</th>
                                                        <th className="px-4 py-3 text-center">Satuan</th>
                                                        <th className="w-24 px-4 py-3 text-right">Qty</th>
                                                        <th className="w-32 px-4 py-3 text-right">Harga</th>
                                                        <th className="w-32 px-4 py-3 text-right font-bold text-neutral-900 dark:text-white">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                                    {(isEditingItems ? editedItems : msr.items).map((item) => (
                                                        <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                                                            <td className="px-4 py-3 font-bold text-indigo-600 uppercase text-[9px]">{item.category}</td>
                                                            <td className="px-4 py-3">
                                                                <div className="font-bold text-neutral-900 dark:text-white">{item.item_name}</div>
                                                                {(item.size || item.material) && (
                                                                    <div className="text-[10px] text-neutral-500 italic">
                                                                        {item.material}{item.size ? ` (Size: ${item.size})` : ''}
                                                                    </div>
                                                                )}
                                                                {item.keterangan && <div className="text-[9px] text-neutral-400 mt-0.5">{item.keterangan}</div>}
                                                            </td>
                                                            <td className="px-4 py-3 text-center font-medium">{item.unit}</td>
                                                            <td className="px-4 py-3 text-right">
                                                                {isEditingItems ? (
                                                                    <input type="number" value={item.qty} onChange={e => updateEditedItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                                                                        className="w-full rounded border-neutral-200 p-1 text-right text-xs focus:ring-1 focus:ring-indigo-500" />
                                                                ) : item.qty}
                                                            </td>
                                                            <td className="px-4 py-3 text-right">
                                                                {isEditingItems ? (
                                                                    <input type="number" value={item.price} onChange={e => updateEditedItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                                                        className="w-full rounded border-neutral-200 p-1 text-right text-xs focus:ring-1 focus:ring-indigo-500" />
                                                                ) : formatCurrency(item.price)}
                                                            </td>
                                                            <td className="px-4 py-3 text-right font-bold text-neutral-900 dark:text-white tabular-nums">
                                                                {formatCurrency(item.total_price)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Mobile Cards */}
                                    <div className="sm:hidden space-y-2">
                                        {(isEditingItems ? editedItems : msr.items).map((item) => (
                                            <div key={item.id} className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-800/30">
                                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                                    <div className="min-w-0 flex-1">
                                                        <span className="inline-block text-[8px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded dark:bg-indigo-900/30 dark:text-indigo-400">{item.category}</span>
                                                        <p className="text-sm font-bold text-neutral-900 dark:text-white mt-1 break-words">{item.item_name}</p>
                                                    </div>
                                                </div>
                                                {(item.size || item.material) && (
                                                    <p className="text-[10px] text-neutral-500 italic mb-1">
                                                        {item.material}{item.size ? ` (Size: ${item.size})` : ''}
                                                    </p>
                                                )}
                                                {item.keterangan && <p className="text-[9px] text-neutral-400 mb-2">{item.keterangan}</p>}
                                                
                                                {isEditingItems ? (
                                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                                        <div>
                                                            <label className="text-[9px] font-bold uppercase text-neutral-400">Qty</label>
                                                            <input type="number" value={item.qty} onChange={e => updateEditedItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                                                                className="mt-0.5 w-full rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-right text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
                                                        </div>
                                                        <div>
                                                            <label className="text-[9px] font-bold uppercase text-neutral-400">Harga</label>
                                                            <input type="number" value={item.price} onChange={e => updateEditedItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                                                className="mt-0.5 w-full rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-right text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between text-xs text-neutral-500 mt-2">
                                                        <div className="flex items-center gap-2">
                                                            <span>{item.qty} {item.unit}</span>
                                                            <span className="text-neutral-300">×</span>
                                                            <span>{formatCurrency(item.price)}</span>
                                                        </div>
                                                        <span className="font-bold text-neutral-900 dark:text-white">{formatCurrency(item.total_price)}</span>
                                                    </div>
                                                )}

                                                {isEditingItems && (
                                                    <div className="flex items-center justify-between rounded-lg bg-indigo-50/80 px-3 py-1.5 mt-2 dark:bg-indigo-900/20">
                                                        <span className="text-[9px] font-bold uppercase text-neutral-500">Subtotal</span>
                                                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(item.qty * item.price)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {/* Mobile Total */}
                                        <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-900/40 dark:bg-indigo-900/20">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400">Total Estimasi</span>
                                                <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                                                    {formatCurrency(isEditingItems ? editedItems.reduce((acc, i) => acc + (i.qty * i.price), 0) : msr.total_amount)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Attachments */}
                        {msr.attachments?.length > 0 && (
                            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                <div className="border-b border-neutral-100 bg-neutral-50/50 px-4 py-3 sm:p-4 dark:border-neutral-800">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Lampiran / Bukti Pendukung</h3>
                                </div>
                                <div className="p-4 sm:p-6">
                                    <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                                        {msr.attachments.map((file) => (
                                            <a key={file.id} href={`/storage/${file.file_path}`} target="_blank" rel="noreferrer" 
                                               className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3 hover:bg-neutral-50 dark:border-neutral-800 transition-colors group">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 group-hover:bg-white dark:bg-neutral-800">
                                                    <Paperclip className="h-5 w-5 text-neutral-400" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-xs font-bold text-neutral-900 dark:text-white">{file.file_name}</p>
                                                    <p className="text-[9px] text-neutral-500 font-medium">LIHAT DOKUMEN</p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Approval Panel */}
                        {canApprove() && (
                            <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/30 p-4 sm:p-6 dark:border-indigo-900/30 dark:bg-indigo-900/10 shadow-lg shadow-indigo-100/50">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
                                         <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-sm sm:text-base font-black text-indigo-900 dark:text-indigo-300">Konfirmasi Persetujuan</h3>
                                        <p className="text-[10px] sm:text-xs font-bold text-indigo-600 uppercase tracking-tighter truncate">Level: {currentLevel?.label}</p>
                                    </div>
                                </div>
                                
                                {isEditingItems && (
                                     <div className="mb-4 rounded-lg bg-amber-50 p-3 border border-amber-200 flex items-start sm:items-center gap-2">
                                        <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5 sm:mt-0" />
                                        <p className="text-[10px] font-bold text-amber-800 uppercase">Perubahan item akan disimpan saat anda menekan tombol Approve.</p>
                                     </div>
                                )}

                                <textarea 
                                    value={data.notes} 
                                    onChange={e => setData('notes', e.target.value)}
                                    placeholder="Berikan catatan persetujuan atau alasan penolakan..."
                                    className="w-full rounded-xl border-neutral-200 bg-white p-3 sm:p-4 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-neutral-800 dark:bg-neutral-900 mb-4"
                                    rows={3}
                                />
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button 
                                        onClick={handleApprove}
                                        disabled={processing}
                                        className="w-full sm:w-auto rounded-xl bg-indigo-600 px-8 py-3 text-xs font-black text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                                    >
                                        Approve Request
                                    </button>
                                    <button 
                                        onClick={handleReject}
                                        disabled={processing}
                                        className="w-full sm:w-auto rounded-xl bg-white border border-red-200 px-8 py-3 text-xs font-black text-red-600 shadow-sm hover:bg-red-50 active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Timeline Sidebar */}
                    <div className="space-y-4 sm:space-y-6">
                        <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h3 className="mb-6 sm:mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 text-center">Status Alur Kerja</h3>
                            
                            <div className="relative space-y-8 sm:space-y-10">
                                {/* Initiator */}
                                <div className="flex gap-3 sm:gap-4">
                                    <div className="relative z-10 flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/20">
                                        <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </div>
                                    <div className="flex-1 border-b border-neutral-50 pb-4 sm:pb-6 dark:border-neutral-800">
                                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Diajukan Oleh</p>
                                        <p className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white leading-tight">{msr.requested_by?.nama}</p>
                                        <p className="text-[9px] font-bold text-neutral-500 mb-3">{new Date(msr.requested_at).toLocaleString('id-ID')}</p>
                                        {msr.requester_signature_snapshot && (
                                            <div className="h-12 w-24 sm:h-16 sm:w-32 rounded border border-dashed border-neutral-200 bg-neutral-50/30 p-1 dark:border-neutral-700">
                                                <img src={`/storage/${msr.requester_signature_snapshot}`} alt="signature" className="h-full w-full object-contain grayscale" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {levels.map((level, idx) => (
                                    <div key={level.key} className="relative flex gap-3 sm:gap-4">
                                        {idx !== levels.length - 1 && (
                                            <div className="absolute left-4 sm:left-5 top-8 sm:top-10 h-[calc(100%+20px)] w-0.5 bg-neutral-100 dark:bg-neutral-800 -translate-x-1/2" />
                                        )}
                                        <div className="relative z-10 flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-white dark:bg-neutral-800 border-2 border-neutral-50 dark:border-neutral-800 shadow-sm">
                                            {getStatusIcon(level.status)}
                                        </div>
                                        <div className={`flex-1 min-w-0 ${idx !== levels.length - 1 ? 'border-b border-neutral-50 pb-4 sm:pb-6 dark:border-neutral-800' : ''}`}>
                                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">{level.label}</p>
                                            
                                            {level.status === 'approved' ? (
                                                <div className="space-y-2">
                                                    <p className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white leading-tight truncate">{level.approver?.nama}</p>
                                                    {level.signature && (
                                                        <div className="h-12 w-24 sm:h-16 sm:w-32 rounded border border-dashed border-neutral-200 bg-neutral-50/30 p-1 dark:border-neutral-700">
                                                            <img src={`/storage/${level.signature}`} alt="signature" className="h-full w-full object-contain grayscale" />
                                                        </div>
                                                    )}
                                                    {level.notes && <div className="text-[10px] sm:text-[11px] font-medium text-neutral-500 italic bg-neutral-50 p-2 rounded-lg break-words">"{level.notes}"</div>}
                                                    <p className="text-[8px] sm:text-[9px] font-bold text-neutral-400 uppercase">{new Date(level.date!).toLocaleString('id-ID')}</p>
                                                </div>
                                            ) : level.status === 'rejected' ? (
                                                <div className="space-y-2">
                                                    <p className="text-xs sm:text-sm font-black text-red-600 leading-tight truncate">{level.approver?.nama}</p>
                                                    {level.notes && <div className="text-[10px] sm:text-[11px] font-medium text-red-500 italic bg-red-50 p-2 rounded-lg break-words">"{level.notes}"</div>}
                                                    <p className="text-[8px] sm:text-[9px] font-bold text-neutral-400 uppercase">{new Date(level.date!).toLocaleString('id-ID')}</p>
                                                </div>
                                            ) : (
                                                <p className="text-[10px] font-bold italic text-neutral-300 uppercase tracking-tighter">Dalam antrean...</p>
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
