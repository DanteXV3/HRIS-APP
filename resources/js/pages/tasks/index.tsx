import { Head, router, usePage } from '@inertiajs/react';
import { Plus, CheckCircle2, Trash2, MessageCircle, ClipboardList, Calendar, User, Clock, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import axios from 'axios';
import type { BreadcrumbItem } from '@/types';

interface Task {
    id: number;
    title: string;
    description: string | null;
    assigned_from: number;
    assigned_to: number;
    category: 'one-time' | 'recurring';
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
    due_date: string | null;
    last_completed_at: string | null;
    is_completed: boolean;
    is_active: boolean;
    created_at: string;
    creator?: { id: number; nama: string };
    assignee?: { id: number; nama: string; no_telpon_1?: string };
}

interface Props {
    tasks: Task[];
    employees: { id: number; nama: string; nik: string }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Daftar Tugas', href: '/tasks' },
];

export default function TaskIndex() {
    const { tasks, employees } = usePage<{ props: Props }>().props as unknown as Props;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assigned_to: '',
        category: 'one-time' as 'one-time' | 'recurring',
        frequency: '',
        due_date: ''
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        router.post('/tasks', formData, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                setFormData({ title: '', description: '', assigned_to: '', category: 'one-time', frequency: '', due_date: '' });
            }
        });
    }

    function handleComplete(id: number) {
        router.post(`/tasks/${id}/complete`, {}, { preserveScroll: true });
    }

    function handleDelete(id: number) {
        if (confirm('Hapus tugas ini?')) {
            router.delete(`/tasks/${id}`, { preserveScroll: true });
        }
    }



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Tugas" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                            <ClipboardList className="w-7 h-7 text-indigo-600" />
                            Daftar Tugas & Pengingat
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola tugas pribadi Anda atau berikan tugas kepada rekan kerja.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 w-full sm:w-auto"
                    >
                        <Plus className="h-4 w-4" /> Buat Tugas Baru
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    {tasks.map((t) => (
                        <div key={t.id} className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-neutral-900 ${t.is_completed ? 'border-neutral-100 opacity-75 dark:border-neutral-800' : 'border-neutral-200 dark:border-neutral-700'}`}>
                            <div className="mb-4">
                                <div className="flex items-start justify-between mb-2">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${t.category === 'recurring' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30'}`}>
                                        {t.category === 'recurring' ? t.frequency : 'Sekali Saja'}
                                    </span>
                                    {t.is_completed && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase">
                                            <CheckCircle className="w-3 h-3" /> Selesai
                                        </span>
                                    )}
                                </div>
                                <h3 className={`text-base font-bold text-neutral-900 dark:text-white ${t.is_completed ? 'line-through text-neutral-400' : ''}`}>
                                    {t.title}
                                </h3>
                                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
                                    {t.description || 'Tidak ada deskripsi'}
                                </p>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="flex items-center gap-1.5 text-neutral-500">
                                        <User className="w-3.5 h-3.5" />
                                        <span className="truncate">Untuk: {t.assignee?.nama}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-neutral-500 justify-end">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{t.due_date ? new Date(t.due_date).toLocaleDateString('id-ID') : '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-neutral-500">
                                        <User className="w-3.5 h-3.5 opacity-50" />
                                        <span className="truncate italic">Oleh: {t.creator?.nama}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-neutral-500 justify-end">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>Ref: {new Date(t.created_at).toLocaleDateString('id-ID')}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    {!t.is_completed && (
                                        <button
                                            onClick={() => handleComplete(t.id)}
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-xs font-bold text-green-700 transition-colors hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Selesaikan
                                        </button>
                                    )}
                                    {t.assignee?.id !== t.assigned_from && (
                                        <a
                                            href={`/tasks/${t.id}/whatsapp`}
                                            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400"
                                            title="Kirim Notifikasi WA"
                                        >
                                            <MessageCircle className="w-3.5 h-3.5" />
                                            WA
                                        </a>
                                    )}
                                    <button
                                        onClick={() => handleDelete(t.id)}
                                        className="inline-flex items-center justify-center rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
                                        title="Hapus Tugas"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {tasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-neutral-900 rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-700">
                        <ClipboardList className="w-12 h-12 text-neutral-300 mb-3" />
                        <p className="text-neutral-500 font-medium">Belum ada tugas yang dibuat.</p>
                        <button onClick={() => setIsCreateModalOpen(true)} className="mt-2 text-indigo-600 font-bold hover:underline">Buat tugas pertama Anda</button>
                    </div>
                )}
            </div>

            {/* Create Task Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 dark:border-neutral-800">
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                                <Plus className="w-5 h-5 text-indigo-600" />
                                Buat Tugas Baru
                            </h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 text-xl font-bold">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2 space-y-1">
                                    <label className="text-xs font-bold uppercase text-neutral-500">Judul Tugas</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.title}
                                        onChange={e => setFormData({...formData, title: e.target.value})}
                                        className="block w-full rounded-lg border-neutral-300 bg-neutral-50 px-3 py-2 text-sm focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                        placeholder="Contoh: Laporan Mingguan Marketing"
                                    />
                                </div>
                                <div className="sm:col-span-2 space-y-1">
                                    <label className="text-xs font-bold uppercase text-neutral-500">Deskripsi (Opsional)</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        rows={3}
                                        className="block w-full rounded-lg border-neutral-300 bg-neutral-50 px-3 py-2 text-sm focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                        placeholder="Berikan detail tugas..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-neutral-500">Tugaskan Kepada</label>
                                    <select
                                        value={formData.assigned_to}
                                        onChange={e => setFormData({...formData, assigned_to: e.target.value})}
                                        className="block w-full rounded-lg border-neutral-300 bg-neutral-50 px-3 py-2 text-sm focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                    >
                                        <option value="">Diri Sendiri</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.nama} ({emp.nik})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-neutral-500">Kategori</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({...formData, category: e.target.value as any})}
                                        className="block w-full rounded-lg border-neutral-300 bg-neutral-50 px-3 py-2 text-sm focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                    >
                                        <option value="one-time">Sekali Saja</option>
                                        <option value="recurring">Berulang</option>
                                    </select>
                                </div>
                                {formData.category === 'recurring' && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase text-neutral-500">Frekuensi</label>
                                        <select
                                            required
                                            value={formData.frequency}
                                            onChange={e => setFormData({...formData, frequency: e.target.value})}
                                            className="block w-full rounded-lg border-neutral-300 bg-neutral-50 px-3 py-2 text-sm focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                        >
                                            <option value="">Pilih Frekuensi</option>
                                            <option value="daily">Harian</option>
                                            <option value="weekly">Mingguan</option>
                                            <option value="monthly">Bulanan</option>
                                            <option value="yearly">Tahunan</option>
                                        </select>
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-neutral-500">
                                        {formData.category === 'recurring' ? 'Tanggal Mulai' : 'Batas Waktu'}
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.due_date}
                                        onChange={e => setFormData({...formData, due_date: e.target.value})}
                                        className="block w-full rounded-lg border-neutral-300 bg-neutral-50 px-3 py-2 text-sm focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="rounded-lg px-4 py-2 text-sm font-bold text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors">
                                    Batal
                                </button>
                                <button type="submit" className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors">
                                    Simpan Tugas
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
