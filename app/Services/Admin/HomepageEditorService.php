<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\Category;
use App\Models\Restaurant;
use App\Models\Product;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

final class HomepageEditorService extends PageEditorService
{
    protected string $pageKey = 'homepage';

    protected function defineDefaultSettings(): array
    {
        return [
            // Hero Section
            'hero_enabled' => true,
            'hero_title' => 'Order [Delicious Food] Online',
            'hero_subtitle' => 'Get your favorite food delivered to your doorstep',
            'hero_image' => null,
            'hero_cta_text' => 'Order Now',
            'hero_cta_link' => '/restaurants',
            'hero_background_overlay' => 0.5,
            'hero_text_alignment' => 'center', // left, center, right

            // Top Categories Section
            'top_categories_enabled' => true,
            'top_categories_title' => 'Popular [Food] Categories',
            'top_categories_count' => 8,
            'top_categories_hover_bg' => null,
            'top_categories_layout' => 'grid', // grid, carousel
            'top_categories_columns' => 4, // 3, 4, 5, 6
            'top_categories_show_description' => true,
            'top_categories_animation' => 'fade', // none, fade, slide

            // Featured Restaurants Section
            'featured_restaurants_enabled' => true,
            'featured_restaurants_title' => 'Featured [Restaurants]',
            'featured_restaurants_subtitle' => 'Explore our partner restaurants',
            'featured_restaurants_count' => 8,
            'featured_restaurants_layout' => 'grid',
            'featured_restaurants_columns' => 4,
            'featured_restaurants_show_rating' => true,
            'featured_restaurants_show_cuisine' => true,
            'featured_restaurants_show_delivery_time' => true,
            'featured_restaurants_animation' => 'fade',

            // Why Choose Us Section
            'why_choose_us_enabled' => true,
            'why_choose_us_title' => 'Why [Choose] Us',
            'why_choose_us_text' => 'We offer the best food delivery service',
            'why_choose_us_image' => null,
            'why_choose_us_layout' => 'side-by-side', // side-by-side, stacked
            'why_choose_us_image_position' => 'right', // left, right
            'why_choose_us_features' => [
                [
                    'title' => 'Fast Delivery',
                    'text' => 'Get your food delivered within 30 minutes',
                    'icon' => 'truck'
                ],
                [
                    'title' => 'Quality Food',
                    'text' => 'We ensure the best quality food',
                    'icon' => 'utensils'
                ]
            ],

            // Client Feedback Section
            'client_feedback_enabled' => true,
            'client_feedback_title' => 'What Our [Customers] Say',
            'client_feedback_subtitle' => 'Read what our customers say about us',
            'client_feedback_layout' => 'grid', // grid, carousel, masonry
            'client_feedback_columns' => 3,
            'client_feedback_show_rating' => true,
            'client_feedback_show_date' => true,
            'feedbacks' => [],

            // Global Settings
            'layout_width' => 'contained', // contained, full
            'section_spacing' => 'medium', // small, medium, large
            'animations_enabled' => true,
            'scroll_animations' => true,
            'color_scheme' => 'system', // light, dark, system
            'primary_color' => '#22C55E',
            'secondary_color' => '#0EA5E9',
            'font_heading' => 'inter',
            'font_body' => 'inter',
        ];
    }

    protected function defineDynamicData(): array
    {
        return [
            'categories' => $this->getCategories(),
            'featured_restaurants' => $this->getFeaturedRestaurants(),
            'popular_products' => $this->getPopularProducts(),
            'layout_options' => $this->getLayoutOptions(),
            'animation_options' => $this->getAnimationOptions(),
            'icon_options' => $this->getIconOptions(),
            'font_options' => $this->getFontOptions(),
            'color_presets' => $this->getColorPresets(),
        ];
    }

    private function getCategories(): Collection
    {
        return Cache::remember('homepage_categories', 3600, function () {
            return Category::select('id', 'name', 'slug', 'icon', 'description', 'image')
                ->active()
                ->withCount('products')
                ->orderBy('position')
                ->get();
        });
    }

