import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Pagination, WorkLocation } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Perusahaan', href: '/work-locations' },
];

interface Props {
    locations: Pagination<WorkLocation & { employees_count: number }>;
    filters: { search?: string };
}

export default function WorkLocationIndex() {
    const { locations, filters } = usePage<{ props: Props }>().props as unknown as Props;

    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        router.get('/work-locations', { search: formData.get('search') as string }, { preserveState: true });
    }

    function handleDelete(id: number) {
        if (confirm('Apakah Anda yakin ingin menghapus perusahaan ini?')) {
            router.delete(`/work-locations/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Perusahaan" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Perusahaan</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Kelola data perusahaan / penempatan</p>
                    </div>
                    <Link href="/work-locations/create"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 w-full sm:w-auto">
                        <Plus className="h-4 w-4" /> Tambah Perusahaan
                    </Link>
                </div>

                <form onSubmit={handleSearch} className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2">
                    <input type="text" name="search" placeholder="Cari perusahaan..." defaultValue={filters.search ?? ''}
                        className="w-full sm:max-w-xs rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
                    <button type="submit" className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300">Cari</button>
                </form>

                <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-700">
                    <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                        <thead className="bg-neutral-50 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Kode</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Nama Perusahaan</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Alamat</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Karyawan</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-700 dark:bg-neutral-900">
                            {locations.data.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-neutral-500">Belum ada data perusahaan.</td></tr>
                            ) : (
                                locations.data.map((loc) => (
                                    <tr key={loc.id} className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                        <td className="whitespace-nowrap px-4 py-4 text-sm">
                                            <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{loc.code}</span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-neutral-900 dark:text-white">{loc.name}</td>
                                        <td className="px-4 py-4 text-sm text-neutral-500 dark:text-neutral-400">{loc.address ?? '-'}</td>
                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-neutral-500 dark:text-neutral-400">{loc.employees_count}</td>
                                        <td className="whitespace-nowrap px-4 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/work-locations/${loc.id}/edit`} className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-blue-600 dark:hover:bg-neutral-800">
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button onClick={() => handleDelete(loc.id)} className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
