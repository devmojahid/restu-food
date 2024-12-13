<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin\Delivery;

use Illuminate\Foundation\Http\FormRequest;

final class UpdateLocationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'delivery_id' => 'required|integer|exists:deliveries,id',
            'order_id' => 'required|integer|exists:orders,id',
            'location' => 'required|array',
            'location.lat' => 'required|numeric|between:-90,90',
            'location.lng' => 'required|numeric|between:-180,180',
            'metadata' => 'sometimes|array',
            'metadata.speed' => 'sometimes|numeric',
            'metadata.heading' => 'sometimes|numeric',
            'metadata.accuracy' => 'sometimes|numeric',
        ];
    }
} 