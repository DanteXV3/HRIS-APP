import { Head, useForm } from '@inertiajs/react';
import { Brain, ArrowLeft, Save, Info, AlertCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
    questions: Record<number, Record<string, { text: string; code: string }>>;
}

export default function DiscForm({ questions }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Recruitment', href: '/recruitment' },
        { title: 'Tes DISC Baru', href: '#' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        candidate_name: '',
        candidate_info: '',
        answers: {} as Record<number, { most: string; least: string; most_key?: string; least_key?: string }>,
    });

    const handleSelect = (groupId: number, type: 'most' | 'least', code: string) => {
        const current = data.answers[groupId] || { most: '', least: '' };
        
        // Prevent selecting same item for both most and least
        if (type === 'most' && current.least === code) {
            setData('answers', { ...data.answers, [groupId]: { most: code, least: '' } });
        } else if (type === 'least' && current.most === code) {
            setData('answers', { ...data.answers, [groupId]: { most: '', least: code } });
        } else {
            setData('answers', { ...data.answers, [groupId]: { ...current, [type]: code } });
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/recruitment/disc');
    };

    const questionIds = Object.keys(questions).map(Number).sort((a, b) => a - b);
    const progress = Math.round((Object.keys(data.answers).filter(id => data.answers[Number(id)].most && data.answers[Number(id)].least).length / 24) * 100);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tes DISC - Input Hasil" />

            <div className="mx-auto max-w-4xl px-6 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => window.history.back()}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                                <Brain className="w-6 h-6 text-indigo-600" />
                                Input Hasil Tes DISC
                            </h1>
                            <p className="text-sm text-neutral-500">Masukkan pilihan Most (M) dan Least (L) dari kuesioner fisik.</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold uppercase text-neutral-400 mb-1">Progres Pengisian</p>
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-32 bg-neutral-200 rounded-full overflow-hidden dark:bg-neutral-800">
                                <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                            </div>
                            <span className="text-sm font-bold text-indigo-600">{progress}%</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Info className="w-5 h-5 text-indigo-500" />
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
                                    placeholder="e.g. Sales Manager / 0812..."
                                    className="h-11"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-neutral-50 dark:bg-neutral-800/50">
                                    <TableHead className="w-12 text-center">No</TableHead>
                                    <TableHead>Pernyataan</TableHead>
                                    <TableHead className="w-48 p-0">
                                        <div className="flex gap-12 pl-1.5">
                                            <span className="w-8 text-center text-[10px] uppercase tracking-tighter text-indigo-600 font-black">M (Most)</span>
                                            <span className="w-8 text-center text-[10px] uppercase tracking-tighter text-red-600 font-black">L (Least)</span>
                                        </div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {questionIds.map((id) => (
                                    <TableRow key={id} className={id % 2 === 0 ? 'bg-neutral-50/30' : ''}>
                                        <TableCell className="text-center font-bold text-neutral-400">{id}</TableCell>
                                        <TableCell className="p-0" colSpan={2}>
                                            <div className="flex flex-col">
                                                {Object.entries(questions[id]).map(([key, item]) => (
                                                    <div key={`${id}-${key}`} className="flex items-center justify-between px-4 py-2 border-b last:border-0 border-neutral-100 dark:border-neutral-800 min-h-[44px]">
                                                        <span className="text-sm text-neutral-700 dark:text-neutral-300">{item.text}</span>
                                                        <div className="flex gap-12 pr-12">
                                                            <div className="flex items-center justify-center w-8">
                                                                <input 
                                                                    type="radio" 
                                                                    name={`most-${id}`} 
                                                                    checked={data.answers[id]?.most === item.code && data.answers[id]?.most_key === key}
                                                                    onChange={() => {
                                                                        const current = data.answers[id] || { most: '', least: '', most_key: '', least_key: '' };
                                                                        setData('answers', { 
                                                                            ...data.answers, 
                                                                            [id]: { 
                                                                                ...current, 
                                                                                most: item.code, 
                                                                                most_key: key,
                                                                                // If this item was 'least', clear it
                                                                                least: current.least_key === key ? '' : current.least,
                                                                                least_key: current.least_key === key ? '' : current.least_key
                                                                            } 
                                                                        });
                                                                    }}
                                                                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                                                />
                                                            </div>
                                                            <div className="flex items-center justify-center w-8">
                                                                <input 
                                                                    type="radio" 
                                                                    name={`least-${id}`} 
                                                                    checked={data.answers[id]?.least === item.code && data.answers[id]?.least_key === key}
                                                                    onChange={() => {
                                                                        const current = data.answers[id] || { most: '', least: '', most_key: '', least_key: '' };
                                                                        setData('answers', { 
                                                                            ...data.answers, 
                                                                            [id]: { 
                                                                                ...current, 
                                                                                least: item.code, 
                                                                                least_key: key,
                                                                                // If this item was 'most', clear it
                                                                                most: current.most_key === key ? '' : current.most,
                                                                                most_key: current.most_key === key ? '' : current.most_key
                                                                            } 
                                                                        });
                                                                    }}
                                                                    className="w-5 h-5 text-red-600 focus:ring-red-500 cursor-pointer"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell colSpan={2} className="hidden md:table-cell"></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {errors.answers && (
                        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
                            <AlertCircle className="w-5 h-5" />
                            <p className="text-sm font-medium">Mohon isi semua pernyataan (Most dan Least) untuk ke-24 soal.</p>
                        </div>
                    )}

                    <div className="flex justify-end sticky bottom-6 pb-6">
                        <Button 
                            type="submit" 
                            disabled={processing || progress < 100}
                            className="bg-indigo-600 hover:bg-indigo-700 h-14 px-10 text-lg font-bold shadow-xl shadow-indigo-600/20 disabled:opacity-50"
                        >
                            <Save className="w-5 h-5 mr-2" />
                            {progress < 100 ? `Isi Semua (${Math.round((progress/100)*24)}/24)` : 'Simpan Hasil & Lihat Profil'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
