<?php

declare(strict_types=1);

namespace App\Services\Frontend;

use App\Models\Restaurant;
use App\Models\Product;
use App\Models\Option;
use App\Models\Category;
use App\Services\BaseService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Str;

final class HomeService extends BaseService
{
    /**
     * The key used for homepage settings
     */
    private const HOMEPAGE_OPTION_KEY = 'homepage_settings';

    /**
     * Get all data needed for the homepage
     */
    public function getHomePageData(): array
    {
        $homepageSettings = $this->getHomepageSettings();

        // Cache the data for 1 hour in production
        $cacheTtl = app()->environment('production') ? 3600 : 5;

        // return Cache::remember('home_page_data', $cacheTtl, function () use ($homepageSettings) {
        return [
            'heroSlides' => $this->getHeroSlides($homepageSettings),
            'featuredRestaurants' => $this->getFeaturedRestaurants(),
            'featuredDishes' => $this->getFeaturedDishes(),
            'popularDishes' => $this->getPopularDishes(),
            'specialOffers' => $this->getSpecialOffers(),
            'popularCategories' => $this->getPopularCategories($homepageSettings),
            'stats' => $this->getStats(),
            'nearbyRestaurants' => $this->getNearbyRestaurants(),
            'testimonials' => $this->getTestimonials($homepageSettings),
            'siteSettings' => [
                'layout_width' => $homepageSettings['layout_width'] ?? 'contained',
                'color_scheme' => $homepageSettings['color_scheme'] ?? 'system',
                'primary_color' => $homepageSettings['primary_color'] ?? '#22C55E',
                'secondary_color' => $homepageSettings['secondary_color'] ?? '#0EA5E9',
                'font_heading' => $homepageSettings['font_heading'] ?? 'inter',
                'font_body' => $homepageSettings['font_body'] ?? 'inter',
                'animations_enabled' => $homepageSettings['animations_enabled'] ?? true,
            ],
            'whyChooseUs' => [
                'enabled' => $homepageSettings['why_choose_us_enabled'] ?? true,
                'title' => $homepageSettings['why_choose_us_title'] ?? 'Why Choose Us',
                'text' => $homepageSettings['why_choose_us_text'] ?? 'We offer the best food delivery service',
                'image' => $homepageSettings['why_choose_us_image'] ?? null,
                'layout' => $homepageSettings['why_choose_us_layout'] ?? 'side-by-side',
                'image_position' => $homepageSettings['why_choose_us_image_position'] ?? 'right',
                'features' => $homepageSettings['why_choose_us_features'] ?? $this->getDefaultWhyChooseUsFeatures(),
            ],
        ];
        // });
    }

    /**
     * Get homepage settings from the database or defaults
     */
    private function getHomepageSettings(): array
    {
        // return Cache::remember('homepage_settings_frontend', 3600, function () {
        $settings = Option::where('key', self::HOMEPAGE_OPTION_KEY)->first()?->value;
        return $settings ?: [];
        // });
    }

