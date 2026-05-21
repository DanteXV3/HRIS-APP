import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Eraser, Check } from 'lucide-react';

interface Props {
    onSave: (base64: string) => void;
    currentSignature?: string | null;
}

export default function SignaturePad({ onSave, currentSignature }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasContent, setHasContent] = useState(false);
    const [saved, setSaved] = useState(false);

    // Set up canvas dimensions
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeCanvas = () => {
            const rect = canvas.parentElement?.getBoundingClientRect();
            if (!rect) return;
            
            // Save existing drawing
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            if (tempCtx) tempCtx.drawImage(canvas, 0, 0);

            // Set proper resolution
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = 200 * dpr;
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = '200px';

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.scale(dpr, dpr);
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#000000';
                // Restore previous drawing
                if (hasContent) {
                    ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, rect.width, 200);
                }
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        
        if ('touches' in e) {
            const touch = e.touches[0];
            return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
        }
        return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
    }, []);

    const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        setIsDrawing(true);
        setHasContent(true);
        setSaved(false);
    }, [getPos]);

    const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        e.preventDefault();
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    }, [isDrawing, getPos]);

    const stopDrawing = useCallback(() => {
        if (!isDrawing) return;
        setIsDrawing(false);
    }, [isDrawing]);

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        const dpr = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        setHasContent(false);
        setSaved(false);
    };

    const save = () => {
        const canvas = canvasRef.current;
        if (!canvas || !hasContent) return;

        // Create trimmed version 
        const base64 = canvas.toDataURL('image/png');
        if (base64) {
            onSave(base64);
            setSaved(true);
        }
    };

    return (
        <div className="space-y-4">
            <div className="relative rounded-xl border-2 border-dashed border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-900 overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="cursor-crosshair touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
                {!hasContent && !currentSignature && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-neutral-400 dark:text-neutral-600 text-sm">
                        Gunakan mouse atau jari untuk tanda tangan di sini
                    </div>
                )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={clear}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                    >
                        <Eraser className="h-4 w-4" /> Bersihkan
                    </button>
                    {hasContent && (
                        <button
                            type="button"
                            onClick={save}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold shadow-sm ${
                                saved 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            <Check className="h-4 w-4" /> {saved ? 'Tersimpan ✓' : 'Simpan Tanda Tangan'}
                        </button>
                    )}
                </div>

                {currentSignature && (
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-neutral-500 uppercase">Tanda Tangan Saat Ini:</span>
                        <div className="h-12 w-32 border border-neutral-200 bg-white p-1 rounded overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
                            <img src={currentSignature.startsWith('data:') ? currentSignature : `/storage/${currentSignature}`} alt="Tanda Tangan" className="h-full w-full object-contain" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
