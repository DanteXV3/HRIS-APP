import { Head, usePage, Link } from '@inertiajs/react';
import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, Employee } from '@/types';
import { AttendanceWidget } from '@/components/dashboard/attendance-widget';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { StatsGrid } from '@/components/dashboard/stats-grid';
import { EvaluationReminders } from '@/components/dashboard/evaluation-reminders';
import { TaskReminders } from '@/components/dashboard/task-reminders';
import { BirthdayNotification } from '@/components/dashboard/birthday-notification';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

interface Props {
    stats: any;
    userRole: string;
    employee: Employee | null;
    todayAttendance: any | null;
    dashboardConfig: {
        attendance_widget?: boolean;
        quick_actions?: boolean;
        personal_stats?: boolean;
        approval_stats?: boolean;
        admin_stats?: boolean;
    };
    evaluationReminders?: any[];
    taskReminders?: any[];
    birthdays?: any[];
    activeSecurityReport?: any;
}

export default function Dashboard() {
    const { stats, employee, todayAttendance, dashboardConfig, evaluationReminders = [], taskReminders = [], birthdays = [], activeSecurityReport } = usePage<{ props: Props }>().props as unknown as Props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                        Selamat Datang! 👋
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Berikut ringkasan data HRIS Anda.
                    </p>
                </div>

                <BirthdayNotification birthdays={birthdays} />

                {/* Active Security Report Widget */}
                {activeSecurityReport && (
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 shadow-lg shadow-blue-500/20 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/20 rounded-xl">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Active Patrol Draft Found</h3>
                                <p className="text-blue-100 text-sm mt-1">
                                    You have a pending security patrol checklist for {activeSecurityReport.patrol_date}. 
                                </p>
                            </div>
                        </div>
                        <Link 
                            href={`/security/reports/${activeSecurityReport.id}`}
                            className="shrink-0 bg-white text-blue-600 hover:bg-neutral-50 px-5 py-2.5 rounded-xl font-bold transition-colors inline-flex justify-center items-center gap-2"
                        >
                            Resume Patrol
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}

                {/* Modular Widgets based on Config */}
                {dashboardConfig?.attendance_widget && (
                    <AttendanceWidget employee={employee} todayAttendance={todayAttendance} />
                )}
                
                {dashboardConfig?.quick_actions && (
                    <QuickActions employee={employee} />
                )}

                <EvaluationReminders reminders={evaluationReminders} />
                <TaskReminders reminders={taskReminders} />

                <StatsGrid stats={stats} config={dashboardConfig} />
            </div>
        </AppLayout>
    );
}
