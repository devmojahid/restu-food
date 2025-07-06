<?php

declare(strict_types=1);

namespace Modules\SettingsManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\SettingsManagement\Services\OptionsService;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

final class OptionsController extends Controller
{
    public function __construct(
        private readonly OptionsService $optionsService
    ) {}

    public function email(): Response
    {
        try {
            // Clear cache to ensure fresh data
            $this->optionsService->flushCache();
            
            // Get email-specific options
            $emailOptions = $this->optionsService->getGroupKeyValues('email');
            // Default settings
            $defaults = [
                'mail_driver' => config('mail.default', 'smtp'),
                'mail_host' => config('mail.mailers.smtp.host', ''),
                'mail_port' => config('mail.mailers.smtp.port', '587'),
                'mail_username' => config('mail.mailers.smtp.username', ''),
                'mail_password' => config('mail.mailers.smtp.password', ''),
                'mail_encryption' => config('mail.mailers.smtp.encryption', 'tls'),
                'mail_from_address' => config('mail.from.address', ''),
                'mail_from_name' => config('mail.from.name', config('app.name')),
            ];

            // Merge defaults with saved options, preferring saved values when they exist and are not empty
            $mergedOptions = array_merge(
                $defaults,
                array_filter($emailOptions, fn($value) => !empty($value))
            );

            return Inertia::module('SettingsManagement::Email/Index', [
                'emailOptions' => $mergedOptions,
                'defaults' => $defaults
            ]);
        } catch (\Exception $e) {            
            return Inertia::module('SettingsManagement::Email/Index', [
                'emailOptions' => $defaults,
                'defaults' => $defaults,
                'error' => 'Failed to load email settings'
            ]);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'options' => ['required', 'array'],
            'options.*.key' => ['required', 'string'],
            'options.*.value' => ['nullable'],
            'group' => ['required', 'string'],
        ]);

        try {
            // Transform options array to key-value pairs
            $options = collect($validated['options'])->mapWithKeys(function ($item) {
                return [$item['key'] => $item['value'] ?? null];
            })->toArray();

            // Save options
            $this->optionsService->setMany($options, $validated['group']);

            // Clear cache after saving
            $this->optionsService->flushCache();

            return back()->with('success', 'Settings saved successfully');
        } catch (\Exception $e) {
            Log::error('Failed to save settings', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->with('error', 'Failed to save settings');
        }
    }

    public function auth(): Response
    {
        try {
            $this->optionsService->flushCache();
            
            $authOptions = $this->optionsService->getGroupKeyValues('auth');
            
            $defaults = [
                'social_login_enabled' => false,
                'google_login_enabled' => false,
                'facebook_login_enabled' => false,
                'github_login_enabled' => false,
                'linkedin_login_enabled' => false,
                'captcha_enabled' => false,
                'captcha_type' => 'v2_invisible',
            ];

            $mergedOptions = array_merge(
                $defaults,
                array_filter($authOptions, fn($value) => !empty($value))
            );

            return Inertia::module('SettingsManagement::Auth/Index', [
                'authOptions' => $mergedOptions,
                'defaults' => $defaults
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load auth settings', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return Inertia::module('SettingsManagement::Auth/Index', [
                'authOptions' => $defaults,
                'defaults' => $defaults,
                'error' => 'Failed to load authentication settings'
            ]);
        }
    }
} 