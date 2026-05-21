import { Head, Link, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { Edit, Eye, Plus, Search, Trash2, Download, FileText, MoreHorizontal } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Pagination } from '@/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Data Kontrak (PKWT)', href: '/contracts' },
];

interface Contract {
    id: number;
    contract_number: string;
    employee: {
        nama: string;
        nik: string;
        department?: { name: string };
        position?: { name: string };
    };
    start_date: string;
    end_date: string;
    status: 'active' | 'expired' | 'terminated';
    signed_file: string|null;
}

interface Props {
    contracts: Pagination<Contract>;
    filters: { search?: string };
}

const statusLabels: Record<string, string> = {
    active: 'Aktif',
    expired: 'Berakhir',
    terminated: 'Diputus',
};

const statusColors: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    expired: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    terminated: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
};

export default function ContractIndex() {
    const { auth } = usePage<{ auth: { user: any } }>().props;
    const canCreate = auth.user.role === 'admin' || auth.user.can?.includes('contract.create');
    const canDelete = auth.user.role === 'admin' || auth.user.can?.includes('contract.delete');
    const canViewOthers = auth.user.role === 'admin' || auth.user.can?.includes('contract.view');
    
    // @ts-ignore
    const { contracts, filters } = usePage<{ props: Props }>().props as unknown as Props;
    const [searchTerm, setSearchTerm] = useState(filters.search ?? '');

    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        router.get('/contracts', { search: searchTerm }, { preserveState: true });
    }

    function handleDelete(id: number) {
        if (confirm('Apakah Anda yakin ingin menghapus data kontrak ini?')) {
            router.delete(`/contracts/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Kontrak (PKWT)" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Data Kontrak (PKWT)</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Kelola perjanjian kerja waktu tertentu karyawan</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {canCreate && (
                            <Link href="/contracts/create"
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 w-full sm:w-auto">
                                <Plus className="h-4 w-4" /> Buat Kontrak Baru
                            </Link>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                        <input type="text" placeholder="Cari nama, NIK, atau nomor kontrak..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-neutral-300 pl-10 pr-4 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white focus:ring-2 focus:ring-blue-500 shadow-sm" />
                    </div>
                    <button type="submit" className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 transition-colors">Cari</button>
                </form>

                <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
                    <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                        <thead className="bg-neutral-50 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">No. Kontrak</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">Karyawan</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">Posisi / Dept</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">Masa Berlaku</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">File</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-700 dark:bg-neutral-900">
                            {contracts.data.length === 0 ? (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-neutral-500 dark:text-neutral-400 italic">Belum ada data kontrak.</td></tr>
                            ) : (
                                contracts.data.map((contract) => (
                                    <tr key={contract.id} className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                        <td className="whitespace-nowrap px-4 py-3 text-sm font-mono font-medium text-neutral-900 dark:text-white">{contract.contract_number}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                                            <div className="font-semibold text-neutral-900 dark:text-white">{contract.employee.nama}</div>
                                            <div className="text-xs text-neutral-500 dark:text-neutral-400">{contract.employee.nik}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                                            <div>{contract.employee.position?.name || '-'}</div>
                                            <div className="text-xs text-neutral-400">{contract.employee.department?.name || '-'}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                                            <div className="text-neutral-700 dark:text-neutral-300">{format(new Date(contract.start_date), 'dd MMM yyyy', { locale: id })}</div>
                                            <div className="text-xs text-red-500 font-medium">s/d {format(new Date(contract.end_date), 'dd MMM yyyy', { locale: id })}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[contract.status] ?? ''}`}>
                                                {statusLabels[contract.status] ?? contract.status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                                            {contract.signed_file ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/10 dark:text-blue-400">
                                                    Terarsip
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-700/10 dark:bg-amber-900/10 dark:text-amber-400">
                                                    Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={`/contracts/${contract.id}`} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-blue-600 dark:hover:bg-neutral-800 transition-colors">
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <a href={`/contracts/${contract.id}/download`} target="_blank" className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-emerald-600 dark:hover:bg-neutral-800 transition-colors">
                                                    <Download className="h-4 w-4" />
                                                </a>
                                                {canDelete && (
                                                    <button onClick={() => handleDelete(contract.id)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors">
                                                        <Trash2 className="h-4 w-4" />
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

                {contracts.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-700">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">Menampilkan {contracts.from}-{contracts.to} dari {contracts.total} data</p>
                        <div className="flex gap-1">
                            {contracts.links.map((link, i) => (
                                <Link key={i} href={link.url ?? '#'} className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${link.active ? 'bg-blue-600 text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'}`} dangerouslySetInnerHTML={{ __html: link.label }} preserveState />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
