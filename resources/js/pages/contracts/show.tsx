import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ChevronLeft, 
    Download, 
    FileText, 
    Upload, 
    Calendar,
    User,
    Building2,
    CheckCircle,
    Clock,
    CircleX,
    Info,
    FileCheck,
    TriangleAlert
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface Contract {
    id: number;
    contract_number: string;
    employee_id: number;
    status: 'active' | 'expired' | 'terminated';
    start_date: string;
    end_date: string;
    first_party_name: string;
    first_party_position: string;
    first_party_address: string;
    second_party_name: string;
    second_party_nik: string;
    second_party_gender: string;
    second_party_pob: string;
    second_party_dob: string;
    second_party_address: string;
    second_party_position: string;
    base_salary: number;
    position_allowance: number;
    attendance_allowance: number;
    transport_allowance: number;
    meal_allowance: number;
    uang_makan_site: number;
    overtime_allowance: number;
    signed_file: string | null;
    created_at: string;
    creator?: { name: string };
    workLocation?: { name: string };
    workingLocation?: { name: string };
}

interface Props {
    contract: Contract;
    auth: {
        user: {
            id: number;
            permissions: string[];
            roles: string[];
        };
    };
}

export default function ContractShow({ contract, auth }: Props) {
    const breadcrumbs = [
        { title: 'Data Kontrak (PKWT)', href: '/contracts' },
        { title: contract.contract_number, href: `/contracts/${contract.id}` }
    ];

    const { data, setData, post, processing, errors } = useForm({
        signed_file: null as File | null,
    });

    const isHR = auth.user.permissions.includes('contract.create') || auth.user.roles.includes('admin');

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/contracts/${contract.id}/upload-signed`);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return <Badge className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" /> Aktif</Badge>;
            case 'expired': return <Badge variant="destructive"><Clock className="mr-1 h-3 w-3" /> Berakhir</Badge>;
            case 'terminated': return <Badge variant="outline"><CircleX className="mr-1 h-3 w-3" /> Diputus</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Kontrak - ${contract.second_party_name}`} />

            <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href={isHR ? '/contracts' : '/my-contract'}>
                                <ChevronLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Detail Kontrak PKWT</h2>
                            <p className="text-muted-foreground">{contract.contract_number}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {contract.signed_file && (
                            <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50" asChild>
                                <a href={`/storage/${contract.signed_file}`} target="_blank">
                                    <FileCheck className="mr-2 h-4 w-4" /> Download Tanda Tangan
                                </a>
                            </Button>
                        )}
                        <Button asChild>
                            <a href={`/contracts/${contract.id}/download`} target="_blank">
                                <Download className="mr-2 h-4 w-4" /> Download PDF Draft
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Ringkasan Perjanjian</CardTitle>
                                <CardDescription>Data historis saat kontrak ini dibuat.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground uppercase font-bold">PIHAK PERTAMA (Perusahaan)</Label>
                                        <div className="font-semibold text-lg">{contract.workLocation?.name}</div>
                                        <div className="text-sm">Wakil: {contract.first_party_name}</div>
                                        <div className="text-sm text-muted-foreground">{contract.first_party_position}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground uppercase font-bold">PIHAK KEDUA (Karyawan)</Label>
                                        <div className="font-semibold text-lg">{contract.second_party_name}</div>
                                        <div className="text-sm">NIK: {contract.second_party_nik}</div>
                                        <div className="text-sm text-muted-foreground">{contract.second_party_position}</div>
                                    </div>
                                </div>
                                <hr />
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground uppercase">Mulai Kerja</Label>
                                        <div className="font-medium">{format(new Date(contract.start_date), 'dd MMMM yyyy', { locale: id })}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground uppercase">Berakhir Kerja</Label>
                                        <div className="font-medium text-red-600">{format(new Date(contract.end_date), 'dd MMMM yyyy', { locale: id })}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground uppercase">Status Kontrak</Label>
                                        <div>{getStatusBadge(contract.status)}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Rincian Kompensasi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span>Gaji Pokok</span>
                                        <span className="font-semibold">{formatCurrency(contract.base_salary)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span>Tunjangan Jabatan</span>
                                        <span>{formatCurrency(contract.position_allowance)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span>Tunjangan Kehadiran</span>
                                        <span>{formatCurrency(contract.attendance_allowance)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span>Tunjangan Transportasi</span>
                                        <span>{formatCurrency(contract.transport_allowance)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span>Tunjangan Uang Makan HO</span>
                                        <span>{formatCurrency(contract.meal_allowance)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span>Tunjangan Uang Makan Site</span>
                                        <span>{formatCurrency(contract.uang_makan_site || 0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span>Tunjangan Lembur (Base)</span>
                                        <span>{formatCurrency(contract.overtime_allowance)}</span>
                                    </div>
                                    <div className="pt-3 border-t flex justify-between items-center font-bold text-lg">
                                        <span>Total Bruto</span>
                                        <span className="text-blue-600">
                                            {formatCurrency(
                                                Number(contract.base_salary) + 
                                                Number(contract.position_allowance) + 
                                                Number(contract.attendance_allowance) + 
                                                Number(contract.transport_allowance) + 
                                                Number(contract.meal_allowance) + 
                                                Number(contract.uang_makan_site || 0) + 
                                                Number(contract.overtime_allowance)
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        {isHR && (
                            <Card className="border-blue-200 bg-blue-50/30">
                                <CardHeader>
                                    <CardTitle className="text-md flex items-center gap-2">
                                        <Upload className="h-4 w-4 text-blue-600" />
                                        Upload Kontrak TTD
                                    </CardTitle>
                                    <CardDescription>Upload hasil scan kontrak yang sudah ditandatangani.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleUpload} className="space-y-4">
                                        <div className="space-y-2">
                                            <Input 
                                                type="file" 
                                                accept=".pdf"
                                                onChange={(e) => setData('signed_file', e.target.files?.[0] || null)}
                                            />
                                            <p className="text-[10px] text-muted-foreground">Format PDF, Maks 5MB.</p>
                                            {errors.signed_file && <p className="text-xs text-destructive">{errors.signed_file}</p>}
                                        </div>
                                        <Button className="w-full" disabled={processing || !data.signed_file}>
                                            Unggah File
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-md flex items-center gap-2">
                                    <Info className="h-4 w-4" />
                                    Metadata
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs space-y-4">
                                <div>
                                    <Label className="text-muted-foreground">Dibuat Oleh</Label>
                                    <div className="font-medium">{contract.creator?.name || 'Sistem'}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Tanggal Buat</Label>
                                    <div className="font-medium">{format(new Date(contract.created_at), 'dd MMM yyyy, HH:mm', { locale: id })}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Unit Kerja</Label>
                                    <div className="font-medium">{contract.workingLocation?.name || '-'}</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
