<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\Admin\CurrencyService;
use Illuminate\Console\Command;

final class UpdateCurrencyRates extends Command
{
    protected $signature = 'currency:update-rates';
    protected $description = 'Update currency exchange rates from API';

    public function handle(CurrencyService $currencyService): int
    {
        $this->info('Updating currency exchange rates...');

        try {
            $currencyService->updateExchangeRates();
            $this->info('Exchange rates updated successfully.');
            return self::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Error updating exchange rates: ' . $e->getMessage());
            return self::FAILURE;
        }
    }
} 