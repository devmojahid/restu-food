<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Admin\OptionsService;
use App\Services\ReCaptchaService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

class RegisteredUserController extends Controller
{
    public function __construct(
        private readonly OptionsService $optionsService,
        private readonly ReCaptchaService $reCaptchaService
    ) {}

    /**
     * Display the registration view.
     */
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

            return Inertia::render('Auth/Register', [
                'enabledProviders' => $enabledProviders,
                'captchaEnabled' => $captchaEnabled && $captchaConfig['configured'],
                'captchaSiteKey' => $captchaEnabled ? $this->reCaptchaService->getSiteKey() : null,
                'captchaType' => $this->reCaptchaService->getCaptchaType(),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load register page', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return Inertia::render('Auth/Register', [
                'enabledProviders' => ['social_login_enabled' => false],
                'captchaEnabled' => false,
            ]);
        }
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            if ($this->reCaptchaService->isEnabled()) {
                $configStatus = $this->reCaptchaService->getConfigurationStatus();
                
                if (!$configStatus['configured']) {
                    Log::error('ReCAPTCHA configuration error', [
                        'errors' => $configStatus['errors']
                    ]);
                    throw ValidationException::withMessages([
                        'captcha' => 'ReCAPTCHA verification is not properly configured.'
                    ]);
                }

                if (!$this->reCaptchaService->verify($request->input('captcha_token'))) {
                    throw ValidationException::withMessages([
                        'captcha' => 'Invalid reCAPTCHA response. Please try again.'
                    ]);
                }
            }

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ]);

            DB::beginTransaction();
            try {
                $emailVerificationEnabled = $this->optionsService->get('email_verification_enabled', true);

                $user = User::create([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'password' => Hash::make($validated['password']),
                    'status' => 'active',
                    'email_verified_at' => $emailVerificationEnabled ? null : now(),
                ]);

                if (method_exists($user, 'assignRole')) {
                    $user->assignRole('Customer');
                }

                if ($emailVerificationEnabled) {
                    event(new Registered($user));
                }

                DB::commit();

                Auth::login($user);

                if ($emailVerificationEnabled && !$user->hasVerifiedEmail()) {
                    return redirect()->route('verification.notice');
                }

                return redirect()->intended(route('dashboard'));
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            Log::error('Registration failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            throw ValidationException::withMessages([
                'email' => 'Registration failed. Please try again.'
            ]);
        }
    }
}
