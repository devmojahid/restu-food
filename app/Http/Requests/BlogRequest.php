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
            'content' => 'nullable|string',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
            'user_id' => 'nullable|exists:users,id',
            
            // File validation
            'files' => 'nullable|array',
            'files.thumbnail' => 'nullable|array',
            'files.thumbnail.uuid' => 'nullable|string|exists:files,uuid',
            'files.featured_image' => 'nullable|array',
            'files.featured_image.uuid' => 'nullable|string|exists:files,uuid',
            'files.images' => 'nullable|array',
            'files.images.*.uuid' => 'nullable|string|exists:files,uuid',
            'files.videos' => 'nullable|array',
            'files.videos.*.uuid' => 'nullable|string|exists:files,uuid',
            'files.attachments' => 'nullable|array',
            'files.attachments.*.uuid' => 'nullable|string|exists:files,uuid',
        ];
    }
}
