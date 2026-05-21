import { Head, Link, router, useForm } from '@inertiajs/react';
import { ShieldCheck, Plus, FileText, CheckCircle, Clock } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useState } from 'react';

interface SecurityReport {
    id: number;
    patrol_date: string;
    shift_name: string | null;
    status: 'draft' | 'final';
    creator: { employee?: { nama: string } };
    working_location: { name: string };
    items?: any[];
}

interface Props {
    reports: { data: SecurityReport[]; links: any[] };
    workingLocations: { id: number; name: string }[];
    canCreate: boolean;
}

export default function SecurityReportsIndex({ reports, workingLocations, canCreate }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Security Reports', href: '/security/reports' },
    ];

    const [showCreateModal, setShowCreateModal] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        working_location_id: workingLocations[0]?.id || '',
        shift_name: '',
    });

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/security/reports', {
            onSuccess: () => setShowCreateModal(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Security Reports" />

            <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Security Patrol Reports</h1>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">View and manage daily security checklist reports.</p>
                    </div>
                    {canCreate && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex justify-center items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm font-medium transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Start New Patrol
                        </button>
                    )}
                </div>

                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                        <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-md shadow-xl border border-neutral-200 dark:border-neutral-800">
                            <h2 className="text-xl font-bold mb-4">Start New Patrol</h2>
                            <form onSubmit={submitCreate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Facility / Location</label>
                                    <select
                                        value={data.working_location_id}
                                        onChange={e => setData('working_location_id', e.target.value)}
                                        className="w-full rounded-lg border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800"
                                        required
                                    >
                                        <option value="" disabled>Select Location</option>
                                        {workingLocations.map(wl => (
                                            <option key={wl.id} value={wl.id}>{wl.name}</option>
                                        ))}
                                    </select>
                                    {errors.working_location_id && <p className="text-red-500 text-sm mt-1">{errors.working_location_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Shift Name (Optional)</label>
                                    <input
                                        type="text"
                                        value={data.shift_name}
                                        onChange={e => setData('shift_name', e.target.value)}
                                        placeholder="e.g. Night Shift, Shift 1"
                                        className="w-full rounded-lg border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800"
                                    />
                                </div>
                                <div className="flex gap-3 justify-end mt-6">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg font-medium">Cancel</button>
                                    <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Create Draft</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold tracking-wider uppercase text-xs">
                                    <th className="px-6 py-4">Report ID</th>
                                    <th className="px-6 py-4">Date / Shift</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Patrol Guard</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {reports.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">No reports found.</td>
                                    </tr>
                                ) : (
                                    reports.data.map(report => (
                                        <tr key={report.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                            <td className="px-6 py-4 font-mono font-medium">#REP-{report.id.toString().padStart(4, '0')}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-neutral-900 dark:text-white">{report.patrol_date}</div>
                                                {report.shift_name && <div className="text-xs text-neutral-500">{report.shift_name}</div>}
                                            </td>
                                            <td className="px-6 py-4 flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4 text-neutral-400" />
                                                {report.working_location?.name}
                                            </td>
                                            <td className="px-6 py-4">{report.creator?.employee?.nama || 'Unknown'}</td>
                                            <td className="px-6 py-4 text-center">
                                                {report.status === 'draft' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400">
                                                        <Clock className="w-3 h-3" /> Draft
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                                                        <CheckCircle className="w-3 h-3" /> Final
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/security/reports/${report.id}`}
                                                    className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-lg transition-colors gap-2"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
