import React, { useState, useEffect, useCallback } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { 
    FileText, 
    Download, 
    Calendar, 
    ArrowLeft, 
    Eye, 
    Edit2, 
    CheckCircle, 
    FileSpreadsheet, 
    Printer, 
    ChevronDown, 
    UserCheck, 
    ShieldCheck, 
    Percent, 
    Receipt 
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

interface PayrollItem {
    id: number;
    employee_id: number;
    gaji_pokok: string;
    tunjangan_jabatan: string;
    tunjangan_kehadiran: string;
    tunjangan_transportasi: string;
    tunjangan_pajak: string;
    uang_makan: string;
    uang_lembur: string;
    thr: string;
    total_pendapatan: string;
    potongan_bpjs_tk: string;
    potongan_bpjs_jkn: string;
    potongan_pph21: string;
    pinjaman_koperasi: string;
    potongan_lain_1: string;
    potongan_lain_2: string;
    total_potongan: string;
    gaji_bersih: string;
    employee_name: string | null;
    employee_nik: string | null;
    position_name: string | null;
    department_name: string | null;
    bpjs_tk_base?: string;
    bpjs_jkn_base?: string;
    iuran_bpjs_tk_perusahaan?: string;
    iuran_bpjs_jkn_perusahaan?: string;
    taxable_gross?: string;
    employee: {
        id: number;
        nama: string;
        nik: string;
        status_pernikahan?: string;
        gross_up?: boolean;
        gaji_bpjs_tk?: string;
        gaji_bpjs_jkn?: string;
        position?: { name: string };
        department?: { name: string };
    };
}

interface Payroll {
    id: number;
    periode: string;
    tanggal_proses: string;
    status: string;
    notes: string | null;
    items: PayrollItem[];
    processed_by?: { name: string };
}

interface Props {
    payroll: Payroll;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="grid grid-cols-3 gap-4 border-b border-neutral-100 py-3 last:border-0 dark:border-neutral-800">
            <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{label}</dt>
            <dd className="col-span-2 text-sm text-neutral-900 dark:text-white font-semibold">{value || <span className="text-neutral-400 font-normal">-</span>}</dd>
        </div>
    );
}

function SectionCard({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon?: any }) {
    return (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
            <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-3 dark:border-neutral-700 dark:bg-neutral-800 flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4 text-neutral-500" />}
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{title}</h3>
            </div>
            <dl className="px-6 py-2">{children}</dl>
        </div>
    );
}

function formatCurrency(value: number | string): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (!num || num === 0) return '-';
    return `Rp ${num.toLocaleString('id-ID')}`;
}

