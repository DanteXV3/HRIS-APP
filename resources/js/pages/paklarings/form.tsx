import { Head, useForm, router } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Employee {
    id: number;
    nama: string;
    nik: string;
}

interface Company {
    id: number;
    name: string;
    code: string;
}

interface Paklaring {
    id: number;
    employee_id: number;
    company_id: number;
    work_location_text: string;
    from_date: string;
    to_date: string;
    reason_for_leaving: string;
}

interface Props {
    paklaring?: Paklaring;
    employees: Employee[];
    companies: Company[];
}

export default function PaklaringForm({ paklaring, employees, companies }: Props) {
    const isEdit = !!paklaring;
    
    const { data, setData, post, put, processing, errors } = useForm({
        employee_id: paklaring?.employee_id?.toString() || '',
        company_id: paklaring?.company_id?.toString() || '',
        work_location_text: paklaring?.work_location_text || '',
        from_date: paklaring?.from_date ? new Date(paklaring.from_date).toISOString().split('T')[0] : '',
        to_date: paklaring?.to_date ? new Date(paklaring.to_date).toISOString().split('T')[0] : '',
        reason_for_leaving: paklaring?.reason_for_leaving || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Management Karyawan', href: '#' },
        { title: 'Surat HR (HR Forms)', href: '/hr-forms' },
        { title: isEdit ? 'Edit Paklaring' : 'Buat Paklaring Baru', href: '#' },
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (isEdit) {
            put(`/paklarings/${paklaring.id}`);
        } else {
            post('/paklarings');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Paklaring' : 'Buat Paklaring'} />

            <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 max-w-3xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-2">
                    <Button variant="ghost" size="icon" onClick={() => router.get('/hr-forms')}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                            <FileText className="w-6 h-6" /> 
                            {isEdit ? 'Edit Paklaring' : 'Buat Paklaring Baru'}
                        </h1>
                        <p className="text-sm text-neutral-500">
                            Isi formulir di bawah ini untuk menghasilkan surat keterangan pengalaman kerja.
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm p-4 sm:p-6">
                    <form onSubmit={submit} className="space-y-6">
                        
                        <div className="space-y-2">
                            <Label htmlFor="company_id">Perusahaan (Letterhead)</Label>
                            <Select 
                                value={data.company_id} 
                                onValueChange={(v) => setData('company_id', v)}
                            >
                                <SelectTrigger className={errors.company_id ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Pilih perusahaan..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {companies.map((comp) => (
                                        <SelectItem key={comp.id} value={comp.id.toString()}>
                                            {comp.code} - {comp.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.company_id && <div className="text-sm text-red-500">{errors.company_id}</div>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="employee_id">Karyawan</Label>
                            <Select 
                                value={data.employee_id} 
                                onValueChange={(v) => setData('employee_id', v)}
                            >
                                <SelectTrigger className={errors.employee_id ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Pilih karyawan..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees.map((emp) => (
                                        <SelectItem key={emp.id} value={emp.id.toString()}>
                                            {emp.nik} - {emp.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.employee_id && <div className="text-sm text-red-500">{errors.employee_id}</div>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="work_location_text">Lokasi Kerja</Label>
                            <Input 
                                id="work_location_text"
                                value={data.work_location_text}
                                onChange={(e) => setData('work_location_text', e.target.value)}
                                placeholder="Contoh: HO PIK / Duta Harapan"
                                className={errors.work_location_text ? 'border-red-500' : ''}
                            />
                            {errors.work_location_text && <div className="text-sm text-red-500">{errors.work_location_text}</div>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="from_date">Dari Tanggal</Label>
                                <Input 
                                    id="from_date"
                                    type="date"
                                    value={data.from_date}
                                    onChange={(e) => setData('from_date', e.target.value)}
                                    className={errors.from_date ? 'border-red-500' : ''}
                                />
                                {errors.from_date && <div className="text-sm text-red-500">{errors.from_date}</div>}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="to_date">Sampai Tanggal</Label>
                                <Input 
                                    id="to_date"
                                    type="date"
                                    value={data.to_date}
                                    onChange={(e) => setData('to_date', e.target.value)}
                                    className={errors.to_date ? 'border-red-500' : ''}
                                />
                                {errors.to_date && <div className="text-sm text-red-500">{errors.to_date}</div>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reason_for_leaving">Alasan Resign</Label>
                            <Textarea 
                                id="reason_for_leaving"
                                value={data.reason_for_leaving}
                                onChange={(e) => setData('reason_for_leaving', e.target.value)}
                                placeholder="Contoh: keperluan pribadi / alasan kesehatan..."
                                className={`min-h-[80px] ${errors.reason_for_leaving ? 'border-red-500' : ''}`}
                            />
                            {errors.reason_for_leaving && <div className="text-sm text-red-500">{errors.reason_for_leaving}</div>}
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => router.get('/hr-forms')}
                                disabled={processing}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700">
                                {isEdit ? 'Update & Simpan' : 'Buat Paklaring'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
