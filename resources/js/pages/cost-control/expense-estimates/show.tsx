import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Edit, Trash2, Download, FileText, Upload, X, CheckSquare, Square } from 'lucide-react';
import { useState, FormEventHandler, useRef } from 'react';

interface Props {
    estimate: any;
    workingLocations: { id: number; name: string }[];
    canEditCC: boolean;
    canEditFinance: boolean;
}

const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const FASES = ['Fase 1','Fase 2','Fase 3','Fase 4','Fase 5'];
const STATUSES = ['Pending','Paid','Next Phase','Rejected'];
const fmt = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('id-ID') : '-';

export default function ExpenseEstimateShow({ estimate, workingLocations, canEditCC, canEditFinance }: Props) {
    const [addOpen, setAddOpen] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);
    const [payItem, setPayItem] = useState<any>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [uploadLetterId, setUploadLetterId] = useState<number | null>(null);
    const [generateOpen, setGenerateOpen] = useState(false);
    const [customTotalAmount, setCustomTotalAmount] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    const items: any[] = estimate.items || [];
    const letters: any[] = estimate.letters || [];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Cost Control', href: '#' },
        { title: 'Estimasi Pengeluaran', href: '/cost-control/expense-estimates' },
        { title: `${MONTHS[estimate.month - 1]} ${estimate.year} — ${estimate.company?.code}`, href: '#' },
    ];

    // Add item form
    const addForm = useForm({
        uraian_penggunaan: '', working_location_id: '', fase_pembayaran: 'Fase 1',
        tanggal_jatuh_tempo: '', nominal: '', status: 'Pending', keterangan: '',
    });
    const handleAdd: FormEventHandler = (e) => {
        e.preventDefault();
        addForm.post(`/cost-control/expense-estimates/${estimate.id}/items`, { onSuccess: () => { setAddOpen(false); addForm.reset(); } });
    };

    // Edit item form
    const editForm = useForm({
        uraian_penggunaan: '', working_location_id: '', fase_pembayaran: 'Fase 1',
        tanggal_jatuh_tempo: '', nominal: '', status: 'Pending', keterangan: '',
    });
    const openEdit = (item: any) => {
        editForm.setData({
            uraian_penggunaan: item.uraian_penggunaan, working_location_id: item.working_location_id?.toString() || '',
            fase_pembayaran: item.fase_pembayaran, tanggal_jatuh_tempo: item.tanggal_jatuh_tempo?.split('T')[0] || '',
            nominal: item.nominal, status: item.status, keterangan: item.keterangan || '',
        });
        setEditItem(item);
    };
    const handleEdit: FormEventHandler = (e) => {
        e.preventDefault();
        editForm.put(`/cost-control/expense-estimate-items/${editItem.id}`, { onSuccess: () => setEditItem(null) });
    };

    // Payment form (Finance)
    const payForm = useForm({ tanggal_bayar: '', nominal_dibayarkan: '', status: 'Pending' });
    const openPay = (item: any) => {
        const defaultDate = item.tanggal_bayar?.split('T')[0] || new Date().toLocaleDateString('en-CA');
        const defaultNominal = item.nominal_dibayarkan || item.nominal;
        payForm.setData({ tanggal_bayar: defaultDate, nominal_dibayarkan: defaultNominal, status: parseFloat(defaultNominal) === parseFloat(item.nominal) ? 'Paid' : item.status });
        setPayItem(item);
    };
    const handlePay: FormEventHandler = (e) => {
        e.preventDefault();
        payForm.put(`/cost-control/expense-estimate-items/${payItem.id}/payment`, { onSuccess: () => setPayItem(null) });
    };

    // Selection
    const toggleSelect = (id: number) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    const toggleAll = () => setSelectedIds(selectedIds.length === items.length ? [] : items.map((i: any) => i.id));
    const selectedTotal = items.filter((i: any) => selectedIds.includes(i.id)).reduce((s: number, i: any) => s + parseFloat(i.nominal), 0);

    const handleGenerate = () => {
        if (selectedIds.length === 0) return alert('Pilih item terlebih dahulu.');
        setCustomTotalAmount(selectedTotal.toString());
        setGenerateOpen(true);
    };

    const submitGenerate: FormEventHandler = (e) => {
        e.preventDefault();
        router.post(`/cost-control/expense-estimates/${estimate.id}/generate-letter`, { selected_item_ids: selectedIds, custom_total_amount: customTotalAmount }, { onSuccess: () => setGenerateOpen(false) });
    };

    // Upload
    const handleUpload = (letterId: number) => {
        const input = fileRef.current;
        if (!input?.files?.length) return;
        const formData = new FormData();
        Array.from(input.files).forEach(f => formData.append('files[]', f));
        router.post(`/cost-control/expense-estimate-letters/${letterId}/upload`, formData, { forceFormData: true, onSuccess: () => { setUploadLetterId(null); if (input) input.value = ''; } });
    };

    const statusColor = (s: string) => s === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' : s === 'Next Phase' ? 'bg-amber-50 text-amber-700 border-amber-200' : s === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-neutral-50 text-neutral-600 border-neutral-200';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Estimasi ${MONTHS[estimate.month - 1]} ${estimate.year}`} />
            <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => router.get('/cost-control/expense-estimates')}><ArrowLeft className="w-5 h-5" /></Button>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-600" /> {MONTHS[estimate.month - 1]} {estimate.year}
                            </h1>
                            <p className="text-sm text-neutral-500">{estimate.company?.code} — {estimate.company?.name}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {canEditFinance && selectedIds.length > 0 && (
                            <Button className="bg-indigo-600 hover:bg-indigo-700 flex-1 sm:flex-none" onClick={handleGenerate}>
                                <FileText className="w-4 h-4 mr-1.5" /> Buat Surat ({selectedIds.length} item — {fmt(selectedTotal)})
                            </Button>
                        )}
                        <Button variant="outline" onClick={() => window.open(`/cost-control/expense-estimates/${estimate.id}/report-pdf`, '_blank')} className="flex-1 sm:flex-none"><Download className="w-4 h-4 mr-1.5" /> Laporan PDF</Button>
                        {canEditCC && <Button variant="outline" onClick={() => setAddOpen(true)} className="flex-1 sm:flex-none"><Plus className="w-4 h-4 mr-1.5" /> Tambah Item</Button>}
                    </div>
                </div>

                {/* Items Section */}
                <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
                    <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                        <h2 className="font-bold text-lg">Daftar Item</h2>
                        <span className="text-sm text-neutral-500">{items.length} item(s) — Total: {fmt(items.reduce((s: number, i: any) => s + parseFloat(i.nominal), 0))}</span>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-neutral-50 dark:bg-neutral-950">
                                <TableRow>
                                    {canEditFinance && <TableHead className="w-10"><button onClick={toggleAll}>{selectedIds.length === items.length && items.length > 0 ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4" />}</button></TableHead>}
                                    <TableHead>Uraian</TableHead>
                                    <TableHead>Lokasi</TableHead>
                                    <TableHead>Fase</TableHead>
                                    <TableHead>Jatuh Tempo</TableHead>
                                    <TableHead className="text-right">Nominal</TableHead>
                                    <TableHead>Tgl Bayar</TableHead>
                                    <TableHead className="text-right">Dibayarkan</TableHead>
                                    <TableHead className="text-right">Sisa</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.length === 0 ? (
                                    <TableRow><TableCell colSpan={11} className="text-center py-10 text-neutral-500 italic">Belum ada item.</TableCell></TableRow>
                                ) : items.map((item: any) => (
                                    <TableRow key={item.id} className={selectedIds.includes(item.id) ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''}>
                                        {canEditFinance && <TableCell><button onClick={() => toggleSelect(item.id)}>{selectedIds.includes(item.id) ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4 text-neutral-400" />}</button></TableCell>}
                                        <TableCell className="max-w-[200px]"><p className="text-sm font-medium truncate">{item.uraian_penggunaan}</p>{item.keterangan && <p className="text-xs text-neutral-400 truncate">{item.keterangan}</p>}</TableCell>
                                        <TableCell className="text-sm">{item.working_location?.name || '-'}</TableCell>
                                        <TableCell><Badge variant="outline" className="text-xs">{item.fase_pembayaran}</Badge></TableCell>
                                        <TableCell className="text-sm">{fmtDate(item.tanggal_jatuh_tempo)}</TableCell>
                                        <TableCell className="text-right font-mono text-sm font-bold">{fmt(parseFloat(item.nominal))}</TableCell>
                                        <TableCell className="text-sm">{fmtDate(item.tanggal_bayar)}</TableCell>
                                        <TableCell className="text-right font-mono text-sm text-green-600">{fmt(parseFloat(item.nominal_dibayarkan))}</TableCell>
                                        <TableCell className="text-right font-mono text-sm text-red-600">{fmt(item.sisa_pembayaran)}</TableCell>
                                        <TableCell><Badge variant="outline" className={statusColor(item.status)}>{item.status}</Badge></TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                {canEditCC && <Button variant="ghost" size="sm" onClick={() => openEdit(item)}><Edit className="w-3.5 h-3.5" /></Button>}
                                                {canEditFinance && <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => openPay(item)}>💰</Button>}
                                                {canEditCC && <Button variant="ghost" size="sm" className="text-red-600" onClick={() => { if (confirm('Hapus item ini?')) router.delete(`/cost-control/expense-estimate-items/${item.id}`); }}><Trash2 className="w-3.5 h-3.5" /></Button>}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="lg:hidden p-4 space-y-3">
                        {items.length === 0 ? (
                            <p className="text-center text-neutral-500 italic py-6">Belum ada item.</p>
                        ) : items.map((item: any) => (
                            <div key={item.id} className={`rounded-lg border p-4 ${selectedIds.includes(item.id) ? 'border-indigo-300 bg-indigo-50/50' : 'border-neutral-100 dark:border-neutral-800'}`}>
                                <div className="flex items-start gap-3">
                                    {canEditFinance && <button className="mt-0.5" onClick={() => toggleSelect(item.id)}>{selectedIds.includes(item.id) ? <CheckSquare className="w-5 h-5 text-indigo-600" /> : <Square className="w-5 h-5 text-neutral-400" />}</button>}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm">{item.uraian_penggunaan}</p>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <Badge variant="outline" className="text-[10px]">{item.fase_pembayaran}</Badge>
                                            <Badge variant="outline" className={`text-[10px] ${statusColor(item.status)}`}>{item.status}</Badge>
                                            <span className="text-xs text-neutral-400">{item.working_location?.name || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                                    <div><span className="text-neutral-400">Nominal</span><p className="font-mono font-bold">{fmt(parseFloat(item.nominal))}</p></div>
                                    <div><span className="text-neutral-400">Dibayar</span><p className="font-mono text-green-600">{fmt(parseFloat(item.nominal_dibayarkan))}</p></div>
                                    <div><span className="text-neutral-400">Sisa</span><p className="font-mono text-red-600">{fmt(item.sisa_pembayaran)}</p></div>
                                </div>
                                <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                                    <span className="text-xs text-neutral-400">JT: {fmtDate(item.tanggal_jatuh_tempo)}</span>
                                    <div className="flex gap-1">
                                        {canEditCC && <Button variant="ghost" size="sm" className="h-7" onClick={() => openEdit(item)}><Edit className="w-3.5 h-3.5" /></Button>}
                                        {canEditFinance && <Button variant="ghost" size="sm" className="h-7 text-blue-600" onClick={() => openPay(item)}>💰</Button>}
                                        {canEditCC && <Button variant="ghost" size="sm" className="h-7 text-red-600" onClick={() => { if (confirm('Hapus?')) router.delete(`/cost-control/expense-estimate-items/${item.id}`); }}><Trash2 className="w-3.5 h-3.5" /></Button>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Letters Section */}
                {letters.length > 0 && (
                    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800">
                            <h2 className="font-bold text-lg">Surat Permohonan Peminjaman Dana</h2>
                        </div>
                        <div className="p-4 sm:p-5 space-y-4">
                            {letters.map((ltr: any) => (
                                <div key={ltr.id} className="rounded-lg border border-neutral-100 dark:border-neutral-800 p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div>
                                            <p className="font-bold font-mono">{ltr.letter_number}</p>
                                            <p className="text-sm text-neutral-500">Total: {fmt(parseFloat(ltr.total_amount))} — {fmtDate(ltr.date)} — oleh {ltr.maker?.nama}</p>
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            <Button variant="outline" size="sm" onClick={() => window.open(`/cost-control/expense-estimate-letters/${ltr.id}/pdf`, '_blank')}><Download className="w-3.5 h-3.5 mr-1" /> PDF</Button>
                                            <Button variant="outline" size="sm" onClick={() => setUploadLetterId(ltr.id)}><Upload className="w-3.5 h-3.5 mr-1" /> Upload Signed</Button>
                                            {canEditCC && (!ltr.files || ltr.files.length === 0) && (
                                                <Button variant="ghost" size="sm" className="text-red-600" onClick={() => { if (confirm('Hapus surat ini?')) router.delete(`/cost-control/expense-estimate-letters/${ltr.id}`); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                                            )}
                                        </div>
                                    </div>
                                    {/* Uploaded files */}
                                    {ltr.files?.length > 0 && (
                                        <div className="mt-3 space-y-1">
                                            <p className="text-xs font-medium text-neutral-500">File Tertandatangani:</p>
                                            {ltr.files.map((f: any) => (
                                                <div key={f.id} className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-800 rounded px-3 py-1.5">
                                                    <a href={`/storage/${f.file_path}`} target="_blank" className="text-sm text-indigo-600 hover:underline truncate">{f.original_name}</a>
                                                    {canEditCC && <Button variant="ghost" size="sm" className="h-6 text-red-500" onClick={() => { if (confirm('Hapus file?')) router.delete(`/cost-control/expense-estimate-letter-files/${f.id}`); }}><X className="w-3 h-3" /></Button>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {/* Upload modal inline */}
                                    {uploadLetterId === ltr.id && (
                                        <div className="mt-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                            <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="text-sm" />
                                            <div className="flex gap-2 mt-2">
                                                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => handleUpload(ltr.id)}>Upload</Button>
                                                <Button size="sm" variant="outline" onClick={() => setUploadLetterId(null)}>Batal</Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Add Item Dialog */}
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader><DialogTitle>Tambah Item</DialogTitle></DialogHeader>
                    <form onSubmit={handleAdd} className="space-y-4 pt-2">
                        <div className="space-y-2"><Label>Uraian Penggunaan</Label><Textarea value={addForm.data.uraian_penggunaan} onChange={e => addForm.setData('uraian_penggunaan', e.target.value)} className="min-h-[80px]" /></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Working Location</Label><Select value={addForm.data.working_location_id} onValueChange={v => addForm.setData('working_location_id', v)}><SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger><SelectContent>{workingLocations.map(l => <SelectItem key={l.id} value={l.id.toString()}>{l.name}</SelectItem>)}</SelectContent></Select></div>
                            <div className="space-y-2"><Label>Fase Pembayaran</Label><Select value={addForm.data.fase_pembayaran} onValueChange={v => addForm.setData('fase_pembayaran', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{FASES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Tanggal Jatuh Tempo</Label><Input type="date" value={addForm.data.tanggal_jatuh_tempo} onChange={e => addForm.setData('tanggal_jatuh_tempo', e.target.value)} /></div>
                            <div className="space-y-2"><Label>Nominal</Label><Input type="number" value={addForm.data.nominal} onChange={e => addForm.setData('nominal', e.target.value)} /></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Status</Label><Select value={addForm.data.status} onValueChange={v => addForm.setData('status', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
                        </div>
                        <div className="space-y-2"><Label>Keterangan</Label><Textarea value={addForm.data.keterangan} onChange={e => addForm.setData('keterangan', e.target.value)} className="min-h-[60px]" /></div>
                        <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Batal</Button><Button type="submit" disabled={addForm.processing} className="bg-indigo-600 hover:bg-indigo-700">Simpan</Button></div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Item Dialog */}
            <Dialog open={!!editItem} onOpenChange={(o) => { if (!o) setEditItem(null); }}>
                <DialogContent className="max-w-lg">
                    <DialogHeader><DialogTitle>Edit Item</DialogTitle></DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4 pt-2">
                        <div className="space-y-2"><Label>Uraian Penggunaan</Label><Textarea value={editForm.data.uraian_penggunaan} onChange={e => editForm.setData('uraian_penggunaan', e.target.value)} className="min-h-[80px]" /></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Working Location</Label><Select value={editForm.data.working_location_id} onValueChange={v => editForm.setData('working_location_id', v)}><SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger><SelectContent>{workingLocations.map(l => <SelectItem key={l.id} value={l.id.toString()}>{l.name}</SelectItem>)}</SelectContent></Select></div>
                            <div className="space-y-2"><Label>Fase Pembayaran</Label><Select value={editForm.data.fase_pembayaran} onValueChange={v => editForm.setData('fase_pembayaran', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{FASES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Tanggal Jatuh Tempo</Label><Input type="date" value={editForm.data.tanggal_jatuh_tempo} onChange={e => editForm.setData('tanggal_jatuh_tempo', e.target.value)} /></div>
                            <div className="space-y-2"><Label>Nominal</Label><Input type="number" value={editForm.data.nominal} onChange={e => editForm.setData('nominal', e.target.value)} /></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Status</Label><Select value={editForm.data.status} onValueChange={v => editForm.setData('status', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
                        </div>
                        <div className="space-y-2"><Label>Keterangan</Label><Textarea value={editForm.data.keterangan} onChange={e => editForm.setData('keterangan', e.target.value)} className="min-h-[60px]" /></div>
                        <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="outline" onClick={() => setEditItem(null)}>Batal</Button><Button type="submit" disabled={editForm.processing} className="bg-indigo-600 hover:bg-indigo-700">Update</Button></div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Payment Dialog (Finance) */}
            <Dialog open={!!payItem} onOpenChange={(o) => { if (!o) setPayItem(null); }}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Update Pembayaran</DialogTitle></DialogHeader>
                    <form onSubmit={handlePay} className="space-y-4 pt-2">
                        <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"><p className="text-sm font-medium">{payItem?.uraian_penggunaan}</p><p className="text-xs text-neutral-500 mt-1">Nominal: {fmt(parseFloat(payItem?.nominal || 0))}</p></div>
                        <div className="space-y-2"><Label>Tanggal Bayar</Label><Input type="date" value={payForm.data.tanggal_bayar} onChange={e => payForm.setData('tanggal_bayar', e.target.value)} /></div>
                        <div className="space-y-2"><Label>Nominal Dibayarkan</Label><Input type="number" value={payForm.data.nominal_dibayarkan} onChange={e => {
                            const val = e.target.value;
                            const isPaid = parseFloat(val) === parseFloat(payItem?.nominal);
                            payForm.setData(d => ({ ...d, nominal_dibayarkan: val, status: isPaid ? 'Paid' : (d.status === 'Paid' ? 'Pending' : d.status) }));
                        }} /></div>
                        <div className="space-y-2"><Label>Status</Label><Select value={payForm.data.status} onValueChange={v => payForm.setData('status', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s} disabled={s === 'Paid' && parseFloat(payForm.data.nominal_dibayarkan) !== parseFloat(payItem?.nominal)}>{s}</SelectItem>)}</SelectContent></Select></div>
                        <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="outline" onClick={() => setPayItem(null)}>Batal</Button><Button type="submit" disabled={payForm.processing} className="bg-indigo-600 hover:bg-indigo-700">Simpan</Button></div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Generate Letter Dialog */}
            <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Generate Surat Peminjaman</DialogTitle></DialogHeader>
                    <form onSubmit={submitGenerate} className="space-y-4 pt-2">
                        <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                            <p className="text-sm font-medium">{selectedIds.length} Item Terpilih</p>
                            <p className="text-xs text-neutral-500 mt-1">Total Nominal Asli: {fmt(selectedTotal)}</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Custom Total Amount (Opsional)</Label>
                            <Input type="number" value={customTotalAmount} onChange={e => setCustomTotalAmount(e.target.value)} placeholder={selectedTotal.toString()} />
                            <p className="text-xs text-neutral-500">Nominal ini akan tertera pada surat PDF.</p>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => setGenerateOpen(false)}>Batal</Button>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Generate PDF</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
