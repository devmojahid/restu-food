<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class ProductInteraction extends Model
{
    protected $fillable = [
        'product_id',
        'user_id',
        'session_id',
        'interaction_type',
        'interaction_data',
    ];

    protected $casts = [
        'interaction_data' => 'json',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
} 