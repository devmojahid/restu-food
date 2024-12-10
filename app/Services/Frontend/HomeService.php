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
        // return Cache::remember('home_page_data', 3600, function () {
            return [
                'heroSlides' => $this->getHeroSlides(),
                'featuredRestaurants' => $this->getFeaturedRestaurants(),
                'featuredDishes' => $this->getFeaturedDishes(),
                'popularDishes' => $this->getPopularDishes(),
                'specialOffers' => $this->getSpecialOffers(),
                'popularCategories' => $this->getPopularCategories(),
                'stats' => $this->getStats(),
                'nearbyRestaurants' => $this->getNearbyRestaurants(),
            ];
        // });
    }

    private function getFeaturedRestaurants(): array
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

    private function getPopularCategories(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Pizza',
                'slug' => 'pizza',
                'restaurants' => 45,
                'items' => 250,
                'dailyOrders' => 1200,
                'avgDeliveryTime' => '30-45',
                'trending' => true,
                'rating' => 4.8,
                'image' => '/images/categories/pizza.jpg'
            ],
            [
                'id' => 2,
                'name' => 'Burger',
                'slug' => 'burger',
                'restaurants' => 38,
                'items' => 180,
                'dailyOrders' => 950,
                'avgDeliveryTime' => '25-35',
                'trending' => true,
                'rating' => 4.7,
                'image' => '/images/categories/burger.jpg'
            ],
            [
                'id' => 3,
                'name' => 'Sushi',
                'slug' => 'sushi',
                'restaurants' => 25,
                'items' => 120,
                'dailyOrders' => 450,
                'avgDeliveryTime' => '40-50',
                'trending' => false,
                'rating' => 4.9,
                'image' => '/images/categories/sushi.jpg'
            ],
            [
                'id' => 4,
                'name' => 'Desserts',
                'slug' => 'desserts',
                'restaurants' => 32,
                'items' => 150,
                'dailyOrders' => 800,
                'avgDeliveryTime' => '25-35',
                'trending' => false,
                'rating' => 4.6,
                'image' => '/images/categories/desserts.jpg'
            ],
            [
                'id' => 5,
                'name' => 'Coffee',
                'slug' => 'coffee',
                'restaurants' => 28,
                'items' => 90,
                'dailyOrders' => 1500,
                'avgDeliveryTime' => '15-25',
                'trending' => true,
                'rating' => 4.7,
                'image' => '/images/categories/coffee.jpg'
            ],
            [
                'id' => 6,
                'name' => 'Salads',
                'slug' => 'salads',
                'restaurants' => 22,
                'items' => 85,
                'dailyOrders' => 600,
                'avgDeliveryTime' => '20-30',
                'trending' => false,
                'rating' => 4.5,
                'image' => '/images/categories/salads.jpg'
            ],
            [
                'id' => 7,
                'name' => 'Sandwiches',
                'slug' => 'sandwiches',
                'restaurants' => 35,
                'items' => 130,
                'dailyOrders' => 850,
                'avgDeliveryTime' => '20-30',
                'trending' => false,
                'rating' => 4.6,
                'image' => '/images/categories/sandwiches.jpg'
            ],
            [
                'id' => 8,
                'name' => 'Drinks',
                'slug' => 'drinks',
                'restaurants' => 40,
                'items' => 110,
                'dailyOrders' => 1100,
                'avgDeliveryTime' => '15-25',
                'trending' => true,
                'rating' => 4.5,
                'image' => '/images/categories/drinks.jpg'
            ],
            [
                'id' => 9,
                'name' => 'Chinese',
                'slug' => 'chinese',
                'restaurants' => 30,
                'items' => 200,
                'dailyOrders' => 750,
                'avgDeliveryTime' => '35-45',
                'trending' => false,
                'rating' => 4.7,
                'image' => '/images/categories/chinese.jpg'
            ],
            [
                'id' => 10,
                'name' => 'Indian',
                'slug' => 'indian',
                'restaurants' => 28,
                'items' => 180,
                'dailyOrders' => 700,
                'avgDeliveryTime' => '35-45',
                'trending' => true,
                'rating' => 4.8,
                'image' => '/images/categories/indian.jpg'
            ],
            [
                'id' => 11,
                'name' => 'Thai',
                'slug' => 'thai',
                'restaurants' => 20,
                'items' => 150,
                'dailyOrders' => 500,
                'avgDeliveryTime' => '30-40',
                'trending' => false,
                'rating' => 4.6,
                'image' => '/images/categories/thai.jpg'
            ],
            [
                'id' => 12,
                'name' => 'Mexican',
                'slug' => 'mexican',
                'restaurants' => 25,
                'items' => 160,
                'dailyOrders' => 600,
                'avgDeliveryTime' => '30-40',
                'trending' => true,
                'rating' => 4.7,
                'image' => '/images/categories/mexican.jpg'
            ]
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
}