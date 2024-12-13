<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    protected $fillable = [
        'customer_id',
        'restaurant_id',
        'total',
        'status',
        'order_number',
        'payment_status',
        'payment_method',
        'is_takeaway',
        'subtotal',
        'tax',
        'delivery_fee',
        'notes',
        'delivery_address',
        'delivery_latitude',
        'delivery_longitude',
        'special_instructions',
        'estimated_delivery_time',
    ];

    protected $casts = [
        'total' => 'decimal:2',
        'is_takeaway' => 'boolean',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function delivery(): HasOne
    {
        return $this->hasOne(Delivery::class);
    }
}
