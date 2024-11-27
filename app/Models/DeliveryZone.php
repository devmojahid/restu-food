<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class DeliveryZone extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'restaurant_id',
        'name',
        'coordinates',
        'delivery_fee',
        'minimum_order',
        'estimated_delivery_time',
        'is_active',
    ];

    protected $casts = [
        'coordinates' => 'array',
        'delivery_fee' => 'decimal:2',
        'minimum_order' => 'decimal:2',
        'estimated_delivery_time' => 'integer',
        'is_active' => 'boolean',
    ];

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function containsPoint(float $latitude, float $longitude): bool
    {
        // Implement point-in-polygon algorithm
        $vertices = $this->coordinates;
        $vertexCount = count($vertices);
        $isInside = false;

        for ($i = 0, $j = $vertexCount - 1; $i < $vertexCount; $j = $i++) {
            if (
                ($vertices[$i]['lat'] > $latitude) !== ($vertices[$j]['lat'] > $latitude) &&
                $longitude < (
                    ($vertices[$j]['lng'] - $vertices[$i]['lng']) * ($latitude - $vertices[$i]['lat']) /
                    ($vertices[$j]['lat'] - $vertices[$i]['lat']) + $vertices[$i]['lng']
                )
            ) {
                $isInside = !$isInside;
            }
        }

        return $isInside;
    }
}
