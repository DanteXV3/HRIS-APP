import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SettingsLayout from '@/layouts/settings/layout';
import InputError from '@/components/input-error';
import { ImagePlus, Loader2 } from 'lucide-react';

interface Props {
    appName: string;
    appLogo: string | null;
}

export default function GeneralSettings({ appName, appLogo }: Props) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        app_name: appName || '',
        app_logo: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(appLogo ? `/storage/${appLogo}` : null);
    const fileInput = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('app_logo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/settings/general', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <SettingsLayout>
            <Head title="General Settings" />

            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Pengaturan Aplikasi</h3>
                    <p className="text-sm text-muted-foreground">
                        Sesuaikan identitas aplikasi HRIS Anda.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    <Card className="border-none shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                        <CardHeader>
                            <CardTitle className="text-base">Informasi Dasar</CardTitle>
                            <CardDescription>
                                Nama aplikasi akan muncul di tab browser dan sidebar.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="app_name">Nama Aplikasi</Label>
                                <Input
                                    id="app_name"
                                    value={data.app_name}
                                    onChange={(e) => setData('app_name', e.target.value)}
                                    placeholder="Contoh: My HRIS"
                                />
                                <InputError message={errors.app_name} />
                            </div>

                            <div className="space-y-4">
                                <Label>Logo Aplikasi</Label>
                                <div className="flex items-center gap-6">
                                    <div 
                                        onClick={() => fileInput.current?.click()}
                                        className="relative flex h-24 w-24 cursor-pointer items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-blue-500 transition-all overflow-hidden"
                                    >
                                        {preview ? (
                                            <img src={preview} alt="Logo Preview" className="h-full w-full object-contain p-2" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-1 text-neutral-500">
                                                <ImagePlus className="h-6 w-6" />
                                                <span className="text-[10px]">Upload</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            ref={fileInput}
                                            className="hidden"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium">Ubah Logo</p>
                                        <p className="text-xs text-muted-foreground">
                                            Format yang didukung: PNG, JPG, JPEG (Maks. 2MB).
                                            Kami merekomendasikan logo dengan aspek rasio square.
                                        </p>
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => fileInput.current?.click()}
                                            className="mt-2"
                                        >
                                            Pilih File
                                        </Button>
                                    </div>
                                </div>
                                <InputError message={errors.app_logo} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan Perubahan
                        </Button>

                        {recentlySuccessful && (
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium animate-in fade-in slide-in-from-left-2">
                                Tersimpan!
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </SettingsLayout>
    );
}
