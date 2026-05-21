import { Head, Link, router, usePage } from '@inertiajs/react';
import { Briefcase, Search, Plus, Users, MapPin, Calendar, Building2, ExternalLink } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/pagination';

interface Opening {
    id: number;
    uuid: string;
    company: string;
    position: string;
    working_location: string;
    requested_by: string;
    salary_min: string | null;
    salary_max: string | null;
    contract_duration: string | null;
    status: 'open' | 'closed';
    applications_count: number;
    created_at: string;
}

interface Props {
    openings: {
        data: Opening[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: { search?: string; status?: string };
}

export default function JobOpeningsIndex({ openings, filters }: Props) {
    const { auth } = usePage<any>().props;
    const canCreate = auth.user.isAdmin || auth.user.permissions?.includes('create-recruitment') || auth.user.can?.includes('create-recruitment');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Recruitment', href: '/recruitment' },
        { title: 'Lowongan Kerja', href: '#' },
    ];

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const search = (form.elements.namedItem('search') as HTMLInputElement).value;
        router.get('/job-openings', { search }, { preserveState: true });
    };

    const fmt = (n: string | null) => n ? new Intl.NumberFormat('id-ID').format(Number(n)) : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lowongan Kerja" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
                <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                            Lowongan Kerja
                        </h1>
                        <p className="text-sm text-neutral-500">Kelola lowongan kerja dan pantau lamaran masuk.</p>
                    </div>
                    {canCreate && (
                        <Button className="bg-indigo-600 hover:bg-indigo-700 h-11 shadow-lg shadow-indigo-600/20 w-full sm:w-auto" asChild>
                            <Link href="/job-openings/create">
                                <Plus className="w-4 h-4 mr-2" /> Buat Lowongan
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <form onSubmit={handleSearch} className="mb-6 flex gap-3 sm:gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                            <Input name="search" defaultValue={filters.search} placeholder="Cari posisi / perusahaan..." className="pl-10 h-11" />
                        </div>
                        <Button type="submit" variant="secondary" className="h-11 px-4 sm:px-6 font-bold">Cari</Button>
                    </form>

                    {openings.data.length === 0 ? (
                        <div className="py-16 text-center text-neutral-500 italic">
                            Belum ada lowongan kerja.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {openings.data.map((op) => (
                                <div
                                    key={op.id}
                                    onClick={() => router.get(`/job-openings/${op.id}`)}
                                    className="group cursor-pointer rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 hover:border-indigo-200 dark:hover:border-indigo-900 hover:shadow-lg transition-all bg-white dark:bg-neutral-900"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <Badge variant="outline" className={op.status === 'open' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-neutral-100 text-neutral-500 border-neutral-200'}>
                                            {op.status === 'open' ? 'Dibuka' : 'Ditutup'}
                                        </Badge>
                                        <ExternalLink className="w-4 h-4 text-neutral-300 group-hover:text-indigo-500 transition-colors" />
                                    </div>
                                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">{op.position}</h3>
                                    <div className="space-y-1.5 text-sm text-neutral-500">
                                        <div className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5 shrink-0" /> {op.company}</div>
                                        <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 shrink-0" /> {op.working_location}</div>
                                        {op.salary_min && <div className="text-xs text-neutral-400">Rp {fmt(op.salary_min)} - Rp {fmt(op.salary_max)}</div>}
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1.5 text-neutral-400">
                                            <Users className="w-3.5 h-3.5" />
                                            <span className="font-bold text-neutral-600 dark:text-neutral-300">{op.applications_count}</span> pelamar
                                        </div>
                                        <div className="flex items-center gap-1.5 text-neutral-400">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(op.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {openings.last_page > 1 && (
                        <div className="mt-6 flex justify-center">
                            <Pagination links={openings.links} />
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
