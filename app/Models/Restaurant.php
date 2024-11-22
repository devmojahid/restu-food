<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasFiles;
use App\Traits\HasMeta;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Traits\HasRoles;

final class Restaurant extends Model
{
    use HasFiles, HasMeta, HasRoles, SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'description',
        'address',
        'latitude',
        'longitude',
        'phone',
        'email',
        'status',
        'is_featured',
        'opening_hours',
        'opening_time',
        'closing_time',
        'delivery_radius',
        'minimum_order',
        'delivery_fee',
        'commission_rate',
    ];

    protected $casts = [
        'opening_hours' => 'array',
        'is_featured' => 'boolean',
        'delivery_radius' => 'float',
        'minimum_order' => 'decimal:2',
        'delivery_fee' => 'decimal:2',
        'commission_rate' => 'decimal:2',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // public function menus(): HasMany
    // {
    //     return $this->hasMany(Menu::class);
    // }

    // public function categories(): HasMany
    // {
    //     return $this->hasMany(Category::class);
    // }

    // public function orders(): HasMany
    // {
    //     return $this->hasMany(Order::class);
    // }

    // public function reviews(): HasMany
    // {
    //     return $this->hasMany(Review::class);
    // }

    // public function getAverageRatingAttribute(): float
    // {
    //     return (float) $this->reviews()->avg('rating') ?? 0.0;
    // }

    // public function getTotalReviewsAttribute(): int
    // {
    //     return $this->reviews()->count();
    // }

    // public function isOpen(): bool
    // {
    //     // Implement opening hours logic
    //     return true;
    // }

    // public function isDeliveryAvailable(float $latitude, float $longitude): bool
    // {
    //     // Implement delivery radius check
    //     return true;
    // }
}
