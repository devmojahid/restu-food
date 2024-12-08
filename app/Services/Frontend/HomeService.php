<?php

declare(strict_types=1);

namespace App\Services\Frontend;

use App\Models\Restaurant;
use App\Models\Product;
use App\Models\Offer;
use App\Services\BaseService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

final class HomeService extends BaseService
{
    public function getHomePageData(): array
    {
        // Use caching for better performance
        return Cache::remember('home_page_data', 3600, function () {
            return [
                'heroSlides' => $this->getHeroSlides(),
                'featuredRestaurants' => $this->getFeaturedRestaurants(),
                'popularDishes' => $this->getPopularDishes(),
                'specialOffers' => $this->getSpecialOffers(),
                'stats' => $this->getStats(),
            ];
        });
    }

    private function getHeroSlides(): array
    {
        return [
            [
                'id' => 1,
                'title' => 'Delicious Food Delivered To Your Doorstep',
                'description' => 'Choose from thousands of restaurants and get your food delivered fast',
                'image' => '/images/hero/slide1.jpg',
                'cta' => [
                    'text' => 'Order Now',
                    'link' => '/menu'
                ]
            ],
            [
                'id' => 2,
                'title' => 'Fresh & Healthy Food',
                'description' => 'Discover healthy options from local restaurants',
                'image' => '/images/hero/slide2.jpg',
                'cta' => [
                    'text' => 'Explore Menu',
                    'link' => '/menu'
                ]
            ],
            [
                'id' => 3,
                'title' => 'Special Offers & Discounts',
                'description' => 'Get amazing deals on your favorite restaurants',
                'image' => '/images/hero/slide3.jpg',
                'cta' => [
                    'text' => 'View Offers',
                    'link' => '/offers'
                ]
            ]
        ];
    }

    private function getFeaturedRestaurants()
    {
        try {
            return Restaurant::with(['media', 'categories'])
                ->where('featured', true)
                ->where('status', 'active')
                ->take(6)
                ->get()
                ->map(function ($restaurant) {
                    return [
                        'id' => $restaurant->id,
                        'name' => $restaurant->name,
                        'slug' => $restaurant->slug,
                        'description' => $restaurant->description,
                        'rating' => $restaurant->average_rating ?? 0,
                        'delivery_time' => $restaurant->delivery_time ?? '30-45',
                        'image' => $restaurant->getFirstMediaUrl('restaurant_cover') ?: '/images/placeholder-restaurant.jpg',
                        'categories' => $restaurant->categories->pluck('name') ?? [],
                        'total_reviews' => $restaurant->reviews_count ?? 0,
                        'price_range' => $restaurant->price_range ?? '$',
                        'is_open' => $restaurant->is_open ?? true,
                    ];
                });
        } catch (\Exception $e) {
            Log::error('Error fetching featured restaurants: ' . $e->getMessage());
            return collect([]);
        }
    }

    private function getPopularDishes()
    {
        try {
            return Product::with(['media', 'restaurant'])
                ->where('popular', true)
                ->where('status', 'active')
                ->take(8)
                ->get()
                ->map(function ($dish) {
                    return [
                        'id' => $dish->id,
                        'name' => $dish->name,
                        'slug' => $dish->slug,
                        'description' => $dish->description,
                        'price' => $dish->formatted_price,
                        'image' => $dish->getFirstMediaUrl('product_image') ?: '/images/placeholder-dish.jpg',
                        'restaurant' => [
                            'name' => $dish->restaurant->name ?? '',
                            'slug' => $dish->restaurant->slug ?? '',
                        ],
                        'rating' => $dish->average_rating ?? 0,
                        'discount' => $dish->discount ?? null,
                        'preparation_time' => $dish->preparation_time ?? '20 mins',
                    ];
                });
        } catch (\Exception $e) {
            Log::error('Error fetching popular dishes: ' . $e->getMessage());
            return collect([]);
        }
    }

    private function getSpecialOffers()
    {
        try {
            return Cache::remember('special_offers', 3600, function () {
                return [
                    [
                        'id' => 1,
                        'title' => 'Free Delivery',
                        'description' => 'On orders above $30',
                        'discount' => '100',
                        'discount_type' => 'percentage',
                        'image' => '/images/offers/free-delivery.jpg',
                        'code' => 'FREEDEL',
                        'valid_until' => now()->addDays(7)->format('Y-m-d'),
                    ],
                    [
                        'id' => 2,
                        'title' => '20% OFF',
                        'description' => 'On your first order',
                        'discount' => '20',
                        'discount_type' => 'percentage',
                        'image' => '/images/offers/first-order.jpg',
                        'code' => 'WELCOME20',
                        'valid_until' => now()->addDays(30)->format('Y-m-d'),
                    ],
                    // Add more static offers as needed
                ];
            });
        } catch (\Exception $e) {
            Log::error('Error fetching special offers: ' . $e->getMessage());
            return collect([]);
        }
    }

    private function getStats(): array
    {
        return [
            'restaurants' => Restaurant::count(),
            'dishes' => Product::count(),
            'delivery_cities' => 50,
            'happy_customers' => '100K+',
        ];
    }
}