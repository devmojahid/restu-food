<?php

declare(strict_types=1);

namespace App\Providers;

use App\Services\Admin\UserMetaService;
use Illuminate\Support\ServiceProvider;

final class UserMetaServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton('user-meta', function ($app) {
            return new UserMetaService();
        });
    }
} 