import { Head, Link, useForm } from '@inertiajs/react';
import { MapPin, ArrowLeft, Save, Loader2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { WorkingLocation } from '@/types/hris';
import { BreadcrumbItem } from '@/types';

interface Props {
    location?: WorkingLocation;
}

export default function WorkingLocationForm({ location }: Props) {
    const isEditing = !!location;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Lokasi Kerja', href: '/working-locations' },
        { title: isEditing ? 'Edit' : 'Tambah', href: '#' },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: location?.name ?? '',
        latitude: location?.latitude?.toString() ?? '',
        longitude: location?.longitude?.toString() ?? '',
        radius: location?.radius ?? 200,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/working-locations/${location.id}`);
        } else {
            post('/working-locations');
        }
    };

    const inputClass = "mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white";

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? 'Edit Lokasi Kerja' : 'Tambah Lokasi Kerja'} />

            <div className="max-w-4xl mx-auto p-6 text-neutral-900 border-neutral-900">
                <div className="flex items-center gap-4 mb-6">
                    <Link
                        href="/working-locations"
                        className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                            {isEditing ? 'Edit Lokasi Kerja' : 'Tambah Lokasi Kerja Baru'}
                        </h1>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Atur koordinat dan radius untuk geofencing penempatan ini.</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Nama Lokasi / Site <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className={inputClass}
                                    placeholder="Contoh: Kantor Pusat, Proyek Sudirman, Gudang Bekasi"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>

                            <div className="sm:col-span-2 space-y-4 pt-2">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Pengaturan Geolocation
                                </h3>
                                
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                            Latitude <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.latitude}
                                            onChange={e => setData('latitude', e.target.value)}
                                            className={inputClass}
                                            placeholder="-6.123456"
                                            required
                                        />
                                        {errors.latitude && <p className="mt-1 text-xs text-red-500">{errors.latitude}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                            Longitude <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.longitude}
                                            onChange={e => setData('longitude', e.target.value)}
                                            className={inputClass}
                                            placeholder="106.123456"
                                            required
                                        />
                                        {errors.longitude && <p className="mt-1 text-xs text-red-500">{errors.longitude}</p>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                            Radius Geofencing (Meter) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number"
                                                value={data.radius}
                                                onChange={e => setData('radius', parseInt(e.target.value) || 0)}
                                                className={inputClass}
                                                min="1"
                                                required
                                            />
                                            <span className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">meter</span>
                                        </div>
                                        <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400 italic">
                                            Rekomendasi radius adalah 100-200 meter untuk akurasi GPS mobile yang optimal.
                                        </p>
                                        {errors.radius && <p className="mt-1 text-xs text-red-500">{errors.radius}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                            <Link
                                href="/working-locations"
                                className="px-6 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-50"
                            >
                                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {isEditing ? 'Simpan Perubahan' : 'Tambah Lokasi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
