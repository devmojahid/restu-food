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
}