    /**
     * Get hero slides from settings or defaults
     */
    private function getHeroSlides(array $settings): array
    {
        // Check if hero slides exist and are properly formatted
        if (isset($settings['hero_type']) && $settings['hero_type'] === 'slider' && !empty($settings['hero_slides']) && is_array($settings['hero_slides'])) {
            return array_map(function ($slide) {
                // Handle image - can be string, array, or null
                $image = '/images/hero/slide1.jpg'; // default fallback

                if (!empty($slide['image'])) {
                    if (is_string($slide['image'])) {
                        $image = $slide['image'];
                    } elseif (is_array($slide['image']) && isset($slide['image']['url'])) {
                        $image = $slide['image']['url'];
                    }
                }

                // Make sure image is a full URL only if it's a string and not already a full URL
                if (is_string($image) && !empty($image) && !Str::startsWith($image, ['http://', 'https://'])) {
                    $image = asset($image);
                }

                // Ensure cta is properly structured
                $cta = !empty($slide['cta']) && is_array($slide['cta']) ? $slide['cta'] : ['text' => 'Order Now', 'link' => '/menu'];

                return [
                    'id' => $slide['id'] ?? rand(1000, 9999),
                    'title' => $slide['title'] ?? '',
                    'description' => $slide['description'] ?? '',
                    'image' => $image,
                    'cta' => [
                        'text' => $cta['text'] ?? 'Order Now',
                        'link' => $cta['link'] ?? '/menu'
                    ]
                ];
            }, $settings['hero_slides']);
        }

        // Use single hero as a slide if it's specified as single type or type is not set
        if (!isset($settings['hero_type']) || $settings['hero_type'] === 'single') {
            // Handle hero_image - can be string, array, or null
            $heroImage = '/images/hero/slide1.jpg'; // default fallback

            if (!empty($settings['hero_image'])) {
                if (is_string($settings['hero_image'])) {
                    $heroImage = $settings['hero_image'];
                } elseif (is_array($settings['hero_image']) && isset($settings['hero_image']['url'])) {
                    $heroImage = $settings['hero_image']['url'];
                }
            }

            // Make sure image is a full URL only if it's a string and not already a full URL
            if (is_string($heroImage) && !empty($heroImage) && !Str::startsWith($heroImage, ['http://', 'https://'])) {
                $heroImage = asset($heroImage);
            }

            return [
                [
                    'id' => 1,
                    'title' => $settings['hero_title'] ?? 'Delicious Food Delivered To Your Doorstep',
                    'description' => $settings['hero_subtitle'] ?? 'Choose from thousands of restaurants and get your food delivered fast',
                    'image' => $heroImage,
                    'cta' => [
                        'text' => $settings['hero_cta_text'] ?? 'Order Now',
                        'link' => $settings['hero_cta_link'] ?? '/menu'
                    ]
                ]
            ];
        }

        // Fallback to default slides
        return [
            [
                'id' => 1,
                'title' => 'Delicious Food Delivered To Your Doorstep',
                'description' => 'Choose from thousands of restaurants and get your food delivered fast',
                'image' => asset('/images/hero/slide1.jpg'),
                'cta' => [
                    'text' => 'Order Now',
                    'link' => '/menu'
                ]
            ]
        ];
    }

    /**
     * Get featured restaurants from settings or defaults
     * @return array
     */
    private function getFeaturedRestaurants(): array
    {
        // Cache key for settings
        $cacheKey = 'featured_restaurants_' . auth()->id();
        
        // return cache()->remember($cacheKey, 300, function () { 
            $settings = $this->getHomepageSettings();

            if (isset($settings['top_restaurants_enabled']) && !$settings['top_restaurants_enabled']) {
                return [];
            }

            $limit = $settings['top_restaurants_count'] ?? 8;
            $title = $settings['top_restaurants_title'] ?? 'Featured Restaurants';
            $layout = $settings['top_restaurants_layout'] ?? 'grid';
            $columns = $settings['top_restaurants_columns'] ?? 4;

            $restaurants = Restaurant::select([
                    'id', 'name', 'slug', 'delivery_fee', 
                    'is_featured', 'created_at'
                ])
                ->with(['files'])
                ->where('status', 'active')
                ->where('is_featured', true)
                ->orderBy('created_at', 'desc')
                ->take($limit)
                ->get();

            $restaurantsData = $restaurants->map(function ($restaurant) {
                $files = $restaurant->files->keyBy('collection');
                
                return [
                    'id' => $restaurant->id,
                    'name' => $restaurant->name,
                    'slug' => $restaurant->slug,
                    'rating' => $restaurant->rating ?? 0,
                    'total_reviews' => $restaurant->total_reviews ?? 0,
                    'delivery_time' => $restaurant->delivery_time ?? 0,
                    'categories' => $restaurant->categories ?? [],
                    'is_featured' => $restaurant->is_featured ?? false,
                    'distance' => $restaurant->distance ?? 0,
                    'logo' => $files->get('logo') ? asset('storage/' . $files->get('logo')->path) : '/images/restaurants/default.jpg',
                    'image' => $files->get('banner') ? asset('storage/' . $files->get('banner')->path) : '/images/restaurants/default.jpg',
                    'gallery' => $restaurant->files->where('collection', 'gallery')
                        ->map(fn($file) => asset('storage/' . $file->path))
                        ->toArray(),
                ];
            })->toArray();

            $data = [
                'title' => $title,
                'layout' => $layout,
                'columns' => $columns,
                'restaurants' => $restaurantsData,
            ];

            return $data;
        // });
    }

