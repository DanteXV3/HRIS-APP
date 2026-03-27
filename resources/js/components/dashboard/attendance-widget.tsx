import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Loader2, XCircle, CheckCircle2, Camera } from 'lucide-react';
import axios from 'axios';
import { router } from '@inertiajs/react';
import * as faceapi from '@vladmandic/face-api';

interface AttendanceWidgetProps {
    employee: any;
    todayAttendance: any;
}

export function AttendanceWidget({ employee, todayAttendance }: AttendanceWidgetProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const detectorIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const [isProcessing, setIsProcessing] = useState(false);
    const [successMessage, setSuccessMessage] = useState<{title: string, message: string, type: 'in'|'out'|'error'} | null>(null);
    const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);
    const [faceStatus, setFaceStatus] = useState<'idle' | 'loading' | 'verifying' | 'matched' | 'error'>('idle');
    const [faceError, setFaceError] = useState('');
    const [isModelsLoaded, setIsModelsLoaded] = useState(false);
    const [faceDetected, setFaceDetected] = useState(false);

    // Load models once
    useEffect(() => {
        const loadModels = async () => {
            try {
                const MODEL_URL = '/models';
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                ]);
                setIsModelsLoaded(true);
                console.log('[AttendanceWidget] Face models loaded');
            } catch (err) {
                console.error('[AttendanceWidget] Error loading models:', err);
            }
        };
        loadModels();
        return () => {
            if (detectorIntervalRef.current) clearInterval(detectorIntervalRef.current);
        };
    }, []);

    // Continuous face detection + auto-verification loop
    const startDetectionLoop = useCallback(() => {
        if (detectorIntervalRef.current) clearInterval(detectorIntervalRef.current);

        detectorIntervalRef.current = setInterval(async () => {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (!video || !canvas || video.paused || video.ended || video.videoWidth === 0) return;

            try {
                const displaySize = { width: video.videoWidth, height: video.videoHeight };
                faceapi.matchDimensions(canvas, displaySize);

                const detection = await faceapi.detectSingleFace(
                    video,
                    new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 })
                ).withFaceLandmarks().withFaceDescriptor();

                const ctx = canvas.getContext('2d');
                if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

                if (detection) {
                    const resized = faceapi.resizeResults(detection, displaySize);
                    faceapi.draw.drawDetections(canvas, [resized]);
                    setFaceDetected(true);

                    // Auto-verify against stored descriptor
                    if (employee?.face_descriptor) {
                        const savedDescriptor = new Float32Array(JSON.parse(employee.face_descriptor));
                        const distance = faceapi.euclideanDistance(detection.descriptor, savedDescriptor);
                        console.log('[AttendanceWidget] Face distance:', distance);

                        // Lowered threshold from 0.6 to 0.45 for much stricter matching
                        if (distance < 0.45) {
                            // Match! Stop detection and proceed
                            if (detectorIntervalRef.current) clearInterval(detectorIntervalRef.current);
                            setFaceStatus('matched');
                            // Stop camera after brief delay
                            setTimeout(() => {
                                stopCamera();
                                setIsFaceModalOpen(false);
                                performAttendance();
                            }, 1200);
                        }
                    }
                } else {
                    setFaceDetected(false);
                }
            } catch (err) {
                console.error('[AttendanceWidget] Detection error:', err);
            }
        }, 800);
    }, [employee]);

    const startCamera = async () => {
        setFaceStatus('loading');
        setIsFaceModalOpen(true);
        setFaceError('');
        setFaceDetected(false);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
            });
            // Wait for modal to render, then attach
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current?.play();
                        console.log('[AttendanceWidget] Video ready:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
                        setFaceStatus('verifying');
                        if (isModelsLoaded) startDetectionLoop();
                    };
                }
            }, 200);
        } catch (err) {
            setFaceError('Gagal mengakses kamera. Pastikan izin kamera diberikan.');
            setFaceStatus('error');
        }
    };

    const stopCamera = () => {
        if (detectorIntervalRef.current) {
            clearInterval(detectorIntervalRef.current);
            detectorIntervalRef.current = null;
        }
        const video = videoRef.current;
        if (video && video.srcObject) {
            (video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            video.srcObject = null;
        }
    };

    const handleAttendance = () => {
        if (!employee || isProcessing) return;

        if (employee.face_descriptor) {
            startCamera();
        } else {
            const confirm = window.confirm('Anda belum mendaftarkan wajah. Lanjutkan presensi tanpa verifikasi wajah?');
            if (confirm) performAttendance();
        }
    };

    const performAttendance = async () => {
        setIsProcessing(true);
        setSuccessMessage(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const params: any = { latitude, longitude };

                    const performVerify = async (extraParams = {}) => {
                        try {
                            const response = await axios.post('/api/attendance/verify', { ...params, ...extraParams });
                            const data = response.data;

                            if (data.success) {
                                setSuccessMessage({ title: data.name, message: data.message, type: data.action === 'clock_in' ? 'in' : 'out' });
                                setTimeout(() => {
                                    setSuccessMessage(null);
                                    router.reload();
                                }, 4000);
                            }
                        } catch (err: any) {
                            if (err.response?.status === 400 && err.response?.data?.outside_radius) {
                                const remark = window.prompt(err.response.data.message);
                                if (remark) {
                                    await performVerify({ remark });
                                } else {
                                    setSuccessMessage({ title: 'Dibatalkan', message: 'Presensi dibatalkan.', type: 'error' });
                                    setTimeout(() => setSuccessMessage(null), 3000);
                                }
                            } else {
                                throw err;
                            }
                        }
                    };

                    await performVerify();
                } catch (error: any) {
                    const message = error.response?.data?.message || 'Terjadi kesalahan sistem.';
                    setSuccessMessage({ title: 'Gagal', message, type: 'error' });
                    setTimeout(() => setSuccessMessage(null), 3000);
                } finally {
                    setIsProcessing(false);
                }
            },
            (error) => {
                console.error(error);
                setSuccessMessage({ title: 'Lokasi Dibutuhkan', message: 'Gagal mendapatkan lokasi. Pastikan GPS aktif.', type: 'error' });
                setIsProcessing(false);
                setTimeout(() => setSuccessMessage(null), 5000);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    if (!employee) return null;

    return (
        <div className="rounded-xl border border-blue-500/20 bg-blue-50/50 p-6 dark:border-blue-500/10 dark:bg-blue-900/10 mb-2">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Presensi Hari Ini
                    </h2>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                        {todayAttendance
                            ? (todayAttendance.clock_out ? 'Anda sudah menyelesaikan absensi hari ini.' : `Anda telah Clock In pada ${new Date(todayAttendance.clock_in).toLocaleTimeString()}. Silahkan Clock Out saat pulang.`)
                            : 'Anda belum absen hari ini.'}
                    </p>
                </div>

                {!todayAttendance?.clock_out && (
                    <button
                        onClick={handleAttendance}
                        disabled={isProcessing}
                        className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-3 disabled:opacity-50
                            ${todayAttendance ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-500/20' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/20'}
                        `}
                    >
                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                        {todayAttendance ? 'Absen Pulang Sekarang' : 'Absen Masuk Sekarang'}
                    </button>
                )}
            </div>

            {successMessage && (
                <div className={`mt-4 p-4 rounded-xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2
                    ${successMessage.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:border-red-500/30' : 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:border-green-500/30'}
                `}>
                    {successMessage.type === 'error' ? <XCircle className="w-8 h-8 flex-shrink-0" /> : <CheckCircle2 className="w-8 h-8 flex-shrink-0 text-green-500" />}
                    <div>
                        <h4 className="font-bold">{successMessage.title}</h4>
                        <p className="text-sm opacity-90">{successMessage.message}</p>
                    </div>
                </div>
            )}

            {/* Face Verification Modal */}
            {isFaceModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                        <div className="mb-4 text-center">
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center justify-center gap-2">
                                <Camera className="w-6 h-6 text-blue-600" />
                                Verifikasi Wajah
                            </h3>
                            <p className="text-sm text-neutral-500 mt-1">Deteksi wajah otomatis sedang berjalan...</p>
                        </div>

                        <div className="relative mx-auto" style={{ maxWidth: 360 }}>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                width={640}
                                height={480}
                                style={{ width: '100%', height: 'auto', borderRadius: 16, transform: 'scaleX(-1)' }}
                            />
                            <canvas
                                ref={canvasRef}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'scaleX(-1)' }}
                            />

                            {/* Status indicator */}
                            <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5
                                ${faceStatus === 'matched' ? 'bg-green-500 text-white' : faceDetected ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'}`}>
                                <div className={`w-2 h-2 rounded-full ${faceStatus === 'matched' ? 'bg-green-200' : faceDetected ? 'bg-yellow-200 animate-pulse' : 'bg-red-200'}`} />
                                {faceStatus === 'matched' ? 'Wajah Cocok ✓' : faceDetected ? 'Mencocokkan...' : 'Mencari Wajah...'}
                            </div>

                            {faceStatus === 'loading' && (
                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white rounded-2xl">
                                    <Loader2 className="w-10 h-10 animate-spin mb-2" />
                                    <p className="text-xs font-bold">Memuat kamera...</p>
                                </div>
                            )}

                            {faceStatus === 'matched' && (
                                <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center rounded-2xl">
                                    <CheckCircle2 className="w-20 h-20 text-white drop-shadow-lg" />
                                </div>
                            )}
                        </div>

                        {faceError && (
                            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs flex items-center gap-2 border border-red-100">
                                <XCircle className="w-4 h-4 flex-shrink-0" />
                                {faceError}
                            </div>
                        )}

                        <div className="mt-4 flex flex-col gap-3">
                            <button
                                onClick={() => { stopCamera(); setIsFaceModalOpen(false); }}
                                className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-bold transition-all dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
