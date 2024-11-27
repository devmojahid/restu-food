<?php

declare(strict_types=1);

namespace App\Traits;

use App\Models\Currency;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Session;

trait HasCurrency
{
    public function formatPrice(float $amount, ?string $currencyCode = null): string
    {
        $currency = $this->getCurrency($currencyCode);
        return $currency->format($amount);
    }

    public function convertPrice(float $amount, ?string $currencyCode = null): float
    {
        $currency = $this->getCurrency($currencyCode);
        return round($amount * $currency->exchange_rate, $currency->decimal_places);
    }

    protected function getCurrency(?string $currencyCode = null): Currency
    {
        $code = $currencyCode ?? Session::get('currency');
        
        return Cache::remember("currency_{$code}", 3600, function () use ($code) {
            return Currency::where('code', $code)
                ->where('is_enabled', true)
                ->first() ?? Currency::where('is_default', true)->firstOrFail();
        });
    }
} 