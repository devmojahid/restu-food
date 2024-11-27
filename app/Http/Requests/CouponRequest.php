<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class CouponRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('coupons')->ignore($this->coupon),
            ],
            'type' => ['required', 'in:percentage,fixed'],
            'value' => ['required', 'numeric', 'min:0'],
            'min_order_value' => ['nullable', 'numeric', 'min:0'],
            'max_uses' => ['nullable', 'integer', 'min:1'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'is_active' => ['boolean'],
            'description' => ['nullable', 'string'],
            'max_discount_amount' => ['nullable', 'numeric', 'min:0'],
            'user_type' => ['nullable', 'in:all,new,existing'],
            'usage_limit_per_user' => ['nullable', 'integer', 'min:1'],
            'exclude_sale_items' => ['boolean'],
            'exclude_categories' => ['nullable', 'array'],
            'include_categories' => ['nullable', 'array'],
            'exclude_products' => ['nullable', 'array'],
            'include_products' => ['nullable', 'array'],
            'min_items_count' => ['nullable', 'integer', 'min:1'],
        ];

        // Additional validation for percentage type
        if ($this->input('type') === 'percentage') {
            $rules['value'][] = 'max:100';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'code.required' => 'The coupon code is required.',
            'code.unique' => 'This coupon code is already in use.',
            'value.required' => 'The coupon value is required.',
            'value.max' => 'The percentage value cannot be greater than 100.',
            'end_date.after_or_equal' => 'The end date must be after or equal to the start date.',
        ];
    }
} 