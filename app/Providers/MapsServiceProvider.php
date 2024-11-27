<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;

final class MapsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(
            __DIR__.'/../../config/maps.php', 'maps'
        );
    }

    public function boot(): void
    {
        View::composer('app', function ($view) {
            $view->with('googleMapsConfig', [
                'key' => config('maps.google.api_key'),
                'libraries' => config('maps.google.libraries'),
                'defaultCenter' => config('maps.google.default_center'),
                'defaultZoom' => config('maps.google.default_zoom'),
            ]);
        });
    }
} 