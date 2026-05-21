import { Head, router } from '@inertiajs/react';
import { ArrowLeft, User, FileText, Printer, CheckCircle2, Download, Building2, MapPin } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

interface Application {
    id: number;
    uuid: string;
    job_opening_id: number;
    name: string;
    email: string | null;
    phone: string;
    address: string | null;
    requirement_checklist: string[] | null;
    cv_files: { path: string; name: string }[] | null;
    status: string;
    recruitment_form: any | null;
    recruitment_form_submitted_at: string | null;
    created_at: string;
    job_opening: {
        id: number;
        position: string;
        company: string;
        working_location: string;
    };
}

interface Props {
    application: Application;
}

export default function ApplicationShow({ application }: Props) {
    const opening = application.job_opening;
    const form = typeof application.recruitment_form === 'string' ? JSON.parse(application.recruitment_form) : application.recruitment_form;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Lowongan Kerja', href: '/job-openings' },
        { title: opening.position, href: `/job-openings/${opening.id}` },
        { title: 'Detail Pelamar', href: '#' },
    ];

    const handlePrint = () => {
        window.open(`/job-openings/applications/${application.id}/pdf`, '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Pelamar - ${application.name}`} />

            <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3 sm:gap-4">
                        <Button variant="outline" size="icon" className="rounded-full shrink-0 mt-1" onClick={() => router.get(`/job-openings/${opening.id}`)}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-1">{application.name}</h1>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500">
                                <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {opening.position} - {opening.company}</span>
                                <span>{application.phone}</span>
                                {application.email && <span>{application.email}</span>}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {form && (
                            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700" onClick={handlePrint}>
                                <Printer className="w-4 h-4" /> Cetak Form Lamaran
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Application Details */}
                    <div className="space-y-6">
                        {/* Status & Basic Info */}
                        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">Informasi Aplikasi</h3>
                            <div className="space-y-3 text-sm">
                                <div><span className="text-neutral-400 block text-xs">Status Saat Ini</span><span className="font-bold uppercase text-indigo-600">{application.status}</span></div>
                                <div><span className="text-neutral-400 block text-xs">Tanggal Melamar</span><span className="font-bold text-neutral-800 dark:text-white">{new Date(application.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                                {application.address && <div><span className="text-neutral-400 block text-xs">Alamat Singkat</span><span className="font-medium text-neutral-800 dark:text-white">{application.address}</span></div>}
                            </div>
                        </div>

                        {/* Requirement Checklist */}
                        {application.requirement_checklist && application.requirement_checklist.length > 0 && (
                            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">Syarat yang Dipenuhi</h3>
                                <div className="space-y-2">
                                    {application.requirement_checklist.map((req: string, i: number) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                            <span className="text-sm text-neutral-700 dark:text-neutral-300">{req}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CV Files */}
                        {application.cv_files && application.cv_files.length > 0 && (
                            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">Dokumen Pelamar</h3>
                                <div className="space-y-2">
                                    {application.cv_files.map((file: {path: string, name: string}, i: number) => (
                                        <a key={i} href={`/storage/${file.path}`} target="_blank" className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-neutral-800 transition-colors group">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                                                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate">{file.name}</span>
                                            </div>
                                            <Download className="w-4 h-4 text-neutral-400 group-hover:text-indigo-600 shrink-0 ml-2" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Recruitment Form Biodata */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
                            <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                                <User className="w-4 h-4 text-indigo-500" />
                                <h3 className="font-bold text-neutral-900 dark:text-white">Formulir Biodata Lengkap</h3>
                            </div>
                            
                            <div className="p-5">
                                {!form ? (
                                    <div className="text-center py-12">
                                        <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3">
                                            <FileText className="w-6 h-6 text-neutral-400" />
                                        </div>
                                        <p className="text-sm text-neutral-500">Pelamar belum mengisi formulir biodata lengkap.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {/* Personal Info */}
                                        <section>
                                            <h4 className="text-sm font-bold text-indigo-600 mb-3 uppercase tracking-wide">Data Pribadi</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                                                <div><span className="text-neutral-400 text-xs block">Nama Lengkap</span><span className="font-medium text-neutral-900 dark:text-neutral-100">{form.full_name || '-'}</span></div>
                                                <div><span className="text-neutral-400 text-xs block">Jenis Kelamin</span><span className="font-medium text-neutral-900 dark:text-neutral-100">{form.sex || '-'}</span></div>
                                                <div><span className="text-neutral-400 text-xs block">Status Pernikahan</span><span className="font-medium text-neutral-900 dark:text-neutral-100">{form.marital_status || '-'}</span></div>
                                                <div><span className="text-neutral-400 text-xs block">Agama</span><span className="font-medium text-neutral-900 dark:text-neutral-100">{form.religion || '-'}</span></div>
                                                <div><span className="text-neutral-400 text-xs block">Tinggi / Berat</span><span className="font-medium text-neutral-900 dark:text-neutral-100">{form.height ? `${form.height} cm` : '-'} / {form.weight ? `${form.weight} kg` : '-'}</span></div>
                                                <div className="sm:col-span-2"><span className="text-neutral-400 text-xs block">Alamat</span><span className="font-medium text-neutral-900 dark:text-neutral-100">{form.current_address || '-'}</span></div>
                                            </div>
                                        </section>

                                        {/* Education */}
                                        {form.education && form.education.length > 0 && (
                                            <section>
                                                <h4 className="text-sm font-bold text-indigo-600 mb-3 uppercase tracking-wide">Pendidikan Formal</h4>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm text-left">
                                                        <thead className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800">
                                                            <tr><th className="px-3 py-2 rounded-l-md">Jenjang</th><th className="px-3 py-2">Sekolah</th><th className="px-3 py-2">Jurusan</th><th className="px-3 py-2">Tahun</th><th className="px-3 py-2 rounded-r-md">IPK/Nilai</th></tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                                            {form.education.map((item: any, i: number) => (
                                                                <tr key={i}><td className="px-3 py-2">{item.level}</td><td className="px-3 py-2 font-medium">{item.school}</td><td className="px-3 py-2">{item.major}</td><td className="px-3 py-2">{item.year}</td><td className="px-3 py-2">{item.gpa}</td></tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </section>
                                        )}

                                        {/* Work Experience */}
                                        {form.work_experience && form.work_experience.length > 0 && (
                                            <section>
                                                <h4 className="text-sm font-bold text-indigo-600 mb-3 uppercase tracking-wide">Pengalaman Kerja</h4>
                                                <div className="space-y-3">
                                                    {form.work_experience.map((item: any, i: number) => (
                                                        <div key={i} className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4 border border-neutral-100 dark:border-neutral-800">
                                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                                                                <span className="font-bold text-neutral-900 dark:text-white">{item.company}</span>
                                                                <span className="text-xs text-neutral-500">{item.from} - {item.to}</span>
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mt-2">
                                                                <div><span className="text-neutral-400 text-xs block">Gaji Terakhir</span><span className="font-medium">{item.last_salary}</span></div>
                                                                <div><span className="text-neutral-400 text-xs block">Alasan Keluar</span><span className="font-medium">{item.reason_quit}</span></div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                        {/* Skills & Others */}
                                        <section>
                                            <h4 className="text-sm font-bold text-indigo-600 mb-3 uppercase tracking-wide">Keahlian & Info Tambahan</h4>
                                            <div className="space-y-4 text-sm">
                                                <div><span className="text-neutral-400 text-xs block">Keahlian</span><div className="font-medium whitespace-pre-wrap">{form.skills || '-'}</div></div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div><span className="text-neutral-400 text-xs block">Harapan Gaji</span><span className="font-medium">{form.salary_expectation || '-'}</span></div>
                                                    <div><span className="text-neutral-400 text-xs block">Riwayat Penyakit</span><span className="font-medium text-red-600">{form.has_serious_illness ? `Ya: ${form.illness_detail}` : 'Tidak Ada'}</span></div>
                                                </div>
                                                <div><span className="text-neutral-400 text-xs block">Alasan Tertarik Bergabung</span><div className="font-medium whitespace-pre-wrap italic bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg border border-neutral-100 dark:border-neutral-700">"{form.why_interested || '-'}"</div></div>
                                            </div>
                                        </section>

                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
