<?php

declare(strict_types=1);

namespace App\Services;

use App\Services\Admin\OptionsService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

final class ReCaptchaService
{
    public function __construct(
        private readonly OptionsService $optionsService
    ) {}

    public function verify(?string $token): bool
    {
        try {
            if (!$this->isEnabled()) {
                return true;
            }

            if (empty($token)) {
                return false;
            }

            $secretKey = $this->getSecretKey();
            if (empty($secretKey)) {
                Log::warning('ReCaptcha secret key not configured');
                return false;
            }

            $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => $secretKey,
                'response' => $token,
                'remoteip' => request()->ip()
            ]);

            $result = $response->json();

            if (!$response->successful() || !($result['success'] ?? false)) {
                Log::warning('ReCaptcha verification failed', [
                    'response' => $result,
                    'token' => substr($token, 0, 10) . '...',
                    'ip' => request()->ip()
                ]);
                return false;
            }

            // For v3, check score
            if ($this->getCaptchaType() === 'v3' && ($result['score'] ?? 0) < 0.5) {
                Log::warning('ReCaptcha score too low', [
                    'score' => $result['score'] ?? 0,
                    'token' => substr($token, 0, 10) . '...',
                    'ip' => request()->ip()
                ]);
                return false;
            }

            return true;
        } catch (\Exception $e) {
            Log::error('ReCaptcha verification error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return false;
        }
    }

    public function isEnabled(): bool
    {
        $enabled = $this->optionsService->get('captcha_enabled');
        return filter_var($enabled, FILTER_VALIDATE_BOOLEAN);
    }

    public function getSiteKey(): ?string
    {
        $siteKey = $this->optionsService->get('recaptcha_site_key');
        return $this->isValidSiteKey($siteKey) ? (string) $siteKey : null;
    }

    public function getCaptchaType(): string
    {
        $type = $this->optionsService->get('captcha_type');
        return in_array($type, ['v2_invisible', 'v2_checkbox', 'v3']) 
            ? (string) $type 
            : 'v2_invisible';
    }

    private function getSecretKey(): ?string
    {
        $secretKey = $this->optionsService->get('recaptcha_secret_key');
        return !empty($secretKey) ? (string) $secretKey : null;
    }

    public function validateConfiguration(): array
    {
        $errors = [];

        if (!$this->isEnabled()) {
            return $errors;
        }

        $siteKey = $this->getSiteKey();
        if (empty($siteKey)) {
            $errors[] = 'ReCAPTCHA site key is not configured';
        } elseif (!$this->isValidSiteKey($siteKey)) {
            $errors[] = 'Invalid ReCAPTCHA site key format';
        }

        $secretKey = $this->getSecretKey();
        if (empty($secretKey)) {
            $errors[] = 'ReCAPTCHA secret key is not configured';
        }

        $type = $this->getCaptchaType();
        if (!in_array($type, ['v2_invisible', 'v2_checkbox', 'v3'])) {
            $errors[] = 'Invalid ReCAPTCHA type configured';
        }

        return $errors;
    }

    public function getConfigurationStatus(): array
    {
        return [
            'enabled' => $this->isEnabled(),
            'configured' => empty($this->validateConfiguration()),
            'type' => $this->getCaptchaType(),
            'errors' => $this->validateConfiguration(),
        ];
    }

    private function isValidSiteKey(string $siteKey): bool
    {
        // Basic validation for reCAPTCHA site key format
        return (bool) preg_match('/^[0-9A-Za-z_-]+$/', $siteKey);
    }
} 