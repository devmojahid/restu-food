<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Admin\ZoneService;

class ZoneServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(ZoneService::class, function ($app) {
            return new ZoneService();
        });

        $this->mergeConfigFrom(
            __DIR__.'/../../config/zones.php', 'zones'
        );
    }

    public function boot()
    {
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../../config/zones.php' => config_path('zones.php'),
            ], 'zones-config');
        }
    }
} 