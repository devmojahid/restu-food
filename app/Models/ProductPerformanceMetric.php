<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class ProductPerformanceMetric extends Model
{
    protected $fillable = [
        'product_id',
        'date',
        'views',
        'unique_views',
        'cart_adds',
        'wishlist_adds',
        'orders',
        'revenue',
        'conversion_rate',
    ];

    protected $casts = [
        'date' => 'date',
        'views' => 'integer',
        'unique_views' => 'integer',
        'cart_adds' => 'integer',
        'wishlist_adds' => 'integer',
        'orders' => 'integer',
        'revenue' => 'decimal:2',
        'conversion_rate' => 'decimal:2',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
} 