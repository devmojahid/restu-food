<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Currency extends Model
{
    protected $fillable = [
        'code',
        'name',
        'symbol',
        'exchange_rate',
        'decimal_places',
        'decimal_separator',
        'thousand_separator',
        'symbol_position',
        'space_between',
        'is_default',
        'is_enabled'
    ];

    protected $casts = [
        'exchange_rate' => 'decimal:10',
        'decimal_places' => 'integer',
        'is_default' => 'boolean',
        'is_enabled' => 'boolean',
        'space_between' => 'boolean'
    ];

    public function rateHistory(): HasMany
    {
        return $this->hasMany(CurrencyRateHistory::class);
    }

    public function format(float $amount): string
    {
        $formattedNumber = number_format(
            $amount * $this->exchange_rate,
            $this->decimal_places,
            $this->decimal_separator,
            $this->thousand_separator
        );

        $space = $this->space_between ? ' ' : '';
        
        return $this->symbol_position === 'before'
            ? "{$this->symbol}{$space}{$formattedNumber}"
            : "{$formattedNumber}{$space}{$this->symbol}";
    }
} 