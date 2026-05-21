import { animate, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface AnimatedCounterProps {
    from?: number;
    to: number;
    duration?: number;
    className?: string;
    formatter?: (value: number) => string;
}

export default function AnimatedCounter({ 
    from = 0, 
    to, 
    duration = 2, 
    className = "",
    formatter = (v) => Math.floor(v).toLocaleString()
}: AnimatedCounterProps) {
    const nodeRef = useRef<HTMLSpanElement>(null);
    const isInView = useInView(nodeRef, { once: true, margin: "-50px" });

    useEffect(() => {
        if (!isInView) return;

        const node = nodeRef.current;
        if (!node) return;

        const controls = animate(from, to, {
            duration,
            ease: "easeOut",
            onUpdate(value) {
                node.textContent = formatter(value);
            },
        });

        return () => controls.stop();
    }, [from, to, duration, isInView, formatter]);

    return (
        <span ref={nodeRef} className={className}>
            {formatter(from)}
        </span>
    );
}
