<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Auth\Access\AuthorizationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withCommands([
        \App\Console\Commands\NotifyDueTasks::class,
        \App\Console\Commands\RemindClockOut::class,
        \App\Console\Commands\MapX601Users::class,
        \App\Console\Commands\SyncX601Attendance::class,
    ])
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*');
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);
    })
    ->withSchedule(function ($schedule) {
        $schedule->command('app:send-daily-digest')->dailyAt('09:00');
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->respond(function ($response, Throwable $exception, Request $request) {
            if (! app()->isProduction()) {
                return $response;
            }

            if ($response->getStatusCode() === 403) {
                return back()->with([
                    'error' => 'Anda tidak memiliki akses ke halaman ini.',
                ]);
            }

            if ($response->getStatusCode() === 404) {
                return back()->with([
                    'error' => 'Data tidak ditemukan.',
                ]);
            }

            return $response;
        });

        $exceptions->render(function (\Illuminate\Auth\Access\AuthorizationException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Anda tidak memiliki izin untuk melakukan tindakan ini.'], 403);
            }
            return back()->with('error', 'Anda tidak memiliki izin untuk melakukan tindakan ini.');
        });
    })->create();
