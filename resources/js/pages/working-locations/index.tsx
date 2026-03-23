import { Head, Link, router, usePage } from '@inertiajs/react';
import { MapPin, Plus, Search, Trash2, Edit } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Pagination as PaginationType, WorkingLocation } from '@/types/hris';
import { BreadcrumbItem, User } from '@/types';
import { useState } from 'react';

interface Props {
    locations: PaginationType<WorkingLocation>;
    filters: {
        search?: string;
    };
}

export default function WorkingLocationIndex({ locations, filters }: Props) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const canManage = auth.user.role === 'admin' || auth.user.can?.includes('working_location.manage');
    const [search, setSearch] = useState(filters.search || '');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Lokasi Kerja', href: '/working-locations' },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/working-locations', { search }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus lokasi kerja ini?')) {
            router.delete(`/working-locations/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lokasi Kerja" />

            <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Lokasi Kerja</h1>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Kelola lokasi fisik penempatan karyawan dan radius geofencing.</p>
                    </div>
                    {canManage && (
                        <Link
                            href="/working-locations/create"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm shadow-blue-500/20"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Lokasi
                        </Link>
                    )}
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                        <form onSubmit={handleSearch} className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Cari nama lokasi..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </form>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 text-xs uppercase tracking-wider font-semibold">
                                    <th className="px-6 py-4">Nama Lokasi</th>
                                    <th className="px-6 py-4">Koordinat (Lat, Long)</th>
                                    <th className="px-6 py-4 text-center">Radius</th>
                                    <th className="px-6 py-4 text-center">Karyawan</th>
                                    {canManage && <th className="px-6 py-4 text-right">Aksi</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {locations.data.length > 0 ? (
                                    locations.data.map((location) => (
                                        <tr key={location.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                        <MapPin className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-medium text-neutral-900 dark:text-white">{location.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                                                {location.latitude}, {location.longitude}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                                    {location.radius}m
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm font-medium text-neutral-900 dark:text-white">
                                                {location.employees_count || 0}
                                            </td>
                                            {canManage && (
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={`/working-locations/${location.id}/edit`}
                                                            className="p-1.5 text-neutral-400 hover:text-blue-600 transition-colors"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(location.id)}
                                                            className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={canManage ? 5 : 4} className="px-6 py-12 text-center text-neutral-500 dark:text-neutral-400">
                                            Belum ada data lokasi kerja.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {locations.total > locations.per_page && (
                        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-center">
                            {/* Simple pagination links for now */}
                            <div className="flex gap-2">
                                {locations.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 text-sm rounded-md border ${
                                            link.active
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 shadow-sm'
                                        } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
