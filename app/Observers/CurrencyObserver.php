<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Currency;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

final class CurrencyObserver
{
    public function created(Currency $currency): void
    {
        Log::info('Currency created', ['currency' => $currency->code]);
    }

    public function updated(Currency $currency): void
    {
        Log::info('Currency updated', [
            'currency' => $currency->code,
            'changes' => $currency->getChanges()
        ]);

        if ($currency->wasChanged(['exchange_rate', 'is_enabled', 'is_default'])) {
            Cache::tags(['currencies', 'products'])->flush();
        }
    }

    public function deleted(Currency $currency): void

    {
        Log::info('Currency deleted', ['currency' => $currency->code]);
    }
} 
