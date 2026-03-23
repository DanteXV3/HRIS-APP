import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Search, Upload, FileSpreadsheet, Download, Pencil, CheckCircle2, XCircle, Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Pagination } from '@/types';
import { useState, useEffect } from 'react';

interface Attendance {
    id: number;
    employee_id: number;
    tanggal: string;
    clock_in: string | null;
    clock_out: string | null;
    jam_masuk: string | null;
    jam_pulang: string | null;
    early_in_minutes: number;
    late_in_minutes: number;
    early_out_minutes: number;
    status: string;
    overtime_minutes: number;
    verified_lembur_minutes: number;
    is_holiday: boolean;
    notes: string | null;
    clock_in_lat: number | null;
    clock_in_lng: number | null;
    clock_out_lat: number | null;
    clock_out_lng: number | null;
    late_out_minutes: number;
    employee?: {
        id: number;
        nik: string;
        nama: string;
        shift_id?: number | null;
        department?: { name: string };
        position?: { name: string };
        shift?: { name: string; jam_masuk: string; jam_pulang: string };
    };
}

interface Props {
    attendances: Pagination<Attendance>;
    filters: { search?: string, tanggal_start?: string, tanggal_end?: string, work_location_id?: string };
    employees?: any[];
    workLocations?: { id: number, name: string }[];
}

