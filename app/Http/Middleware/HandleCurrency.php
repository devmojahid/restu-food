<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\Currency;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Cache;

final class HandleCurrency
{
    public function handle(Request $request, Closure $next)
    {
        $currencyCode = Session::get('currency');

        if (!$currencyCode) {
            // Get default currency
            $defaultCurrency = Cache::remember('default_currency', 3600, function () {
                return Currency::where('is_default', true)->first();
            });

            if ($defaultCurrency) {
                Session::put('currency', $defaultCurrency->code);
                $currencyCode = $defaultCurrency->code;
            }
        }

        // Share currency data with all views
        $currencies = Cache::remember('enabled_currencies', 3600, function () {
            return Currency::where('is_enabled', true)
                ->orderBy('name')
                ->get();
        });

        $currentCurrency = $currencies->firstWhere('code', $currencyCode) ?? 
            $currencies->firstWhere('is_default', true);

        // Share with Inertia
        if (method_exists($request, 'inertia')) {
            $request->inertia()->share([
                'currencies' => $currencies,
                'currentCurrency' => $currentCurrency
            ]);
        }

        return $next($request);
    }
} 