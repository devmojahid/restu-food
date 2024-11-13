<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class ProductBundleItem extends Model
{
    protected $fillable = [
        'product_bundle_id',
        'bundled_product_id',
        'quantity',
        'discount_amount',
        'discount_type',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'discount_amount' => 'decimal:2',
    ];

    public function bundle(): BelongsTo
    {
        return $this->belongsTo(ProductBundle::class, 'product_bundle_id');
    }

    public function bundledProduct(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'bundled_product_id');
    }

    public function calculateDiscount(float $originalPrice): float
    {
        return $this->discount_type === 'percentage'
            ? ($originalPrice * ($this->discount_amount / 100))
            : $this->discount_amount;
    }
} 