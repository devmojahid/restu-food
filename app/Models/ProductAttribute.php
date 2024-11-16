<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

final class ProductAttribute extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'type',
        'is_global',
        'is_visible',
        'is_variation',
        'sort_order',
    ];

    protected $casts = [
        'is_global' => 'boolean',
        'is_visible' => 'boolean',
        'is_variation' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($attribute) {
            if (empty($attribute->slug)) {
                $attribute->slug = Str::slug($attribute->name);
            }
        });
    }

    public function values(): HasMany
    {
        return $this->hasMany(ProductAttributeValue::class, 'attribute_id');
    }

    public function productSets(): HasMany
    {
        return $this->hasMany(ProductAttributeSet::class, 'attribute_id');
    }
} 