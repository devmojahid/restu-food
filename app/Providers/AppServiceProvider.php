<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Illuminate\Support\Facades\URL;

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

        // Share flash messages with all views
        Inertia::share('flash', function () {
            return [
                'success' => Session::get('success'),
                'error' => Session::get('error'),
                'warning' => Session::get('warning'),
                'info' => Session::get('info'),
                'toast' => Session::get('toast'),
                // System messages
                'status' => Session::get('status'),
                'message' => Session::get('message'),
                // Custom data
                'data' => Session::get('flash_data'),
            ];
        });
    }
}
