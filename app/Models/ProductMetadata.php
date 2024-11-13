<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class ProductMetadata extends Model
{
    protected $table = 'product_metadata';

    protected $fillable = [
        'product_id',
        'meta_key',
        'meta_value'
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
} 