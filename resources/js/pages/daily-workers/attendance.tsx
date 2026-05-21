import { Head, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Filter, Clock, MapPin, UserCheck, Camera, FileText, FileDown } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Pagination } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Daily Worker', href: '/daily-workers' },
    { title: 'Absensi', href: '/daily-worker-attendance' },
];

interface Props {
    attendances: Pagination<any>;
    workingLocations: { id: number; name: string }[];
    dailyWorkers: { id: number; nik: string; nama: string }[];
    filters: { date?: string; working_location_id?: string };
}

export default function DailyWorkerAttendanceIndex() {
    const { attendances, workingLocations, dailyWorkers, filters } = usePage<any>().props as unknown as Props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [formData, setFormData] = useState({
        daily_worker_id: '',
        tanggal: filters.date || new Date().toISOString().split('T')[0],
        clock_in: '',
        clock_out: '',
        status: 'hadir',
        notes: ''
    });

    const statusColors: Record<string, string> = {
        hadir: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
        izin: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
        sakit: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
        cuti: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
        alpha: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
        libur: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400',
    };

    function handleFilterChange(key: string, value: string) {
        const newFilters = { ...filters, [key]: value };
        router.get('/daily-worker-attendance', newFilters, { preserveState: true });
    }

    function openManualEntry() {
        setFormData({
            daily_worker_id: '',
            tanggal: filters.date || new Date().toISOString().split('T')[0],
            clock_in: '',
            clock_out: '',
            status: 'hadir',
            notes: ''
        });
        setIsModalOpen(true);
    }

    function handleImportCsv(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setIsProcessing(true);
        router.post('/daily-worker-attendance/import', formData, {
            onSuccess: () => setIsProcessing(false),
            onError: () => setIsProcessing(false),
            preserveState: false
        });
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsProcessing(true);
        router.post('/daily-worker-attendance', formData, {
            onSuccess: () => {
                setIsModalOpen(false);
                setIsProcessing(false);
            },
            onError: () => setIsProcessing(false)
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="DW Absensi" />
            <div className="flex flex-col gap-8 p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Absensi Pekerja Harian</h1>
                        <p className="text-muted-foreground">Monitor dan kelola kehadiran pekerja harian lepas</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                        <div className="relative">
                            <input 
                                type="file" 
                                id="csv-import" 
                                className="hidden" 
                                accept=".csv" 
                                onChange={handleImportCsv}
                                disabled={isProcessing}
                            />
                            <Button 
                                variant="outline" 
                                className="w-full md:w-auto border-dashed border-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
                                onClick={() => document.getElementById('csv-import')?.click()}
                                disabled={isProcessing}
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                {isProcessing ? 'Importing...' : 'Import CSV'}
                            </Button>
                        </div>
                        <Button onClick={openManualEntry} variant="outline" className="w-full md:w-auto bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30">
                            <UserCheck className="mr-2 h-4 w-4" />
                            Input Absensi Manual
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-neutral-400" />
                        <Input 
                            type="date" 
                            className="w-40 border-none bg-transparent focus-visible:ring-0" 
                            defaultValue={filters.date || new Date().toISOString().split('T')[0]}
                            onChange={(e) => handleFilterChange('date', e.target.value)}
                        />
                    </div>
                    <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 mx-2 hidden md:block" />
                    <div className="flex items-center gap-2 flex-1 md:flex-none">
                        <MapPin className="h-4 w-4 text-neutral-400" />
                        <Select 
                            defaultValue={filters.working_location_id || "all"} 
                            onValueChange={(v) => handleFilterChange('working_location_id', v === 'all' ? '' : v)}
                        >
                            <SelectTrigger className="w-full md:w-64 border-none bg-transparent focus:ring-0">
                                <SelectValue placeholder="Semua Lokasi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Lokasi</SelectItem>
                                {workingLocations.map(l => (
                                    <SelectItem key={l.id} value={l.id.toString()}>{l.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 mx-2 hidden md:block" />
                    <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-neutral-500 hover:text-blue-600"
                        onClick={() => {
                            const date = filters.date || new Date().toISOString().split('T')[0];
                            const loc = filters.working_location_id || '';
                            window.open(`/daily-worker-attendance/pdf?date=${date}&working_location_id=${loc}`, '_blank');
                        }}
                    >
                        <FileDown className="mr-2 h-4 w-4" />
                        Export PDF
                    </Button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 font-bold uppercase tracking-wider text-neutral-500">
                                <th className="px-6 py-4">Worker</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Clock In</th>
                                <th className="px-6 py-4">Clock Out</th>
                                <th className="px-6 py-4 text-right">Metrics</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            {attendances.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center text-neutral-500 italic">Belum ada absensi tercatat untuk kriteria ini.</td>
                                </tr>
                            ) : (
                                attendances.data.map((att) => (
                                    <tr key={att.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-neutral-900 dark:text-white">{att.daily_worker?.nama}</span>
                                                <span className="text-[10px] text-neutral-400 font-mono italic">{att.daily_worker?.working_location?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${statusColors[att.status] || ''}`}>
                                                {att.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {att.clock_in ? (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-3 w-3 text-emerald-500" />
                                                    <span className="font-mono text-neutral-700 dark:text-neutral-300">{new Date(att.clock_in).toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit' })}</span>
                                                    {att.clock_in_photo && <Camera className="h-3 w-3 text-neutral-400" />}
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {att.clock_out ? (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-3 w-3 text-red-400" />
                                                    <span className="font-mono text-neutral-700 dark:text-neutral-300">{new Date(att.clock_out).toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {att.clock_in && att.clock_out && (
                                                <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold">
                                                    {(() => {
                                                        const diff = new Date(att.clock_out).getTime() - new Date(att.clock_in).getTime();
                                                        const hours = Math.floor(diff / 3600000);
                                                        const mins = Math.round((diff % 3600000) / 60000);
                                                        return `${hours}h ${mins}m`;
                                                    })()}
                                                </span>
                                            )}
                                            {att.verified_lembur_minutes > 0 && <span className="ml-2 text-[10px] text-blue-500 font-bold uppercase tracking-tighter">OT {Math.round(att.verified_lembur_minutes/60)}h</span>}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Input Absensi Manual</DialogTitle>
                            <DialogDescription>Input data kehadiran pekerja harian secara manual.</DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Pekerja</Label>
                                <Select onValueChange={v => setFormData({...formData, daily_worker_id: v})}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Pekerja" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dailyWorkers.map(worker => (
                                            <SelectItem key={worker.id} value={worker.id.toString()}>
                                                <div className="flex flex-col text-left">
                                                    <span className="font-bold">{worker.nama}</span>
                                                    <span className="text-[10px] text-neutral-400 font-mono italic">{worker.nik}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                        {dailyWorkers.length === 0 && <p className="p-2 text-xs text-neutral-400 italic text-center">No active workers found</p>}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Jam Masuk</Label>
                                    <Input type="time" onChange={e => setFormData({...formData, clock_in: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Jam Pulang</Label>
                                    <Input type="time" onChange={e => setFormData({...formData, clock_out: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Status Kehadiran</Label>
                                <Select defaultValue="hadir" onValueChange={v => setFormData({...formData, status: v})}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hadir">Hadir</SelectItem>
                                        <SelectItem value="izin">Izin</SelectItem>
                                        <SelectItem value="sakit">Sakit</SelectItem>
                                        <SelectItem value="cuti">Cuti</SelectItem>
                                        <SelectItem value="alpha">Alpha</SelectItem>
                                        <SelectItem value="libur">Libur</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isProcessing}>Simpan Absensi</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
