<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Collection;
use App\Traits\HasFiles;
use App\Traits\HandlesFiles;
use App\Traits\HasPrice;
use App\Models\Currency;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Cache;
use App\Traits\HasReviews;

final class Product extends Model
{
    use HasFactory, SoftDeletes, HasFiles, HandlesFiles, HasPrice, HasReviews;

    public const COLLECTION_THUMBNAIL = 'thumbnail';
    public const COLLECTION_GALLERY = 'gallery';

    protected $fillable = [
        'restaurant_id',
        'name',
        'slug',
        'sku',
        'description',
        'short_description',
        'price',
        'cost_per_item',
        'discounted_price',
        'sale_price_from',
        'sale_price_to',
        'nutritional_info',
        'is_featured',
        'is_taxable',
        'tax_rate',
        'status',
        'stock_quantity',
        'stock_status',
        'weight',
        'length',
        'width',
        'height',
    ];

    protected $casts = [
        'nutritional_info' => 'json',
        'is_featured' => 'boolean',
        'is_taxable' => 'boolean',
        'sale_price_from' => 'datetime',
        'sale_price_to' => 'datetime',
        'price' => 'decimal:2',
        'cost_per_item' => 'decimal:2',
        'discounted_price' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'weight' => 'decimal:2',
        'length' => 'decimal:2',
        'width' => 'decimal:2',
        'height' => 'decimal:2',
    ];

