import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ExternalLink, Plus, Trash2, FileText, AlertCircle, ShoppingCart } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, WorkLocation, Department, WorkingLocation } from '@/types';
import { useState, useEffect } from 'react';

interface Props {
    companies: WorkLocation[];
    departments: Department[];
    workingLocations: WorkingLocation[];
    subjects: string[];
    previousItems: string[];
    banks: string[];
}

export default function PaymentRequestForm() {
    const { companies, departments, workingLocations, subjects, previousItems, banks } = usePage<{ props: Props }>().props as unknown as Props;
    const { auth } = usePage().props as any;
    const employee = auth.user.employee;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Payment Request', href: '/payment-requests' },
        { title: 'Buat Pengajuan', href: '#' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        date: new Date().toISOString().substring(0, 10),
        company_id: '',
        working_location_id: '',
        department_id: employee?.department_id?.toString() ?? '',
        subject: '',
        description: '',
        paid_to: '',
        bank_name: '',
        bank_account: '',
        notes: '',
        attachments: [] as File[],
        items: [{ description: '', unit: 'Pcs', qty: 1, price: 0 }],
    });

    const [filePreviews, setFilePreviews] = useState<string[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const sum = data.items.reduce((acc, item) => acc + (item.qty * item.price || 0), 0);
        setTotalAmount(sum);
    }, [data.items]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setData('attachments', [...data.attachments, ...newFiles]);
            
            const newPreviews = newFiles.map(file => {
                if (file.type.startsWith('image/')) {
                    return URL.createObjectURL(file);
                }
                return '';
            });
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
        setData('items', [...data.items, { description: '', unit: 'Pcs', qty: 1, price: 0 }]);
    };

    const removeItem = (index: number) => {
        if (data.items.length === 1) return;
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/payment-requests');
    };

    const hasSignature = !!employee?.signature;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Payment Request" />

            <div className="mx-auto max-w-5xl px-4 py-4 sm:p-6">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl font-bold text-blue-600">Buat Payment Request</h1>
                    <p className="text-xs sm:text-sm text-neutral-500 mt-1">Isi formulir di bawah untuk mengajukan pembayaran baru.</p>
                </div>

                {!hasSignature && (
                    <div className="mb-6 flex items-start gap-3 sm:gap-4 rounded-xl border border-red-200 bg-red-50 p-3 sm:p-4 dark:border-red-900/30 dark:bg-red-900/20">
                        <AlertCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                        <div>
                            <h3 className="font-semibold text-red-800 dark:text-red-300 text-sm">Tanda Tangan Diperlukan</h3>
                            <p className="mt-1 text-xs sm:text-sm text-red-700 dark:text-red-400">
                                Anda belum mengatur tanda tangan digital. Harap atur di halaman <Link href="/profile" className="font-bold underline hover:text-red-900">Profil</Link> sebelum melanjutkan.
                            </p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                    <div className="grid gap-4 sm:gap-6 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                             <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Tanggal Pengajuan <span className="text-red-500">*</span></label>
                                <input type="date" value={data.date} onChange={e => setData('date', e.target.value)} 
                                    className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2.5 sm:py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" required />
                                {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Perusahaan <span className="text-red-500">*</span></label>
                                <select value={data.company_id} onChange={e => setData('company_id', e.target.value)} 
                                    className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2.5 sm:py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" required>
                                    <option value="">Pilih Perusahaan</option>
                                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                {errors.company_id && <p className="mt-1 text-xs text-red-500">{errors.company_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Penempatan <span className="text-red-500">*</span></label>
                                <select value={data.working_location_id} onChange={e => setData('working_location_id', e.target.value)} 
                                    className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2.5 sm:py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" required>
                                    <option value="">Pilih Lokasi</option>
                                    {workingLocations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                </select>
                                {errors.working_location_id && <p className="mt-1 text-xs text-red-500">{errors.working_location_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Departemen <span className="text-red-500">*</span></label>
                                <select value={data.department_id} onChange={e => setData('department_id', e.target.value)} 
                                    className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2.5 sm:py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" required>
                                    <option value="">Pilih Departemen</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                                {errors.department_id && <p className="mt-1 text-xs text-red-500">{errors.department_id}</p>}
                            </div>
                        </div>

                        <hr className="border-neutral-100 dark:border-neutral-800" />

                        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Perihal (Subject) <span className="text-red-500">*</span></label>
                                <input
                                    list="subjectList"
                                    type="text"
                                    value={data.subject}
                                    onChange={e => setData('subject', e.target.value)}
                                    placeholder="Ketik atau pilih perihal..."
                                    className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2.5 sm:py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                    required
                                />
                                <datalist id="subjectList">
                                    {subjects.map((s, i) => <option key={i} value={s} />)}
                                </datalist>
                                {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Dibayarkan Kepada <span className="text-red-500">*</span></label>
                                <input type="text" value={data.paid_to} onChange={e => setData('paid_to', e.target.value)} placeholder="Nama vendor / perorangan"
                                    className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2.5 sm:py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" required />
                                {errors.paid_to && <p className="mt-1 text-xs text-red-500">{errors.paid_to}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Keterangan / Deskripsi <span className="text-red-500">*</span></label>
                            <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={2} placeholder="Detail ringkas pengajuan..."
                                className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2.5 sm:py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" required />
                            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                                    <ShoppingCart className="h-4 w-4" /> Item Pembayaran
                                </h3>
                                <button type="button" onClick={addItem} className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700">
                                    <Plus className="h-4 w-4" /> Tambah Item
                                </button>
                            </div>

                            {/* Desktop Table */}
                            <div className="hidden sm:block overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
                                 <table className="w-full text-left text-sm">
                                    <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                                        <tr className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                                            <th className="px-4 py-3">Item / Deskripsi</th>
                                            <th className="w-24 px-4 py-3">Satuan</th>
                                            <th className="w-20 px-4 py-3 text-right">Qty</th>
                                            <th className="w-40 px-4 py-3 text-right">Harga Satuan</th>
                                            <th className="w-40 px-4 py-3 text-right">Total</th>
                                            <th className="w-10 px-4 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                        {data.items.map((item, idx) => (
                                            <tr key={idx} className="group hover:bg-neutral-50/50">
                                                <td className="p-2">
                                                    <input 
                                                        list="previousItems"
                                                        type="text" 
                                                        value={item.description} 
                                                        onChange={e => updateItem(idx, 'description', e.target.value)} 
                                                        className="w-full border-none bg-transparent focus:ring-0 text-sm dark:text-white" 
                                                        placeholder="Pilih atau ketik item..." 
                                                        required 
                                                    />
                                                    <datalist id="previousItems">
                                                        {previousItems.map((pi, i) => (
                                                            <option key={i} value={pi} />
                                                        ))}
                                                    </datalist>
                                                </td>
                                                <td className="p-2">
                                                    <select 
                                                        value={item.unit} 
                                                        onChange={e => updateItem(idx, 'unit', e.target.value)}
                                                        className="w-full border-none bg-white focus:ring-0 text-sm dark:bg-neutral-900 dark:text-white"
                                                    >
                                                        <option value="Pcs">Pcs</option>
                                                        <option value="Kg">Kg</option>
                                                        <option value="Box">Box</option>
                                                        <option value="Pax">Pax</option>
                                                        <option value="Liter">Liter</option>
                                                        <option value="Rim">Rim</option>
                                                        <option value="Unit">Unit</option>
                                                        <option value="Bln">Bln</option>
                                                        <option value="Sesi">Sesi</option>
                                                        <option value="Paket">Paket</option>
                                                    </select>
                                                </td>
                                                <td className="p-2 text-right">
                                                    <input 
                                                        type="number" 
                                                        value={item.qty} 
                                                        onChange={e => updateItem(idx, 'qty', parseFloat(e.target.value) || 0)}
                                                        className="w-full border-none bg-transparent focus:ring-0 text-right text-sm dark:text-white" 
                                                        min="0.01" 
                                                        step="0.01" 
                                                        required 
                                                    />
                                                </td>
                                                <td className="p-2 text-right">
                                                    <input 
                                                        type="number" 
                                                        value={item.price} 
                                                        onChange={e => updateItem(idx, 'price', parseFloat(e.target.value) || 0)}
                                                        className="w-full border-none bg-transparent focus:ring-0 text-right text-sm dark:text-white" 
                                                        placeholder="0" 
                                                        required 
                                                    />
                                                </td>
                                                <td className="p-2 text-right font-semibold text-neutral-900 dark:text-white">
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
                                    <tfoot className="bg-blue-50/50 font-bold dark:bg-blue-900/10">
                                        <tr>
                                            <td colSpan={4} className="px-4 py-3 text-right">TOTAL ESTIMASI</td>
                                            <td className="px-4 py-3 text-right text-blue-600 dark:text-blue-400 text-lg">
                                                Rp {totalAmount.toLocaleString('id-ID')}
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="sm:hidden space-y-3">
                                {data.items.map((item, idx) => (
                                    <div key={idx} className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-800/30 space-y-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Item #{idx + 1}</label>
                                                <input 
                                                    list="previousItems"
                                                    type="text" 
                                                    value={item.description} 
                                                    onChange={e => updateItem(idx, 'description', e.target.value)} 
                                                    className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" 
                                                    placeholder="Nama item..." 
                                                    required 
                                                />
                                            </div>
                                            <button type="button" onClick={() => removeItem(idx)} className="mt-5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-500 transition-colors dark:hover:bg-red-900/30">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div>
                                                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Satuan</label>
                                                <select 
                                                    value={item.unit} 
                                                    onChange={e => updateItem(idx, 'unit', e.target.value)}
                                                    className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-2 py-2 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                                >
                                                    <option value="Pcs">Pcs</option>
                                                    <option value="Kg">Kg</option>
                                                    <option value="Box">Box</option>
                                                    <option value="Pax">Pax</option>
                                                    <option value="Liter">Liter</option>
                                                    <option value="Rim">Rim</option>
                                                    <option value="Unit">Unit</option>
                                                    <option value="Bln">Bln</option>
                                                    <option value="Sesi">Sesi</option>
                                                    <option value="Paket">Paket</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Qty</label>
                                                <input 
                                                    type="number" 
                                                    value={item.qty} 
                                                    onChange={e => updateItem(idx, 'qty', parseFloat(e.target.value) || 0)}
                                                    className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-2 py-2 text-right text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" 
                                                    min="0.01" 
                                                    step="0.01" 
                                                    required 
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Harga</label>
                                                <input 
                                                    type="number" 
                                                    value={item.price} 
                                                    onChange={e => updateItem(idx, 'price', parseFloat(e.target.value) || 0)}
                                                    className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-2 py-2 text-right text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" 
                                                    placeholder="0" 
                                                    required 
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg bg-blue-50/80 px-3 py-2 dark:bg-blue-900/20">
                                            <span className="text-[10px] font-bold uppercase text-neutral-500">Subtotal</span>
                                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Rp {(item.qty * item.price).toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                ))}

                                {/* Mobile Total */}
                                <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-900/20">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400">Total Estimasi</span>
                                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">Rp {totalAmount.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Nama Bank <span className="text-red-500">*</span></label>
                                <select value={data.bank_name} onChange={e => setData('bank_name', e.target.value)} 
                                    className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2.5 sm:py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" required>
                                    <option value="">Pilih Bank</option>
                                    {banks.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                                {errors.bank_name && <p className="mt-1 text-xs text-red-500">{errors.bank_name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Nomor Rekening</label>
                                <input type="text" value={data.bank_account} onChange={e => setData('bank_account', e.target.value)} placeholder="00011223344"
                                    className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2.5 sm:py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
                                {errors.bank_account && <p className="mt-1 text-xs text-red-500">{errors.bank_account}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Catatan Tambahan</label>
                            <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} rows={2} placeholder="Catatan internal..."
                                className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2.5 sm:py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                         <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Lampiran / Dokumen Pendukung <span className="text-red-500">* (Min. 1)</span></h3>
                         <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {data.attachments.map((file, idx) => (
                                <div key={idx} className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-neutral-200 p-3 dark:border-neutral-800 transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                    {filePreviews[idx] ? (
                                        <img src={filePreviews[idx]} alt="preview" className="h-12 w-12 rounded-lg object-cover" />
                                    ) : (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                            <FileText className="h-6 w-6 text-neutral-400" />
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-semibold text-neutral-900 dark:text-white">{file.name}</p>
                                        <p className="text-[10px] text-neutral-500">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(idx)}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            <label className="flex h-[74px] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-neutral-200 transition-colors hover:border-blue-400 hover:bg-blue-50/50 dark:border-neutral-800 dark:hover:border-blue-600 dark:hover:bg-blue-900/10">
                                <Plus className="h-5 w-5 text-neutral-400" />
                                <span className="text-xs font-medium text-neutral-500">Tambah File</span>
                                <input type="file" multiple className="hidden" onChange={handleFileChange} />
                            </label>
                         </div>
                         {errors.attachments && <p className="mt-2 text-xs text-red-500">{errors.attachments}</p>}
                    </div>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:gap-4 pb-4 sm:pb-0 pt-2 sm:pt-6">
                        <button
                            type="submit"
                            disabled={processing || !hasSignature}
                            className="w-full sm:w-auto rounded-xl bg-blue-600 px-10 py-3.5 sm:py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                        >
                            {processing ? 'Mengirim...' : 'Kirim Pengajuan'}
                        </button>
                        <Link href="/payment-requests" className="w-full sm:w-auto text-center rounded-xl px-6 py-3.5 sm:py-3 text-sm font-medium text-neutral-600 transition-all hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800">
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