    /**
     * Get popular categories for homepage display
     */
    private function getPopularCategories(array $settings): array
    {
        // Check if categories section is enabled
        if (!($settings['top_categories_enabled'] ?? true)) {
            return [];
        }

        $limit = isset($settings['top_categories_count']) ? (int)$settings['top_categories_count'] : 8;
        $selectedCategoryIds = $settings['selected_top_categories'] ?? [];

        try {
            $query = Category::where('is_active', true)
                ->where('type', 'product');
                // ->with(['restaurants' => function($query) {
                //     $query->where('is_active', true)->where('is_open', true);
                // }]);

            // If admin has selected specific categories, prioritize them
            if (!empty($selectedCategoryIds)) {
                $query->whereIn('id', $selectedCategoryIds)
                      ->orderByRaw('FIELD(id, ' . implode(',', $selectedCategoryIds) . ')');
            } else {
                // Otherwise, get latest active categories
                $query->orderBy('created_at', 'desc')
                      ->orderBy('sort_order', 'asc');
            }
            // dd($query->get());
            $categories = $query->take($limit)
                ->get()
                ->map(function ($category) {
                    $files = $category->files->keyBy('collection');
                    return [
                        'id' => $category->id,
                        'name' => $category->name,
                        'slug' => $category->slug,
                        // 'restaurants' => $category->restaurants->count(),
                        'image' => $files->get('icon') 
                            ? asset('storage/' . $files->get('icon')->path)
                            : asset('images/categories/default.jpg'),
                        'description' => $category->description ?? '',
                        'is_popular' => $category->is_popular ?? false,
                    ];
                })
                ->toArray();

            return $categories;

        } catch (\Exception $e) {
            Log::error('Categories fetch failed', [
                'error' => $e->getMessage(),
                'settings' => $settings
            ]);
            
            // return $this->getDefaultCategories($limit);
            return [];
        }
    }

    /**
     * Get testimonials from settings or defaults
     */
    private function getTestimonials(array $settings): array
    {
        // If client feedback section is disabled, return empty array
        if (isset($settings['client_feedback_enabled']) && !$settings['client_feedback_enabled']) {
            return [];
        }

        // If we have feedbacks in the settings, use them
        if (!empty($settings['feedbacks'])) {
            return array_map(function ($feedback) {
                // Make sure avatar is a full URL if present
                if (!empty($feedback['avatar']) && !Str::startsWith($feedback['avatar'], ['http://', 'https://'])) {
                    $feedback['avatar'] = asset($feedback['avatar']);
                }

                return [
                    'id' => $feedback['id'] ?? rand(1000, 9999),
                    'name' => $feedback['name'] ?? 'Anonymous',
                    'role' => $feedback['role'] ?? 'Customer',
                    'image' => $feedback['avatar'] ?? '/images/testimonials/default.jpg',
                    'rating' => $feedback['rating'] ?? 5,
                    'text' => $feedback['review'] ?? '',
                    'date' => $feedback['date'] ?? now()->subDays(rand(1, 30))->format('Y-m-d'),
                    'helpful_count' => $feedback['helpful_count'] ?? rand(10, 150),
                    'verified_purchase' => $feedback['verified_purchase'] ?? true,
                ];
            }, $settings['feedbacks']);
        }

        // Return default testimonials
        return $this->getDefaultTestimonials();
    }