// TER 2024 Rate Lookup — simplified brackets matching backend PayrollService
function getTerRate(gross: number, ptkp?: string): number {
    const status = (ptkp || 'TK/0').toUpperCase();
    const catA = ['TK/0', 'TK/1', 'K/0'];
    const catB = ['TK/2', 'TK/3', 'K/1', 'K/2'];
    const cat = catA.includes(status) ? 'A' : catB.includes(status) ? 'B' : 'C';

    const tables: Record<string, [number, number][]> = {
        A: [[5400000,0],[5650000,.0025],[5950000,.005],[6300000,.0075],[6750000,.01],[7500000,.0125],[8500000,.015],[9650000,.0175],[10050000,.02],[10350000,.0225],[10700000,.025],[11050000,.03],[11600000,.035],[12500000,.04],[13750000,.05],[15100000,.06],[16950000,.07],[19750000,.08],[24100000,.09],[26450000,.10],[28000000,.11],[30050000,.12],[32100000,.13],[35400000,.14],[39150000,.15],[43500000,.16],[47800000,.17],[51400000,.18],[56300000,.19],[62200000,.20],[68600000,.21],[77500000,.22],[89000000,.23],[103000000,.24],[125000000,.25],[157000000,.26],[206000000,.27],[337000000,.28],[454000000,.29],[550000000,.30],[895000000,.31],[1400000000,.32],[2000000000,.33]],
        B: [[6200000,0],[6500000,.0025],[6850000,.005],[7300000,.0075],[9200000,.01],[10750000,.015],[11250000,.02],[11600000,.025],[12600000,.03],[13600000,.04],[14950000,.05],[16400000,.06],[18450000,.07],[21850000,.08],[26000000,.09],[27700000,.10],[29350000,.11],[31450000,.12],[33950000,.13],[37100000,.14],[41100000,.15],[45800000,.16],[49500000,.17],[53800000,.18],[58500000,.19],[64000000,.20],[71000000,.21],[80000000,.22],[93000000,.23],[109000000,.24],[132000000,.25],[168000000,.26],[226000000,.27],[357000000,.28],[486000000,.29],[582000000,.30],[950000000,.31],[1500000000,.32],[2100000000,.33]],
        C: [[6600000,0],[6950000,.0025],[7350000,.005],[7800000,.0075],[8850000,.01],[9800000,.0125],[10950000,.015],[11200000,.0175],[12050000,.02],[12950000,.03],[14100000,.04],[15550000,.05],[17050000,.06],[19500000,.07],[22700000,.08],[26600000,.09],[28100000,.10],[30100000,.11],[32600000,.12],[35400000,.13],[38900000,.14],[43000000,.15],[47400000,.16],[51200000,.17],[55800000,.18],[60400000,.19],[66700000,.20],[74500000,.21],[83200000,.22],[95600000,.23],[113000000,.24],[137000000,.25],[177000000,.26],[240000000,.27],[381000000,.28],[520000000,.29],[623000000,.30],[1000000000,.31],[1600000000,.32],[2300000000,.33]],
    };

    const brackets = tables[cat];
    for (const [limit, rate] of brackets) {
        if (gross <= limit) return rate;
    }
    return 0.34; // max bracket
}

function calculatePph21(item: PayrollItem, earningsData: Record<string, string | number>): { pph21: number; tunjanganPajak: number; terRate: number } {
    const totalRegularEarnings =
        Number(earningsData.gaji_pokok || 0) +
        Number(earningsData.tunjangan_jabatan || 0) +
        Number(earningsData.tunjangan_kehadiran || 0) +
        Number(earningsData.tunjangan_transportasi || 0) +
        Number(earningsData.uang_makan || 0) +
        Number(earningsData.uang_lembur || 0) +
        Number(earningsData.thr || 0);

    // Employer BPJS contributions (based on BPJS base salary, NOT current earnings)
    const bpjsTkBase = Number(item.bpjs_tk_base || item.employee.gaji_bpjs_tk || 0);
    const bpjsJknBase = Number(item.bpjs_jkn_base || item.employee.gaji_bpjs_jkn || 0);
    const iuranJkk = Math.round(bpjsTkBase * 0.0024);
    const iuranJkm = Math.round(bpjsTkBase * 0.003);
    const iuranJknPerusahaan = Math.round(bpjsJknBase * 0.04);

    const taxableGross = totalRegularEarnings + iuranJkk + iuranJkm + iuranJknPerusahaan;
    const terRate = getTerRate(taxableGross, item.employee.status_pernikahan);
    const isGrossUp = item.employee.gross_up === true;

    let pph21: number;
    let tunjanganPajak = 0;

    if (isGrossUp) {
        tunjanganPajak = Math.round((taxableGross * terRate) / (1 - terRate));
        pph21 = Math.round((taxableGross + tunjanganPajak) * terRate);
    } else {
        pph21 = Math.round(taxableGross * terRate);
    }

    return { pph21, tunjanganPajak, terRate };
}

