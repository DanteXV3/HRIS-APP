import { Link } from '@inertiajs/react';

interface Props {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export function Pagination({ links }: Props) {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-wrap items-center justify-center border-t border-neutral-200 dark:border-neutral-800 px-4 py-3 sm:px-6 gap-1">
            {links.map((link, i) => (
                <Link
                    key={i}
                    href={link.url ?? '#'}
                    className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                        link.active
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                    } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}
