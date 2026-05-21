import { Head, useForm, router } from '@inertiajs/react';
import { Briefcase, ArrowLeft, Plus, X, Save } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
    companies: { id: number; name: string }[];
}

export default function JobOpeningsCreate({ companies }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Recruitment', href: '/recruitment' },
        { title: 'Lowongan Kerja', href: '/job-openings' },
        { title: 'Buat Baru', href: '#' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        company: '',
        position: '',
        working_location: '',
        requested_by: '',
        salary_min: '',
        salary_max: '',
        contract_duration: '',
        requirements: [''] as string[],
    });

    const addRequirement = () => setData('requirements', [...data.requirements, '']);
    const removeRequirement = (i: number) => setData('requirements', data.requirements.filter((_, idx) => idx !== i));
    const updateRequirement = (i: number, val: string) => {
        const updated = [...data.requirements];
        updated[i] = val;
        setData('requirements', updated);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/job-openings');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Lowongan Kerja" />

            <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-8">
                <div className="mb-6 sm:mb-8 flex items-center gap-4">
                    <Button variant="outline" size="icon" className="rounded-full shrink-0" onClick={() => router.get('/job-openings')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                            Buat Lowongan Kerja
                        </h1>
                        <p className="text-sm text-neutral-500">Isi detail lowongan yang akan dipublikasikan.</p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <h3 className="text-base sm:text-lg font-bold mb-6 text-neutral-900 dark:text-white">Informasi Lowongan</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2 sm:col-span-2">
                                <Label>Perusahaan *</Label>
                                <Select value={data.company} onValueChange={(v) => setData('company', v)}>
                                    <SelectTrigger className="h-11"><SelectValue placeholder="Pilih perusahaan..." /></SelectTrigger>
                                    <SelectContent>
                                        {companies.map((c) => (
                                            <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.company && <p className="text-xs text-red-500">{errors.company}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Posisi / Jabatan *</Label>
                                <Input value={data.position} onChange={e => setData('position', e.target.value)} placeholder="e.g. Staff Accounting" className="h-11" />
                                {errors.position && <p className="text-xs text-red-500">{errors.position}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Lokasi Kerja *</Label>
                                <Input value={data.working_location} onChange={e => setData('working_location', e.target.value)} placeholder="e.g. Jakarta, Site Balikpapan" className="h-11" />
                                {errors.working_location && <p className="text-xs text-red-500">{errors.working_location}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Diminta Oleh *</Label>
                                <Input value={data.requested_by} onChange={e => setData('requested_by', e.target.value)} placeholder="Nama yang meminta" className="h-11" />
                                {errors.requested_by && <p className="text-xs text-red-500">{errors.requested_by}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Durasi Kontrak</Label>
                                <Input value={data.contract_duration} onChange={e => setData('contract_duration', e.target.value)} placeholder="e.g. 6 bulan, 1 tahun" className="h-11" />
                            </div>
                            <div className="space-y-2">
                                <Label>Gaji Min (Rp)</Label>
                                <Input type="number" value={data.salary_min} onChange={e => setData('salary_min', e.target.value)} placeholder="0" className="h-11" />
                            </div>
                            <div className="space-y-2">
                                <Label>Gaji Max (Rp)</Label>
                                <Input type="number" value={data.salary_max} onChange={e => setData('salary_max', e.target.value)} placeholder="0" className="h-11" />
                            </div>
                        </div>
                    </div>

                    {/* Requirements */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">Persyaratan</h3>
                            <Button type="button" variant="outline" size="sm" onClick={addRequirement} className="gap-1">
                                <Plus className="w-3.5 h-3.5" /> Tambah
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {data.requirements.map((req, i) => (
                                <div key={i} className="flex items-center gap-2 sm:gap-3">
                                    <span className="text-xs font-bold text-neutral-400 w-6 text-right shrink-0">{i + 1}.</span>
                                    <Input
                                        value={req}
                                        onChange={e => updateRequirement(i, e.target.value)}
                                        placeholder="Tulis persyaratan..."
                                        className="h-10 flex-1"
                                    />
                                    {data.requirements.length > 1 && (
                                        <Button type="button" variant="ghost" size="icon" className="shrink-0 h-8 w-8 text-red-400 hover:text-red-600" onClick={() => removeRequirement(i)}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 text-base font-bold shadow-xl shadow-indigo-600/20 w-full sm:w-auto">
                            <Save className="w-5 h-5 mr-2" /> Simpan & Buat Link
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
