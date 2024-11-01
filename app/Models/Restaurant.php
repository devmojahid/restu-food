<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Restaurant extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'logo',
        'banner',
        'address',
        'phone',
        'email',
        'latitude',
        'longitude',
        'opening_time',
        'closing_time',
        'is_featured',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function branches()
    {
        return $this->hasMany(RestaurantBranch::class);
    }

    public function foodItems()
    {
        return $this->hasMany(FoodItem::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function deliveryZones()
    {
        return $this->hasMany(DeliveryZone::class);
    }

    public function timeSlots()
    {
        return $this->hasMany(TimeSlot::class);
    }
}
