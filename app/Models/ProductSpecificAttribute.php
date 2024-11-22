<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class ProductSpecificAttribute extends Model
{
    protected $fillable = [
        'product_id',
        'name',
        'values',
        'is_variation',
        'sort_order'
    ];

    protected $casts = [
        'values' => 'array',
        'is_variation' => 'boolean',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
} 