export default function AttendanceIndex({ attendances, filters, employees, workLocations }: Props) {
    const { auth } = usePage<{ auth: { user: any } }>().props;
    const canCreate = auth.user.can?.includes('attendance.create_others') || auth.user.role === 'admin';
    const canEdit = auth.user.can?.includes('attendance.edit_others') || auth.user.role === 'admin';

    const [search, setSearch] = useState(filters.search || '');
    const [tanggalStart, setTanggalStart] = useState(filters.tanggal_start || '');
    const [tanggalEnd, setTanggalEnd] = useState(filters.tanggal_end || '');
    const [workLocationId, setWorkLocationId] = useState(filters.work_location_id || '');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Data Absensi', href: '/attendances' },
    ];

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        const query: any = {};
        if (search) query.search = search;
        if (tanggalStart) query.tanggal_start = tanggalStart;
        if (tanggalEnd) query.tanggal_end = tanggalEnd;
        if (workLocationId) query.work_location_id = workLocationId;
        router.get('/attendances', query, { preserveState: true });
    }

    function resetFilters() {
        setSearch('');
        setTanggalStart('');
        setTanggalEnd('');
        setWorkLocationId('');
        router.get('/attendances');
    }

    function handleExport() {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (tanggalStart) params.append('tanggal_start', tanggalStart);
        if (tanggalEnd) params.append('tanggal_end', tanggalEnd);
        if (workLocationId) params.append('work_location_id', workLocationId);
        
        window.location.href = `/attendances/export?${params.toString()}`;
    }

    const { data: uploadData, setData: setUploadData, post: postUpload, processing: isUploading, errors: uploadErrors, reset: resetUpload } = useForm({
        file: null as File | null,
    });

    const createForm = useForm({
        employee_id: '',
        tanggal: new Date().toISOString().split('T')[0],
        status: 'hadir',
        clock_in: '',
        clock_out: '',
        is_holiday: false,
        verified_lembur_hours: 0,
        notes: '',
    });

    const editForm = useForm({
        tanggal: '',
        clock_in: '',
        clock_out: '',
        status: 'hadir',
        is_holiday: false,
        verified_lembur_hours: 0,
        notes: '',
    });

    useEffect(() => {
        if (createForm.data.employee_id && createForm.data.clock_out && createForm.data.tanggal && employees) {
            const emp = employees.find((e: any) => e.id.toString() === createForm.data.employee_id.toString());
            if (emp && emp.shift && emp.shift.jam_pulang) {
                const clockOutTime = new Date(createForm.data.clock_out).getTime();
                const shiftOutTime = new Date(`${createForm.data.tanggal}T${emp.shift.jam_pulang}`).getTime();
                if (clockOutTime > shiftOutTime) {
                    const diffMins = Math.floor((clockOutTime - shiftOutTime) / 60000);
                    // auto calculate hours (e.g. 90 mins -> 1.5)
                    createForm.setData('verified_lembur_hours', Number((diffMins / 60).toFixed(1)));
                } else {
                    createForm.setData('verified_lembur_hours', 0);
                }
            }
        }
    }, [createForm.data.clock_out, createForm.data.employee_id, createForm.data.tanggal]);

    function handleImport(e: React.FormEvent) {
        e.preventDefault();
        postUpload('/attendances/import', {
            onSuccess: () => {
                setShowUploadModal(false);
                resetUpload('file');
            },
            forceFormData: true,
        });
    }

    function handleCreateSubmit(e: React.FormEvent) {
        e.preventDefault();
        createForm.post('/attendances', {
            onSuccess: () => {
                setShowCreateModal(false);
                createForm.reset();
            },
        });
    }

    function openEditModal(att: Attendance) {
        setEditingId(att.id);
        
        let cIn = '';
        let cOut = '';
        
        if (att.clock_in && att.clock_in.length >= 16) {
            cIn = att.clock_in.substring(11, 16);
        }
        
        if (att.clock_out && att.clock_out.length >= 16) {
            cOut = att.clock_out.substring(11, 16);
        }

        editForm.setData({
            tanggal: att.tanggal ? att.tanggal.substring(0, 10) : '',
            clock_in: cIn,
            clock_out: cOut,
            status: att.status,
            is_holiday: !!att.is_holiday,
            verified_lembur_hours: att.verified_lembur_minutes ? Number((att.verified_lembur_minutes / 60).toFixed(1)) : 0,
            notes: att.notes || '',
        });
    }

    function handleEditSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!editingId) return;
        editForm.put(`/attendances/${editingId}`, {
            onSuccess: () => setEditingId(null),
        });
    }

    function handleDelete() {
        if (!editingId) return;
        if (confirm('Apakah Anda yakin ingin menghapus data absensi ini?')) {
            router.delete(`/attendances/${editingId}`, {
                onSuccess: () => setEditingId(null),
            });
        }
    }

    function generateTemplate() {
        const content = "NIK,Tanggal,Clock In,Clock Out,Status,Overtime (Menit),Notes\n12345,2026-03-01,08:00,17:00,Hadir,60,Lembur 1 Jam\n54321,2026-03-01,,,,Alpa,0,Tidak ada kabar";
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "template_absensi.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Helper to format minutes to "HH:mm"
    function formatMinutes(minutes: number) {
        if (!minutes || minutes <= 0) return '00:00';
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Absensi" />
            
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Data Absensi</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola data kehadiran, periksa jam masuk/pulang, dan verifikasi lembur karyawan.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {auth.user.can?.includes('attendance.view_others') || auth.user.role === 'admin' ? (
                            <button
                                onClick={handleExport}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 w-full sm:w-auto"
                            >
                                <FileSpreadsheet className="h-4 w-4" /> Download Excel
                            </button>
                        ) : null}
                        {canCreate && (
                            <>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 w-full sm:w-auto"
                                >
                                    <Plus className="h-4 w-4" /> Tambah Manual
                                </button>
                                <button
                                    onClick={() => setShowUploadModal(true)}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 w-full sm:w-auto"
                                >
                                    <Upload className="h-4 w-4" /> Import CSV
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2 w-full">
                                        <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Search className="h-4 w-4 text-neutral-400" />
                                            </div>
                                            <input
                                                type="text"
                                                className="block w-full sm:max-w-xs rounded-lg border border-neutral-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-neutral-500 focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-400"
                                                placeholder="Cari nama atau NIK..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <input 
                                                type="date"
                                                className="block rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                                value={tanggalStart}
                                                onChange={e => setTanggalStart(e.target.value)}
                                            />
                                            <span className="self-center text-neutral-500 dark:text-neutral-400">-</span>
                                            <input 
                                                type="date"
                                                className="block rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                                value={tanggalEnd}
                                                onChange={e => setTanggalEnd(e.target.value)}
                                            />
                                        </div>
                                        <select
                                            className="block rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                            value={workLocationId}
                                            onChange={e => setWorkLocationId(e.target.value)}
                                        >
                                            <option value="">Semua Perusahaan</option>
                                            {workLocations?.map(loc => (
                                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="submit"
                                            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 dark:focus:ring-white"
                                        >
                                            Filter
                                        </button>
                                        {(search || tanggalStart || tanggalEnd || workLocationId) && (
                                            <button
                                                type="button"
                                                onClick={resetFilters}
                                                className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                                            >
                                                Reset
                                            </button>
                                        )}
                                    </form>
                </div>

                <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-700">
                    <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                            <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Tanggal</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Karyawan</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Shift</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Absen (In/Out)</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Late / Early</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Status</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Lembur</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
                                {attendances.data.length > 0 ? (
                                    attendances.data.map((att) => (
                                        <tr key={att.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                            <td className="whitespace-nowrap px-4 py-4">
                                                <div className="text-sm font-medium text-neutral-900 dark:text-white">
                                                    {new Date(att.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                                {att.is_holiday ? (
                                                    <span className="inline-flex mt-1 items-center rounded-sm bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">Holiday</span>
                                                ) : null}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4">
                                                <div className="text-sm font-medium text-neutral-900 dark:text-white">{att.employee?.nama}</div>
                                                <div className="text-xs text-neutral-500 dark:text-neutral-400">{att.employee?.nik}</div>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 text-center">
                                                <div className="text-xs font-medium text-blue-700 dark:text-blue-400">{att.employee?.shift?.name || 'No Shift'}</div>
                                                <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                                                    {att.jam_masuk ? att.jam_masuk.substring(0,5) : '-'} / {att.jam_pulang ? att.jam_pulang.substring(0,5) : '-'}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 text-center">
                                                <div className="text-sm text-neutral-900 dark:text-white">
                                                    {att.clock_in ? att.clock_in.substring(11, 16) : '-'} — 
                                                    {att.clock_out ? att.clock_out.substring(11, 16) : '-'}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    {att.late_in_minutes > 0 && <span className="text-[10px] bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 px-1.5 py-0.5 rounded">Late {formatMinutes(att.late_in_minutes)}</span>}
                                                    {att.early_out_minutes > 0 && <span className="text-[10px] bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 px-1.5 py-0.5 rounded">Early {formatMinutes(att.early_out_minutes)}</span>}
                                                    {att.late_in_minutes === 0 && att.early_out_minutes === 0 && att.clock_in && att.clock_out && (
                                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 text-center">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                                                    ${att.status === 'hadir' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                                                      att.status === 'sakit' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                                                      att.status === 'izin' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 
                                                      att.status === 'cuti' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' : 
                                                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                    {att.status}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Raw: {formatMinutes(att.overtime_minutes)}</div>
                                                    <div className="text-sm font-semibold text-green-600 dark:text-green-400">✔ {formatMinutes(att.verified_lembur_minutes)}</div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 text-center">
                                                {canEdit && (
                                                    <button
                                                        onClick={() => openEditModal(att)}
                                                        className="inline-flex items-center justify-center p-2 rounded hover:bg-neutral-100 text-blue-600 dark:hover:bg-neutral-800 dark:text-blue-500 transition-colors"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
                                            Tidak ada data absensi ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                </div>

                {/* Pagination */}
                {attendances.links && attendances.links.length > 3 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-neutral-500">Menampilkan {attendances.from}-{attendances.to} dari {attendances.total} data</p>
                        <div className="flex flex-wrap items-center justify-center gap-1">
                        {attendances.links.map((link, i) => {
                            const isPrev = link.label.includes('Previous');
                            const isNext = link.label.includes('Next');
                            const label = isPrev ? '«' : isNext ? '»' : link.label;
                            
                            return link.url ? (
                                <button
                                    key={i}
                                    onClick={() => router.get(link.url!)}
                                    className={`rounded-md px-3 py-1 text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-neutral-700 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'} border border-neutral-200 dark:border-neutral-700`}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: label }}></span>
                                </button>
                            ) : (
                                <span key={i} className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900/50">
                                    <span dangerouslySetInnerHTML={{ __html: label }}></span>
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-neutral-900">
                        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 dark:border-neutral-800">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                                Import CSV Absensi
                            </h3>
                            <button onClick={() => setShowUploadModal(false)} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300">
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleImport} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Upload File (.csv)</label>
                                    <input 
                                        type="file" 
                                        accept=".csv,.txt"
                                        onChange={e => setUploadData('file', e.target.files?.[0] || null)}
                                        className="block w-full text-sm text-neutral-500 file:mr-4 file:rounded-md file:border-neutral-300 file:bg-neutral-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-neutral-700 hover:file:bg-neutral-200 dark:text-neutral-400 dark:file:bg-neutral-800 dark:file:text-neutral-300 dark:hover:file:bg-neutral-700" 
                                    />
                                    {uploadErrors.file && <p className="mt-2 text-xs text-red-500">{uploadErrors.file}</p>}
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-xs font-medium text-blue-800 dark:text-blue-300">Format CSV:</p>
                                        <button type="button" onClick={generateTemplate} className="text-xs font-medium text-blue-700 hover:underline flex items-center gap-1 dark:text-blue-400">
                                            <Download className="w-3 h-3" /> Template
                                        </button>
                                    </div>
                                    <p className="text-xs text-blue-600/80 dark:text-blue-400/80 font-mono mt-1">
                                        NIK,Tanggal,Clock In,Clock Out,Status,Overtime,Notes
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowUploadModal(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">
                                    Batal
                                </button>
                                <button type="submit" disabled={isUploading || !uploadData.file} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                                    {isUploading ? 'Mengimport...' : 'Import Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-neutral-900">
                        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 dark:border-neutral-800">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                                <Pencil className="w-5 h-5 text-blue-600" />
                                Edit Data Absensi
                            </h3>
                            <button type="button" onClick={() => setEditingId(null)} className="p-1 hover:bg-neutral-100 rounded-full transition-colors dark:hover:bg-neutral-800">
                                <XCircle className="w-5 h-5 text-neutral-500" />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Tanggal</label>
                                    <input
                                        type="date"
                                        value={editForm.data.tanggal}
                                        onChange={e => editForm.setData('tanggal', e.target.value)}
                                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                        required
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Jam Masuk (Opsional)</label>
                                        <input
                                            type="time"
                                            value={editForm.data.clock_in}
                                            onChange={e => editForm.setData('clock_in', e.target.value)}
                                            className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                        />
                                        {attendances.data.find(a => a.id === editingId)?.clock_in_lat && (
                                            <a href={`https://www.google.com/maps/search/?api=1&query=${attendances.data.find(a => a.id === editingId)?.clock_in_lat},${attendances.data.find(a => a.id === editingId)?.clock_in_lng}`} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 hover:underline mt-1 block">
                                                📍 Lihat Lokasi Masuk
                                            </a>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Jam Pulang (Opsional)</label>
                                        <input
                                            type="time"
                                            value={editForm.data.clock_out}
                                            onChange={e => editForm.setData('clock_out', e.target.value)}
                                            className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                        />
                                        {attendances.data.find(a => a.id === editingId)?.clock_out_lat && (
                                            <a href={`https://www.google.com/maps/search/?api=1&query=${attendances.data.find(a => a.id === editingId)?.clock_out_lat},${attendances.data.find(a => a.id === editingId)?.clock_out_lng}`} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 hover:underline mt-1 block">
                                                📍 Lihat Lokasi Pulang
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Status Kehadiran</label>
                                    <select
                                        value={editForm.data.status}
                                        onChange={e => editForm.setData('status', e.target.value)}
                                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                    >
                                        <option value="hadir">Hadir</option>
                                        <option value="izin">Izin</option>
                                        <option value="sakit">Sakit</option>
                                        <option value="cuti">Cuti</option>
                                        <option value="alpha">Alpha</option>
                                        <option value="libur">Libur</option>
                                    </select>
                                    {editForm.errors.status && <p className="mt-1 text-xs text-red-500">{editForm.errors.status}</p>}
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_holiday"
                                        checked={editForm.data.is_holiday}
                                        onChange={e => editForm.setData('is_holiday', e.target.checked)}
                                        className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900"
                                    />
                                    <label htmlFor="is_holiday" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Tandai sebagai Hari Libur Nasional</label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Verified Lembur (Jam)</label>
                                    <div className="relative rounded-md shadow-sm">
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={editForm.data.verified_lembur_hours}
                                            onChange={e => editForm.setData('verified_lembur_hours', parseFloat(e.target.value) || 0)}
                                            className="block w-full rounded-md border-neutral-300 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                        />
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                            <span className="text-neutral-500 sm:text-sm">h</span>
                                        </div>
                                    </div>
                                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Masukkan durasi lembur (contoh: 1.5 untuk 1 jam 30 menit).</p>
                                    {editForm.errors.verified_lembur_hours && <p className="mt-1 text-xs text-red-500">{editForm.errors.verified_lembur_hours}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Catatan</label>
                                    <textarea
                                        rows={2}
                                        value={editForm.data.notes}
                                        onChange={e => editForm.setData('notes', e.target.value)}
                                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                        placeholder="Catatan tambahan (opsional)..."
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-6 flex items-center justify-between">
                                {canEdit && (
                                    <button type="button" onClick={handleDelete} className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                                        Hapus
                                    </button>
                                )}
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setEditingId(null)} className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">
                                        Batal
                                    </button>
                                    <button type="submit" disabled={editForm.processing} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50">
                                        {editForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Manual Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity overflow-y-auto">
                    <div className="w-full max-w-lg mt-10 overflow-hidden rounded-xl bg-white shadow-xl dark:bg-neutral-900">
                        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 dark:border-neutral-800">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Tambah Absensi Manual</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateSubmit} className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Karyawan</label>
                                    <select
                                        value={createForm.data.employee_id}
                                        onChange={e => createForm.setData('employee_id', e.target.value)}
                                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                        required
                                    >
                                        <option value="">-- Pilih Karyawan --</option>
                                        {employees?.map((emp: any) => (
                                            <option key={emp.id} value={emp.id}>{emp.nik} - {emp.nama}</option>
                                        ))}
                                    </select>
                                    {createForm.errors.employee_id && <p className="mt-1 text-xs text-red-500">{createForm.errors.employee_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Tanggal</label>
                                    <input
                                        type="date"
                                        value={createForm.data.tanggal}
                                        onChange={e => createForm.setData('tanggal', e.target.value)}
                                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                        required
                                    />
                                    {createForm.errors.tanggal && <p className="mt-1 text-xs text-red-500">{createForm.errors.tanggal}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Status Kehadiran</label>
                                    <select
                                        value={createForm.data.status}
                                        onChange={e => createForm.setData('status', e.target.value)}
                                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                    >
                                        <option value="hadir">Hadir</option>
                                        <option value="izin">Izin</option>
                                        <option value="sakit">Sakit</option>
                                        <option value="cuti">Cuti</option>
                                        <option value="alpha">Alpha</option>
                                        <option value="libur">Libur</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Jam Masuk (Opsional)</label>
                                    <input
                                        type="time"
                                        value={createForm.data.clock_in}
                                        onChange={e => createForm.setData('clock_in', e.target.value)}
                                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Jam Pulang (Opsional)</label>
                                    <input
                                        type="time"
                                        value={createForm.data.clock_out}
                                        onChange={e => createForm.setData('clock_out', e.target.value)}
                                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                    />
                                </div>

                                <div className="sm:col-span-2 flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="create_is_holiday"
                                        checked={createForm.data.is_holiday}
                                        onChange={e => createForm.setData('is_holiday', e.target.checked)}
                                        className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900"
                                    />
                                    <label htmlFor="create_is_holiday" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Tandai sebagai Hari Libur Nasional</label>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Verified Lembur (Jam)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        value={createForm.data.verified_lembur_hours}
                                        onChange={e => createForm.setData('verified_lembur_hours', parseFloat(e.target.value) || 0)}
                                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Catatan</label>
                                    <textarea
                                        rows={2}
                                        value={createForm.data.notes}
                                        onChange={e => createForm.setData('notes', e.target.value)}
                                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                        placeholder="Catatan tambahan (opsional)..."
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">
                                    Batal
                                </button>
                                <button type="submit" disabled={createForm.processing} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50">
                                    {createForm.processing ? 'Menyimpan...' : 'Simpan Absensi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
