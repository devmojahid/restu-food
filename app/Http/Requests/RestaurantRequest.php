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
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('restaurants')->ignore($this->restaurant?->id),
            ],
            'description' => ['nullable', 'string'],
            'address' => ['required', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'phone' => ['nullable', 'string', 'max:20'],
            'email' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('restaurants')->ignore($this->restaurant?->id),
            ],
            'status' => ['required', 'in:active,inactive,pending,suspended'],
            'is_featured' => ['boolean'],
            'opening_hours' => ['nullable', 'array'],
            'opening_time' => ['required', 'date_format:H:i'],
            'closing_time' => ['required', 'date_format:H:i', 'after:opening_time'],
            'delivery_radius' => ['nullable', 'numeric', 'min:0'],
            'minimum_order' => ['nullable', 'numeric', 'min:0'],
            'delivery_fee' => ['nullable', 'numeric', 'min:0'],
            'commission_rate' => ['nullable', 'numeric', 'between:0,100'],
            
            // File uploads
            'logo' => ['nullable', 'array'],
            'logo.uuid' => ['required_with:logo', 'string'],
            'banner' => ['nullable', 'array'],
            'banner.uuid' => ['required_with:banner', 'string'],
            'gallery' => ['nullable', 'array'],
            'gallery.*.uuid' => ['required', 'string'],
        ];

        return $rules;
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Restaurant name is required.',
            'slug.unique' => 'This restaurant slug is already taken.',
            'email.unique' => 'This email is already registered.',
            'opening_time.required' => 'Opening time is required.',
            'closing_time.required' => 'Closing time is required.',
            'closing_time.after' => 'Closing time must be after opening time.',
        ];
    }
} 