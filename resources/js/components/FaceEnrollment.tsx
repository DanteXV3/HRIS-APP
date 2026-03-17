import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { Camera, Check, RefreshCw, X } from 'lucide-react';

interface Props {
    employeeId: number;
    onEnrollmentComplete: () => void;
}

export default function FaceEnrollment({ employeeId, onEnrollmentComplete }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [status, setStatus] = useState('Memuat Model AI...');
    const [isScanning, setIsScanning] = useState(false);
    const [capturedDescriptor, setCapturedDescriptor] = useState<Float32Array | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadModels = async () => {
            try {
                setStatus('Mengunduh Resource AI Wajah (Ukuran Kecil)...');
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                    faceapi.nets.faceRecognitionNet.loadFromUri('/models')
                ]);
                setModelsLoaded(true);
                setStatus('Model siap. Silahkan klik Mulai Scan.');
            } catch (err) {
                console.error("Error loading models", err);
                setStatus('Gagal memuat AI. Pastikan file model tersedia di /public/models.');
            }
        };
        loadModels();
    }, []);

    const startVideo = async () => {
        setIsScanning(true);
        setStatus('Mencari wajah Anda...');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing webcam", err);
            setStatus('Gagal mengakses kamera. Berikan izin di browser Anda.');
            setIsScanning(false);
        }
    };

    const stopVideo = () => {
        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
        setIsScanning(false);
    };

    const handleVideoPlay = () => {
        const interval = setInterval(async () => {
            if (!videoRef.current || !canvasRef.current || !isScanning) return;

            const detections = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (detections) {
                const dims = faceapi.matchDimensions(canvasRef.current, videoRef.current, true);
                const resizedDetections = faceapi.resizeResults(detections, dims);

                canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                faceapi.draw.drawDetections(canvasRef.current, resizedDetections);

                // We found a high confidence face! Pause scanning and capture.
                if (detections.detection.score > 0.8) {
                    clearInterval(interval);
                    setCapturedDescriptor(detections.descriptor);
                    setStatus('Wajah berhasil ditangkap! Silahkan simpan.');
                    stopVideo();
                } else {
                    setStatus('Wajah ditemukan, tapi kurang jelas. Pastikan pencahayaan terang.');
                }
            } else {
                canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                setStatus('Silahkan arahkan wajah ke kamera...');
            }
        }, 500);

        return () => clearInterval(interval);
    };

    const handleSave = async () => {
        if (!capturedDescriptor) return;
        setIsSaving(true);
        setStatus('Menyimpan data wajah...');

        try {
            const descArray = Array.from(capturedDescriptor); // Convert Float32Array to standard array for JSON
            
            const response = await axios.post(`/employees/${employeeId}/face-enroll`, {
                descriptor: descArray
            });

            if (response.status === 200) {
                setStatus('Data wajah berhasil disimpan!');
                setTimeout(() => {
                    onEnrollmentComplete();
                }, 1500);
            } else {
                throw new Error('Gagal menyimpan.');
            }
        } catch (err) {
            console.error(err);
            setStatus('Terjadi kesalahan saat menyimpan data wajah.');
            setIsSaving(false);
        }
    };

    useEffect(() => {
        // Cleanup on unmount
        return () => stopVideo();
    }, []);

    return (
        <div className="w-full max-w-md mx-auto overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-black/20">
                <h3 className="font-semibold text-white">Enroll Wajah Karyawan</h3>
                <div className="text-xs text-neutral-400 font-mono bg-neutral-800 px-2 py-1 rounded">
                    TensorFlow.js Backend
                </div>
            </div>
            
            <div className="p-6">
                <div className="relative w-full aspect-square md:aspect-video rounded-xl overflow-hidden bg-black ring-1 ring-white/10 mb-6 flex items-center justify-center">
                    {!isScanning && !capturedDescriptor && (
                        <div className="text-center p-6 flex flex-col items-center">
                            <Camera className="w-12 h-12 text-neutral-600 mb-4" />
                            <p className="text-sm text-neutral-400">
                                Kamera tidak aktif. Klik "Mulai Scan Wajah" di bawah untuk memulai kalibrasi.
                            </p>
                        </div>
                    )}

                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        onPlay={handleVideoPlay}
                        className={`absolute inset-0 w-full h-full object-cover ${!isScanning ? 'hidden' : ''}`}
                    />
                    <canvas
                        ref={canvasRef}
                        className={`absolute inset-0 w-full h-full pointer-events-none ${!isScanning ? 'hidden' : ''}`}
                    />

                    {capturedDescriptor && !isScanning && (
                        <div className="absolute inset-0 bg-blue-900/40 flex flex-col items-center justify-center backdrop-blur-md border-2 border-blue-500/50">
                            <div className="bg-blue-600/30 w-24 h-24 rounded-full flex items-center justify-center mb-4 ring-4 ring-blue-500/50">
                                <Check className="w-10 h-10 text-blue-400" />
                            </div>
                            <span className="text-blue-200 font-semibold text-lg drop-shadow-md">Scan Wajah Berhasil</span>
                        </div>
                    )}
                </div>

                {/* Status Bar */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50 mb-6 text-sm text-neutral-300">
                    {!modelsLoaded ? (
                        <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                    ) : (
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    )}
                    <span>{status}</span>
                </div>

                <div className="flex justify-end gap-3">
                    {capturedDescriptor ? (
                        <>
                            <button
                                onClick={() => {
                                    setCapturedDescriptor(null);
                                    startVideo();
                                }}
                                disabled={isSaving}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
                            >
                                Ulangi Scan
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-medium text-white shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                {isSaving ? 'Menyimpan...' : 'Simpan Data Wajah'}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={isScanning ? stopVideo : startVideo}
                            disabled={!modelsLoaded}
                            className={`px-6 py-2 rounded-lg text-sm font-medium text-white shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2 w-full justify-center
                                ${isScanning ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
                            `}
                        >
                            {isScanning ? <X className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                            {isScanning ? 'Batalkan Scan' : 'Mulai Scan Wajah'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
