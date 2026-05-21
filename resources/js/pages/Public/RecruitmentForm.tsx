import { Head, useForm } from '@inertiajs/react';
import { ClipboardList, Plus, X, Check } from 'lucide-react';
import { useState } from 'react';

interface Props {
    application: { id: number; uuid: string; name: string };
    opening: { company: string; position: string };
}

type TableRow = Record<string, string>;

export default function RecruitmentForm({ application, opening }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        full_name: application.name || '',
        sex: '',
        current_address: '',
        citizenship: 'Indonesia',
        marital_status: '',
        religion: '',
        weight: '',
        height: '',
        hobby: '',
        education: [{ level: '', school: '', major: '', year: '', gpa: '' }] as TableRow[],
        training: [{ name: '', organizer: '', year: '', duration: '' }] as TableRow[],
        organization: [{ name: '', position: '', year: '' }] as TableRow[],
        skills: '',
        work_experience: [{ company: '', from: '', to: '', last_salary: '', reason_quit: '' }] as TableRow[],
        why_interested: '',
        salary_expectation: '',
        has_relative: false,
        relative_name: '',
        references: [{ name: '', relation: '', phone: '', address: '' }] as TableRow[],
        has_serious_illness: false,
        illness_detail: '',
        certify_true: false,
    });

    const addRow = (field: 'education' | 'training' | 'organization' | 'work_experience' | 'references') => {
        const templates: Record<string, TableRow> = {
            education: { level: '', school: '', major: '', year: '', gpa: '' },
            training: { name: '', organizer: '', year: '', duration: '' },
            organization: { name: '', position: '', year: '' },
            work_experience: { company: '', from: '', to: '', last_salary: '', reason_quit: '' },
            references: { name: '', relation: '', phone: '', address: '' },
        };
        setData(field, [...data[field], { ...templates[field] }]);
    };

    const removeRow = (field: 'education' | 'training' | 'organization' | 'work_experience' | 'references', i: number) => {
        if (data[field].length <= 1) return;
        setData(field, data[field].filter((_, idx) => idx !== i));
    };

    const updateRow = (field: 'education' | 'training' | 'organization' | 'work_experience' | 'references', i: number, key: string, val: string) => {
        const updated = [...data[field]];
        updated[i] = { ...updated[i], [key]: val };
        setData(field, updated);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/career/form/${application.uuid}`);
    };

    const inputCls = "w-full h-10 px-3 rounded-lg border border-neutral-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm text-neutral-900 bg-white";
    const labelCls = "block text-sm font-medium text-neutral-700 mb-1";

    return (
        <>
            <Head title={`Formulir Rekrutmen - ${opening.company}`} />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
                <div className="bg-white border-b border-neutral-200 shadow-sm">
                    <div className="max-w-3xl mx-auto px-4 py-6 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 mb-3">
                            <ClipboardList className="w-6 h-6" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black text-neutral-900 mb-1">Formulir Data Diri</h1>
                        <p className="text-sm text-neutral-500">{opening.company} — {opening.position}</p>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 py-6">
                    <form onSubmit={submit} className="space-y-5">
                        {/* Basic Personal Info */}
                        <section className="rounded-2xl bg-white border border-neutral-200 p-5 shadow-sm">
                            <h2 className="text-base font-bold text-neutral-900 mb-4">Informasi Pribadi</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className={labelCls}>Nama Lengkap *</label>
                                    <input type="text" value={data.full_name} onChange={e => setData('full_name', e.target.value)} className={inputCls} />
                                    {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name}</p>}
                                </div>
                                <div>
                                    <label className={labelCls}>Jenis Kelamin *</label>
                                    <select value={data.sex} onChange={e => setData('sex', e.target.value)} className={inputCls}>
                                        <option value="">Pilih...</option>
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                    {errors.sex && <p className="text-xs text-red-500 mt-1">{errors.sex}</p>}
                                </div>
                                <div>
                                    <label className={labelCls}>Kewarganegaraan *</label>
                                    <input type="text" value={data.citizenship} onChange={e => setData('citizenship', e.target.value)} className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Status Pernikahan *</label>
                                    <select value={data.marital_status} onChange={e => setData('marital_status', e.target.value)} className={inputCls}>
                                        <option value="">Pilih...</option>
                                        <option value="Belum Menikah">Belum Menikah</option>
                                        <option value="Menikah">Menikah</option>
                                        <option value="Cerai">Cerai</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>Agama *</label>
                                    <select value={data.religion} onChange={e => setData('religion', e.target.value)} className={inputCls}>
                                        <option value="">Pilih...</option>
                                        {['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu', 'Lainnya'].map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>Berat Badan (kg)</label>
                                    <input type="text" value={data.weight} onChange={e => setData('weight', e.target.value)} className={inputCls} placeholder="e.g. 65" />
                                </div>
                                <div>
                                    <label className={labelCls}>Tinggi Badan (cm)</label>
                                    <input type="text" value={data.height} onChange={e => setData('height', e.target.value)} className={inputCls} placeholder="e.g. 170" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className={labelCls}>Alamat Saat Ini *</label>
                                    <textarea value={data.current_address} onChange={e => setData('current_address', e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm resize-none text-neutral-900 bg-white" />
                                    {errors.current_address && <p className="text-xs text-red-500 mt-1">{errors.current_address}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className={labelCls}>Hobi</label>
                                    <input type="text" value={data.hobby} onChange={e => setData('hobby', e.target.value)} className={inputCls} placeholder="e.g. Membaca, olahraga, memasak" />
                                </div>
                            </div>
                        </section>

                        {/* Education Table */}
                        <section className="rounded-2xl bg-white border border-neutral-200 p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-neutral-900">Riwayat Pendidikan</h2>
                                <button type="button" onClick={() => addRow('education')} className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Tambah</button>
                            </div>
                            <div className="space-y-4">
                                {data.education.map((row, i) => (
                                    <div key={i} className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 rounded-xl bg-neutral-50 border border-neutral-100 relative">
                                        {data.education.length > 1 && <button type="button" onClick={() => removeRow('education', i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X className="w-3 h-3" /></button>}
                                        <input placeholder="Jenjang" value={row.level} onChange={e => updateRow('education', i, 'level', e.target.value)} className={inputCls} />
                                        <input placeholder="Nama Sekolah" value={row.school} onChange={e => updateRow('education', i, 'school', e.target.value)} className={inputCls + ' col-span-2 sm:col-span-1'} />
                                        <input placeholder="Jurusan" value={row.major} onChange={e => updateRow('education', i, 'major', e.target.value)} className={inputCls} />
                                        <input placeholder="Tahun" value={row.year} onChange={e => updateRow('education', i, 'year', e.target.value)} className={inputCls} />
                                        <input placeholder="IPK/Nilai" value={row.gpa} onChange={e => updateRow('education', i, 'gpa', e.target.value)} className={inputCls} />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Training Table */}
                        <section className="rounded-2xl bg-white border border-neutral-200 p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-neutral-900">Pelatihan / Kursus</h2>
                                <button type="button" onClick={() => addRow('training')} className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Tambah</button>
                            </div>
                            <div className="space-y-3">
                                {data.training.map((row, i) => (
                                    <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-xl bg-neutral-50 border border-neutral-100 relative">
                                        {data.training.length > 1 && <button type="button" onClick={() => removeRow('training', i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X className="w-3 h-3" /></button>}
                                        <input placeholder="Nama Pelatihan" value={row.name} onChange={e => updateRow('training', i, 'name', e.target.value)} className={inputCls + ' col-span-2 sm:col-span-1'} />
                                        <input placeholder="Penyelenggara" value={row.organizer} onChange={e => updateRow('training', i, 'organizer', e.target.value)} className={inputCls} />
                                        <input placeholder="Tahun" value={row.year} onChange={e => updateRow('training', i, 'year', e.target.value)} className={inputCls} />
                                        <input placeholder="Durasi" value={row.duration} onChange={e => updateRow('training', i, 'duration', e.target.value)} className={inputCls} />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Organization Table */}
                        <section className="rounded-2xl bg-white border border-neutral-200 p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-neutral-900">Pengalaman Organisasi</h2>
                                <button type="button" onClick={() => addRow('organization')} className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Tambah</button>
                            </div>
                            <div className="space-y-3">
                                {data.organization.map((row, i) => (
                                    <div key={i} className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-neutral-50 border border-neutral-100 relative">
                                        {data.organization.length > 1 && <button type="button" onClick={() => removeRow('organization', i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X className="w-3 h-3" /></button>}
                                        <input placeholder="Nama Organisasi" value={row.name} onChange={e => updateRow('organization', i, 'name', e.target.value)} className={inputCls} />
                                        <input placeholder="Jabatan" value={row.position} onChange={e => updateRow('organization', i, 'position', e.target.value)} className={inputCls} />
                                        <input placeholder="Tahun" value={row.year} onChange={e => updateRow('organization', i, 'year', e.target.value)} className={inputCls} />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Skills */}
                        <section className="rounded-2xl bg-white border border-neutral-200 p-5 shadow-sm">
                            <h2 className="text-base font-bold text-neutral-900 mb-4">Keahlian Tanpa Sertifikat</h2>
                            <textarea value={data.skills} onChange={e => setData('skills', e.target.value)} rows={3} placeholder="Contoh: Microsoft Office, Bahasa Inggris pasif, mengoperasikan forklift, dll." className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm resize-none text-neutral-900 bg-white" />
                        </section>

                        {/* Work Experience */}
                        <section className="rounded-2xl bg-white border border-neutral-200 p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-neutral-900">Pengalaman Kerja</h2>
                                <button type="button" onClick={() => addRow('work_experience')} className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Tambah</button>
                            </div>
                            <div className="space-y-4">
                                {data.work_experience.map((row, i) => (
                                    <div key={i} className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-neutral-50 border border-neutral-100 relative">
                                        {data.work_experience.length > 1 && <button type="button" onClick={() => removeRow('work_experience', i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X className="w-3 h-3" /></button>}
                                        <input placeholder="Perusahaan" value={row.company} onChange={e => updateRow('work_experience', i, 'company', e.target.value)} className={inputCls + ' col-span-2 sm:col-span-1'} />
                                        <input placeholder="Dari (tahun)" value={row.from} onChange={e => updateRow('work_experience', i, 'from', e.target.value)} className={inputCls} />
                                        <input placeholder="Sampai (tahun)" value={row.to} onChange={e => updateRow('work_experience', i, 'to', e.target.value)} className={inputCls} />
                                        <input placeholder="Gaji terakhir" value={row.last_salary} onChange={e => updateRow('work_experience', i, 'last_salary', e.target.value)} className={inputCls} />
                                        <input placeholder="Alasan keluar" value={row.reason_quit} onChange={e => updateRow('work_experience', i, 'reason_quit', e.target.value)} className={inputCls + ' col-span-2'} />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Interest & Salary */}
                        <section className="rounded-2xl bg-white border border-neutral-200 p-5 shadow-sm">
                            <h2 className="text-base font-bold text-neutral-900 mb-4">Motivasi & Harapan</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelCls}>Mengapa tertarik bekerja di perusahaan kami?</label>
                                    <textarea value={data.why_interested} onChange={e => setData('why_interested', e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm resize-none text-neutral-900 bg-white" />
                                </div>
                                <div>
                                    <label className={labelCls}>Berapa gaji yang Anda harapkan?</label>
                                    <input type="text" value={data.salary_expectation} onChange={e => setData('salary_expectation', e.target.value)} className={inputCls} placeholder="e.g. Rp 5.000.000" />
                                </div>
                            </div>
                        </section>

                        {/* Relative */}
                        <section className="rounded-2xl bg-white border border-neutral-200 p-5 shadow-sm">
                            <h2 className="text-base font-bold text-neutral-900 mb-4">Informasi Tambahan</h2>
                            <div className="space-y-4">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${data.has_relative ? 'bg-indigo-600 border-indigo-600' : 'border-neutral-300'}`}>
                                        {data.has_relative && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <input type="checkbox" className="sr-only" checked={data.has_relative} onChange={e => setData('has_relative', e.target.checked)} />
                                    <span className="text-sm text-neutral-700">Apakah Anda memiliki kerabat yang bekerja di perusahaan kami?</span>
                                </label>
                                {data.has_relative && (
                                    <input type="text" value={data.relative_name} onChange={e => setData('relative_name', e.target.value)} className={inputCls} placeholder="Nama kerabat" />
                                )}
                            </div>
                        </section>

                        {/* References */}
                        <section className="rounded-2xl bg-white border border-neutral-200 p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-base font-bold text-neutral-900">Referensi</h2>
                                    <p className="text-xs text-neutral-500">Tidak termasuk keluarga atau mantan atasan.</p>
                                </div>
                                <button type="button" onClick={() => addRow('references')} className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Tambah</button>
                            </div>
                            <div className="space-y-3">
                                {data.references.map((row, i) => (
                                    <div key={i} className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-neutral-50 border border-neutral-100 relative">
                                        {data.references.length > 1 && <button type="button" onClick={() => removeRow('references', i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X className="w-3 h-3" /></button>}
                                        <input placeholder="Nama" value={row.name} onChange={e => updateRow('references', i, 'name', e.target.value)} className={inputCls} />
                                        <input placeholder="Hubungan" value={row.relation} onChange={e => updateRow('references', i, 'relation', e.target.value)} className={inputCls} />
                                        <input placeholder="No. HP" value={row.phone} onChange={e => updateRow('references', i, 'phone', e.target.value)} className={inputCls} />
                                        <input placeholder="Alamat" value={row.address} onChange={e => updateRow('references', i, 'address', e.target.value)} className={inputCls} />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Health */}
                        <section className="rounded-2xl bg-white border border-neutral-200 p-5 shadow-sm">
                            <h2 className="text-base font-bold text-neutral-900 mb-4">Riwayat Kesehatan</h2>
                            <label className="flex items-start gap-3 cursor-pointer">
                                <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${data.has_serious_illness ? 'bg-indigo-600 border-indigo-600' : 'border-neutral-300'}`}>
                                    {data.has_serious_illness && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <input type="checkbox" className="sr-only" checked={data.has_serious_illness} onChange={e => setData('has_serious_illness', e.target.checked)} />
                                <span className="text-sm text-neutral-700">Apakah Anda pernah menderita penyakit serius?</span>
                            </label>
                            {data.has_serious_illness && (
                                <input type="text" value={data.illness_detail} onChange={e => setData('illness_detail', e.target.value)} className={inputCls + ' mt-3'} placeholder="Jelaskan riwayat penyakit" />
                            )}
                        </section>

                        {/* Certification */}
                        <section className="rounded-2xl bg-white border-2 border-indigo-200 p-5 shadow-sm">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${data.certify_true ? 'bg-indigo-600 border-indigo-600' : 'border-neutral-300'}`}>
                                    {data.certify_true && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <input type="checkbox" className="sr-only" checked={data.certify_true} onChange={e => setData('certify_true', e.target.checked)} />
                                <span className="text-sm text-neutral-700 font-medium">Saya menyatakan bahwa semua informasi yang saya berikan adalah benar dan lengkap. Saya bersedia menerima konsekuensi apabila informasi tersebut tidak sesuai dengan kenyataan.</span>
                            </label>
                            {errors.certify_true && <p className="text-xs text-red-500 mt-2">{errors.certify_true}</p>}
                        </section>

                        <button type="submit" disabled={processing || !data.certify_true} className="w-full h-13 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all py-3.5">
                            {processing ? 'Mengirim...' : 'Simpan & Lanjut ke Tes Psikologi'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
