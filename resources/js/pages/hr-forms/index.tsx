import { Head, router, usePage } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Edit, Trash2, Download } from 'lucide-react';
import { useState } from 'react';

interface Props {
    skb: any; paklarings: any; appointments: any; offerings: any; transfers: any; references: any; terminations: any; promotions: any;
    canViewSKB: boolean; canViewPaklaring: boolean; canViewAppointment: boolean; canViewOffering: boolean;
    canViewTransfer: boolean; canViewReference: boolean; canViewTermination: boolean; canViewPromotion: boolean;
    filters: { tab?: string; [key: string]: any; };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Management Karyawan', href: '#' }, { title: 'Surat HR', href: '/hr-forms' }];

// Tab config
const TAB_CONFIG = [
    { key: 'skb', label: 'SKB', perm: 'canViewSKB', data: 'skb', route: 'skb', nameField: (i: any) => i.employee?.nama, extra: (i: any) => i.purpose },
    { key: 'paklaring', label: 'Paklaring', perm: 'canViewPaklaring', data: 'paklarings', route: 'paklarings', nameField: (i: any) => i.employee?.nama, extra: (i: any) => i.company?.name ?? '-' },
    { key: 'appointment', label: 'Pengangkatan', perm: 'canViewAppointment', data: 'appointments', route: 'appointments', nameField: (i: any) => i.employee?.nama, extra: (i: any) => `${i.previous_status} → ${i.new_status}` },
    { key: 'offering', label: 'Offering', perm: 'canViewOffering', data: 'offerings', route: 'offerings', nameField: (i: any) => i.candidate_name, extra: (i: any) => i.position_offered },
    { key: 'transfer', label: 'Mutasi', perm: 'canViewTransfer', data: 'transfers', route: 'transfers', nameField: (i: any) => i.employee?.nama, extra: (i: any) => `${i.from_location} → ${i.to_location}` },
    { key: 'reference', label: 'Referensi', perm: 'canViewReference', data: 'references', route: 'references', nameField: (i: any) => i.employee?.nama, extra: () => 'Surat Referensi' },
    { key: 'termination', label: 'PHK', perm: 'canViewTermination', data: 'terminations', route: 'terminations', nameField: (i: any) => i.employee?.nama, extra: (i: any) => i.reason?.substring(0, 50) },
    { key: 'promotion', label: 'Promosi', perm: 'canViewPromotion', data: 'promotions', route: 'promotions', nameField: (i: any) => i.employee?.nama, extra: (i: any) => `${i.type}: ${i.from_position} → ${i.to_position}` },
] as const;

const FORM_OPTIONS = [
    { value: 'skb', label: 'Surat Keterangan Bekerja (SKB)', perm: 'canViewSKB', createRoute: '/skb/create' },
    { value: 'paklarings', label: 'Paklaring', perm: 'canViewPaklaring', createRoute: '/paklarings/create' },
    { value: 'appointments', label: 'Surat Pengangkatan', perm: 'canViewAppointment', createRoute: '/appointments/create' },
    { value: 'offerings', label: 'Offering Letter', perm: 'canViewOffering', createRoute: '/offerings/create' },
    { value: 'transfers', label: 'Surat Mutasi', perm: 'canViewTransfer', createRoute: '/transfers/create' },
    { value: 'references', label: 'Surat Referensi', perm: 'canViewReference', createRoute: '/references/create' },
    { value: 'terminations', label: 'Surat PHK / Terminasi', perm: 'canViewTermination', createRoute: '/terminations/create' },
    { value: 'promotions', label: 'Surat Promosi/Demosi', perm: 'canViewPromotion', createRoute: '/promotions/create' },
];

export default function HrFormsIndex(props: Props) {
    const { auth } = usePage<any>().props;
    const [selectedFormType, setSelectedFormType] = useState<string>('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const activeTabs = TAB_CONFIG.filter(t => (props as any)[t.perm]);
    const defaultTab = props.filters.tab || activeTabs[0]?.key || 'skb';

    const handleCreate = () => {
        const opt = FORM_OPTIONS.find(o => o.value === selectedFormType);
        if (!opt) return;
        setIsCreateModalOpen(false);
        router.get(opt.createRoute);
    };

    const handleDelete = (route: string, id: number, label: string) => {
        if (confirm(`Hapus ${label} ini?`)) router.delete(`/${route}/${id}`);
    };

    const canEdit = (mod: string) => auth.user.role === 'admin' || auth.user.can?.includes(`${mod}.edit`);
    const canDelete = (mod: string) => auth.user.role === 'admin' || auth.user.can?.includes(`${mod}.delete`);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="HR Forms" />
            <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-neutral-900 dark:text-white">
                            <FileText className="w-5 h-5 sm:w-6 sm:h-6" /> Surat HR
                        </h1>
                        <p className="text-sm text-neutral-500">Kelola penerbitan berbagai jenis surat untuk karyawan.</p>
                    </div>
                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto">
                                <Plus className="w-4 h-4 mr-2" /> Buat Surat Baru
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Pilih Jenis Surat</DialogTitle></DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Jenis Formulir</label>
                                    <Select value={selectedFormType} onValueChange={setSelectedFormType}>
                                        <SelectTrigger><SelectValue placeholder="Pilih tipe surat..." /></SelectTrigger>
                                        <SelectContent>
                                            {FORM_OPTIONS.filter(o => (props as any)[o.perm]).map(o => (
                                                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Batal</Button>
                                    <Button disabled={!selectedFormType} onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700">Lanjut</Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Tabs */}
                <Tabs defaultValue={defaultTab} className="w-full">
                    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                        <TabsList className="mb-4 w-max sm:w-auto">
                            {activeTabs.map(t => (
                                <TabsTrigger key={t.key} value={t.key} className="text-xs sm:text-sm whitespace-nowrap">{t.label}</TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    {activeTabs.map(tab => {
                        const items = (props as any)[tab.data];
                        const rows = items?.data || [];
                        return (
                            <TabsContent key={tab.key} value={tab.key}>
                                {/* Desktop Table */}
                                <div className="hidden md:block bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
                                    <Table>
                                        <TableHeader className="bg-neutral-50 dark:bg-neutral-950">
                                            <TableRow>
                                                <TableHead>No. Surat</TableHead>
                                                <TableHead>Tanggal</TableHead>
                                                <TableHead>Nama</TableHead>
                                                <TableHead>Detail</TableHead>
                                                <TableHead>Dibuat Oleh</TableHead>
                                                <TableHead className="text-right">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {rows.length === 0 ? (
                                                <TableRow><TableCell colSpan={6} className="text-center py-10 text-neutral-500">Data tidak ditemukan.</TableCell></TableRow>
                                            ) : rows.map((item: any) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-semibold text-sm">{item.letter_number}</TableCell>
                                                    <TableCell className="text-sm">{new Date(item.date).toLocaleDateString('id-ID')}</TableCell>
                                                    <TableCell className="font-medium text-indigo-700 dark:text-indigo-400 text-sm">{tab.nameField(item)}</TableCell>
                                                    <TableCell className="text-sm max-w-[200px] truncate">{tab.extra(item)}</TableCell>
                                                    <TableCell className="text-sm text-neutral-500">{item.maker?.nama}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <Button variant="outline" size="sm" onClick={() => window.open(`/${tab.route}/${item.id}/pdf`, '_blank')}><Download className="w-4 h-4" /></Button>
                                                            {canEdit(tab.key) && <Button variant="ghost" size="sm" onClick={() => router.get(`/${tab.route}/${item.id}/edit`)}><Edit className="w-4 h-4" /></Button>}
                                                            {canDelete(tab.key) && <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(tab.route, item.id, tab.label)}><Trash2 className="w-4 h-4" /></Button>}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="md:hidden space-y-3">
                                    {rows.length === 0 ? (
                                        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 text-center text-neutral-500">Data tidak ditemukan.</div>
                                    ) : rows.map((item: any) => (
                                        <div key={item.id} className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-sm">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-semibold text-indigo-700 dark:text-indigo-400 truncate">{tab.nameField(item)}</p>
                                                    <p className="text-xs text-neutral-500 font-mono mt-0.5 truncate">{item.letter_number}</p>
                                                </div>
                                                <span className="text-xs text-neutral-400 whitespace-nowrap">{new Date(item.date).toLocaleDateString('id-ID')}</span>
                                            </div>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-2">{tab.extra(item)}</p>
                                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                                                <span className="text-xs text-neutral-400">oleh {item.maker?.nama}</span>
                                                <div className="flex gap-1">
                                                    <Button variant="outline" size="sm" className="h-8" onClick={() => window.open(`/${tab.route}/${item.id}/pdf`, '_blank')}><Download className="w-3.5 h-3.5" /></Button>
                                                    {canEdit(tab.key) && <Button variant="ghost" size="sm" className="h-8" onClick={() => router.get(`/${tab.route}/${item.id}/edit`)}><Edit className="w-3.5 h-3.5" /></Button>}
                                                    {canDelete(tab.key) && <Button variant="ghost" size="sm" className="h-8 text-red-600" onClick={() => handleDelete(tab.route, item.id, tab.label)}><Trash2 className="w-3.5 h-3.5" /></Button>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        );
                    })}
                </Tabs>
            </div>
        </AppLayout>
    );
}
