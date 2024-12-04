<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\HasFiles;
use App\Traits\HandlesFiles;
use App\Traits\HasPrice;
use Illuminate\Support\Facades\Auth;

final class ProductAddon extends Model
{
    use SoftDeletes, HasFiles, HandlesFiles, HasPrice;

    public const COLLECTION_THUMBNAIL = 'thumbnail';

    protected $fillable = [
        'user_id',
        'restaurant_id',
        'name',
        'slug',
        'description',
        'price',
        'cost_per_item',
        'stock_quantity',
        'stock_status',
        'is_active',
        'sort_order',
        'meta',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'cost_per_item' => 'decimal:2',
        'stock_quantity' => 'integer',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'meta' => 'json',
    ];

    protected $appends = ['thumbnail'];

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'product_addon_category_items', 'addon_id', 'category_id')
            ->select('categories.*')
            ->distinct()
            ->where('type', 'addon')
            ->withPivot('sort_order')
            ->withTimestamps()
            ->orderByPivot('sort_order');
    }

    public function getThumbnailAttribute(): ?File
    {
        return $this->getFileFrom(self::COLLECTION_THUMBNAIL);
    }

    public function updateStock(int $quantity, string $operation = 'subtract'): void
    {
        if ($operation === 'add') {
            $this->increment('stock_quantity', $quantity);
        } else {
            $this->decrement('stock_quantity', $quantity);
        }

        $this->update([
            'stock_status' => $this->stock_quantity > 0 ? 'in_stock' : 'out_of_stock'
        ]);
    }

    public function canManage(): bool
    {
        $user = Auth::user();
        return $user->hasRole('Admin') || 
               $this->user_id === $user->id || 
               $this->restaurant_id === $user->restaurant_id;
    }

    public function scopeForCurrentUser($query)
    {
        return $query->when(!Auth::user()->hasRole('Admin'), function ($q) {
            $q->where(function($subQ) {
                $subQ->where('user_id', Auth::id())
                     ->orWhere('restaurant_id', Auth::user()->restaurant_id);
            });
        });
    }

    public function getFormattedPriceAttribute(): string
    {
        return number_format($this->price, 2);
    }

    public function getStockLabelAttribute(): string
    {
        return match($this->stock_status) {
            'in_stock' => 'In Stock',
            'out_of_stock' => 'Out of Stock',
            'low_stock' => 'Low Stock',
            default => 'Unknown'
        };
    }
} 