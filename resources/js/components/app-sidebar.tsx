import { Link, usePage } from '@inertiajs/react';
import { Building2, Briefcase, LayoutGrid, MapPin, Users, Receipt, CalendarClock, FileText, DoorOpen, Edit3, FileCheck, ClipboardList, ShoppingCart, ShieldCheck, Brain } from 'lucide-react';
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
    const canViewMSR = isAdmin || user?.can?.includes('msr.view_all');
    const canCreateMSR = isAdmin || user?.can?.includes('msr.create');
    const canApproveMSR = isAdmin || 
        user?.can?.includes('msr.approve_supervisor') || 
        user?.can?.includes('msr.approve_manager') || 
        user?.can?.includes('msr.approve_hrd') || 
        user?.can?.includes('msr.approve_procurement') || 
        user?.can?.includes('msr.approve_ga') || 
        user?.can?.includes('msr.approve_finance');

    // 1. Menu Saya (Always visible, items might depend on role/permissions)
    const tentangSayaItems: NavItem[] = [
        { title: 'Profil Saya', href: '/profile', icon: Users },
        { title: 'Absensi Saya', href: '/my-attendance', icon: CalendarClock },
        { title: 'Gaji Saya', href: '/my-payroll', icon: Receipt },
        { title: 'Pengajuan Cuti', href: '/leaves', icon: FileText },
        { title: 'Form Keluar', href: '/exit-permits', icon: DoorOpen },
        { title: 'Form SPPD', href: '/sppd', icon: FileText },
        { title: 'Daftar Tugas', href: '/tasks', icon: ClipboardList },
    ];

    tentangSayaItems.push({ title: 'Koreksi Absensi', href: '/attendance-corrections', icon: Edit3 });

    if (isAdmin || user?.can?.includes('pr.create')) {
        tentangSayaItems.push({ title: 'Payment Request', href: '/payment-requests', icon: Receipt });
    }

    if (canCreateMSR) {
        tentangSayaItems.push({ title: 'Material & Service Request', href: '/msr', icon: ShoppingCart });
    }

    if (canCreateOvertime || canApproveOvertime) {
        tentangSayaItems.push({ title: 'Form Lembur', href: '/overtimes', icon: CalendarClock });
    }

    if (user?.can?.includes('kpi.view_own')) {
        tentangSayaItems.push({ title: 'Evaluasi KPI', href: '/kpi-evaluations', icon: FileText });
    }
    
    tentangSayaItems.push({ title: 'Surat Peringatan', href: '/warning-letters', icon: FileText });
    tentangSayaItems.push({ title: 'Kontrak Saya', href: '/my-contract', icon: FileCheck });

    // 2. Management Karyawan
    const managementItems: NavItem[] = [];
    if (canViewEmployees) managementItems.push({ title: 'Data Karyawan', href: '/employees', icon: Users });
    if (canViewAttendance) managementItems.push({ title: 'Data Absensi', href: '/attendances', icon: CalendarClock });
    if (canManageCorrection) managementItems.push({ title: 'Persetujuan Koreksi', href: '/attendance-corrections', icon: Edit3 });
    if (isAdmin || user?.can?.includes('kpi.view_others')) managementItems.push({ title: 'Evaluasi KPI', href: '/kpi-evaluations', icon: FileText });
    if (isAdmin || user?.can?.includes('sp.view_others')) managementItems.push({ title: 'Surat Peringatan', href: '/warning-letters', icon: FileText });
    if (canViewPayroll) managementItems.push({ title: 'Payroll & Slip Gaji', href: '/payrolls', icon: Receipt });
    if (isAdmin || user?.can?.includes('contract.view') || user?.can?.includes('contract.create')) {
        managementItems.push({ title: 'Data Kontrak (PKWT)', href: '/contracts', icon: FileCheck });
    }
    const canManageSKB = isAdmin || user?.can?.includes('skb.view') || user?.can?.includes('skb.create') || user?.can?.includes('skb.edit') || user?.can?.includes('skb.delete');
    const canManagePaklaring = isAdmin || user?.can?.includes('paklaring.view') || user?.can?.includes('paklaring.create') || user?.can?.includes('paklaring.edit') || user?.can?.includes('paklaring.delete');
    const canManageHrForms = isAdmin || canManageSKB || canManagePaklaring
        || user?.can?.includes('appointment.view') || user?.can?.includes('appointment.create')
        || user?.can?.includes('offering.view') || user?.can?.includes('offering.create')
        || user?.can?.includes('transfer.view') || user?.can?.includes('transfer.create')
        || user?.can?.includes('reference.view') || user?.can?.includes('reference.create')
        || user?.can?.includes('termination.view') || user?.can?.includes('termination.create')
        || user?.can?.includes('promotion.view') || user?.can?.includes('promotion.create');
    
    if (canManageHrForms) {
        managementItems.push({ title: 'Surat HR (HR Forms)', href: '/hr-forms', icon: FileText });
    }

    // Add Administrative views for Leave, Exit Permits, and Overtime
    const canApproveLeave = isAdmin || auth.user.can?.includes('leave.first_approval') || auth.user.can?.includes('leave.second_approval');
    const canViewOthersExit = isAdmin || auth.user.can?.includes('exit_permit.view_others');

    if (canApproveLeave) {
        managementItems.push({ title: 'Data Pengajuan Cuti', href: '/leave-management', icon: FileText });
    }
    if (canViewOthersExit) {
        managementItems.push({ title: 'Data Form Keluar', href: '/exit-permits', icon: DoorOpen });
    }
    if (canApproveOvertime) {
        managementItems.push({ title: 'Data Pengajuan Lembur', href: '/overtime-management', icon: CalendarClock });
    }
    if (canApprovePR) {
        managementItems.push({ title: 'Data Payment Request', href: '/payment-requests', icon: Receipt });
    }

    if (canViewMSR || canApproveMSR) {
        managementItems.push({ title: 'Data Material & Service Request', href: '/msr', icon: ShoppingCart });
    }

    // 3. Setting
    const settingItems: NavItem[] = [];
    if (canManageDept) settingItems.push({ title: 'Departemen', href: '/departments', icon: Building2 });
    if (canManagePosition) settingItems.push({ title: 'Jabatan', href: '/positions', icon: Briefcase });
    if (canManageShift) settingItems.push({ title: 'Shift Kerja', href: '/shifts', icon: CalendarClock });
    if (canManageLocation) settingItems.push({ title: 'Data Perusahaan', href: '/work-locations', icon: Building2 });
    if (canViewWorkingLocation) settingItems.push({ title: 'Lokasi Kerja', href: '/working-locations', icon: MapPin });
    if (canManageHoliday) settingItems.push({ title: 'Hari Libur', href: '/holidays', icon: CalendarClock });

    // 4. Cost Control
    const costControlItems: NavItem[] = [];
    if (isAdmin || user?.can?.includes('cost_control.view')) {
        costControlItems.push({ title: 'Item List And Budgeting', href: '/cost-control/budget-items', icon: ClipboardList });
    }
    if (isAdmin || user?.can?.includes('cost_control.view_summary')) {
        costControlItems.push({ title: 'Summary Budgeting', href: '/cost-control/summary-budgeting', icon: FileText });
    }
    if (isAdmin || user?.can?.includes('expense_estimate.create') || user?.can?.includes('expense_estimate.edit_cc') || user?.can?.includes('expense_estimate.edit_finance')) {
        costControlItems.push({ title: 'Estimasi Pengeluaran', href: '/cost-control/expense-estimates', icon: FileText });
    }

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

    const canViewRecruitment = isAdmin || user?.can?.includes('view-recruitment');
    const canCreateRecruitment = isAdmin || user?.can?.includes('create-recruitment');
    const canViewJobOpening = isAdmin || user?.can?.includes('view-job-opening');
    const canCreateJobOpening = isAdmin || user?.can?.includes('create-job-opening');
    const recruitmentItems: NavItem[] = [];
    
    if (canViewJobOpening || canCreateJobOpening) {
        recruitmentItems.push({ title: 'Lowongan Kerja', href: '/job-openings', icon: Briefcase });
    }
    
    if (canViewRecruitment || canCreateRecruitment) {
        recruitmentItems.push({ title: 'Hasil Tes Kepribadian', href: '/recruitment', icon: ClipboardList });
    }
    if (canCreateRecruitment) {
        recruitmentItems.push({ title: 'Tes DISC (Baru)', href: '/recruitment/disc/create', icon: Edit3 });
        recruitmentItems.push({ title: 'Tes MBTI (Baru)', href: '/recruitment/mbti/create', icon: Edit3 });
    }

    if (recruitmentItems.length > 0) {
        mainNavItems.push({
            title: 'Recruitment',
            href: '#',
            icon: Brain,
            items: recruitmentItems,
        });
    }

    // 2.5 Daily Worker Management
    const dailyWorkerItems: NavItem[] = [];
    if (isAdmin || user?.can?.includes('daily_worker.manage_local') || user?.can?.includes('daily_worker.manage_all')) {
        dailyWorkerItems.push({ title: 'Daftar Daily Worker', href: '/daily-workers', icon: Users });
    }
    if (isAdmin || user?.can?.includes('daily_worker_attendance.manage_local') || user?.can?.includes('daily_worker_attendance.manage_all')) {
        dailyWorkerItems.push({ title: 'DW Absensi', href: '/daily-worker-attendance', icon: CalendarClock });
    }
    if (isAdmin || user?.can?.includes('daily_worker_activity.manage_local') || user?.can?.includes('daily_worker_activity.manage_all')) {
        dailyWorkerItems.push({ title: 'Daily Worker Activity Report', href: '/daily-worker-activities', icon: ClipboardList });
    }
    if (isAdmin || user?.can?.includes('daily_worker_payroll.manage_local') || user?.can?.includes('daily_worker_payroll.manage_all')) {
        dailyWorkerItems.push({ title: 'Daily Worker Payroll', href: '/daily-worker-payrolls', icon: Receipt });
    }

    if (dailyWorkerItems.length > 0) {
        mainNavItems.push({
            title: 'Daily Worker',
            href: '#',
            icon: Briefcase,
            items: dailyWorkerItems,
        });
    }

    // 5. Security
    const securityItems: NavItem[] = [];
    const canViewSecuritySettings = isAdmin || user?.can?.includes('security_report.manage_settings');
    const canViewSecurityReports = isAdmin || user?.can?.includes('security_report.view_all') || user?.can?.includes('security_report.create');

    if (canViewSecurityReports) {
        securityItems.push({ title: 'Security Reports', href: '/security/reports', icon: ClipboardList });
    }
    if (canViewSecuritySettings) {
        securityItems.push({ title: 'Security Settings', href: '/security/patrol-areas', icon: MapPin });
    }

    if (securityItems.length > 0) {
        mainNavItems.push({
            title: 'Security',
            href: '#',
            icon: ShieldCheck,
            items: securityItems,
        });
    }

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

    if (costControlItems.length > 0) {
        mainNavItems.push({
            title: 'Cost Control',
            href: '#',
            icon: Receipt,
            items: costControlItems,
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
