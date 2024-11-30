<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

final class KitchenStaffApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Personal Information
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'date_of_birth' => ['required', 'date', 'before:today'],
            'gender' => ['required', 'string', 'in:male,female,other'],
            
            // Restaurant Selection
            'restaurant_id' => ['required', 'exists:restaurants,id'],
            
            // Address Information
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['required', 'string', 'max:20'],
            'country' => ['required', 'string', 'max:100'],
            
            // Professional Information
            'position_applied' => ['required', 'string', 'max:100'],
            'years_of_experience' => ['required', 'integer', 'min:0'],
            'specializations' => ['required', 'array', 'min:1'],
            'specializations.*' => ['string', 'max:100'],
            'previous_experience' => ['nullable', 'string', 'max:1000'],
            'highest_education' => ['nullable', 'string', 'max:255'],
            'culinary_certificates' => ['nullable', 'array'],
            'culinary_certificates.*' => ['string', 'max:255'],
            
            // Availability
            'availability_hours' => ['required', 'array'],
            'full_time' => ['boolean'],
            'part_time' => ['boolean'],
            'expected_salary' => ['required', 'numeric', 'min:0'],
            'available_from' => ['required', 'date', 'after:today'],
            
            // Documents
            'files' => ['nullable', 'array'],
            'files.resume' => ['nullable', 'array'],
            'files.resume.uuid' => ['nullable', 'string', 'exists:files,uuid'],
            'files.id_proof' => ['nullable', 'array'],
            'files.id_proof.uuid' => ['nullable', 'string', 'exists:files,uuid'],
            'files.certificates' => ['nullable', 'array'],
            'files.certificates.*.uuid' => ['nullable', 'string', 'exists:files,uuid'],
            'files.photo' => ['nullable', 'array'],
            'files.photo.uuid' => ['nullable', 'string', 'exists:files,uuid'],
            
            // Health and Safety
            'has_food_safety_certification' => ['boolean'],
            'food_safety_certification_expiry' => [
                'required_if:has_food_safety_certification,true',
                'nullable',
                'date',
                'after:today'
            ],
            'has_health_certification' => ['boolean'],
            'health_certification_expiry' => [
                'required_if:has_health_certification,true',
                'nullable',
                'date',
                'after:today'
            ],
            
            // Emergency Contact
            'emergency_contact_name' => ['required', 'string', 'max:255'],
            'emergency_contact_phone' => ['required', 'string', 'max:20'],
            'emergency_contact_relationship' => ['required', 'string', 'max:100'],
            
            // Additional Information
            'additional_notes' => ['nullable', 'string', 'max:1000'],
            'terms_accepted' => ['required', 'accepted'],
            'background_check_consent' => ['required', 'accepted'],
        ];
    }

    public function messages(): array
    {
        return [
            'terms_accepted.accepted' => 'You must accept the terms and conditions',
            'background_check_consent.accepted' => 'You must consent to the background check',
            'restaurant_id.required' => 'Please select a restaurant',
            'restaurant_id.exists' => 'The selected restaurant is invalid',
            'specializations.required' => 'Please select at least one specialization',
            'files.resume.required' => 'Please upload your resume',
            'files.id_proof.required' => 'Please upload your ID proof',
            'files.photo.required' => 'Please upload your photo',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'full_time' => $this->boolean('full_time'),
            'part_time' => $this->boolean('part_time'),
            'has_food_safety_certification' => $this->boolean('has_food_safety_certification'),
            'has_health_certification' => $this->boolean('has_health_certification'),
            'terms_accepted' => $this->boolean('terms_accepted'),
            'background_check_consent' => $this->boolean('background_check_consent'),
        ]);
    }
} 