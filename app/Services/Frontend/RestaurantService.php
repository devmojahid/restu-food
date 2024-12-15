<?php

declare(strict_types=1);

namespace App\Services\Frontend;

use App\Services\BaseService;
use App\Models\Restaurant;
use Illuminate\Support\Facades\Cache;

final class RestaurantService extends BaseService
{
    public function getRestaurantPageData(): array
    {
        // Use caching for better performance
        return Cache::remember('restaurant_page_data', 3600, function () {
            return [
                'hero' => $this->getHeroSection(),
                'restaurants' => $this->getRestaurants(),
                'featuredRestaurants' => $this->getFeaturedRestaurants(),
                'popularCuisines' => $this->getPopularCuisines(),
                'filters' => $this->getFilters(),
                'stats' => $this->getStats(),
            ];
        });
    }

    private function getHeroSection(): array
    {
        return [
            'title' => 'Find Your Perfect Dining Experience',
            'subtitle' => 'Discover Local Restaurants',
            'description' => 'Explore the best restaurants in your area, from local favorites to international cuisine. Order now for delivery or takeout.',
            'image' => '/images/restaurants/hero-bg.jpg',
            'stats' => [
                ['label' => 'Restaurants', 'value' => '500+'],
                ['label' => 'Cities', 'value' => '50+'],
                ['label' => 'Cuisines', 'value' => '30+'],
                ['label' => 'Happy Customers', 'value' => '100K+']
            ]
        ];
    }

    private function getRestaurants(): array
    {
        // In a real application, this would fetch from the database
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
                'is_open' => true,
                'cuisines' => ['Italian', 'Mediterranean'],
                'delivery_fee' => 2.99,
                'min_order' => 15.00,
                'address' => '123 Main St, New York, NY',
                'coordinates' => [
                    'lat' => 40.7128,
                    'lng' => -74.0060
                ]
            ],
            // Add more restaurants...
        ];
    }

    private function getFeaturedRestaurants(): array
    {
        return array_filter($this->getRestaurants(), fn($restaurant) => 
            $restaurant['is_featured'] ?? false
        );
    }

    private function getPopularCuisines(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Italian',
                'slug' => 'italian',
                'image' => '/images/cuisines/italian.jpg',
                'restaurant_count' => 45,
                'popular_dishes' => ['Pizza', 'Pasta', 'Risotto']
            ],
            [
                'id' => 2,
                'name' => 'Japanese',
                'slug' => 'japanese',
                'image' => '/images/cuisines/japanese.jpg',
                'restaurant_count' => 32,
                'popular_dishes' => ['Sushi', 'Ramen', 'Tempura']
            ],
            // Add more cuisines...
        ];
    }

    private function getFilters(): array
    {
        return [
            'cuisines' => [
                'Italian',
                'Japanese',
                'Chinese',
                'Indian',
                'Mexican',
                'Thai',
                'Mediterranean',
                'American'
            ],
            'price_ranges' => [
                '$' => 'Inexpensive',
                '$$' => 'Moderate',
                '$$$' => 'Expensive',
                '$$$$' => 'Very Expensive'
            ],
            'dietary' => [
                'vegetarian' => 'Vegetarian',
                'vegan' => 'Vegan',
                'gluten_free' => 'Gluten Free',
                'halal' => 'Halal',
                'kosher' => 'Kosher'
            ],
            'sort_options' => [
                'recommended' => 'Recommended',
                'rating' => 'Rating: High to Low',
                'delivery_time' => 'Delivery Time',
                'distance' => 'Distance: Near to Far',
                'price_low' => 'Price: Low to High',
                'price_high' => 'Price: High to Low'
            ]
        ];
    }

    private function getStats(): array
    {
        return [
            'total_restaurants' => 500,
            'active_cities' => 50,
            'total_cuisines' => 30,
            'happy_customers' => '100K+'
        ];
    }
} 