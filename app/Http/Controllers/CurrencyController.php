<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Currency;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;
use App\Services\Admin\CurrencyService;

final class CurrencyController extends Controller
{
    public function __construct(
        private readonly CurrencyService $currencyService
    ) {}

    public function switch(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'currency' => ['required', 'string', 'exists:currencies,code']
            ]);

            $currency = $this->currencyService->switchCurrency($validated['currency']);

            Cache::forget("current_currency_{$currency->code}");
            Cache::forget('enabled_currencies');

            return redirect()
                ->back()
                ->with('toast', [
                    'type' => 'success',
                    'message' => "Currency switched to {$currency->name}"
                ]);
        } catch (\Exception $e) {
            Log::error('Error switching currency: ' . $e->getMessage());
            
            return redirect()
                ->back()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Unable to switch currency. Please try again.'
                ]);
        }
    }
} 