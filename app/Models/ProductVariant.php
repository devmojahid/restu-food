<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\HasFiles;
use App\Traits\HandlesFiles;
use Illuminate\Support\Collection;

final class ProductVariant extends Model
{
    use HasFiles, HandlesFiles;

    public const COLLECTION_THUMBNAIL = 'thumbnail';

    protected $fillable = [
        'product_id',
        'name',
        'sku',
        'price',
        'sale_price',
        'stock',
        'enabled',
        'virtual',
        'downloadable',
        'manage_stock',
        'stock_status',
        'weight',
        'length',
        'width',
        'height',
        'description',
        'attributes',
        'sort_order',
        'metadata',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'stock' => 'integer',
        'enabled' => 'boolean',
        'virtual' => 'boolean',
        'downloadable' => 'boolean',
        'manage_stock' => 'boolean',
        'weight' => 'decimal:2',
        'length' => 'decimal:2',
        'width' => 'decimal:2',
        'height' => 'decimal:2',
        'attributes' => 'array',
        'metadata' => 'json',
    ];

    protected $appends = ['thumbnail'];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(ProductInventoryMovement::class);
    }

    public function updateStock(int $quantity, string $operation = 'subtract', ?string $reason = null): void
    {
        $stockBefore = $this->stock;
        
        if ($operation === 'add') {
            $this->increment('stock', $quantity);
        } else {
            $this->decrement('stock', $quantity);
        }

        $this->update([
            'stock_status' => $this->stock > 0 ? 'instock' : 'outofstock'
        ]);

        // Record stock movement
        $this->stockMovements()->create([
            'quantity' => $quantity,
            'type' => $operation === 'add' ? 'in' : 'out',
            'reason' => $reason,
            'stock_before' => $stockBefore,
            'stock_after' => $this->stock,
        ]);
    }

    public function getThumbnailAttribute(): ?File
    {
        return $this->getFileFrom(self::COLLECTION_THUMBNAIL);
    }

    public function toArray(): array
    {
        $array = parent::toArray();
        
        // Ensure thumbnail is always included
        if (!isset($array['thumbnail'])) {
            $array['thumbnail'] = $this->thumbnail;
        }

        return $array;
    }
}
