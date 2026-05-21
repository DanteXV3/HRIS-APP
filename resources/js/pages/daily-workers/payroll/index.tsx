import { Head, router, usePage, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { Receipt, Plus, Calendar, MapPin, Calculator, FileText, Trash2 } from 'lucide-react';
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
    { title: 'Payroll', href: '/daily-worker-payrolls' },
];

interface Props {
    payrolls: Pagination<any>;
    workingLocations: { id: number; name: string }[];
}

export default function DailyWorkerPayrollIndex() {
    const { payrolls, workingLocations } = usePage<any>().props as unknown as Props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [formData, setFormData] = useState({
        working_location_id: '',
        periode_start: '',
        periode_end: '',
        calc_bpjs_tk: true,
        calc_bpjs_ks: true,
        calc_pph21: true,
    });

    function openCreateModal() {
        setIsModalOpen(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsProcessing(true);
        router.post('/daily-worker-payrolls', formData, {
            onSuccess: () => {
                setIsModalOpen(false);
                setIsProcessing(false);
            },
            onError: () => setIsProcessing(false)
        });
    }

    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this payroll draft?')) {
            router.delete(`/daily-worker-payrolls/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="DW Payroll" />
            <div className="flex flex-col gap-8 p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Daily Worker Payroll</h1>
                        <p className="text-muted-foreground">Kelola penggajian dan perhitungan pajak pekerja harian</p>
                    </div>
                    <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Generate Payroll Baru
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {payrolls.data.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-white dark:bg-neutral-900 rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-800">
                            <Receipt className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                            <p className="text-neutral-500">Belum ada data payroll yang digenerate.</p>
                        </div>
                    ) : (
                        payrolls.data.map((payroll) => (
                            <div key={payroll.id} className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-6 relative group">
                                <div className="flex flex-col flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                            payroll.status === 'finalized' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {payroll.status}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">{payroll.working_location.name}</h3>
                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center text-sm text-neutral-500">
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {new Date(payroll.periode_start).toLocaleDateString()} - {new Date(payroll.periode_end).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/daily-worker-payrolls/${payroll.id}`}>
                                            <Button size="sm" variant="outline">
                                                <Calculator className="mr-2 h-4 w-4 text-blue-500" />
                                                View Items
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                                {payroll.status === 'draft' && (
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
                                        onClick={() => handleDelete(payroll.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Generate Payroll Daily Worker</DialogTitle>
                            <DialogDescription>
                                Pilih lokasi dan periode untuk mengkalkulasi gaji otomatis.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6 py-6">
                            <div className="space-y-2">
                                <Label>Lokasi Kerja</Label>
                                <Select required onValueChange={v => setFormData({...formData, working_location_id: v})}>
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

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Dari Tanggal</Label>
                                    <Input type="date" required value={formData.periode_start} onChange={e => setFormData({...formData, periode_start: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Sampai Tanggal</Label>
                                    <Input type="date" required value={formData.periode_end} onChange={e => setFormData({...formData, periode_end: e.target.value})} />
                                </div>
                            </div>

                            <div className="space-y-4 border-t pt-4">
                                <Label className="text-xs font-bold uppercase text-neutral-500">Kalkulasi Tambahan</Label>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <input type="checkbox" id="calc_bpjs_tk" checked={formData.calc_bpjs_tk} onChange={e => setFormData({...formData, calc_bpjs_tk: e.target.checked})} />
                                        <Label htmlFor="calc_bpjs_tk" className="text-sm font-normal cursor-pointer">Hitung BPJS Ketenagakerjaan</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="checkbox" id="calc_bpjs_ks" checked={formData.calc_bpjs_ks} onChange={e => setFormData({...formData, calc_bpjs_ks: e.target.checked})} />
                                        <Label htmlFor="calc_bpjs_ks" className="text-sm font-normal cursor-pointer">Hitung BPJS Kesehatan</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="checkbox" id="calc_pph21" checked={formData.calc_pph21} onChange={e => setFormData({...formData, calc_pph21: e.target.checked})} />
                                        <Label htmlFor="calc_pph21" className="text-sm font-normal cursor-pointer">Hitung PPh21 (Harian Lepas)</Label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700">
                                {isProcessing ? 'Calculating...' : 'Generate Sekarang'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
