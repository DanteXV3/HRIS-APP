import { Head, router, usePage, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { Edit, Plus, Trash2, UserPlus, Search, MapPin, Briefcase, FileText, Ban } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, DailyWorker, Pagination } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Daily Worker', href: '/daily-workers' },
];

interface Props {
    workers: Pagination<any>;
    workingLocations: { id: number; name: string }[];
    departments: { id: number; name: string }[];
    positions: { id: number; name: string }[];
    filters: { search?: string, working_location_id?: string, tipe_dw?: string };
}

export default function DailyWorkerIndex() {
    const { workers, workingLocations, departments, positions, filters } = usePage<any>().props as unknown as Props;
    const [isProcessing, setIsProcessing] = useState(false);

    function handleDelete(id: number) {
        if (confirm('Apakah Anda yakin ingin menghapus data daily worker ini?')) {
            router.delete(`/daily-workers/${id}`);
        }
    }

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        router.get('/daily-workers', newFilters, { preserveState: true, preserveScroll: true });
    };

    const fmt = (v: number) => new Intl.NumberFormat('id-ID').format(v);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Daily Worker" />
            <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Daftar Daily Worker</h1>
                        <p className="text-sm text-neutral-500">Kelola data dan struktur gaji pekerja harian lepas</p>
                    </div>
                    <Link href="/daily-workers/create" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Tambah Daily Worker
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="relative sm:col-span-2 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
                        <Input 
                            placeholder="Cari berdasarkan nama atau NIK..." 
                            className="pl-10 h-10 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                            defaultValue={filters.search}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleFilterChange('search', (e.target as any).value);
                                }
                            }}
                        />
                    </div>
                    
                    <Select value={filters.working_location_id?.toString()} onValueChange={(v) => handleFilterChange('working_location_id', v)}>
                        <SelectTrigger className="h-10 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                            <SelectValue placeholder="Semua Lokasi" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Lokasi</SelectItem>
                            {workingLocations.map(l => <SelectItem key={l.id} value={l.id.toString()}>{l.name}</SelectItem>)}
                        </SelectContent>
                    </Select>

                    <Select value={filters.tipe_dw} onValueChange={(v) => handleFilterChange('tipe_dw', v)}>
                        <SelectTrigger className="h-10 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                            <SelectValue placeholder="Semua Tipe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Tipe</SelectItem>
                            <SelectItem value="lokal">Lokal</SelectItem>
                            <SelectItem value="non lokal">Non-Lokal</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Desktop Table */}
                <div className="hidden lg:block overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                                <th className="px-4 py-3 text-xs font-bold uppercase text-neutral-500 tracking-wider">Pekerja</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase text-neutral-500 tracking-wider">Jabatan & Penempatan</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase text-neutral-500 tracking-wider">Info Kontak</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase text-neutral-500 tracking-wider">Struktur Gaji</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase text-neutral-500 tracking-wider">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-bold uppercase text-neutral-500 tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            {workers.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center text-neutral-500 italic">Data tidak ditemukan.</td>
                                </tr>
                            ) : (
                                workers.data.map((worker) => (
                                    <tr key={worker.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-all duration-200">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border border-neutral-200 dark:border-neutral-700 flex-shrink-0">
                                                    {worker.photo ? (
                                                        <img src={`/storage/${worker.photo}`} alt={worker.nama} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <span className="text-sm font-bold text-neutral-400">{worker.nama.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="font-bold text-sm text-neutral-900 dark:text-white capitalize block truncate">{worker.nama}</span>
                                                    <span className="text-xs font-mono text-neutral-400">{worker.nik}</span>
                                                    <span className={`ml-2 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                        worker.tipe_dw === 'lokal' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                                    }`}>
                                                        {worker.tipe_dw}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                                    <Briefcase className="mr-1.5 h-3.5 w-3.5 text-neutral-400 flex-shrink-0" />
                                                    <span className="truncate">{worker.position?.name || 'No Position'}</span>
                                                </div>
                                                <div className="flex items-center text-xs text-neutral-500">
                                                    <MapPin className="mr-1.5 h-3.5 w-3.5 text-neutral-400 flex-shrink-0" />
                                                    <span className="truncate">{worker.working_location?.name || 'Unassigned'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                                <p className="truncate max-w-[150px]">{worker.email}</p>
                                                <p className="text-xs mt-0.5">{worker.no_telpon_1 || '-'}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                                    Rp {fmt(worker.gaji_harian)}
                                                </span>
                                                <span className="text-[10px] text-neutral-500 uppercase tracking-tighter">Gaji Harian</span>
                                                <span className="text-[10px] mt-0.5 text-neutral-400">Makan: {fmt(worker.uang_makan)}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                                                worker.is_active 
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' 
                                                    : 'bg-neutral-50 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700'
                                            }`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${worker.is_active ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
                                                {worker.is_active ? 'Aktif' : 'Non-aktif'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={`/daily-workers/${worker.id}/edit`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                                        <Edit className="h-4 w-4 text-neutral-400 hover:text-blue-600" />
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDelete(worker.id)}>
                                                    <Trash2 className="h-4 w-4 text-neutral-400 hover:text-red-600" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-3">
                    {workers.data.length === 0 ? (
                        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 text-center text-neutral-500 italic">
                            Data tidak ditemukan.
                        </div>
                    ) : (
                        workers.data.map((worker) => (
                            <div key={worker.id} className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border border-neutral-200 dark:border-neutral-700 flex-shrink-0">
                                        {worker.photo ? (
                                            <img src={`/storage/${worker.photo}`} alt={worker.nama} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-lg font-bold text-neutral-400">{worker.nama.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-bold text-neutral-900 dark:text-white capitalize truncate">{worker.nama}</span>
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border flex-shrink-0 ${
                                                worker.is_active 
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' 
                                                    : 'bg-neutral-50 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700'
                                            }`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${worker.is_active ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
                                                {worker.is_active ? 'Aktif' : 'Non-aktif'}
                                            </span>
                                        </div>
                                        <span className="text-xs font-mono text-neutral-400">{worker.nik}</span>
                                        <span className={`ml-2 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                            worker.tipe_dw === 'lokal' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                        }`}>
                                            {worker.tipe_dw}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                                        <Briefcase className="mr-1.5 h-3.5 w-3.5 text-neutral-400 flex-shrink-0" />
                                        <span className="truncate">{worker.position?.name || '-'}</span>
                                    </div>
                                    <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                                        <MapPin className="mr-1.5 h-3.5 w-3.5 text-neutral-400 flex-shrink-0" />
                                        <span className="truncate">{worker.working_location?.name || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-neutral-400">Gaji Harian</span>
                                        <p className="font-bold text-blue-600 dark:text-blue-400">Rp {fmt(worker.gaji_harian)}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-neutral-400">Uang Makan</span>
                                        <p className="text-neutral-700 dark:text-neutral-300">Rp {fmt(worker.uang_makan)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                                    <Link href={`/daily-workers/${worker.id}/edit`}>
                                        <Button variant="outline" size="sm" className="h-8">
                                            <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" size="sm" className="h-8 text-red-600 hover:text-red-700" onClick={() => handleDelete(worker.id)}>
                                        <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Hapus
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {workers.last_page > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                         <div className="text-sm text-neutral-500">
                             Showing {workers.from} to {workers.to} of {workers.total} workers
                         </div>
                         <div className="flex flex-wrap gap-1 justify-center">
                             {workers.links.map((link, i) => (
                                 link.url && (
                                     <Link key={i} href={link.url}>
                                         <Button variant={link.active ? "default" : "outline"} size="sm" className="h-8 min-w-[32px]">
                                             <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                         </Button>
                                     </Link>
                                 )
                             ))}
                         </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
