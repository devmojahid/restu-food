<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\Currency;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\ServiceProvider;

final class CurrencyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton('currency', function () {
            return Cache::remember('default_currency', 3600, function () {
                return Currency::where('is_default', true)->first();
            });
        });
    }

    public function boot(): void
    {
        $this->publishes([
            __DIR__.'/../../config/currency.php' => config_path('currency.php'),
        ], 'currency-config');
    }
} 