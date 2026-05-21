import { router } from '@inertiajs/react';
import { CheckCircle2, ClipboardList, Clock, Calendar } from 'lucide-react';
import { useState } from 'react';

interface TaskReminder {
    id: number;
    title: string;
    description: string | null;
    category: string;
    frequency: string | null;
    due_date: string | null;
    next_occurrence: string;
}

interface Props {
    reminders: TaskReminder[];
}

export function TaskReminders({ reminders }: Props) {
    const [processingId, setProcessingId] = useState<number | null>(null);

    if (reminders.length === 0) return null;

    function handleComplete(id: number, title: string) {
        if (!confirm(`Tandai tugas "${title}" sebagai selesai?`)) return;
        
        setProcessingId(id);
        
        router.post(`/tasks/${id}/complete`, {}, {
            preserveScroll: true,
            onFinish: () => setProcessingId(null)
        });
    }

    return (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6 dark:border-indigo-900/30 dark:bg-indigo-900/10">
            <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 font-bold">
                    <ClipboardList className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-400">Pengingat Tugas</h3>
                    <p className="text-sm text-indigo-700 dark:text-indigo-500">Ada {reminders.length} tugas yang perlu diselesaikan.</p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {reminders.map((r) => {
                    return (
                        <div key={r.id} className="relative flex flex-col justify-between rounded-xl border border-white bg-white/60 p-4 shadow-sm transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/60">
                            <div className="mb-3">
                                <div className="flex items-start justify-between">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${r.category === 'recurring' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                                        {r.category === 'recurring' ? (r.frequency ? `${r.frequency}` : 'Berulang') : 'Sekali Saja'}
                                    </span>
                                </div>
                                <h4 className="mt-2 text-sm font-bold text-neutral-900 dark:text-white line-clamp-1">
                                    {r.title}
                                </h4>
                                {r.description && (
                                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                                        {r.description}
                                    </p>
                                )}
                            </div>

                            <div className="mt-auto space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {r.due_date || '-'}
                                    </div>
                                    <div className="flex items-center gap-1 font-bold text-indigo-600">
                                        <Clock className="h-3.5 w-3.5" />
                                        {r.category === 'recurring' ? 'Berkala' : 'Deadline'}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleComplete(r.id, r.title)}
                                    disabled={processingId === r.id}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 text-xs font-bold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    {processingId === r.id ? 'Memproses...' : 'Selesaikan'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
