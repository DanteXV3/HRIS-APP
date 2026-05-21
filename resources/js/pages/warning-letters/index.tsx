import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import type { Pagination as PaginationType } from '@/types/hris';
import { Pagination } from '@/components/pagination';
import { FileText, Plus, Eye, Trash2, Download } from 'lucide-react';

interface WarningLetter {
    id: number;
    employee: {
        nama: string;
        nik: string;
        department?: { name: string };
        position?: { name: string };
    };
    issuer: { nama: string };
    level: number;
    reference_number: string;
    reason: string;
    issued_date: string;
    valid_until: string;
    status: string;
}

interface Props {
    warningLetters: PaginationType<WarningLetter>;
    isHR: boolean;
}

export default function WarningLetterIndex({ warningLetters, isHR }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Surat Peringatan', href: '#' },
    ];

    const getLevelBadge = (level: number) => {
        switch (level) {
            case 1: return <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 border border-amber-200">SP-I</span>;
            case 2: return <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 border border-orange-200">SP-II</span>;
            case 3: return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200">SP-III</span>;
            default: return <span className="px-2 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200">SP-{level}</span>;
        }
    };

    const { delete: destroy } = useForm();
    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus data surat peringatan ini?')) {
            destroy(route('warning-letters.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Surat Peringatan" />
            
            <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                            <FileText className="w-6 h-6 text-red-600" />
                            Surat Peringatan (SP)
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Kelola dan pantau surat peringatan kedisiplinan karyawan.
                        </p>
                    </div>

                    {isHR && (
                        <Link
                            href="/warning-letters/create"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Buat SP Baru
                        </Link>
                    )}
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 font-medium uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Nomor & Karyawan</th>
                                    <th className="px-6 py-4">Tingkat</th>
                                    <th className="px-6 py-4">Alasan</th>
                                    <th className="px-6 py-4">Tanggal Terbit</th>
                                    <th className="px-6 py-4">Berlaku S/D</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {warningLetters.data.length > 0 ? (
                                    warningLetters.data.map((sp) => (
                                        <tr key={sp.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-mono text-xs font-bold text-neutral-500">{sp.reference_number}</div>
                                                <div className="font-semibold text-neutral-900 dark:text-white mt-1">{sp.employee.nama}</div>
                                                <div className="text-xs text-neutral-500">{sp.employee.nik} • {sp.employee.position?.name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getLevelBadge(sp.level)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="max-w-xs truncate text-neutral-700 dark:text-neutral-300" title={sp.reason}>
                                                    {sp.reason}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-neutral-700 dark:text-neutral-300">
                                                {new Date(sp.issued_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 text-neutral-700 dark:text-neutral-300">
                                                {new Date(sp.valid_until).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => window.open(`/warning-letters/${sp.id}/pdf`, '_blank')}
                                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        title="Unduh PDF"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                    <Link
                                                        href={`/warning-letters/${sp.id}`}
                                                        className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                        title="Lihat Detail"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    {isHR && (
                                                        <button
                                                            onClick={() => handleDelete(sp.id)}
                                                            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-neutral-500 dark:text-neutral-400">
                                            Belum ada data surat peringatan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {warningLetters.links && <Pagination links={warningLetters.links} />}
                </div>
            </div>
        </AppLayout>
    );
}

function route(name: string, params?: any) {
    const url = new URL(window.location.href);
    if (name === 'warning-letters.destroy') return `/warning-letters/${params}`;
    return '#';
}
