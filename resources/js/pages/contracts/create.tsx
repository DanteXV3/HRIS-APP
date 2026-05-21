import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ChevronLeft, 
    Save, 
    AlertCircle,
    User,
    Building2,
    Wallet
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useState, useEffect } from 'react';

interface Employee {
    id: number;
    nik: string;
    nama: string;
    gender: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    alamat_tetap: string;
    department?: { name: string };
    position?: { name: string };
    work_location_id: number;
    gaji_pokok: number;
    tunjangan_jabatan: number;
    tunjangan_kehadiran: number;
    tunjangan_transportasi: number;
    uang_makan: number;
    uang_lembur: number;
}

interface Props {
    employees: Employee[];
}

const breadcrumbs = [
    { title: 'Data Kontrak (PKWT)', href: '/contracts' },
    { title: 'Buat Kontrak', href: '/contracts/create' }
];

export default function ContractCreate({ employees }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        employee_id: '',
        start_date: '',
        end_date: '',
        base_salary: 0,
        position_allowance: 0,
        attendance_allowance: 0,
        transport_allowance: 0,
        meal_allowance: 0,
        uang_makan_site: 0,
        overtime_allowance: 0,
        notes: '',
    });

    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    const handleEmployeeChange = (employeeId: string) => {
        const employee = employees.find(e => e.id.toString() === employeeId);
        if (employee) {
            setSelectedEmployee(employee);
            setData({
                ...data,
                employee_id: employeeId,
                base_salary: employee.gaji_pokok || 0,
                position_allowance: employee.tunjangan_jabatan || 0,
                attendance_allowance: employee.tunjangan_kehadiran || 0,
                transport_allowance: employee.tunjangan_transportasi || 0,
                meal_allowance: employee.uang_makan || 0,
                uang_makan_site: 0,
                overtime_allowance: employee.uang_lembur || 0,
            });
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contracts');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Kontrak Baru" />

            <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/contracts">
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h2 className="text-2xl font-bold tracking-tight">Buat Kontrak Baru</h2>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Informasi Karyawan
                            </CardTitle>
                            <CardDescription>
                                Pilih karyawan untuk membuat draft kontrak PKWT.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="employee_id">Karyawan</Label>
                                <Select 
                                    onValueChange={handleEmployeeChange} 
                                    value={data.employee_id}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Karyawan..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((employee) => (
                                            <SelectItem key={employee.id} value={employee.id.toString()}>
                                                {employee.nama} ({employee.nik})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.employee_id && <p className="text-xs text-destructive">{errors.employee_id}</p>}
                            </div>

                            {selectedEmployee && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg text-sm">
                                    <div>
                                        <Label className="text-muted-foreground uppercase text-[10px]">Jabatan Saat Ini</Label>
                                        <div className="font-medium text-blue-600">{selectedEmployee.position?.name || '-'}</div>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground uppercase text-[10px]">Departemen</Label>
                                        <div className="font-medium">{selectedEmployee.department?.name || '-'}</div>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground uppercase text-[10px]">Tempat, Tgl Lahir</Label>
                                        <div>{selectedEmployee.tempat_lahir}, {new Date(selectedEmployee.tanggal_lahir).toLocaleDateString('id-ID')}</div>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground uppercase text-[10px]">NIK HRIS</Label>
                                        <div>{selectedEmployee.nik}</div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Detail Perjanjian
                            </CardTitle>
                            <CardDescription>
                                Masukkan masa berlaku kontrak kerja.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="start_date">Tanggal Mulai</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                />
                                {errors.start_date && <p className="text-xs text-destructive">{errors.start_date}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end_date">Tanggal Berakhir</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                />
                                {errors.end_date && <p className="text-xs text-destructive">{errors.end_date}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wallet className="h-5 w-5" />
                                Rincian Gaji & Tunjangan
                            </CardTitle>
                            <CardDescription>
                                Nilai akan otomatis terisi sesuai database karyawan, namun dapat diubah.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="base_salary">Gaji Pokok</Label>
                                <Input
                                    id="base_salary"
                                    type="number"
                                    value={data.base_salary}
                                    onChange={(e) => setData('base_salary', Number(e.target.value))}
                                />
                                {errors.base_salary && <p className="text-xs text-destructive">{errors.base_salary}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="position_allowance">Tunjangan Jabatan</Label>
                                <Input
                                    id="position_allowance"
                                    type="number"
                                    value={data.position_allowance}
                                    onChange={(e) => setData('position_allowance', Number(e.target.value))}
                                />
                                {errors.position_allowance && <p className="text-xs text-destructive">{errors.position_allowance}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="attendance_allowance">Tunjangan Kehadiran</Label>
                                <Input
                                    id="attendance_allowance"
                                    type="number"
                                    value={data.attendance_allowance}
                                    onChange={(e) => setData('attendance_allowance', Number(e.target.value))}
                                />
                                {errors.attendance_allowance && <p className="text-xs text-destructive">{errors.attendance_allowance}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="transport_allowance">Tunjangan Transportasi</Label>
                                <Input
                                    id="transport_allowance"
                                    type="number"
                                    value={data.transport_allowance}
                                    onChange={(e) => setData('transport_allowance', Number(e.target.value))}
                                />
                                {errors.transport_allowance && <p className="text-xs text-destructive">{errors.transport_allowance}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="meal_allowance">Tunjangan Uang Makan</Label>
                                <Input
                                    id="meal_allowance"
                                    type="number"
                                    value={data.meal_allowance}
                                    onChange={(e) => setData('meal_allowance', Number(e.target.value))}
                                />
                                {errors.meal_allowance && <p className="text-xs text-destructive">{errors.meal_allowance}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="uang_makan_site">Tunjangan Uang Makan Site</Label>
                                <Input
                                    id="uang_makan_site"
                                    type="number"
                                    value={data.uang_makan_site}
                                    onChange={(e) => setData('uang_makan_site', Number(e.target.value))}
                                />
                                {errors.uang_makan_site && <p className="text-xs text-destructive">{errors.uang_makan_site}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="overtime_allowance">Tunjangan Lembur (Base)</Label>
                                <Input
                                    id="overtime_allowance"
                                    type="number"
                                    value={data.overtime_allowance}
                                    onChange={(e) => setData('overtime_allowance', Number(e.target.value))}
                                />
                                {errors.overtime_allowance && <p className="text-xs text-destructive">{errors.overtime_allowance}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" type="button" asChild>
                            <Link href="/contracts">Batal</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            Simpan & Generate Kontrak
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
