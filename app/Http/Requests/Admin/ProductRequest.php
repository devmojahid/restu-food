<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'restaurant_id' => ['required', 'exists:restaurants,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable', 
                'string', 
                'max:255',
                Rule::unique('products')->ignore($this->product)
            ],
            'sku' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('products')->ignore($this->product)
            ],
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'price' => ['required', 'numeric', 'min:0'],
            'cost_per_item' => ['nullable', 'numeric', 'min:0'],
            'discounted_price' => ['nullable', 'numeric', 'min:0', 'lt:price'],
            'sale_price_from' => ['nullable', 'date'],
            'sale_price_to' => ['nullable', 'date', 'after:sale_price_from'],
            'nutritional_info' => ['nullable', 'array'],
            'is_featured' => ['boolean'],
            'is_taxable' => ['boolean'],
            'tax_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'status' => ['required', 'in:active,inactive'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'weight' => ['nullable', 'numeric', 'min:0'],
            'length' => ['nullable', 'numeric', 'min:0'],
            'width' => ['nullable', 'numeric', 'min:0'],
            'height' => ['nullable', 'numeric', 'min:0'],
            
            // Related data
            'categories' => ['nullable', 'array'],
            'categories.*' => ['exists:categories,id'],
            
            'variants' => ['nullable', 'array'],
            'variants.*.name' => ['required', 'string', 'max:255'],
            'variants.*.price' => ['required', 'numeric', 'min:0'],
            
            'specifications' => ['nullable', 'array'],
            'specifications.*' => ['string', 'max:255'],
            
            'metadata' => ['nullable', 'array'],
            'metadata.*' => ['nullable'],
        ];

        return $rules;
    }

    public function messages(): array
    {
        return [
            'restaurant_id.required' => 'The restaurant field is required.',
            'restaurant_id.exists' => 'The selected restaurant is invalid.',
            'discounted_price.lt' => 'The discounted price must be less than the regular price.',
            'sale_price_to.after' => 'The sale end date must be after the start date.',
            'variants.*.name.required' => 'Each variant must have a name.',
            'variants.*.price.required' => 'Each variant must have a price.',
        ];
    }
} 