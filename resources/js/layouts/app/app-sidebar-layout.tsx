import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import CommandPalette from '@/components/command-palette';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success, {
                position: 'top-right',
                duration: 4000,
                style: {
                    borderRadius: '12px',
                    background: '#333',
                    color: '#fff',
                },
            });
        }
        if (flash.error) {
            toast.error(flash.error, {
                position: 'top-right',
                duration: 5000,
                style: {
                    borderRadius: '12px',
                    background: '#ef4444',
                    color: '#fff',
                },
            });
        }
    }, [flash]);

    return (
        <AppShell variant="sidebar">
            <Toaster />
            <CommandPalette />
            <AppSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <AnimatePresence mode="wait">
                    <motion.div
                        key={usePage().url}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="flex-1"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </AppContent>
        </AppShell>
    );
}