    private function getFeaturedRestaurants(): Collection
    {
        return Cache::remember('homepage_featured_restaurants', 3600, function () {
            return Restaurant::select(
                'id',
                'name',
                'slug',
                'logo',
                'cover_image',
                'delivery_time',
                'rating'
            )
                ->active()
                ->featured()
                ->with([
                    'categories:id,name',
                    'cuisines:id,name',
                    'reviews' => fn($q) => $q->latest()->take(3)
                ])
                ->withCount('reviews')
                ->withAvg('reviews', 'rating')
                ->take(8)
                ->get();
        });
    }

    private function getPopularProducts(): Collection
    {
        return Cache::remember('homepage_popular_products', 3600, function () {
            return Product::select(
                'id',
                'name',
                'slug',
                'image',
                'price',
                'sale_price',
                'rating'
            )
                ->active()
                ->popular()
                ->with([
                    'restaurant:id,name,slug',
                    'category:id,name,slug',
                    'reviews' => fn($q) => $q->latest()->take(3)
                ])
                ->withCount('reviews')
                ->withAvg('reviews', 'rating')
                ->take(8)
                ->get();
        });
    }

    private function getLayoutOptions(): array
    {
        return [
            'grid' => [
                'label' => 'Grid Layout',
                'columns' => [3, 4, 5, 6],
                'gaps' => ['small', 'medium', 'large'],
            ],
            'carousel' => [
                'label' => 'Carousel Layout',
                'slides_per_view' => [2, 3, 4, 5],
                'spacing' => ['small', 'medium', 'large'],
                'autoplay' => true,
                'navigation' => true,
                'pagination' => true,
            ],
            'masonry' => [
                'label' => 'Masonry Layout',
                'columns' => [2, 3, 4],
                'gaps' => ['small', 'medium', 'large'],
            ],
        ];
    }

    private function getAnimationOptions(): array
    {
        return [
            'none' => 'No Animation',
            'fade' => 'Fade In',
            'slide-up' => 'Slide Up',
            'slide-down' => 'Slide Down',
            'slide-left' => 'Slide Left',
            'slide-right' => 'Slide Right',
            'zoom-in' => 'Zoom In',
            'zoom-out' => 'Zoom Out',
        ];
    }

    private function getIconOptions(): array
    {
        return [
            'truck' => 'Delivery Truck',
            'utensils' => 'Utensils',
            'clock' => 'Clock',
            'shield' => 'Shield',
            'star' => 'Star',
            'heart' => 'Heart',
            'phone' => 'Phone',
            'map' => 'Map',
        ];
    }

    private function getFontOptions(): array
    {
        return [
            'heading_fonts' => [
                ['value' => 'inter', 'label' => 'Inter'],
                ['value' => 'roboto', 'label' => 'Roboto'],
                ['value' => 'poppins', 'label' => 'Poppins'],
                ['value' => 'montserrat', 'label' => 'Montserrat'],
                ['value' => 'open-sans', 'label' => 'Open Sans'],
            ],
            'body_fonts' => [
                ['value' => 'inter', 'label' => 'Inter'],
                ['value' => 'roboto', 'label' => 'Roboto'],
                ['value' => 'poppins', 'label' => 'Poppins'],
                ['value' => 'open-sans', 'label' => 'Open Sans'],
            ]
        ];
    }

    private function getColorPresets(): array
    {
        return [
            'modern' => [
                'primary' => '#22C55E',
                'secondary' => '#0EA5E9',
                'accent' => '#F59E0B',
            ],
            'classic' => [
                'primary' => '#2563EB',
                'secondary' => '#4F46E5',
                'accent' => '#EC4899',
            ],
            'minimal' => [
                'primary' => '#18181B',
                'secondary' => '#27272A',
                'accent' => '#71717A',
            ],
        ];
    }

