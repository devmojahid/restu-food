<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class CategoryRequest extends FormRequest
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
                'nullable',
                'string',
                'max:255',
            ],
            'description' => ['nullable', 'string'],
            'parent_id' => [
                'nullable',
                'exists:categories,id',
                function ($attribute, $value, $fail) {
                    if ($this->category && $value == $this->category->id) {
                        $fail('A category cannot be its own parent.');
                    }
                },
            ],
            'type' => ['required', 'string', 'max:50'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
            'settings' => ['nullable', 'array'],
            'files' => ['nullable', 'array'],
            'files.icon' => ['nullable', 'array'],
            'files.thumbnail' => ['nullable', 'array'],
        ];

        return $rules;
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The category name is required.',
            'name.max' => 'The category name cannot exceed 255 characters.',
            'slug.unique' => 'This slug is already in use.',
            'parent_id.exists' => 'The selected parent category does not exist.',
            'type.required' => 'The category type is required.',
        ];
    }
}
