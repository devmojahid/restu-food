<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Delivery extends Model
{
    protected $fillable = [
        'order_id',
        'driver_id',
        'status',
        'current_location',
        'last_location_update',
        'status_updated_at',
        'completed_at',
    ];

    protected $casts = [
        'current_location' => 'array',
        'last_location_update' => 'datetime',
        'status_updated_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function driver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function locations(): HasMany
    {
        return $this->hasMany(DeliveryLocation::class);
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(DeliveryStatusHistory::class);
    }
} 