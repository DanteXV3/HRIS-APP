import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Search, Plus, Edit2, Trash2, Clock } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Pagination } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Shift {
    id: number;
    name: string;
    jam_masuk: string;
    jam_pulang: string;
    created_at: string;
}

interface Props {
    shifts: Pagination<Shift>;
    filters: { search?: string };
}

function formatTime(time: string) {
    if (!time) return '-';
    // Drops seconds if "HH:mm:ss"
    return time.substring(0, 5); 
}

export default function ShiftIndex({ shifts, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingShift, setEditingShift] = useState<Shift | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Shift Kerja', href: '/shifts' },
    ];

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        jam_masuk: '',
        jam_pulang: '',
    });

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get('/shifts', { search }, { preserveState: true });
    }

    function openCreateModal() {
        setEditingShift(null);
        reset();
        setIsModalOpen(true);
    }

    function openEditModal(shift: Shift) {
        setEditingShift(shift);
        setData({
            name: shift.name,
            jam_masuk: formatTime(shift.jam_masuk),
            jam_pulang: formatTime(shift.jam_pulang),
        });
        setIsModalOpen(true);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (editingShift) {
            put(`/shifts/${editingShift.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/shifts', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    }

    function handleDelete(shift: Shift) {
        if (confirm(`Yakin ingin menghapus shift "${shift.name}"?`)) {
            destroy(`/shifts/${shift.id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Shift Kerja" />
            
            <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Shift Kerja</h1>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola jadwal jam masuk dan pulang karyawan.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-4">
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Tambah Shift
                        </button>
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <form onSubmit={handleSearch} className="relative max-w-sm flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-neutral-400" />
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="block w-full rounded-lg border border-neutral-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-neutral-500 focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                            placeholder="Cari nama shift..."
                        />
                    </form>
                </div>

                <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
                            <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Nama Shift</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Jam Masuk</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Jam Pulang</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
                                {shifts.data.length > 0 ? (
                                    shifts.data.map((shift) => (
                                        <tr key={shift.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                            <td className="whitespace-nowrap px-6 py-4 font-medium text-neutral-900 dark:text-white">
                                                {shift.name}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-center text-neutral-600 dark:text-neutral-300">
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {formatTime(shift.jam_masuk)}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-center text-neutral-600 dark:text-neutral-300">
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {formatTime(shift.jam_pulang)}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                                <button onClick={() => openEditModal(shift)} className="mr-3 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(shift)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-sm text-neutral-500">
                                            Tidak ada data shift ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md bg-white dark:bg-neutral-900">
                    <DialogHeader>
                        <DialogTitle>{editingShift ? 'Edit Shift' : 'Tambah Shift Baru'}</DialogTitle>
                        <DialogDescription>
                            Tentukan nama dan rentang jam kerja operasional.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={submit} className="space-y-4 pt-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Nama Shift</label>
                            <input 
                                type="text" 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)} 
                                className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                                placeholder="Misal: Shift Pagi"
                                required 
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Jam Masuk (In)</label>
                                <input 
                                    type="time" 
                                    value={data.jam_masuk} 
                                    onChange={e => setData('jam_masuk', e.target.value)} 
                                    className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                                    required 
                                />
                                {errors.jam_masuk && <p className="mt-1 text-xs text-red-500">{errors.jam_masuk}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Jam Pulang (Out)</label>
                                <input 
                                    type="time" 
                                    value={data.jam_pulang} 
                                    onChange={e => setData('jam_pulang', e.target.value)} 
                                    className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                                    required 
                                />
                                {errors.jam_pulang && <p className="mt-1 text-xs text-red-500">{errors.jam_pulang}</p>}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3 border-t border-neutral-200 dark:border-neutral-800 pt-5">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">
                                Batal
                            </button>
                            <button type="submit" disabled={processing} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                                {processing ? 'Menyimpan...' : 'Simpan Shift'}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
