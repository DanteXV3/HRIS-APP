import { Head, Link, router, usePage } from '@inertiajs/react';
import React from 'react';
import { Edit, Eye, Plus, UserX } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Employee, Pagination } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Karyawan', href: '/employees' },
];

interface Props {
    employees: Pagination<Employee>;
    departments: { id: number; name: string }[];
    workLocations: { id: number; name: string }[];
    lokasiKerjaList: string[];
    filters: { search?: string; department_id?: string; status_kepegawaian?: string; is_active?: string; work_location_id?: string; lokasi_kerja?: string };
}

const statusLabels: Record<string, string> = {
    tetap: 'Tetap',
    kontrak: 'Kontrak',
    probation: 'Probation',
    magang: 'Magang',
};

const statusColors: Record<string, string> = {
    tetap: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    kontrak: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    probation: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    magang: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

export default function EmployeeIndex() {
    const { employees, departments, workLocations, lokasiKerjaList, filters } = usePage<{ props: Props }>().props as unknown as Props;

    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        router.get('/employees', {
            search: fd.get('search') as string,
            department_id: fd.get('department_id') as string,
            status_kepegawaian: fd.get('status_kepegawaian') as string,
            is_active: fd.get('is_active') as string,
            work_location_id: fd.get('work_location_id') as string,
            lokasi_kerja: fd.get('lokasi_kerja') as string,
        }, { preserveState: true });
    }

    function handleExport() {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.department_id) params.append('department_id', filters.department_id);
        if (filters.status_kepegawaian) params.append('status_kepegawaian', filters.status_kepegawaian);
        if (filters.is_active) params.append('is_active', filters.is_active);
        if (filters.work_location_id) params.append('work_location_id', filters.work_location_id);
        if (filters.lokasi_kerja) params.append('lokasi_kerja', filters.lokasi_kerja);
        
        window.location.href = `/employees/export?${params.toString()}`;
    }

    function handleDeactivate(id: number) {
        if (confirm('Apakah Anda yakin ingin menonaktifkan karyawan ini?')) {
            router.delete(`/employees/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Karyawan" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Data Karyawan</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Kelola data seluruh karyawan perusahaan</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button onClick={handleExport}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 w-full sm:w-auto">
                            Download Excel
                        </button>
                        <Link href="/employees/create"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 w-full sm:w-auto">
                            <Plus className="h-4 w-4" /> Tambah Karyawan
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2">
                    <input type="text" name="search" placeholder="Cari nama, NIK, atau email..." defaultValue={filters.search ?? ''}
                        className="w-full sm:max-w-xs rounded-lg border border-neutral-300 px-4 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
                    <select name="department_id" defaultValue={filters.department_id ?? ''}
                        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                        <option value="">Semua Dept</option>
                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <select name="status_kepegawaian" defaultValue={filters.status_kepegawaian ?? ''}
                        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                        <option value="">Semua Status</option>
                        <option value="tetap">Tetap</option>
                        <option value="kontrak">Kontrak</option>
                        <option value="probation">Probation</option>
                        <option value="magang">Magang</option>
                    </select>
                    <select name="work_location_id" defaultValue={filters.work_location_id ?? ''}
                        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                        <option value="">Semua Perusahaan</option>
                        {workLocations?.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                    <select name="lokasi_kerja" defaultValue={filters.lokasi_kerja ?? ''}
                        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                        <option value="">Semua Lokasi Kerja</option>
                        {lokasiKerjaList?.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <select name="is_active" defaultValue={filters.is_active ?? ''}
                        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                        <option value="">Semua</option>
                        <option value="1">Aktif</option>
                        <option value="0">Non-aktif</option>
                    </select>
                    <button type="submit" className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300">Cari</button>
                </form>

                <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-700">
                    <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                        <thead className="bg-neutral-50 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">NIK</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">Nama</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">Departemen</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">Jabatan</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">Aktif</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-700 dark:bg-neutral-900">
                            {employees.data.length === 0 ? (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-neutral-500">Belum ada data karyawan.</td></tr>
                            ) : (
                                employees.data.map((emp) => (
                                    <tr key={emp.id} className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                        <td className="whitespace-nowrap px-4 py-3 text-sm font-mono font-medium text-neutral-900 dark:text-white">{emp.nik}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-900 dark:text-white">{emp.nama}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">{emp.department?.name ?? '-'}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">{emp.position?.name ?? '-'}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[emp.status_kepegawaian] ?? ''}`}>
                                                {statusLabels[emp.status_kepegawaian] ?? emp.status_kepegawaian}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-block h-2.5 w-2.5 rounded-full ${emp.is_active ? 'bg-emerald-500' : 'bg-red-400'}`} />
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={`/employees/${emp.id}`} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-blue-600 dark:hover:bg-neutral-800">
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link href={`/employees/${emp.id}/edit`} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-amber-600 dark:hover:bg-neutral-800">
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                {emp.is_active && (
                                                    <button onClick={() => handleDeactivate(emp.id)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20">
                                                        <UserX className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {employees.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-neutral-500">Menampilkan {employees.from}-{employees.to} dari {employees.total} data</p>
                        <div className="flex gap-1">
                            {employees.links.map((link, i) => (
                                <Link key={i} href={link.url ?? '#'} className={`rounded-lg px-3 py-1.5 text-sm ${link.active ? 'bg-blue-600 text-white' : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'}`} dangerouslySetInnerHTML={{ __html: link.label }} preserveState />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
