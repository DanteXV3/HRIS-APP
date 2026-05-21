import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { FileText, ArrowLeft, Download, Calendar, User, Briefcase, Building2 } from 'lucide-react';

interface WarningLetter {
    id: number;
    employee: {
        nama: string;
        nik: string;
        department?: { name: string };
        position?: { name: string };
        work_location?: { name: string };
    };
    issuer: { 
        nama: string;
        position?: { name: string };
    };
    level: number;
    reference_number: string;
    reason: string;
    description: string;
    issued_date: string;
    valid_until: string;
    status: string;
    level_roman: string;
}

interface Props {
    warningLetter: WarningLetter;
}

export default function WarningLetterShow({ warningLetter }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Surat Peringatan', href: '/warning-letters' },
        { title: 'Detail', href: '#' },
    ];

    const getLevelBadge = (level: number) => {
        switch (level) {
            case 1: return <span className="px-3 py-1 text-sm font-bold rounded-full bg-amber-100 text-amber-800 border-2 border-amber-200">SP-I</span>;
            case 2: return <span className="px-3 py-1 text-sm font-bold rounded-full bg-orange-100 text-orange-800 border-2 border-orange-200">SP-II</span>;
            case 3: return <span className="px-3 py-1 text-sm font-bold rounded-full bg-red-100 text-red-800 border-2 border-red-200">SP-III</span>;
            default: return <span className="px-3 py-1 text-sm font-bold rounded-full bg-neutral-100 text-neutral-800 border-2 border-neutral-200">SP-{level}</span>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail SP - ${warningLetter.employee.nama}`} />
            
            <div className="p-6 max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/warning-letters" className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                                <FileText className="w-6 h-6 text-red-600" />
                                Detail Surat Peringatan
                            </h1>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-mono">
                                No: {warningLetter.reference_number}
                            </p>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => window.open(`/warning-letters/${warningLetter.id}/pdf`, '_blank')}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-red-500/20 active:scale-95"
                    >
                        <Download className="w-4 h-4" />
                        Cetak PDF
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Tingkat Surat Peringatan</p>
                                    <div className="pt-1">{getLevelBadge(warningLetter.level)}</div>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Status</p>
                                    <p className="text-sm font-bold text-emerald-600 uppercase italic">{warningLetter.status}</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">Ringkasan Pelanggaran</h3>
                                    <p className="text-lg font-bold text-neutral-900 dark:text-white leading-snug">
                                        {warningLetter.reason}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">Rincian Pelanggaran</h3>
                                    <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
                                        <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">
                                            {warningLetter.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 pt-4">
                                    <div className="space-y-2 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-200">
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase">
                                            <Calendar className="w-3 h-3" />
                                            Tanggal Terbit
                                        </div>
                                        <p className="text-lg font-bold">
                                            {new Date(warningLetter.issued_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="space-y-2 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30 text-red-800 dark:text-red-200">
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase">
                                            <Calendar className="w-3 h-3" />
                                            Berlaku Sampai
                                        </div>
                                        <p className="text-lg font-bold">
                                            {new Date(warningLetter.valid_until).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm">
                            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-6">Pihak Terkait</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
                                <div className="space-y-4">
                                    <p className="text-xs font-bold text-neutral-500 uppercase">Yang Menyerahkan</p>
                                    <div className="mx-auto w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-neutral-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-neutral-900 dark:text-white">{warningLetter.issuer.nama}</p>
                                        <p className="text-xs text-neutral-500">{warningLetter.issuer.position?.name ?? '-'}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-xs font-bold text-neutral-500 uppercase">Yang Menerima</p>
                                    <div className="mx-auto w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-neutral-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-neutral-900 dark:text-white">{warningLetter.employee.nama}</p>
                                        <p className="text-xs text-neutral-500">{warningLetter.employee.nik}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Info Panel */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm overflow-hidden relative">
                            <div className="absolute top-0 right-0 -mt-2 -mr-2 p-8 opacity-5">
                                <User className="w-24 h-24" />
                            </div>
                            
                            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-6">Informasi Karyawan</h3>
                            
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg shrink-0">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500">Nama Lengkap</p>
                                        <p className="text-sm font-bold text-neutral-900 dark:text-white">{warningLetter.employee.nama}</p>
                                        <p className="text-[10px] font-mono font-bold text-neutral-400">NIK: {warningLetter.employee.nik}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg shrink-0">
                                        <Briefcase className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500">Jabatan</p>
                                        <p className="text-sm font-bold text-neutral-900 dark:text-white">{warningLetter.employee.position?.name ?? '-'}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg shrink-0">
                                        <Building2 className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500">Departemen</p>
                                        <p className="text-sm font-bold text-neutral-900 dark:text-white">{warningLetter.employee.department?.name ?? '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-red-800 dark:text-red-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Catatan Penting
                            </h3>
                            <ul className="text-xs text-red-700 dark:text-red-300 space-y-2 list-disc pl-4 italic">
                                <li>Surat Peringatan ini bersifat rahasia.</li>
                                <li>Pelanggaran serupa dalam masa berlaku dapat mengakibatkan sanksi lebih berat.</li>
                                <li>Karyawan diharapkan melakukan perbaikan performa/sikap segera.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
