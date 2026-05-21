import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Trash2, Edit3, ClipboardList, MapPin } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface BudgetItem {
    id: number;
    working_location_id: number;
    item_code: string;
    nama_budget: string;
    budget_unit: string;
    qty_budget: number;
    nilai_budget_material: number;
    nilai_budget_jasa: number;
    msr_unit: string | null;
    conversion_unit: number;
}

interface Props {
    workingLocations: { id: number; name: string }[];
    budgetItems: BudgetItem[];
    selectedLocationId: number | null;
    can: { create: boolean; edit: boolean; delete: boolean };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Cost Control', href: '#' },
    { title: 'Item List And Budgeting', href: '/cost-control/budget-items' },
];

export default function BudgetItemIndex() {
    const { workingLocations, budgetItems, selectedLocationId, can } = usePage<{ props: Props }>().props as unknown as Props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        working_location_id: selectedLocationId?.toString() ?? '',
        item_code: '',
        nama_budget: '',
        budget_unit: '',
        qty_budget: 0,
        nilai_budget_material: 0,
        nilai_budget_jasa: 0,
        msr_unit: '',
        conversion_unit: 1,
    });

    const handleLocationChange = (id: string) => {
        router.get('/cost-control/budget-items', { working_location_id: id }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingItem(null);
        setFormData({
            working_location_id: selectedLocationId?.toString() ?? '',
            item_code: '',
            nama_budget: '',
            budget_unit: '',
            qty_budget: 0,
            nilai_budget_material: 0,
            nilai_budget_jasa: 0,
            msr_unit: '',
            conversion_unit: 1,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item: BudgetItem) => {
        setEditingItem(item);
        setFormData({
            working_location_id: item.working_location_id.toString(),
            item_code: item.item_code,
            nama_budget: item.nama_budget,
            budget_unit: item.budget_unit,
            qty_budget: item.qty_budget,
            nilai_budget_material: item.nilai_budget_material,
            nilai_budget_jasa: item.nilai_budget_jasa,
            msr_unit: item.msr_unit ?? '',
            conversion_unit: item.conversion_unit,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            router.put(`/cost-control/budget-items/${editingItem.id}`, formData, {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            router.post('/cost-control/budget-items', formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    // No need to reset formData here if we reset in openCreateModal
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Hapus item budget ini?')) {
            router.delete(`/cost-control/budget-items/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Item List And Budgeting" />
            
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                            <ClipboardList className="w-7 h-7 text-indigo-600" />
                            Item List And Budgeting
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola daftar item dan anggaran untuk setiap lokasi kerja (proyek).
                        </p>
                    </div>
                    {can.create && selectedLocationId && (
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
                        >
                            <Plus className="h-4 w-4" /> Tambah Item
                        </button>
                    )}
                </div>

                {/* Location Selector */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
                    <div className="max-w-md space-y-2">
                        <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Pilih Lokasi Kerja (Proyek)
                        </label>
                        <select 
                            value={selectedLocationId ?? ''} 
                            onChange={(e) => handleLocationChange(e.target.value)}
                            className="block w-full rounded-lg border-neutral-300 bg-neutral-50 px-4 py-2.5 text-sm focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                        >
                            <option value="">-- Pilih Lokasi --</option>
                            {workingLocations.map(l => (
                                <option key={l.id} value={l.id}>{l.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {!selectedLocationId ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 shadow-sm">
                        <MapPin className="w-12 h-12 text-neutral-300 mb-3" />
                        <p className="text-neutral-500 font-medium">Silahkan pilih lokasi kerja terlebih dahulu.</p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-neutral-50 text-[10px] uppercase tracking-wider text-neutral-500 dark:bg-neutral-800/50 dark:text-neutral-400 border-b border-neutral-100 dark:border-neutral-800">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Item Code</th>
                                        <th className="px-6 py-4 font-bold">Nama Budget</th>
                                        <th className="px-6 py-4 font-bold">Budget Unit</th>
                                        <th className="px-6 py-4 font-bold text-center">Qty Budget</th>
                                        <th className="px-6 py-4 font-bold text-right">Budget Material</th>
                                        <th className="px-6 py-4 font-bold text-right">Budget Jasa</th>
                                        <th className="px-6 py-4 font-bold">MSR Unit</th>
                                        <th className="px-6 py-4 font-bold text-center">Conv. Unit</th>
                                        <th className="px-6 py-4 font-bold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {budgetItems.map((item) => (
                                        <tr key={item.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold">{item.item_code}</td>
                                            <td className="px-6 py-4 font-semibold text-neutral-900 dark:text-neutral-100">{item.nama_budget}</td>
                                            <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">{item.budget_unit}</td>
                                            <td className="px-6 py-4 text-center tabular-nums text-neutral-900 dark:text-neutral-100 font-bold">{item.qty_budget}</td>
                                            <td className="px-6 py-4 text-right tabular-nums text-neutral-900 dark:text-neutral-100 font-medium">
                                                {new Intl.NumberFormat('id-ID').format(item.nilai_budget_material)}
                                            </td>
                                            <td className="px-6 py-4 text-right tabular-nums text-neutral-900 dark:text-neutral-100 font-medium">
                                                {new Intl.NumberFormat('id-ID').format(item.nilai_budget_jasa)}
                                            </td>
                                            <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">{item.msr_unit || '-'}</td>
                                            <td className="px-6 py-4 text-center text-neutral-600 dark:text-neutral-400">{item.conversion_unit}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {can.edit && (
                                                        <button onClick={() => openEditModal(item)} className="p-2 text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {can.delete && (
                                                        <button onClick={() => handleDelete(item.id)} className="p-2 text-neutral-400 hover:text-red-600 dark:hover:text-red-400">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {budgetItems.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-10 text-center text-neutral-500 italic">
                                                Belum ada item budget untuk lokasi ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* CRUD Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 dark:border-neutral-800">
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                                {editingItem ? <Edit3 className="w-5 h-5 text-indigo-600" /> : <Plus className="w-5 h-5 text-indigo-600" />}
                                {editingItem ? 'Edit Item Budget' : 'Tambah Item Budget Baru'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 text-2xl font-bold">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Item Code</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.item_code}
                                        onChange={e => setFormData({...formData, item_code: e.target.value})}
                                        className="block w-full rounded-lg border-neutral-300 bg-neutral-50 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                        placeholder="Contoh: CIVIL-001"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Nama Budget</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.nama_budget}
                                        onChange={e => setFormData({...formData, nama_budget: e.target.value})}
                                        className="block w-full rounded-lg border-neutral-300 bg-neutral-50 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                        placeholder="Contoh: Pekerjaan Tanah"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Budget Unit</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.budget_unit}
                                        onChange={e => setFormData({...formData, budget_unit: e.target.value})}
                                        className="block w-full rounded-lg border-neutral-300 bg-neutral-50 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                        placeholder="Set / Ls / Mtr"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">MSR Unit</label>
                                    <input
                                        type="text"
                                        value={formData.msr_unit}
                                        onChange={e => setFormData({...formData, msr_unit: e.target.value})}
                                        className="block w-full rounded-lg border-neutral-300 bg-neutral-50 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                        placeholder="Optional"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Qty Budget</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        value={formData.qty_budget}
                                        onChange={e => setFormData({...formData, qty_budget: parseFloat(e.target.value) || 0})}
                                        className="block w-full rounded-lg border-neutral-300 bg-neutral-50 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white text-center font-bold"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Nilai Budget Material</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.nilai_budget_material}
                                        onChange={e => setFormData({...formData, nilai_budget_material: parseFloat(e.target.value) || 0})}
                                        className="block w-full rounded-lg border-neutral-300 bg-neutral-50 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white text-right font-medium"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Nilai Budget Jasa</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.nilai_budget_jasa}
                                        onChange={e => setFormData({...formData, nilai_budget_jasa: parseFloat(e.target.value) || 0})}
                                        className="block w-full rounded-lg border-neutral-300 bg-neutral-50 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white text-right font-medium"
                                    />
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Conversion Unit</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.0001"
                                        value={formData.conversion_unit}
                                        onChange={e => setFormData({...formData, conversion_unit: parseFloat(e.target.value) || 0})}
                                        className="block w-full rounded-lg border-neutral-300 bg-neutral-50 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg px-4 py-2 text-sm font-bold text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors">
                                    Batal
                                </button>
                                <button type="submit" className="rounded-lg bg-indigo-600 px-8 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors">
                                    {editingItem ? 'Simpan Perubahan' : 'Simpan Item Budget'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
