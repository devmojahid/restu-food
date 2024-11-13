<?php

declare(strict_types=1);

namespace App\Providers;

use App\Services\Admin\OptionsService;
use Illuminate\Support\ServiceProvider;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\URL;

final class SocialAuthServiceProvider extends ServiceProvider
{
    protected array $providers = ['google', 'facebook', 'github', 'linkedin'];

    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Defer the configuration until after all routes are registered
        $this->app->booted(function () {
            try {
                $optionsService = app(OptionsService::class);

                foreach ($this->providers as $provider) {
                    $clientId = $optionsService->get("{$provider}_client_id");
                    $clientSecret = $optionsService->get("{$provider}_client_secret");

                    if ($clientId && $clientSecret) {
                        $callbackUrl = route('auth.social.callback', ['provider' => $provider], true);
                        
                        config([
                            "services.{$provider}.client_id" => $clientId,
                            "services.{$provider}.client_secret" => $clientSecret,
                            "services.{$provider}.redirect" => $callbackUrl
                        ]);
                    }
                }
            } catch (\Exception $e) {
                report($e);
            }
        });
    }
} 