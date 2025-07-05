<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasFiles;
use App\Traits\HasMeta;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Traits\HasRoles;
use App\Traits\HasMenu;

final class Restaurant extends Model
{
    use HasFactory, HasFiles, HasMeta, HasRoles, SoftDeletes, HasMenu;

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

    public function deliveryZones(): HasMany
    {
        return $this->hasMany(DeliveryZone::class)->where('is_active', true);
    }

    public function isDeliveryAvailable(float $latitude, float $longitude): bool
    {
        // First check if point is within any delivery zone
        foreach ($this->deliveryZones as $zone) {
            if ($zone->containsPoint($latitude, $longitude)) {
                return true;
            }
        }

        // If no zones defined, fall back to radius check
        if ($this->deliveryZones->isEmpty() && $this->delivery_radius > 0) {
            $distance = $this->getDistance($latitude, $longitude);
            return $distance <= $this->delivery_radius;
        }

        return false;
    }

    private function getDistance(float $latitude, float $longitude): float
    {
        $earthRadius = 6371; // Radius of the earth in km

        $latDelta = deg2rad($latitude - $this->latitude);
        $lonDelta = deg2rad($longitude - $this->longitude);

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
            cos(deg2rad($this->latitude)) * cos(deg2rad($latitude)) *
            sin($lonDelta / 2) * sin($lonDelta / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    public function kitchenStaffInquiries(): HasMany
    {
        return $this->hasMany(KitchenStaffInquiry::class);
    }

    // reviews
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class)->where('restaurant_id', $this->id);
    }

    // Accessors for dynamic properties
    public function getIsOpenAttribute(): bool
    {
        if (!$this->opening_hours) {
            return false;
        }

        $currentDay = strtolower(now()->format('l')); // monday, tuesday, etc.
        $currentTime = now()->format('H:i');

        $todayHours = $this->opening_hours[$currentDay] ?? null;

        if (!$todayHours || $todayHours === null) {
            return false;
        }

        $openTime = $todayHours['open'] ?? null;
        $closeTime = $todayHours['close'] ?? null;

        if (!$openTime || !$closeTime) {
            return false;
        }

        return $currentTime >= $openTime && $currentTime <= $closeTime;
    }

    public function getRatingAttribute(): float
    {
        return round($this->reviews()->avg('rating') ?? 0, 1);
    }

    public function getTotalReviewsAttribute(): int
    {
        return $this->reviews()->count();
    }

    // public function getCategoriesAttribute(): array
    // {
    //     if ($this->relationLoaded('cuisineTypes')) {
    //         return $this->cuisineTypes->pluck('name')->toArray();
    //     }
        
    //     return $this->cuisineTypes()->pluck('name')->toArray();
    // }

    public function getPriceRangeDisplayAttribute(): string
    {
        return $this->attributes['price_range'] ?? '$$';
    }

    public function getLogoUrlAttribute(): string
    {
        if ($this->relationLoaded('files')) {
            $logoFile = $this->files->where('collection', 'logo')->first();
            return $logoFile ? asset('storage/' . $logoFile->path) : '/images/restaurants/default.jpg';
        }

        $logoFile = $this->files()->where('collection', 'logo')->first();
        return $logoFile ? asset('storage/' . $logoFile->path) : '/images/restaurants/default.jpg';
    }

    public function getCoverImageUrlAttribute(): string
    {
        if ($this->relationLoaded('files')) {
            $bannerFile = $this->files->where('collection', 'banner')->first();
            return $bannerFile ? asset('storage/' . $bannerFile->path) : '/images/restaurants/default.jpg';
        }

        $bannerFile = $this->files()->where('collection', 'banner')->first();
        return $bannerFile ? asset('storage/' . $bannerFile->path) : '/images/restaurants/default.jpg';
    }

    // Method to calculate distance (can be called from controller)
    public function calculateDistanceFrom(?float $userLat, ?float $userLng): float
    {
        // Check if user coordinates are valid
        if ($userLat === null || $userLng === null) {
            return 0.0;
        }
        
        // Check if restaurant coordinates are valid
        if ($this->latitude === null || $this->longitude === null) {
            return 0.0;
        }

        // Ensure coordinates are floats
        $userLat = (float) $userLat;
        $userLng = (float) $userLng;
        $restaurantLat = (float) $this->latitude;
        $restaurantLng = (float) $this->longitude;

        $earthRadius = 6371; // Earth's radius in kilometers

        $latDelta = deg2rad($restaurantLat - $userLat);
        $lngDelta = deg2rad($restaurantLng - $userLng);

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
            cos(deg2rad($userLat)) * cos(deg2rad($restaurantLat)) *
            sin($lngDelta / 2) * sin($lngDelta / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        $distance = $earthRadius * $c;

        return round($distance, 1);
    }

    // Scope for open restaurants
    public function scopeOpen($query)
    {
        return $query->whereRaw('JSON_EXTRACT(opening_hours, CONCAT("$.", LOWER(DAYNAME(NOW())))) IS NOT NULL');
    }

    // Scope for featured restaurants
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    // Scope for active restaurants
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // public function cuisineTypes()
    // {
    //     // return $this->hasMany(CuisineType::class);
    //     return [];
    // }
}
