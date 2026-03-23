import { Head, usePage } from '@inertiajs/react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, Employee } from '@/types';
import { AttendanceWidget } from '@/components/dashboard/attendance-widget';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { StatsGrid } from '@/components/dashboard/stats-grid';
import { EvaluationReminders } from '@/components/dashboard/evaluation-reminders';

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
}

export default function Dashboard() {
    const { stats, employee, todayAttendance, dashboardConfig, evaluationReminders = [] } = usePage<{ props: Props }>().props as unknown as Props;

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

                {/* Modular Widgets based on Config */}
                {dashboardConfig?.attendance_widget && (
                    <AttendanceWidget employee={employee} todayAttendance={todayAttendance} />
                )}
                
                {dashboardConfig?.quick_actions && (
                    <QuickActions employee={employee} />
                )}

                <EvaluationReminders reminders={evaluationReminders} />

                <StatsGrid stats={stats} config={dashboardConfig} />
            </div>
        </AppLayout>
    );
}
