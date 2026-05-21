import { Head, useForm } from '@inertiajs/react';
import { Brain, AlertCircle } from 'lucide-react';

interface Props {
    application: { id: number; uuid: string; name: string };
    opening: { company: string; position: string };
    questions: Record<number, Record<string, { text: string; code: string }>>;
}

export default function DiscTest({ application, opening, questions }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        answers: {} as Record<number, { most: string; least: string; most_key?: string; least_key?: string }>,
    });

    const questionIds = Object.keys(questions).map(Number).sort((a, b) => a - b);
    const completedCount = Object.keys(data.answers).filter(id => data.answers[Number(id)]?.most && data.answers[Number(id)]?.least).length;
    const progress = Math.round((completedCount / 24) * 100);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/career/disc/${application.uuid}`);
    };

    return (
        <>
            <Head title={`Tes DISC - ${opening.company}`} />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
                <div className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-10">
                    <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                <Brain className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="text-base sm:text-lg font-bold text-neutral-900">Tes DISC</h1>
                                <p className="text-xs text-neutral-500">{application.name}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-bold text-neutral-400 mb-1">{completedCount}/24</div>
                            <div className="h-2 w-20 sm:w-28 bg-neutral-200 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
                    <div className="rounded-2xl bg-indigo-50 border border-indigo-200 p-4 mb-5 text-sm text-indigo-700">
                        <strong>Instruksi:</strong> Untuk setiap kelompok pernyataan, pilih satu yang <strong>PALING menggambarkan</strong> diri Anda (M) dan satu yang <strong>PALING TIDAK menggambarkan</strong> diri Anda (L).
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {questionIds.map((id) => (
                            <div key={id} className="rounded-2xl bg-white border border-neutral-200 p-4 sm:p-5 shadow-sm">
                                <div className="text-xs font-bold text-neutral-400 mb-3">Soal {id}</div>
                                <div className="space-y-2">
                                    {Object.entries(questions[id]).map(([key, item]) => {
                                        const isMost = data.answers[id]?.most === item.code && data.answers[id]?.most_key === key;
                                        const isLeast = data.answers[id]?.least === item.code && data.answers[id]?.least_key === key;
                                        return (
                                            <div key={`${id}-${key}`} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isMost ? 'border-indigo-300 bg-indigo-50' : isLeast ? 'border-red-300 bg-red-50' : 'border-neutral-100 hover:border-neutral-200'}`}>
                                                <span className="text-sm text-neutral-700 flex-1 pr-3">{item.text}</span>
                                                <div className="flex gap-3 shrink-0">
                                                    <button type="button" onClick={() => {
                                                        const current = data.answers[id] || { most: '', least: '', most_key: '', least_key: '' };
                                                        setData('answers', { ...data.answers, [id]: { ...current, most: item.code, most_key: key, least: current.least_key === key ? '' : current.least, least_key: current.least_key === key ? '' : current.least_key } });
                                                    }} className={`w-8 h-8 rounded-full text-[10px] font-black border-2 transition-all ${isMost ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-neutral-300 text-neutral-400 hover:border-indigo-400'}`}>M</button>
                                                    <button type="button" onClick={() => {
                                                        const current = data.answers[id] || { most: '', least: '', most_key: '', least_key: '' };
                                                        setData('answers', { ...data.answers, [id]: { ...current, least: item.code, least_key: key, most: current.most_key === key ? '' : current.most, most_key: current.most_key === key ? '' : current.most_key } });
                                                    }} className={`w-8 h-8 rounded-full text-[10px] font-black border-2 transition-all ${isLeast ? 'bg-red-500 border-red-500 text-white' : 'border-neutral-300 text-neutral-400 hover:border-red-400'}`}>L</button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {errors.answers && (
                            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p className="text-sm font-medium">Mohon isi semua 24 soal (Most dan Least).</p>
                            </div>
                        )}

                        <div className="sticky bottom-4 pt-2">
                            <button type="submit" disabled={processing || completedCount < 24} className="w-full h-13 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all py-3.5">
                                {completedCount < 24 ? `Isi Semua (${completedCount}/24)` : 'Simpan & Lanjut ke Tes MBTI'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
