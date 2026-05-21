import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Employee, Position } from '@/types';
import { FileText, Save, ArrowLeft, Send } from 'lucide-react';

interface KpiEvaluation {
    id: number;
    employee_id: number;
    employee: Employee & { position: Position };
    evaluator_id: number | null;
    evaluator: Employee | null;
    hr_id: number | null;
    hr: Employee | null;
    period_type: string;
    period_detail: string | null;
    evaluation_date: string;
    status: 'pending_hr' | 'pending_manager' | 'pending_employee' | 'completed';
    
    // Scores
    score_kpi_1: number;
    score_kpi_2: number;
    score_kpi_3: number;
    score_kpi_4: number;
    score_kpi_5: number;
    
    score_planning: number;
    score_analysis: number;
    score_independence: number;
    score_attitude: number;
    score_collab_sup: number;
    score_collab_peers: number;
    score_collab_sub: number;
    
    score_attendance: number;
    score_punctuality: number;
    score_obedience: number;
    
    rec_1: string | null;
    rec_2: string | null;
    rec_3: string | null;
    
    employee_comment: string | null;
    total_score: number;
}

interface Props {
    evaluation?: KpiEvaluation;
    employees?: Employee[];
    isHR: boolean;
    isManager: boolean;
    isEmployee: boolean;
    canEdit: boolean;
}