    /**
     * Get default categories
     */
    private function getDefaultCategories(int $limit = 8): array
    {
        $allCategories = [
            [
                'id' => 1,
                'name' => 'Pizza',
                'slug' => 'pizza',
                'restaurants' => 45,
                'image' => '/images/categories/pizza.jpg',
                'description' => 'Delicious pizzas from your favorite restaurants'
            ],
            [
                'id' => 2,
                'name' => 'Burger',
                'slug' => 'burger',
                'restaurants' => 38,
                'image' => '/images/categories/burger.jpg',
                'description' => 'Juicy burgers with various toppings'
            ],
            [
                'id' => 3,
                'name' => 'Sushi',
                'slug' => 'sushi',
                'restaurants' => 25,
                'image' => '/images/categories/sushi.jpg',
                'description' => 'Fresh and authentic Japanese sushi'
            ],
            [
                'id' => 4,
                'name' => 'Desserts',
                'slug' => 'desserts',
                'restaurants' => 32,
                'image' => '/images/categories/desserts.jpg',
                'description' => 'Sweet treats to satisfy your cravings'
            ],
            [
                'id' => 5,
                'name' => 'Coffee',
                'slug' => 'coffee',
                'restaurants' => 28,
                'image' => '/images/categories/coffee.jpg',
                'description' => 'Premium coffee from top cafés'
            ],
            [
                'id' => 6,
                'name' => 'Salads',
                'slug' => 'salads',
                'restaurants' => 22,
                'image' => '/images/categories/salads.jpg',
                'description' => 'Fresh and healthy salad options'
            ],
            [
                'id' => 7,
                'name' => 'Sandwiches',
                'slug' => 'sandwiches',
                'restaurants' => 35,
                'image' => '/images/categories/sandwiches.jpg',
                'description' => 'Tasty sandwiches for any time of day'
            ],
            [
                'id' => 8,
                'name' => 'Drinks',
                'slug' => 'drinks',
                'restaurants' => 40,
                'image' => '/images/categories/drinks.jpg',
                'description' => 'Refreshing beverages and cocktails'
            ],
            [
                'id' => 9,
                'name' => 'Chinese',
                'slug' => 'chinese',
                'restaurants' => 30,
                'image' => '/images/categories/chinese.jpg',
                'description' => 'Authentic Chinese cuisine'
            ],
            [
                'id' => 10,
                'name' => 'Indian',
                'slug' => 'indian',
                'restaurants' => 28,
                'image' => '/images/categories/indian.jpg',
                'description' => 'Flavorful Indian dishes'
            ],
            [
                'id' => 11,
                'name' => 'Thai',
                'slug' => 'thai',
                'restaurants' => 20,
                'image' => '/images/categories/thai.jpg',
                'description' => 'Spicy and aromatic Thai food'
            ],
            [
                'id' => 12,
                'name' => 'Mexican',
                'slug' => 'mexican',
                'restaurants' => 25,
                'image' => '/images/categories/mexican.jpg',
                'description' => 'Authentic Mexican cuisine'
            ]
        ];

        return array_slice($allCategories, 0, $limit);
    }

