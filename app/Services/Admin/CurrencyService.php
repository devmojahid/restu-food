<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\Currency;
use App\Models\CurrencyRateHistory;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

final class CurrencyService
{
    private const CACHE_KEY = 'currencies';
    private const CACHE_TTL = 3600; // 1 hour
    private const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/USD';

    public function getAll(): array
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return Currency::where('is_enabled', true)
                ->orderBy('is_default', 'desc')
                ->orderBy('code')
                ->get()
                ->toArray();
        });
    }

    public function store(array $data): Currency
    {
        DB::beginTransaction();
        try {
            // Validate and normalize exchange rate
            $data['exchange_rate'] = (float) $data['exchange_rate'];
            $this->validateExchangeRate($data['exchange_rate']);
            
            // Handle default currency logic
            if ($data['is_default'] ?? false) {
                Currency::where('is_default', true)
                    ->update(['is_default' => false]);
            } elseif (!Currency::exists()) {
                // Make first currency default
                $data['is_default'] = true;
            }

            // Ensure enabled status
            $data['is_enabled'] = $data['is_enabled'] ?? true;

            // Create currency
            $currency = Currency::create($data);

            // Record initial rate in history if not default rate
            if ($currency->exchange_rate != 1) {
                $this->recordRateHistory($currency, 'manual');
            }
            
            DB::commit();
            $this->clearCache();
            
            return $currency;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating currency: ' . $e->getMessage(), [
                'data' => $data,
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public function update(Currency $currency, array $data): Currency
    {
        DB::beginTransaction();
        try {
            $oldRate = $currency->exchange_rate;

            if ($data['is_default'] ?? false) {
                Currency::where('id', '!=', $currency->id)
                    ->where('is_default', true)
                    ->update(['is_default' => false]);
            }

            // Prevent disabling default currency
            if ($currency->is_default && !($data['is_enabled'] ?? true)) {
                throw new \Exception('Cannot disable default currency.');
            }

            $currency->update($data);

            // Record rate change in history if rate changed
            if ($oldRate != $currency->exchange_rate) {
                CurrencyRateHistory::create([
                    'currency_id' => $currency->id,
                    'rate' => $currency->exchange_rate,
                    'source' => 'manual'
                ]);
            }
            
            DB::commit();
            $this->clearCache();
            
            return $currency;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating currency: ' . $e->getMessage());
            throw $e;
        }
    }

    public function updateExchangeRates(): void
    {
        DB::beginTransaction();
        try {
            $response = Http::timeout(30)->get(self::EXCHANGE_RATE_API);
            
            if (!$response->successful()) {
                throw new \Exception('Failed to fetch exchange rates: ' . $response->body());
            }

            $data = $response->json();
            if (!isset($data['rates']) || !is_array($data['rates'])) {
                throw new \Exception('Invalid response format from exchange rate API');
            }

            $rates = $data['rates'];
            $updatedCount = 0;
            
            Currency::where('code', '!=', 'USD')->each(function ($currency) use ($rates, &$updatedCount) {
                if (isset($rates[$currency->code])) {
                    $newRate = (float) $rates[$currency->code];
                    
                    if (abs($newRate - $currency->exchange_rate) > 0.000001) {
                        $currency->update(['exchange_rate' => $newRate]);
                        $this->recordRateHistory($currency, 'api');
                        $updatedCount++;
                    }
                }
            });

            DB::commit();
            $this->clearCache();
            
            Log::info('Exchange rates updated successfully', ['updated_count' => $updatedCount]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating exchange rates: ' . $e->getMessage());
            throw $e;
        }
    }

    private function clearCache(): void
    {
        $cacheKeys = [
            'enabled_currencies',
            'default_currency',
            'current_currency',
            'currency_stats',
        ];

        foreach ($cacheKeys as $key) {
            Cache::forget($key);
        }

        // Clear individual currency caches
        Currency::all()->each(function ($currency) {
            Cache::forget("currency_code_{$currency->code}");
        });
    }

    private function validateExchangeRate(float $rate): void 
    {
        if ($rate <= 0) {
            throw new \InvalidArgumentException('Exchange rate must be greater than zero');
        }
    }

    public function getCurrencyByCode(string $code): ?Currency
    {
        return Cache::remember("currency_code_{$code}", self::CACHE_TTL, function () use ($code) {
            return Currency::where('code', $code)
                ->where('is_enabled', true)
                ->first();
        });
    }

    public function getDefaultCurrency(): Currency
    {
        return Cache::remember('default_currency', self::CACHE_TTL, function () {
            $currency = Currency::where('is_default', true)->first();
            
            if (!$currency) {
                throw new \RuntimeException('No default currency found');
            }
            
            return $currency;
        });
    }

    public function convertAmount(float $amount, string $fromCurrency, string $toCurrency): float
    {
        $from = $this->getCurrencyByCode($fromCurrency);
        $to = $this->getCurrencyByCode($toCurrency);
        
        if (!$from || !$to) {
            throw new \InvalidArgumentException('Invalid currency code');
        }
        
        // Convert to base currency (USD) first, then to target currency
        $inUSD = $amount / $from->exchange_rate;
        return $inUSD * $to->exchange_rate;
    }

    private function recordRateHistory(Currency $currency, string $source): void
    {
        try {
            $currency->rateHistory()->create([
                'rate' => $currency->exchange_rate,
                'source' => $source
            ]);
        } catch (\Exception $e) {
            Log::error('Error recording rate history: ' . $e->getMessage(), [
                'currency' => $currency->code,
                'rate' => $currency->exchange_rate,
                'source' => $source
            ]);
            throw $e;
        }
    }

    public function getRateHistory(Currency $currency, ?int $limit = null): array
    {
        $query = $currency->rateHistory()
            ->orderBy('created_at', 'desc');
            
        if ($limit) {
            $query->limit($limit);
        }
        
        return $query->get()->toArray();
    }

    public function getStats(): array
    {
        return Cache::remember('currency_stats', self::CACHE_TTL, function () {
            return [
                'total' => Currency::count(),
                'active' => Currency::where('is_enabled', true)->count(),
                'inactive' => Currency::where('is_enabled', false)->count(),
                'default' => Currency::where('is_default', true)->value('code'),
                'last_rate_update' => CurrencyRateHistory::latest()->value('created_at'),
            ];
        });
    }

    public function getCurrentCurrency(): Currency
    {
        $code = Session::get('currency');
        
        return Cache::remember("current_currency_{$code}", self::CACHE_TTL, function () use ($code) {
            return Currency::where('code', $code)
                ->where('is_enabled', true)
                ->first() ?? $this->getDefaultCurrency();
        });
    }

    public function getEnabled(): \Illuminate\Database\Eloquent\Collection
    {
        return Cache::remember('enabled_currencies', self::CACHE_TTL, function () {
            return Currency::where('is_enabled', true)
                ->orderBy('name')
                ->get();
        });
    }

    public function switchCurrency(string $code): Currency
    {
        $currency = Currency::where('code', $code)
            ->where('is_enabled', true)
            ->firstOrFail();

        Session::put('currency', $currency->code);
        $this->clearCache();

        return $currency;
    }

    public function formatPrice(float $amount, ?string $currencyCode = null): string
    {
        $currency = $currencyCode 
            ? $this->getCurrencyByCode($currencyCode)
            : $this->getCurrentCurrency();

        if (!$currency) {
            $currency = $this->getDefaultCurrency();
        }

        return $currency->format($amount);
    }

    public function convertAndFormat(float $amount, string $fromCurrency, ?string $toCurrency = null): string
    {
        $toCurrency = $toCurrency ?? Session::get('currency');
        $convertedAmount = $this->convertAmount($amount, $fromCurrency, $toCurrency);
        return $this->formatPrice($convertedAmount, $toCurrency);
    }
} 