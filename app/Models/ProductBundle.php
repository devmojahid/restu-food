<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class ProductBundle extends Model
{
    protected $fillable = [
        'product_id',
        'name',
        'description',
        'discount_amount',
        'discount_type',
        'min_quantity',
        'max_quantity',
        'starts_at',
        'ends_at',
        'is_active',
    ];

    protected $casts = [
        'discount_amount' => 'decimal:2',
        'min_quantity' => 'integer',
        'max_quantity' => 'integer',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function bundleItems(): HasMany
    {
        return $this->hasMany(ProductBundleItem::class);
    }

    public function isActive(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $now = now();
        
        if ($this->starts_at && $this->ends_at) {
            return $now->between($this->starts_at, $this->ends_at);
        }

        return true;
    }

    public function calculateDiscount(float $originalPrice): float
    {
        return $this->discount_type === 'percentage'
            ? ($originalPrice * ($this->discount_amount / 100))
            : $this->discount_amount;
    }
} 