    /**
     * Get default testimonials
     */
    private function getDefaultTestimonials(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Sarah Johnson',
                'role' => 'Food Enthusiast',
                'image' => '/images/testimonials/user1.jpg',
                'rating' => 5,
                'text' => "The food delivery service is exceptional! I love how I can track my order in real-time, and the food always arrives hot and fresh. The app is so user-friendly!",
                'date' => '2024-02-15',
                'helpful_count' => 128,
                'verified_purchase' => true
            ],
            [
                'id' => 2,
                'name' => 'Michael Chen',
                'role' => 'Regular Customer',
                'image' => '/images/testimonials/user2.jpg',
                'rating' => 5,
                'text' => "I've been using this service for months now, and I'm consistently impressed. The variety of restaurants is amazing, and the delivery drivers are always professional.",
                'date' => '2024-02-18',
                'helpful_count' => 95,
                'verified_purchase' => true
            ],
            [
                'id' => 3,
                'name' => 'Emily Rodriguez',
                'role' => 'Food Blogger',
                'image' => '/images/testimonials/user3.jpg',
                'rating' => 4,
                'text' => "Great selection of restaurants and prompt delivery service. The only reason for 4 stars is that I wish they had more vegan options. Otherwise, perfect!",
                'date' => '2024-02-20',
                'helpful_count' => 76,
                'verified_purchase' => true
            ]
        ];
    }

    /**
     * Get default "Why Choose Us" features
     */
    private function getDefaultWhyChooseUsFeatures(): array
    {
        return [
            [
                'title' => 'Fast Delivery',
                'text' => 'Get your food delivered within 30 minutes',
                'icon' => 'truck'
            ],
            [
                'title' => 'Quality Food',
                'text' => 'We ensure the best quality food',
                'icon' => 'utensils'
            ],
            [
                'title' => 'Best Prices',
                'text' => 'Affordable prices for quality meals',
                'icon' => 'tag'
            ]
        ];
    }


    // Keep the other methods as they are for now
    private function getFeaturedRestaurantsOld(): array
    {
        // Test data for featured restaurants
        return [
            [
                'id' => 1,
                'name' => 'Pizza Paradise',
                'slug' => 'pizza-paradise',
                'image' => '/images/restaurants/pizza-paradise.jpg',
                'rating' => 4.8,
                'total_reviews' => 245,
                'delivery_time' => '30-45',
                'price_range' => '$$',
                'categories' => ['Italian', 'Pizza'],
                'is_featured' => true,
                'distance' => 2.4,
                'is_open' => true
            ],
            [
                'id' => 2,
                'name' => 'Burger House',
                'slug' => 'burger-house',
                'image' => '/images/restaurants/burger-house.jpg',
                'rating' => 4.6,
                'total_reviews' => 189,
                'delivery_time' => '25-35',
                'price_range' => '$',
                'categories' => ['American', 'Burgers'],
                'is_featured' => true,
                'distance' => 1.8,
                'is_open' => true
            ],
            [
                'id' => 3,
                'name' => 'Sushi Master',
                'slug' => 'sushi-master',
                'image' => '/images/restaurants/sushi-master.jpg',
                'rating' => 4.9,
                'total_reviews' => 312,
                'delivery_time' => '40-50',
                'price_range' => '$$$',
                'categories' => ['Japanese', 'Sushi'],
                'is_featured' => true,
                'distance' => 3.2,
                'is_open' => true
            ],
            [
                'id' => 4,
                'name' => 'Taco Fiesta',
                'slug' => 'taco-fiesta',
                'image' => '/images/restaurants/taco-fiesta.jpg',
                'rating' => 4.5,
                'total_reviews' => 156,
                'delivery_time' => '20-30',
                'price_range' => '$',
                'categories' => ['Mexican', 'Tacos'],
                'is_featured' => true,
                'distance' => 1.5,
                'is_open' => false
            ],
            [
                'id' => 5,
                'name' => 'Thai Spice',
                'slug' => 'thai-spice',
                'image' => '/images/restaurants/thai-spice.jpg',
                'rating' => 4.7,
                'total_reviews' => 203,
                'delivery_time' => '35-45',
                'price_range' => '$$',
                'categories' => ['Thai', 'Asian'],
                'is_featured' => true,
                'distance' => 2.9,
                'is_open' => true
            ],
            [
                'id' => 6,
                'name' => 'Indian Curry House',
                'slug' => 'indian-curry-house',
                'image' => '/images/restaurants/indian-curry.jpg',
                'rating' => 4.6,
                'total_reviews' => 178,
                'delivery_time' => '30-40',
                'price_range' => '$$',
                'categories' => ['Indian', 'Curry'],
                'is_featured' => true,
                'distance' => 2.1,
                'is_open' => true
            ]
        ];
    }

    private function getFeaturedDishes(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Margherita Pizza',
                'slug' => 'margherita-pizza',
                'description' => 'Fresh tomatoes, mozzarella, basil, and our signature sauce on a crispy crust',
                'price' => 14.99,
                'image' => '/images/dishes/pizza.jpg',
                'restaurant' => [
                    'name' => 'Pizza Paradise',
                    'slug' => 'pizza-paradise'
                ],
                'rating' => 4.8,
                'preparation_time' => '20-25 mins',
                'calories' => '800',
                'discount' => 20,
                'isNew' => true,
                'isPopular' => true,
                'trending' => true,
                'vegetarian' => true,
                'spicy' => false,
                'orders' => 1250,
                'created_at' => '2024-02-20T10:00:00'
            ],
            [
                'id' => 2,
                'name' => 'Spicy Chicken Burger',
                'slug' => 'spicy-chicken-burger',
                'description' => 'Crispy chicken fillet with spicy sauce, fresh lettuce, and special mayo',
                'price' => 12.99,
                'image' => '/images/dishes/burger.jpg',
                'restaurant' => [
                    'name' => 'Burger House',
                    'slug' => 'burger-house'
                ],
                'rating' => 4.6,
                'preparation_time' => '15-20 mins',
                'calories' => '650',
                'discount' => null,
                'isNew' => false,
                'isPopular' => true,
                'trending' => true,
                'vegetarian' => false,
                'spicy' => true,
                'orders' => 980,
                'created_at' => '2024-02-19T15:30:00'
            ],
            [
                'id' => 3,
                'name' => 'Vegetable Sushi Roll',
                'slug' => 'vegetable-sushi-roll',
                'description' => 'Fresh vegetables wrapped in sushi rice and nori seaweed',
                'price' => 16.99,
                'image' => '/images/dishes/sushi.jpg',
                'restaurant' => [
                    'name' => 'Sushi Master',
                    'slug' => 'sushi-master'
                ],
                'rating' => 4.7,
                'preparation_time' => '25-30 mins',
                'calories' => '400',
                'discount' => 15,
                'isNew' => true,
                'isPopular' => false,
                'trending' => false,
                'vegetarian' => true,
                'spicy' => false,
                'orders' => 750,
                'created_at' => '2024-02-21T09:15:00'
            ],
            // Add more dishes as needed
        ];
    }

    private function getPopularDishes(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Margherita Pizza',
                'slug' => 'margherita-pizza',
                'description' => 'Fresh tomatoes, mozzarella, basil, and our signature sauce on a crispy crust',
                'price' => 14.99,
                'image' => '/images/dishes/pizza.jpg',
                'restaurant' => [
                    'name' => 'Pizza Paradise',
                    'slug' => 'pizza-paradise'
                ],
                'rating' => 4.8,
                'preparation_time' => '20 mins',
                'discount' => 20,
                'category' => 'Pizza',
                'isNew' => true,
                'isPopular' => true,
                'orders' => 1250
            ],
            [
                'id' => 2,
                'name' => 'Classic Burger',
                'slug' => 'classic-burger',
                'description' => 'Juicy beef patty with fresh lettuce, tomatoes, cheese, and special sauce',
                'price' => 12.99,
                'image' => '/images/dishes/burger.jpg',
                'restaurant' => [
                    'name' => 'Burger House',
                    'slug' => 'burger-house'
                ],
                'rating' => 4.6,
                'preparation_time' => '15 mins',
                'discount' => null,
                'category' => 'Burgers',
                'isNew' => false,
                'isPopular' => true,
                'orders' => 1000
            ],
            [
                'id' => 3,
                'name' => 'Sushi Platter',
                'slug' => 'sushi-platter',
                'description' => 'Assorted fresh sushi rolls with wasabi, ginger, and soy sauce',
                'price' => 24.99,
                'image' => '/images/dishes/sushi.jpg',
                'restaurant' => [
                    'name' => 'Sushi Master',
                    'slug' => 'sushi-master'
                ],
                'rating' => 4.9,
                'preparation_time' => '25 mins',
                'discount' => 15,
                'category' => 'Japanese',
                'isNew' => false,
                'isPopular' => true,
                'orders' => 1500
            ],
            [
                'id' => 4,
                'name' => 'Pad Thai',
                'slug' => 'pad-thai',
                'description' => 'Stir-fried rice noodles with shrimp, tofu, peanuts, and tamarind sauce',
                'price' => 16.99,
                'image' => '/images/dishes/pad-thai.jpg',
                'restaurant' => [
                    'name' => 'Thai Spice',
                    'slug' => 'thai-spice'
                ],
                'rating' => 4.7,
                'preparation_time' => '18 mins',
                'discount' => null,
                'category' => 'Thai',
                'isNew' => false,
                'isPopular' => false,
                'orders' => 1100
            ],
            [
                'id' => 5,
                'name' => 'Butter Chicken',
                'slug' => 'butter-chicken',
                'description' => 'Tender chicken in rich tomato-based curry sauce with butter and cream',
                'price' => 18.99,
                'image' => '/images/dishes/butter-chicken.jpg',
                'restaurant' => [
                    'name' => 'Indian Curry House',
                    'slug' => 'indian-curry-house'
                ],
                'rating' => 4.8,
                'preparation_time' => '22 mins',
                'discount' => 10,
                'category' => 'Indian',
                'isNew' => false,
                'isPopular' => true,
                'orders' => 1300
            ],
            [
                'id' => 6,
                'name' => 'Fish & Chips',
                'slug' => 'fish-and-chips',
                'description' => 'Crispy battered cod with golden fries and tartar sauce',
                'price' => 15.99,
                'image' => '/images/dishes/fish-chips.jpg',
                'restaurant' => [
                    'name' => 'Seafood Shack',
                    'slug' => 'seafood-shack'
                ],
                'rating' => 4.5,
                'preparation_time' => '20 mins',
                'discount' => null,
                'category' => 'Seafood',
                'isNew' => false,
                'isPopular' => false,
                'orders' => 900
            ],
            [
                'id' => 7,
                'name' => 'Beef Tacos',
                'slug' => 'beef-tacos',
                'description' => 'Three soft corn tortillas with seasoned beef, fresh salsa, and guacamole',
                'price' => 13.99,
                'image' => '/images/dishes/tacos.jpg',
                'restaurant' => [
                    'name' => 'Taco Fiesta',
                    'slug' => 'taco-fiesta'
                ],
                'rating' => 4.6,
                'preparation_time' => '15 mins',
                'discount' => 25,
                'category' => 'Mexican',
                'isNew' => false,
                'isPopular' => true,
                'orders' => 1150
            ],
            [
                'id' => 8,
                'name' => 'Caesar Salad',
                'slug' => 'caesar-salad',
                'description' => 'Crisp romaine lettuce, parmesan cheese, croutons, and Caesar dressing',
                'price' => 11.99,
                'image' => '/images/dishes/caesar-salad.jpg',
                'restaurant' => [
                    'name' => 'Fresh & Healthy',
                    'slug' => 'fresh-and-healthy'
                ],
                'rating' => 4.4,
                'preparation_time' => '10 mins',
                'discount' => null,
                'category' => 'Salad',
                'isNew' => false,
                'isPopular' => false,
                'orders' => 800
            ]
        ];
    }

    private function getSpecialOffers(): array
    {
        return [
            [
                'id' => 1,
                'title' => 'Free Delivery',
                'description' => 'On orders above $30',
                'image' => '/images/offers/free-delivery.jpg',
                'code' => 'FREEDEL',
                'discount' => 100,
                'valid_until' => now()->addDays(7)->format('Y-m-d')
            ],
            [
                'id' => 2,
                'title' => '20% OFF First Order',
                'description' => 'New customers get 20% off',
                'image' => '/images/offers/first-order.jpg',
                'code' => 'WELCOME20',
                'discount' => 20,
                'valid_until' => now()->addDays(30)->format('Y-m-d')
            ]
        ];
    }

    private function getStats(): array
    {
        return [
            'restaurants' => 500,
            'dishes' => 2000,
            'delivery_cities' => 50,
            'happy_customers' => '100K+'
        ];
    }

    private function getNearbyRestaurants(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Pizza Paradise',
                'slug' => 'pizza-paradise',
                'cuisine' => 'Italian',
                'rating' => 4.8,
                'reviews_count' => 245,
                'delivery_time' => '30-45',
                'delivery_fee' => 2.99,
                'min_order' => 15,
                'distance' => 1.2,
                'coordinates' => [
                    'lat' => 40.7128,
                    'lng' => -74.0060
                ],
                'image' => '/images/restaurants/pizza-paradise.jpg',
                'popular_dishes' => [
                    ['name' => 'Margherita Pizza', 'price' => 14.99],
                    ['name' => 'Pepperoni Pizza', 'price' => 16.99]
                ],
                'is_open' => true,
                'price_range' => '$$'
            ],
            // Add more restaurants...
        ];
    }
}