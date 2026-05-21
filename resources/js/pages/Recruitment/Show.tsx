import { Head, Link, router, usePage } from '@inertiajs/react';
import { Brain, ArrowLeft, Download, User, Info, FileText, BarChart3, TrendingUp, Briefcase, Calendar, Edit2, Trash2, Save, X } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Props {
    test: {
        id: number;
        candidate_name: string;
        candidate_info: string;
        test_type: 'disc' | 'mbti';
        results: any;
        tester?: { nama: string };
        created_at: string;
    };
}

export default function RecruitmentShow({ test }: Props) {
    const { auth } = usePage<any>().props;
    const canEdit = auth.user.isAdmin || auth.user.permissions?.includes('edit-recruitment') || auth.user.can?.includes('edit-recruitment');
    const canDelete = auth.user.isAdmin || auth.user.permissions?.includes('delete-recruitment') || auth.user.can?.includes('delete-recruitment');

    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        candidate_name: test.candidate_name,
        candidate_info: test.candidate_info
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Recruitment', href: '/recruitment' },
        { title: 'Hasil Tes', href: '#' },
    ];

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus hasil tes ini?')) {
            router.delete(`/recruitment/${test.id}`);
        }
    };

    const handleUpdate = () => {
        router.patch(`/recruitment/${test.id}`, form, {
            onSuccess: () => setIsEditing(false)
        });
    };

    const getDiscDescription = (trait: string) => {
        const desc: Record<string, string> = {
            'D': 'Dominance: Orang yang dominan cenderung fokus pada hasil, tegas, dan percaya diri. Mereka suka tantangan dan ingin mengendalikan situasi.',
            'I': 'Influence: Orang yang berpengaruh cenderung antusias, optimis, dan persuasif. Mereka suka berinteraksi sosial dan memotivasi orang lain.',
            'S': 'Steadiness: Orang yang stabil cenderung tenang, sabar, dan pendengar yang baik. Mereka setia dan menyukai lingkungan yang harmonis.',
            'C': 'Conscientiousness: Orang yang teliti cenderung analitis, cermat, dan fokus pada akurasi. Mereka mengikuti prosedur dan sangat logis.'
        };
        return desc[trait] || '';
    };

    const getMbtiTypeDescription = (type: string) => {
        // Very brief descriptions for 16 types
        const types: Record<string, string> = {
            'INTJ': 'Arsitek: Pemikir strategis, imajinatif dengan rencana untuk segalanya.',
            'INTP': 'Logikawan: Penemu inovatif dengan haus akan pengetahuan.',
            'ENTJ': 'Komandan: Pemimpin yang berani, imajinatif, dan berkemauan keras.',
            'ENTP': 'Debat: Pemikir cerdas dan penasaran yang tidak bisa menolak tantangan intelektual.',
            'INFJ': 'Advokat: Pendiam dan mistis, namun sangat inspiratif dan idealis.',
            'INFP': 'Mediator: Orang yang puitis, baik hati, dan altruistik, selalu ingin membantu.',
            'ENFJ': 'Protagonis: Pemimpin yang karismatik dan inspiratif, mampu memukau pendengarnya.',
            'ENFP': 'Juru Kampanye: Semangat yang antusias, kreatif, dan bebas yang selalu bisa menemukan alasan untuk tersenyum.',
            'ISTJ': 'Logistikus: Individu yang praktis dan berorientasi pada fakta, yang keandalannya tidak dapat diragukan.',
            'ISFJ': 'Pembela: Pelindung yang sangat berdedikasi dan hangat, selalu siap membela orang yang mereka cintai.',
            'ESTJ': 'Eksekutif: Administrator yang luar biasa, tidak tertandingi dalam mengelola sesuatu – atau orang.',
            'ESFJ': 'Konsul: Orang yang sangat peduli, sosial, dan populer, selalu ingin membantu.',
            'ISTP': 'Virtuoso: Pengrajin yang berani dan praktis, ahli dalam semua jenis alat.',
            'ISFP': 'Petualang: Seniman yang fleksibel dan menawan, selalu siap untuk menjelajahi dan mengalami sesuatu yang baru.',
            'ESTP': 'Pengusaha: Orang yang cerdas, energik, dan sangat perseptif, yang sangat suka hidup di ambang bahaya.',
            'ESFP': 'Penghibur: Orang yang spontan, energik, dan antusias – hidup tidak pernah membosankan di sekitar mereka.'
        };
        return types[type] || 'Tipe kepribadian yang kompleks.';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Hasil Tes - ${test.candidate_name}`} />

            <div className="mx-auto max-w-5xl px-6 py-8">
                <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" className="rounded-full shadow-sm" onClick={() => router.get('/recruitment')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex-1">
                            {isEditing ? (
                                <div className="space-y-3">
                                    <input 
                                        className="w-full text-2xl font-bold bg-transparent border-b-2 border-indigo-500 focus:outline-none dark:text-white"
                                        value={form.candidate_name}
                                        onChange={(e) => setForm({ ...form, candidate_name: e.target.value })}
                                    />
                                    <div className="flex items-center gap-2">
                                        <input 
                                            className="flex-1 text-sm text-neutral-500 bg-transparent border-b border-neutral-300 focus:outline-none"
                                            value={form.candidate_info}
                                            onChange={(e) => setForm({ ...form, candidate_info: e.target.value })}
                                            placeholder="Info Kandidat (e.g. Posisi)"
                                        />
                                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 h-8" onClick={handleUpdate}>
                                            <Save className="h-3 w-3 mr-1" /> Simpan
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{test.candidate_name}</h1>
                                        <Badge variant="outline" className={test.test_type === 'disc' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}>
                                            {test.test_type.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-neutral-500">{test.candidate_info || 'Kandidat Karyawan'}</p>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {canEdit && (
                            <Button 
                                variant="outline" 
                                className="h-11 shadow-sm border-amber-200 text-amber-600 hover:bg-amber-50"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? <><X className="h-4 w-4 mr-2" /> Batal</> : <><Edit2 className="h-4 w-4 mr-2" /> Edit</>}
                            </Button>
                        )}
                        {canDelete && (
                            <Button 
                                variant="outline" 
                                className="h-11 shadow-sm border-red-200 text-red-600 hover:bg-red-50"
                                onClick={handleDelete}
                            >
                                <Trash2 className="h-4 w-4 mr-2" /> Hapus
                            </Button>
                        )}
                        <Button variant="outline" className="h-11 shadow-sm" asChild>
                            <a href={`/recruitment/${test.id}/pdf`} target="_blank">
                                <Download className="h-4 w-4 mr-2" /> Download Laporan (PDF)
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Result Card */}
                        <div className="rounded-3xl border border-neutral-200 bg-white shadow-xl shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none overflow-hidden">
                            <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                                <TrendingUp className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10" />
                                <h3 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Profil Kepribadian</h3>
                                <div className="flex items-baseline gap-4">
                                    <h2 className="text-6xl font-black tracking-tighter">
                                        {test.test_type === 'disc' ? test.results?.dominant_trait : test.results?.type}
                                    </h2>
                                    <span className="text-xl font-bold opacity-90 uppercase">
                                        {test.test_type === 'disc' ? test.results?.trait_name : 'Personality Type'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8">
                                <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed italic border-l-4 border-indigo-200 pl-6 dark:border-indigo-900">
                                    {test.test_type === 'disc' 
                                        ? getDiscDescription(test.results?.dominant_trait)
                                        : getMbtiTypeDescription(test.results?.type)
                                    }
                                </p>

                                {test.test_type === 'disc' && (
                                    <div className="mt-12 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                                                <BarChart3 className="w-5 h-5 text-indigo-500" />
                                                Distribusi Skor DISC
                                            </h4>
                                            <div className="text-[10px] text-neutral-400 bg-neutral-100 px-2 py-1 rounded dark:bg-neutral-800 italic max-w-[300px]">
                                                Skor menunjukkan intensitas setiap karakter. Nilai positif (+) berarti karakter tersebut sering ditonjolkan, nilai negatif (-) berarti sering dihindari.
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {Object.entries(test.results?.scores || {}).map(([key, score]: [string, any]) => (
                                                <div key={key} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 flex flex-col items-center">
                                                    <span className="text-2xl font-black text-neutral-900 dark:text-white">{key}</span>
                                                    <span className={`text-sm font-bold mt-1 ${score > 0 ? 'text-emerald-600' : score < 0 ? 'text-red-600' : 'text-neutral-400'}`}>
                                                        {score > 0 ? `+${score}` : score}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {test.test_type === 'mbti' && (
                                    <div className="mt-12 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                                                <BarChart3 className="w-5 h-5 text-emerald-500" />
                                                Distribusi Skor MBTI
                                            </h4>
                                            <div className="text-[10px] text-neutral-400 bg-neutral-100 px-2 py-1 rounded dark:bg-neutral-800 italic max-w-[300px]">
                                                Menampilkan kecenderungan dominan di antara dua kutub. Semakin panjang warna di satu sisi, semakin kuat kecenderungan kandidat pada sifat tersebut.
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4">
                                            {[
                                                ['E', 'I'], ['S', 'N'], ['T', 'F'], ['J', 'P']
                                            ].map(([a, b]) => (
                                                <div key={a+b} className="space-y-2">
                                                    <div className="flex justify-between text-[10px] font-bold text-neutral-400">
                                                        <span>{a} ({test.results?.counts[a]})</span>
                                                        <span>{b} ({test.results?.counts[b]})</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-neutral-100 rounded-full dark:bg-neutral-800 flex overflow-hidden">
                                                        <div 
                                                            className="h-full bg-emerald-500" 
                                                            style={{ width: `${(test.results?.counts[a] / (test.results?.counts[a] + test.results?.counts[b] || 1)) * 100}%` }} 
                                                        />
                                                        <div 
                                                            className="h-full bg-indigo-500" 
                                                            style={{ width: `${(test.results?.counts[b] / (test.results?.counts[a] + test.results?.counts[b] || 1)) * 100}%` }} 
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Info Card */}
                        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h3 className="mb-6 text-xs font-bold uppercase tracking-wider text-neutral-400">Detail Administrasi</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-neutral-400">Tester / Diinput Oleh</p>
                                        <p className="text-sm font-bold text-neutral-900 dark:text-white">{test.tester?.nama || 'System'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-neutral-400">Tanggal Input</p>
                                        <p className="text-sm font-bold text-neutral-900 dark:text-white">
                                            {new Date(test.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                                        <Briefcase className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-neutral-400">Kandidat Untuk</p>
                                        <p className="text-sm font-bold text-neutral-900 dark:text-white">{test.candidate_info || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tips Card */}
                        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 dark:bg-indigo-900/10 dark:border-indigo-900/30">
                            <div className="flex items-center gap-3 mb-4">
                                <Info className="w-5 h-5 text-indigo-600" />
                                <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">Catatan HR</h3>
                            </div>
                            <p className="text-xs text-indigo-700 dark:text-indigo-400 leading-relaxed">
                                Hasil tes ini sebaiknya dipadukan dengan hasil interview dan tes kemampuan teknis lainnya. Gunakan profil kepribadian untuk melihat kecocokan kandidat dengan budaya tim dan ritme kerja posisi yang dilamar.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
