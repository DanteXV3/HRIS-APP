import { Link, usePage } from '@inertiajs/react';
import { Building2, Briefcase, LayoutGrid, MapPin, Users, Receipt, CalendarClock, FileText, DoorOpen } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem, User } from '@/types';

export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const role = auth.user.role;
    const isAdmin = role === 'admin';

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    if (isAdmin) {
        mainNavItems.push(
            {
                title: 'Data Karyawan',
                href: '/employees',
                icon: Users,
            },
            {
                title: 'Data Absensi',
                href: '/attendances',
                icon: CalendarClock,
            },
            {
                title: 'Payroll & Slip Gaji',
                href: '/payrolls',
                icon: Receipt,
            },
            {
                title: 'Departemen',
                href: '/departments',
                icon: Building2,
            },
            {
                title: 'Jabatan',
                href: '/positions',
                icon: Briefcase,
            },
            {
                title: 'Shift Kerja',
                href: '/shifts',
                icon: CalendarClock,
            },
            {
                title: 'Perusahaan',
                href: '/work-locations',
                icon: MapPin,
            },
        );
    } else {
        // Employee-only visible items
        mainNavItems.push(
            {
                title: 'Profil Saya',
                href: '/profile',
                icon: Users,
            },
            {
                title: 'Absensi Saya',
                href: '/my-attendance',
                icon: CalendarClock,
            },
            {
                title: 'Gaji Saya',
                href: '/my-payroll',
                icon: Receipt,
            },
        );
    }

    // Leave & Exit — visible to all roles
    mainNavItems.push(
        {
            title: 'Pengajuan Cuti',
            href: '/leaves',
            icon: FileText,
        },
        {
            title: 'Form Keluar',
            href: '/exit-permits',
            icon: DoorOpen,
        },
    );

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
