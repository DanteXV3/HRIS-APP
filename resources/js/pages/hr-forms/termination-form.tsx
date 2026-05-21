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

export default function TerminationForm({ letter, employees, companies }: Props) {
    const isEdit = !!letter;
    const { data, setData, post, put, processing, errors } = useForm({
        employee_id: letter?.employee_id?.toString() || '', company_id: letter?.company_id?.toString() || '',
        termination_date: letter?.termination_date ? new Date(letter.termination_date).toISOString().split('T')[0] : '',
        reason: letter?.reason || '', severance_amount: letter?.severance_amount || '', notes: letter?.notes || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Surat HR', href: '/hr-forms' }, { title: isEdit ? 'Edit Surat PHK' : 'Buat Surat PHK', href: '#' }];
    const submit: FormEventHandler = (e) => { e.preventDefault(); isEdit ? put(`/terminations/${letter.id}`) : post('/terminations'); };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Surat PHK' : 'Buat Surat PHK'} />
            <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 max-w-3xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-2">
                    <Button variant="ghost" size="icon" onClick={() => router.get('/hr-forms?tab=termination')}><ArrowLeft className="w-5 h-5" /></Button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2"><FileText className="w-5 h-5" /> {isEdit ? 'Edit' : 'Buat'} Surat PHK</h1>
                        <p className="text-sm text-neutral-500">Surat pemutusan hubungan kerja.</p>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Tanggal Efektif PHK</Label><Input type="date" value={data.termination_date} onChange={(e) => setData('termination_date', e.target.value)} className={errors.termination_date ? 'border-red-500' : ''} />{errors.termination_date && <p className="text-sm text-red-500">{errors.termination_date}</p>}</div>
                            <div className="space-y-2"><Label>Pesangon (opsional)</Label><Input type="number" value={data.severance_amount} onChange={(e) => setData('severance_amount', e.target.value)} placeholder="Internal only" /></div>
                        </div>
                        <div className="space-y-2"><Label>Alasan PHK</Label><Textarea value={data.reason} onChange={(e) => setData('reason', e.target.value)} className={`min-h-[100px] ${errors.reason ? 'border-red-500' : ''}`} placeholder="Alasan pemutusan hubungan kerja..." />{errors.reason && <p className="text-sm text-red-500">{errors.reason}</p>}</div>
                        <div className="space-y-2"><Label>Catatan (opsional)</Label><Textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} className="min-h-[80px]" /></div>
                        <div className="pt-4 flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => router.get('/hr-forms?tab=termination')} disabled={processing}>Batal</Button>
                            <Button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700">{isEdit ? 'Update' : 'Buat Surat'}</Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
