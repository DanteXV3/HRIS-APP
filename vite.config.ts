import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        VitePWA({
            base: '/',
            strategies: 'injectManifest',
            srcDir: 'resources/js',
            filename: 'sw.js',
            outDir: 'public', // Set the output directory to public/ root
            registerType: 'autoUpdate',
            injectRegister: false,
            manifest: {
                name: 'HRIS Attendance & Payroll',
                short_name: 'HRIS',
                description: 'Human Resource Information System for Attendance and Payroll',
                theme_color: '#3b82f6',
                background_color: '#ffffff',
                display: 'standalone',
                orientation: 'portrait',
                start_url: '/',
                scope: '/',
                icons: [
                    {
                        src: '/icon-192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/icon-512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            },
            injectManifest: {
                injectionPoint: 'self.__WB_MANIFEST',
            },
            devOptions: {
                enabled: true,
                type: 'module',
            }
        }),
    ],
    esbuild: {
        jsx: 'automatic',
    },
});
