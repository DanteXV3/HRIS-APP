import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Head, Link } from '@inertiajs/react';
import * as faceapi from '@vladmandic/face-api';
import { Camera, CheckCircle2, XCircle, Loader2, ArrowLeft, Clock, UserCheck } from 'lucide-react';
import axios from 'axios';

interface EmployeeDescriptor {
    id: number;
    nama: string;
    nik: string;
    descriptor: number[];
}

type ResultType = {
    success: boolean;
    name: string;
    action: string;
    time?: string;
    message: string;
};

export default function FaceAttendance() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const detectorRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const [isModelsLoaded, setIsModelsLoaded] = useState(false);
    const [employees, setEmployees] = useState<EmployeeDescriptor[]>([]);
    const [scanning, setScanning] = useState(false);
    const [cooldown, setCooldown] = useState(false);
    const [cooldownCount, setCooldownCount] = useState(0);
    const [result, setResult] = useState<ResultType | null>(null);
    const [faceDetected, setFaceDetected] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [loadingStatus, setLoadingStatus] = useState('Memuat model AI...');

    // Live clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Load models + descriptors
    useEffect(() => {
        const init = async () => {
            try {
                setLoadingStatus('Memuat model AI...');
                const MODEL_URL = '/models';
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                ]);
                setIsModelsLoaded(true);

                setLoadingStatus('Memuat data karyawan...');
                const res = await axios.get('/api/face-descriptors');
                setEmployees(res.data);
                setLoadingStatus('');
            } catch (err) {
                console.error('Init error:', err);
                setLoadingStatus('Gagal memuat. Silahkan refresh halaman.');
            }
        };
        init();

        return () => {
            if (detectorRef.current) clearInterval(detectorRef.current);
        };
    }, []);

    // Start camera
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play();
                    setScanning(true);
                    startDetectionLoop();
                };
            }
        } catch (err) {
            console.error('Camera error:', err);
        }
    };

    // Match face against all employee descriptors
    const findMatch = useCallback((descriptor: Float32Array): EmployeeDescriptor | null => {
        let bestMatch: EmployeeDescriptor | null = null;
        let bestDistance = 0.45; // Stricter threshold (was 0.6)

        for (const emp of employees) {
            const saved = new Float32Array(emp.descriptor);
            const distance = faceapi.euclideanDistance(descriptor, saved);
            if (distance < bestDistance) {
                bestDistance = distance;
                bestMatch = emp;
            }
        }

        return bestMatch;
    }, [employees]);

    // Continuous detection loop
    const startDetectionLoop = useCallback(() => {
        if (detectorRef.current) clearInterval(detectorRef.current);

        detectorRef.current = setInterval(async () => {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (!video || !canvas || video.paused || video.ended || video.videoWidth === 0) return;
            if (cooldown) return; // Skip during cooldown

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

                    // Try to match
                    const match = findMatch(detection.descriptor);
                    if (match) {
                        // Found a match! Trigger attendance
                        triggerAttendance(match);
                    }
                } else {
                    setFaceDetected(false);
                }
            } catch (err) {
                // Silently ignore detection frame errors
            }
        }, 800);
    }, [employees, findMatch, cooldown]);

    // Cooldown re-enable detection after 3 seconds
    useEffect(() => {
        if (cooldown) {
            setCooldownCount(3);
            const timer = setInterval(() => {
                setCooldownCount(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setCooldown(false);
                        setResult(null);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [cooldown]);

    // Re-enable detection loop when cooldown ends
    useEffect(() => {
        if (!cooldown && scanning && isModelsLoaded) {
            startDetectionLoop();
        }
    }, [cooldown, scanning, isModelsLoaded, startDetectionLoop]);

    const triggerAttendance = async (emp: EmployeeDescriptor) => {
        // Stop detection during processing
        if (detectorRef.current) clearInterval(detectorRef.current);
        setCooldown(true);

        setResult({
            success: true,
            name: emp.nama,
            action: 'processing',
            message: 'Memverifikasi lokasi & presensi...'
        });

        const performVerify = async (latitude?: number, longitude?: number, extraParams = {}) => {
            try {
                const response = await axios.post('/api/face-attendance/verify', {
                    employee_id: emp.id,
                    latitude,
                    longitude,
                    ...extraParams
                });
                setResult(response.data);
            } catch (err: any) {
                if (err.response?.status === 400 && err.response?.data?.outside_radius) {
                    const remark = window.prompt(err.response.data.message);
                    if (remark) {
                        await performVerify(latitude, longitude, { remark });
                    } else {
                        setResult({
                            success: false,
                            name: emp.nama,
                            action: 'error',
                            message: 'Presensi dibatalkan karena di luar radius (tanpa keterangan).'
                        });
                    }
                } else if (err.response?.data) {
                    setResult(err.response.data);
                } else {
                    setResult({
                        success: false,
                        name: emp.nama,
                        action: 'error',
                        message: 'Terjadi kesalahan sistem. Silahkan coba lagi.'
                    });
                }
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    await performVerify(position.coords.latitude, position.coords.longitude);
                },
                async (error) => {
                    console.error('GPS Error:', error);
                    // Jika GPS gagal, tetap coba verifikasi (backend yang akan menolak jika harus ada lokasi)
                    await performVerify();
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            await performVerify();
        }
    };

    // Auto-start camera when models are loaded
    useEffect(() => {
        if (isModelsLoaded && employees.length > 0 && !scanning) {
            startCamera();
        }
    }, [isModelsLoaded, employees]);

    const formatTime = (d: Date) => d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const formatDate = (d: Date) => d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <>
            <Head title="Face Attendance" />
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {/* Animated bg circles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                {/* Back to Login */}
                <Link
                    href="/login"
                    className="absolute top-6 left-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm z-10"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Login
                </Link>

                {/* Clock Display */}
                <div className="text-center mb-6 z-10">
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight tabular-nums">
                        {formatTime(currentTime)}
                    </h1>
                    <p className="text-blue-300/80 mt-2 text-lg font-medium">{formatDate(currentTime)}</p>
                </div>

                {/* Main Card */}
                <div className="w-full max-w-lg z-10">
                    <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-4 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                    <Camera className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-white font-bold text-lg">Face Attendance</h2>
                                    <p className="text-blue-300/60 text-xs">Presensi otomatis dengan deteksi wajah</p>
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5
                                ${scanning ? (faceDetected ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400') : 'bg-gray-500/20 text-gray-400'}`}
                            >
                                <div className={`w-2 h-2 rounded-full ${scanning ? (faceDetected ? 'bg-green-400 animate-pulse' : 'bg-yellow-400 animate-pulse') : 'bg-gray-400'}`} />
                                {scanning ? (faceDetected ? 'Wajah Terdeteksi' : 'Menunggu Wajah') : 'Memuat...'}
                            </div>
                        </div>

                        {/* Camera Feed */}
                        <div className="relative aspect-[4/3] bg-black">
                            {!scanning && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-3">
                                    <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
                                    <p className="text-sm text-blue-300">{loadingStatus}</p>
                                </div>
                            )}
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                width={640}
                                height={480}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                            />
                            <canvas
                                ref={canvasRef}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'scaleX(-1)' }}
                            />

                            {/* Result Overlay */}
                            {result && (
                                <div className={`absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm
                                    ${result.action === 'processing' ? 'bg-black/70' :
                                        result.success
                                            ? (result.action === 'clock_in' ? 'bg-green-500/70' : 'bg-blue-500/70')
                                            : 'bg-red-500/70'
                                    }`}
                                >
                                    {result.action === 'processing' ? (
                                        <>
                                            <Loader2 className="w-16 h-16 text-blue-400 animate-spin mb-4" />
                                            <h3 className="text-2xl font-bold text-white mb-1">{result.name}</h3>
                                            <p className="text-white/90 text-center px-6">{result.message}</p>
                                        </>
                                    ) : result.success ? (
                                        <>
                                            <CheckCircle2 className="w-24 h-24 text-white mb-4 drop-shadow-lg" />
                                            <h3 className="text-3xl font-black text-white mb-1">{result.name}</h3>
                                            <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-3">
                                                <Clock className="w-4 h-4 text-white" />
                                                <span className="text-white font-bold text-lg">{result.time}</span>
                                            </div>
                                            <p className="text-white/90 text-lg font-medium text-center px-6">{result.message}</p>
                                            <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-bold">
                                                <UserCheck className="w-4 h-4" />
                                                {result.action === 'clock_in' ? 'CLOCK IN' : 'CLOCK OUT'}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-20 h-20 text-white mb-4" />
                                            <h3 className="text-2xl font-bold text-white mb-1">{result.name}</h3>
                                            <p className="text-white/90 text-center px-6">{result.message}</p>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Cooldown Timer */}
                            {cooldown && cooldownCount > 0 && (
                                <div className="absolute bottom-4 right-4 bg-black/60 text-white rounded-full px-4 py-2 text-sm font-bold flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Selanjutnya dalam {cooldownCount}s
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-3 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-t border-white/10 text-center">
                            <p className="text-blue-300/50 text-xs">
                                {employees.length} karyawan terdaftar • Arahkan wajah ke kamera untuk presensi otomatis
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