    protected $appends = ['thumbnail', 'gallery'];

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'product_categories')
            ->withTimestamps()
            ->withPivot('sort_order')
            ->orderByPivot('sort_order');
    }

    
    public function getThumbnailAttribute(): ?File
    {
        return $this->getFileFrom(self::COLLECTION_THUMBNAIL);
    }

    public function getGalleryAttribute(): Collection
    {
        return $this->getFilesFrom(self::COLLECTION_GALLERY);
    }

    public function getCurrentPrice(): float
    {
        return $this->convertPrice($this->price);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class)->orderBy('created_at');
    }

    public function getVariantByAttributes(array $attributes): ?ProductVariant
    {
        return $this->variants()
            ->where('enabled', true)
            ->whereJsonContains('attributes', $attributes)
            ->first();
    }

    public function generateVariantSku(array $attributes): string
    {
        $attributeValues = collect($attributes)
            ->map(fn($value) => substr(preg_replace('/[^A-Za-z0-9]/', '', $value), 0, 3))
            ->join('-');
        
        return strtoupper("{$this->sku}-{$attributeValues}");
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function metadata(): HasMany
    {
        return $this->hasMany(ProductMetadata::class);
    }

    public function specifications(): BelongsToMany
    {
        return $this->belongsToMany(Specification::class, 'product_specifications')
            ->withPivot('value')
            ->withTimestamps();
    }

    public function isOnSale(): bool
    {
        if (!$this->discounted_price) {
            return false;
        }

        $now = now();
        
        if ($this->sale_price_from && $this->sale_price_to) {
            return $now->between($this->sale_price_from, $this->sale_price_to);
        }

        return true;
    }

    // public function getCurrentPrice(): float
    // {
    //     return $this->isOnSale() ? $this->discounted_price : $this->price;
    // }

    public function updateStock(int $quantity, string $operation = 'subtract', ?string $reason = null): void
    {
        $stockBefore = $this->stock_quantity;
        
        if ($operation === 'add') {
            $this->increment('stock_quantity', $quantity);
            $type = 'in';
        } else {
            $this->decrement('stock_quantity', $quantity);
            $type = 'out';
        }
        
        $this->update([
            'stock_status' => $this->stock_quantity > 0 ? 'in_stock' : 'out_of_stock'
        ]);

        // Record the inventory movement
        $this->inventoryMovements()->create([
            'user_id' => Auth::id(),
            'quantity' => $quantity,
            'type' => $type,
            'reason' => $reason,
            'stock_before' => $stockBefore,
            'stock_after' => $this->stock_quantity,
        ]);
    }

    public function getMeta(string $key, mixed $default = null): mixed
    {
        return $this->metadata()
            ->where('meta_key', $key)
            ->value('meta_value') ?? $default;
    }

    public function setMeta(string $key, mixed $value): void
    {
        $this->metadata()->updateOrCreate(
            ['meta_key' => $key],
            ['meta_value' => $value]
        );
    }

    public function labels(): BelongsToMany
    {
        return $this->belongsToMany(Label::class, 'product_labels');
    }

    public function flashSales(): BelongsToMany
    {
        return $this->belongsToMany(FlashSale::class, 'flash_sale_products')
            ->withPivot(['discount_price', 'quantity_limit'])
            ->withTimestamps();
    }

    public function getActiveFlashSale(): ?array
    {
        return $this->flashSales()
            ->where('is_active', true)
            ->where('starts_at', '<=', now())
            ->where('ends_at', '>=', now())
            ->first(['flash_sales.*', 'discount_price', 'quantity_limit']);
    }


    public function inventoryMovements(): HasMany
    {
        return $this->hasMany(ProductInventoryMovement::class)->latest();
    }

    public function bundles(): HasMany
    {
        return $this->hasMany(ProductBundle::class);
    }

    public function relatedProducts(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_relationships', 'product_id', 'related_product_id')
            ->withPivot('relation_type', 'sort_order')
            ->withTimestamps();
    }

    public function crossSellProducts(): BelongsToMany
    {
        return $this->relatedProducts()->wherePivot('relation_type', 'cross_sell');
    }

    public function upSellProducts(): BelongsToMany
    {
        return $this->relatedProducts()->wherePivot('relation_type', 'up_sell');
    }

    public function getActiveBundle(): ?ProductBundle
    {
        return $this->bundles()
            ->where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('starts_at')
                    ->orWhere('starts_at', '<=', now());
            })
            ->where(function ($query) {
                $query->whereNull('ends_at')
                    ->orWhere('ends_at', '>=', now());
            })
            ->first();
    }

    public function getAverageRating(): float
    {
        return $this->reviews()
            ->where('is_approved', true)
            ->avg('rating') ?? 0;
    }

    public function getApprovedReviewsCount(): int
    {
        return $this->reviews()
            ->where('is_approved', true)
            ->count();
    }

    public function getRecommendationPercentage(): float
    {
        $approvedReviews = $this->reviews()->where('is_approved', true);
        $total = $approvedReviews->count();
        
        if ($total === 0) {
            return 0;
        }
        
        $recommended = $approvedReviews->where('is_recommended', true)->count();
        return ($recommended / $total) * 100;
    }

    public function views(): HasMany
    {
        return $this->hasMany(ProductView::class);
    }

    public function interactions(): HasMany
    {
        return $this->hasMany(ProductInteraction::class);
    }

    public function performanceMetrics(): HasMany
    {
        return $this->hasMany(ProductPerformanceMetric::class);
    }

    public function recordView(array $data): void
    {
        $this->views()->create($data);
    }

    public function recordInteraction(string $type, array $data = []): void
    {
        $this->interactions()->create([
            'interaction_type' => $type,
            'interaction_data' => $data,
            'user_id' => Auth::id(),
            'session_id' => session()->getId(),
        ]);
    }

    public function getPerformanceMetrics(string $startDate, string $endDate): Collection
    {
        return $this->performanceMetrics()
            ->whereBetween('date', [$startDate, $endDate])
            ->orderBy('date')
            ->get();
    }

    public function getConversionRate(string $startDate, string $endDate): float
    {
        $metrics = $this->performanceMetrics()
            ->whereBetween('date', [$startDate, $endDate])
            ->selectRaw('
                SUM(views) as total_views,
                SUM(orders) as total_orders
            ')
            ->first();

        if (!$metrics || !$metrics->total_views) {
            return 0;
        }

        return ($metrics->total_orders / $metrics->total_views) * 100;
    }

    public function specificAttributes(): HasMany
    {
        return $this->hasMany(ProductSpecificAttribute::class)->orderBy('sort_order');
    }


    public function getFormattedPrice(): string
    {
        $currencyCode = Session::get('currency');
        $currency = Cache::remember("currency_code_{$currencyCode}", 3600, function () use ($currencyCode) {
            return Currency::where('code', $currencyCode)
                ->where('is_enabled', true)
                ->first() ?? Currency::where('is_default', true)->first();
        });

        return $currency->format($this->price);
    }

    public function toArray()
    {
        $array = parent::toArray();
        $array['formatted_price'] = $this->formatted_price;
        return $array;
    }

    public function addonCategories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'product_addon_assignments', 'product_id', 'category_id')
            ->where('type', 'addon')
            ->withPivot('sort_order')
            ->withTimestamps()
            ->orderByPivot('sort_order');
    }

    public function addons(): BelongsToMany
    {
        return $this->belongsToMany(ProductAddon::class, 'product_addon_items', 'product_id', 'addon_id')
            ->withPivot(['quantity', 'price'])
            ->withTimestamps();
    }
}
