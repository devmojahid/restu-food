<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

final class Seo extends Model
{
    protected $fillable = [
        'meta_title',
        'meta_description',
        'meta_keywords',
        'og_title',
        'og_description',
        'canonical_url',
        'no_index',
        'no_follow',
        'structured_data',
        'seoable_type',
        'seoable_id',
    ];

    protected $casts = [
        'no_index' => 'boolean',
        'no_follow' => 'boolean',
        'structured_data' => 'json',
    ];

    public function seoable(): MorphTo
    {
        return $this->morphTo();
    }

    public function generateStructuredData(): array
    {
        $product = $this->seoable;
        
        return [
            '@context' => 'https://schema.org',
            '@type' => 'Product',
            'name' => $product->name,
            'description' => $product->description,
            'sku' => $product->sku,
            'brand' => [
                '@type' => 'Brand',
                'name' => $product->restaurant->name,
            ],
            'offers' => [
                '@type' => 'Offer',
                'price' => $product->getCurrentPrice(),
                'priceCurrency' => 'USD',
                'availability' => $product->stock_status === 'in_stock' 
                    ? 'https://schema.org/InStock' 
                    : 'https://schema.org/OutOfStock',
            ],
            'aggregateRating' => [
                '@type' => 'AggregateRating',
                'ratingValue' => $product->reviews()->avg('rating') ?? 0,
                'reviewCount' => $product->reviews()->count(),
            ],
        ];
    }
} 