<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

final class ProductReview extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'product_id',
        'user_id',
        'order_item_id',
        'rating',
        'review',
        'pros',
        'cons',
        'is_verified_purchase',
        'is_recommended',
        'is_approved',
        'approved_at',
        'approved_by',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_verified_purchase' => 'boolean',
        'is_recommended' => 'boolean',
        'is_approved' => 'boolean',
        'approved_at' => 'datetime',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // public function votes(): HasMany
    // {
    //     return $this->hasMany(ProductReviewVote::class);
    // }

    public function getHelpfulVotesCount(): int
    {
        return $this->votes()->where('vote_type', 'helpful')->count();
    }

    public function getUnhelpfulVotesCount(): int
    {
        return $this->votes()->where('vote_type', 'not_helpful')->count();
    }
} 