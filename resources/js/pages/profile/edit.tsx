import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import SignaturePad from '@/components/signature-pad';
import FaceEnrollment from '@/components/attendance/face-enrollment';
import type { BreadcrumbItem, Employee } from '@/types';

interface Props {
    employee: Employee;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="col-span-full border-b border-neutral-200 pb-2 text-lg font-semibold text-neutral-900 dark:border-neutral-700 dark:text-white">{children}</h2>;
}

const inputClass = "mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white";

export default function ProfileEdit() {
    const { employee } = usePage<{ props: Props }>().props as unknown as Props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Profil Saya', href: '#' },
    ];

    const { data, setData, post, transform, processing, errors } = useForm<Record<string, any>>({
        nama: employee.nama ?? '',
        tempat_lahir: employee.tempat_lahir ?? '',
        tanggal_lahir: employee.tanggal_lahir?.substring(0, 10) ?? '',
        alamat_tetap: employee.alamat_tetap ?? '',
        alamat_sekarang: employee.alamat_sekarang ?? '',
        email: employee.email ?? '',
        password: '',
        password_confirmation: '',
        gender: employee.gender ?? '',
        status_pernikahan: employee.status_pernikahan ?? '',
        pendidikan_terakhir: employee.pendidikan_terakhir ?? '',
        agama: employee.agama ?? '',
        no_telpon_1: employee.no_telpon_1 ?? '',
        no_telpon_2: employee.no_telpon_2 ?? '',
        no_ktp: employee.no_ktp ?? '',
        npwp: employee.npwp ?? '',
        no_bpjs_ketenagakerjaan: employee.no_bpjs_ketenagakerjaan ?? '',
        no_bpjs_kesehatan: employee.no_bpjs_kesehatan ?? '',
        nama_bank: employee.nama_bank ?? '',
        cabang_bank: employee.cabang_bank ?? '',
        no_rekening: employee.no_rekening ?? '',
        nama_rekening: employee.nama_rekening ?? '',
        nama_kontak_darurat_1: employee.nama_kontak_darurat_1 ?? '',
        no_kontak_darurat_1: employee.no_kontak_darurat_1 ?? '',
        nama_kontak_darurat_2: employee.nama_kontak_darurat_2 ?? '',
        no_kontak_darurat_2: employee.no_kontak_darurat_2 ?? '',
        signature: null as string | null,
    });

    const banks = [
        'Bank Mandiri', 'BCA', 'BRI', 'BNI', 'BSI', 'CIMB Niaga', 
        'Danamon', 'Permata', 'OCBC NISP', 'Maybank', 'Panin', 
        'BTN', 'Bank DKI', 'Bank Jatim', 'Bank Jabar Banten', 'Mega', 'Lainnya'
    ];

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        transform((data) => ({
            ...data,
            _method: 'put',
        }));
        post('/profile');
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
                    onChange={e => setData(name, e.target.value)}
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
                
                {employee && (employee as any)[name] && !multiple && (
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
            <Head title="Profil Saya" />
            <div className="mx-auto max-w-5xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Profil Saya</h1>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Kelola informasi pribadi dan dokumen Anda.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">{employee.nik}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{(employee as any).position?.name} - {(employee as any).department?.name}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-12">
                    {/* Data Pribadi */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <SectionTitle>👤 Data Pribadi</SectionTitle>
                        {renderInput("Nama Lengkap", "nama", "text", "", true)}
                        {renderInput("Email", "email", "email", "", true)}
                        
                        <div className="lg:col-span-3 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {renderInput("Password Baru (Kosongkan jika tidak ingin diubah)", "password", "password")}
                            {renderInput("Konfirmasi Password Baru", "password_confirmation", "password")}
                        </div>

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
                        {renderInput("No. Telpon 1", "no_telpon_1")}
                        {renderInput("No. Telpon 2", "no_telpon_2")}
                        
                        <div className="sm:col-span-2 lg:col-span-3">
                            {renderInput("Alamat Tetap", "alamat_tetap")}
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3">
                            {renderInput("Alamat Sekarang", "alamat_sekarang")}
                        </div>
                    </div>

                    {/* Identity */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <SectionTitle>🆔 Identitas & Pajak</SectionTitle>
                        {renderInput("No. KTP (NIK)", "no_ktp")}
                        {renderInput("NPWP", "npwp")}
                        {renderInput("No. BPJS Ketenagakerjaan", "no_bpjs_ketenagakerjaan")}
                        {renderInput("No. BPJS Kesehatan", "no_bpjs_kesehatan")}
                    </div>

                    {/* Banking */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <SectionTitle>🏦 Data Bank</SectionTitle>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Nama Bank</label>
                            <select value={data.nama_bank} onChange={e => setData('nama_bank', e.target.value)} className={inputClass}>
                                <option value="">Pilih Bank</option>
                                {banks.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                            {errors.nama_bank && <p className="mt-1 text-xs text-red-500">{errors.nama_bank}</p>}
                        </div>
                        {renderInput("Cabang Bank", "cabang_bank")}
                        {renderInput("No. Rekening", "no_rekening")}
                        {renderInput("Nama Rekening", "nama_rekening")}
                    </div>

                    {/* Emergency */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <SectionTitle>🚨 Kontak Darurat</SectionTitle>
                        {renderInput("Nama Kontak 1", "nama_kontak_darurat_1")}
                        {renderInput("No. Telpon 1", "no_kontak_darurat_1")}
                        <div className="hidden lg:block"></div>
                        {renderInput("Nama Kontak 2", "nama_kontak_darurat_2")}
                        {renderInput("No. Telpon 2", "no_kontak_darurat_2")}
                    </div>

                    {/* Face Enrollment */}
                    <div className="grid gap-6">
                        <SectionTitle>🤳 Pendaftaran Wajah</SectionTitle>
                        <FaceEnrollment 
                            employeeId={employee.id} 
                            hasDescriptor={!!employee.face_descriptor} 
                        />
                    </div>

                    {/* Dokumen */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <SectionTitle>📄 Dokumen & Lampiran</SectionTitle>
                        {renderFileInput("Pas Foto", "photo")}
                        
                         <div className="lg:col-span-2">
                              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Tanda Tangan Digital</label>
                              <SignaturePad 
                                 onSave={(base64) => {
                                     setData('signature', base64);
                                 }} 
                                 currentSignature={data.signature || employee.signature} 
                               />
                               <div className="mt-2 flex items-center justify-between">
                                  <p className="text-xs text-neutral-500 italic">Tanda tangan akan tersimpan saat Anda menekan tombol "Simpan Perubahan" di bawah.</p>
                                  {data.signature && data.signature.startsWith('data:image') && (
                                      <button 
                                          type="button" 
                                          onClick={() => router.post('/profile/signature', { signature: data.signature }, { preserveScroll: true })}
                                          className="text-xs font-bold text-blue-600 hover:underline"
                                      >
                                          Simpan Tanda Tangan Saja
                                      </button>
                                  )}
                               </div>
                         </div>

                        {renderFileInput("File KTP", "file_ktp")}
                        {renderFileInput("File NPWP", "file_npwp")}
                        {renderFileInput("File Kartu Keluarga", "file_kk")}
                        {renderFileInput("File Ijazah Terakhir", "file_ijazah")}
                        
                        <div key="file_lainnya">
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">File Lainnya</label>
                            <input type="file" multiple onChange={e => setData("file_lainnya", Array.from(e.target.files || []))}
                                className="mt-1 block w-full text-sm text-neutral-500 file:mr-4 file:rounded-md file:border-neutral-300 file:bg-neutral-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-neutral-700 hover:file:bg-neutral-200 dark:text-neutral-400 dark:file:bg-neutral-800 dark:file:text-neutral-300 dark:hover:file:bg-neutral-700" />
                            
                            {employee.file_lainnya && (employee.file_lainnya as string[]).length > 0 && (
                                <div className="mt-2 rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
                                    <ul className="space-y-2">
                                        {(employee.file_lainnya as string[]).map((path, idx) => (
                                            <li key={idx}>
                                                <a href={`/storage/${path}`} target="_blank" rel="noreferrer" 
                                                   className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:text-blue-800 hover:underline dark:text-blue-300 dark:hover:text-blue-200">
                                                    <ExternalLink className="h-3.5 w-3.5" /> Dokumen {idx + 1}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-700">
                        <button type="submit" disabled={processing}
                            className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50">
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
