import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, DailyWorker } from '@/types';

interface Props {
    dailyWorker?: DailyWorker;
    departments: { id: number; name: string }[];
    positions: { id: number; name: string; department_id: number; grade: string }[];
    workingLocations: { id: number; name: string }[];
    workLocations: { id: number; name: string }[];
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="col-span-full border-b border-neutral-200 pb-2 text-lg font-semibold text-neutral-900 dark:border-neutral-700 dark:text-white">{children}</h2>;
}

const inputClass = "mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white";

export default function DailyWorkerForm() {
    const { dailyWorker, departments, positions, workingLocations, workLocations } = usePage<{ props: Props }>().props as unknown as Props;
    const isEditing = !!dailyWorker;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Daily Worker', href: '/daily-workers' },
        { title: isEditing ? 'Edit' : 'Tambah', href: '#' },
    ];

    const { data, setData, post, transform, processing, errors } = useForm<Record<string, any>>({
        nama: dailyWorker?.nama ?? '',
        nik: dailyWorker?.nik ?? '',
        email: dailyWorker?.email ?? '',
        gender: dailyWorker?.gender ?? '',
        status_pernikahan: dailyWorker?.status_pernikahan ?? '',
        pendidikan_terakhir: dailyWorker?.pendidikan_terakhir ?? '',
        agama: dailyWorker?.agama ?? '',
        tempat_lahir: dailyWorker?.tempat_lahir ?? '',
        tanggal_lahir: dailyWorker?.tanggal_lahir?.substring(0, 10) ?? '',
        alamat_tetap: dailyWorker?.alamat_tetap ?? '',
        alamat_sekarang: dailyWorker?.alamat_sekarang ?? '',
        no_telpon_1: dailyWorker?.no_telpon_1 ?? '',
        no_telpon_2: dailyWorker?.no_telpon_2 ?? '',
        
        department_id: dailyWorker?.department_id ?? '',
        position_id: dailyWorker?.position_id ?? '',
        working_location_id: dailyWorker?.working_location_id ?? '',
        work_location_id: dailyWorker?.work_location_id ?? '',
        tipe_dw: dailyWorker?.tipe_dw ?? 'lokal',
        status_kepegawaian: dailyWorker?.status_kepegawaian ?? 'harian',
        hire_date: dailyWorker?.hire_date?.substring(0, 10) ?? '',
        end_date: dailyWorker?.end_date?.substring(0, 10) ?? '',
        is_active: dailyWorker?.is_active ?? true,

        no_ktp: dailyWorker?.no_ktp ?? '',
        npwp: dailyWorker?.npwp ?? '',
        no_bpjs_ketenagakerjaan: dailyWorker?.no_bpjs_ketenagakerjaan ?? '',
        no_bpjs_kesehatan: dailyWorker?.no_bpjs_kesehatan ?? '',

        nama_bank: dailyWorker?.nama_bank ?? '',
        cabang_bank: dailyWorker?.cabang_bank ?? '',
        no_rekening: dailyWorker?.no_rekening ?? '',
        nama_rekening: dailyWorker?.nama_rekening ?? '',

        nama_kontak_darurat_1: dailyWorker?.nama_kontak_darurat_1 ?? '',
        no_kontak_darurat_1: dailyWorker?.no_kontak_darurat_1 ?? '',
        nama_kontak_darurat_2: dailyWorker?.nama_kontak_darurat_2 ?? '',
        no_kontak_darurat_2: dailyWorker?.no_kontak_darurat_2 ?? '',

        gaji_harian: dailyWorker?.gaji_harian ?? 0,
        gaji_per_jam: dailyWorker?.gaji_per_jam ?? 0,
        uang_makan: dailyWorker?.uang_makan ?? 0,
        uang_lembur: dailyWorker?.uang_lembur ?? 0,
        gaji_bpjs_tk: dailyWorker?.gaji_bpjs_tk ?? 0,
        gaji_bpjs_jkn: dailyWorker?.gaji_bpjs_jkn ?? 0,
        thr: dailyWorker?.thr ?? 0,
        pinjaman_koperasi: dailyWorker?.pinjaman_koperasi ?? 0,
        potongan_lain_1: dailyWorker?.potongan_lain_1 ?? 0,
        potongan_lain_2: dailyWorker?.potongan_lain_2 ?? 0,
        gross_up: dailyWorker?.gross_up ?? false,
    });

    const filteredPositions = data.department_id
        ? positions.filter(p => p.department_id === parseInt(data.department_id))
        : positions;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isEditing) {
            transform((data) => ({ ...data, _method: 'put' }));
            post(`/daily-workers/${dailyWorker.id}`);
        } else {
            post('/daily-workers');
        }
    }

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
                
                {isEditing && (dailyWorker as any)?.[name] && !multiple && (
                    <div className="mt-2 flex items-center justify-between rounded-md bg-blue-50 px-3 py-2 dark:bg-blue-900/20">
                        <p className="text-xs text-blue-600 dark:text-blue-400">File sudah ada.</p>
                        <a href={`/storage/${(dailyWorker as any)[name]}`} target="_blank" rel="noreferrer" 
                           className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:text-blue-800 hover:underline dark:text-blue-300 dark:hover:text-blue-200">
                            <ExternalLink className="h-3.5 w-3.5" /> Lihat
                        </a>
                    </div>
                )}
            </div>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? 'Edit Daily Worker' : 'Tambah Daily Worker'} />
            <div className="mx-auto max-w-5xl p-6">
                <div className="mb-6 flex items-center gap-4">
                    <Link href="/daily-workers" className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                        {isEditing ? 'Edit Data Daily Worker' : 'Tambah Daily Worker Baru'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Data Pribadi */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <SectionTitle>👤 Data Pribadi</SectionTitle>
                        {renderInput("Nama Lengkap", "nama", "text", "Nama lengkap", true)}
                        {renderInput("Email", "email", "email", "email@company.com", true)}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Gender</label>
                            <select value={data.gender} onChange={e => setData('gender', e.target.value)} className={inputClass}>
                                <option value="">Pilih Gender</option>
                                <option value="laki-laki">Laki-laki</option>
                                <option value="perempuan">Perempuan</option>
                            </select>
                        </div>
                        {renderInput("Tempat Lahir", "tempat_lahir")}
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
                                {['SD', 'SMP', 'SMA/SMK', 'D1', 'S1', 'S2'].map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Status Pernikahan</label>
                            <select value={data.status_pernikahan} onChange={e => setData('status_pernikahan', e.target.value)} className={inputClass}>
                                <option value="">Pilih Status</option>
                                {['TK/0', 'K/0', 'K/1', 'K/2', 'K/3'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        {renderInput("No. Telpon 1", "no_telpon_1")}
                        {renderInput("No. Telpon 2", "no_telpon_2")}
                        <div className="sm:col-span-2 lg:col-span-3">
                            {renderInput("Alamat Sesuai KTP", "alamat_tetap")}
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3">
                            {renderInput("Alamat Sekarang", "alamat_sekarang")}
                        </div>
                    </div>

                    {/* Identity */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <SectionTitle>🆔 Identitas & Pajak</SectionTitle>
                        {renderInput("No. KTP", "no_ktp", "text", "16 digit")}
                        {renderInput("NPWP", "npwp")}
                        {renderInput("No. BPJS TK", "no_bpjs_ketenagakerjaan")}
                        {renderInput("No. BPJS KS", "no_bpjs_kesehatan")}
                    </div>

                    {/* Employment */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <SectionTitle>🏢 Data Kepegawaian</SectionTitle>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Tipe Daily Worker <span className="text-red-500">*</span></label>
                            <select value={data.tipe_dw} onChange={e => setData('tipe_dw', e.target.value)} className={inputClass}>
                                <option value="lokal">Lokal</option>
                                <option value="non lokal">Non-Lokal</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Working Location <span className="text-red-500">*</span></label>
                            <select value={data.working_location_id} onChange={e => setData('working_location_id', e.target.value)} className={inputClass} required>
                                <option value="">Pilih Lokasi Kerja</option>
                                {workingLocations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Perusahaan (Entitas)</label>
                            <select value={data.work_location_id} onChange={e => setData('work_location_id', e.target.value)} className={inputClass}>
                                <option value="">Pilih Perusahaan</option>
                                {workLocations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Departemen</label>
                            <select value={data.department_id} onChange={e => setData('department_id', e.target.value)} className={inputClass}>
                                <option value="">Pilih Departemen</option>
                                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Jabatan</label>
                            <select value={data.position_id} onChange={e => setData('position_id', e.target.value)} className={inputClass}>
                                <option value="">Pilih Jabatan</option>
                                {filteredPositions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        {renderInput("Tanggal Masuk", "hire_date", "date", "", true)}
                        {renderInput("Tanggal Berakhir", "end_date", "date")}
                    </div>

                    {/* Financial */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <SectionTitle>💰 Pay Structure (Finansial)</SectionTitle>
                        {renderInput("Gaji Harian", "gaji_harian", "number", "", true)}
                        {renderInput("Gaji Per Jam", "gaji_per_jam", "number")}
                        {renderInput("Uang Makan", "uang_makan", "number")}
                        {renderInput("Uang Lembur", "uang_lembur", "number")}
                        {renderInput("Gaji Dasar BPJS TK", "gaji_bpjs_tk", "number")}
                        {renderInput("Gaji Dasar BPJS KS", "gaji_bpjs_jkn", "number")}
                        {renderInput("THR", "thr", "number")}
                        {renderInput("Pinjaman", "pinjaman_koperasi", "number")}
                        {renderInput("Potongan 1", "potongan_lain_1", "number")}
                        {renderInput("Potongan 2", "potongan_lain_2", "number")}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Gross Up</label>
                            <select value={data.gross_up ? '1' : '0'} onChange={e => setData('gross_up', e.target.value === '1')} className={inputClass}>
                                <option value="0">Tidak</option>
                                <option value="1">Ya</option>
                            </select>
                        </div>
                    </div>

                    {/* Banking */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <SectionTitle>🏦 Data Bank</SectionTitle>
                        {renderInput("Nama Bank", "nama_bank")}
                        {renderInput("Cabang", "cabang_bank")}
                        {renderInput("No. Rekening", "no_rekening")}
                        {renderInput("Nama Pemilik Rekening", "nama_rekening")}
                    </div>

                    {/* Documents */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <SectionTitle>📄 Dokumen & Lampiran</SectionTitle>
                        {renderFileInput("Pas Foto", "photo")}
                        {renderFileInput("File KTP", "file_ktp")}
                        {renderFileInput("File NPWP", "file_npwp")}
                        {renderFileInput("File KK", "file_kk")}
                        {renderFileInput("File Ijazah", "file_ijazah")}
                        {renderFileInput("File Lainnya", "file_lainnya", true)}
                    </div>


                    {/* Submit */}
                    <div className="flex gap-4 border-t border-neutral-200 pt-6 dark:border-neutral-700">
                        <button type="submit" disabled={processing}
                            className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50">
                            {processing ? 'Menyimpan...' : 'Simpan Data Daily Worker'}
                        </button>
                        <Link href="/daily-workers" className="rounded-lg border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
