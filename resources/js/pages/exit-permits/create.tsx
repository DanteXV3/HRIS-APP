import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, DoorOpen } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Form Keluar', href: '/exit-permits' },
    { title: 'Buat Baru', href: '#' },
];

export default function ExitPermitCreate() {
    const { data, setData, post, processing, errors } = useForm({
        jam_mulai: '',
        jam_berakhir: '',
        keperluan: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/exit-permits');
    }

    const inputClass = "mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white";

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Form Keluar" />
            <div className="mx-auto max-w-lg p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/exit-permits" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                            <DoorOpen className="w-6 h-6 text-blue-600" />
                            Form Keluar Kantor
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Izin keluar kantor sementara</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Jam Mulai <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                value={data.jam_mulai}
                                onChange={e => setData('jam_mulai', e.target.value)}
                                className={inputClass}
                                required
                            />
                            {errors.jam_mulai && <p className="mt-1 text-xs text-red-500">{errors.jam_mulai}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Jam Berakhir <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                value={data.jam_berakhir}
                                onChange={e => setData('jam_berakhir', e.target.value)}
                                className={inputClass}
                                required
                            />
                            {errors.jam_berakhir && <p className="mt-1 text-xs text-red-500">{errors.jam_berakhir}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Keperluan <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={3}
                            value={data.keperluan}
                            onChange={e => setData('keperluan', e.target.value)}
                            className={inputClass}
                            placeholder="Jelaskan keperluan keluar kantor..."
                            required
                        />
                        {errors.keperluan && <p className="mt-1 text-xs text-red-500">{errors.keperluan}</p>}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                        <Link href="/exit-permits" className="rounded-lg border border-neutral-300 px-6 py-2.5 text-center text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'Mengirim...' : 'Kirim Form Keluar'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
