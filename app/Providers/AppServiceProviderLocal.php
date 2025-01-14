<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Illuminate\Support\Facades\URL;
use App\Models\Currency;
use App\Observers\CurrencyObserver;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AppServiceProviderLocal extends ServiceProvider
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
        // if (config('app.env') !== 'local') {
        //     URL::forceScheme('https');
        // }

        // Share errors with all views
        Inertia::share([
            'errors' => function () {
                return Session::get('errors')
                    ? Session::get('errors')->getBag('default')->getMessages()
                    : (object) [];
            },
        ]);

        Inertia::share([
            'flash' => function () {
                return [
                    'success' => fn () => Session::get('success'),
                    'error' => fn () => Session::get('error'),
                    'warning' => fn () => Session::get('warning'),
                    'info' => fn () => Session::get('info'),
                    'message' => fn () => Session::get('message'),
                    'data' => fn () => Session::get('flash_data'),
                ];
            },
        ]);

        Currency::observe(CurrencyObserver::class);

        // Add this to enable query logging in development
        if (config('app.debug')) {
            DB::listen(function($query) {
                Log::info(
                    $query->sql,
                    [
                        'bindings' => $query->bindings,
                        'time' => $query->time
                    ]
                );
            });
        }
    }
}