    protected function handleFileUpload(UploadedFile $file): string
    {
        $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
        return $file->storeAs("homepage/{$this->getFileType($file)}", $filename, 'public');
    }

    protected function getFileType(UploadedFile $file): string
    {
        return match ($file->getMimeType()) {
            'image/jpeg', 'image/png', 'image/gif' => 'images',
            'video/mp4', 'video/quicktime' => 'videos',
            default => 'others',
        };
    }

    protected function handleSectionFileUpload(string $section, UploadedFile $file): string
    {
        $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
        return $file->storeAs(
            "homepage/sections/{$section}/{$this->getFileType($file)}",
            $filename,
            'public'
        );
    }

    public function updateSection(string $sectionId, array $data, array $files = []): void
    {
        $sectionData = $this->processSectionData($sectionId, $data, $files);
        $this->updateSettings([$sectionId => $sectionData], []);
    }

    private function processSectionData(string $sectionId, array $data, array $files): array
    {
        return match ($sectionId) {
            'hero' => $this->processHeroSection($data, $files),
            'why_choose_us' => $this->processWhyChooseUsSection($data, $files),
            'client_feedback' => $this->processClientFeedbackSection($data, $files),
            default => $data,
        };
    }

    private function processHeroSection(array $data, array $files): array
    {
        if (isset($files['hero_image'])) {
            $data['hero_image'] = $this->handleSectionFileUpload('hero', $files['hero_image']);
        }

        return array_merge($this->getDefaultHeroSettings(), $data);
    }

    private function processWhyChooseUsSection(array $data, array $files): array
    {
        if (isset($files['why_choose_us_image'])) {
            $data['why_choose_us_image'] = $this->handleSectionFileUpload(
                'why_choose_us',
                $files['why_choose_us_image']
            );
        }

        // Process features
        if (isset($data['features'])) {
            $data['features'] = array_map(function ($feature) {
                return array_merge($this->getDefaultFeatureSettings(), $feature);
            }, $data['features']);
        }

        return array_merge($this->getDefaultWhyChooseUsSettings(), $data);
    }

    private function processClientFeedbackSection(array $data, array $files): array
    {
        if (isset($data['feedbacks'])) {
            $data['feedbacks'] = array_map(function ($feedback, $index) use ($files) {
                if (isset($files["feedbacks.{$index}.avatar"])) {
                    $feedback['avatar'] = $this->handleSectionFileUpload(
                        'client_feedback',
                        $files["feedbacks.{$index}.avatar"]
                    );
                }
                return array_merge($this->getDefaultFeedbackSettings(), $feedback);
            }, $data['feedbacks'], array_keys($data['feedbacks']));
        }

        return array_merge($this->getDefaultClientFeedbackSettings(), $data);
    }

    private function getDefaultHeroSettings(): array
    {
        return [
            'enabled' => true,
            'title' => '',
            'subtitle' => '',
            'image' => null,
            'cta_text' => '',
            'cta_link' => '',
            'overlay_opacity' => 0.5,
            'text_alignment' => 'center',
        ];
    }

    private function getDefaultWhyChooseUsSettings(): array
    {
        return [
            'enabled' => true,
            'title' => '',
            'text' => '',
            'image' => null,
            'layout' => 'side-by-side',
            'image_position' => 'right',
            'features' => [],
        ];
    }

    private function getDefaultFeatureSettings(): array
    {
        return [
            'title' => '',
            'text' => '',
            'icon' => 'star',
        ];
    }

    private function getDefaultClientFeedbackSettings(): array
    {
        return [
            'enabled' => true,
            'title' => '',
            'subtitle' => '',
            'layout' => 'grid',
            'columns' => 3,
            'show_rating' => true,
            'show_date' => true,
            'feedbacks' => [],
        ];
    }

    private function getDefaultFeedbackSettings(): array
    {
        return [
            'name' => '',
            'rating' => 5,
            'review' => '',
            'avatar' => null,
            'date' => now()->toDateString(),
        ];
    }
}
