<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\HasZoneCache;

class Zone extends Model
{
    use SoftDeletes, HasZoneCache;

    protected $fillable = [
        'name',
        'display_name',
        'coordinates',
        'is_active',
    ];

    protected $casts = [
        'coordinates' => 'array',
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($zone) {
            $zone->clearZoneCaches();
        });

        static::updated(function ($zone) {
            $zone->clearZoneCaches();
        });

        static::deleted(function ($zone) {
            $zone->clearZoneCaches();
        });
    }

    public function deliveryCharges()
    {
        return $this->hasOne(DeliveryCharge::class);
    }

    public function calculateArea()
    {
        if (count($this->coordinates) < 3) {
            return 0;
        }

        return $this->calculatePolygonArea($this->coordinates);
    }

    protected function calculatePolygonArea($coordinates)
    {
        $area = 0;
        $j = count($coordinates) - 1;

        for ($i = 0; $i < count($coordinates); $i++) {
            $area += ($coordinates[$j]['lng'] + $coordinates[$i]['lng']) * 
                     ($coordinates[$j]['lat'] - $coordinates[$i]['lat']);
            $j = $i;
        }

        return abs($area / 2) * 111.32 * 111.32; // Convert to square kilometers
    }
} 