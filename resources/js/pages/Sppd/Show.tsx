import { Head, router, useForm, usePage } from '@inertiajs/react';
import { 
    FileText, Download, ArrowLeft, User, Calendar, 
    MapPin, Plus, Trash2, CheckCircle2, Clock, Upload, 
    FileCheck, ExternalLink, Briefcase
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { useState, FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SppdItem {
    id: number;
    hal: string;
    description: string;
    qty: number;
    price: number;
    total_price: number;
}

interface Sppd {
    id: number;
    letter_number: string;
    tujuan: string;
    tanggal_berangkat: string;
    tanggal_kembali: string;
    maksud_perjalanan_dinas: string;
    status: string;
    total_amount: number;
    signed_pdf_path: string | null;
    maker_id: number;
    employees: {
        id: number;
        nama: string;
        position?: { name: string };
        signature?: string;
    }[];
    external_employees?: string[];
    work_location?: {
        name: string;
        code: string;
    };
    requester: {
        id: number;
        nama: string;
        position?: { name: string };
    };
    maker: {
        id: number;
        nama: string;
        position?: { name: string };
        signature?: string;
    };
    items: SppdItem[];
}

interface Props {
    sppd: Sppd;
    previousDescriptions: string[];
}

export default function SppdShow({ sppd, previousDescriptions }: Props) {
    const { auth } = usePage<any>().props;
    const canManage = auth.user.role === 'admin' || auth.user.can?.includes('sppd.edit') || auth.user.employee?.id === sppd.maker_id;
    const canUpload = auth.user.role === 'admin' || auth.user.can?.includes('sppd.upload_signed');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Menu Saya', href: '#' },
        { title: 'Form SPPD', href: '/sppd' },
        { title: 'Detail SPPD', href: '#' },
    ];

    const { data: itemData, setData: setItemData, post: postItem, processing: itemProcessing, reset: resetItem } = useForm({
        hal: '',
        description: '',
        qty: 1,
        price: 0,
    });

    const { data: uploadData, setData: setUploadData, post: postUpload, processing: uploadProcessing } = useForm({
        signed_pdf: null as File | null,
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const handleAddItem: FormEventHandler = (e) => {
        e.preventDefault();
        postItem(`/sppd/${sppd.id}/items`, {
            onSuccess: () => resetItem(),
        });
    };

    const handleRemoveItem = (id: number) => {
        if (confirm('Hapus item itinerary ini?')) {
            router.delete(`/sppd/items/${id}`);
        }
    };

    const handleUploadSigned: FormEventHandler = (e) => {
        e.preventDefault();
        if (!uploadData.signed_pdf) return;
        postUpload(`/sppd/${sppd.id}/upload-signed`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`SPPD - ${sppd.letter_number}`} />

            <div className="mx-auto max-w-6xl px-6 py-8">
                {/* Header Section */}
                <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="rounded-full h-10 w-10 shadow-sm"
                            onClick={() => router.get('/sppd')}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white uppercase tracking-tight">{sppd.letter_number}</h1>
                                {sppd.status === 'signed' ? (
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Signed</Badge>
                                ) : (
                                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Draft</Badge>
                                )}
                            </div>
                            <p className="text-sm text-neutral-500 font-medium">Dibuat oleh {sppd.maker.nama}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            variant="outline" 
                            className="h-11 shadow-sm"
                            onClick={() => window.open(`/sppd/${sppd.id}/pdf`, '_blank')}
                        >
                            <Download className="h-4 w-4 mr-2" /> Download Draft PDF
                        </Button>
                        {sppd.signed_pdf_path && (
                            <Button 
                                variant="default" 
                                className="h-11 bg-green-600 hover:bg-green-700 shadow-sm"
                                onClick={() => window.open(`/storage/${sppd.signed_pdf_path}`, '_blank')}
                            >
                                <FileCheck className="h-4 w-4 mr-2" /> Lihat PDF Ter-Tanda Tangan
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Information Card */}
                        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
                            <div className="border-b border-neutral-100 bg-neutral-50/50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Informasi Dasar SPPD</h3>
                            </div>
                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase text-neutral-400">Yang Ditugaskan</p>
                                                {sppd.employees.map(emp => (
                                                    <div key={emp.id} className="mb-1">
                                                        <p className="font-bold text-neutral-900 dark:text-white">{emp.nama}</p>
                                                        <p className="text-[10px] text-neutral-500">{emp.position?.name || '-'}</p>
                                                    </div>
                                                ))}
                                                {sppd.external_employees?.map((name, i) => (
                                                    <div key={`ext-${i}`} className="mb-1">
                                                        <p className="font-bold text-neutral-900 dark:text-white">{name}</p>
                                                        <p className="text-[10px] text-neutral-500">External</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                                                <Briefcase className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase text-neutral-400">Atas Permintaan</p>
                                                <p className="font-semibold text-neutral-700">{sppd.requester.nama}</p>
                                                <p className="text-xs text-neutral-500">{sppd.requester.position?.name || '-'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                <MapPin className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase text-neutral-400">Tujuan & Waktu</p>
                                                <p className="font-bold text-neutral-900">{sppd.tujuan}</p>
                                                <p className="text-xs text-neutral-500">
                                                    {new Date(sppd.tanggal_berangkat).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} - {new Date(sppd.tanggal_kembali).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase text-neutral-400">Maksud Perjalanan</p>
                                                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed italic">"{sppd.maksud_perjalanan_dinas}"</p>
                                            </div>
                                        </div>
                                        {sppd.work_location && (
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                                                    <Briefcase className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase text-neutral-400">Letterhead (Kop Surat)</p>
                                                    <p className="font-bold text-neutral-900 dark:text-white">{sppd.work_location.name}</p>
                                                    <p className="text-[10px] text-neutral-500">{sppd.work_location.code}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Itinerary Table */}
                        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
                            <div className="border-b border-neutral-100 bg-neutral-50/50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Rincian Biaya (Itinerary)</h3>
                            </div>
                            <div className="p-0">
                                {/* Add Item Form (Moved Above Table) */}
                                {canManage && (
                                    <div className="p-6 bg-neutral-50/30 border-b border-neutral-100 dark:border-neutral-800">
                                        <h4 className="text-xs font-bold uppercase text-neutral-500 mb-4 flex items-center gap-2">
                                            <Plus className="w-3 h-3" /> Tambah Item Itinerary
                                        </h4>
                                        <form onSubmit={handleAddItem} className="grid grid-cols-12 gap-3 items-end">
                                            <div className="space-y-2 col-span-12 md:col-span-3">
                                                <Label className="text-[10px] font-bold uppercase text-neutral-400 ml-1">Hal</Label>
                                                <Select value={itemData.hal} onValueChange={v => setItemData('hal', v)}>
                                                    <SelectTrigger className="h-10 bg-white dark:bg-neutral-900 w-full truncate">
                                                        <SelectValue placeholder="Pilih..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Transportasi & Tiket">Transportasi & Tiket</SelectItem>
                                                        <SelectItem value="Lodging">Lodging</SelectItem>
                                                        <SelectItem value="Uang Makan">Uang Makan</SelectItem>
                                                        <SelectItem value="Lain-lain">Lain-lain</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2 col-span-12 md:col-span-3">
                                                <Label className="text-[10px] font-bold uppercase text-neutral-400 ml-1">Deskripsi</Label>
                                                <Input 
                                                    value={itemData.description} 
                                                    onChange={e => setItemData('description', e.target.value)}
                                                    placeholder="e.g. Tiket Garuda JKT-BPN"
                                                    className="h-10 bg-white dark:bg-neutral-900"
                                                    list="prev-desc"
                                                />
                                                <datalist id="prev-desc">
                                                    {previousDescriptions.map(d => <option key={d} value={d} />)}
                                                </datalist>
                                            </div>
                                            <div className="space-y-2 col-span-6 md:col-span-1">
                                                <Label className="text-[10px] font-bold uppercase text-neutral-400 ml-1">Qty</Label>
                                                <Input 
                                                    type="number" 
                                                    value={itemData.qty} 
                                                    onChange={e => setItemData('qty', parseFloat(e.target.value))}
                                                    className="h-10 bg-white dark:bg-neutral-900"
                                                />
                                            </div>
                                            <div className="space-y-2 col-span-6 md:col-span-3">
                                                <Label className="text-[10px] font-bold uppercase text-neutral-400 ml-1">Harga Satuan</Label>
                                                <Input 
                                                    type="number" 
                                                    value={itemData.price} 
                                                    onChange={e => setItemData('price', parseFloat(e.target.value))}
                                                    className="h-10 bg-white dark:bg-neutral-900"
                                                />
                                            </div>
                                            <div className="col-span-12 md:col-span-2">
                                                <Button type="submit" disabled={itemProcessing} className="bg-indigo-600 hover:bg-indigo-700 h-10 w-full">
                                                    Tambah
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-neutral-50/30">
                                            <TableHead className="px-6 py-4">Hal</TableHead>
                                            <TableHead className="px-6 py-4">Deskripsi</TableHead>
                                            <TableHead className="text-center px-6 py-4">Qty</TableHead>
                                            <TableHead className="text-right px-6 py-4">Harga</TableHead>
                                            <TableHead className="text-right px-6 py-4 font-bold text-neutral-900 dark:text-neutral-100">Total</TableHead>
                                            {canManage && <TableHead className="w-10"></TableHead>}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sppd.items.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={canManage ? 6 : 5} className="text-center py-12 text-neutral-400 italic">
                                                    Belum ada rincian biaya. Tambahkan di bawah.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            sppd.items.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="px-6 py-4 font-medium">{item.hal}</TableCell>
                                                    <TableCell className="px-6 py-4 text-neutral-600">{item.description}</TableCell>
                                                    <TableCell className="text-center px-6 py-4">{item.qty}</TableCell>
                                                    <TableCell className="text-right px-6 py-4">{formatCurrency(item.price)}</TableCell>
                                                    <TableCell className="text-right px-6 py-4 font-bold text-neutral-900 dark:text-neutral-100">{formatCurrency(item.total_price)}</TableCell>
                                                    {canManage && (
                                                        <TableCell className="px-6 py-4">
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                                                                onClick={() => handleRemoveItem(item.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                    {sppd.items.length > 0 && (
                                        <tfoot>
                                            <TableRow className="bg-neutral-50/50">
                                                <TableCell colSpan={4} className="px-6 py-4 text-right font-bold uppercase text-neutral-400 text-xs">Grand Total</TableCell>
                                                <TableCell className="px-6 py-4 text-right font-bold text-indigo-600 dark:text-indigo-400 text-lg">{formatCurrency(sppd.total_amount)}</TableCell>
                                                {canManage && <TableCell></TableCell>}
                                            </TableRow>
                                        </tfoot>
                                    )}
                                </Table>

                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Signature Preview Card */}
                        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h3 className="mb-6 text-xs font-bold uppercase tracking-wider text-neutral-400">Verifikasi Tanda Tangan</h3>
                            
                            <div className="space-y-8 relative">
                                <div className="absolute left-4 top-8 h-[calc(100%-40px)] w-0.5 bg-neutral-100 dark:bg-neutral-800 -translate-x-1/2 border-dashed border-l-2" />

                                <div className="relative flex gap-4">
                                    <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 border-4 border-white">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold uppercase text-neutral-400">Pembuat (Maker)</p>
                                        <p className="text-sm font-bold text-neutral-900">{sppd.maker.nama}</p>
                                        {sppd.maker.signature ? (
                                            <div className="mt-2 h-16 w-32 border border-dashed border-neutral-200 bg-neutral-50/50 p-1 flex items-center justify-center overflow-hidden">
                                                <img src={`/storage/${sppd.maker.signature}`} alt="signature" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                                            </div>
                                        ) : (
                                            <div className="mt-2 h-16 w-32 border border-dashed border-red-200 bg-red-50/30 flex items-center justify-center">
                                                <span className="text-[10px] text-red-400 italic">No signature found</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {sppd.employees.map(emp => (
                                        <div key={emp.id} className="relative flex gap-4">
                                            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-400 border-4 border-white">
                                                <Clock className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] font-bold uppercase text-neutral-400">Pelaksana (Assigned)</p>
                                                <p className="text-sm font-bold text-neutral-900 dark:text-white">{emp.nama}</p>
                                                {emp.signature ? (
                                                    <div className="mt-2 h-16 w-32 border border-dashed border-neutral-200 bg-neutral-50/50 p-1 flex items-center justify-center overflow-hidden">
                                                        <img src={`/storage/${emp.signature}`} alt="signature" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                                                    </div>
                                                ) : (
                                                    <div className="mt-2 h-16 w-32 border border-dashed border-red-200 bg-red-50/30 flex items-center justify-center">
                                                        <span className="text-[10px] text-red-400 italic">No signature found</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Upload Card */}
                        {canUpload && (
                            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-indigo-900">Upload Signed PDF</h3>
                                        <p className="text-xs text-indigo-600 font-medium">Unggah berkas yang telah ditandatangani.</p>
                                    </div>
                                </div>
                                <form onSubmit={handleUploadSigned} className="space-y-4">
                                    <div className="space-y-2">
                                        <Input 
                                            type="file" 
                                            accept=".pdf"
                                            onChange={e => setUploadData('signed_pdf', e.target.files?.[0] || null)}
                                            className="bg-white border-indigo-200 h-11"
                                        />
                                        <p className="text-[10px] text-indigo-500 italic ml-1">*Format PDF, maksimal 10MB.</p>
                                    </div>
                                    <Button type="submit" disabled={uploadProcessing || !uploadData.signed_pdf} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 shadow-lg shadow-indigo-600/20">
                                        Simpan & Finalisasi
                                    </Button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
