<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasFiles;
use App\Traits\HandlesFiles;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

final class KitchenStaffInquiry extends Model
{
    use HasFactory, HasFiles, HandlesFiles, SoftDeletes;

    public const COLLECTION_RESUME = 'resume';
    public const COLLECTION_ID_PROOF = 'id_proof';
    public const COLLECTION_CERTIFICATES = 'certificates';
    public const COLLECTION_PHOTO = 'photo';

    protected $fillable = [
        'user_id',
        'restaurant_id',
        'full_name',
        'email',
        'phone',
        'date_of_birth',
        'gender',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'position_applied',
        'years_of_experience',
        'specializations',
        'previous_experience',
        'highest_education',
        'culinary_certificates',
        'availability_hours',
        'full_time',
        'part_time',
        'expected_salary',
        'available_from',
        'references',
        'has_food_safety_certification',
        'food_safety_certification_expiry',
        'has_health_certification',
        'health_certification_expiry',
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relationship',
        'status',
        'rejection_reason',
        'approved_at',
        'approved_by',
        'additional_notes',
        'terms_accepted',
        'background_check_consent',
        'verified_identity',
        'verified_qualifications',
        'verified_references',
        'verified_documents',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'available_from' => 'date',
        'food_safety_certification_expiry' => 'date',
        'health_certification_expiry' => 'date',
        'approved_at' => 'datetime',
        'specializations' => 'array',
        'availability_hours' => 'json',
        'references' => 'array',
        'culinary_certificates' => 'array',
        'full_time' => 'boolean',
        'part_time' => 'boolean',
        'has_food_safety_certification' => 'boolean',
        'has_health_certification' => 'boolean',
        'terms_accepted' => 'boolean',
        'background_check_consent' => 'boolean',
        'verified_identity' => 'boolean',
        'verified_qualifications' => 'boolean',
        'verified_references' => 'boolean',
        'verified_documents' => 'boolean',
        'expected_salary' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
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
        return 'kitchen_staff_inquiry';
    }

    protected function getCacheTTL(): int
    {
        return 1800; // 30 minutes
    }
} 