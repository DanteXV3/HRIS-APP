import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Holiday } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface Props {
    holiday?: Holiday;
}

export default function HolidayForm({ holiday }: Props) {
    const isEditing = !!holiday;
    const { data, setData, post, put, processing, errors } = useForm({
        date: holiday?.date || '',
        name: holiday?.name || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Hari Libur', href: '/holidays' },
        { title: isEditing ? 'Edit Hari Libur' : 'Tambah Hari Libur', href: '#' },
    ];

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isEditing) {
            put(`/holidays/${holiday.id}`);
        } else {
            post('/holidays');
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? 'Edit Hari Libur' : 'Tambah Hari Libur'} />
            <div className="mx-auto w-full max-w-2xl p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                        {isEditing ? 'Edit Hari Libur' : 'Tambah Hari Libur'}
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {isEditing ? 'Perbarui informasi hari libur' : 'Tambahkan hari libur nasional baru'}
                    </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="date">Tanggal</Label>
                            <Input
                                id="date"
                                type="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                className={errors.date ? 'border-red-500' : ''}
                                required
                            />
                            {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Hari Libur</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="E.g. Hari Raya Idul Fitri"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={errors.name ? 'border-red-500' : ''}
                                required
                            />
                            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                                disabled={processing}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditing ? 'Simpan Perubahan' : 'Tambah Hari Libur'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
