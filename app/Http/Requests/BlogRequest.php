<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BlogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blogs,slug,' . $this->route('blog'),
            'content' => 'required|string',
            'is_published' => 'boolean',
            'user_id' => 'nullable',
            'published_at' => 'nullable|date',
        ];
    }
}
