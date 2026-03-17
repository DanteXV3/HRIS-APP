import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Employee } from '@/types';

interface Props {
    employee: Employee;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="grid grid-cols-3 gap-4 border-b border-neutral-100 py-3 last:border-0 dark:border-neutral-800">
            <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{label}</dt>
            <dd className="col-span-2 text-sm text-neutral-900 dark:text-white">{value || <span className="text-neutral-400">-</span>}</dd>
        </div>
    );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
            <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-3 dark:border-neutral-700 dark:bg-neutral-800">
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

export default function EmployeeShow() {
    const { employee } = usePage<{ props: Props }>().props as unknown as Props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Karyawan', href: '/employees' },
        { title: employee.nama, href: '#' },
    ];

    const gradeColors: Record<string, string> = {
        staff: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
        supervisor: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
        manager: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={employee.nama} />
            <div className="mx-auto max-w-5xl space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/employees" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{employee.nama}</h1>
                            <div className="mt-1 flex items-center gap-2 text-sm text-neutral-500">
                                <span className="font-mono">{employee.nik}</span>
                                <span>•</span>
                                <span>{employee.position?.name}</span>
                                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${gradeColors[employee.position?.grade ?? 'staff']}`}>
                                    {employee.position?.grade}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Link href={`/employees/${employee.id}/edit`}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                        <Edit className="h-4 w-4" /> Edit
                    </Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <SectionCard title="👤 Data Pribadi">
                        <InfoRow label="Email" value={employee.email} />
                        <InfoRow label="Gender" value={employee.gender === 'laki-laki' ? 'Laki-laki' : employee.gender === 'perempuan' ? 'Perempuan' : null} />
                        <InfoRow label="Tempat, Tanggal Lahir" value={employee.tempat_lahir && employee.tanggal_lahir ? `${employee.tempat_lahir}, ${employee.tanggal_lahir}` : employee.tempat_lahir || employee.tanggal_lahir} />
                        <InfoRow label="Agama" value={employee.agama} />
                        <InfoRow label="Pendidikan Terakhir" value={employee.pendidikan_terakhir} />
                        <InfoRow label="Status Pernikahan" value={employee.status_pernikahan} />
                        <InfoRow label="No. Telpon 1" value={employee.no_telpon_1} />
                        <InfoRow label="No. Telpon 2" value={employee.no_telpon_2} />
                        <InfoRow label="Alamat Tetap" value={employee.alamat_tetap} />
                        <InfoRow label="Alamat Sekarang" value={employee.alamat_sekarang} />
                    </SectionCard>

                    <SectionCard title="🏢 Kepegawaian">
                        <InfoRow label="Departemen" value={employee.department?.name} />
                        <InfoRow label="Jabatan" value={employee.position?.name} />
                        <InfoRow label="Penempatan" value={employee.work_location?.name} />
                        <InfoRow label="Status" value={employee.status_kepegawaian?.toUpperCase()} />
                        <InfoRow label="Tanggal Masuk" value={employee.hire_date} />
                        <InfoRow label="Tanggal Berakhir" value={employee.end_date} />
                        <InfoRow label="Status Aktif" value={
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${employee.is_active ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${employee.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                {employee.is_active ? 'Aktif' : 'Non-aktif'}
                            </span>
                        } />
                    </SectionCard>

                    <SectionCard title="🆔 Identitas & Pajak">
                        <InfoRow label="No. KTP" value={employee.no_ktp} />
                        <InfoRow label="NPWP" value={employee.npwp} />
                        <InfoRow label="BPJS Ketenagakerjaan" value={employee.no_bpjs_ketenagakerjaan} />
                        <InfoRow label="BPJS Kesehatan" value={employee.no_bpjs_kesehatan} />
                    </SectionCard>

                    <SectionCard title="🏦 Data Bank">
                        <InfoRow label="Nama Bank" value={employee.nama_bank} />
                        <InfoRow label="Cabang" value={employee.cabang_bank} />
                        <InfoRow label="No. Rekening" value={employee.no_rekening} />
                        <InfoRow label="Nama Rekening" value={employee.nama_rekening} />
                    </SectionCard>

                    <SectionCard title="🚨 Kontak Darurat">
                        <InfoRow label="Kontak 1" value={employee.nama_kontak_darurat_1 ? `${employee.nama_kontak_darurat_1} (${employee.no_kontak_darurat_1})` : null} />
                        <InfoRow label="Kontak 2" value={employee.nama_kontak_darurat_2 ? `${employee.nama_kontak_darurat_2} (${employee.no_kontak_darurat_2})` : null} />
                    </SectionCard>

                    <SectionCard title="💰 Gaji & Tunjangan">
                        <InfoRow label="Gaji Pokok" value={formatCurrency(employee.gaji_pokok)} />
                        <InfoRow label="Tunjangan Jabatan" value={formatCurrency(employee.tunjangan_jabatan)} />
                        <InfoRow label="Tunjangan Kehadiran" value={formatCurrency(employee.tunjangan_kehadiran)} />
                        <InfoRow label="Tunjangan Transportasi" value={formatCurrency(employee.tunjangan_transportasi)} />
                        <InfoRow label="Uang Makan" value={formatCurrency(employee.uang_makan)} />
                        <InfoRow label="Uang Lembur" value={formatCurrency(employee.uang_lembur)} />
                        <InfoRow label="THR" value={formatCurrency(employee.thr)} />
                        <InfoRow label="Gaji BPJS TK" value={formatCurrency(employee.gaji_bpjs_tk)} />
                        <InfoRow label="Gaji BPJS JKN" value={formatCurrency(employee.gaji_bpjs_jkn)} />
                        <InfoRow label="Gross Up (PPh21)" value={employee.gross_up ? 'Ya — Ditanggung Perusahaan' : 'Tidak — Dipotong dari Karyawan'} />
                    </SectionCard>

                    <SectionCard title="➖ Potongan">
                        <InfoRow label="Pinjaman Koperasi" value={formatCurrency(employee.pinjaman_koperasi)} />
                        <InfoRow label="Potongan Lain 1" value={formatCurrency(employee.potongan_lain_1)} />
                        <InfoRow label="Potongan Lain 2" value={formatCurrency(employee.potongan_lain_2)} />
                    </SectionCard>

                    <SectionCard title="📄 Dokumen & Lampiran">
                        <InfoRow label="Pas Foto" value={employee.photo ? <a href={`/storage/${employee.photo}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Lihat Foto</a> : null} />
                        <InfoRow label="KTP" value={employee.file_ktp ? <a href={`/storage/${employee.file_ktp}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Lihat KTP</a> : null} />
                        <InfoRow label="NPWP" value={employee.file_npwp ? <a href={`/storage/${employee.file_npwp}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Lihat NPWP</a> : null} />
                        <InfoRow label="Kartu Keluarga" value={employee.file_kk ? <a href={`/storage/${employee.file_kk}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Lihat KK</a> : null} />
                        <InfoRow label="Ijazah" value={employee.file_ijazah ? <a href={`/storage/${employee.file_ijazah}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Lihat Ijazah</a> : null} />
                        <InfoRow label="Lain-lain" value={employee.file_lainnya && employee.file_lainnya.length > 0 ? (
                            <ul className="list-inside list-disc">
                                {employee.file_lainnya.map((path, i) => (
                                    <li key={i}><a href={`/storage/${path}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Dokumen {i + 1}</a></li>
                                ))}
                            </ul>
                        ) : null} />
                    </SectionCard>
                </div>
            </div>
        </AppLayout>
    );
}
