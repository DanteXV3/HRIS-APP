import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar, Download, FileCheck, Info, FileText, TriangleAlert, CheckCircle, Clock } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface Contract {
    id: number;
    contract_number: string;
    status: 'active' | 'expired' | 'terminated';
    start_date: string;
    end_date: string;
    signed_file: string | null;
    base_salary: number | string;
    position_allowance: number | string;
    attendance_allowance: number | string;
    transport_allowance: number | string;
    meal_allowance: number | string;
    overtime_allowance: number | string;
}

interface Props {
    contract: Contract | null;
    error?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kontrak Saya', href: '/my-contract' },
];

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="grid grid-cols-3 gap-4 border-b border-neutral-100 py-3 last:border-0 dark:border-neutral-800">
            <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{label}</dt>
            <dd className="col-span-2 text-sm text-neutral-900 dark:text-white">{value || <span className="text-neutral-400">-</span>}</dd>
        </div>
    );
}

function SectionCard({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon?: any }) {
    return (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
            <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-3 dark:border-neutral-700 dark:bg-neutral-800 flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4 text-neutral-500" />}
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{title}</h3>
            </div>
            <dl className="px-6 py-2">{children}</dl>
        </div>
    );
}

function formatCurrency(value: number | string): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (!num || num === 0) return '-';
    return `Rp ${num.toLocaleString('id-ID')}`;
}

export default function MyContract() {
    const { contract, error } = usePage<{ props: Props }>().props as unknown as Props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kontrak Saya" />
            <div className="mx-auto max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Kontrak Kerja Saya</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Informasi detail perjanjian kerja Anda</p>
                    </div>
                </div>

                {error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/30 dark:bg-red-900/10">
                        <Info className="mx-auto h-12 w-12 text-red-500 mb-4" />
                        <h3 className="text-lg font-semibold text-red-900 dark:text-red-400">{error}</h3>
                        <p className="mt-2 text-sm text-red-700 dark:text-red-300">Silakan hubungi bagian HRD jika Anda merasa ini adalah kesalahan.</p>
                    </div>
                ) : contract ? (
                    <div className="space-y-6">
                        <div className={`rounded-xl border p-6 flex flex-col sm:flex-row items-center justify-between gap-4 ${contract.status === 'active' ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-900/10' : 'border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800'}`}>
                            <div className="flex items-center gap-4 text-center sm:text-left">
                                <div className={`rounded-full p-3 ${contract.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-neutral-100 dark:bg-neutral-700'}`}>
                                    <CheckCircle className={`h-8 w-8 ${contract.status === 'active' ? 'text-emerald-600' : 'text-neutral-500'}`} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Status: <span className={contract.status === 'active' ? 'text-emerald-600' : ''}>{contract.status.toUpperCase()}</span></h2>
                                    <p className="font-mono text-sm text-neutral-500">No. {contract.contract_number}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 w-full sm:w-auto">
                                <a href={`/contracts/${contract.id}/download`} target="_blank" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700 dark:hover:bg-neutral-700">
                                    <Download className="h-4 w-4" /> Unduh Draft PDF
                                </a>
                                {contract.signed_file ? (
                                    <a href={`/storage/${contract.signed_file}`} target="_blank" className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
                                        <FileCheck className="h-4 w-4" /> Lihat Dokumen Tanda Tangan
                                    </a>
                                ) : (
                                    <div className="flex items-center justify-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium text-sm p-2">
                                        <TriangleAlert className="h-4 w-4" />
                                        <span>Menunggu Tanda Tangan</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <SectionCard title="📅 Masa Berlaku" icon={Calendar}>
                                <InfoRow label="Tanggal Mulai" value={format(new Date(contract.start_date), 'dd MMMM yyyy', { locale: id })} />
                                <InfoRow label="Tanggal Berakhir" value={
                                    <span className="text-red-600 font-medium">{format(new Date(contract.end_date), 'dd MMMM yyyy', { locale: id })}</span>
                                } />
                            </SectionCard>

                            <SectionCard title="💰 Ringkasan Penghasilan" icon={Info}>
                                <InfoRow label="Gaji Pokok" value={formatCurrency(contract.base_salary)} />
                                <InfoRow label="Tunjangan Jabatan" value={formatCurrency(contract.position_allowance)} />
                                <p className="mt-4 text-[10px] text-neutral-500 italic text-center">*Rincian lengkap penghasilan lainnya dapat dilihat pada dokumen PDF kontrak.</p>
                            </SectionCard>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl border border-neutral-200 bg-white p-20 text-center dark:border-neutral-700 dark:bg-neutral-900">
                        <Clock className="mx-auto h-16 w-16 text-neutral-200 dark:text-neutral-800 mb-4" />
                        <h3 className="text-xl font-medium text-neutral-500">Belum Ada Kontrak Aktif</h3>
                        <p className="mt-2 text-neutral-400">Kontrak kerja Anda akan muncul di sini setelah diterbitkan oleh tim HRD.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
