<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\HasFiles;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class MenuItem extends Model
{
    use SoftDeletes, HasFiles;

    protected $fillable = [
        'restaurant_id',
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'sale_price',
        'is_available',
        'is_featured',
        'options',
        'nutritional_info',
        'allergens',
        'preparation_time',
        'order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'is_available' => 'boolean',
        'is_featured' => 'boolean',
        'options' => 'array',
        'nutritional_info' => 'array',
        'allergens' => 'array',
        'preparation_time' => 'integer',
        'order' => 'integer',
    ];

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(MenuCategory::class, 'category_id');
    }
} 