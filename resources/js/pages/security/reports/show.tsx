import { Head, router, useForm } from '@inertiajs/react';
import { MapPin, CheckCircle2, ShieldCheck, Map, Clock, Camera, FileCheck } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useState, useRef } from 'react';

interface SecurityReportItem {
    id: number;
    area_name: string;
    condition: string | null;
    photo_path: string | null;
    notes: string | null;
    checked_at: string | null;
}

interface SecurityReport {
    id: number;
    patrol_date: string;
    status: 'draft' | 'final';
    working_location: { name: string };
    items: SecurityReportItem[];
}

interface Props {
    report: SecurityReport;
    canEdit: boolean;
}

export default function SecurityReportShow({ report, canEdit }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Security Reports', href: '/security/reports' },
        { title: `Report #${report.id}`, href: '#' },
    ];

    const [activeItem, setActiveItem] = useState<SecurityReportItem | null>(null);
    const [gettingGps, setGettingGps] = useState(false);
    const photoInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        condition: 'Safe',
        notes: '',
        latitude: null as number | null,
        longitude: null as number | null,
        photo: null as File | null,
    });

    const pendingCount = report.items.filter(i => !i.checked_at).length;
    const progressPercent = Math.round(((report.items.length - pendingCount) / report.items.length) * 100) || 0;

    const openChecklistFor = (item: SecurityReportItem) => {
        setActiveItem(item);
        reset();
        setData('condition', 'Safe');
    };

    const submitCheck = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Grab GPS location natively before saving
        if ("geolocation" in navigator) {
            setGettingGps(true);
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    
                    router.post(`/security/reports/${report.id}/items/${activeItem?.id}`, {
                        ...data,
                        latitude: lat,
                        longitude: lng,
                    }, {
                        preserveScroll: true,
                        onSuccess: () => {
                            setActiveItem(null);
                            setGettingGps(false);
                            reset();
                        },
                        onError: () => setGettingGps(false),
                    });
                },
                (err) => {
                    alert("Proceeding without GPS. Reason: " + err.message);
                    router.post(`/security/reports/${report.id}/items/${activeItem?.id}`, data as any, {
                        preserveScroll: true,
                        onSuccess: () => {
                            setActiveItem(null);
                            setGettingGps(false);
                            reset();
                        },
                        onError: () => setGettingGps(false),
                    });
                },
                { enableHighAccuracy: true, timeout: 5000 }
            );
        } else {
            router.post(`/security/reports/${report.id}/items/${activeItem?.id}`, data as any, {
                preserveScroll: true,
                onSuccess: () => {
                    setActiveItem(null);
                    reset();
                },
            });
        }
    };

    const finalizeReport = () => {
        if (confirm('Are you sure you want to finalize this report? Once finalized, you cannot make further edits.')) {
            router.post(`/security/reports/${report.id}/finalize`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Patrol Report #${report.id}`} />

            <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
                
                {/* Header Card */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Patrol Report</h1>
                                {report.status === 'draft' ? (
                                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full dark:bg-amber-900/40 dark:text-amber-400">DRAFT</span>
                                ) : (
                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full dark:bg-green-900/40 dark:text-green-400">FINALIZED</span>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-neutral-500 font-medium">
                                <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {report.working_location.name}</div>
                                <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {report.patrol_date}</div>
                            </div>
                        </div>

                        {canEdit && report.status === 'draft' && (
                            <button 
                                onClick={finalizeReport}
                                disabled={pendingCount > 0}
                                className="px-5 py-2.5 bg-blue-600 disabled:bg-neutral-300 disabled:text-neutral-500 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all font-semibold inline-flex items-center gap-2"
                            >
                                <FileCheck className="w-5 h-5" /> 
                                Finalize Patrol Submit
                            </button>
                        )}
                    </div>

                    {report.status === 'draft' && (
                        <div className="mt-6">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Patrol Progress</span>
                                <span className="text-sm font-bold text-blue-600">{progressPercent}%</span>
                            </div>
                            <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-3">
                                <div className="bg-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                            </div>
                            {pendingCount > 0 && <p className="text-xs text-neutral-500 mt-2">{pendingCount} areas remaining.</p>}
                        </div>
                    )}
                </div>

                {/* Items List (Mobile optimized checklist) */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-200">Area Checklist</h3>
                    
                    {report.items.map((item, idx) => {
                        const isChecked = !!item.checked_at;
                        return (
                            <div key={item.id} className={`bg-white dark:bg-neutral-900 rounded-2xl border transition-all ${isChecked ? 'border-green-200 dark:border-green-900/30' : 'border-neutral-200 dark:border-neutral-800'} overflow-hidden shadow-sm`}>
                                <div className={`p-4 flex items-center justify-between cursor-pointer ${!isChecked && canEdit && 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'}`}
                                     onClick={() => { if (!isChecked && canEdit) openChecklistFor(item); }}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isChecked ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400' : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800'}`}>
                                            {isChecked ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-bold">{idx + 1}</span>}
                                        </div>
                                        <div>
                                            <h4 className={`font-semibold ${isChecked ? 'text-neutral-600 line-through dark:text-neutral-400' : 'text-neutral-900 dark:text-white'}`}>{item.area_name}</h4>
                                            {isChecked ? (
                                                <span className="text-xs text-neutral-500">Checked at {item.checked_at && new Date(item.checked_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                            ) : (
                                                <span className="text-xs font-semibold text-amber-600 dark:text-amber-500">Pending Guard Check</span>
                                            )}
                                        </div>
                                    </div>
                                    {!isChecked && canEdit && (
                                        <button className="px-4 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 font-semibold text-sm rounded-lg">Check</button>
                                    )}
                                </div>

                                {isChecked && item.photo_path && (
                                    <div className="p-4 border-t border-neutral-100 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-900/20">
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <img src={`/storage/${item.photo_path}`} alt="Patrol evidence" className="w-full md:w-48 h-32 object-cover rounded-xl border border-neutral-200 dark:border-neutral-700" />
                                            <div className="flex-1">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold mb-2 uppercase ${item.condition === 'Safe' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.condition}</span>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">{item.notes || 'No extra notes provided.'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Checklist Modal */}
                {activeItem && canEdit && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <div className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                                <h3 className="font-bold text-lg text-neutral-900 dark:text-white flex items-center gap-2">
                                    <ShieldCheck className="text-blue-600" /> Checking: {activeItem.area_name}
                                </h3>
                            </div>
                            <div className="p-6 overflow-y-auto w-full">
                                <form id="checkForm" onSubmit={submitCheck} className="space-y-5">
                                    
                                    {/* Action: Photo capture */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-neutral-800 dark:text-neutral-200">Proof Snapshot <span className="text-red-500">*</span></label>
                                        <div 
                                            onClick={() => photoInputRef.current?.click()}
                                            className="w-full h-40 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                        >
                                            {data.photo ? (
                                                <div className="text-center">
                                                    <span className="bg-green-100 text-green-700 p-3 rounded-full inline-block mb-2">
                                                        <CheckCircle2 className="w-8 h-8" />
                                                    </span>
                                                    <p className="font-semibold text-neutral-900 dark:text-white">Photo Captured</p>
                                                </div>
                                            ) : (
                                                <div className="text-center text-neutral-500">
                                                    <Camera className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                                    <p className="font-medium">Tap to open Camera</p>
                                                </div>
                                            )}
                                        </div>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            capture="environment" 
                                            className="hidden" 
                                            ref={photoInputRef}
                                            required
                                            onChange={e => setData('photo', e.target.files ? e.target.files[0] : null)}
                                        />
                                        {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
                                    </div>

                                    {/* Action: Condition picker */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-neutral-800 dark:text-neutral-200">Condition</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button 
                                                type="button" 
                                                onClick={() => setData('condition', 'Safe')}
                                                className={`p-3 rounded-xl border-2 font-bold transition-all ${data.condition === 'Safe' ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30' : 'border-neutral-200 dark:border-neutral-800 text-neutral-500'}`}
                                            >Safe</button>
                                            <button 
                                                type="button" 
                                                onClick={() => setData('condition', 'Unsafe')}
                                                className={`p-3 rounded-xl border-2 font-bold transition-all ${data.condition === 'Unsafe' ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/30' : 'border-neutral-200 dark:border-neutral-800 text-neutral-500'}`}
                                            >Unsafe/Suspicious</button>
                                        </div>
                                    </div>

                                    {/* Action: Notes */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-neutral-800 dark:text-neutral-200">Extra Notes (Optional)</label>
                                        <textarea 
                                            rows={2}
                                            value={data.notes}
                                            onChange={e => setData('notes', e.target.value)}
                                            placeholder="Any incidents or broken items?"
                                            className="w-full rounded-xl border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 text-sm"
                                        />
                                    </div>

                                </form>
                            </div>
                            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 flex gap-3">
                                <button type="button" onClick={() => setActiveItem(null)} className="flex-1 py-3 bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-white rounded-xl font-bold">Cancel</button>
                                <button type="submit" form="checkForm" disabled={processing || gettingGps || !data.photo} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-50">
                                    {(processing || gettingGps) ? <Map className="w-5 h-5 animate-pulse" /> : <CheckCircle2 className="w-5 h-5" />}
                                    {gettingGps ? 'Grabbing GPS...' : 'Save & Mark Checked'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
