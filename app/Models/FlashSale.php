<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

final class FlashSale extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'starts_at',
        'ends_at',
        'is_active',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'flash_sale_products')
            ->withPivot(['discount_price', 'quantity_limit'])
            ->withTimestamps();
    }

    public function isActive(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $now = now();
        return $now->between($this->starts_at, $this->ends_at);
    }
} 