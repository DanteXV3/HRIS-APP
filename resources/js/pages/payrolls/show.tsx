import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { FileText, Download, Calendar, ArrowLeft, Eye, Edit2, CheckCircle, FileSpreadsheet, Printer } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface PayrollItem {
    id: number;
    employee_id: number;
    gaji_pokok: string;
    tunjangan_jabatan: string;
    tunjangan_kehadiran: string;
    tunjangan_transportasi: string;
    tunjangan_pajak: string;
    uang_makan: string;
    uang_lembur: string;
    thr: string;
    total_pendapatan: string;
    potongan_bpjs_tk: string;
    potongan_bpjs_jkn: string;
    potongan_pph21: string;
    pinjaman_koperasi: string;
    potongan_lain_1: string;
    potongan_lain_2: string;
    total_potongan: string;
    gaji_bersih: string;
    employee: {
        id: number;
        nama: string;
        nik: string;
        position?: { name: string };
        department?: { name: string };
    };
}

interface Payroll {
    id: number;
    periode: string;
    tanggal_proses: string;
    status: string;
    notes: string | null;
    items: PayrollItem[];
    processed_by?: { name: string };
}

interface Props {
    payroll: Payroll;
}

function EditItemDialog({ payrollId, item, onClose }: { payrollId: number, item: PayrollItem | null, onClose: () => void }) {
    if (!item) return null;

    const { data, setData, put, processing, errors } = useForm({
        gaji_pokok: item.gaji_pokok,
        tunjangan_jabatan: item.tunjangan_jabatan,
        tunjangan_kehadiran: item.tunjangan_kehadiran,
        tunjangan_transportasi: item.tunjangan_transportasi,
        uang_makan: item.uang_makan,
        uang_lembur: item.uang_lembur,
        thr: item.thr,
        tunjangan_pajak: item.tunjangan_pajak,
        potongan_bpjs_tk: item.potongan_bpjs_tk,
        potongan_bpjs_jkn: item.potongan_bpjs_jkn,
        potongan_pph21: item.potongan_pph21,
        pinjaman_koperasi: item.pinjaman_koperasi,
        potongan_lain_1: item.potongan_lain_1,
        potongan_lain_2: item.potongan_lain_2,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/payrolls/${payrollId}/items/${item.id}`, {
            onSuccess: () => onClose(),
        });
    };

    const renderInput = (label: string, field: keyof typeof data) => (
        <div key={field}>
            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>
            <input 
                type="number" 
                step="0.01" 
                value={data[field]} 
                onChange={e => setData(field, e.target.value)} 
                className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white" 
            />
            {errors[field] && <p className="mt-1 text-xs text-red-500">{errors[field]}</p>}
        </div>
    );

    return (
        <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl bg-white dark:bg-neutral-900 max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b border-neutral-200 pb-4 dark:border-neutral-800">
                    <DialogTitle className="text-xl font-bold">Edit Rincian Gaji Manual</DialogTitle>
                    <DialogDescription>Karyawan: {item.employee.nama} ({item.employee.nik})</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Pendapatan Column */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 pb-2 dark:border-neutral-800">Pendapatan</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput("Gaji Pokok", "gaji_pokok")}
                                {renderInput("Tunjangan Jabatan", "tunjangan_jabatan")}
                                {renderInput("Tunjangan Kehadiran", "tunjangan_kehadiran")}
                                {renderInput("Tunjangan Transport", "tunjangan_transportasi")}
                                {renderInput("Uang Makan", "uang_makan")}
                                {renderInput("Uang Lembur", "uang_lembur")}
                                {renderInput("THR", "thr")}
                                {renderInput("Tunjangan Pajak", "tunjangan_pajak")}
                            </div>
                        </div>

                        {/* Potongan Column */}
                        <div className="space-y-4">
                             <h4 className="font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 pb-2 dark:border-neutral-800">Potongan & Beban</h4>
                             <div className="grid grid-cols-2 gap-4">
                                {renderInput("BPJS Kesehatan", "potongan_bpjs_jkn")}
                                {renderInput("BPJS Ketenagakerjaan", "potongan_bpjs_tk")}
                                {renderInput("PPh21", "potongan_pph21")}
                                {renderInput("Pinjaman Koperasi", "pinjaman_koperasi")}
                                {renderInput("Potongan Lain 1", "potongan_lain_1")}
                                {renderInput("Potongan Lain 2", "potongan_lain_2")}
                             </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end gap-3 border-t border-neutral-200 pt-5 dark:border-neutral-800">
                        <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">Batal</button>
                        <button type="submit" disabled={processing} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">Simpan Perubahan</button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function PayrollShow({ payroll }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Payroll', href: '/payrolls' },
        { title: `Detail ${payroll.periode}`, href: '#' },
    ];

    const formatRupiah = (value: string | number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(value));
    };

    const formatPeriode = (periode: string) => {
        const [year, month] = periode.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    };

    const [selectedItem, setSelectedItem] = useState<PayrollItem | null>(null);
    const [editingItem, setEditingItem] = useState<PayrollItem | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Payroll ${formatPeriode(payroll.periode)}`} />
            <div className="mx-auto max-w-7xl p-6">
                
                {/* Header Section */}
                <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <Link href="/payrolls" className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300">
                                <ArrowLeft className="size-5" />
                            </Link>
                            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                Detail Payroll: {formatPeriode(payroll.periode)}
                            </h1>
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                payroll.status === 'finalized' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {payroll.status.toUpperCase()}
                            </span>
                        </div>
                        <p className="flex items-center gap-2 text-sm text-neutral-500">
                            <Calendar className="size-4" /> Diproses tanggal {new Date(payroll.tanggal_proses).toLocaleDateString('id-ID')}
                            oleh {payroll.processed_by?.name || 'Sistem'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href={`/payrolls/${payroll.id}/export-excel`}
                            target="_blank"
                            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:ring-offset-neutral-900"
                        >
                            <FileSpreadsheet className="size-4 text-green-600" /> Export Excel
                        </a>
                        <a
                            href={`/payrolls/${payroll.id}/export-pdf-report`}
                            target="_blank"
                            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:ring-offset-neutral-900"
                        >
                            <Printer className="size-4 text-red-500" /> Cetak PDF
                        </a>

                        {payroll.status !== 'finalized' && (
                            <button
                                onClick={() => {
                                    if (confirm('Yakin ingin memfinalisasi payroll ini? Setelah finalisasi, semua rincian gaji karyawan pada periode ini akan dikunci permanen.')) {
                                        router.post(`/payrolls/${payroll.id}/finalize`);
                                    }
                                }}
                                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
                            >
                                <CheckCircle className="size-4" /> Finalisasi Payroll
                            </button>
                        )}
                    </div>
                </div>

                {/* Items List */}
                <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
                        <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                            Rincian Gaji Karyawan ({payroll.items.length} orang)
                        </h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-neutral-600 dark:text-neutral-400">
                            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
                                <tr>
                                    <th className="px-6 py-4">Karyawan</th>
                                    <th className="px-6 py-4 text-right">Gaji Pokok</th>
                                    <th className="px-6 py-4 text-right">Tunjangan</th>
                                    <th className="px-6 py-4 text-right">Tunj. Pajak</th>
                                    <th className="px-6 py-4 text-right">Total Pendapatan</th>
                                    <th className="px-6 py-4 text-right">Potongan BPJS & PPh21</th>
                                    <th className="px-6 py-4 text-right">Potongan Lain</th>
                                    <th className="px-6 py-4 text-right text-blue-600 dark:text-blue-400">Gaji Bersih (THP)</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {payroll.items.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-6 py-8 text-center text-neutral-500">
                                            Tidak ada data item payroll.
                                        </td>
                                    </tr>
                                ) : (
                                    payroll.items.map((item) => {
                                        const tunjanganLain = Number(item.tunjangan_jabatan) + Number(item.tunjangan_kehadiran) + Number(item.tunjangan_transportasi) + Number(item.uang_makan) + Number(item.uang_lembur) + Number(item.thr);
                                        const potonganWajib = Number(item.potongan_bpjs_tk) + Number(item.potongan_bpjs_jkn) + Number(item.potongan_pph21);
                                        const potonganLain = Number(item.pinjaman_koperasi) + Number(item.potongan_lain_1) + Number(item.potongan_lain_2);

                                        return (
                                            <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="font-medium text-neutral-900 dark:text-white">{item.employee.nama}</div>
                                                    <div className="text-xs text-neutral-500">
                                                        {item.employee.nik} <br />
                                                        {item.employee.position?.name} - {item.employee.department?.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">{formatRupiah(item.gaji_pokok)}</td>
                                                <td className="px-6 py-4 text-right">{formatRupiah(tunjanganLain)}</td>
                                                <td className="px-6 py-4 text-right text-green-600 dark:text-green-400">{formatRupiah(item.tunjangan_pajak)}</td>
                                                <td className="px-6 py-4 text-right font-medium">{formatRupiah(item.total_pendapatan)}</td>
                                                <td className="px-6 py-4 text-right text-red-600 dark:text-red-400">-{formatRupiah(potonganWajib)}</td>
                                                <td className="px-6 py-4 text-right text-red-600 dark:text-red-400">-{formatRupiah(potonganLain)}</td>
                                                <td className="px-6 py-4 text-right font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                                                    {formatRupiah(item.gaji_bersih)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <button 
                                                            onClick={() => setSelectedItem(item)}
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                                            title="Lihat Detail Gaji"
                                                        >
                                                            <Eye className="size-3.5" /> Detail
                                                        </button>
                                                        {payroll.status !== 'finalized' && (
                                                            <button 
                                                                onClick={() => setEditingItem(item)}
                                                                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                                                title="Edit Manual Gaji"
                                                            >
                                                                <Edit2 className="size-3.5" /> Edit
                                                            </button>
                                                        )}
                                                        <a 
                                                            href={`/payrolls/${payroll.id}/items/${item.id}/pdf`}
                                                            target="_blank"
                                                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50" 
                                                            title="Download PDF"
                                                        >
                                                            <Download className="size-3.5" /> PDF
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Payslip Detail Modal */}
            <Dialog open={selectedItem !== null} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <DialogContent className="max-w-2xl bg-white dark:bg-neutral-900">
                    <DialogHeader className="border-b border-neutral-200 pb-4 dark:border-neutral-800">
                        <DialogTitle className="text-xl font-bold">Rincian Slip Gaji</DialogTitle>
                        <DialogDescription>
                            Periode: {formatPeriode(payroll.periode)}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedItem && (
                        <div className="grid gap-6 py-2">
                            {/* Employee Info */}
                            <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800">
                                <h3 className="mb-2 font-bold text-neutral-900 dark:text-white">Informasi Karyawan</h3>
                                <div className="grid grid-cols-2 gap-y-2 text-sm">
                                    <div className="text-neutral-500">Nama</div>
                                    <div className="font-medium text-neutral-900 dark:text-white">{selectedItem.employee.nama}</div>
                                    <div className="text-neutral-500">NIK</div>
                                    <div className="font-medium text-neutral-900 dark:text-white">{selectedItem.employee.nik}</div>
                                    <div className="text-neutral-500">Posisi</div>
                                    <div className="font-medium text-neutral-900 dark:text-white">{selectedItem.employee.position?.name || '-'} - {selectedItem.employee.department?.name || '-'}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Earnings Box */}
                                <div>
                                    <h4 className="mb-3 font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 pb-2 dark:border-neutral-800">Pendapatan</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-neutral-600 dark:text-neutral-400">Gaji Pokok</span>
                                            <span className="font-medium">{formatRupiah(selectedItem.gaji_pokok)}</span>
                                        </div>
                                        {Number(selectedItem.tunjangan_jabatan) > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-neutral-600 dark:text-neutral-400">Tunj. Jabatan</span>
                                            <span className="font-medium">{formatRupiah(selectedItem.tunjangan_jabatan)}</span>
                                        </div>)}
                                        {Number(selectedItem.tunjangan_kehadiran) > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-neutral-600 dark:text-neutral-400">Tunj. Kehadiran</span>
                                            <span className="font-medium">{formatRupiah(selectedItem.tunjangan_kehadiran)}</span>
                                        </div>)}
                                        {Number(selectedItem.tunjangan_transportasi) > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-neutral-600 dark:text-neutral-400">Tunj. Transportasi</span>
                                            <span className="font-medium">{formatRupiah(selectedItem.tunjangan_transportasi)}</span>
                                        </div>)}
                                        {Number(selectedItem.uang_makan) > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-neutral-600 dark:text-neutral-400">Uang Makan</span>
                                            <span className="font-medium">{formatRupiah(selectedItem.uang_makan)}</span>
                                        </div>)}
                                        {Number(selectedItem.uang_lembur) > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-neutral-600 dark:text-neutral-400">Uang Lembur</span>
                                            <span className="font-medium">{formatRupiah(selectedItem.uang_lembur)}</span>
                                        </div>)}
                                        {Number(selectedItem.thr) > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-neutral-600 dark:text-neutral-400">THR</span>
                                            <span className="font-medium">{formatRupiah(selectedItem.thr)}</span>
                                        </div>)}
                                        {Number(selectedItem.tunjangan_pajak) > 0 && (
                                        <div className="flex justify-between text-green-600 dark:text-green-400">
                                            <span>Tunj. Pajak (Gross Up)</span>
                                            <span className="font-medium">{formatRupiah(selectedItem.tunjangan_pajak)}</span>
                                        </div>)}
                                        
                                        <div className="mt-2 flex justify-between border-t border-neutral-200 pt-2 font-bold dark:border-neutral-800">
                                            <span>Total Pendapatan</span>
                                            <span>{formatRupiah(selectedItem.total_pendapatan)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Deductions Box */}
                                <div>
                                    <h4 className="mb-3 font-semibold text-neutral-900 border-b border-neutral-200 pb-2 dark:text-white dark:border-neutral-800">Potongan & Beban</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between text-red-600/90 dark:text-red-400/90">
                                            <span>BPJS Kesehatan (1%)</span>
                                            <span>-{formatRupiah(selectedItem.potongan_bpjs_jkn)}</span>
                                        </div>
                                        <div className="flex justify-between text-red-600/90 dark:text-red-400/90">
                                            <span>BPJS Ketenagakerjaan (3%)</span>
                                            <span>-{formatRupiah(selectedItem.potongan_bpjs_tk)}</span>
                                        </div>
                                        <div className="flex justify-between text-red-600/90 dark:text-red-400/90">
                                            <span>PPh21 (Pajak)</span>
                                            <span>-{formatRupiah(selectedItem.potongan_pph21)}</span>
                                        </div>
                                        
                                        {Number(selectedItem.pinjaman_koperasi) > 0 && (
                                        <div className="flex justify-between text-red-600/90 dark:text-red-400/90">
                                            <span>Pot. Koperasi</span>
                                            <span>-{formatRupiah(selectedItem.pinjaman_koperasi)}</span>
                                        </div>)}
                                        {Number(selectedItem.potongan_lain_1) > 0 && (
                                        <div className="flex justify-between text-red-600/90 dark:text-red-400/90">
                                            <span>Pot. Lainnya 1</span>
                                            <span>-{formatRupiah(selectedItem.potongan_lain_1)}</span>
                                        </div>)}
                                        {Number(selectedItem.potongan_lain_2) > 0 && (
                                        <div className="flex justify-between text-red-600/90 dark:text-red-400/90">
                                            <span>Pot. Lainnya 2</span>
                                            <span>-{formatRupiah(selectedItem.potongan_lain_2)}</span>
                                        </div>)}

                                        <div className="mt-2 flex justify-between border-t border-neutral-200 pt-2 font-bold text-red-600 dark:border-neutral-800 dark:text-red-400">
                                            <span>Total Potongan</span>
                                            <span>-{formatRupiah(selectedItem.total_potongan)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Take Home Pay */}
                            <div className="mt-4 flex items-center justify-between rounded-lg bg-blue-50 px-6 py-4 dark:bg-blue-900/20">
                                <span className="text-base font-bold text-blue-900 dark:text-blue-100">Take Home Pay (THP)</span>
                                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{formatRupiah(selectedItem.gaji_bersih)}</span>
                            </div>

                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <EditItemDialog 
                payrollId={payroll.id}
                item={editingItem} 
                onClose={() => setEditingItem(null)} 
            />

        </AppLayout>
    );
}
