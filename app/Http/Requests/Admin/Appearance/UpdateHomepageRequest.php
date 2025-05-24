<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin\Appearance;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHomepageRequest extends FormRequest
{
    public function authorize(): bool
    {
        // return $this->user()->can('update', 'appearance');
        return true;
    }

    public function rules(): array
    {
        return [
            // Hero Section - Single
            'hero_enabled' => 'boolean',
            'hero_type' => 'nullable|string|in:single,slider',
            'hero_title' => 'nullable|string|max:200',
            'hero_subtitle' => 'nullable|string|max:500',
            'hero_image' => 'nullable|image|max:2048',
            'hero_cta_text' => 'nullable|string|max:50',
            'hero_cta_link' => 'nullable|string|max:200',
            'hero_background_overlay' => 'nullable|numeric|between:0,1',
            'hero_text_alignment' => 'nullable|string|in:left,center,right',
            
            // Hero Section - Slider
            'hero_slides' => 'nullable|array',
            'hero_slides.*.id' => 'nullable',
            'hero_slides.*.title' => 'required_with:hero_slides|string|max:200',
            'hero_slides.*.description' => 'nullable|string|max:500',
            'hero_slides.*.image' => 'nullable',
            'hero_slides.*.cta.text' => 'nullable|string|max:50',
            'hero_slides.*.cta.link' => 'nullable|string|max:200',

            // Why Choose Us Section
            'why_choose_us_enabled' => 'boolean',
            'why_choose_us_title' => 'nullable|string|max:200',
            'why_choose_us_text' => 'nullable|string|max:500',
            'why_choose_us_image' => 'nullable|image|max:2048',
            'why_choose_us_layout' => 'nullable|string|in:side-by-side,stacked',
            'why_choose_us_image_position' => 'nullable|string|in:left,right',
            'why_choose_us_features' => 'nullable|array',
            'why_choose_us_features.*.title' => 'nullable|string|max:100',
            'why_choose_us_features.*.text' => 'nullable|string|max:500',
            'why_choose_us_features.*.icon' => 'nullable|string|max:50',

            // Top Categories Section
            'top_categories_enabled' => 'boolean',
            'top_categories_title' => 'nullable|string|max:200',
            'top_categories_count' => 'nullable|integer|min:1|max:20',
            'top_categories_layout' => 'nullable|string|in:grid,carousel',
            'top_categories_columns' => 'nullable|integer|in:3,4,5,6',
            'top_categories_show_description' => 'boolean',

            // Client Feedback Section
            'client_feedback_enabled' => 'boolean',
            'client_feedback_title' => 'nullable|string|max:200',
            'client_feedback_subtitle' => 'nullable|string|max:500',
            'client_feedback_layout' => 'nullable|string|in:grid,carousel,masonry',
            'client_feedback_columns' => 'nullable|integer|in:2,3,4',
            'client_feedback_show_rating' => 'boolean',
            'client_feedback_show_date' => 'boolean',
            'feedbacks' => 'nullable|array',
            'feedbacks.*.name' => 'nullable|string|max:100',
            'feedbacks.*.rating' => 'nullable|integer|between:1,5',
            'feedbacks.*.review' => 'nullable|string|max:1000',
            'feedbacks.*.avatar' => 'nullable|image|max:1024',
            'feedbacks.*.date' => 'nullable|date',

            // Global Settings
            'layout_width' => 'nullable|string|in:contained,full',
            'section_spacing' => 'nullable|string|in:small,medium,large',
            'animations_enabled' => 'boolean',
            'scroll_animations' => 'boolean',
            'color_scheme' => 'nullable|string|in:light,dark,system',
            'primary_color' => 'nullable|string|regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/',
            'secondary_color' => 'nullable|string|regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/',
            'font_heading' => 'nullable|string|in:inter,roboto,poppins,montserrat,open-sans',
            'font_body' => 'nullable|string|in:inter,roboto,poppins,open-sans',
        ];
    }

    public function messages(): array
    {
        return [
            'hero_image.image' => 'Hero image must be a valid image file',
            'hero_image.max' => 'Hero image must not exceed 2MB',
            'feedbacks.*.rating.between' => 'Rating must be between 1 and 5',
            'primary_color.regex' => 'Invalid color format. Use hex color code (e.g., #FF0000)',
            'secondary_color.regex' => 'Invalid color format. Use hex color code (e.g., #00FF00)',
            'hero_slides.*.title.required_with' => 'Slide title is required',
        ];
    }
    
    protected function prepareForValidation(): void
    {
        if ($this->has('hero_enabled')) {
            $this->merge([
                'hero_enabled' => filter_var($this->hero_enabled, FILTER_VALIDATE_BOOLEAN),
            ]);
        }
        
        if ($this->has('why_choose_us_enabled')) {
            $this->merge([
                'why_choose_us_enabled' => filter_var($this->why_choose_us_enabled, FILTER_VALIDATE_BOOLEAN),
            ]);
        }
        
        if ($this->has('top_categories_enabled')) {
            $this->merge([
                'top_categories_enabled' => filter_var($this->top_categories_enabled, FILTER_VALIDATE_BOOLEAN),
            ]);
        }
        
        if ($this->has('client_feedback_enabled')) {
            $this->merge([
                'client_feedback_enabled' => filter_var($this->client_feedback_enabled, FILTER_VALIDATE_BOOLEAN),
            ]);
        }
    }
}
