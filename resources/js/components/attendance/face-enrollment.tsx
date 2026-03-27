import React, { useRef, useState, useEffect, useCallback } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Camera, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface FaceEnrollmentProps {
    employeeId: number;
    hasDescriptor: boolean;
}

export default function FaceEnrollment({ employeeId, hasDescriptor }: FaceEnrollmentProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isModelsLoaded, setIsModelsLoaded] = useState(false);
    const [status, setStatus] = useState<'idle' | 'scanning' | 'saving' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [isEnrolled, setIsEnrolled] = useState(hasDescriptor);
    const [faceDetected, setFaceDetected] = useState(false);
    const detectorIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const latestDescriptorRef = useRef<Float32Array | null>(null);

    // Load models once on mount
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
                console.log('[FaceEnrollment] Models loaded successfully');
            } catch (err) {
                console.error('[FaceEnrollment] Error loading models:', err);
                setErrorMessage('Gagal memuat model AI. Coba refresh halaman.');
                setStatus('error');
            }
        };
        loadModels();

        return () => {
            // Cleanup on unmount
            if (detectorIntervalRef.current) clearInterval(detectorIntervalRef.current);
        };
    }, []);

    // Continuous detection loop
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
                    faceapi.draw.drawFaceLandmarks(canvas, [resized]);
                    latestDescriptorRef.current = detection.descriptor;
                    setFaceDetected(true);
                } else {
                    latestDescriptorRef.current = null;
                    setFaceDetected(false);
                }
            } catch (err) {
                console.error('[FaceEnrollment] Detection error:', err);
            }
        }, 500); // Run every 500ms
    }, []);

    const startVideo = async () => {
        setErrorMessage('');
        setStatus('scanning');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
            });
            // Wait for next render cycle so the video element is mounted
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current?.play();
                        console.log('[FaceEnrollment] Video playing, dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
                        // Start detection loop after video is ready
                        if (isModelsLoaded) {
                            startDetectionLoop();
                        }
                    };
                }
            }, 100);
        } catch (err) {
            console.error('[FaceEnrollment] Camera error:', err);
            setErrorMessage('Gagal mengakses kamera. Pastikan izin kamera sudah diberikan.');
            setStatus('error');
        }
    };

    const stopVideo = () => {
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

    const handleEnroll = async () => {
        if (!latestDescriptorRef.current) {
            setErrorMessage('Wajah tidak terdeteksi. Pastikan wajah Anda terlihat jelas.');
            return;
        }

        setStatus('saving');
        setErrorMessage('');

        try {
            const descriptor = Array.from(latestDescriptorRef.current);
            const response = await axios.post('/profile/face-descriptor', {
                descriptor: JSON.stringify(descriptor)
            });

            if (response.data.success) {
                setStatus('success');
                setIsEnrolled(true);
                stopVideo();
                setTimeout(() => setStatus('idle'), 3000);
            }
        } catch (err) {
            console.error('[FaceEnrollment] Save error:', err);
            setErrorMessage('Gagal menyimpan data wajah. Silahkan coba lagi.');
            setStatus('scanning');
        }
    };

    return (
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                <div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <Camera className="w-5 h-5 text-blue-600" />
                        Pendaftaran Wajah (Face Scan)
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        Daftarkan wajah Anda untuk fitur presensi berbasis deteksi wajah.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {isEnrolled && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Terdaftar
                        </span>
                    )}
                </div>
            </div>

            {status === 'idle' && (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                    <Camera className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mb-3" />
                    <button
                        type="button"
                        onClick={startVideo}
                        disabled={!isModelsLoaded}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
                    >
                        {!isModelsLoaded ? 'Memuat Model AI...' : (isEnrolled ? 'Scan Ulang Wajah' : 'Mulai Scan Wajah')}
                    </button>
                </div>
            )}

            {(status === 'scanning' || status === 'saving') && (
                <div className="relative">
                    <div className="relative mx-auto" style={{ maxWidth: 480 }}>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            width={640}
                            height={480}
                            style={{ width: '100%', height: 'auto', borderRadius: 12, transform: 'scaleX(-1)' }}
                        />
                        <canvas
                            ref={canvasRef}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'scaleX(-1)' }}
                        />

                        {/* Face status indicator */}
                        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${faceDetected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                            <div className={`w-2 h-2 rounded-full ${faceDetected ? 'bg-green-200 animate-pulse' : 'bg-red-200'}`} />
                            {faceDetected ? 'Wajah Terdeteksi ✓' : 'Mencari Wajah...'}
                        </div>

                        {status === 'saving' && (
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white rounded-xl">
                                <Loader2 className="w-10 h-10 animate-spin mb-2" />
                                <p className="text-sm font-bold">Menyimpan Data Wajah...</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row gap-3 items-center justify-center">
                        <button
                            type="button"
                            onClick={handleEnroll}
                            disabled={!faceDetected || status === 'saving'}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            Simpan Wajah
                        </button>
                        <button
                            type="button"
                            onClick={() => { stopVideo(); setStatus('idle'); }}
                            className="px-4 py-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-xl font-bold transition-all dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            )}

            {status === 'success' && (
                <div className="flex flex-col items-center justify-center p-8 bg-green-50 dark:bg-green-900/10 border-2 border-green-200 dark:border-green-500/20 rounded-xl">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mb-2" />
                    <h4 className="text-xl font-bold text-green-800 dark:text-green-400">Pendaftaran Berhasil!</h4>
                    <p className="text-sm text-green-600 dark:text-green-500 mt-1">Wajah Anda telah berhasil didaftarkan.</p>
                </div>
            )}

            {errorMessage && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{errorMessage}</p>
                </div>
            )}
        </div>
    );
}
