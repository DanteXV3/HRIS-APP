import { Head, Link, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { ClipboardList, Plus, FileText, MapPin, Calendar, ExternalLink } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Pagination } from '@/types';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Daily Worker', href: '/daily-workers' },
    { title: 'Activity Reports', href: '/daily-worker-activities' },
];

interface Props {
    reports: Pagination<any>;
    workingLocations: { id: number; name: string }[];
}

export default function DailyWorkerActivityIndex() {
    const { reports, workingLocations } = usePage<any>().props as unknown as Props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [formData, setFormData] = useState({
        working_location_id: '',
        tanggal: new Date().toISOString().split('T')[0],
    });

    function openCreateModal() {
        setIsModalOpen(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsProcessing(true);
        router.post('/daily-worker-activities', formData, {
            onSuccess: () => {
                setIsModalOpen(false);
                setIsProcessing(false);
            },
            onError: () => setIsProcessing(false)
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity Reports" />
            <div className="flex flex-col gap-8 p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Activity Reports</h1>
                        <p className="text-muted-foreground">Monitor laporan aktifitas harian pekerja lapangan</p>
                    </div>
                    <Button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Buat Laporan Baru
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.data.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white dark:bg-neutral-900 rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-800">
                            <ClipboardList className="h-12 w-12 text-neutral-300 mb-4" />
                            <p className="text-neutral-500 font-medium">Belum ada laporan aktifitas.</p>
                        </div>
                    ) : (
                        reports.data.map((report) => (
                            <Link 
                                key={report.id} 
                                href={`/daily-worker-activities/${report.id}`}
                                className="group flex flex-col p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
                                        report.is_finalized ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                                    }`}>
                                        {report.is_finalized ? 'Finalized' : 'Draft'}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">{report.working_location?.name}</h3>
                                <div className="flex items-center text-sm text-neutral-500 mb-6">
                                    <Calendar className="mr-1.5 h-3.5 w-3.5" />
                                    {new Date(report.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                                <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Tap to view</span>
                                    <ExternalLink className="h-4 w-4 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Mulai Laporan Baru</DialogTitle>
                            <DialogDescription>Draft laporan akan dibuat otomatis berisi seluruh pekerja di lokasi tersebut.</DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Lokasi Kerja</Label>
                                <Select onValueChange={v => setFormData({...formData, working_location_id: v})}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Lokasi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {workingLocations.map(l => (
                                            <SelectItem key={l.id} value={l.id.toString()}>{l.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Tanggal Laporan</Label>
                                <Input type="date" required value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isProcessing} className="bg-emerald-600 hover:bg-emerald-700">
                                {isProcessing ? 'Creating...' : 'Buat Draft Laporan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
