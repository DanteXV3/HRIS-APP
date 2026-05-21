import { Head, router } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Calendar, User, Package } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface MSRItem {
    id: number;
    msr_id: number;
    category: string;
    item_code: string;
    item_name: string;
    qty: string;
    price: string;
    total_price: string;
    keterangan: string;
    msr: {
        id: number;
        msr_number: string;
        date: string;
        status: string;
        requested_by: {
            nama: string;
        };
    };
}

interface BudgetItem {
    id: number;
    item_code: string;
    nama_budget: string;
    budget_unit: string;
    working_location: {
        name: string;
    };
}

interface Props {
    budgetItem: BudgetItem;
    msrItems: MSRItem[];
}

export default function SummaryShow({ budgetItem, msrItems }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Cost Control', href: '#' },
        { title: 'Summary Budgeting', href: '/cost-control/summary-budgeting' },
        { title: 'Details', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Details - ${budgetItem.nama_budget}`} />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => router.get('/cost-control/summary-budgeting')}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 italic">
                                {budgetItem.item_code} - {budgetItem.nama_budget}
                            </h1>
                            <p className="text-sm text-neutral-500">
                                Project: <span className="font-semibold">{budgetItem.working_location?.name || 'Unknown'}</span> | Unit: <span className="font-semibold">{budgetItem.budget_unit}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
                        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider mb-1">Total Items Linked</div>
                        <div className="text-2xl font-black text-indigo-900 dark:text-indigo-200">{msrItems.length}</div>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1">Status</div>
                        <div><Badge className="bg-emerald-500">Approved Only</Badge></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader className="bg-neutral-50 dark:bg-neutral-950 text-[10px] uppercase tracking-tighter">
                            <TableRow>
                                <TableHead>No. MSR</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Pemohon</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Qty</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {msrItems.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-10 text-neutral-500">
                                        No MSR records found for this budget item.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                msrItems.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-neutral-50/30">
                                        <TableCell className="font-bold text-indigo-600">{item.msr?.msr_number || 'TRASH'}</TableCell>
                                        <TableCell className="text-sm">
                                            <div className="flex items-center gap-1 font-medium">
                                                <Calendar className="w-3 h-3 text-neutral-400" />
                                                {item.msr?.date ? new Date(item.msr.date).toLocaleDateString('id-ID') : '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            <div className="flex items-center gap-1">
                                                <User className="w-3 h-3 text-neutral-400" />
                                                {item.msr?.requested_by?.nama || 'Unknown'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">{parseFloat(item.qty).toLocaleString()}</TableCell>
                                        <TableCell className="text-right text-sm text-neutral-500">{formatCurrency(item.price)}</TableCell>
                                        <TableCell className="text-right font-bold text-indigo-900 dark:text-indigo-400">{formatCurrency(item.total_price)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => router.get(`/msr/${item.msr_id}`)}
                                                className="text-indigo-600 h-8 px-2"
                                            >
                                                <ExternalLink className="w-3 h-3 mr-1" />
                                                View MSR
                                            </Button>
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
