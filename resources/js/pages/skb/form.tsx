import { Head, useForm, router } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Employee {
    id: number;
    nama: string;
    nik: string;
}

interface Certificate {
    id: number;
    employee_id: number;
    purpose: string;
}

interface Props {
    certificate?: Certificate;
    employees: Employee[];
}

export default function SKBForm({ certificate, employees }: Props) {
    const isEdit = !!certificate;
    
    const { data, setData, post, put, processing, errors } = useForm({
        employee_id: certificate?.employee_id?.toString() || '',
        purpose: certificate?.purpose || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Management Karyawan', href: '#' },
        { title: 'Surat HR (HR Forms)', href: '/hr-forms' },
        { title: isEdit ? 'Edit SKB' : 'Buat SKB', href: '#' },
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (isEdit) {
            put(`/skb/${certificate.id}`);
        } else {
            post('/skb');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit SKB' : 'Buat SKB'} />

            <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 max-w-3xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-2">
                    <Button variant="ghost" size="icon" onClick={() => router.get('/hr-forms')}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                            <FileText className="w-6 h-6" /> 
                            {isEdit ? 'Edit Surat Keterangan Bekerja' : 'Buat Surat Keterangan Bekerja'}
                        </h1>
                        <p className="text-sm text-neutral-500">
                            Isi formulir di bawah ini untuk menghasilkan surat keterangan bekerja.
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm p-4 sm:p-6">
                    <form onSubmit={submit} className="space-y-6">
                        
                        <div className="space-y-2">
                            <Label htmlFor="employee_id">Karyawan (For Who)</Label>
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
                            <Label htmlFor="purpose">Tujuan (For What)</Label>
                            <Textarea 
                                id="purpose"
                                value={data.purpose}
                                onChange={(e) => setData('purpose', e.target.value)}
                                placeholder="Contoh: khusus untuk melengkapi persyaratan Pengurusan Pembayaran Pajak Kendaraan..."
                                className={`min-h-[120px] ${errors.purpose ? 'border-red-500' : ''}`}
                            />
                            {errors.purpose && <div className="text-sm text-red-500">{errors.purpose}</div>}
                            <p className="text-xs text-neutral-500">
                                Kalimat ini akan muncul di akhir paragraf surat keterangan bekerja.
                            </p>
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
                                {isEdit ? 'Update & Simpan' : 'Buat Surat'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
