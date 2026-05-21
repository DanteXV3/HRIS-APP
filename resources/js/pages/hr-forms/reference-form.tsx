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

interface Props { letter?: any; employees: { id: number; nama: string; nik: string }[]; companies: { id: number; name: string; code: string }[]; }

export default function ReferenceForm({ letter, employees, companies }: Props) {
    const isEdit = !!letter;
    const { data, setData, post, put, processing, errors } = useForm({
        employee_id: letter?.employee_id?.toString() || '', company_id: letter?.company_id?.toString() || '',
        work_location_text: letter?.work_location_text || '',
        from_date: letter?.from_date ? new Date(letter.from_date).toISOString().split('T')[0] : '',
        to_date: letter?.to_date ? new Date(letter.to_date).toISOString().split('T')[0] : '',
        qualities: letter?.qualities || '', recommendation_text: letter?.recommendation_text || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Surat HR', href: '/hr-forms' }, { title: isEdit ? 'Edit Surat Referensi' : 'Buat Surat Referensi', href: '#' }];
    const submit: FormEventHandler = (e) => { e.preventDefault(); isEdit ? put(`/references/${letter.id}`) : post('/references'); };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Surat Referensi' : 'Buat Surat Referensi'} />
            <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 max-w-3xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-2">
                    <Button variant="ghost" size="icon" onClick={() => router.get('/hr-forms?tab=reference')}><ArrowLeft className="w-5 h-5" /></Button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2"><FileText className="w-5 h-5" /> {isEdit ? 'Edit' : 'Buat'} Surat Referensi</h1>
                        <p className="text-sm text-neutral-500">Surat rekomendasi/referensi kerja karyawan.</p>
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
                        </div>
                        <div className="space-y-2">
                            <Label>Karyawan</Label>
                            <Select value={data.employee_id} onValueChange={(v) => setData('employee_id', v)}>
                                <SelectTrigger className={errors.employee_id ? 'border-red-500' : ''}><SelectValue placeholder="Pilih karyawan..." /></SelectTrigger>
                                <SelectContent>{employees.map((e) => <SelectItem key={e.id} value={e.id.toString()}>{e.nik} - {e.nama}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2"><Label>Lokasi Kerja</Label><Input value={data.work_location_text} onChange={(e) => setData('work_location_text', e.target.value)} placeholder="Contoh: HO PIK" /></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Dari Tanggal</Label><Input type="date" value={data.from_date} onChange={(e) => setData('from_date', e.target.value)} className={errors.from_date ? 'border-red-500' : ''} /></div>
                            <div className="space-y-2"><Label>Sampai Tanggal</Label><Input type="date" value={data.to_date} onChange={(e) => setData('to_date', e.target.value)} className={errors.to_date ? 'border-red-500' : ''} /></div>
                        </div>
                        <div className="space-y-2"><Label>Kualitas/Keahlian (opsional)</Label><Textarea value={data.qualities} onChange={(e) => setData('qualities', e.target.value)} placeholder="Deskripsi kualitas dan keahlian karyawan..." className="min-h-[80px]" /></div>
                        <div className="space-y-2"><Label>Teks Rekomendasi (opsional)</Label><Textarea value={data.recommendation_text} onChange={(e) => setData('recommendation_text', e.target.value)} placeholder="Kosongkan untuk teks default" className="min-h-[80px]" /><p className="text-xs text-neutral-500">Jika dikosongkan, teks rekomendasi default akan digunakan di PDF.</p></div>
                        <div className="pt-4 flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => router.get('/hr-forms?tab=reference')} disabled={processing}>Batal</Button>
                            <Button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700">{isEdit ? 'Update' : 'Buat Surat'}</Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
