import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Camera, RefreshCw } from 'lucide-react';

interface Props {
    employees: Array<{ id: number, nama: string, nik: string, face_descriptor: string | null }>;
    onMatch: (employeeId: number, distance: number, location?: { latitude: number, longitude: number } | null) => void;
    isProcessing?: boolean;
}

export default function FaceScanner({ employees, onMatch, isProcessing = false }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [cameraError, setCameraError] = useState('');
    const [status, setStatus] = useState('Memuat Model AI...');
    const matchDebounceRef = useRef<number>(0);

    // Initialize face matcher when models and employees are loaded
    const [faceMatcher, setFaceMatcher] = useState<faceapi.FaceMatcher | null>(null);
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) return;
        const watchId = navigator.geolocation.watchPosition(
            (pos) => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
            (err) => console.error("Location error", err),
            { enableHighAccuracy: true, maximumAge: 10000 }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

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
                setStatus('Model siap. Membuka kamera...');
            } catch (err) {
                console.error("Error loading models", err);
                setCameraError('Gagal memuat sistem Face AI. Pastikan file model tersedia di /public/models.');
            }
        };
        loadModels();
    }, []);

    useEffect(() => {
        if (!modelsLoaded) return;

        // Build face matcher from employees
        const labeledDescriptors = employees
            .filter(emp => emp.face_descriptor)
            .map(emp => {
                try {
                    const descArray = typeof emp.face_descriptor === 'string' 
                        ? JSON.parse(emp.face_descriptor) 
                        : emp.face_descriptor;
                        
                    return new faceapi.LabeledFaceDescriptors(
                        emp.id.toString(),
                        [new Float32Array(descArray)]
                    );
                } catch (e) {
                    console.error("Invalid descriptor for " + emp.nama);
                    return null;
                }
            })
            .filter(Boolean) as faceapi.LabeledFaceDescriptors[];

        if (labeledDescriptors.length > 0) {
            setFaceMatcher(new faceapi.FaceMatcher(labeledDescriptors, 0.5)); // 0.5 distance threshold (strict)
        }
    }, [employees, modelsLoaded]);

    useEffect(() => {
        if (!modelsLoaded) return;
        
        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing webcam", err);
                setCameraError('Gagal mengakses kamera. Berikan izin di browser Anda.');
            }
        };

        startVideo();

        return () => {
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [modelsLoaded]);

    const handleVideoPlay = () => {
        setStatus('Menganalisa wajah...');
        const interval = setInterval(async () => {
            if (!videoRef.current || !canvasRef.current || !faceMatcher || isProcessing) return;
            
            // Limit processing frequency (5 second cooldown)
            if (Date.now() - matchDebounceRef.current < 5000) return;

            const detections = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (detections) {
                const dims = faceapi.matchDimensions(canvasRef.current, videoRef.current, true);
                const resizedDetections = faceapi.resizeResults(detections, dims);

                canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                faceapi.draw.drawDetections(canvasRef.current, resizedDetections);

                const bestMatch = faceMatcher.findBestMatch(detections.descriptor);
                
                if (bestMatch.label !== 'unknown') {
                    // Match found!
                    matchDebounceRef.current = Date.now();
                    const matchedEmployeeId = parseInt(bestMatch.label);
                    onMatch(matchedEmployeeId, bestMatch.distance, location);
                } else {
                    setStatus('Wajah tidak dikenali. Coba geser sedikit.');
                }
            } else {
                canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                setStatus('Silahkan arahkan wajah ke kamera...');
            }
        }, 500); // Check every 500ms

        return () => clearInterval(interval);
    };

    return (
        <div className="relative w-full max-w-lg mx-auto overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl ring-1 ring-white/10">
            {cameraError ? (
                <div className="flex flex-col items-center justify-center p-12 text-center text-red-400">
                    <Camera className="w-12 h-12 mb-4 opacity-50" />
                    <p>{cameraError}</p>
                </div>
            ) : (
                <>
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        onPlay={handleVideoPlay}
                        className={`w-full h-80 sm:h-[400px] object-cover transition-opacity duration-500 ${isProcessing ? 'opacity-50 blur-[2px]' : 'opacity-100'}`}
                    />
                    <canvas
                        ref={canvasRef}
                        className="absolute top-0 left-0 w-full h-80 sm:h-[400px] pointer-events-none"
                    />
                    
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6 pt-16 sm:pt-20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {isProcessing || !modelsLoaded ? (
                                    <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
                                ) : (
                                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                                )}
                                <span className="text-white font-medium text-xs sm:text-sm">
                                    {isProcessing ? 'Memproses Presensi...' : status}
                                </span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
