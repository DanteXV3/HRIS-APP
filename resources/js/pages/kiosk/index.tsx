import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import FaceScanner from '@/components/FaceScanner';
import { CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';

interface Props {
    employees: Array<{ id: number, nama: string, nik: string, face_descriptor: string | null }>;
}

export default function Kiosk({ employees }: Props) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [successMessage, setSuccessMessage] = useState<{ title: string, message: string, type: 'in' | 'out' | 'error' } | null>(null);

    const handleMatch = async (employeeId: number, distance: number, location?: { latitude: number, longitude: number } | null) => {
        if (isProcessing || successMessage) return; // Prevent double firing
        
        setIsProcessing(true);
        
        try {
            const response = await axios.post('/api/face-attendance/verify', {
                employee_id: employeeId,
                latitude: location?.latitude,
                longitude: location?.longitude
            });

            const data = response.data;

            if (data.success) {
                setSuccessMessage({
                    title: data.name,
                    message: data.message,
                    type: data.action === 'clock_in' ? 'in' : 'out'
                });
            } else {
                setSuccessMessage({
                    title: data.name || 'Peringatan',
                    message: data.message,
                    type: 'error'
                });
            }

            // Reset after 4 seconds
            setTimeout(() => {
                setSuccessMessage(null);
                setIsProcessing(false);
            }, 4000);

        } catch (error) {
            console.error("Verification failed", error);
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
            <Head title="Face Attendance Kiosk" />

            {/* Header */}
            <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 mt-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <UserCheck className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-center sm:text-left">
                        <h1 className="text-xl font-bold text-white tracking-tight">Kiosk Absensi Pintar</h1>
                        <p className="text-sm text-neutral-400">Silahkan arahkan wajah Anda ke kamera</p>
                    </div>
                </div>
                <Link
                    href="/login"
                    className="text-sm font-medium text-neutral-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                >
                    Kembali ke Login
                </Link>
            </div>

            {/* Main Content */}
            <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
                {/* Scanner Side */}
                <div className="relative">
                    <div className="absolute -inset-4 bg-blue-600/20 rounded-[2rem] blur-2xl animate-pulse" />
                    <FaceScanner 
                        employees={employees} 
                        onMatch={handleMatch}
                        isProcessing={isProcessing}
                    />
                </div>

                {/* Status Side */}
                <div className="flex flex-col justify-center">
                    {successMessage ? (
                        <div className="animate-in slide-in-from-bottom-8 fade-in duration-500">
                            <div className={`
                                flex flex-col items-center text-center p-10 rounded-3xl border
                                ${successMessage.type === 'in' ? 'bg-green-500/10 border-green-500/20' : ''}
                                ${successMessage.type === 'out' ? 'bg-blue-500/10 border-blue-500/20' : ''}
                                ${successMessage.type === 'error' ? 'bg-red-500/10 border-red-500/20' : ''}
                            `}>
                                {successMessage.type === 'error' ? (
                                    <AlertTriangle className={`w-20 h-20 mb-6 text-red-500`} />
                                ) : (
                                    <CheckCircle2 className={`w-20 h-20 mb-6 ${successMessage.type === 'in' ? 'text-green-500' : 'text-blue-500'}`} />
                                )}
                                
                                <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
                                    {successMessage.title}
                                </h2>
                                <p className={`text-xl ${
                                    successMessage.type === 'error' ? 'text-red-400' : 'text-neutral-300'
                                }`}>
                                    {successMessage.message}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 text-neutral-400">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h3 className="text-white font-semibold mb-2">Cara Penggunaan:</h3>
                                <ul className="space-y-2 text-sm list-disc pl-4 marker:text-blue-500">
                                    <li>Berdiri tepat di depan kamera</li>
                                    <li>Pastikan pencahayaan ruangan cukup terang</li>
                                    <li>Lepaskan masker atau kacamata hitam</li>
                                    <li>Tunggu hingga sistem mengenali wajah Anda (sekitar 1-2 detik)</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="mt-8 text-neutral-600 text-xs sm:text-sm text-center">
                Sistem Absensi Kamera v2.0 &bull; Secure AI Matching
            </div>
        </div>
    );
}
