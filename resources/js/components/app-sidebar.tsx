import { Link, usePage } from '@inertiajs/react';
import { Building2, Briefcase, LayoutGrid, MapPin, Users, Receipt, CalendarClock, FileText, DoorOpen, Edit3 } from 'lucide-react';
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
    const { auth } = usePage<any>().props;
    const user = auth?.user;
    const isAdmin = user?.role === 'admin';

    const canViewEmployees = isAdmin || user?.can?.includes('employee.view');
    const canViewAttendance = isAdmin || user?.can?.includes('attendance.view_others');
    const canViewPayroll = isAdmin || user?.can?.includes('payroll.view');
    const canManageDept = isAdmin || user?.can?.includes('department.manage');
    const canManagePosition = isAdmin || user?.can?.includes('position.manage');
    const canManageShift = isAdmin || user?.can?.includes('shift.manage');
    const canManageLocation = isAdmin || user?.can?.includes('location.manage');
    const canViewWorkingLocation = isAdmin || user?.can?.includes('working_location.view');
    const canManageHoliday = isAdmin || user?.can?.includes('holiday.manage');
    const canManageCorrection = isAdmin || user?.can?.includes('attendance.correction.manage');

    const canCreateOvertime = isAdmin || user?.can?.includes('overtime.create');
    const canApproveOvertime = isAdmin || user?.can?.includes('overtime.first_approval') || user?.can?.includes('overtime.second_approval') || user?.can?.includes('overtime.view_all');
    const canApprovePR = isAdmin || user?.can?.some((c: string) => c.startsWith('pr.approve.'));

    // 1. Menu Saya (Always visible, items might depend on role/permissions)
    const tentangSayaItems: NavItem[] = [
        { title: 'Profil Saya', href: '/profile', icon: Users },
        { title: 'Absensi Saya', href: '/my-attendance', icon: CalendarClock },
        { title: 'Gaji Saya', href: '/my-payroll', icon: Receipt },
        { title: 'Pengajuan Cuti', href: '/leaves', icon: FileText },
        { title: 'Form Keluar', href: '/exit-permits', icon: DoorOpen },
    ];

    tentangSayaItems.push({ title: 'Koreksi Absensi', href: '/attendance-corrections', icon: Edit3 });

    if (isAdmin || user?.can?.includes('pr.create')) {
        tentangSayaItems.push({ title: 'Payment Request', href: '/payment-requests', icon: Receipt });
    }

    if (canCreateOvertime || canApproveOvertime) {
        tentangSayaItems.push({ title: 'Form Lembur', href: '/overtimes', icon: CalendarClock });
    }

    if (user?.can?.includes('kpi.view_own')) {
        tentangSayaItems.push({ title: 'Evaluasi KPI', href: '/kpi-evaluations', icon: FileText });
    }
    
    tentangSayaItems.push({ title: 'Surat Peringatan', href: '/warning-letters', icon: FileText });

    // 2. Management Karyawan
    const managementItems: NavItem[] = [];
    if (canViewEmployees) managementItems.push({ title: 'Data Karyawan', href: '/employees', icon: Users });
    if (canViewAttendance) managementItems.push({ title: 'Data Absensi', href: '/attendances', icon: CalendarClock });
    if (canManageCorrection) managementItems.push({ title: 'Persetujuan Koreksi', href: '/attendance-corrections', icon: Edit3 });
    if (isAdmin || user?.can?.includes('kpi.view_others')) managementItems.push({ title: 'Evaluasi KPI', href: '/kpi-evaluations', icon: FileText });
    if (isAdmin || user?.can?.includes('sp.view_others')) managementItems.push({ title: 'Surat Peringatan', href: '/warning-letters', icon: FileText });
    if (canViewPayroll) managementItems.push({ title: 'Payroll & Slip Gaji', href: '/payrolls', icon: Receipt });

    // Add Administrative views for Leave, Exit Permits, and Overtime
    const canApproveLeave = isAdmin || auth.user.can?.includes('leave.first_approval') || auth.user.can?.includes('leave.second_approval');
    const canViewOthersExit = isAdmin || auth.user.can?.includes('exit_permit.view_others');

    if (canApproveLeave) {
        managementItems.push({ title: 'Data Pengajuan Cuti', href: '/leaves', icon: FileText });
    }
    if (canViewOthersExit) {
        managementItems.push({ title: 'Data Form Keluar', href: '/exit-permits', icon: DoorOpen });
    }
    if (canApproveOvertime) {
        managementItems.push({ title: 'Data Pengajuan Lembur', href: '/overtimes', icon: CalendarClock });
    }
    if (canApprovePR) {
        managementItems.push({ title: 'Data Payment Request', href: '/payment-requests', icon: Receipt });
    }

    // 3. Setting
    const settingItems: NavItem[] = [];
    if (canManageDept) settingItems.push({ title: 'Departemen', href: '/departments', icon: Building2 });
    if (canManagePosition) settingItems.push({ title: 'Jabatan', href: '/positions', icon: Briefcase });
    if (canManageShift) settingItems.push({ title: 'Shift Kerja', href: '/shifts', icon: CalendarClock });
    if (canManageLocation) settingItems.push({ title: 'Data Perusahaan', href: '/work-locations', icon: Building2 });
    if (canViewWorkingLocation) settingItems.push({ title: 'Lokasi Kerja', href: '/working-locations', icon: MapPin });
    if (canManageHoliday) settingItems.push({ title: 'Hari Libur', href: '/holidays', icon: CalendarClock });

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Menu Saya',
            href: '#',
            icon: Users,
            items: tentangSayaItems,
        },
    ];

    if (managementItems.length > 0) {
        mainNavItems.push({
            title: 'Management Karyawan',
            href: '#',
            icon: Briefcase,
            items: managementItems,
        });
    }

    if (settingItems.length > 0) {
        mainNavItems.push({
            title: 'Setting',
            href: '#',
            icon: Building2,
            items: settingItems,
        });
    }

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
