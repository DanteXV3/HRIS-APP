<?php

namespace App\Providers;

use App\Models\Employee;
use App\Models\Setting;
use App\Observers\EmployeeObserver;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (str_starts_with(config('app.url'), 'https://')) {
            URL::forceScheme('https');
        }

        $this->configureDefaults();

        // Register model observers
        Employee::observe(EmployeeObserver::class);

        Gate::define('admin', function ($user) {
            return $user->role === 'admin';
        });

        if (!app()->runningInConsole() && Schema::hasTable('settings')) {
            $appName = Setting::get('app_name');
            if ($appName) {
                config(['app.name' => $appName]);
            }
        }

        // Run one-time leave balance recalculation for 2025 and 2026
        if (!app()->runningInConsole() && Schema::hasTable('leave_balances')) {
            $lockFile = storage_path('leave_recalc.lock');
            if (!file_exists($lockFile)) {
                try {
                    $annualLeaveType = \App\Models\LeaveType::where('name', 'Cuti Tahunan')->first();
                    if ($annualLeaveType) {
                        $service = app(\App\Services\LeaveBalanceService::class);
                        $employees = \App\Models\Employee::all();
                        foreach ([2025, 2026] as $year) {
                            foreach ($employees as $employee) {
                                $entitlement = $service->calculateAnnualLeaveEntitlement($employee, $year);
                                $usedDays = \App\Models\LeaveRequest::where('employee_id', $employee->id)
                                    ->where('leave_type_id', $annualLeaveType->id)
                                    ->where('status', 'approved')
                                    ->whereYear('tanggal_mulai', $year)
                                    ->sum('jumlah_hari');

                                \App\Models\LeaveBalance::updateOrCreate(
                                    [
                                        'employee_id' => $employee->id,
                                        'leave_type_id' => $annualLeaveType->id,
                                        'year' => $year,
                                    ],
                                    [
                                        'total_days' => $entitlement,
                                        'used_days' => $usedDays,
                                    ]
                                );
                            }
                        }
                    }
                    file_put_contents($lockFile, 'done');
                } catch (\Exception $e) {
                    // Ignore errors during boot
                }
            }
        }
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(function () {
            $rule = Password::min(8);

            return app()->isProduction()
                ? $rule->mixedCase()->letters()->numbers()->symbols()->uncompromised()
                : $rule;
        });
    }
}
