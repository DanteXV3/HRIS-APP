import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Position } from '@/types';

interface Props {
    position?: Position;
    departments: { id: number; name: string }[];
}

export default function PositionForm({ position, departments }: Props) {
    const isEditing = !!position;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Jabatan', href: '/positions' },
        { title: isEditing ? 'Edit' : 'Tambah', href: '#' },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: position?.name ?? '',
        department_id: position?.department_id?.toString() ?? '',
        grade: position?.grade ?? 'staff',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isEditing) {
            put(`/positions/${position.id}`);
        } else {
            post('/positions');
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? 'Edit Jabatan' : 'Tambah Jabatan'} />
            <div className="mx-auto max-w-2xl p-6">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {isEditing ? 'Edit Jabatan' : 'Tambah Jabatan'}
                </h1>
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Nama Jabatan</label>
                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                            className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            placeholder="Contoh: Software Engineer" />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Departemen</label>
                        <select value={data.department_id} onChange={e => setData('department_id', e.target.value)}
                            className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                            <option value="">Pilih Departemen</option>
                            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                        {errors.department_id && <p className="mt-1 text-xs text-red-500">{errors.department_id}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Grade</label>
                        <select value={data.grade} onChange={e => setData('grade', e.target.value as 'staff' | 'supervisor' | 'manager')}
                            className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                            <option value="staff">Staff</option>
                            <option value="supervisor">Supervisor</option>
                            <option value="manager">Manager</option>
                        </select>
                        {errors.grade && <p className="mt-1 text-xs text-red-500">{errors.grade}</p>}
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" disabled={processing}
                            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50">
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        <Link href="/positions" className="rounded-lg border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
