<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RestaurantNotification extends Model
{
    protected $fillable = [
        'restaurant_id',
        'title',
        'message',
        'type',
        'data',
        'read_at'
    ];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime'
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
} 