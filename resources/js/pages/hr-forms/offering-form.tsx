import { Head, useForm, router } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Props { letter?: any; companies: { id: number; name: string; code: string }[]; }

export default function OfferingForm({ letter, companies }: Props) {
    const isEdit = !!letter;
    const { data, setData, post, put, processing, errors } = useForm({
        company_id: letter?.company_id?.toString() || '',
        candidate_name: letter?.candidate_name || '',
        candidate_address: letter?.candidate_address || '',
        position_offered: letter?.position_offered || '',
        department_text: letter?.department_text || '',
        start_date: letter?.start_date ? new Date(letter.start_date).toISOString().split('T')[0] : '',
        offered_salary: letter?.offered_salary || '',
        employment_type: letter?.employment_type || 'kontrak',
        notes: letter?.notes || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Surat HR', href: '/hr-forms' },
        { title: isEdit ? 'Edit Offering Letter' : 'Buat Offering Letter', href: '#' },
    ];

    const submit: FormEventHandler = (e) => { e.preventDefault(); isEdit ? put(`/offerings/${letter.id}`) : post('/offerings'); };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Offering Letter' : 'Buat Offering Letter'} />
            <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 max-w-3xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-2">
                    <Button variant="ghost" size="icon" onClick={() => router.get('/hr-forms?tab=offering')}><ArrowLeft className="w-5 h-5" /></Button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2"><FileText className="w-5 h-5" /> {isEdit ? 'Edit' : 'Buat'} Offering Letter</h1>
                        <p className="text-sm text-neutral-500">Surat penawaran kerja untuk kandidat baru.</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm p-4 sm:p-6">
                    <form onSubmit={submit} className="space-y-5">
                        <div className="space-y-2">
                            <Label>Perusahaan</Label>
                            <Select value={data.company_id} onValueChange={(v) => setData('company_id', v)}>
                                <SelectTrigger className={errors.company_id ? 'border-red-500' : ''}><SelectValue placeholder="Pilih perusahaan..." /></SelectTrigger>
                                <SelectContent>{companies.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.code} - {c.name}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.company_id && <p className="text-sm text-red-500">{errors.company_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Nama Kandidat</Label>
                            <Input value={data.candidate_name} onChange={(e) => setData('candidate_name', e.target.value)} placeholder="Nama lengkap kandidat" className={errors.candidate_name ? 'border-red-500' : ''} />
                            {errors.candidate_name && <p className="text-sm text-red-500">{errors.candidate_name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Alamat Kandidat</Label>
                            <Textarea value={data.candidate_address} onChange={(e) => setData('candidate_address', e.target.value)} placeholder="Alamat lengkap" className="min-h-[60px]" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Posisi Ditawarkan</Label>
                                <Input value={data.position_offered} onChange={(e) => setData('position_offered', e.target.value)} className={errors.position_offered ? 'border-red-500' : ''} />
                                {errors.position_offered && <p className="text-sm text-red-500">{errors.position_offered}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Departemen</Label>
                                <Input value={data.department_text} onChange={(e) => setData('department_text', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Tanggal Mulai</Label>
                                <Input type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} className={errors.start_date ? 'border-red-500' : ''} />
                                {errors.start_date && <p className="text-sm text-red-500">{errors.start_date}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Tipe Kepegawaian</Label>
                                <Select value={data.employment_type} onValueChange={(v) => setData('employment_type', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tetap">Tetap</SelectItem>
                                        <SelectItem value="kontrak">Kontrak</SelectItem>
                                        <SelectItem value="probation">Probation</SelectItem>
                                        <SelectItem value="magang">Magang</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Gaji (opsional)</Label>
                                <Input type="number" value={data.offered_salary} onChange={(e) => setData('offered_salary', e.target.value)} placeholder="Internal only" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Catatan (opsional)</Label>
                            <Textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} className="min-h-[80px]" />
                        </div>
                        <div className="pt-4 flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => router.get('/hr-forms?tab=offering')} disabled={processing}>Batal</Button>
                            <Button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700">{isEdit ? 'Update' : 'Buat Surat'}</Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
