<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Appearance;

use App\Http\Controllers\Controller;
use App\Services\Admin\OptionsService;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

final class HomepageController extends Controller
{
    public function __construct(
        private readonly OptionsService $optionsService
    ) {}

    public function index(): Response
    {
        try {
            // Clear cache to ensure fresh data
            $this->optionsService->flushCache();
            
            // Get homepage-specific options
            $homepageOptions = $this->optionsService->getGroupKeyValues('homepage');
            
            // Default settings for homepage sections
            $defaults = [
                // Hero Section
                'hero_section_enabled' => true,
                'hero_title' => 'Welcome to Our Food Delivery',
                'hero_subtitle' => 'Order food from your favorite restaurants',
                'hero_background' => '',
                'hero_cta_text' => 'Order Now',
                'hero_cta_link' => '/restaurants',
                
                // Featured Restaurants Section
                'featured_restaurants_enabled' => true,
                'featured_restaurants_title' => 'Popular Restaurants',
                'featured_restaurants_subtitle' => 'Explore our top-rated restaurants',
                'featured_restaurants_count' => 6,
                'featured_restaurants_ids' => [],
                
                // Categories Section
                'categories_section_enabled' => true,
                'categories_title' => 'Food Categories',
                'categories_subtitle' => 'Browse by cuisine type',
                'categories_count' => 8,
                'categories_ids' => [],
                
                // Special Offers Section
                'offers_section_enabled' => true,
                'offers_title' => 'Special Offers',
                'offers_subtitle' => 'Great deals on popular items',
                'offers_count' => 4,
                
                // How It Works Section
                'how_it_works_enabled' => true,
                'how_it_works_title' => 'How It Works',
                'how_it_works_subtitle' => 'Order food in 3 simple steps',
                'how_it_works_steps' => [
                    [
                        'title' => 'Choose Restaurant',
                        'description' => 'Select from our list of restaurants',
                        'icon' => 'restaurant'
                    ],
                    [
                        'title' => 'Select Food',
                        'description' => 'Browse menus and select your items',
                        'icon' => 'food'
                    ],
                    [
                        'title' => 'Delivery',
                        'description' => 'Get your food delivered to your doorstep',
                        'icon' => 'delivery'
                    ]
                ],
                
                // Mobile App Section
                'app_section_enabled' => true,
                'app_section_title' => 'Get Our Mobile App',
                'app_section_subtitle' => 'Order food on the go with our mobile app',
                'app_store_link' => '',
                'play_store_link' => '',
                'app_screenshot' => '',
                
                // Newsletter Section
                'newsletter_enabled' => true,
                'newsletter_title' => 'Subscribe to Our Newsletter',
                'newsletter_subtitle' => 'Get updates on special offers and more',
                'newsletter_background' => '',
            ];

            // Merge defaults with saved options
            $mergedOptions = array_merge(
                $defaults,
                array_filter($homepageOptions, fn($value) => !empty($value))
            );

            return Inertia::render('Admin/Appearance/Homepage/Index', [
                'homepageOptions' => $mergedOptions,
                'defaults' => $defaults
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load homepage settings', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return Inertia::render('Admin/Appearance/Homepage/Index', [
                'homepageOptions' => $defaults,
                'defaults' => $defaults,
                'error' => 'Failed to load homepage settings'
            ]);
        }
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'options' => ['required', 'array'],
            'options.*.key' => ['required', 'string'],
            'options.*.value' => ['nullable'],
        ]);

        try {
            // Transform options array to key-value pairs
            $options = collect($validated['options'])->mapWithKeys(function ($item) {
                return [$item['key'] => $item['value'] ?? null];
            })->toArray();

            // Save options
            $this->optionsService->setMany($options, 'homepage');

            // Clear cache after saving
            $this->optionsService->flushCache();

            return back()->with('success', 'Homepage settings saved successfully');
        } catch (\Exception $e) {
            Log::error('Failed to save homepage settings', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->with('error', 'Failed to save homepage settings');
        }
    }
}
