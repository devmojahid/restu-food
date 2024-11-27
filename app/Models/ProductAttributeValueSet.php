<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class ProductAttributeValueSet extends Model
{
    protected $fillable = [
        'product_id',
        'attribute_set_id',
        'attribute_value_id',
    ];

    public function attributeSet(): BelongsTo
    {
        return $this->belongsTo(ProductAttributeSet::class, 'attribute_set_id');
    }

    public function attributeValue(): BelongsTo
    {
        return $this->belongsTo(ProductAttributeValue::class, 'attribute_value_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
} 