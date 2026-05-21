import { Head, useForm } from '@inertiajs/react';
import { Brain, AlertCircle } from 'lucide-react';

interface Props {
    application: { id: number; uuid: string; name: string };
    opening: { company: string; position: string };
    questions: Record<number, { text: string; options: Record<string, { text: string; code: string }> }>;
}

export default function MbtiTest({ application, opening, questions }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        answers: {} as Record<number, string>,
    });

    const questionIds = Object.keys(questions).map(Number).sort((a, b) => a - b);
    const totalQuestions = questionIds.length;
    const answeredCount = Object.keys(data.answers).length;
    const progress = Math.round((answeredCount / totalQuestions) * 100);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/career/mbti/${application.uuid}`);
    };

    return (
        <>
            <Head title={`Tes MBTI - ${opening.company}`} />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/50">
                <div className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-10">
                    <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <Brain className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="text-base sm:text-lg font-bold text-neutral-900">Tes MBTI</h1>
                                <p className="text-xs text-neutral-500">{application.name}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-bold text-neutral-400 mb-1">{answeredCount}/{totalQuestions}</div>
                            <div className="h-2 w-20 sm:w-28 bg-neutral-200 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
                    <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 mb-5 text-sm text-emerald-700">
                        <strong>Instruksi:</strong> Untuk setiap pertanyaan, pilih jawaban yang <strong>paling sesuai</strong> dengan kepribadian Anda.
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {questionIds.map((id) => (
                            <div key={id} className="rounded-2xl bg-white border border-neutral-200 p-4 sm:p-5 shadow-sm">
                                <div className="flex items-start gap-3 mb-3">
                                    <span className="text-xs font-bold text-neutral-400 mt-0.5 shrink-0">{id}.</span>
                                    <h4 className="text-sm font-bold text-neutral-900">{questions[id].text}</h4>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-5 sm:ml-6">
                                    {Object.entries(questions[id].options).map(([key, option]) => (
                                        <button key={key} type="button" onClick={() => setData('answers', { ...data.answers, [id]: option.code })}
                                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all text-sm ${
                                                data.answers[id] === option.code
                                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                                                    : 'border-neutral-100 hover:border-emerald-200 text-neutral-600'
                                            }`}
                                        >
                                            <div className={`w-6 h-6 flex items-center justify-center rounded border font-bold text-xs shrink-0 ${
                                                data.answers[id] === option.code
                                                    ? 'bg-emerald-600 border-emerald-600 text-white'
                                                    : 'bg-neutral-50 border-neutral-200 text-neutral-400'
                                            }`}>{key}</div>
                                            <span className="text-xs font-medium">{option.text}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {errors.answers && (
                            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p className="text-sm font-medium">Mohon isi semua pertanyaan.</p>
                            </div>
                        )}

                        <div className="sticky bottom-4 pt-2">
                            <button type="submit" disabled={processing || answeredCount < totalQuestions} className="w-full h-13 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all py-3.5">
                                {answeredCount < totalQuestions ? `Isi Semua (${answeredCount}/${totalQuestions})` : 'Selesai & Kirim'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
