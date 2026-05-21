import { Head, Link, router, usePage } from '@inertiajs/react';
import { Brain, Search, Plus, Download, ExternalLink } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/pagination';

interface Test {
    id: number;
    candidate_name: string;
    candidate_info: string;
    test_type: 'disc' | 'mbti';
    results: any;
    tester?: { nama: string };
    created_at: string;
}

interface Props {
    tests: {
        data: Test[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
    };
}

export default function RecruitmentIndex({ tests, filters }: Props) {
    const { auth } = usePage<any>().props;
    const canCreate = auth.user.isAdmin || auth.user.permissions?.includes('create-recruitment') || auth.user.can?.includes('create-recruitment');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Recruitment', href: '/recruitment' },
        { title: 'Daftar Hasil Tes', href: '#' },
    ];

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const search = (form.elements.namedItem('search') as HTMLInputElement).value;
        router.get('/recruitment', { search }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Recruitment - Hasil Tes" />

            <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                            <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                            Hasil Tes Psikologi
                        </h1>
                        <p className="text-sm text-neutral-500">Kelola data hasil tes DISC dan MBTI calon karyawan.</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" className="h-9 flex-1 sm:flex-none" asChild>
                            <a href="/recruitment/blank/disc" target="_blank">
                                <Download className="w-3.5 h-3.5 mr-1.5" /> Form DISC
                            </a>
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 flex-1 sm:flex-none" asChild>
                            <a href="/recruitment/blank/mbti" target="_blank">
                                <Download className="w-3.5 h-3.5 mr-1.5" /> Form MBTI
                            </a>
                        </Button>
                        {canCreate && (
                            <>
                                <Button className="bg-indigo-600 hover:bg-indigo-700 h-9 flex-1 sm:flex-none" size="sm" asChild>
                                    <Link href="/recruitment/disc/create">
                                        <Plus className="w-3.5 h-3.5 mr-1.5" /> Input DISC
                                    </Link>
                                </Button>
                                <Button className="bg-indigo-600 hover:bg-indigo-700 h-9 flex-1 sm:flex-none" size="sm" asChild>
                                    <Link href="/recruitment/mbti/create">
                                        <Plus className="w-3.5 h-3.5 mr-1.5" /> Input MBTI
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Content Card */}
                <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="p-4 sm:p-6 pb-0 flex gap-3">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                            <Input 
                                name="search"
                                defaultValue={filters.search}
                                placeholder="Cari nama kandidat..." 
                                className="pl-10 h-10"
                            />
                        </div>
                        <Button type="submit" variant="secondary" className="h-10 px-4 font-semibold">Cari</Button>
                    </form>

                    {/* Desktop Table */}
                    <div className="hidden md:block p-4 sm:p-6">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[250px]">Kandidat</TableHead>
                                        <TableHead>Jenis Tes</TableHead>
                                        <TableHead>Hasil / Profil</TableHead>
                                        <TableHead>Diinput Oleh</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tests.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-32 text-center text-neutral-500 italic">
                                                Belum ada data hasil tes.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        tests.data.map((test) => (
                                            <TableRow key={test.id} className="group cursor-pointer" onClick={() => router.get(`/recruitment/${test.id}`)}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-600 font-bold dark:bg-neutral-800 dark:text-neutral-400 flex-shrink-0">
                                                            {test.candidate_name.charAt(0)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-neutral-900 dark:text-white truncate">{test.candidate_name}</p>
                                                            <p className="text-xs text-neutral-500 truncate">{test.candidate_info || '-'}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={test.test_type === 'disc' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}>
                                                        {test.test_type.toUpperCase()}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-lg">
                                                        {test.test_type === 'disc' ? test.results?.dominant_trait : test.results?.type}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-neutral-600 dark:text-neutral-400 text-sm">
                                                    {test.tester?.nama || 'System'}
                                                </TableCell>
                                                <TableCell className="text-neutral-600 dark:text-neutral-400 text-sm">
                                                    {new Date(test.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 group-hover:text-indigo-600">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden p-4 space-y-3">
                        {tests.data.length === 0 ? (
                            <div className="py-10 text-center text-neutral-500 italic">
                                Belum ada data hasil tes.
                            </div>
                        ) : (
                            tests.data.map((test) => (
                                <div
                                    key={test.id}
                                    className="rounded-lg border border-neutral-100 dark:border-neutral-800 p-4 cursor-pointer active:bg-neutral-50 dark:active:bg-neutral-800/50 transition-colors"
                                    onClick={() => router.get(`/recruitment/${test.id}`)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-600 font-bold dark:bg-neutral-800 dark:text-neutral-400 flex-shrink-0">
                                            {test.candidate_name.charAt(0)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="font-bold text-neutral-900 dark:text-white truncate">{test.candidate_name}</p>
                                                <Badge variant="outline" className={`flex-shrink-0 text-[10px] ${test.test_type === 'disc' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                                                    {test.test_type.toUpperCase()}
                                                </Badge>
                                            </div>
                                            {test.candidate_info && (
                                                <p className="text-xs text-neutral-500 truncate">{test.candidate_info}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-lg">
                                                {test.test_type === 'disc' ? test.results?.dominant_trait : test.results?.type}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-neutral-400">
                                                {new Date(test.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                            <p className="text-xs text-neutral-400">{test.tester?.nama || 'System'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {tests.last_page > 1 && (
                        <div className="p-4 sm:p-6 pt-0 flex justify-center">
                            <Pagination links={tests.links} />
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
