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
            // Hero Section - General
            'hero_enabled' => 'boolean',
            'hero_type' => 'nullable|string|in:single,slider',
            'hero_background_overlay' => 'nullable|numeric|between:0,1',
            'hero_text_alignment' => 'nullable|string|in:left,center,right',
            
            // Hero Section - Single
            'hero_title' => 'nullable|string|max:200',
            'hero_subtitle' => 'nullable|string|max:500',
            'hero_image' => ['nullable', 'array'],
            'hero_image.uuid' => ['nullable', 'string', 'exists:files,uuid'],
            'hero_image.id' => ['nullable', 'integer', 'exists:files,id'],
            'hero_image.collection' => ['nullable', 'string'],
            'hero_image.filename' => ['nullable', 'string', 'exists:files,filename'],
            'hero_image.url' => ['nullable', 'string', 'url'],
            'hero_image.size' => ['nullable', 'integer', 'min:0'],
            'hero_image.mime_type' => ['nullable', 'string', 'in:image/jpeg,image/png,image/gif'],
            'hero_image.original_name' => ['nullable', 'string', 'max:255'],
            'hero_cta_text' => 'nullable|string|max:50',
            'hero_cta_link' => 'nullable|string|max:200',
            
            // Hero Section - Slider (Fixed validation rules)
            'hero_slides' => 'nullable|array',
            'hero_slides.*' => 'array', // Each slide must be an array
            'hero_slides.*.id' => 'nullable',
            'hero_slides.*.title' => 'nullable|string|max:200',
            'hero_slides.*.description' => 'nullable|string|max:500',
            'hero_slides.*.image' => 'nullable', // Can be file or URL
            'hero_slides.*.cta' => 'nullable|array',
            'hero_slides.*.cta.text' => 'nullable|string|max:50',
            'hero_slides.*.cta.link' => 'nullable|string|max:200',

            // Featured Restaurants Section
            'top_restaurants_enabled' => 'boolean',
            'top_restaurants_title' => 'nullable|string|max:200',
            'top_restaurants_count' => 'nullable|integer|min:1|max:20',
            'top_restaurants_layout' => 'nullable|string|in:grid,carousel',
            'top_restaurants_columns' => 'nullable|integer',
            'top_restaurants_show_description' => 'boolean',

            // Top Categories Section
            'top_categories_enabled' => 'boolean',
            'top_categories_title' => 'nullable|string|max:200',
            'top_categories_count' => 'nullable|integer|min:1|max:20',
            'top_categories_show_filter' => 'boolean',
            'top_categories_show_description' => 'boolean',
            'top_categories_columns' => 'nullable|integer',
            'selected_top_categories' => 'nullable|array',
            'selected_top_categories.*' => 'exists:categories,id',

            // Features Dishes Section
            'features_dishes_enabled' => 'boolean',
            'features_dishes_title' => 'nullable|string|max:200',
            'features_dishes_count' => 'nullable|integer|min:1|max:20',
            'features_dishes_show_filter' => 'boolean',
            'features_dishes_show_description' => 'boolean',
            'features_dishes_columns' => 'nullable|integer',
            'selected_features_dishes' => 'nullable|array',
            'selected_features_dishes.*' => 'exists:categories,id',

            // Popular Dishes Section
            'popular_dishes_enabled' => 'boolean',
            'popular_dishes_title' => 'nullable|string|max:200',
            'popular_dishes_count' => 'nullable|integer|min:1|max:20',
            'popular_dishes_show_filter' => 'boolean',
            'popular_dishes_show_description' => 'boolean',
            'popular_dishes_columns' => 'nullable|integer',
            'selected_popular_dishes' => 'nullable|array',
            'selected_popular_dishes.*' => 'exists:categories,id',

            // Global Settings
            'layout_width' => 'nullable|string|in:contained,full',
            'section_spacing' => 'nullable|string|in:small,medium,large',
            'color_scheme' => 'nullable|string|in:light,dark,system',
            'font_heading' => 'nullable|string|in:inter,roboto,poppins,montserrat,open-sans',
            'font_body' => 'nullable|string|in:inter,roboto,poppins,open-sans',
        ];
    }

    public function messages(): array
    {
        return [
            'hero_slides.array' => 'Hero slides must be a valid array format.',
            'hero_slides.*.array' => 'Each hero slide must be properly formatted.',
            'hero_slides.*.title.max' => 'Hero slide title cannot exceed 200 characters.',
            'hero_slides.*.description.max' => 'Hero slide description cannot exceed 500 characters.',
            'hero_slides.*.cta.text.max' => 'CTA text cannot exceed 50 characters.',
            'hero_slides.*.cta.link.max' => 'CTA link cannot exceed 200 characters.',
            'hero_background_overlay.between' => 'Background overlay must be between 0 and 1.',
            'hero_text_alignment.in' => 'Text alignment must be left, center, or right.',
            'feedbacks.*.rating.between' => 'Rating must be between 1 and 5',
            'hero_slides.*.title.required_with' => 'Slide title is required',
        ];
    }
    
    protected function prepareForValidation()
    {
        // Clean up hero_slides data if it exists
        if ($this->has('hero_slides') && is_array($this->hero_slides)) {
            $cleanedSlides = [];
            
            foreach ($this->hero_slides as $slide) {
                if (is_array($slide)) {
                    // Ensure CTA is properly structured
                    if (isset($slide['cta']) && is_array($slide['cta'])) {
                        $slide['cta'] = [
                            'text' => $slide['cta']['text'] ?? '',
                            'link' => $slide['cta']['link'] ?? ''
                        ];
                    }
                    
                    $cleanedSlides[] = $slide;
                }
            }
            
            $this->merge([
                'hero_slides' => $cleanedSlides
            ]);
        }

        // Convert string boolean values to actual booleans
        $booleanFields = [
            'hero_enabled',
            'top_categories_enabled', 
            'top_restaurants_enabled',
            'top_restaurants_show_description',
            // Top Categories Section
            'top_categories_show_filter',
            'top_categories_show_description',
            // Features Dishes Section
            'features_dishes_enabled',
            'features_dishes_show_filter',
            'features_dishes_show_description',
            // Popular Dishes Section
            'popular_dishes_enabled',
            'popular_dishes_show_filter',
            'popular_dishes_show_description',
        ];

        foreach ($booleanFields as $field) {
            if ($this->has($field)) {
                $value = $this->input($field);
                if (is_string($value)) {
                    $this->merge([
                        $field => filter_var($value, FILTER_VALIDATE_BOOLEAN)
                    ]);
                }
            }
        }

        // Ensure numeric fields are properly typed
        if ($this->has('hero_background_overlay')) {
            $this->merge([
                'hero_background_overlay' => (float) $this->input('hero_background_overlay')
            ]);
        }
    }
}
