import { Head, router, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { ChevronLeft, CheckCircle2, AlertCircle, Clock, Tag, MessageSquare, FileDown } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Props {
    report: any;
    budgetItems: { id: number; item_code: string; nama_budget: string }[];
}

export default function ActivityReportShow({ report, budgetItems }: Props) {
    const [isProcessing, setIsProcessing] = useState(false);

    if (!report) return null;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Activity Reports', href: '/daily-worker-activities' },
        { title: `${report.working_location?.name || 'Location'} - ${report.tanggal || ''}`, href: '#' },
    ];

    function handleUpdateItem(itemId: number, data: any) {
        setIsProcessing(true);
        router.post(`/daily-worker-activities/items/${itemId}`, data, {
            onSuccess: () => setIsProcessing(false),
            onError: () => setIsProcessing(false),
            preserveScroll: true
        });
    }

    function handleFinalize() {
        if (confirm('Finalize this report? You will not be able to edit it anymore.')) {
            router.post(`/daily-worker-activities/${report.id}/finalize`, {}, {
                onSuccess: () => router.reload()
            });
        }
    }

    const attendanceStatusColors: any = {
        hadir: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
        alpha: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
        izin: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        sakit: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Report ${report.tanggal || ''}`} />
            <div className="flex flex-col gap-6 p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/daily-worker-activities" className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                            <ChevronLeft className="h-6 w-6" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Laporan Aktifitas Harian</h1>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${report.is_finalized ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>
                                    {report.is_finalized ? 'FINALIZED' : 'DRAFT'}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {report.working_location?.name || 'Unknown Location'} • {report.tanggal ? new Date(report.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => window.open(`/daily-worker-activities/${report.id}/pdf`, '_blank')}
                            className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                        >
                            <FileDown className="mr-2 h-4 w-4" />
                            Download PDF
                        </Button>
                        {!report.is_finalized && (
                            <Button onClick={handleFinalize} className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20" disabled={isProcessing}>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Finalize Report
                            </Button>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Worker & Attendance</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Cost Code</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Activity Detail</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            {(!report.items || report.items.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center text-neutral-500 italic">
                                        No workers found for this location and date. 
                                        Ensure workers are active and assigned to this location.
                                    </td>
                                </tr>
                            )}
                            {(report.items || []).map((item: any) => (
                                <tr key={item.id} className="align-top group">
                                    <td className="px-6 py-6 w-72">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-neutral-900 dark:text-white underline decoration-blue-500/30 underline-offset-4">{item.daily_worker?.nama || 'Unknown'}</span>
                                                <span className="text-[10px] text-neutral-400 font-mono italic">{item.daily_worker?.nik}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${attendanceStatusColors[item.attendance_status] || 'bg-neutral-100'}`}>
                                                    {item.attendance_status || 'Waiting'}
                                                </span>
                                                {(item.jam_masuk || item.jam_pulang) && (
                                                    <span className="flex items-center gap-1 text-[10px] font-mono text-neutral-500">
                                                        <Clock className="h-3 w-3" />
                                                        {item.jam_masuk || '--:--'} - {item.jam_pulang || '--:--'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 w-64">
                                        <Select 
                                            disabled={report.is_finalized}
                                            defaultValue={item.budget_item_id?.toString()}
                                            onValueChange={(v) => handleUpdateItem(item.id, { ...item, budget_item_id: v })}
                                        >
                                            <SelectTrigger className="bg-neutral-50 dark:bg-neutral-800 border-none">
                                                <div className="flex items-center gap-2 truncate">
                                                    <Tag className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                                                    <SelectValue placeholder="Select Code" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(budgetItems || []).map(bi => (
                                                    <SelectItem key={bi.id} value={bi.id.toString()}>
                                                        <span className="font-mono text-xs font-bold mr-2">{bi.item_code}</span>
                                                        <span className="text-xs text-neutral-500">{bi.nama_budget}</span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="relative">
                                            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-neutral-300" />
                                            <textarea 
                                                disabled={report.is_finalized}
                                                className="w-full min-h-[80px] rounded-xl border-dashed border-2 border-neutral-100 dark:border-neutral-800 bg-transparent pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
                                                placeholder="Deskripsi pekerjaan hari ini..."
                                                defaultValue={item.aktifitas || ''}
                                                onBlur={(e) => {
                                                    if (e.target.value !== (item.aktifitas || '')) {
                                                        handleUpdateItem(item.id, { ...item, aktifitas: e.target.value });
                                                    }
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 w-40">
                                        <Select 
                                            disabled={report.is_finalized}
                                            defaultValue={item.status_aktifitas}
                                            onValueChange={(v) => handleUpdateItem(item.id, { ...item, status_aktifitas: v })}
                                        >
                                            <SelectTrigger className={`border-none ${
                                                item.status_aktifitas === 'done' ? 'text-emerald-600' : 
                                                item.status_aktifitas === 'continue' ? 'text-blue-600' : 'text-amber-600'
                                            }`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="continue">Continue</SelectItem>
                                                <SelectItem value="done">Done</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <div className="mt-4 flex items-center justify-between gap-2 px-2">
                                            <span className="text-[10px] uppercase font-bold text-neutral-400">Overtime (H)</span>
                                            <input 
                                                type="number"
                                                min="0"
                                                step="0.5"
                                                disabled={report.is_finalized}
                                                className="w-16 h-8 text-xs font-mono rounded-md border-neutral-200 dark:border-neutral-800 bg-transparent px-2 focus:ring-1 focus:ring-blue-500"
                                                defaultValue={item.verified_lembur_hours || 0}
                                                onBlur={(e) => {
                                                    const val = parseFloat(e.target.value) || 0;
                                                    if (val !== (item.verified_lembur_hours || 0)) {
                                                        handleUpdateItem(item.id, { ...item, verified_lembur_hours: val });
                                                    }
                                                }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!report.is_finalized && (
                    <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-300">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p className="text-sm italic">Perubahan disimpan otomatis saat Anda mengganti field atau selesai mengetik (blur).</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
