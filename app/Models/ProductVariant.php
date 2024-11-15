<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class ProductVariant extends Model
{
    protected $fillable = [
        'product_id',
        'name',
        'sku',
        'price',
        'stock_quantity',
        'weight',
        'length',
        'width',
        'height',
        'is_active',
        'sort_order',
        'metadata',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock_quantity' => 'integer',
        'weight' => 'decimal:2',
        'length' => 'decimal:2',
        'width' => 'decimal:2',
        'height' => 'decimal:2',
        'is_active' => 'boolean',
        'metadata' => 'json',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductVariantImage::class);
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(ProductInventoryMovement::class);
    }

    public function updateStock(int $quantity, string $operation = 'subtract', ?string $reason = null): void
    {
        $stockBefore = $this->stock_quantity;
        
        if ($operation === 'add') {
            $this->increment('stock_quantity', $quantity);
        } else {
            $this->decrement('stock_quantity', $quantity);
        }

        // Record stock movement
        $this->stockMovements()->create([
            'quantity' => $quantity,
            'type' => $operation === 'add' ? 'in' : 'out',
            'reason' => $reason,
            'stock_before' => $stockBefore,
            'stock_after' => $this->stock_quantity,
        ]);
    }
}
