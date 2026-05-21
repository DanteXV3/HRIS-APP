import { Head, useForm } from '@inertiajs/react';
import { Briefcase, MapPin, Building2, Upload, Check, FileText, X, Clock } from 'lucide-react';
import { useState, useRef } from 'react';

interface Props {
    opening: {
        id: number;
        uuid: string;
        company: string;
        position: string;
        working_location: string;
        contract_duration: string | null;
        requirements: string[] | null;
    };
}

export default function JobApply({ opening }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        email: string;
        phone: string;
        address: string;
        requirement_checklist: string[];
        cv_files: File[];
    }>({
        name: '',
        email: '',
        phone: '',
        address: '',
        requirement_checklist: [],
        cv_files: [],
    });

    const fileRef = useRef<HTMLInputElement>(null);

    const toggleReq = (req: string) => {
        const current = [...data.requirement_checklist];
        const idx = current.indexOf(req);
        if (idx >= 0) current.splice(idx, 1);
        else current.push(req);
        setData('requirement_checklist', current);
    };

    const addFiles = (files: FileList | null) => {
        if (!files) return;
        const newFiles = [...data.cv_files, ...Array.from(files)].slice(0, 5);
        setData('cv_files', newFiles);
    };

    const removeFile = (i: number) => {
        setData('cv_files', data.cv_files.filter((_, idx) => idx !== i));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/career/${opening.uuid}/apply`, { forceFormData: true });
    };

    return (
        <>
            <Head title={`Lamar - ${opening.position}`} />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
                {/* Header */}
                <div className="bg-white border-b border-neutral-200 shadow-sm">
                    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 mb-4">
                            <Briefcase className="w-7 h-7" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-2">{opening.position}</h1>
                        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-neutral-500">
                            <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {opening.company}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {opening.working_location}</span>
                            {opening.contract_duration && (
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {opening.contract_duration}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
                    <form onSubmit={submit} className="space-y-5">
                        {/* Personal Info */}
                        <div className="rounded-2xl bg-white border border-neutral-200 p-5 sm:p-6 shadow-sm">
                            <h2 className="text-base font-bold text-neutral-900 mb-4">Data Diri</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Nama Lengkap *</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full h-11 px-4 rounded-xl border border-neutral-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-neutral-900 bg-white" placeholder="Masukkan nama lengkap" />
                                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full h-11 px-4 rounded-xl border border-neutral-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-neutral-900 bg-white" placeholder="email@contoh.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">No. HP / WhatsApp *</label>
                                        <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)} className="w-full h-11 px-4 rounded-xl border border-neutral-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-neutral-900 bg-white" placeholder="08xx-xxxx-xxxx" />
                                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Alamat</label>
                                    <textarea value={data.address} onChange={e => setData('address', e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none text-neutral-900 bg-white" placeholder="Alamat tempat tinggal saat ini" />
                                </div>
                            </div>
                        </div>

                        {/* Requirements Checklist */}
                        {opening.requirements && opening.requirements.length > 0 && (
                            <div className="rounded-2xl bg-white border border-neutral-200 p-5 sm:p-6 shadow-sm">
                                <h2 className="text-base font-bold text-neutral-900 mb-1">Persyaratan</h2>
                                <p className="text-xs text-neutral-500 mb-4">Centang persyaratan yang Anda penuhi.</p>
                                <div className="space-y-2.5">
                                    {opening.requirements.map((req, i) => (
                                        <label key={i} className="flex items-start gap-3 cursor-pointer group">
                                            <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${data.requirement_checklist.includes(req) ? 'bg-indigo-600 border-indigo-600' : 'border-neutral-300 group-hover:border-indigo-400'}`}>
                                                {data.requirement_checklist.includes(req) && <Check className="w-3.5 h-3.5 text-white" />}
                                            </div>
                                            <input type="checkbox" className="sr-only" checked={data.requirement_checklist.includes(req)} onChange={() => toggleReq(req)} />
                                            <span className="text-sm text-neutral-700">{req}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CV Upload */}
                        <div className="rounded-2xl bg-white border border-neutral-200 p-5 sm:p-6 shadow-sm">
                            <h2 className="text-base font-bold text-neutral-900 mb-1">Upload CV / Dokumen</h2>
                            <p className="text-xs text-neutral-500 mb-4">PDF, DOC, DOCX, JPG, PNG (maks. 5 file, 5MB/file)</p>

                            <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-neutral-200 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all">
                                <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                                <p className="text-sm text-neutral-600 font-medium">Klik untuk pilih file</p>
                                <p className="text-xs text-neutral-400">atau drag & drop di sini</p>
                            </div>
                            <input ref={fileRef} type="file" className="hidden" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={e => addFiles(e.target.files)} />

                            {data.cv_files.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {data.cv_files.map((f, i) => (
                                        <div key={i} className="flex items-center justify-between bg-neutral-50 rounded-lg px-3 py-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                                                <span className="text-sm text-neutral-700 truncate">{f.name}</span>
                                                <span className="text-[10px] text-neutral-400 shrink-0">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
                                            </div>
                                            <button type="button" onClick={() => removeFile(i)} className="text-red-400 hover:text-red-600 p-1"><X className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {errors.cv_files && <p className="text-xs text-red-500 mt-2">{errors.cv_files}</p>}
                        </div>

                        <button type="submit" disabled={processing} className="w-full h-13 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all py-3.5">
                            {processing ? 'Mengirim...' : 'Kirim Lamaran'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
