<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\Currency;
use App\Services\Admin\CurrencyService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

final class ShareCurrencyData
{
    public function __construct(
        private readonly CurrencyService $currencyService
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        $currencyCode = Session::get('currency');

        if (!$currencyCode) {
            $defaultCurrency = $this->currencyService->getDefaultCurrency();
            Session::put('currency', $defaultCurrency->code);
            $currencyCode = $defaultCurrency->code;
        }

        // Get enabled currencies with caching
        $currencies = Cache::remember('enabled_currencies', 3600, function () {
            return Currency::where('is_enabled', true)
                ->orderBy('name')
                ->select([
                    'id', 'code', 'name', 'symbol', 'exchange_rate',
                    'decimal_places', 'decimal_separator', 'thousand_separator',
                    'symbol_position', 'space_between', 'is_default'
                ])
                ->get();
        });

        $currentCurrency = Cache::remember("current_currency_{$currencyCode}", 3600, function () use ($currencies, $currencyCode) {
            return $currencies->firstWhere('code', $currencyCode) ?? 
                $currencies->firstWhere('is_default', true);
        });

        // Share with Inertia
        Inertia::share([
            'currencies' => $currencies,
            'currentCurrency' => $currentCurrency,
            'currencyConfig' => [
                'defaultCode' => $currencies->firstWhere('is_default', true)?->code,
                'format' => [
                    'decimals' => $currentCurrency->decimal_places,
                    'decimal_separator' => $currentCurrency->decimal_separator,
                    'thousand_separator' => $currentCurrency->thousand_separator,
                    'symbol_position' => $currentCurrency->symbol_position,
                    'space_between' => $currentCurrency->space_between,
                ],
            ],
        ]);

        return $next($request);
    }
} 