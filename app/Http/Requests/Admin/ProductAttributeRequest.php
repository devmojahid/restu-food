<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class ProductAttributeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $attribute = $this->route('attribute');

        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('product_attributes', 'slug')->ignore($attribute?->id),
            ],
            'type' => ['required', 'string', 'in:select,color,button,radio'],
            'is_global' => ['boolean'],
            'is_visible' => ['boolean'],
            'is_variation' => ['boolean'],
            'sort_order' => ['integer'],
            'values' => ['required', 'array', 'min:1'],
            'values.*.value' => [
                'required', 
                'string', 
                'max:255',
                'distinct', // Ensure values are unique within the request
            ],
            'values.*.label' => ['nullable', 'string', 'max:255'],
            'values.*.color_code' => [
                Rule::requiredIf(fn() => $this->input('type') === 'color'),
                'nullable',
                'string',
                'max:255',
            ],
            'values.*.sort_order' => ['nullable', 'integer'],
        ];

        return $rules;
    }

    public function messages(): array
    {
        return [
            'values.required' => 'At least one value is required for the attribute.',
            'values.*.value.required' => 'Each value must have a name.',
            'values.*.color_code.required' => 'Color code is required for color attributes.',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->filled('name') && !$this->filled('slug')) {
            $this->merge([
                'slug' => str($this->name)->slug(),
            ]);
        }
    }
} 