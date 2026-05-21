import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Plus, Trash2, FileText, AlertCircle, ShoppingCart, Search, Info } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, WorkLocation, Department, WorkingLocation } from '@/types';
import { useState, useEffect, useMemo } from 'react';

interface BudgetItem {
    id: number;
    item_code: string;
    nama_budget: string;
    working_location_id: number;
    msr_unit: string;
}

interface Props {
    companies: WorkLocation[];
    departments: Department[];
    workingLocations: WorkingLocation[];
    subjects: string[];
    materialUnits: string[];
    materialNames: string[];
    budgetItems: BudgetItem[];
}

export default function MSRForm() {
    const { companies, departments, workingLocations, subjects, materialUnits, materialNames, budgetItems } = usePage<{ props: Props }>().props as unknown as Props;
    const { auth } = usePage().props as any;
    const employee = auth.user.employee;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Material & Service Request', href: '/msr' },
        { title: 'Buat Pengajuan', href: '#' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        date: new Date().toISOString().substring(0, 10),
        company_id: employee?.work_location_id?.toString() ?? '',
        work_location_id: employee?.working_location_id?.toString() ?? '',
        department_id: employee?.department_id?.toString() ?? '',
        subject: '',
        description: '',
        notes: '',
        attachments: [] as File[],
        items: [{ 
            category: 'Material', 
            budget_item_id: '', 
            item_name: '', 
            qty: 1, 
            price: 0, 
            unit: 'Pcs', 
            material: '', 
            size: '', 
            keterangan: '' 
        }],
    });

    const [filePreviews, setFilePreviews] = useState<string[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);

    // Filter budget items based on selected working location
    const filteredBudgetItems = useMemo(() => {
        if (!data.work_location_id) return [];
        return budgetItems.filter(bi => bi.working_location_id === parseInt(data.work_location_id));
    }, [data.work_location_id, budgetItems]);

    useEffect(() => {
        const sum = data.items.reduce((acc, item) => acc + (item.qty * item.price || 0), 0);
        setTotalAmount(sum);
    }, [data.items]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setData('attachments', [...data.attachments, ...newFiles]);
            const newPreviews = newFiles.map(file => file.type.startsWith('image/') ? URL.createObjectURL(file) : '');
            setFilePreviews([...filePreviews, ...newPreviews]);
        }
    };

    const removeFile = (index: number) => {
        const newFiles = [...data.attachments];
        newFiles.splice(index, 1);
        setData('attachments', newFiles);
        const newPreviews = [...filePreviews];
        if (newPreviews[index]) URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setFilePreviews(newPreviews);
    };

    const addItem = () => {
        setData('items', [...data.items, { 
            category: 'Material', 
            budget_item_id: '', 
            item_name: '', 
            qty: 1, 
            price: 0, 
            unit: 'Pcs', 
            material: '', 
            size: '', 
            keterangan: '' 
        }]);
    };

    const removeItem = (index: number) => {
        if (data.items.length === 1) return;
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        // If updating budget_item_id, also auto-fill item_name
        if (field === 'budget_item_id' && value) {
            const bi = budgetItems.find(i => i.id.toString() === value.toString());
            if (bi) {
                newItems[index] = { 
                    ...newItems[index], 
                    [field]: value, 
                    item_name: bi.nama_budget,
                    unit: bi.msr_unit || newItems[index].unit
                };
            } else {
                newItems[index] = { ...newItems[index], [field]: value };
            }
        } else {
            newItems[index] = { ...newItems[index], [field]: value };
        }
        setData('items', newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/msr');
    };

    const hasSignature = !!employee?.signature;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat MSR" />

            <div className="mx-auto max-w-full px-6 py-8">
                <div className="mb-8 border-b border-neutral-100 dark:border-neutral-800 pb-6">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Buat Material & Service Request</h1>
                    <p className="mt-2 text-base text-neutral-500">Lengkapi formulir untuk mengajukan permintaan material atau jasa untuk proyek Anda.</p>
                </div>

                {!hasSignature && (
                    <div className="mb-6 flex items-start gap-4 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/20">
                        <AlertCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                        <div>
                            <h3 className="font-semibold text-red-800 dark:text-red-300">Tanda Tangan Diperlukan</h3>
                            <p className="mt-1 text-sm text-red-700 dark:text-red-400">Harap atur tanda tangan di halaman profil sebelum melanjutkan.</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Header Info */}
                    <div className="grid gap-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                             <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">Tanggal <span className="text-red-500">*</span></label>
                                <input type="date" value={data.date} disabled
                                    className="mt-1 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-800/50" required />
                                {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">Perusahaan <span className="text-red-500">*</span></label>
                                <select value={data.company_id} disabled
                                    className="mt-1 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-800/50 appearance-none" required>
                                    <option value="">Pilih Perusahaan</option>
                                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                {errors.company_id && <p className="mt-1 text-xs text-red-500">{errors.company_id}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">Penempatan <span className="text-red-500">*</span></label>
                                <select value={data.work_location_id} disabled
                                    className="mt-1 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-800/50 appearance-none" required>
                                    <option value="">Pilih Lokasi</option>
                                    {workingLocations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                </select>
                                {errors.work_location_id && <p className="mt-1 text-xs text-red-500">{errors.work_location_id}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">Departemen <span className="text-red-500">*</span></label>
                                <select value={data.department_id} disabled
                                    className="mt-1 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-800/50 appearance-none" required>
                                    <option value="">Pilih Departemen</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                                {errors.department_id && <p className="mt-1 text-xs text-red-500">{errors.department_id}</p>}
                            </div>
                        </div>

                        <hr className="border-neutral-100 dark:border-neutral-800" />

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">Subjek / Kategori (PR Maker Routing) <span className="text-red-500">*</span></label>
                                <select value={data.subject} onChange={e => setData('subject', e.target.value)} 
                                    className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" required>
                                    <option value="">Pilih Subjek</option>
                                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">Keterangan / Deskripsi Umum <span className="text-red-500">*</span></label>
                            <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={2} placeholder="Tujuan pengadaan..."
                                className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" required />
                            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4" /> Daftar Item (Material / Jasa)
                            </h3>
                            <button type="button" onClick={addItem} className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700">
                                <Plus className="h-4 w-4" /> Tambah Item
                            </button>
                        </div>
                        
                        <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
                            <table className="w-full text-left text-sm min-w-[1200px]">
                                <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                                    <tr className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                                        <th className="w-32 px-4 py-4">Cat.</th>
                                        <th className="w-72 px-4 py-4">Budget Link</th>
                                        <th className="px-4 py-4">Item Name</th>
                                        <th className="w-32 px-4 py-4">Unit</th>
                                        <th className="w-48 px-4 py-4">Material</th>
                                        <th className="w-32 px-4 py-4">Size</th>
                                        <th className="w-28 px-4 py-4 text-right">Qty</th>
                                        <th className="w-44 px-4 py-4 text-right">Price</th>
                                        <th className="w-44 px-4 py-4 text-right">Total</th>
                                        <th className="w-12 px-4 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                    {data.items.map((item, idx) => (
                                        <tr key={idx} className="group hover:bg-neutral-50/50 transition-colors">
                                            <td className="p-2">
                                                <select value={item.category} onChange={e => updateItem(idx, 'category', e.target.value)}
                                                    className="w-full border-none bg-transparent focus:ring-0 text-sm font-bold dark:text-white dark:bg-neutral-900">
                                                    <option value="Material" className="dark:bg-neutral-900">Material</option>
                                                    <option value="Jasa" className="dark:bg-neutral-900">Jasa</option>
                                                </select>
                                            </td>
                                            <td className="p-2">
                                                <select value={item.budget_item_id} onChange={e => updateItem(idx, 'budget_item_id', e.target.value)}
                                                    className="w-full border-none bg-transparent focus:ring-0 text-xs dark:text-white dark:bg-neutral-900 truncate max-w-[200px]">
                                                    <option value="" className="dark:bg-neutral-900">Manual Entry</option>
                                                    {filteredBudgetItems.map(bi => (
                                                        <option key={bi.id} value={bi.id} className="dark:bg-neutral-900">{bi.item_code} - {bi.nama_budget}</option>
                                                    ))}
                                                </select>
                                                {!data.work_location_id && <div className="text-[8px] text-red-500 px-3">Pilih Lokasi dahulu</div>}
                                            </td>
                                            <td className="p-2">
                                                <input type="text" value={item.item_name} onChange={e => updateItem(idx, 'item_name', e.target.value)}
                                                    className="w-full border-none bg-transparent focus:ring-0 text-sm dark:text-white" placeholder="Nama item..." required />
                                            </td>
                                            <td className="p-2">
                                                <input list="unitList" type="text" value={item.unit} onChange={e => updateItem(idx, 'unit', e.target.value)}
                                                    className="w-full border-none bg-transparent focus:ring-0 text-sm dark:text-white" required />
                                                <datalist id="unitList">
                                                    {materialUnits.map(u => <option key={u} value={u} />)}
                                                </datalist>
                                            </td>
                                            <td className="p-2">
                                                <input list="materialList" type="text" value={item.material} onChange={e => updateItem(idx, 'material', e.target.value)}
                                                    className="w-full border-none bg-transparent focus:ring-0 text-xs dark:text-white placeholder:text-[10px]" placeholder="Specific material..." />
                                                <datalist id="materialList">
                                                    {materialNames.map(m => <option key={m} value={m} />)}
                                                </datalist>
                                            </td>
                                            <td className="p-2">
                                                <input type="text" value={item.size} onChange={e => updateItem(idx, 'size', e.target.value)}
                                                    className="w-full border-none bg-transparent focus:ring-0 text-sm dark:text-white" placeholder="Size..." />
                                            </td>
                                            <td className="p-2">
                                                <input type="number" value={item.qty} onChange={e => updateItem(idx, 'qty', parseFloat(e.target.value) || 0)}
                                                    className="w-full border-none bg-transparent focus:ring-0 text-right text-sm dark:text-white" min="0.01" step="0.01" required />
                                            </td>
                                            <td className="p-2">
                                                <input type="number" value={item.price} onChange={e => updateItem(idx, 'price', parseFloat(e.target.value) || 0)}
                                                    className="w-full border-none bg-transparent focus:ring-0 text-right text-sm dark:text-white font-mono" placeholder="0" required />
                                            </td>
                                            <td className="p-2 text-right font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                                                {(item.qty * item.price).toLocaleString('id-ID')}
                                            </td>
                                            <td className="p-2 text-center">
                                                <button type="button" onClick={() => removeItem(idx)} className="text-neutral-400 hover:text-red-500 transition-colors">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-indigo-50/30 font-bold dark:bg-indigo-900/10">
                                    <tr>
                                        <td colSpan={8} className="px-4 py-4 text-right text-xs uppercase tracking-wider text-neutral-500">Total Estimasi Keseluruhan</td>
                                        <td className="px-4 py-4 text-right text-indigo-600 dark:text-indigo-400 text-lg tabular-nums">
                                            Rp {totalAmount.toLocaleString('id-ID')}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Attachments */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                         <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Lampiran / Dokumen Pendukung (Opsional)</h3>
                         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {data.attachments.map((file, idx) => (
                                <div key={idx} className="group relative flex items-center gap-3 rounded-xl border border-neutral-200 p-3 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                    {filePreviews[idx] ? (
                                        <img src={filePreviews[idx]} alt="preview" className="h-10 w-10 rounded-lg object-cover" />
                                    ) : (
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                            <FileText className="h-5 w-5 text-neutral-400" />
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-[10px] font-bold text-neutral-900 dark:text-white">{file.name}</p>
                                        <p className="text-[8px] text-neutral-500">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                    <button type="button" onClick={() => removeFile(idx)} className="text-neutral-400 hover:text-red-500">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            <label className="flex h-[66px] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-neutral-200 hover:border-indigo-400 hover:bg-indigo-50/50 dark:border-neutral-800 transition-all">
                                <Plus className="h-5 w-5 text-neutral-400" />
                                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-tighter">Tambah Berkas</span>
                                <input type="file" multiple className="hidden" onChange={handleFileChange} />
                            </label>
                         </div>
                         <div className="mt-4 flex items-center gap-2 text-[10px] text-neutral-400">
                             <Info className="h-3 w-3" /> Bukti penawaran, foto material, atau dokumen pendukung lainnya.
                         </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                        <button
                            type="submit"
                            disabled={processing || !hasSignature}
                            className="rounded-xl bg-indigo-600 px-10 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
                        >
                            {processing ? 'Memproses...' : 'Kirim Pengajuan MSR'}
                        </button>
                        <Link href="/msr" className="px-6 py-3 text-sm font-medium text-neutral-600 transition-all hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
