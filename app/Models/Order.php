<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'restaurant_id',
        'restaurant_branch_id',
        'order_number',
        'subtotal',
        'tax',
        'delivery_fee',
        'total',
        'status',
        'payment_status',
        'payment_method',
        'delivery_address',
        'delivery_latitude',
        'delivery_longitude',
        'special_instructions',
        'estimated_delivery_time',
        'actual_delivery_time',
        'delivery_person_id',
    ];

    protected $casts = [
        'estimated_delivery_time' => 'datetime',
        'actual_delivery_time' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function restaurantBranch()
    {
        return $this->belongsTo(RestaurantBranch::class);
    }

    public function deliveryPerson()
    {
        return $this->belongsTo(User::class, 'delivery_person_id');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }
}
