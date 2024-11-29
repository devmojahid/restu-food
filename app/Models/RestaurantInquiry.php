<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasFiles;
use App\Traits\HandlesFiles;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

final class RestaurantInquiry extends Model
{
    use HasFactory, HasFiles, HandlesFiles, SoftDeletes;

    public const COLLECTION_BUSINESS_LICENSE = 'business_license';
    public const COLLECTION_OWNER_ID = 'owner_id';
    public const COLLECTION_RESTAURANT_PHOTOS = 'restaurant_photos';

    protected $fillable = [
        'user_id',
        'restaurant_name',
        'slug',
        'description',
        'cuisine_type',
        'restaurant_phone',
        'restaurant_email',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'latitude',
        'longitude',
        'business_registration_number',
        'tax_number',
        'bank_account_name',
        'bank_account_number',
        'bank_name',
        'bank_branch',
        'owner_name',
        'owner_phone',
        'owner_email',
        'owner_id_type',
        'owner_id_number',
        'opening_time',
        'closing_time',
        'opening_hours',
        'seating_capacity',
        'delivery_available',
        'pickup_available',
        'delivery_radius',
        'minimum_order',
        'delivery_fee',
        'status',
        'rejection_reason',
        'approved_at',
        'approved_by',
        'terms_accepted',
        'verified_address',
        'verified_phone',
        'verified_email',
    ];

    protected $casts = [
        'opening_hours' => 'array',
        'delivery_available' => 'boolean',
        'pickup_available' => 'boolean',
        'delivery_radius' => 'decimal:2',
        'minimum_order' => 'decimal:2',
        'delivery_fee' => 'decimal:2',
        'terms_accepted' => 'boolean',
        'verified_address' => 'boolean',
        'verified_phone' => 'boolean',
        'verified_email' => 'boolean',
        'approved_at' => 'datetime',
        'opening_time' => 'datetime:H:i',
        'closing_time' => 'datetime:H:i',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'pending' => 'yellow',
            'under_review' => 'blue',
            'approved' => 'green',
            'rejected' => 'red',
            default => 'gray'
        };
    }

    public function getStatusLabelAttribute(): string
    {
        return ucfirst(str_replace('_', ' ', $this->status));
    }

    protected function getCachePrefix(): string
    {
        return 'restaurant_inquiry';
    }

    protected function getCacheTTL(): int
    {
        return 1800; // 30 minutes
    }
} 