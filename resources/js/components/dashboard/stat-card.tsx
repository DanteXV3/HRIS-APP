import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedCounter from '../animated-counter';

interface StatCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
    color: string;
}

export function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
    return (
        <motion.div 
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="relative group overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-sidebar-border dark:bg-neutral-900"
        >
            {/* Background flourish */}
            <div className={`absolute -right-4 -bottom-4 h-24 w-24 rounded-full opacity-5 blur-2xl transition-all group-hover:opacity-10 ${color}`} />
            
            <div className="flex items-center justify-between relative z-10">
                <div>
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
                    <div className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        <AnimatedCounter to={value} />
                    </div>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-lg group-hover:rotate-12 transition-transform ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </motion.div>
    );
}
