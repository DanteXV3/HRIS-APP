import { Head, router, usePage, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { ChevronLeft, FileCheck, Download, Calculator, User, Receipt, Info } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
    payroll: any;
}

export default function DailyWorkerPayrollShow() {
    const { payroll } = usePage<any>().props as unknown as Props;
    const [isProcessing, setIsProcessing] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'DW Payroll', href: '/daily-worker-payrolls' },
        { title: `Detail ${payroll.working_location?.name ?? ''}`, href: '#' },
    ];

    function handleFinalize() {
        if (confirm('Finalize payroll? You cannot delete or edit after finalization.')) {
            router.post(`/daily-worker-payrolls/${payroll.id}/finalize`, {}, {
                onSuccess: () => router.reload()
            });
        }
    }

    const formatCurrency = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Payroll ${payroll.working_location?.name ?? ''}`} />
            <div className="flex flex-col gap-6 p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/daily-worker-payrolls" className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                            <ChevronLeft className="h-6 w-6" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Detail Payroll Daily Worker</h1>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                                    payroll.status === 'finalized'
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                }`}>
                                    {payroll.status?.toUpperCase()}
                                </span>
                            </div>
                            <p className="text-sm text-neutral-500">
                                {payroll.working_location?.name} • {new Date(payroll.periode_start).toLocaleDateString()} - {new Date(payroll.periode_end).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {payroll.status === 'draft' && (
                            <Button onClick={handleFinalize} className="bg-emerald-600 hover:bg-emerald-700">
                                <FileCheck className="mr-2 h-4 w-4" />
                                Finalize Payroll
                            </Button>
                        )}
                        <a href={`/daily-worker-payrolls/${payroll.id}/pdf`} target="_blank" rel="noreferrer">
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Export PDF
                            </Button>
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                            <User className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Total Workers</p>
                            <p className="text-2xl font-black text-neutral-900 dark:text-white">{payroll.items?.length ?? 0}</p>
                        </div>
                    </div>
                    <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl">
                            <Receipt className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Total Net Pay</p>
                            <p className="text-2xl font-black text-neutral-900 dark:text-white">
                                {formatCurrency((payroll.items ?? []).reduce((acc: number, item: any) => acc + parseFloat(item.gaji_bersih || 0), 0))}
                            </p>
                        </div>
                    </div>
                    <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Applied Rules</p>
                            <div className="flex gap-1">
                                {payroll.calc_bpjs_tk && <Badge variant="outline" className="text-[8px]">BPJS TK</Badge>}
                                {payroll.calc_bpjs_ks && <Badge variant="outline" className="text-[8px]">BPJS KS</Badge>}
                                {payroll.calc_pph21 && <Badge variant="outline" className="text-[8px]">PPh21</Badge>}
                            </div>
                        </div>
                        <p className="text-sm text-neutral-500 italic">Daily Tax Threshold based on PTKP/360 rules.</p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 font-bold uppercase tracking-wider text-neutral-500">
                                <th className="px-6 py-4">Worker</th>
                                <th className="px-6 py-4">Tipe</th>
                                <th className="px-6 py-4">Attendance</th>
                                <th className="px-6 py-4">Gaji Pokok Total</th>
                                <th className="px-6 py-4">Uang Makan</th>
                                <th className="px-6 py-4">Tunj. Pajak</th>
                                <th className="px-6 py-4 text-red-500">Potongan</th>
                                <th className="px-6 py-4 text-right">Gaji Bersih</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            {(payroll.items ?? []).map((item: any) => (
                                <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-neutral-900 dark:text-white">{item.worker_name}</span>
                                            <span className="text-[10px] text-neutral-400 font-mono">{item.worker_nik}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="capitalize">{item.tipe_dw}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold">{item.days_attended} / {item.days_period} Hari</span>
                                            {item.lembur_hours > 0 && <span className="text-[10px] text-blue-500">OT: {item.lembur_hours}h</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono font-medium">
                                        {formatCurrency(item.gaji_pokok_total)}
                                    </td>
                                    <td className="px-6 py-4 font-mono">
                                        {formatCurrency(item.uang_makan_total)}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-emerald-600">
                                        {formatCurrency(item.tunjangan_pajak)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col text-red-500 font-mono truncate max-w-[120px]">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="flex items-center gap-1 cursor-help">
                                                            {formatCurrency(item.total_potongan)}
                                                            <Info className="h-3 w-3" />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-white p-3 border shadow-xl text-neutral-900">
                                                        <div className="space-y-1 text-xs">
                                                            <div className="flex justify-between gap-4"><span>BPJS TK:</span> <span>{formatCurrency(item.potongan_bpjs_tk)}</span></div>
                                                            <div className="flex justify-between gap-4"><span>BPJS KS:</span> <span>{formatCurrency(item.potongan_bpjs_ks)}</span></div>
                                                            <div className="flex justify-between gap-4"><span>PPh21:</span> <span>{formatCurrency(item.potongan_pph21)}</span></div>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-bold text-neutral-900 dark:text-white font-mono text-sm">{formatCurrency(item.gaji_bersih)}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
