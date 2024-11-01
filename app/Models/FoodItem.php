<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FoodItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'restaurant_id',
        'name',
        'slug',
        'description',
        'price',
        'discounted_price',
        'image',
        'is_vegetarian',
        'is_vegan',
        'is_gluten_free',
        'nutritional_info',
        'is_featured',
        'status',
    ];

    protected $casts = [
        'nutritional_info' => 'json',
        'is_vegetarian' => 'boolean',
        'is_vegan' => 'boolean',
        'is_gluten_free' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    public function variants()
    {
        return $this->hasMany(FoodItemVariant::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
