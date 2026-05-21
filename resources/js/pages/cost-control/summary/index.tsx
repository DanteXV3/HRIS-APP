import { Head, router, usePage } from '@inertiajs/react';
import { BreadcrumbItem, NavItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Eye, AlertTriangle, Download } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface BudgetItem {
    id: number;
    item_code: string;
    nama_budget: string;
    budget_unit: string;
    qty_budget: string;
    nilai_budget_material: string;
    nilai_budget_jasa: string;
    conversion_unit: string;
    nilai_msr_material: number;
    nilai_msr_jasa: number;
    total_qty_msr: number;
    sisa_budget_material: number;
    sisa_budget_jasa: number;
    qty_material_terpakai: number;
    sisa_qty_budget: number;
}

interface WorkingLocation {
    id: number;
    name: string;
}

interface Props {
    workingLocations: WorkingLocation[];
    summary: BudgetItem[];
    selectedLocationId: number | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Cost Control', href: '#' },
    { title: 'Summary Budgeting', href: '/cost-control/summary-budgeting' },
];

export default function SummaryIndex({ workingLocations, summary, selectedLocationId }: Props) {
    
    const handleLocationChange = (value: string) => {
        router.get('/cost-control/summary-budgeting', { working_location_id: value });
    };

    const getStatusIndicator = (used: number, budget: number | string) => {
        const b = typeof budget === 'string' ? parseFloat(budget) : budget;
        if (!b || b <= 0) return null;
        const percent = (used / b) * 100;

        if (percent >= 100) return <Badge variant="destructive" className="animate-pulse">OVER 100%</Badge>;
        if (percent >= 80) return <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none">CRITICAL (80%+)</Badge>;
        if (percent >= 50) return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-none">WARNING (50%+)</Badge>;
        return <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">NORMAL</Badge>;
    };

    const getUsagePercent = (used: number, budget: number | string) => {
        const b = typeof budget === 'string' ? parseFloat(budget) : budget;
        if (!b || b <= 0) return 0;
        return ((used / b) * 100).toFixed(1);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Summary Budgeting" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-indigo-900 dark:text-indigo-400 flex items-center gap-2">
                            <FileText className="w-6 h-6" />
                            Summary Budgeting
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Monitoring budget vs actual MSR consumption per project.
                        </p>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <Select
                            value={selectedLocationId?.toString()}
                            onValueChange={handleLocationChange}
                        >
                            <SelectTrigger className="w-full md:w-[250px] bg-white dark:bg-neutral-900 border-indigo-100 dark:border-indigo-900">
                                <SelectValue placeholder="Pilih Project / Lokasi" />
                            </SelectTrigger>
                            <SelectContent>
                                {workingLocations.map((loc) => (
                                    <SelectItem key={loc.id} value={loc.id.toString()}>
                                        {loc.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {selectedLocationId && (
                            <Button 
                                variant="outline" 
                                className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                                onClick={() => window.location.href = `/cost-control/summary-budgeting/download-pdf/${selectedLocationId}`}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export PDF
                            </Button>
                        )}
                    </div>
                </div>

                {!selectedLocationId ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800">
                        <AlertTriangle className="w-12 h-12 text-neutral-300 mb-4" />
                        <p className="text-neutral-500 font-medium">Silahkan pilih lokasi kerja untuk menampilkan summary budget.</p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader className="bg-neutral-50 dark:bg-neutral-950">
                                <TableRow>
                                    <TableHead className="w-[100px]">Kode Item</TableHead>
                                    <TableHead>Nama Budget</TableHead>
                                    <TableHead className="text-right">Budget Qty</TableHead>
                                    <TableHead className="text-right">Used Qty</TableHead>
                                    <TableHead className="text-right">Sisa Qty</TableHead>
                                    <TableHead className="text-right">Budget Material</TableHead>
                                    <TableHead className="text-right">Used Material</TableHead>
                                    <TableHead className="text-right">Budget Jasa</TableHead>
                                    <TableHead className="text-right">Used Jasa</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {summary.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={11} className="text-center py-10 text-neutral-500">
                                            Tidak ada data budget untuk lokasi ini.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    summary.map((item) => (
                                        <TableRow key={item.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors">
                                            <TableCell className="font-medium text-xs text-neutral-600">{item.item_code}</TableCell>
                                            <TableCell>
                                                <div className="font-medium text-sm">{item.nama_budget}</div>
                                                <div className="text-[10px] text-neutral-400 uppercase tracking-wider">{item.budget_unit}</div>
                                            </TableCell>
                                            <TableCell className="text-right text-sm">{parseFloat(item.qty_budget).toLocaleString()} {item.budget_unit}</TableCell>
                                            <TableCell className="text-right text-sm font-semibold">
                                                {item.qty_material_terpakai.toLocaleString()}
                                                <div className="text-[10px] text-neutral-400">{getUsagePercent(item.qty_material_terpakai, item.qty_budget)}%</div>
                                            </TableCell>
                                            <TableCell className={`text-right text-sm font-medium ${item.sisa_qty_budget < 0 ? 'text-red-600' : 'text-neutral-600'}`}>
                                                {item.sisa_qty_budget.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right text-xs text-neutral-500">
                                                {formatCurrency(item.nilai_budget_material)}
                                            </TableCell>
                                            <TableCell className="text-right text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                                {formatCurrency(item.nilai_msr_material)}
                                            </TableCell>
                                            <TableCell className="text-right text-xs text-neutral-500">
                                                {formatCurrency(item.nilai_budget_jasa)}
                                            </TableCell>
                                            <TableCell className="text-right text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                                {formatCurrency(item.nilai_msr_jasa)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {getStatusIndicator(
                                                    Math.max(
                                                        (item.nilai_msr_material || 0) / (parseFloat(item.nilai_budget_material) || 1),
                                                        (item.qty_material_terpakai || 0) / (parseFloat(item.qty_budget) || 1)
                                                    ) * 100 > 100 ? 100 : 0, // Simplified for now
                                                    100
                                                )}
                                                {/* Re-evaluating status logic for multi-metric */}
                                                <div className="mt-1">
                                                    {getStatusIndicator(
                                                        Math.max(
                                                            (item.nilai_msr_material + item.nilai_msr_jasa),
                                                            0
                                                        ),
                                                        (parseFloat(item.nilai_budget_material) + parseFloat(item.nilai_budget_jasa))
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon"
                                                    onClick={() => router.get(`/cost-control/summary-budgeting/${item.id}`)}
                                                >
                                                    <Eye className="w-4 h-4 text-indigo-600" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
