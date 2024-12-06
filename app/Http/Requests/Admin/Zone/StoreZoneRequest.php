<?php

namespace App\Http\Requests\Admin\Zone;

use Illuminate\Foundation\Http\FormRequest;

class StoreZoneRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:zones,name'],
            'display_name' => ['required', 'string', 'max:255'],
            'coordinates' => ['required', 'array', 'min:3'],
            'coordinates.*.lat' => ['required', 'numeric'],
            'coordinates.*.lng' => ['required', 'numeric'],
            'is_active' => ['boolean'],
            'delivery_charges' => ['required', 'array'],
            'delivery_charges.min_charge' => ['required', 'numeric', 'min:0'],
            'delivery_charges.max_charge' => ['required', 'numeric', 'min:0', 'gte:delivery_charges.min_charge'],
            'delivery_charges.per_km_charge' => ['required', 'numeric', 'min:0'],
            'delivery_charges.max_cod_amount' => ['required', 'numeric', 'min:0'],
            'delivery_charges.increase_percentage' => ['nullable', 'integer', 'min:0', 'max:100'],
            'delivery_charges.increase_message' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages()
    {
        return [
            'coordinates.min' => 'Please draw a valid zone area with at least 3 points',
            'delivery_charges.max_charge.gte' => 'Maximum charge must be greater than or equal to minimum charge',
        ];
    }
} 