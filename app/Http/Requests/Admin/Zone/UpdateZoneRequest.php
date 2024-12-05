<?php

namespace App\Http\Requests\Admin\Zone;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateZoneRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('zones')->ignore($this->zone)],
            'display_name' => ['required', 'string', 'max:255'],
            'coordinates' => ['required', 'array', 'min:3'],
            'coordinates.*.lat' => ['required', 'numeric'],
            'coordinates.*.lng' => ['required', 'numeric'],
            'is_active' => ['boolean'],
            'delivery_charges' => ['required', 'array'],
            'delivery_charges.min_charge' => ['required', 'numeric', 'min:0'],
            'delivery_charges.max_charge' => ['required', 'numeric', 'min:0'],
            'delivery_charges.per_km_charge' => ['required', 'numeric', 'min:0'],
            'delivery_charges.max_cod_amount' => ['required', 'numeric', 'min:0'],
            'delivery_charges.increase_percentage' => ['nullable', 'integer', 'min:0', 'max:100'],
            'delivery_charges.increase_message' => ['nullable', 'string', 'max:255'],
        ];
    }
} 