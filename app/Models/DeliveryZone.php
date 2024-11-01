<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryZone extends Model
{
    use HasFactory;

    protected $fillable = [
        'restaurant_id',
        'name',
        'coordinates',
        'delivery_fee',
        'estimated_delivery_time',
    ];

    protected $casts = [
        'coordinates' => 'json',
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
}
