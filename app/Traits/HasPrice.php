<?php

declare(strict_types=1);

namespace App\Traits;

use App\Models\Currency;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Session;

trait HasPrice
{
    use HasCurrency;

    public function price(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                $currency = $this->getCurrency();
                return $this->convertPrice((float) $value);
            }
        );
    }

    public function formattedPrice(): Attribute
    {
        return Attribute::make(
            get: function () {
                return $this->formatPrice($this->price);
            }
        );
    }

    public function getPriceInCurrency(?string $currencyCode = null): float
    {
        return $this->convertPrice($this->price, $currencyCode);
    }

    public function getFormattedPriceInCurrency(?string $currencyCode = null): string
    {
        return $this->formatPrice($this->price, $currencyCode);
    }
} 