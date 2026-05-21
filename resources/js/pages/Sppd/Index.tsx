import { Head, router, usePage } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Edit, Trash2, Download, ExternalLink, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Sppd {
    id: number;
    letter_number: string;
    tanggal_berangkat: string;
    tanggal_kembali: string;
    tujuan: string;
    status: string;
    total_amount: number;
    employees: {
        nama: string;
    }[];
    maker: {
        nama: string;
    };
}

interface Props {
    sppds: {
        data: Sppd[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Menu Saya', href: '#' },
    { title: 'Form SPPD', href: '/sppd' },
];

export default function SppdIndex({ sppds }: Props) {
    const { auth } = usePage<any>().props;
    const canCreate = auth.user.role === 'admin' || auth.user.can?.includes('sppd.create');
    const canDelete = auth.user.role === 'admin' || auth.user.can?.includes('sppd.delete');

    const handleDelete = (id: number) => {
        if (confirm('Hapus SPPD ini?')) {
            router.delete(`/sppd/${id}`);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'signed':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Signed</Badge>;
            default:
                return <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50"><Clock className="w-3 h-3 mr-1" /> Draft</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Form SPPD" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <FileText className="w-6 h-6" /> Form SPPD
                        </h1>
                        <p className="text-sm text-neutral-500">
                            Surat Perintah Perjalanan Dinas
                        </p>
                    </div>

                    {canCreate && (
                        <Button onClick={() => router.get('/sppd/create')} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Buat SPPD Baru
                        </Button>
                    )}
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader className="bg-neutral-50/50 dark:bg-neutral-950/50">
                            <TableRow>
                                <TableHead className="w-[200px]">No. Surat</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Karyawan</TableHead>
                                <TableHead>Tujuan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Total Biaya</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sppds.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-neutral-500">
                                        Belum ada data SPPD.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sppds.data.map((sppd) => (
                                    <TableRow key={sppd.id} className="hover:bg-neutral-50/50 transition-colors">
                                        <TableCell className="font-semibold">{sppd.letter_number}</TableCell>
                                        <TableCell className="text-sm">
                                            {new Date(sppd.tanggal_berangkat).toLocaleDateString('id-ID')} - {new Date(sppd.tanggal_kembali).toLocaleDateString('id-ID')}
                                        </TableCell>
                                        <TableCell className="font-medium text-indigo-700 dark:text-indigo-400">
                                            {sppd.employees?.map(e => e.nama).join(', ')}
                                        </TableCell>
                                        <TableCell>{sppd.tujuan}</TableCell>
                                        <TableCell>{getStatusBadge(sppd.status)}</TableCell>
                                        <TableCell className="text-right font-mono font-medium">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(sppd.total_amount)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon"
                                                    title="Lihat Detail & Itinerary"
                                                    onClick={() => router.get(`/sppd/${sppd.id}`)}
                                                >
                                                    <ExternalLink className="w-4 h-4 text-neutral-600" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon"
                                                    title="Download Draft PDF"
                                                    onClick={() => window.open(`/sppd/${sppd.id}/pdf`, '_blank')}
                                                >
                                                    <Download className="w-4 h-4 text-neutral-600" />
                                                </Button>
                                                {canDelete && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDelete(sppd.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
