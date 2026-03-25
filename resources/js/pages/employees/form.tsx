import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import SignaturePad from '@/components/signature-pad';
import type { BreadcrumbItem, Employee } from '@/types';

interface Props {
    employee?: Employee;
    departments: { id: number; name: string }[];
    positions: { id: number; name: string; department_id: number; grade: string }[];
    workLocations: { id: number; name: string }[];
    workingLocations: { id: number; name: string }[];
    shifts: { id: number; name: string; jam_masuk: string; jam_pulang: string }[];
    permissions: { id: number; name: string; module: string }[];
    userPermissions?: number[];
    allEmployees: { id: number; nama: string; nik: string }[];
}

// Defined OUTSIDE the component to prevent re-creation on every render
function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="col-span-full border-b border-neutral-200 pb-2 text-lg font-semibold text-neutral-900 dark:border-neutral-700 dark:text-white">{children}</h2>;
}

const inputClass = "mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white";

export default function EmployeeForm() {
    const { employee, departments, positions, workLocations, workingLocations, shifts, permissions, userPermissions, allEmployees } = usePage<{ props: Props }>().props as unknown as Props;
    const isEditing = !!employee;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Karyawan', href: '/employees' },
        { title: isEditing ? 'Edit' : 'Tambah', href: '#' },
    ];

    const { data, setData, post, transform, processing, errors } = useForm<Record<string, any>>({
        nama: employee?.nama ?? '',
        tempat_lahir: employee?.tempat_lahir ?? '',
        tanggal_lahir: employee?.tanggal_lahir?.substring(0, 10) ?? '',
        alamat_tetap: employee?.alamat_tetap ?? '',
        alamat_sekarang: employee?.alamat_sekarang ?? '',
        email: employee?.email ?? '',
        password: '',
        gender: employee?.gender ?? '',
        status_pernikahan: employee?.status_pernikahan ?? '',
        pendidikan_terakhir: employee?.pendidikan_terakhir ?? '',
        agama: employee?.agama ?? '',
        no_telpon_1: employee?.no_telpon_1 ?? '',
        no_telpon_2: employee?.no_telpon_2 ?? '',
        no_ktp: employee?.no_ktp ?? '',
        npwp: employee?.npwp ?? '',
        no_bpjs_ketenagakerjaan: employee?.no_bpjs_ketenagakerjaan ?? '',
        no_bpjs_kesehatan: employee?.no_bpjs_kesehatan ?? '',
        department_id: employee?.department_id?.toString() ?? '',
        position_id: employee?.position_id?.toString() ?? '',
        work_location_id: employee?.work_location_id?.toString() ?? '',
        working_location_id: employee?.working_location_id?.toString() ?? '',
        shift_id: employee?.shift_id?.toString() ?? '',
        report_to: employee?.report_to?.toString() ?? '',
        status_kepegawaian: employee?.status_kepegawaian ?? 'tetap',
        hire_date: employee?.hire_date?.substring(0, 10) ?? '',
        end_date: employee?.end_date?.substring(0, 10) ?? '',
        nama_bank: employee?.nama_bank ?? '',
        cabang_bank: employee?.cabang_bank ?? '',
        no_rekening: employee?.no_rekening ?? '',
        nama_rekening: employee?.nama_rekening ?? '',
        nama_kontak_darurat_1: employee?.nama_kontak_darurat_1 ?? '',
        no_kontak_darurat_1: employee?.no_kontak_darurat_1 ?? '',
        nama_kontak_darurat_2: employee?.nama_kontak_darurat_2 ?? '',
        no_kontak_darurat_2: employee?.no_kontak_darurat_2 ?? '',
        gaji_pokok: employee?.gaji_pokok ?? 0,
        tunjangan_jabatan: employee?.tunjangan_jabatan ?? 0,
        tunjangan_kehadiran: employee?.tunjangan_kehadiran ?? 0,
        tunjangan_transportasi: employee?.tunjangan_transportasi ?? 0,
        uang_makan: employee?.uang_makan ?? 0,
        uang_lembur: employee?.uang_lembur ?? 0,
        thr: employee?.thr ?? 0,
        gaji_bpjs_tk: employee?.gaji_bpjs_tk ?? 0,
        gaji_bpjs_jkn: employee?.gaji_bpjs_jkn ?? 0,
        gross_up: employee?.gross_up ?? false,
        pinjaman_koperasi: employee?.pinjaman_koperasi ?? 0,
        potongan_lain_1: employee?.potongan_lain_1 ?? 0,
        potongan_lain_2: employee?.potongan_lain_2 ?? 0,
        dashboard_config: employee?.dashboard_config ?? {
            attendance_widget: true,
            quick_actions: true,
            personal_stats: true,
            approval_stats: false,
            admin_stats: false,
        },
        permissions: userPermissions ?? [],
    });

    const filteredPositions = data.department_id
        ? positions.filter(p => p.department_id === parseInt(data.department_id))
        : positions;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isEditing) {
            transform((data) => ({
                ...data,
                _method: 'put',
            }));
            post(`/employees/${employee.id}`);
        } else {
            post('/employees');
        }
    }

    // Use inline inputs directly instead of a sub-component to avoid focus loss
    function renderInput(label: string, name: string, type = 'text', placeholder = '', required = false) {
        return (
            <div key={name}>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                    type={type}
                    value={data[name] ?? ''}
                    onChange={e => setData(name, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                    className={inputClass}
                    placeholder={placeholder}
                    required={required}
                />
                {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
            </div>
        );
    }

    function renderFileInput(label: string, name: string, multiple = false) {
        return (
            <div key={name}>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {label}
                </label>
                <input
                    type="file"
                    multiple={multiple}
                    onChange={e => setData(name, multiple ? Array.from(e.target.files || []) : (e.target.files?.[0] || null))}
                    className="mt-1 block w-full text-sm text-neutral-500 file:mr-4 file:rounded-md file:border-neutral-300 file:bg-neutral-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-neutral-700 hover:file:bg-neutral-200 dark:text-neutral-400 dark:file:bg-neutral-800 dark:file:text-neutral-300 dark:hover:file:bg-neutral-700"
                />
                {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
                
                
                {isEditing && (employee as any)?.[name] && !multiple && (
                    <div className="mt-2 flex items-center justify-between rounded-md bg-blue-50 px-3 py-2 dark:bg-blue-900/20">
                        <p className="text-xs text-blue-600 dark:text-blue-400">File sudah ada. Upload baru untuk menggantikan.</p>
                        <a href={`/storage/${(employee as any)[name]}`} target="_blank" rel="noreferrer" 
                           className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:text-blue-800 hover:underline dark:text-blue-300 dark:hover:text-blue-200">
                            <ExternalLink className="h-3.5 w-3.5" /> Lihat File
                        </a>
                    </div>
                )}
            </div>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? 'Edit Karyawan' : 'Tambah Karyawan'} />
            <div className="mx-auto max-w-5xl p-6">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {isEditing ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}
                </h1>
                <form onSubmit={handleSubmit} className="mt-6 space-y-8">

                    {/* Data Pribadi */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <SectionTitle>👤 Data Pribadi</SectionTitle>
                        {renderInput("Nama Lengkap", "nama", "text", "Nama lengkap karyawan", true)}
                        {renderInput("Email", "email", "email", "email@company.com", true)}
                        {renderInput(isEditing ? "Password Baru (Opsional)" : "Password", "password", "password", "Minimal 8 karakter", !isEditing)}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Gender</label>
                            <select value={data.gender} onChange={e => setData('gender', e.target.value)} className={inputClass}>
                                <option value="">Pilih Gender</option>
                                <option value="laki-laki">Laki-laki</option>
                                <option value="perempuan">Perempuan</option>
                            </select>
                        </div>
                        {renderInput("Tempat Lahir", "tempat_lahir", "text", "Kota kelahiran")}
                        {renderInput("Tanggal Lahir", "tanggal_lahir", "date")}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Agama</label>
                            <select value={data.agama} onChange={e => setData('agama', e.target.value)} className={inputClass}>
                                <option value="">Pilih Agama</option>
                                {['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'].map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Pendidikan Terakhir</label>
                            <select value={data.pendidikan_terakhir} onChange={e => setData('pendidikan_terakhir', e.target.value)} className={inputClass}>
                                <option value="">Pilih Pendidikan</option>
                                {['SD', 'SMP', 'SMA/SMK', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3'].map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Status Pernikahan (PTKP)</label>
                            <select value={data.status_pernikahan} onChange={e => setData('status_pernikahan', e.target.value)} className={inputClass}>
                                <option value="">Pilih Status</option>
                                {['TK/0', 'TK/1', 'TK/2', 'TK/3', 'K/0', 'K/1', 'K/2', 'K/3', 'K/I/0', 'K/I/1', 'K/I/2', 'K/I/3'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        {renderInput("No. Telpon 1", "no_telpon_1", "text", "081234567890")}
                        {renderInput("No. Telpon 2", "no_telpon_2", "text", "Optional")}
                        <div className="sm:col-span-2 lg:col-span-3">
                            {renderInput("Alamat Tetap", "alamat_tetap", "text", "Alamat sesuai KTP")}
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3">
                            {renderInput("Alamat Sekarang", "alamat_sekarang", "text", "Alamat domisili saat ini")}
                        </div>
                    </div>

                    {/* Identity */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <SectionTitle>🆔 Identitas & Pajak</SectionTitle>
                        {renderInput("No. KTP (NIK)", "no_ktp", "text", "16 digit NIK")}
                        {renderInput("NPWP", "npwp", "text", "Nomor NPWP")}
                        {renderInput("No. BPJS Ketenagakerjaan", "no_bpjs_ketenagakerjaan")}
                        {renderInput("No. BPJS Kesehatan", "no_bpjs_kesehatan")}
                    </div>

                    {/* Employment */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <SectionTitle>🏢 Data Kepegawaian</SectionTitle>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Departemen <span className="text-red-500">*</span></label>
                            <select value={data.department_id} onChange={e => { setData('department_id', e.target.value); setData('position_id', ''); }}
                                className={inputClass} required>
                                <option value="">Pilih Departemen</option>
                                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                            {errors.department_id && <p className="mt-1 text-xs text-red-500">{errors.department_id}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Lapor Ke (Report To)</label>
                            <select value={data.report_to} onChange={e => setData('report_to', e.target.value)}
                                className={inputClass}>
                                <option value="">-- Tanpa Atasan --</option>
                                {allEmployees.map(emp => <option key={emp.id} value={emp.id}>{emp.nik} - {emp.nama}</option>)}
                            </select>
                            {errors.report_to && <p className="mt-1 text-xs text-red-500">{errors.report_to}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Jabatan <span className="text-red-500">*</span></label>
                            <select value={data.position_id} onChange={e => setData('position_id', e.target.value)}
                                className={inputClass} required>
                                <option value="">Pilih Jabatan</option>
                                {filteredPositions.map(p => <option key={p.id} value={p.id}>{p.name} ({p.grade})</option>)}
                            </select>
                            {errors.position_id && <p className="mt-1 text-xs text-red-500">{errors.position_id}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Perusahaan <span className="text-red-500">*</span></label>
                            <select value={data.work_location_id} onChange={e => setData('work_location_id', e.target.value)} className={inputClass} required>
                                <option value="">Pilih Perusahaan</option>
                                {workLocations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Shift Kerja</label>
                            <select value={data.shift_id} onChange={e => setData('shift_id', e.target.value)} className={inputClass}>
                                <option value="">Pilih Shift Kerja (Opsional)</option>
                                {shifts.map(s => <option key={s.id} value={s.id}>{s.name} ({s.jam_masuk?.substring(0,5)} - {s.jam_pulang?.substring(0,5)})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Status Kepegawaian <span className="text-red-500">*</span></label>
                            <select value={data.status_kepegawaian} onChange={e => setData('status_kepegawaian', e.target.value)}
                                className={inputClass} required>
                                <option value="tetap">Tetap</option>
                                <option value="kontrak">Kontrak</option>
                                <option value="probation">Probation</option>
                                <option value="magang">Magang</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Lokasi Kerja (Penempatan)</label>
                            <select value={data.working_location_id} onChange={e => setData('working_location_id', e.target.value)} className={inputClass}>
                                <option value="">Pilih Lokasi Kerja (Penempatan)</option>
                                {workingLocations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                            {errors.working_location_id && <p className="mt-1 text-xs text-red-500">{errors.working_location_id}</p>}
                        </div>
                        {renderInput("Tanggal Masuk", "hire_date", "date", "", true)}
                        {renderInput("Tanggal Berakhir", "end_date", "date")}
                    </div>

                    {/* Banking */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <SectionTitle>🏦 Data Bank</SectionTitle>
                        {renderInput("Nama Bank", "nama_bank", "text", "Contoh: BCA, Mandiri")}
                        {renderInput("Cabang Bank", "cabang_bank", "text", "Cabang bank")}
                        {renderInput("No. Rekening", "no_rekening", "text", "Nomor rekening")}
                        {renderInput("Nama Rekening", "nama_rekening", "text", "Nama pemilik rekening")}
                    </div>

                    {/* Emergency */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <SectionTitle>🚨 Kontak Darurat</SectionTitle>
                        {renderInput("Nama Kontak Darurat 1", "nama_kontak_darurat_1")}
                        {renderInput("No. Kontak Darurat 1", "no_kontak_darurat_1")}
                        <div className="hidden lg:block" />
                        {renderInput("Nama Kontak Darurat 2", "nama_kontak_darurat_2")}
                        {renderInput("No. Kontak Darurat 2", "no_kontak_darurat_2")}
                    </div>

                    {/* Salary */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <SectionTitle>💰 Gaji & Tunjangan</SectionTitle>
                        {renderInput("Gaji Pokok", "gaji_pokok", "number")}
                        {renderInput("Tunjangan Jabatan", "tunjangan_jabatan", "number")}
                        {renderInput("Tunjangan Kehadiran", "tunjangan_kehadiran", "number")}
                        {renderInput("Tunjangan Transportasi", "tunjangan_transportasi", "number")}
                        {renderInput("Uang Makan", "uang_makan", "number")}
                        {renderInput("Uang Lembur", "uang_lembur", "number")}
                        {renderInput("THR", "thr", "number")}
                        {renderInput("Gaji BPJS TK", "gaji_bpjs_tk", "number")}
                        {renderInput("Gaji BPJS JKN", "gaji_bpjs_jkn", "number")}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Gross Up (PPh21 ditanggung perusahaan?)</label>
                            <select value={data.gross_up ? '1' : '0'} onChange={e => setData('gross_up', e.target.value === '1')} className={inputClass}>
                                <option value="0">Tidak — PPh21 dipotong dari karyawan</option>
                                <option value="1">Ya — PPh21 ditanggung perusahaan</option>
                            </select>
                            {errors.gross_up && <p className="mt-1 text-xs text-red-500">{errors.gross_up}</p>}
                        </div>
                    </div>

                    {/* Deductions */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <SectionTitle>➖ Potongan</SectionTitle>
                        {renderInput("Pinjaman Koperasi", "pinjaman_koperasi", "number")}
                        {renderInput("Potongan Lain-lain 1", "potongan_lain_1", "number")}
                        {renderInput("Potongan Lain-lain 2", "potongan_lain_2", "number")}
                    </div>

                    {/* Dokumen & Lampiran */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <SectionTitle>📄 Dokumen & Lampiran</SectionTitle>
                        {renderFileInput("Pas Foto", "photo")}

                        {isEditing && (
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Tanda Tangan Digital</label>
                                <SignaturePad 
                                    onSave={(base64) => router.post(`/employees/${employee.id}/signature`, { signature: base64 }, { preserveScroll: true })} 
                                    currentSignature={employee.signature} 
                                />
                                <p className="mt-2 text-xs text-neutral-500">Tanda tangan ini akan digunakan pada dokumen resmi dan pengajuan pembayaran (PR).</p>
                            </div>
                        )}

                        {renderFileInput("File KTP", "file_ktp")}
                        {renderFileInput("File NPWP", "file_npwp")}
                        {renderFileInput("File Kartu Keluarga", "file_kk")}
                        {renderFileInput("File Ijazah Terakhir", "file_ijazah")}
                        
                        <div key="file_lainnya">
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">File Lainnya (Kontrak, dll)</label>
                            <input type="file" multiple onChange={e => setData("file_lainnya", Array.from(e.target.files || []))}
                                className="mt-1 block w-full text-sm text-neutral-500 file:mr-4 file:rounded-md file:border-neutral-300 file:bg-neutral-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-neutral-700 hover:file:bg-neutral-200 dark:text-neutral-400 dark:file:bg-neutral-800 dark:file:text-neutral-300 dark:hover:file:bg-neutral-700" />
                            {errors.file_lainnya && <p className="mt-1 text-xs text-red-500">{errors.file_lainnya}</p>}
                            
                            {isEditing && employee?.file_lainnya && employee.file_lainnya.length > 0 && (
                                <div className="mt-2 rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
                                    <p className="mb-2 text-xs text-blue-600 dark:text-blue-400">File tambahan saat ini. Upload baru akan mereplace semuanya.</p>
                                    <ul className="space-y-2">
                                        {employee.file_lainnya.map((path, idx) => (
                                            <li key={idx}>
                                                <a href={`/storage/${path}`} target="_blank" rel="noreferrer" 
                                                   className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:text-blue-800 hover:underline dark:text-blue-300 dark:hover:text-blue-200">
                                                    <ExternalLink className="h-3.5 w-3.5" /> Dokumen Tambahan {idx + 1}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Privileges & Dashboard Config */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <SectionTitle>🔐 Hak Akses & Konfigurasi</SectionTitle>
                        <div className="col-span-full space-y-4">
                            {/* Dashboard Configuration Module */}
                            <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
                                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-bold">Konfigurasi Dashboard</h3>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {[
                                        { key: 'attendance_widget', label: 'Presensi Hari Ini' },
                                        { key: 'quick_actions', label: 'Akses Cepat' },
                                        { key: 'personal_stats', label: 'Status Saya' },
                                        { key: 'approval_stats', label: 'Ringkasan Tim' },
                                        { key: 'admin_stats', label: 'Ringkasan Perusahaan' },
                                    ].map((item) => (
                                        <label key={item.key} className="flex items-center gap-3 space-x-2 rounded-md border border-transparent p-2 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={!!(data.dashboard_config && data.dashboard_config[item.key])}
                                                onChange={e => {
                                                    const newConfig = { ...(data.dashboard_config || {}) };
                                                    newConfig[item.key] = e.target.checked;
                                                    setData('dashboard_config', newConfig);
                                                }}
                                                className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900"
                                            />
                                            <span className="text-sm text-neutral-700 dark:text-neutral-300">{item.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Permissions Modules */}
                            {Object.entries(
                                permissions.reduce((acc, curr) => {
                                    if (!acc[curr.module]) acc[curr.module] = [];
                                    acc[curr.module].push(curr);
                                    return acc;
                                }, {} as Record<string, typeof permissions>)
                            ).map(([module, perms]) => (
                                <div key={module} className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
                                    <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">{module}</h3>
                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {perms.map(p => (
                                            <label key={p.id} className="flex items-center gap-3 space-x-2 rounded-md border border-transparent p-2 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={data.permissions.includes(p.id)}
                                                    onChange={e => {
                                                        const checked = e.target.checked;
                                                        const newPerms = checked 
                                                            ? [...data.permissions, p.id]
                                                            : data.permissions.filter((id: number) => id !== p.id);
                                                        setData('permissions', newPerms);
                                                    }}
                                                    className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900"
                                                />
                                                <span className="text-sm text-neutral-700 dark:text-neutral-300">{p.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-700">
                        <button type="submit" disabled={processing}
                            className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50">
                            {processing ? 'Menyimpan...' : 'Simpan Data Karyawan'}
                        </button>
                        <Link href="/employees" className="rounded-lg border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
