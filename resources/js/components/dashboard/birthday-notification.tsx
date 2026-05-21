import React from 'react';
import { Cake, PartyPopper } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Employee } from '@/types';

interface BirthdayNotificationProps {
    birthdays: Array<{
        id: number;
        nama: string;
        photo: string | null;
        department?: {
            name: string;
        };
    }>;
}

export function BirthdayNotification({ birthdays }: BirthdayNotificationProps) {
    if (birthdays.length === 0) return null;

    return (
        <div className="animate-in fade-in slide-in-from-top-4 duration-700 ease-out">
            <Card className="overflow-hidden border-none bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 shadow-lg ring-1 ring-white/20 dark:from-pink-500/20 dark:via-purple-500/20 dark:to-indigo-500/20">
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 shadow-md ring-4 ring-pink-500/20">
                            <Cake className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                                Ulang Tahun Hari Ini! <PartyPopper className="h-4 w-4 text-amber-500 animate-bounce" />
                            </h3>
                            <div className="flex flex-wrap gap-4 mt-2">
                                {birthdays.map((person) => (
                                    <div key={person.id} className="flex items-center gap-3 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-xl ring-1 ring-black/5 dark:ring-white/10 shadow-sm transition-all hover:scale-105">
                                        <Avatar className="h-10 w-10 border-2 border-white dark:border-neutral-700">
                                            <AvatarImage src={person.photo ? `/storage/${person.photo}` : undefined} alt={person.nama} />
                                            <AvatarFallback className="bg-gradient-to-br from-pink-400 to-rose-400 text-white text-xs font-bold">
                                                {person.nama.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate max-w-[150px]">
                                                {person.nama}
                                            </span>
                                            {person.department && (
                                                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-medium">
                                                    {person.department.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
