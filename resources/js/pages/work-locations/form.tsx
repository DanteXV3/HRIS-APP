import { Head, Link, useForm } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, WorkLocation } from '@/types';

interface Props {
    location?: WorkLocation;
}

export default function WorkLocationForm({ location }: Props) {
    const isEditing = !!location;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Perusahaan', href: '/work-locations' },
        { title: isEditing ? 'Edit' : 'Tambah', href: '#' },
    ];

    const { data, setData, post, transform, processing, errors } = useForm<Record<string, any>>({
        name: location?.name ?? '',
        code: location?.code ?? '',
        address: location?.address ?? '',
        logo: null as File | null,
        payroll_cutoff_date: location?.payroll_cutoff_date ?? '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isEditing) {
            transform((data) => ({
                ...data,
                _method: 'put',
            }));
            post(`/work-locations/${location.id}`);
        } else {
            post('/work-locations');
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? 'Edit Perusahaan' : 'Tambah Perusahaan'} />
            <div className="mx-auto max-w-2xl p-6">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {isEditing ? 'Edit Perusahaan' : 'Tambah Perusahaan'}
                </h1>
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Kode Perusahaan</label>
                        <input type="text" value={data.code} onChange={e => setData('code', e.target.value.toUpperCase())}
                            className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            placeholder="Contoh: JKT, SBY, BDG (digunakan untuk generate NIK)" />
                        {errors.code && <p className="mt-1 text-xs text-red-500">{errors.code}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Nama Perusahaan</label>
                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                            className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            placeholder="Contoh: PT Example Indonesia" />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Alamat</label>
                        <textarea value={data.address} onChange={e => setData('address', e.target.value)} rows={3}
                            className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            placeholder="Alamat lengkap perusahaan" />
                        {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Tanggal Cut-off Payroll (Opsional)</label>
                        <input type="number" min="1" max="31" value={data.payroll_cutoff_date} onChange={e => setData('payroll_cutoff_date', e.target.value)}
                            className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            placeholder="Contoh: 25. Kosongkan untuk cut-off akhir bulan (30/31)" />
                        <p className="mt-1 text-xs text-neutral-500">Mempengaruhi perhitungan otomatis PPh21 Final saat karyawan resign bergantung pada tanggal keluarnya.</p>
                        {errors.payroll_cutoff_date && <p className="mt-1 text-xs text-red-500">{errors.payroll_cutoff_date}</p>}
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Logo Perusahaan (Untuk Kop Surat / Slip Gaji)</label>
                        <input type="file" accept="image/*" onChange={e => setData('logo', e.target.files?.[0] || null)}
                            className="mt-1 block w-full text-sm text-neutral-500 file:mr-4 file:rounded-md file:border-neutral-300 file:bg-neutral-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-neutral-700 hover:file:bg-neutral-200 dark:text-neutral-400 dark:file:bg-neutral-800 dark:file:text-neutral-300 dark:hover:file:bg-neutral-700" />
                        {errors.logo && <p className="mt-1 text-xs text-red-500">{errors.logo}</p>}
                        
                        {isEditing && (location as any)?.logo && (
                            <div className="mt-3 flex items-center justify-between rounded-md border border-neutral-200 p-3 dark:border-neutral-700">
                                <div className="flex items-center gap-3">
                                    <img src={`/storage/${(location as any).logo}`} alt="Logo Perusahaan" className="h-10 w-10 rounded object-contain bg-white" />
                                    <p className="text-xs text-neutral-600 dark:text-neutral-400">Logo saat ini. Upload gambar baru untuk menggantikan.</p>
                                </div>
                                <a href={`/storage/${(location as any).logo}`} target="_blank" rel="noreferrer" 
                                   className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:text-blue-800 hover:underline dark:text-blue-300 dark:hover:text-blue-200">
                                    <ExternalLink className="h-3.5 w-3.5" /> Lihat Ukuran Penuh
                                </a>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" disabled={processing}
                            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50">
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        <Link href="/work-locations" className="rounded-lg border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
