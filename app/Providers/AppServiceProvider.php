<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Illuminate\Support\Facades\URL;
use App\Models\Currency;
use App\Observers\CurrencyObserver;

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
        // URL::forceScheme('https');

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
    }
}
