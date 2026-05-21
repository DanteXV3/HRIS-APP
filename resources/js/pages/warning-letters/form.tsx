import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Save, ArrowLeft, FileText, Calendar, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Employee {
    id: number;
    nama: string;
    nik: string;
}

interface Props {
    employees: Employee[];
}

export default function WarningLetterForm({ employees }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Surat Peringatan', href: '/warning-letters' },
        { title: 'Buat Baru', href: '#' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        employee_id: '',
        level: 1,
        reason: '',
        description: '',
        issued_date: new Date().toISOString().split('T')[0],
        valid_months: 3,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/warning-letters');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Surat Peringatan" />
            
            <div className="p-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                            <FileText className="w-6 h-6 text-red-600" />
                            Buat Surat Peringatan Baru
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Lengkapi data di bawah untuk menerbitkan SP secara resmi.
                        </p>
                    </div>
                    <Link
                        href="/warning-letters"
                        className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali Ke Daftar
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Employee Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="employee_id" className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Pilih Karyawan
                                </Label>
                                <select
                                    id="employee_id"
                                    className="w-full rounded-md border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 text-sm focus:ring-red-500 focus:border-red-500"
                                    value={data.employee_id}
                                    onChange={(e) => setData('employee_id', e.target.value)}
                                    required
                                >
                                    <option value="">-- Pilih Karyawan --</option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.nama} ({emp.nik})
                                        </option>
                                    ))}
                                </select>
                                {errors.employee_id && <p className="text-xs text-red-500">{errors.employee_id}</p>}
                            </div>

                            {/* SP Level */}
                            <div className="space-y-2">
                                <Label htmlFor="level" className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Tingkat Surat Peringatan
                                </Label>
                                <select
                                    id="level"
                                    className="w-full rounded-md border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 text-sm focus:ring-red-500 focus:border-red-500"
                                    value={data.level}
                                    onChange={(e) => setData('level', parseInt(e.target.value))}
                                    required
                                >
                                    <option value={1}>SP - I (Pertama)</option>
                                    <option value={2}>SP - II (Kedua)</option>
                                    <option value={3}>SP - III (Ketiga/Terakhir)</option>
                                </select>
                                {errors.level && <p className="text-xs text-red-500">{errors.level}</p>}
                            </div>

                            {/* Issued Date */}
                            <div className="space-y-2">
                                <Label htmlFor="issued_date" className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Tanggal Terbit
                                </Label>
                                <Input
                                    id="issued_date"
                                    type="date"
                                    className="dark:bg-neutral-950 focus-visible:ring-red-500"
                                    value={data.issued_date}
                                    onChange={(e) => setData('issued_date', e.target.value)}
                                    required
                                />
                                {errors.issued_date && <p className="text-xs text-red-500">{errors.issued_date}</p>}
                            </div>

                            {/* Valid Period */}
                            <div className="space-y-2">
                                <Label htmlFor="valid_months" className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Masa Berlaku (Bulan)
                                </Label>
                                <Input
                                    id="valid_months"
                                    type="number"
                                    min={1}
                                    className="dark:bg-neutral-950 focus-visible:ring-red-500"
                                    value={data.valid_months}
                                    onChange={(e) => setData('valid_months', parseInt(e.target.value))}
                                    required
                                />
                                <p className="text-[10px] text-neutral-400">Default adalah 3 bulan.</p>
                                {errors.valid_months && <p className="text-xs text-red-500">{errors.valid_months}</p>}
                            </div>
                        </div>

                        {/* Reason */}
                        <div className="mt-6 space-y-2">
                            <Label htmlFor="reason" className="flex items-center gap-2">
                                Ringkasan Kesalahan / Alasan
                            </Label>
                            <Input
                                id="reason"
                                placeholder="Contoh: Tidak masuk kerja tanpa keterangan / Ketidakhadiran"
                                className="dark:bg-neutral-950 focus-visible:ring-red-500"
                                value={data.reason}
                                onChange={(e) => setData('reason', e.target.value)}
                                required
                            />
                            {errors.reason && <p className="text-xs text-red-500">{errors.reason}</p>}
                        </div>

                        {/* Description */}
                        <div className="mt-6 space-y-2">
                            <Label htmlFor="description" className="flex items-center gap-2">
                                Rincian Pelanggaran (Detail)
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Jelaskan secara detail rincian pelanggaran, termasuk tanggal-tanggal kejadian..."
                                className="min-h-[150px] dark:bg-neutral-950 focus-visible:ring-red-500"
                                value={data.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                required
                            />
                            {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pb-12">
                        <Link href="/warning-letters" className="px-6 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-8 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-red-500/20 active:scale-95 disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Terbitkan Surat Peringatan
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
