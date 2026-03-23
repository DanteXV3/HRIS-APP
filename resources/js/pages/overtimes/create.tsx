import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Clock, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Props {
    employees: { id: number; nama: string; nik: string }[];
    workingLocations: { id: number; name: string }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Form Lembur', href: '/overtimes' },
    { title: 'Buat Baru', href: '#' },
];

export default function OvertimeCreate() {
    const { employees, workingLocations } = usePage<any>().props as unknown as Props;
    const [search, setSearch] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        employee_ids: [] as number[],
        tanggal: new Date().toISOString().substring(0, 10),
        jam_mulai: '17:00',
        jam_berakhir: '19:00',
        durasi: 2,
        working_location_id: '' as number | string,
        keperluan: '',
    });

    useEffect(() => {
        if (data.jam_mulai && data.jam_berakhir) {
            const start = new Date(`2000-01-01T${data.jam_mulai}`);
            const end = new Date(`2000-01-01T${data.jam_berakhir}`);
            let diffMs = end.getTime() - start.getTime();
            if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;
            const diffHrs = diffMs / (1000 * 60 * 60);
            setData('durasi', parseFloat(diffHrs.toFixed(2)));
        }
    }, [data.jam_mulai, data.jam_berakhir]);

    const filteredEmployees = employees.filter(emp => 
        emp.nama.toLowerCase().includes(search.toLowerCase()) || 
        emp.nik.toLowerCase().includes(search.toLowerCase())
    );

    const toggleEmployee = (id: number) => {
        const current = [...data.employee_ids];
        if (current.includes(id)) {
            setData('employee_ids', current.filter(cid => cid !== id));
        } else {
            setData('employee_ids', [...current, id]);
        }
    };

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/overtimes');
    }

    const inputClass = "mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white";

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Pengajuan Lembur" />
            <div className="mx-auto max-w-xl p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/overtimes" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                            <Clock className="w-6 h-6 text-blue-600" />
                            Form Lembur
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Pastikan data yang dimasukkan benar.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Pilih Karyawan <span className="text-red-500">*</span>
                        </label>
                        <div className="relative mt-2">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Cari nama atau NIK..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="block w-full rounded-lg border border-neutral-300 pl-9 pr-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            />
                        </div>
                        <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-neutral-100 dark:border-neutral-800">
                            {filteredEmployees.map((emp) => (
                                <label key={emp.id} className="flex cursor-pointer items-center gap-3 p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                    <input
                                        type="checkbox"
                                        checked={data.employee_ids.includes(emp.id)}
                                        onChange={() => toggleEmployee(emp.id)}
                                        className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900"
                                    />
                                    <div className="text-sm">
                                        <p className="font-medium text-neutral-900 dark:text-white">{emp.nama}</p>
                                        <p className="text-xs text-neutral-500">{emp.nik}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                        {errors.employee_ids && <p className="mt-1 text-xs text-red-500">{errors.employee_ids}</p>}
                        <p className="mt-1 text-[10px] text-neutral-400">Terpilih: {data.employee_ids.length} orang</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Tanggal <span className="text-red-500">*</span></label>
                        <input type="date" value={data.tanggal} onChange={e => setData('tanggal', e.target.value)} className={inputClass} required />
                        {errors.tanggal && <p className="mt-1 text-xs text-red-500">{errors.tanggal}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Lokasi Kerja <span className="text-red-500">*</span></label>
                        <select 
                            value={data.working_location_id} 
                            onChange={e => setData('working_location_id', e.target.value)} 
                            className={inputClass} 
                            required
                        >
                            <option value="">Pilih Lokasi Kerja</option>
                            {workingLocations.map((loc) => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                        </select>
                        {errors.working_location_id && <p className="mt-1 text-xs text-red-500">{errors.working_location_id}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Jam Mulai <span className="text-red-500">*</span></label>
                            <input type="time" value={data.jam_mulai} onChange={e => setData('jam_mulai', e.target.value)} className={inputClass} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Jam Berakhir <span className="text-red-500">*</span></label>
                            <input type="time" value={data.jam_berakhir} onChange={e => setData('jam_berakhir', e.target.value)} className={inputClass} required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-500">Durasi: <span className="font-bold text-neutral-900 dark:text-white">{data.durasi} Jam</span></label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Keperluan <span className="text-red-500">*</span></label>
                        <textarea
                            value={data.keperluan}
                            onChange={e => setData('keperluan', e.target.value)}
                            rows={3}
                            className={inputClass}
                            placeholder="Jelaskan keperluan lembur..."
                            required
                        ></textarea>
                        {errors.keperluan && <p className="mt-1 text-xs text-red-500">{errors.keperluan}</p>}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                        <Link href="/overtimes" className="rounded-lg border border-neutral-300 px-6 py-2.5 text-center text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
                            Batal
                        </Link>
                        <button type="submit" disabled={processing} className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50">
                            {processing ? 'Mengirim...' : 'Kirim Pengajuan'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
