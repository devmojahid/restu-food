<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\DeliveryStaffInquiry;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class DeliveryStaffApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'date_of_birth' => ['required', 'date', 'before:today'],
            'gender' => ['nullable', 'string', 'in:male,female,other'],
            
            // Address Information
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['required', 'string', 'max:100'],
            'postal_code' => ['required', 'string', 'max:20'],
            'country' => ['required', 'string', 'max:100'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            
            // Vehicle Information
            'vehicle_type' => ['required', Rule::in(array_keys(DeliveryStaffInquiry::VEHICLE_TYPES))],
            'vehicle_model' => ['required_unless:vehicle_type,bicycle', 'nullable', 'string', 'max:100'],
            'vehicle_year' => ['required_unless:vehicle_type,bicycle', 'nullable', 'string', 'max:4'],
            'vehicle_color' => ['required_unless:vehicle_type,bicycle', 'nullable', 'string', 'max:50'],
            'license_plate' => ['required_unless:vehicle_type,bicycle', 'nullable', 'string', 'max:20'],
            
            // Documents
            'driving_license_number' => ['required_unless:vehicle_type,bicycle', 'string', 'max:50'],
            'driving_license_expiry' => ['required_unless:vehicle_type,bicycle', 'date', 'after:today'],
            'has_vehicle_insurance' => ['required_unless:vehicle_type,bicycle', 'boolean'],
            'vehicle_insurance_expiry' => ['required_if:has_vehicle_insurance,true', 'nullable', 'date', 'after:today'],
            
            // Work Preferences
            'availability_hours' => ['required', 'array'],
            'availability_hours.*' => ['array'],
            'full_time' => ['required', 'boolean'],
            'part_time' => ['required', 'boolean'],
            'expected_salary' => ['nullable', 'numeric', 'min:0'],
            'available_from' => ['required', 'date', 'after:today'],
            'preferred_areas' => ['required', 'array', 'min:1'],
            'preferred_areas.*' => ['string', 'max:100'],
            
            // Emergency Contact
            'emergency_contact_name' => ['required', 'string', 'max:255'],
            'emergency_contact_phone' => ['required', 'string', 'max:20'],
            'emergency_contact_relationship' => ['required', 'string', 'max:50'],
            
            // Background Check
            'has_criminal_record' => ['required', 'boolean'],
            'criminal_record_details' => ['required_if:has_criminal_record,true', 'nullable', 'string'],
            'background_check_consent' => ['required', 'accepted'],
            
            // Experience
            'years_of_experience' => ['required', 'integer', 'min:0'],
            'previous_experience' => ['nullable', 'string'],
            'delivery_experience' => ['required', 'array'],
            'delivery_experience.*' => ['string', 'max:100'],
            'language_skills' => ['required', 'array', 'min:1'],
            'language_skills.*' => ['string', 'max:50'],
            
            // Terms and Conditions
            'terms_accepted' => ['required', 'accepted'],
            'data_processing_consent' => ['required', 'accepted'],
            
            // Files
            // 'profile_photo' => ['required', 'image', 'max:2048'],
            // 'id_proof' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:2048'],
            // 'driving_license' => ['required_unless:vehicle_type,bicycle', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:2048'],
            // 'vehicle_insurance' => ['required_if:has_vehicle_insurance,true', 'nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:2048'],
            // 'vehicle_photos.*' => ['required', 'image', 'max:2048'],

            'profile_photo' => ['nullable', 'array'],
            'profile_photo.uuid' => ['nullable', 'string', 'exists:files,uuid'],
            'id_proof' => ['nullable', 'array'],
            'id_proof.uuid' => ['nullable', 'string', 'exists:files,uuid'],
            'driving_license' => ['nullable', 'array'],
            'driving_license.uuid' => ['nullable', 'string', 'exists:files,uuid'],
            'vehicle_insurance' => ['nullable', 'array'],
            'vehicle_insurance.uuid' => ['nullable', 'string', 'exists:files,uuid'],
            'vehicle_photos' => ['nullable', 'array'],
            'vehicle_photos.*.uuid' => ['nullable', 'string', 'exists:files,uuid'],
            
            // Additional Information
            'additional_notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'vehicle_type.required' => 'Please select your vehicle type',
            'driving_license_number.required_unless' => 'Driving license is required for motorized vehicles',
            'vehicle_insurance.required_if' => 'Vehicle insurance document is required if you have insurance',
            'criminal_record_details.required_if' => 'Please provide details about your criminal record',
            'background_check_consent.accepted' => 'You must consent to a background check',
            'terms_accepted.accepted' => 'You must accept the terms and conditions',
            'data_processing_consent.accepted' => 'You must consent to data processing',
        ];
    }
} 