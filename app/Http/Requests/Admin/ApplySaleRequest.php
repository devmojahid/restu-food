<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

final class ApplySaleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sale_price' => ['required', 'numeric', 'min:0', 'lt:product.price'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after:start_date'],
        ];
    }

    public function messages(): array
    {
        return [
            'sale_price.lt' => 'The sale price must be less than the regular price.',
            'end_date.after' => 'The end date must be after the start date.',
        ];
    }
} 