import AppLogoIcon from '@/components/app-logo-icon';
import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    const { appName, appLogo } = usePage<any>().props;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-white dark:bg-neutral-800 text-sidebar-primary-foreground overflow-hidden">
                {appLogo ? (
                    <img src={`/storage/${appLogo}`} alt={appName} className="h-full w-full object-contain p-1" />
                ) : (
                    <div className="bg-sidebar-primary w-full h-full flex items-center justify-center">
                        <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                    </div>
                )}
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {appName || 'HRIS - APP'}
                </span>
            </div>
        </>
    );
}
