<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class DeliveryStaffInquiry extends Model
{
    use SoftDeletes;

    protected $casts = [
        'availability_hours' => 'array',
        'preferred_areas' => 'array',
        'delivery_experience' => 'array',
        'language_skills' => 'array',
        'status_history' => 'array',
        'meta' => 'array',
        'full_time' => 'boolean',
        'part_time' => 'boolean',
        'has_vehicle_insurance' => 'boolean',
        'has_criminal_record' => 'boolean',
        'background_check_consent' => 'boolean',
        'verified_identity' => 'boolean',
        'verified_documents' => 'boolean',
        'verified_background' => 'boolean',
        'verified_vehicle' => 'boolean',
        'terms_accepted' => 'boolean',
        'data_processing_consent' => 'boolean',
        'date_of_birth' => 'date',
        'driving_license_expiry' => 'date',
        'vehicle_insurance_expiry' => 'date',
        'available_from' => 'date',
        'expected_salary' => 'decimal:2',
    ];

    // Collection constants
    public const COLLECTION_RESUME = 'resume';
    public const COLLECTION_ID_PROOF = 'id_proof';
    public const COLLECTION_DRIVING_LICENSE = 'driving_license';
    public const COLLECTION_VEHICLE_INSURANCE = 'vehicle_insurance';
    public const COLLECTION_VEHICLE_PHOTOS = 'vehicle_photos';
    public const COLLECTION_PROFILE_PHOTO = 'profile_photo';

    // Status constants
    public const STATUS_PENDING = 'pending';
    public const STATUS_UNDER_REVIEW = 'under_review';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';

    // Vehicle types
    public const VEHICLE_TYPES = [
        'car' => 'Car',
        'motorcycle' => 'Motorcycle',
        'bicycle' => 'Bicycle',
        'scooter' => 'Scooter',
        'van' => 'Van',
    ];

    protected $fillable = [
        'user_id',
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
        'latitude',
        'longitude',
        'vehicle_type',
        'vehicle_model',
        'vehicle_year',
        'vehicle_color',
        'license_plate',
        'driving_license_number',
        'driving_license_expiry',
        'has_vehicle_insurance',
        'vehicle_insurance_expiry',
        'availability_hours',
        'full_time',
        'part_time',
        'expected_salary',
        'available_from',
        'preferred_areas',
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relationship',
        'has_criminal_record',
        'criminal_record_details',
        'background_check_consent',
        'years_of_experience',
        'previous_experience',
        'delivery_experience',
        'language_skills',
        'verified_identity',
        'verified_documents',
        'verified_background',
        'verified_vehicle',
        'status',
        'rejection_reason',
        'status_history',
        'approved_at',
        'terms_accepted',
        'data_processing_consent',
        'additional_notes',
        'meta',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function approve(): void
    {
        $this->update([
            'status' => self::STATUS_APPROVED,
            'approved_at' => now(),
        ]);

        // Assign delivery role to user
        $this->user->assignRole('Delivery');
    }

    public function reject(string $reason): void
    {
        $this->update([
            'status' => self::STATUS_REJECTED,
            'rejection_reason' => $reason,
        ]);
    }

    public function addStatusHistory(string $status, string $comment, ?int $userId = null): void
    {
        $this->statusHistories()->create([
            'status' => $status,
            'comment' => $comment,
            'user_id' => $userId ?? auth()->id(),
        ]);

        $history = $this->status_history ?? [];
        $history[] = [
            'status' => $status,
            'comment' => $comment,
            'user_id' => $userId ?? auth()->id(),
            'created_at' => now()->toDateTimeString(),
        ];

        $this->update(['status_history' => $history]);
    }

    public function statusHistories()
    {
        return $this->hasMany(DeliveryStaffInquiryStatusHistory::class);
    }
} 