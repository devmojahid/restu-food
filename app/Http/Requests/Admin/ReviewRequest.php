<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

final class ReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['nullable', 'string', 'max:255'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string', 'min:10'],
            'pros' => ['nullable', 'string'],
            'cons' => ['nullable', 'string'],
            'is_recommended' => ['boolean'],
            'images' => ['nullable', 'array'],
            'images.*' => ['array'],
            'parent_id' => ['nullable', 'exists:reviews,id'],
        ];
    }
} 