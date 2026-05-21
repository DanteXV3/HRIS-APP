import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Department } from '@/types';

interface Props {
    department?: Department;
}

export default function DepartmentForm({ department }: Props) {
    const isEditing = !!department;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Departemen', href: '/departments' },
        { title: isEditing ? 'Edit' : 'Tambah', href: '#' },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: department?.name ?? '',
        code: department?.code ?? '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isEditing) {
            put(`/departments/${department.id}`);
        } else {
            post('/departments');
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? 'Edit Departemen' : 'Tambah Departemen'} />
            <div className="mx-auto max-w-2xl p-6">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {isEditing ? 'Edit Departemen' : 'Tambah Departemen'}
                </h1>
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Kode Departemen</label>
                        <input
                            type="text"
                            value={data.code}
                            onChange={e => setData('code', e.target.value.toUpperCase())}
                            className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            placeholder="Contoh: HR, FIN, IT"
                        />
                        {errors.code && <p className="mt-1 text-xs text-red-500">{errors.code}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Nama Departemen</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            placeholder="Contoh: Human Resources"
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        <Link
                            href="/departments"
                            className="rounded-lg border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        >
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
