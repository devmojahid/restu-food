<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\Admin\OptionsService;
use App\Services\ReCaptchaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;

class AuthenticatedSessionController extends Controller
{
    public function __construct(
        private readonly OptionsService $optionsService,
        private readonly ReCaptchaService $reCaptchaService
    ) {}

    public function create(): Response
    {
        try {
            $enabledProviders = [
                'social_login_enabled' => $this->optionsService->get('social_login_enabled', false),
                'google_login_enabled' => $this->optionsService->get('google_login_enabled', false),
                'facebook_login_enabled' => $this->optionsService->get('facebook_login_enabled', false),
                'github_login_enabled' => $this->optionsService->get('github_login_enabled', false),
                'linkedin_login_enabled' => $this->optionsService->get('linkedin_login_enabled', false),
            ];

            $captchaEnabled = $this->reCaptchaService->isEnabled();
            $captchaConfig = $this->reCaptchaService->getConfigurationStatus();

            return Inertia::render('Auth/Login', [
                'canResetPassword' => Route::has('password.request'),
                'status' => session('status'),
                'enabledProviders' => $enabledProviders,
                'captchaEnabled' => $captchaEnabled && $captchaConfig['configured'],
                'captchaSiteKey' => $captchaEnabled ? $this->reCaptchaService->getSiteKey() : null,
                'captchaType' => $this->reCaptchaService->getCaptchaType(),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load login page', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return Inertia::render('Auth/Login', [
                'canResetPassword' => Route::has('password.request'),
                'enabledProviders' => ['social_login_enabled' => false],
                'captchaEnabled' => false,
            ]);
        }
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
