<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class RestaurantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'address' => ['required', 'string'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'phone' => ['required', 'string', 'max:20'],
            'email' => ['required', 'email', 'max:255'],
            'status' => ['required', Rule::in(['active', 'inactive', 'pending', 'suspended'])],
            'is_featured' => ['boolean'],
            'opening_hours' => ['nullable', 'array'],
            'delivery_radius' => ['nullable', 'numeric', 'min:0'],
            'minimum_order' => ['nullable', 'numeric', 'min:0'],
            'delivery_fee' => ['nullable', 'numeric', 'min:0'],
            'commission_rate' => ['nullable', 'numeric', 'between:0,100'],
            'meta' => ['nullable', 'array'],
            'files' => ['nullable', 'array'],
            'files.logo' => ['nullable', 'array'],
            'files.logo.uuid' => ['nullable', 'string', 'exists:files,uuid'],
            'files.banner' => ['nullable', 'array'],
            'files.banner.uuid' => ['nullable', 'string', 'exists:files,uuid'],
        ];

        return $rules;
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Restaurant name is required.',
            'address.required' => 'Restaurant address is required.',
            'latitude.required' => 'Latitude is required.',
            'longitude.required' => 'Longitude is required.',
            'phone.required' => 'Phone number is required.',
            'email.required' => 'Email address is required.',
            'email.email' => 'Please enter a valid email address.',
            'status.required' => 'Status is required.',
            'status.in' => 'Invalid status selected.',
        ];
    }
} 