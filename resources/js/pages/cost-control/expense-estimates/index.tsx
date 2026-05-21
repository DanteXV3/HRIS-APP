import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Trash2, Eye } from 'lucide-react';
import { useState, FormEventHandler } from 'react';

interface Props {
    estimates: { data: any[]; links: any[] };
    companies: { id: number; name: string; code: string }[];
    canCreate: boolean;
}

const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

export default function ExpenseEstimateIndex({ estimates, companies, canCreate }: Props) {
    const [open, setOpen] = useState(false);
    const form = useForm({ month: (new Date().getMonth() + 1).toString(), year: new Date().getFullYear().toString(), company_id: '', copy_last_month: false });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Cost Control', href: '#' },
        { title: 'Estimasi Pengeluaran', href: '/cost-control/expense-estimates' },
    ];

    const submit: FormEventHandler = (e) => { e.preventDefault(); form.post('/cost-control/expense-estimates', { onSuccess: () => setOpen(false) }); };

    const fmt = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Estimasi Pengeluaran" />
            <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2"><FileText className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" /> Estimasi Pengeluaran</h1>
                        <p className="text-sm text-neutral-500">Kelola estimasi pengeluaran bulanan per perusahaan.</p>
                    </div>
                    {canCreate && (
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto"><Plus className="w-4 h-4 mr-2" /> Buat Draft Baru</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Buat Draft Estimasi Baru</DialogTitle></DialogHeader>
                                <form onSubmit={submit} className="space-y-4 pt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Bulan</Label>
                                            <Select value={form.data.month} onValueChange={(v) => form.setData('month', v)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>{MONTHS.map((m, i) => <SelectItem key={i} value={(i+1).toString()}>{m}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Tahun</Label>
                                            <Select value={form.data.year} onValueChange={(v) => form.setData('year', v)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>{[2025,2026,2027,2028].map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Perusahaan</Label>
                                        <Select value={form.data.company_id} onValueChange={(v) => form.setData('company_id', v)}>
                                            <SelectTrigger className={form.errors.company_id ? 'border-red-500' : ''}><SelectValue placeholder="Pilih perusahaan..." /></SelectTrigger>
                                            <SelectContent>{companies.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.code} - {c.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                        {form.errors.company_id && <p className="text-sm text-red-500">{form.errors.company_id}</p>}
                                        {(form.errors as any).error && <p className="text-sm text-red-500">{(form.errors as any).error}</p>}
                                    </div>
                                    <div className="flex items-center gap-2 pt-2">
                                        <input type="checkbox" id="copy_last_month" checked={form.data.copy_last_month as boolean} onChange={(e) => form.setData('copy_last_month', e.target.checked as any)} className="rounded" />
                                        <label htmlFor="copy_last_month" className="text-sm">Copy item dari bulan sebelumnya</label>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
                                        <Button type="submit" disabled={form.processing} className="bg-indigo-600 hover:bg-indigo-700">Buat Draft</Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-neutral-50 dark:bg-neutral-950">
                            <TableRow><TableHead>Periode</TableHead><TableHead>Perusahaan</TableHead><TableHead className="text-center">Items</TableHead><TableHead className="text-right">Total Nominal</TableHead><TableHead className="text-right">Total Dibayar</TableHead><TableHead className="text-right">Sisa</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                            {estimates.data.length === 0 ? (
                                <TableRow><TableCell colSpan={7} className="text-center py-10 text-neutral-500 italic">Belum ada draft.</TableCell></TableRow>
                            ) : estimates.data.map((est) => {
                                const nominal = parseFloat(est.items_sum_nominal || 0);
                                const paid = parseFloat(est.items_sum_nominal_dibayarkan || 0);
                                return (
                                    <TableRow key={est.id} className="cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50" onClick={() => router.get(`/cost-control/expense-estimates/${est.id}`)}>
                                        <TableCell className="font-bold">{MONTHS[est.month - 1]} {est.year}</TableCell>
                                        <TableCell><Badge variant="outline">{est.company?.code}</Badge> {est.company?.name}</TableCell>
                                        <TableCell className="text-center">{est.items_count}</TableCell>
                                        <TableCell className="text-right font-mono text-sm">{fmt(nominal)}</TableCell>
                                        <TableCell className="text-right font-mono text-sm text-green-600">{fmt(paid)}</TableCell>
                                        <TableCell className="text-right font-mono text-sm text-red-600">{fmt(nominal - paid)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1" onClick={e => e.stopPropagation()}>
                                                <Button variant="ghost" size="sm" onClick={() => router.get(`/cost-control/expense-estimates/${est.id}`)}><Eye className="w-4 h-4" /></Button>
                                                {canCreate && <Button variant="ghost" size="sm" className="text-red-600" onClick={() => { if (confirm('Hapus draft ini?')) router.delete(`/cost-control/expense-estimates/${est.id}`); }}><Trash2 className="w-4 h-4" /></Button>}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                    {estimates.data.length === 0 ? (
                        <div className="rounded-xl border bg-white dark:bg-neutral-900 p-6 text-center text-neutral-500 italic">Belum ada draft.</div>
                    ) : estimates.data.map((est) => {
                        const nominal = parseFloat(est.items_sum_nominal || 0);
                        const paid = parseFloat(est.items_sum_nominal_dibayarkan || 0);
                        return (
                            <div key={est.id} className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-sm cursor-pointer active:bg-neutral-50" onClick={() => router.get(`/cost-control/expense-estimates/${est.id}`)}>
                                <div className="flex items-center justify-between">
                                    <p className="font-bold text-neutral-900 dark:text-white">{MONTHS[est.month - 1]} {est.year}</p>
                                    <Badge variant="outline">{est.company?.code} - {est.company?.name}</Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                                    <div><span className="text-neutral-400 text-xs">Nominal</span><p className="font-mono font-bold">{fmt(nominal)}</p></div>
                                    <div><span className="text-neutral-400 text-xs">Dibayar</span><p className="font-mono text-green-600">{fmt(paid)}</p></div>
                                    <div><span className="text-neutral-400 text-xs">Sisa</span><p className="font-mono text-red-600">{fmt(nominal - paid)}</p></div>
                                </div>
                                <p className="text-xs text-neutral-400 mt-2">{est.items_count} item(s)</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
