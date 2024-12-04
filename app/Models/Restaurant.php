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
}
