import { Head, router, usePage } from '@inertiajs/react';
import { Briefcase, ArrowLeft, Copy, Users, MapPin, Calendar, Building2, Check, X, FileText, ExternalLink, Brain, ClipboardList, DollarSign, Clock, Link2 } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Application {
    id: number;
    uuid: string;
    name: string;
    email: string | null;
    phone: string;
    requirement_checklist: string[] | null;
    cv_files: { path: string; name: string }[] | null;
    status: string;
    recruitment_form: any | null;
    recruitment_form_submitted_at: string | null;
    disc_test: any | null;
    mbti_test: any | null;
    created_at: string;
}

interface Opening {
    id: number;
    uuid: string;
    company: string;
    position: string;
    working_location: string;
    requested_by: string;
    salary_min: string | null;
    salary_max: string | null;
    contract_duration: string | null;
    requirements: string[] | null;
    status: 'open' | 'closed';
    applications: Application[];
    created_at: string;
}

interface Props {
    opening: Opening;
    publicUrl: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    pending: { label: 'Menunggu', color: 'bg-amber-50 text-amber-600 border-amber-200' },
    rejected: { label: 'Ditolak', color: 'bg-red-50 text-red-600 border-red-200' },
    interview: { label: 'Interview', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    form_filling: { label: 'Mengisi Form', color: 'bg-purple-50 text-purple-600 border-purple-200' },
    testing: { label: 'Tes Psikologi', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
    completed: { label: 'Selesai', color: 'bg-teal-50 text-teal-600 border-teal-200' },
    accepted: { label: 'Diterima', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
};

export default function JobOpeningsShow({ opening, publicUrl }: Props) {
    const { auth } = usePage<any>().props;
    const canEdit = auth.user.isAdmin || auth.user.permissions?.includes('create-recruitment') || auth.user.can?.includes('create-recruitment');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Recruitment', href: '/recruitment' },
        { title: 'Lowongan Kerja', href: '/job-openings' },
        { title: opening.position, href: '#' },
    ];

    const fmt = (n: string | null) => n ? 'Rp ' + new Intl.NumberFormat('id-ID').format(Number(n)) : '-';

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const updateStatus = (appId: number, status: string) => {
        if (status === 'rejected' && !confirm('Yakin ingin menolak pelamar ini?')) return;
        router.patch(`/job-openings/applications/${appId}/status`, { status }, { preserveScroll: true });
    };

    const toggleOpening = () => {
        router.patch(`/job-openings/${opening.id}`, { status: opening.status === 'open' ? 'closed' : 'open' }, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Lowongan - ${opening.position}`} />

            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3 sm:gap-4">
                        <Button variant="outline" size="icon" className="rounded-full shrink-0 mt-1" onClick={() => router.get('/job-openings')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">{opening.position}</h1>
                                <Badge variant="outline" className={opening.status === 'open' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-neutral-100 text-neutral-500 border-neutral-200'}>
                                    {opening.status === 'open' ? 'Dibuka' : 'Ditutup'}
                                </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500">
                                <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {opening.company}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {opening.working_location}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 sm:gap-3">
                        {canEdit && (
                            <Button variant="outline" className="h-10 text-sm" onClick={toggleOpening}>
                                {opening.status === 'open' ? 'Tutup Lowongan' : 'Buka Kembali'}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Details + Shareable Link */}
                    <div className="space-y-6">
                        {/* Shareable Link Card */}
                        <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/20 dark:border-indigo-900/50 p-5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3 flex items-center gap-1.5">
                                <Link2 className="w-3.5 h-3.5" /> Link Lamaran
                            </h3>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 text-xs bg-white dark:bg-neutral-900 border border-indigo-200 dark:border-indigo-800 rounded-lg px-3 py-2.5 text-indigo-700 dark:text-indigo-300 truncate block">{publicUrl}</code>
                                <Button size="sm" variant="outline" className="shrink-0 border-indigo-300 text-indigo-600" onClick={() => copyToClipboard(publicUrl, 'public')}>
                                    {copiedId === 'public' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>

                        {/* Details Card */}
                        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">Detail Lowongan</h3>
                            <div className="space-y-4 text-sm">
                                <div><span className="text-neutral-400 block text-xs">Diminta Oleh</span><span className="font-bold text-neutral-800 dark:text-white">{opening.requested_by}</span></div>
                                <div><span className="text-neutral-400 block text-xs">Gaji</span><span className="font-bold text-neutral-800 dark:text-white">{fmt(opening.salary_min)} - {fmt(opening.salary_max)}</span></div>
                                <div><span className="text-neutral-400 block text-xs">Durasi Kontrak</span><span className="font-bold text-neutral-800 dark:text-white">{opening.contract_duration || '-'}</span></div>
                                <div><span className="text-neutral-400 block text-xs">Tanggal Dibuat</span><span className="font-bold text-neutral-800 dark:text-white">{new Date(opening.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                            </div>
                        </div>

                        {/* Requirements Card */}
                        {opening.requirements && opening.requirements.length > 0 && (
                            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">Persyaratan</h3>
                                <ol className="space-y-2 text-sm">
                                    {opening.requirements.map((r, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="text-indigo-500 font-bold text-xs mt-0.5 shrink-0">{i + 1}.</span>
                                            <span className="text-neutral-700 dark:text-neutral-300">{r}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}
                    </div>

                    {/* Right: Applicants */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
                            <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                                <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                                    <Users className="w-4 h-4 text-indigo-500" /> Pelamar ({opening.applications.length})
                                </h3>
                            </div>

                            {opening.applications.length === 0 ? (
                                <div className="py-16 text-center text-neutral-400 text-sm italic">Belum ada pelamar.</div>
                            ) : (
                                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {opening.applications.map((app) => {
                                        const st = STATUS_LABELS[app.status] || { label: app.status, color: 'bg-neutral-100 text-neutral-500 border-neutral-200' };
                                        const formLink = `${window.location.origin}/career/form/${app.uuid}`;
                                        return (
                                            <div key={app.id} className="p-4 sm:p-5 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                                            <a href={`/job-openings/applications/${app.id}`} className="font-bold text-neutral-900 dark:text-white hover:text-indigo-600 truncate transition-colors">{app.name}</a>
                                                            <Badge variant="outline" className={`text-[10px] ${st.color}`}>{st.label}</Badge>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                                                            <span>{app.phone}</span>
                                                            {app.email && <span>{app.email}</span>}
                                                            <span><Calendar className="w-3 h-3 inline mr-0.5" />{new Date(app.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                                        </div>

                                                        {/* CV Downloads */}
                                                        {app.cv_files && app.cv_files.length > 0 && (
                                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                                {app.cv_files.map((f, i) => (
                                                                    <a key={i} href={`/storage/${f.path}`} target="_blank" className="inline-flex items-center gap-1 text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-2 py-1 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                                                        <FileText className="w-3 h-3" /> {f.name}
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Form link for interview status */}
                                                        {app.status === 'interview' && (
                                                            <div className="mt-2 flex items-center gap-2">
                                                                <code className="text-[10px] bg-blue-50 dark:bg-blue-950/30 text-blue-600 px-2 py-1 rounded truncate max-w-[200px] sm:max-w-[300px] block">{formLink}</code>
                                                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-blue-500" onClick={() => copyToClipboard(formLink, `form-${app.id}`)}>
                                                                    {copiedId === `form-${app.id}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                                </Button>
                                                            </div>
                                                        )}

                                                        {/* Test Results */}
                                                        {(app.disc_test || app.mbti_test) && (
                                                            <div className="flex gap-2 mt-2">
                                                                {app.disc_test && (
                                                                    <a href={`/recruitment/${app.disc_test.id}`} className="inline-flex items-center gap-1 text-[10px] bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 px-2 py-1 rounded-md font-bold hover:bg-indigo-100 transition-colors">
                                                                        <Brain className="w-3 h-3" /> DISC: {app.disc_test.results?.dominant_trait}
                                                                    </a>
                                                                )}
                                                                {app.mbti_test && (
                                                                    <a href={`/recruitment/${app.mbti_test.id}`} className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 px-2 py-1 rounded-md font-bold hover:bg-emerald-100 transition-colors">
                                                                        <Brain className="w-3 h-3" /> MBTI: {app.mbti_test.results?.type}
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Action Buttons */}
                                                    {canEdit && (
                                                        <div className="flex gap-2 shrink-0">
                                                            {app.status === 'pending' && (
                                                                <>
                                                                    <Button size="sm" className="bg-red-500 hover:bg-red-600 h-8 text-xs" onClick={() => updateStatus(app.id, 'rejected')}>
                                                                        <X className="w-3 h-3 mr-1" /> Tolak
                                                                    </Button>
                                                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 text-xs" onClick={() => updateStatus(app.id, 'interview')}>
                                                                        <Check className="w-3 h-3 mr-1" /> Interview
                                                                    </Button>
                                                                </>
                                                            )}
                                                            {(app.status === 'completed' || app.status === 'interview') && (
                                                                <>
                                                                    <Button size="sm" className="bg-red-500 hover:bg-red-600 h-8 text-xs" onClick={() => updateStatus(app.id, 'rejected')}>
                                                                        <X className="w-3 h-3 mr-1" /> Tolak
                                                                    </Button>
                                                                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-8 text-xs" onClick={() => updateStatus(app.id, 'accepted')}>
                                                                        <Check className="w-3 h-3 mr-1" /> Terima
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
