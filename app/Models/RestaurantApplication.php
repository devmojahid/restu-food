<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class RestaurantApplication extends Model
{
    
    protected $fillable = [
        'restaurant_name',
        'restaurant_email',
        'status',
        'user_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function address(): HasOne
    {
        return $this->hasOne(Address::class);
    }

    public function businessHours(): HasMany
    {
        return $this->hasMany(BusinessHour::class);
    }

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    public function cuisines(): HasMany
    {
        return $this->hasMany(Cuisine::class);
    }

    public function getStatusLabelAttribute(): string
    {
        return ucfirst($this->status);
    }
} 