export default function KpiForm({ evaluation, employees, isHR, isManager, isEmployee, canEdit }: Props) {
    const isEditing = !!evaluation;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Evaluasi KPI', href: '/kpi-evaluations' },
        { title: isEditing ? 'Detail Evaluasi' : 'Buat Evaluasi', href: '#' },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        employee_id: evaluation?.employee_id?.toString() ?? '',
        period_type: evaluation?.period_type ?? '6_month',
        period_detail: evaluation?.period_detail ?? '',
        evaluation_date: evaluation?.evaluation_date ? new Date(evaluation.evaluation_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        
        // HR Section
        score_attendance: evaluation?.score_attendance ?? 0,
        score_punctuality: evaluation?.score_punctuality ?? 0,
        score_obedience: evaluation?.score_obedience ?? 0,
        
        // Manager Section
        score_kpi_1: evaluation?.score_kpi_1 ?? 0,
        score_kpi_2: evaluation?.score_kpi_2 ?? 0,
        score_kpi_3: evaluation?.score_kpi_3 ?? 0,
        score_kpi_4: evaluation?.score_kpi_4 ?? 0,
        score_kpi_5: evaluation?.score_kpi_5 ?? 0,
        
        score_planning: evaluation?.score_planning ?? 0,
        score_analysis: evaluation?.score_analysis ?? 0,
        score_independence: evaluation?.score_independence ?? 0,
        score_attitude: evaluation?.score_attitude ?? 0,
        score_collab_sup: evaluation?.score_collab_sup ?? 0,
        score_collab_peers: evaluation?.score_collab_peers ?? 0,
        score_collab_sub: evaluation?.score_collab_sub ?? 0,
        
        rec_1: evaluation?.rec_1 ?? '',
        rec_2: evaluation?.rec_2 ?? '',
        rec_3: evaluation?.rec_3 ?? '',
        
        // Employee Section
        employee_comment: evaluation?.employee_comment ?? '',
    });

    const selectedEmployee = employees?.find(e => e.id.toString() === data.employee_id) || evaluation?.employee;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isEditing) {
            put(`/kpi-evaluations/${evaluation.id}`);
        } else {
            post('/kpi-evaluations');
        }
    }

    const renderHRSection = () => (
        <div className="space-y-6 mt-10">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white border-b pb-2">Bagian D: Kedisiplinan & Kepatuhan (HRD)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { key: 'score_attendance', label: 'Kehadiran (Absensi)', desc: 'Kehadiran sesuai hari kerja' },
                    { key: 'score_punctuality', label: 'Ketepatan Waktu', desc: 'Tidak terlambat/pulang cepat' },
                    { key: 'score_obedience', label: 'Kepatuhan Aturan', desc: 'Taat pada peraturan & SOP' }
                ].map(item => (
                    <div key={item.key}>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{item.label}</label>
                        <p className="text-xs text-neutral-500 mb-2">{item.desc}</p>
                        <select 
                            disabled={!isHR || (isEditing && evaluation?.status !== 'pending_hr' && !canEdit && evaluation?.status !== 'pending_manager')}
                            value={(data as any)[item.key]} 
                            onChange={e => setData(item.key as any, parseInt(e.target.value))}
                            className="w-full rounded-lg border-neutral-300 text-sm dark:bg-neutral-800 dark:border-neutral-700"
                        >
                            <option value={0}>Pilih Skor</option>
                            <option value={3}>3 - Sangat Baik</option>
                            <option value={2}>2 - Baik / Cukup</option>
                            <option value={1}>1 - Perlu Perbaikan</option>
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderManagerSectionPart1 = () => (
        <div className="space-y-8 mt-10">
            <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white border-b pb-2 mb-4">Bagian B: Parameter Tugas Pokok Jabatan (KPI)</h3>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(num => {
                        const kpiText = (selectedEmployee as any)?.position?.[`kpi_${num}`];
                        if (!kpiText && isEditing) return null;
                        return (
                            <div key={num} className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">KPI {num}</span>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-white mt-1">{kpiText || `Parameter KPI ${num} belum diset di Jabatan.`}</p>
                                    </div>
                                    <div className="w-full md:w-48">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-xs font-bold text-neutral-500">Skor: <span className="text-blue-600">{(data as any)[`score_kpi_${num}`]}</span></label>
                                            <span className="text-[10px] text-neutral-400">0 - 10</span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="10" step="1"
                                            disabled={!isManager || evaluation?.status !== 'pending_manager'}
                                            value={(data as any)[`score_kpi_${num}`]}
                                            onChange={e => setData(`score_kpi_${num}` as any, parseInt(e.target.value) || 0)}
                                            className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white border-b pb-2 mb-4">Bagian C: Parameter Umum & Perilaku</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { key: 'score_planning', label: 'Perencanaan & Pengaturan Kerja', desc: 'Kemampuan menyusun rencana & jadwal kerja' },
                        { key: 'score_analysis', label: 'Analisa & Pemecahan Masalah', desc: 'Kemampuan identifikasi & solusi masalah' },
                        { key: 'score_independence', label: 'Kemandirian & Inisiatif', desc: 'Bekerja tanpa pengawasan ketat' },
                        { key: 'score_attitude', label: 'Sikap Kerja & Tanggung Jawab', desc: 'Integritas & kepedulian hasil' },
                        { key: 'score_collab_sup', label: 'Kerjasama dengan Atasan', desc: 'Komunikasi & respon instruksi' },
                        { key: 'score_collab_peers', label: 'Kerjasama dengan Rekan Sejawat', desc: 'Relasi & bantuan tim' },
                        { key: 'score_collab_sub', label: 'Kerjasama dengan Bawahan', desc: 'Kepemimpinan & bimbingan' },
                    ].map(item => (
                        <div key={item.key} className="flex flex-col">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{item.label}</label>
                            <p className="text-xs text-neutral-500 mb-2">{item.desc}</p>
                            <select 
                                disabled={!isManager || evaluation?.status !== 'pending_manager'}
                                value={(data as any)[item.key]} 
                                onChange={e => setData(item.key as any, parseInt(e.target.value))}
                                className="w-full rounded-lg border-neutral-300 text-sm dark:bg-neutral-800 dark:border-neutral-700 mt-auto"
                            >
                                <option value={0}>Pilih Skor / N/A</option>
                                <option value={3}>3 - Sangat Baik / Mencapai Target</option>
                                <option value={2}>2 - Baik / Cukup</option>
                                <option value={1}>1 - Perlu Perbaikan</option>
                            </select>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderManagerSectionPart2 = () => (
        <div className="space-y-8 mt-10">
            <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white border-b pb-2 mb-4">Bagian E: Rekomendasi & Pengembangan</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map(num => (
                        <div key={num}>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Poin Rekomendasi {num}</label>
                            <textarea 
                                disabled={!isManager || evaluation?.status !== 'pending_manager'}
                                value={(data as any)[`rec_${num}`]}
                                onChange={e => setData(`rec_${num}` as any, e.target.value)}
                                rows={2}
                                className="w-full rounded-lg border-neutral-300 text-sm dark:bg-neutral-800 dark:border-neutral-700"
                                placeholder={`Masukkan rekomendasi/rencana pengembangan ke-${num}...`}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderEmployeeSection = () => (
        <div className="space-y-4 mt-10">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white border-b pb-2">Bagian F: Komentar / Pengakuan Karyawan</h3>
            <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Komentar Karyawan</label>
                <textarea 
                    disabled={!isEmployee || evaluation?.status !== 'pending_employee'}
                    value={data.employee_comment}
                    onChange={e => setData('employee_comment', e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border-neutral-300 text-sm dark:bg-neutral-800 dark:border-neutral-700"
                    placeholder="Masukkan tanggapan atau komentar Anda mengenai hasil evaluasi ini..."
                />
                {errors.employee_comment && <p className="mt-1 text-xs text-red-500">{errors.employee_comment}</p>}
            </div>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? 'Detail Evaluasi KPI' : 'Buat Evaluasi KPI'} />
            
            <div className="max-w-5xl mx-auto p-6">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/kpi-evaluations" className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                            {isEditing ? `Evaluasi KPI - ${evaluation.employee.nama}` : 'Buat Evaluasi KPI Baru'}
                        </h1>
                        {isEditing && (
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                                    evaluation.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                                }`}>
                                    Status: {evaluation.status.replace('_', ' ')}
                                </span>
                                <span className="text-xs text-neutral-500">• Skor Akhir: <span className="font-bold text-blue-600">{(evaluation.total_score / 10).toFixed(1)} / 10.0</span></span>
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Header: Info Umum */}
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <FileText className="w-24 h-24" />
                        </div>
                        
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white border-b pb-2 mb-6">Bagian A: Data Karyawan & Detail Evaluasi</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Nama Karyawan</label>
                                    {!isEditing ? (
                                        <select 
                                            value={data.employee_id} 
                                            onChange={e => setData('employee_id' as any, e.target.value)}
                                            className="w-full rounded-xl border-neutral-300 text-sm py-3 dark:bg-neutral-800 dark:border-neutral-700"
                                        >
                                            <option value="">Pilih Karyawan</option>
                                            {employees?.map(e => <option key={e.id} value={e.id}>{e.nama} ({e.nik})</option>)}
                                        </select>
                                    ) : (
                                        <div className="text-sm font-semibold p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                            {selectedEmployee?.nama} ({selectedEmployee?.nik})
                                        </div>
                                    )}
                                    {errors.employee_id && <p className="mt-1 text-xs text-red-500">{errors.employee_id}</p>}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Jabatan</label>
                                        <div className="text-sm p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                            {(selectedEmployee as any)?.position?.name ?? '-'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Hire Date</label>
                                        <div className="text-sm p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                            {selectedEmployee?.hire_date ? new Date(selectedEmployee.hire_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Periode Evaluasi</label>
                                        <select 
                                            disabled={isEditing}
                                            value={data.period_type} 
                                            onChange={e => setData('period_type' as any, e.target.value)}
                                            className="w-full rounded-xl border-neutral-300 text-sm py-3 dark:bg-neutral-800 dark:border-neutral-700"
                                        >
                                            <option value="6_month">6 Bulan</option>
                                            <option value="yearly">Tahunan (Yearly)</option>
                                            <option value="specific">Khusus</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Tanggal Evaluasi</label>
                                        <input 
                                            disabled={isEditing}
                                            type="date" 
                                            value={data.evaluation_date} 
                                            onChange={e => setData('evaluation_date', e.target.value)}
                                            className="w-full rounded-xl border-neutral-300 text-sm py-3 dark:bg-neutral-800 dark:border-neutral-700"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Keterangan Periode</label>
                                    <input 
                                        disabled={isEditing}
                                        type="text" 
                                        value={data.period_detail} 
                                        onChange={e => setData('period_detail', e.target.value)}
                                        className="w-full rounded-xl border-neutral-300 text-sm py-3 dark:bg-neutral-800 dark:border-neutral-700"
                                        placeholder="Contoh: Jan - Jun 2026 atau Pasca Percobaan"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm">
                        {(isEditing || isManager) && renderManagerSectionPart1()}
                        {renderHRSection()}
                        {(isEditing || isManager) && renderManagerSectionPart2()}
                        {(isEditing || isEmployee) && (evaluation?.status === 'pending_employee' || evaluation?.status === 'completed') && renderEmployeeSection()}

                        {(canEdit || !isEditing) && (
                            <div className="mt-12 flex justify-end gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={() => window.open(`/kpi-evaluations/${evaluation.id}/pdf`, '_blank')}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Cetak PDF
                                    </button>
                                )}
                                <Link href="/kpi-evaluations" className="px-6 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Simpan
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
