<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Currency;
use Illuminate\Database\Seeder;

final class CurrencySeeder extends Seeder
{
    public function run(): void
    {
        $currencies = [
            [
                'code' => 'USD',
                'name' => 'US Dollar',
                'symbol' => '$',
                'exchange_rate' => 1.00,
                'decimal_places' => 2,
                'decimal_separator' => '.',
                'thousand_separator' => ',',
                'symbol_position' => 'before',
                'space_between' => false,
                'is_default' => true,
                'is_enabled' => true,
            ],
            [
                'code' => 'EUR',
                'name' => 'Euro',
                'symbol' => '€',
                'exchange_rate' => 0.85,
                'decimal_places' => 2,
                'decimal_separator' => ',',
                'thousand_separator' => '.',
                'symbol_position' => 'after',
                'space_between' => true,
                'is_default' => false,
                'is_enabled' => true,
            ],
            // Add more default currencies as needed
        ];

        foreach ($currencies as $currency) {
            Currency::firstOrCreate(
                ['code' => $currency['code']],
                $currency
            );
        }
    }
} 