<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class ProductView extends Model
{
    protected $fillable = [
        'product_id',
        'user_id',
        'session_id',
        'ip_address',
        'user_agent',
        'referrer_url',
        'source',
        'medium',
        'campaign',
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