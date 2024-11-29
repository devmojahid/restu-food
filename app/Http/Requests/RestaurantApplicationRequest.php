<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

final class RestaurantApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Restaurant Information
            'restaurant_name' => ['required', 'string', 'max:255', 'unique:restaurant_inquiries,restaurant_name'],
            'description' => ['nullable', 'string', 'max:1000'],
            'cuisine_type' => ['required', 'string', 'max:100'],
            'restaurant_phone' => ['required', 'string', 'max:20'],
            'restaurant_email' => ['required', 'email', 'max:255'],
            
            // Address Information
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['required', 'string', 'max:20'],
            'country' => ['required', 'string', 'max:100'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            
            // Business Information
            'business_registration_number' => ['required', 'string', 'max:100'],
            'tax_number' => ['required', 'string', 'max:100'],
            'bank_account_name' => ['required', 'string', 'max:255'],
            'bank_account_number' => ['required', 'string', 'max:50'],
            'bank_name' => ['required', 'string', 'max:255'],
            'bank_branch' => ['nullable', 'string', 'max:255'],
            
            // Owner Information
            'owner_name' => ['required', 'string', 'max:255'],
            'owner_phone' => ['required', 'string', 'max:20'],
            'owner_email' => ['required', 'email', 'max:255'],
            'owner_id_type' => ['required', 'string', 'max:50'],
            'owner_id_number' => ['required', 'string', 'max:50'],
            
            // Operational Information
            'opening_time' => ['required', 'date_format:H:i'],
            'closing_time' => ['required', 'date_format:H:i', 'after:opening_time'],
            'seating_capacity' => ['nullable', 'integer', 'min:1'],
            'delivery_available' => ['boolean'],
            'pickup_available' => ['boolean'],
            'delivery_radius' => ['nullable', 'numeric', 'min:0', 'required_if:delivery_available,true'],
            'minimum_order' => ['nullable', 'numeric', 'min:0'],
            'delivery_fee' => ['nullable', 'numeric', 'min:0', 'required_if:delivery_available,true'],
            
            'files' => ['nullable', 'array'],
            'files.business_license' => ['nullable', 'array'],
            'files.business_license.uuid' => ['nullable', 'string', 'exists:files,uuid'],
            'files.owner_id' => ['nullable', 'array'],
            'files.owner_id.uuid' => ['nullable', 'string', 'exists:files,uuid'],
            'files.restaurant_photos' => ['nullable', 'array'],
            'files.restaurant_photos.*.uuid' => ['nullable', 'string', 'exists:files,uuid'],
            
            // Terms
            'terms_accepted' => ['required', 'accepted'],
        ];
    }

    public function messages(): array
    {
        return [
            'terms_accepted.accepted' => 'You must accept the terms and conditions',
            'delivery_radius.required_if' => 'Delivery radius is required when delivery is available',
            'delivery_fee.required_if' => 'Delivery fee is required when delivery is available',
            'restaurant_photos.min' => 'Please upload at least one restaurant photo',
            'restaurant_photos.max' => 'You can upload maximum 5 restaurant photos',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'delivery_available' => $this->boolean('delivery_available'),
            'pickup_available' => $this->boolean('pickup_available'),
            'terms_accepted' => $this->boolean('terms_accepted'),
        ]);
    }
} 