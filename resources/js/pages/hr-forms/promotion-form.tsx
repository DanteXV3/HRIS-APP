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

export default function PromotionForm({ letter, employees, companies }: Props) {
    const isEdit = !!letter;
    const { data, setData, post, put, processing, errors } = useForm({
        employee_id: letter?.employee_id?.toString() || '', company_id: letter?.company_id?.toString() || '',
        type: letter?.type || 'promosi', from_position: letter?.from_position || '', to_position: letter?.to_position || '',
        from_department: letter?.from_department || '', to_department: letter?.to_department || '',
        effective_date: letter?.effective_date ? new Date(letter.effective_date).toISOString().split('T')[0] : '',
        new_salary: letter?.new_salary || '', reason: letter?.reason || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Surat HR', href: '/hr-forms' }, { title: isEdit ? 'Edit Surat Promosi/Demosi' : 'Buat Surat Promosi/Demosi', href: '#' }];
    const submit: FormEventHandler = (e) => { e.preventDefault(); isEdit ? put(`/promotions/${letter.id}`) : post('/promotions'); };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Promosi/Demosi' : 'Buat Promosi/Demosi'} />
            <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 max-w-3xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-2">
                    <Button variant="ghost" size="icon" onClick={() => router.get('/hr-forms?tab=promotion')}><ArrowLeft className="w-5 h-5" /></Button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2"><FileText className="w-5 h-5" /> {isEdit ? 'Edit' : 'Buat'} Surat Promosi/Demosi</h1>
                        <p className="text-sm text-neutral-500">Surat perubahan jabatan karyawan.</p>
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
                        <div className="space-y-2">
                            <Label>Tipe</Label>
                            <Select value={data.type} onValueChange={(v) => setData('type', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="promosi">Promosi (Naik Jabatan)</SelectItem>
                                    <SelectItem value="demosi">Demosi (Turun Jabatan)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Jabatan Lama</Label><Input value={data.from_position} onChange={(e) => setData('from_position', e.target.value)} className={errors.from_position ? 'border-red-500' : ''} />{errors.from_position && <p className="text-sm text-red-500">{errors.from_position}</p>}</div>
                            <div className="space-y-2"><Label>Jabatan Baru</Label><Input value={data.to_position} onChange={(e) => setData('to_position', e.target.value)} className={errors.to_position ? 'border-red-500' : ''} />{errors.to_position && <p className="text-sm text-red-500">{errors.to_position}</p>}</div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Dept. Lama (opsional)</Label><Input value={data.from_department} onChange={(e) => setData('from_department', e.target.value)} /></div>
                            <div className="space-y-2"><Label>Dept. Baru (opsional)</Label><Input value={data.to_department} onChange={(e) => setData('to_department', e.target.value)} /></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Tanggal Efektif</Label><Input type="date" value={data.effective_date} onChange={(e) => setData('effective_date', e.target.value)} className={errors.effective_date ? 'border-red-500' : ''} />{errors.effective_date && <p className="text-sm text-red-500">{errors.effective_date}</p>}</div>
                            <div className="space-y-2"><Label>Gaji Baru (opsional)</Label><Input type="number" value={data.new_salary} onChange={(e) => setData('new_salary', e.target.value)} placeholder="Internal only" /></div>
                        </div>
                        <div className="space-y-2"><Label>Alasan (opsional)</Label><Textarea value={data.reason} onChange={(e) => setData('reason', e.target.value)} className="min-h-[80px]" /></div>
                        <div className="pt-4 flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => router.get('/hr-forms?tab=promotion')} disabled={processing}>Batal</Button>
                            <Button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700">{isEdit ? 'Update' : 'Buat Surat'}</Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
