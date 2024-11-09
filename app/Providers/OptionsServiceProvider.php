<?php

declare(strict_types=1);

namespace App\Providers;

use App\Services\Admin\OptionsService;
use Illuminate\Support\ServiceProvider;

final class OptionsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton('options', function () {
            return new OptionsService();
        });
    }
} 