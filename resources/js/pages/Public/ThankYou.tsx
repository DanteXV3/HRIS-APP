import { Head } from '@inertiajs/react';
import { CheckCircle2, PartyPopper, Send } from 'lucide-react';

interface Props {
    type: 'application' | 'complete';
    message: string;
}

export default function ThankYou({ type, message }: Props) {
    return (
        <>
            <Head title="Terima Kasih" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <div className="rounded-3xl bg-white border border-neutral-200 p-8 sm:p-12 shadow-xl shadow-neutral-200/50">
                        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${type === 'complete' ? 'bg-emerald-100' : 'bg-indigo-100'}`}>
                            {type === 'complete'
                                ? <PartyPopper className="w-10 h-10 text-emerald-600" />
                                : <Send className="w-10 h-10 text-indigo-600" />
                            }
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-3">
                            {type === 'complete' ? 'Selesai!' : 'Terima Kasih!'}
                        </h1>

                        <p className="text-neutral-600 leading-relaxed mb-8">
                            {message}
                        </p>

                        <div className="inline-flex items-center gap-2 bg-neutral-100 rounded-full px-5 py-2.5 text-sm text-neutral-500">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>Anda dapat menutup halaman ini</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
