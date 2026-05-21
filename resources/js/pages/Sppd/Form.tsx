import { Head, useForm, router } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, ArrowLeft, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { FormEventHandler, useMemo, useState } from 'react';

interface Employee {
    id: number;
    nama: string;
    nik: string;
    position?: {
        name: string;
    };
}

interface WorkLocation {
    id: number;
    name: string;
    code: string;
}

interface Sppd {
    id: number;
    employees: { id: number }[];
    external_employees: string[];
    work_location_id: number;
    tujuan: string;
    tanggal_berangkat: string;
    tanggal_kembali: string;
    atas_permintaan_id: number;
    maksud_perjalanan_dinas: string;
}

interface Props {
    sppd?: Sppd;
    employees: Employee[];
    workLocations: WorkLocation[];
}

export default function SppdForm({ sppd, employees, workLocations }: Props) {
    const isEdit = !!sppd;
    
    const { data, setData, post, put, processing, errors } = useForm({
        employee_ids: sppd?.employees?.map(e => e.id.toString()) || [] as string[],
        external_employees: sppd?.external_employees || [] as string[],
        work_location_id: sppd?.work_location_id?.toString() || '',
        tujuan: sppd?.tujuan || '',
        tanggal_berangkat: sppd?.tanggal_berangkat || '',
        tanggal_kembali: sppd?.tanggal_kembali || '',
        atas_permintaan_id: sppd?.atas_permintaan_id?.toString() || '',
        maksud_perjalanan_dinas: sppd?.maksud_perjalanan_dinas || '',
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [manualName, setManualName] = useState('');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Menu Saya', href: '#' },
        { title: 'Form SPPD', href: '/sppd' },
        { title: isEdit ? 'Edit SPPD' : 'Buat SPPD Baru', href: '#' },
    ];

    const filteredEmployees = useMemo(() => {
        return employees.filter(e => 
            e.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
            e.nik.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, employees]);

    const assignedEmployees = useMemo(() => {
        return employees.filter(e => data.employee_ids.includes(e.id.toString()));
    }, [data.employee_ids, employees]);

    const requesterEmployee = useMemo(() => {
        return employees.find(e => e.id.toString() === data.atas_permintaan_id);
    }, [data.atas_permintaan_id, employees]);

    const addManualName = () => {
        if (!manualName.trim()) return;
        setData('external_employees', [...data.external_employees, manualName.trim()]);
        setManualName('');
    };

    const removeManualName = (index: number) => {
        const current = [...data.external_employees];
        current.splice(index, 1);
        setData('external_employees', current);
    };

    const toggleEmployee = (id: string) => {
        const current = [...data.employee_ids];
        const index = current.indexOf(id);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(id);
        }
        setData('employee_ids', current);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/sppd/${sppd.id}`);
        } else {
            post('/sppd');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit SPPD' : 'Buat SPPD'} />

            <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-2">
                    <Button variant="ghost" size="icon" onClick={() => router.get('/sppd')}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <FileText className="w-6 h-6 text-indigo-600" /> 
                            {isEdit ? 'Edit SPPD' : 'Buat SPPD Baru'}
                        </h1>
                        <p className="text-sm text-neutral-500">
                            Lengkapi informasi dasar perjalanan dinas di bawah ini.
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden">
                    <form onSubmit={submit} className="p-8 space-y-8">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Section 1: Yang Ditugaskan */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Informasi Pelaksana</h3>
                                
                                <div className="space-y-2">
                                    <Label>Yang Ditugaskan (Multiple)</Label>
                                    <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden flex flex-col h-[200px]">
                                        <div className="p-2 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                                            <Input 
                                                placeholder="Cari karyawan..." 
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="h-8 text-xs"
                                            />
                                        </div>
                                        <div className="overflow-y-auto flex-1 p-2 space-y-1">
                                            {filteredEmployees.map(emp => (
                                                <label key={emp.id} className="flex items-center gap-2 p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded cursor-pointer transition-colors">
                                                    <input 
                                                        type="checkbox"
                                                        checked={data.employee_ids.includes(emp.id.toString())}
                                                        onChange={() => toggleEmployee(emp.id.toString())}
                                                        className="h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">{emp.nama}</span>
                                                        <span className="text-[10px] text-neutral-500">{emp.nik} - {emp.position?.name}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    {errors.employee_ids && <div className="text-xs text-red-500 mt-1 font-medium">{errors.employee_ids}</div>}
                                    <div className="text-[10px] text-neutral-400 italic">
                                        Terpilih: {data.employee_ids.length} orang
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Jabatan Terpilih</Label>
                                    <div className="min-h-[40px] p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-dashed border-neutral-300 dark:border-neutral-700 text-xs text-neutral-600">
                                        {[
                                            ...assignedEmployees.map(e => e.position?.name),
                                            ...data.external_employees.map(() => 'External')
                                        ].filter(Boolean).join(', ') || '-'}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                    <Label>Tambah Nama Manual (Tidak ada di list)</Label>
                                    <div className="flex gap-2">
                                        <Input 
                                            placeholder="Masukkan nama..." 
                                            value={manualName}
                                            onChange={(e) => setManualName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addManualName())}
                                            className="h-10"
                                        />
                                        <Button type="button" variant="outline" onClick={addManualName}>Add</Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {data.external_employees.map((name, i) => (
                                            <div key={i} className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-medium border border-indigo-100 dark:border-indigo-800">
                                                {name}
                                                <button type="button" onClick={() => removeManualName(i)} className="hover:text-red-500">×</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Atas Permintaan */}
                             <div className="space-y-6">
                                <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Otorisasi & Letterhead</h3>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="work_location_id">Lokasi Kerja (Letterhead)</Label>
                                    <Select 
                                        value={data.work_location_id} 
                                        onValueChange={(v) => setData('work_location_id', v)}
                                    >
                                        <SelectTrigger className={errors.work_location_id ? 'border-red-500 ring-red-100' : 'bg-neutral-50'}>
                                            <SelectValue placeholder="Pilih lokasi perusahaan..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {workLocations.map((wl) => (
                                                <SelectItem key={wl.id} value={wl.id.toString()}>
                                                    {wl.name} ({wl.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.work_location_id && <div className="text-xs text-red-500 mt-1 font-medium">{errors.work_location_id}</div>}
                                    <p className="text-[10px] text-neutral-400 italic">Pilihan ini menentukan Kop Surat yang akan digunakan.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="atas_permintaan_id">Atas Permintaan</Label>
                                    <Select 
                                        value={data.atas_permintaan_id} 
                                        onValueChange={(v) => setData('atas_permintaan_id', v)}
                                    >
                                        <SelectTrigger className={errors.atas_permintaan_id ? 'border-red-500 ring-red-100' : 'bg-neutral-50'}>
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
                                    {errors.atas_permintaan_id && <div className="text-xs text-red-500 mt-1 font-medium">{errors.atas_permintaan_id}</div>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Jabatan Penyetuju</Label>
                                    <Input 
                                        value={requesterEmployee?.position?.name || '-'} 
                                        readOnly 
                                        disabled 
                                        className="bg-neutral-100 dark:bg-neutral-800 border-dashed"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="border-neutral-100 dark:border-neutral-800" />

                        {/* Section 3: Trip Details */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Rincian Perjalanan</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="tujuan" className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Tujuan</Label>
                                    <Input 
                                        id="tujuan"
                                        value={data.tujuan}
                                        onChange={(e) => setData('tujuan', e.target.value)}
                                        placeholder="Contoh: Site Project Balikpapan"
                                        className={errors.tujuan ? 'border-red-500' : ''}
                                    />
                                    {errors.tujuan && <div className="text-xs text-red-500 mt-1 font-medium">{errors.tujuan}</div>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_berangkat" className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> Berangkat</Label>
                                    <Input 
                                        id="tanggal_berangkat"
                                        type="date"
                                        value={data.tanggal_berangkat}
                                        onChange={(e) => setData('tanggal_berangkat', e.target.value)}
                                        className={errors.tanggal_berangkat ? 'border-red-500' : ''}
                                    />
                                    {errors.tanggal_berangkat && <div className="text-xs text-red-500 mt-1 font-medium">{errors.tanggal_berangkat}</div>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_kembali" className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> Kembali</Label>
                                    <Input 
                                        id="tanggal_kembali"
                                        type="date"
                                        value={data.tanggal_kembali}
                                        onChange={(e) => setData('tanggal_kembali', e.target.value)}
                                        className={errors.tanggal_kembali ? 'border-red-500' : ''}
                                    />
                                    {errors.tanggal_kembali && <div className="text-xs text-red-500 mt-1 font-medium">{errors.tanggal_kembali}</div>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maksud_perjalanan_dinas">Maksud Perjalanan Dinas</Label>
                                <Textarea 
                                    id="maksud_perjalanan_dinas"
                                    value={data.maksud_perjalanan_dinas}
                                    onChange={(e) => setData('maksud_perjalanan_dinas', e.target.value)}
                                    placeholder="Jelaskan maksud dan tujuan perjalanan dinas secara detail..."
                                    className={`min-h-[100px] ${errors.maksud_perjalanan_dinas ? 'border-red-500' : ''}`}
                                />
                                {errors.maksud_perjalanan_dinas && <div className="text-xs text-red-500 mt-1 font-medium">{errors.maksud_perjalanan_dinas}</div>}
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end gap-3 border-t border-neutral-100 dark:border-neutral-800 mt-8">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={() => router.get('/sppd')}
                                disabled={processing}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-11">
                                {isEdit ? 'Update & Simpan' : 'Lanjut ke Itinerary'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
