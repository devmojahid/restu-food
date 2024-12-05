<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryCharge extends Model
{
    protected $fillable = [
        'zone_id',
        'min_charge',
        'max_charge',
        'per_km_charge',
        'max_cod_amount',
        'increase_percentage',
        'increase_message',
    ];

    protected $casts = [
        'min_charge' => 'decimal:2',
        'max_charge' => 'decimal:2',
        'per_km_charge' => 'decimal:2',
        'max_cod_amount' => 'decimal:2',
        'increase_percentage' => 'integer',
    ];

    public function zone()
    {
        return $this->belongsTo(Zone::class);
    }
} 