import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Clock, FileText, CheckCircle2, XCircle, User, MapPin, Calendar, Info } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Overtime } from '@/types';

interface Props {
    overtime: Overtime;
    canFirstApproval: boolean;
    canSecondApproval: boolean;
    isAdmin: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Form Lembur', href: '/overtimes' },
    { title: 'Detail', href: '#' },
];

export default function OvertimeShow() {
    const { overtime, canFirstApproval, canSecondApproval, isAdmin } = usePage<any>().props as unknown as Props;
    const { data, setData, post, processing } = useForm({
        notes: '',
    });

    const handleApprove = () => {
        if (confirm('Apakah Anda yakin ingin menyetujui pengajuan ini?')) {
            post(`/overtimes/${overtime.id}/approve`);
        }
    };

    const handleReject = () => {
        if (!data.notes) {
            alert('Silakan isi catatan untuk penolakan.');
            return;
        }
        if (confirm('Apakah Anda yakin ingin menolak pengajuan ini?')) {
            post(`/overtimes/${overtime.id}/reject`);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400"><CheckCircle2 className="w-4 h-4" /> Disetujui</span>;
            case 'rejected':
                return <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400"><XCircle className="w-4 h-4" /> Ditolak</span>;
            case 'partially_approved':
                return <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"><Clock className="w-4 h-4" /> Menunggu Management</span>;
            default:
                return <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"><Info className="w-4 h-4" /> Menunggu Atasan</span>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Pengajuan Lembur" />
            <div className="mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Link href="/overtimes" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold dark:text-white">Detail Lembur</h1>
                            <p className="text-xs text-neutral-500">ID: #LEM-{overtime.id}</p>
                        </div>
                    </div>
                    {getStatusBadge(overtime.status)}
                </div>

                <div className="space-y-6">
                    {/* Information Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="flex items-center gap-3 text-sm text-neutral-500 mb-2">
                                <User className="w-4 h-4" /> Pengaju
                            </div>
                            <p className="font-semibold text-neutral-900 dark:text-white">{overtime.creator?.nama}</p>
                            <p className="text-xs text-neutral-500">{overtime.creator?.nik}</p>
                        </div>
                        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="flex items-center gap-3 text-sm text-neutral-500 mb-2">
                                <Calendar className="w-4 h-4" /> Tanggal
                            </div>
                            <p className="font-semibold text-neutral-900 dark:text-white">
                                {new Date(overtime.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                            <p className="text-xs text-neutral-500">{overtime.jam_mulai.substring(0, 5)} - {overtime.jam_berakhir.substring(0, 5)} ({overtime.durasi} Jam)</p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center gap-3 text-sm text-neutral-500 mb-2">
                            <MapPin className="w-4 h-4" /> Lokasi Kerja
                        </div>
                        <p className="font-semibold text-neutral-900 dark:text-white">{overtime.working_location?.name || overtime.lokasi_kerja}</p>
                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center gap-3 text-sm text-neutral-500 mb-4">
                            <User className="w-4 h-4" /> Daftar Karyawan ({overtime.employees.length})
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {overtime.employees.map(emp => (
                                <span key={emp.id} className="inline-flex items-center rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                    {emp.nama}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="text-sm text-neutral-500 mb-2">Keperluan</div>
                        <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed italic">"{overtime.keperluan}"</p>
                    </div>

                    {/* Approvals Section */}
                    <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-800/20">
                        <h3 className="text-sm font-semibold mb-3">Status Persetujuan</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className={`mt-1 h-2 w-2 rounded-full ${overtime.supervisor_status === 'approved' ? 'bg-green-500' : overtime.supervisor_status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                                <div className="flex-1">
                                    <p className="text-xs font-medium">Persetujuan Atasan (Supervisor/Manager HR)</p>
                                    <p className="text-xs text-neutral-500 capitalize">{overtime.supervisor_status}</p>
                                    {overtime.supervisor_notes && <p className="mt-1 text-xs italic text-neutral-600 dark:text-neutral-400">"{overtime.supervisor_notes}"</p>}
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className={`mt-1 h-2 w-2 rounded-full ${overtime.manager_status === 'approved' ? 'bg-green-500' : overtime.manager_status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                                <div className="flex-1">
                                    <p className="text-xs font-medium">Persetujuan Management</p>
                                    <p className="text-xs text-neutral-500 capitalize">{overtime.manager_status}</p>
                                    {overtime.manager_notes && <p className="mt-1 text-xs italic text-neutral-600 dark:text-neutral-400">"{overtime.manager_notes}"</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PDF Download Button */}
                    {overtime.status === 'approved' && (
                        <a
                            href={`/overtimes/${overtime.id}/pdf`}
                            className="flex items-center justify-center gap-2 w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-700 transition-all active:scale-[0.98]"
                        >
                            <FileText className="w-5 h-5" /> Download Form Lembur (PDF)
                        </a>
                    )}

                    {/* Action Buttons */}
                    {(canFirstApproval || canSecondApproval) && (
                        <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Catatan Persetujuan/Penolakan</label>
                                <textarea
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    className="block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                                    placeholder="Wajib diisi jika menolak..."
                                    rows={2}
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleReject}
                                    disabled={processing}
                                    className="flex-1 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                                >
                                    Tolak
                                </button>
                                <button
                                    onClick={handleApprove}
                                    disabled={processing}
                                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Setujui
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
