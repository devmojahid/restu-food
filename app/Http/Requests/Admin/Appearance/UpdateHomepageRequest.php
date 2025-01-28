<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin\Appearance;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHomepageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', 'appearance');
    }

    public function rules(): array
    {
        return [
            'options' => 'required|array',
            'options.*.key' => 'required|string',
            'options.*.value' => 'nullable',
            
            // Hero Section
            'hero_image' => 'nullable|image|max:2048',
            'hero_title' => 'nullable|string|max:200',
            'hero_subtitle' => 'nullable|string|max:500',
            'hero_cta_text' => 'nullable|string|max:50',
            'hero_cta_link' => 'nullable|string|max:200',
            'hero_background_overlay' => 'nullable|numeric|between:0,1',
            
            // Why Choose Us Section
            'why_choose_us_image' => 'nullable|image|max:2048',
            'why_choose_us_features' => 'nullable|array',
            'why_choose_us_features.*.title' => 'required_with:why_choose_us_features|string|max:100',
            'why_choose_us_features.*.text' => 'required_with:why_choose_us_features|string|max:500',
            'why_choose_us_features.*.icon' => 'required_with:why_choose_us_features|string|max:50',
            
            // Client Feedback Section
            'feedbacks' => 'nullable|array',
            'feedbacks.*.name' => 'required_with:feedbacks|string|max:100',
            'feedbacks.*.rating' => 'required_with:feedbacks|integer|between:1,5',
            'feedbacks.*.review' => 'required_with:feedbacks|string|max:1000',
            'feedbacks.*.avatar' => 'nullable|image|max:1024',
            
            // Global Settings
            'layout_width' => 'nullable|in:contained,full',
            'section_spacing' => 'nullable|in:small,medium,large',
            'color_scheme' => 'nullable|in:light,dark,system',
            'primary_color' => 'nullable|string|regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/',
            'secondary_color' => 'nullable|string|regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/',
            'font_heading' => 'nullable|string|in:inter,roboto,poppins,montserrat,open-sans',
            'font_body' => 'nullable|string|in:inter,roboto,poppins,open-sans',
        ];
    }

    public function messages(): array
    {
        return [
            'options.required' => 'No settings were provided',
            'options.*.key.required' => 'Setting key is required',
            'hero_image.image' => 'Hero image must be a valid image file',
            'hero_image.max' => 'Hero image must not exceed 2MB',
            'feedbacks.*.rating.between' => 'Rating must be between 1 and 5',
            'primary_color.regex' => 'Invalid color format. Use hex color code (e.g., #FF0000)',
            'secondary_color.regex' => 'Invalid color format. Use hex color code (e.g., #00FF00)',
        ];
    }
} 