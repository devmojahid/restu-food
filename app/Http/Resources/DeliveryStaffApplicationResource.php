<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class DeliveryStaffApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'date_of_birth' => $this->date_of_birth ? Carbon::parse($this->date_of_birth)->format('Y-m-d') : null,
            'gender' => $this->gender,
            
            // Address Information
            'address' => $this->address,
            'city' => $this->city,
            'state' => $this->state,
            'postal_code' => $this->postal_code,
            'country' => $this->country,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            
            // Vehicle Information
            'vehicle_type' => $this->vehicle_type,
            'vehicle_model' => $this->vehicle_model,
            'vehicle_year' => $this->vehicle_year,
            'vehicle_color' => $this->vehicle_color,
            'license_plate' => $this->license_plate,
            
            // Documents
            'driving_license_number' => $this->driving_license_number,
            'driving_license_expiry' => $this->driving_license_expiry ? Carbon::parse($this->driving_license_expiry)->format('Y-m-d') : null,
            'has_vehicle_insurance' => $this->has_vehicle_insurance,
            'vehicle_insurance_expiry' => $this->vehicle_insurance_expiry ? Carbon::parse($this->vehicle_insurance_expiry)->format('Y-m-d') : null,
            
            // Work Preferences
            'availability_hours' => $this->availability_hours,
            'full_time' => $this->full_time,
            'part_time' => $this->part_time,
            'expected_salary' => $this->expected_salary,
            'available_from' => $this->available_from ? Carbon::parse($this->available_from)->format('Y-m-d') : null,
            'preferred_areas' => $this->preferred_areas,
            
            // Emergency Contact
            'emergency_contact_name' => $this->emergency_contact_name,
            'emergency_contact_phone' => $this->emergency_contact_phone,
            'emergency_contact_relationship' => $this->emergency_contact_relationship,
            
            // Background Check
            'has_criminal_record' => $this->has_criminal_record,
            'criminal_record_details' => $this->criminal_record_details,
            'background_check_consent' => $this->background_check_consent,
            
            // Experience
            'years_of_experience' => $this->years_of_experience,
            'previous_experience' => $this->previous_experience,
            'delivery_experience' => $this->delivery_experience,
            'language_skills' => $this->language_skills,
            
            // Verification Status
            'verified_identity' => $this->verified_identity,
            'verified_documents' => $this->verified_documents,
            'verified_background' => $this->verified_background,
            'verified_vehicle' => $this->verified_vehicle,
            
            // Application Status
            'status' => $this->status,
            'rejection_reason' => $this->rejection_reason,
            'status_history' => $this->status_history,
            'approved_at' => $this->approved_at ? Carbon::parse($this->approved_at)->format('Y-m-d H:i:s') : null,
            'created_at' => $this->created_at ? Carbon::parse($this->created_at)->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updated_at ? Carbon::parse($this->updated_at)->format('Y-m-d H:i:s') : null,
            
            // Additional Information
            'additional_notes' => $this->additional_notes,
            'meta' => $this->meta,
        ];
    }
} 