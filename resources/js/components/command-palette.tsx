import React, { useEffect, useState, useCallback } from 'react';
import { Command } from 'cmdk';
import { router } from '@inertiajs/react';
import { 
    Search, 
    LayoutDashboard, 
    Users, 
    CheckSquare, 
    Settings, 
    LogOut,
    Plus,
    Clock,
    UserCircle,
    FileText
} from 'lucide-react';

export default function CommandPalette() {
    const [open, setOpen] = useState(false);

    // Toggle the menu when ⌘K or Ctrl+K is pressed
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = useCallback((command: () => void) => {
        setOpen(false);
        command();
    }, []);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-neutral-950/20 backdrop-blur-sm transition-all animate-in fade-in duration-300 px-4">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 animate-in zoom-in-95 duration-200">
                <Command className="flex h-full w-full flex-col overflow-hidden">
                    <div className="flex items-center border-b border-neutral-100 px-4 dark:border-neutral-800" cmdk-input-wrapper="">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <Command.Input
                            placeholder="Apa yang ingin Anda lakukan? (Cari menu, aksi, dll...)"
                            className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    
                    <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                        <Command.Empty className="py-6 text-center text-sm text-neutral-500">Hasil tidak ditemukan.</Command.Empty>
                        
                        <Command.Group heading="Navigasi Utama" className="px-2 py-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                            <Item onSelect={() => runCommand(() => router.get('/dashboard'))}>
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </Item>
                            <Item onSelect={() => runCommand(() => router.get('/employees'))}>
                                <Users className="mr-2 h-4 w-4" />
                                <span>Manajemen Karyawan</span>
                            </Item>
                            <Item onSelect={() => runCommand(() => router.get('/tasks'))}>
                                <CheckSquare className="mr-2 h-4 w-4" />
                                <span>Daftar Tugas</span>
                            </Item>
                            <Item onSelect={() => runCommand(() => router.get('/profile'))}>
                                <UserCircle className="mr-2 h-4 w-4" />
                                <span>Profil Saya</span>
                            </Item>
                        </Command.Group>

                        <Command.Separator className="h-px bg-neutral-100 dark:bg-neutral-800 my-2" />

                        <Command.Group heading="Aksi Cepat" className="px-2 py-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                            <Item onSelect={() => runCommand(() => router.get('/tasks'))}>
                                <Plus className="mr-2 h-4 w-4" />
                                <span>Buat Tugas Baru</span>
                            </Item>
                            <Item onSelect={() => runCommand(() => router.get('/attendances/my'))}>
                                <Clock className="mr-2 h-4 w-4" />
                                <span>Absensi Hari Ini</span>
                            </Item>
                            <Item onSelect={() => runCommand(() => router.get('/payment-requests/create'))}>
                                <Plus className="mr-2 h-4 w-4" />
                                <span>Pengajuan Pembayaran</span>
                            </Item>
                        </Command.Group>

                        <Command.Separator className="h-px bg-neutral-100 dark:bg-neutral-800 my-2" />

                        <Command.Group heading="Sistem & Lainnya" className="px-2 py-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                            <Item onSelect={() => runCommand(() => router.get('/settings/general'))}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Pengaturan Aplikasi</span>
                            </Item>
                            <Item onSelect={() => runCommand(() => router.post('/logout'))}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Keluar Sistem</span>
                            </Item>
                        </Command.Group>
                    </Command.List>
                </Command>

                <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50 px-4 py-2 text-[10px] text-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50">
                    <div className="flex gap-4">
                        <span><kbd className="font-sans">↑↓</kbd> Navigasi</span>
                        <span><kbd className="font-sans">↵</kbd> Pilih</span>
                    </div>
                    <span><kbd className="font-sans">esc</kbd> Tutup</span>
                </div>
            </div>
        </div>
    );
}

function Item({ children, onSelect }: { children: React.ReactNode; onSelect: () => void }) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="flex cursor-pointer select-none items-center rounded-lg px-2 py-2.5 text-sm font-medium outline-none aria-selected:bg-neutral-100 aria-selected:text-neutral-900 dark:aria-selected:bg-neutral-800 dark:aria-selected:text-neutral-50 group transition-colors"
        >
            {children}
        </Command.Item>
    );
}
