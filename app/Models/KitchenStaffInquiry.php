<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class KitchenStaffInquiry extends Model
{
    use SoftDeletes;

    protected $casts = [
        'specializations' => 'array',
        'culinary_certificates' => 'array',
        'availability_hours' => 'array',
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
        'date_of_birth' => 'date',
        'food_safety_certification_expiry' => 'date',
        'health_certification_expiry' => 'date',
        'available_from' => 'date',
        'expected_salary' => 'decimal:2',
    ];

    // Collection constants
    public const COLLECTION_RESUME = 'resume';
    public const COLLECTION_ID_PROOF = 'id_proof';
    public const COLLECTION_CERTIFICATES = 'certificates';
    public const COLLECTION_PHOTO = 'photo';

    // Available positions
    public const AVAILABLE_POSITIONS = [
        'head_chef' => 'Head Chef',
        'sous_chef' => 'Sous Chef',
        'line_cook' => 'Line Cook',
        'prep_cook' => 'Prep Cook',
        'pastry_chef' => 'Pastry Chef',
        'kitchen_helper' => 'Kitchen Helper',
    ];

    // Experience levels
    public const EXPERIENCE_LEVELS = [
        'entry' => '0-2 years',
        'intermediate' => '2-5 years',
        'experienced' => '5-10 years',
        'senior' => '10+ years',
    ];

    // Status constants
    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';

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
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relationship',
        'has_food_safety_certification',
        'food_safety_certification_expiry',
        'has_health_certification',
        'health_certification_expiry',
        'additional_notes',
        'terms_accepted',
        'background_check_consent',
        'status',
        'rejection_reason',
    ];

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }

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
    }

    public function reject(string $reason): void
    {
        $this->update([
            'status' => self::STATUS_REJECTED,
            'rejection_reason' => $reason,
        ]);
    }
} 