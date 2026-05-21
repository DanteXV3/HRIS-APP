import { Head, useForm } from '@inertiajs/react';
import { Brain, ArrowLeft, Save, Info, AlertCircle, HelpCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
    questions: Record<number, { text: string; options: Record<string, { text: string; code: string }> }>;
}

export default function MbtiForm({ questions }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Recruitment', href: '/recruitment' },
        { title: 'Tes MBTI Baru', href: '#' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        candidate_name: '',
        candidate_info: '',
        answers: {} as Record<number, string>, // question_id => code
    });

    const handleSelect = (qId: number, code: string) => {
        setData('answers', { ...data.answers, [qId]: code });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/recruitment/mbti');
    };

    const questionIds = Object.keys(questions).map(Number).sort((a, b) => a - b);
    const totalQuestions = questionIds.length;
    const answeredCount = Object.keys(data.answers).length;
    const progress = Math.round((answeredCount / totalQuestions) * 100);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tes MBTI - Input Hasil" />

            <div className="mx-auto max-w-4xl px-6 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => window.history.back()}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                                <Brain className="w-6 h-6 text-emerald-600" />
                                Input Hasil Tes MBTI
                            </h1>
                            <p className="text-sm text-neutral-500">Masukkan pilihan jawaban (A atau B) dari kuesioner fisik.</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold uppercase text-neutral-400 mb-1">Progres Pengisian</p>
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-32 bg-neutral-200 rounded-full overflow-hidden dark:bg-neutral-800">
                                <div className="h-full bg-emerald-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                            </div>
                            <span className="text-sm font-bold text-emerald-600">{progress}%</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Info className="w-5 h-5 text-emerald-500" />
                            Informasi Kandidat
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap Kandidat</Label>
                                <Input 
                                    id="name"
                                    value={data.candidate_name}
                                    onChange={e => setData('candidate_name', e.target.value)}
                                    placeholder="Masukkan nama kandidat..."
                                    className="h-11"
                                />
                                {errors.candidate_name && <p className="text-xs text-red-500">{errors.candidate_name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="info">Info Tambahan (Posisi/HP)</Label>
                                <Input 
                                    id="info"
                                    value={data.candidate_info}
                                    onChange={e => setData('candidate_info', e.target.value)}
                                    placeholder="e.g. Finance / 0812..."
                                    className="h-11"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {questionIds.map((id, index) => (
                            <div key={id} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 transition-all hover:border-emerald-200 dark:hover:border-emerald-900">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="h-6 w-6 shrink-0 flex items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-500 dark:bg-neutral-800">
                                        {id}
                                    </div>
                                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white pt-0.5">
                                        {questions[id].text}
                                    </h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-10">
                                    {Object.entries(questions[id].options).map(([key, option]) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => handleSelect(id, option.code)}
                                            className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left group ${
                                                data.answers[id] === option.code 
                                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300' 
                                                    : 'bg-white border-neutral-100 hover:border-emerald-200 text-neutral-600 dark:bg-neutral-900 dark:border-neutral-800 dark:hover:border-emerald-900'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`h-6 w-6 flex items-center justify-center rounded border font-bold text-xs ${
                                                    data.answers[id] === option.code 
                                                        ? 'bg-emerald-600 border-emerald-600 text-white' 
                                                        : 'bg-neutral-50 border-neutral-200 text-neutral-400 group-hover:border-emerald-300 dark:bg-neutral-800 dark:border-neutral-700'
                                                }`}>
                                                    {key}
                                                </div>
                                                <span className="text-xs font-medium">{option.text}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {errors.answers && (
                        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
                            <AlertCircle className="w-5 h-5" />
                            <p className="text-sm font-medium">Mohon isi semua pernyataan (A atau B) untuk semua soal.</p>
                        </div>
                    )}

                    <div className="flex justify-end sticky bottom-6 pb-6">
                        <Button 
                            type="submit" 
                            disabled={processing || answeredCount < totalQuestions}
                            className="bg-emerald-600 hover:bg-emerald-700 h-14 px-10 text-lg font-bold shadow-xl shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-5 h-5 mr-2" />
                            {answeredCount < totalQuestions ? `Isi Semua (${answeredCount}/${totalQuestions})` : 'Simpan Hasil & Lihat Tipe MBTI'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
