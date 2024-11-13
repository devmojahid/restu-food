<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Admin\OptionsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use Exception;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Http\Response;

final class SocialAuthController extends Controller
{
    public function __construct(
        private readonly OptionsService $optionsService
    ) {}

    public function redirect(string $provider)
    {
        try {
            // Check if social login is globally enabled
            if (!$this->optionsService->get('social_login_enabled', false)) {
                return redirect()->route('login')
                    ->with('error', 'Social login is currently disabled.');
            }

            // Check if specific provider is enabled
            $isEnabled = $this->optionsService->get("{$provider}_login_enabled", false);
            if (!$isEnabled) {
                return redirect()->route('login')
                    ->with('error', 'This social login provider is not enabled.');
            }

            // Get credentials from options
            $clientId = $this->optionsService->get("{$provider}_client_id");
            $clientSecret = $this->optionsService->get("{$provider}_client_secret");
            
            if (!$clientId || !$clientSecret) {
                return redirect()->route('login')
                    ->with('error', 'This social login provider is not properly configured.');
            }

            // Configure provider dynamically
            config([
                "services.{$provider}.client_id" => $clientId,
                "services.{$provider}.client_secret" => $clientSecret,
                "services.{$provider}.redirect" => route('auth.social.callback', ['provider' => $provider], true)
            ]);

            // Get the redirect URL and return Inertia external redirect
            $redirectUrl = Socialite::driver($provider)->redirect()->getTargetUrl();
            return response('', Response::HTTP_CONFLICT)
                ->header('X-Inertia-Location', $redirectUrl);

        } catch (Exception $e) {
            Log::error('Social login redirect failed', [
                'provider' => $provider,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->route('login')
                ->with('error', 'Unable to connect with ' . ucfirst($provider));
        }
    }

    public function callback(string $provider): RedirectResponse
    {
        try {
            // Get credentials from options
            $clientId = $this->optionsService->get("{$provider}_client_id");
            $clientSecret = $this->optionsService->get("{$provider}_client_secret");

            // Configure provider dynamically
            config([
                "services.{$provider}.client_id" => $clientId,
                "services.{$provider}.client_secret" => $clientSecret,
                "services.{$provider}.redirect" => route('auth.social.callback', ['provider' => $provider], true)
            ]);

            $socialUser = Socialite::driver($provider)->user();
            
            $user = User::updateOrCreate([
                'email' => $socialUser->getEmail(),
            ], [
                'name' => $socialUser->getName() ?? explode('@', $socialUser->getEmail())[0],
                'password' => bcrypt(Str::random(16)),
                'email_verified_at' => now(),
                'status' => 'active',
            ]);

            // Store social provider info in user meta
            $user->setMeta('social_provider', $provider);
            $user->setMeta('social_id', $socialUser->getId());
            $user->setMeta('social_avatar', $socialUser->getAvatar());
            $user->setMeta('social_token', $socialUser->token);
            $user->setMeta('social_refresh_token', $socialUser->refreshToken);
            $user->setMeta('social_expires_in', $socialUser->expiresIn);
            
            // Log the successful social login
            $user->recordLoginAttempt(true);

            Auth::login($user);

            return redirect()->intended(route('dashboard'));
        } catch (Exception $e) {
            Log::error('Social login callback failed', [
                'provider' => $provider,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->route('login')
                ->with('error', 'Unable to login with ' . ucfirst($provider));
        }
    }
} 