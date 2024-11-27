<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class CurrencyRateHistory extends Model
{
    protected $table = 'currency_rates_history';

    protected $fillable = [
        'currency_id',
        'rate',
        'source'
    ];

    protected $casts = [
        'rate' => 'decimal:10'
    ];

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }
} 