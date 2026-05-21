import { router } from '@inertiajs/react';
import { Bell, CheckCircle2, User, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';

interface EvaluationReminder {
    employee_id: number;
    employee_name: string;
    employee_nik: string;
    type: string;
    type_label: string;
    cycle_date: string;
    due_date: string;
    days_diff: number;
}

interface Props {
    reminders: EvaluationReminder[];
}

export function EvaluationReminders({ reminders }: Props) {
    const [processingId, setProcessingId] = useState<string | null>(null);

    if (reminders.length === 0) return null;

    function handleAcknowledge(r: EvaluationReminder) {
        if (!confirm(`Tandai ${r.type_label} untuk ${r.employee_name} sebagai selesai?`)) return;
        
        const id = `${r.employee_id}-${r.type}-${r.cycle_date}`;
        setProcessingId(id);
        
        router.post('/dashboard/acknowledge-evaluation', {
            employee_id: r.employee_id,
            type: r.type,
            cycle_date: r.cycle_date
        }, {
            preserveScroll: true,
            onFinish: () => setProcessingId(null)
        });
    }

    return (
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-6 dark:border-amber-900/30 dark:bg-amber-900/10">
            <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400 font-bold">
                    <Bell className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-amber-900 dark:text-amber-400">Pengingat Evaluasi Karyawan</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-500">Ada {reminders.length} karyawan yang memasuki siklus evaluasi.</p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {reminders.map((r) => {
                    const id = `${r.employee_id}-${r.type}-${r.cycle_date}`;
                    const isUrgent = r.days_diff <= 7;
                    
                    return (
                        <div key={id} className="relative flex flex-col justify-between rounded-xl border border-white bg-white/60 p-4 shadow-sm transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/60 font-bold">
                            <div className="mb-3">
                                <div className="flex items-start justify-between">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${r.type === '6-month' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                                        {r.type_label}
                                    </span>
                                    {isUrgent && (
                                        <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                    )}
                                </div>
                                <h4 className="mt-2 text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                                    <User className="h-3.5 w-3.5 text-neutral-400" />
                                    {r.employee_name}
                                </h4>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono ml-5">{r.employee_nik}</p>
                            </div>

                            <div className="mt-auto space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {r.due_date}
                                    </div>
                                    <div className={`flex items-center gap-1 font-bold ${r.days_diff < 0 ? 'text-red-600' : 'text-amber-600'}`}>
                                        <Clock className="h-3.5 w-3.5" />
                                        {r.days_diff < 0 ? `Lewat ${Math.abs(r.days_diff)} hari` : r.days_diff === 0 ? 'Hari ini' : `${r.days_diff} hari lagi`}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleAcknowledge(r)}
                                    disabled={processingId === id}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 py-2 text-xs font-bold text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
                                >
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    {processingId === id ? 'Memproses...' : 'Tandai Selesai'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