function EditItemDialog({ payrollId, item, onClose }: { payrollId: number, item: PayrollItem | null, onClose: () => void }) {
    if (!item) return null;

    const { data, setData, put, processing, errors } = useForm({
        gaji_pokok: item.gaji_pokok,
        tunjangan_jabatan: item.tunjangan_jabatan,
        tunjangan_kehadiran: item.tunjangan_kehadiran,
        tunjangan_transportasi: item.tunjangan_transportasi,
        uang_makan: item.uang_makan,
        uang_lembur: item.uang_lembur,
        thr: item.thr,
        tunjangan_pajak: item.tunjangan_pajak,
        potongan_bpjs_tk: item.potongan_bpjs_tk,
        potongan_bpjs_jkn: item.potongan_bpjs_jkn,
        potongan_pph21: item.potongan_pph21,
        pinjaman_koperasi: item.pinjaman_koperasi,
        potongan_lain_1: item.potongan_lain_1,
        potongan_lain_2: item.potongan_lain_2,
    });

    const [pph21Manual, setPph21Manual] = useState(false);

    // Auto-calculate PPh21 when income fields change (unless manual override)
    const incomeFingerprint = `${data.gaji_pokok}-${data.tunjangan_jabatan}-${data.tunjangan_kehadiran}-${data.tunjangan_transportasi}-${data.uang_makan}-${data.uang_lembur}-${data.thr}`;

    useEffect(() => {
        if (pph21Manual) return;
        const calc = calculatePph21(item, data);
        setData(prev => ({
            ...prev,
            potongan_pph21: String(calc.pph21),
            tunjangan_pajak: item.employee.gross_up ? String(calc.tunjanganPajak) : prev.tunjangan_pajak,
        }));
    }, [incomeFingerprint, pph21Manual]);

    const currentCalc = calculatePph21(item, data);

    const totalEarnings = 
        Number(data.gaji_pokok) + 
        Number(data.tunjangan_jabatan) + 
        Number(data.tunjangan_kehadiran) + 
        Number(data.tunjangan_transportasi) + 
        Number(data.uang_makan) + 
        Number(data.uang_lembur) + 
        Number(data.thr) + 
        Number(data.tunjangan_pajak);

    const totalDeductions = 
        Number(data.potongan_bpjs_tk) + 
        Number(data.potongan_bpjs_jkn) + 
        Number(data.potongan_pph21) + 
        Number(data.pinjaman_koperasi) + 
        Number(data.potongan_lain_1) + 
        Number(data.potongan_lain_2);

    const netPay = totalEarnings - totalDeductions;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/payrolls/${payrollId}/items/${item.id}`, {
            onSuccess: () => onClose(),
        });
    };

    const renderInput = (label: string, field: keyof typeof data, opts?: { disabled?: boolean; highlight?: boolean }) => (
        <div key={field} className={`flex items-center justify-between gap-3 py-2.5 border-b border-neutral-100 dark:border-neutral-800 last:border-0 ${opts?.highlight ? 'bg-amber-50/50 dark:bg-amber-900/10 -mx-4 px-4 rounded-lg' : ''}`}>
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 whitespace-nowrap shrink-0">
                {label}
            </label>
            <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-xs font-semibold text-neutral-400 shrink-0">Rp</span>
                <input 
                    type="number" 
                    step="0.01" 
                    value={data[field]} 
                    onChange={e => setData(field, e.target.value)} 
                    disabled={opts?.disabled}
                    className={`w-full max-w-[140px] text-right bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 text-sm font-bold focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-neutral-900 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${opts?.disabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
                    placeholder="0"
                />
            </div>
            {errors[field] && <p className="text-[9px] text-red-500">{errors[field]}</p>}
        </div>
    );

    return (
        <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl w-[95vw] sm:w-full bg-white dark:bg-neutral-900 max-h-[90vh] overflow-hidden flex flex-col p-0 border-0 shadow-2xl rounded-2xl">
                {/* Header */}
                <div className="px-5 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white shrink-0">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                            <Edit2 className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="min-w-0">
                            <DialogTitle className="text-base sm:text-lg font-bold truncate">Edit Rincian Gaji</DialogTitle>
                            <DialogDescription className="text-neutral-400 text-xs sm:text-sm truncate">
                                {item.employee_name || item.employee.nama} ({item.employee_nik || item.employee.nik})
                            </DialogDescription>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-blue-300 tracking-widest">Take Home Pay</span>
                        <span className="text-xl sm:text-2xl font-black text-white tabular-nums">
                            {formatCurrency(netPay)}
                        </span>
                    </div>
                </div>

                {/* Scrollable form body */}
                <form onSubmit={submit} className="flex-1 overflow-y-auto">
                    <div className="px-5 sm:px-6 py-4 space-y-5">
                        {/* Pendapatan */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center">
                                    <Receipt className="w-3.5 h-3.5 text-emerald-500" />
                                </div>
                                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Pendapatan</h4>
                            </div>
                            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 px-4">
                                {renderInput("Gaji Pokok", "gaji_pokok")}
                                {renderInput("Tunj. Jabatan", "tunjangan_jabatan")}
                                {renderInput("Tunj. Kehadiran", "tunjangan_kehadiran")}
                                {renderInput("Tunj. Transport", "tunjangan_transportasi")}
                                {renderInput("Uang Makan", "uang_makan")}
                                {renderInput("Uang Lembur", "uang_lembur")}
                                {renderInput("THR", "thr")}
                                {renderInput("Tunj. Pajak", "tunjangan_pajak", { disabled: !pph21Manual && item.employee.gross_up === true, highlight: item.employee.gross_up === true })}
                            </div>
                            {item.employee.gross_up && !pph21Manual && (
                                <p className="mt-1 px-2 text-[10px] text-amber-600 dark:text-amber-400 italic">
                                    Tunj. Pajak otomatis dihitung karena karyawan ini menggunakan Gross Up
                                </p>
                            )}
                            <div className="mt-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex justify-between items-center">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/80">Total Pendapatan</span>
                                <span className="text-sm font-black text-emerald-600 tabular-nums">{formatCurrency(totalEarnings)}</span>
                            </div>
                        </div>

                        {/* Potongan */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-md bg-red-500/10 flex items-center justify-center">
                                    <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                                </div>
                                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Potongan</h4>
                            </div>
                            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 px-4">
                                {renderInput("BPJS Kesehatan", "potongan_bpjs_jkn")}
                                {renderInput("BPJS TK", "potongan_bpjs_tk")}
                                {/* PPh21 with auto/manual toggle */}
                                <div className="flex items-center justify-between gap-2 py-2.5 border-b border-neutral-100 dark:border-neutral-800">
                                    <div className="flex items-center gap-2 shrink-0">
                                        <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                                            PPh21
                                        </label>
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 tabular-nums">
                                            TER {(currentCalc.terRate * 100).toFixed(1)}%
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (pph21Manual) {
                                                    // Switching back to auto — recalculate
                                                    const calc = calculatePph21(item, data);
                                                    setData(prev => ({
                                                        ...prev,
                                                        potongan_pph21: String(calc.pph21),
                                                        tunjangan_pajak: item.employee.gross_up ? String(calc.tunjanganPajak) : prev.tunjangan_pajak,
                                                    }));
                                                }
                                                setPph21Manual(!pph21Manual);
                                            }}
                                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition-colors ${pph21Manual
                                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                            }`}
                                        >
                                            {pph21Manual ? '✎ Manual' : '⚡ Auto'}
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <span className="text-xs font-semibold text-neutral-400 shrink-0">Rp</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.potongan_pph21}
                                            onChange={e => {
                                                if (!pph21Manual) setPph21Manual(true);
                                                setData('potongan_pph21', e.target.value);
                                            }}
                                            className={`w-full max-w-[140px] text-right border rounded-lg px-3 py-1.5 text-sm font-bold focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-neutral-900 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${pph21Manual
                                                ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700'
                                                : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700'
                                            }`}
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                {renderInput("Pinjaman Kop.", "pinjaman_koperasi")}
                                {renderInput("Potongan Lain 1", "potongan_lain_1")}
                                {renderInput("Potongan Lain 2", "potongan_lain_2")}
                            </div>
                            <div className="mt-2 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 flex justify-between items-center">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-red-600/80">Total Potongan</span>
                                <span className="text-sm font-black text-red-600 tabular-nums">-{formatCurrency(totalDeductions)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 px-5 sm:px-6 py-4 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 shrink-0">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3 justify-center">
                                <div className="text-center">
                                    <div className="text-[9px] font-bold text-emerald-600 uppercase">Pendapatan</div>
                                    <div className="text-xs font-black tabular-nums">{formatCurrency(totalEarnings)}</div>
                                </div>
                                <span className="text-neutral-300 text-lg">−</span>
                                <div className="text-center">
                                    <div className="text-[9px] font-bold text-red-600 uppercase">Potongan</div>
                                    <div className="text-xs font-black tabular-nums">{formatCurrency(totalDeductions)}</div>
                                </div>
                                <span className="text-neutral-300 text-lg">=</span>
                                <div className="text-center">
                                    <div className="text-[9px] font-bold text-blue-600 uppercase">THP</div>
                                    <div className="text-base font-black text-blue-600 tabular-nums">{formatCurrency(netPay)}</div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button type="button" onClick={onClose} className="flex-1 sm:flex-none rounded-xl px-5 py-2.5 text-sm font-bold text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all border border-neutral-200 dark:border-neutral-700">
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    disabled={processing} 
                                    className="flex-1 sm:flex-none rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-50"
                                >
                                    {processing ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function PayrollShow({ payroll }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Payroll', href: '/payrolls' },
        { title: `Detail ${payroll.periode}`, href: '#' },
    ];

    const formatPeriode = (periode: string) => {
        const [year, month] = periode.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    };

    const [selectedItem, setSelectedItem] = useState<PayrollItem | null>(null);
    const [editingItem, setEditingItem] = useState<PayrollItem | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Payroll ${formatPeriode(payroll.periode)}`} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Link href="/payrolls" className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Detail Payroll: {formatPeriode(payroll.periode)}</h1>
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                payroll.status === 'finalized' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                            }`}>
                                {payroll.status.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Diproses {new Date(payroll.tanggal_proses).toLocaleDateString('id-ID')} oleh {payroll.processed_by?.name || 'Sistem'}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <a href={`/payrolls/${payroll.id}/export-excel`} target="_blank"
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                            <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Export Excel
                        </a>
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                                    <Printer className="h-4 w-4 text-red-500" /> Cetak PDF <ChevronDown className="h-4 w-4 opacity-50" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Jenis Laporan</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <a href={`/payrolls/${payroll.id}/export-pdf-report`} target="_blank" className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-blue-500" /> Summary THP
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <a href={`/payrolls/${payroll.id}/export-uang-makan-lembur`} target="_blank" className="flex items-center gap-2">
                                        <Receipt className="h-4 w-4 text-orange-500" /> Summary Makan & Lembur
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <a href={`/payrolls/${payroll.id}/export-bpjs`} target="_blank" className="flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-green-500" /> Summary BPJS
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <a href={`/payrolls/${payroll.id}/export-pph21`} target="_blank" className="flex items-center gap-2">
                                        <Percent className="h-4 w-4 text-purple-500" /> Summary PPh21
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <a href={`/payrolls/${payroll.id}/export-attendance`} target="_blank" className="flex items-center gap-2">
                                        <UserCheck className="h-4 w-4 text-cyan-500" /> Report Absensi
                                    </a>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {payroll.status !== 'finalized' && (
                            <button onClick={() => {
                                if (confirm('Yakin ingin memfinalisasi payroll ini?')) router.post(`/payrolls/${payroll.id}/finalize`);
                            }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700">
                                <CheckCircle className="h-4 w-4" /> Finalisasi Payroll
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
                    <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700 text-sm">
                        <thead className="bg-neutral-50 dark:bg-neutral-800 font-semibold uppercase text-neutral-500 text-xs">
                            <tr>
                                <th className="px-6 py-4 text-left">Karyawan</th>
                                <th className="px-6 py-4 text-right">Gaji Pokok</th>
                                <th className="px-6 py-4 text-right">Tunjangan</th>
                                <th className="px-6 py-4 text-right">Tunj. Pajak</th>
                                <th className="px-6 py-4 text-right">Total Pendapatan</th>
                                <th className="px-6 py-4 text-right">Potongan</th>
                                <th className="px-6 py-4 text-right text-blue-600">THP (Gaji Bersih)</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-700 dark:bg-neutral-900">
                            {payroll.items.length === 0 ? (
                                <tr><td colSpan={8} className="px-6 py-12 text-center text-neutral-500 italic">Belum ada data item.</td></tr>
                            ) : (
                                payroll.items.map((item) => {
                                    const tunjanganLain = Number(item.tunjangan_jabatan) + Number(item.tunjangan_kehadiran) + Number(item.tunjangan_transportasi) + Number(item.uang_makan) + Number(item.uang_lembur) + Number(item.thr);
                                    return (
                                        <tr key={item.id} className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-neutral-900 dark:text-white">{item.employee_name || item.employee.nama}</div>
                                                <div className="text-xs text-neutral-500 font-mono tracking-tighter">
                                                    {item.employee_nik || item.employee.nik} • {item.position_name || item.employee.position?.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right tabular-nums">{formatCurrency(item.gaji_pokok)}</td>
                                            <td className="px-6 py-4 text-right tabular-nums">{formatCurrency(tunjanganLain)}</td>
                                            <td className="px-6 py-4 text-right tabular-nums text-emerald-600">{formatCurrency(item.tunjangan_pajak)}</td>
                                            <td className="px-6 py-4 text-right tabular-nums font-medium">{formatCurrency(item.total_pendapatan)}</td>
                                            <td className="px-6 py-4 text-right tabular-nums text-red-500">-{formatCurrency(item.total_potongan)}</td>
                                            <td className="px-6 py-4 text-right tabular-nums font-bold text-blue-600 dark:text-blue-400">{formatCurrency(item.gaji_bersih)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => setSelectedItem(item)} className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg" title="Lihat Detail">
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    {payroll.status !== 'finalized' && (
                                                        <button onClick={() => setEditingItem(item)} className="p-1.5 text-neutral-400 hover:text-amber-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg" title="Edit Manual">
                                                            <Edit2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    <a href={`/payrolls/${payroll.id}/items/${item.id}/pdf`} target="_blank" className="p-1.5 text-neutral-400 hover:text-emerald-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg" title="Download PDF">
                                                        <Download className="h-4 w-4" />
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payslip Detail Modal */}
            <Dialog open={selectedItem !== null} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <DialogContent className="max-w-4xl bg-white dark:bg-neutral-900 border-0 p-0 overflow-hidden shadow-2xl">
                    <DialogHeader className="px-8 py-6 bg-neutral-900 text-white">
                        <DialogTitle className="text-xl font-bold">Rincian Slip Gaji</DialogTitle>
                        <DialogDescription className="text-neutral-400">Periode: {formatPeriode(payroll.periode)}</DialogDescription>
                    </DialogHeader>

                    {selectedItem && (
                        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <SectionCard title="👤 Informasi Karyawan" icon={UserCheck}>
                                <InfoRow label="Nama" value={selectedItem.employee_name || selectedItem.employee.nama} />
                                <InfoRow label="NIK" value={selectedItem.employee_nik || selectedItem.employee.nik} />
                                <InfoRow label="Jabatan/Dept" value={`${selectedItem.position_name || selectedItem.employee.position?.name || '-'} - ${selectedItem.department_name || selectedItem.employee.department?.name || '-'}`} />
                            </SectionCard>

                            <div className="grid gap-6 md:grid-cols-2">
                                <SectionCard title="💰 Pendapatan" icon={Receipt}>
                                    <InfoRow label="Gaji Pokok" value={formatCurrency(selectedItem.gaji_pokok)} />
                                    {Number(selectedItem.tunjangan_jabatan) > 0 && <InfoRow label="Tunj. Jabatan" value={formatCurrency(selectedItem.tunjangan_jabatan)} />}
                                    {Number(selectedItem.tunjangan_kehadiran) > 0 && <InfoRow label="Tunj. Kehadiran" value={formatCurrency(selectedItem.tunjangan_kehadiran)} />}
                                    {Number(selectedItem.tunjangan_transportasi) > 0 && <InfoRow label="Tunj. Transport" value={formatCurrency(selectedItem.tunjangan_transportasi)} />}
                                    {Number(selectedItem.uang_makan) > 0 && <InfoRow label="Uang Makan" value={formatCurrency(selectedItem.uang_makan)} />}
                                    {Number(selectedItem.uang_lembur) > 0 && <InfoRow label="Uang Lembur" value={formatCurrency(selectedItem.uang_lembur)} />}
                                    {Number(selectedItem.thr) > 0 && <InfoRow label="THR" value={formatCurrency(selectedItem.thr)} />}
                                    {Number(selectedItem.tunjangan_pajak) > 0 && <InfoRow label="Tunj. Pajak" value={<span className="text-emerald-600">{formatCurrency(selectedItem.tunjangan_pajak)}</span>} />}
                                    <div className="mt-2 pt-2 border-t font-bold flex justify-between px-3 text-neutral-900 dark:text-white">
                                        <span>TOTAL PENDAPATAN</span>
                                        <span>{formatCurrency(selectedItem.total_pendapatan)}</span>
                                    </div>
                                </SectionCard>

                                <SectionCard title="📉 Potongan & Pajak" icon={ShieldCheck}>
                                    <InfoRow label="BPJS Kesehatan" value={formatCurrency(selectedItem.potongan_bpjs_jkn)} />
                                    <InfoRow label="BPJS TK" value={formatCurrency(selectedItem.potongan_bpjs_tk)} />
                                    <InfoRow label="PPh21 (Pajak)" value={formatCurrency(selectedItem.potongan_pph21)} />
                                    {Number(selectedItem.pinjaman_koperasi) > 0 && <InfoRow label="Pinjaman Koperasi" value={formatCurrency(selectedItem.pinjaman_koperasi)} />}
                                    {Number(selectedItem.potongan_lain_1) > 0 && <InfoRow label="Potongan Lain 1" value={formatCurrency(selectedItem.potongan_lain_1)} />}
                                    {Number(selectedItem.potongan_lain_2) > 0 && <InfoRow label="Potongan Lain 2" value={formatCurrency(selectedItem.potongan_lain_2)} />}
                                    <div className="mt-2 pt-2 border-t font-bold flex justify-between px-3 text-red-600">
                                        <span>TOTAL POTONGAN</span>
                                        <span>-{formatCurrency(selectedItem.total_potongan)}</span>
                                    </div>
                                </SectionCard>
                            </div>

                            <div className="rounded-xl bg-blue-600 p-6 flex items-center justify-between text-white shadow-lg shadow-blue-500/20">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-blue-100 opacity-80">Take Home Pay</p>
                                    <p className="text-3xl font-black">{formatCurrency(selectedItem.gaji_bersih)}</p>
                                </div>
                                <div className="rounded-full bg-white/20 p-3">
                                    <Receipt className="h-8 w-8" />
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <EditItemDialog 
                payrollId={payroll.id}
                item={editingItem} 
                onClose={() => setEditingItem(null)} 
            />
        </AppLayout>
    );
}
