<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class CategoryRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                Rule::unique('categories')->ignore($this->category)
            ],
            'type' => ['required', 'string', 'in:blog,food'],
            'parent_id' => [
                'nullable',
                'exists:categories,id',
                function ($attribute, $value, $fail) {
                    if ($this->category && $value == $this->category->id) {
                        $fail('A category cannot be its own parent.');
                    }
                }
            ],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:2048'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer'],
            'meta_data' => ['nullable', 'array'],
        ];
    }
}
