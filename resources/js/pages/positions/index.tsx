import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Department, Pagination, Position } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Jabatan', href: '/positions' },
];

interface Props {
    positions: Pagination<Position & { employees_count: number; department: Department }>;
    departments: { id: number; name: string }[];
    filters: { search?: string; department_id?: string };
}

const gradeLabels: Record<string, string> = {
    staff: 'Staff',
    supervisor: 'Supervisor',
    manager: 'Manager',
};

const gradeColors: Record<string, string> = {
    staff: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
    supervisor: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    manager: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

export default function PositionIndex() {
    const { positions, departments, filters } = usePage<{ props: Props }>().props as unknown as Props;

    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        router.get('/positions', {
            search: formData.get('search') as string,
            department_id: formData.get('department_id') as string,
        }, { preserveState: true });
    }

    function handleDelete(id: number) {
        if (confirm('Apakah Anda yakin ingin menghapus jabatan ini?')) {
            router.delete(`/positions/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jabatan" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Jabatan</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Kelola jabatan dan grade karyawan</p>
                    </div>
                    <Link
                        href="/positions/create"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 w-full sm:w-auto"
                    >
                        <Plus className="h-4 w-4" /> Tambah Jabatan
                    </Link>
                </div>

                <form onSubmit={handleSearch} className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2">
                    <input type="text" name="search" placeholder="Cari jabatan..." defaultValue={filters.search ?? ''}
                        className="w-full sm:max-w-xs rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
                    <select name="department_id" defaultValue={filters.department_id ?? ''}
                        className="rounded-lg border border-neutral-300 px-4 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                        <option value="">Semua Departemen</option>
                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <button type="submit" className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300">Cari</button>
                </form>

                <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-700">
                    <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                        <thead className="bg-neutral-50 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Nama Jabatan</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Departemen</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Grade</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Karyawan</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-700 dark:bg-neutral-900">
                            {positions.data.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-neutral-500">Belum ada jabatan.</td></tr>
                            ) : (
                                positions.data.map((pos) => (
                                    <tr key={pos.id} className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-neutral-900 dark:text-white">{pos.name}</td>
                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-neutral-500 dark:text-neutral-400">{pos.department?.name}</td>
                                        <td className="whitespace-nowrap px-4 py-4 text-sm">
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${gradeColors[pos.grade] ?? ''}`}>
                                                {gradeLabels[pos.grade] ?? pos.grade}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-neutral-500 dark:text-neutral-400">{pos.employees_count}</td>
                                        <td className="whitespace-nowrap px-4 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/positions/${pos.id}/edit`} className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-blue-600 dark:hover:bg-neutral-800">
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button onClick={() => handleDelete(pos.id)} className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20">
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

                {positions.last_page > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-neutral-500">Menampilkan {positions.from}-{positions.to} dari {positions.total} data</p>
                        <div className="flex gap-1">
                            {positions.links.map((link, i) => (
                                <Link key={i} href={link.url ?? '#'} className={`rounded-lg px-3 py-1.5 text-sm ${link.active ? 'bg-blue-600 text-white' : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'}`} dangerouslySetInnerHTML={{ __html: link.label }} preserveState />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
