import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { FileText, ArrowLeft, Upload, Info } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface LeaveType {
    id: number;
    name: string;
    max_days: number;
    is_paid: boolean;
    requires_attachment: boolean;
}

interface LeaveBalance {
    leave_type_id: number;
    total_days: number;
    used_days: number;
    remaining_days: number;
}

interface DeptEmployee {
    id: number;
    nama: string;
    nik: string;
}

interface Props {
    leaveTypes: LeaveType[];
    balances: Record<number, LeaveBalance>;
    departmentEmployees: DeptEmployee[];
    employee: any;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pengajuan Cuti', href: '/leaves' },
    { title: 'Ajukan Baru', href: '#' },
];

export default function LeaveCreate() {
    const { leaveTypes, balances, departmentEmployees, employee } = usePage<{ props: Props }>().props as unknown as Props;

    const { data, setData, post, processing, errors } = useForm({
        leave_type_id: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        alasan: '',
        yang_menggantikan: '',
        jumlah_hari: 0,
        attachment: null as File | null,
    });

    const [duration, setDuration] = useState(0);
    const selectedType = leaveTypes.find(t => t.id.toString() === data.leave_type_id);
    const balance = selectedType ? balances[selectedType.id] : null;

    useEffect(() => {
        if (data.tanggal_mulai && data.tanggal_selesai) {
            const start = new Date(data.tanggal_mulai);
            const end = new Date(data.tanggal_selesai);
            const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            const finalDiff = diff > 0 ? diff : 0;
            setData('jumlah_hari', finalDiff);
        }
    }, [data.tanggal_mulai, data.tanggal_selesai]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/leaves', { forceFormData: true });
    }

    const inputClass = "mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white";

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ajukan Cuti" />
            <div className="mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/leaves" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                            <FileText className="w-6 h-6 text-blue-600" />
                            Form Pengajuan Cuti / Izin
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Pengajuan atas nama: <strong>{employee?.nama}</strong>
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    {/* Leave Type */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Jenis Cuti / Izin <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.leave_type_id}
                            onChange={e => setData('leave_type_id', e.target.value)}
                            className={inputClass}
                            required
                        >
                            <option value="">-- Pilih Jenis Cuti --</option>
                            {leaveTypes.map(lt => (
                                <option key={lt.id} value={lt.id}>{lt.name} {lt.max_days > 0 ? `(Max ${lt.max_days} hari)` : ''}</option>
                            ))}
                        </select>
                        {errors.leave_type_id && <p className="mt-1 text-xs text-red-500">{errors.leave_type_id}</p>}
                    </div>

                    {/* Balance info for Cuti Tahunan */}
                    {selectedType?.name === 'Cuti Tahunan' && (
                        <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <p className="font-semibold text-blue-800 dark:text-blue-300">Sisa Cuti Tahunan {new Date().getFullYear()}</p>
                                <p className="text-blue-700 dark:text-blue-400 mt-1">
                                    Total: <strong>{balance?.total_days ?? selectedType.max_days}</strong> hari &bull;
                                    Terpakai: <strong>{balance?.used_days ?? 0}</strong> hari &bull;
                                    Sisa: <strong className="text-blue-900 dark:text-blue-200">{balance ? balance.remaining_days : selectedType.max_days}</strong> hari
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Attachment warning */}
                    {selectedType?.requires_attachment && (
                        <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                            <Upload className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-700 dark:text-amber-400">
                                Jenis cuti ini memerlukan <strong>lampiran</strong> (surat keterangan dokter, dsb).
                            </p>
                        </div>
                    )}

                    {/* Date Range */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Tanggal Mulai <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={data.tanggal_mulai}
                                onChange={e => setData('tanggal_mulai', e.target.value)}
                                className={inputClass}
                                required
                            />
                            {errors.tanggal_mulai && <p className="mt-1 text-xs text-red-500">{errors.tanggal_mulai}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Tanggal Berakhir <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={data.tanggal_selesai}
                                onChange={e => setData('tanggal_selesai', e.target.value)}
                                min={data.tanggal_mulai}
                                className={inputClass}
                                required
                            />
                            {errors.tanggal_selesai && <p className="mt-1 text-xs text-red-500">{errors.tanggal_selesai}</p>}
                        </div>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Durasi (Hari) <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 flex items-center gap-3">
                            <input
                                type="number"
                                min="0.5"
                                step="0.5"
                                value={data.jumlah_hari}
                                onChange={e => setData('jumlah_hari', parseFloat(e.target.value) || 0)}
                                className={`${inputClass} max-w-[120px] text-center font-bold text-lg`}
                                required
                            />
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Dihitung otomatis, tapi Anda dapat menyesuaikan jika ada hari libur dsb.
                            </p>
                        </div>
                        {errors.jumlah_hari && <p className="mt-1 text-xs text-red-500">{errors.jumlah_hari}</p>}
                    </div>

                    {/* Keperluan */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Keperluan <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={3}
                            value={data.alasan}
                            onChange={e => setData('alasan', e.target.value)}
                            className={inputClass}
                            placeholder="Jelaskan alasan pengajuan cuti/izin..."
                            required
                        />
                        {errors.alasan && <p className="mt-1 text-xs text-red-500">{errors.alasan}</p>}
                    </div>

                    {/* Yang Menggantikan */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Yang Menggantikan</label>
                        <select
                            value={data.yang_menggantikan}
                            onChange={e => setData('yang_menggantikan', e.target.value)}
                            className={inputClass}
                        >
                            <option value="">-- Pilih Pengganti (Opsional) --</option>
                            {departmentEmployees.map(emp => (
                                <option key={emp.id} value={emp.nama}>{emp.nama} ({emp.nik})</option>
                            ))}
                        </select>
                        {errors.yang_menggantikan && <p className="mt-1 text-xs text-red-500">{errors.yang_menggantikan}</p>}
                    </div>

                    {/* Lampiran */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Lampiran {selectedType?.requires_attachment && <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type="file"
                            onChange={e => setData('attachment', e.target.files?.[0] || null)}
                            className="mt-1 block w-full text-sm text-neutral-500 file:mr-4 file:rounded-md file:border-neutral-300 file:bg-neutral-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-neutral-700 hover:file:bg-neutral-200 dark:text-neutral-400 dark:file:bg-neutral-800 dark:file:text-neutral-300"
                        />
                        <p className="mt-1 text-xs text-neutral-500">Maks 5MB. Format: PDF, JPG, PNG</p>
                        {errors.attachment && <p className="mt-1 text-xs text-red-500">{errors.attachment}</p>}
                    </div>

                    {/* Submit */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                        <Link href="/leaves" className="rounded-lg border border-neutral-300 px-6 py-2.5 text-center text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'Mengirim...' : 'Kirim Pengajuan'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
