<?php

declare(strict_types=1);

namespace Modules\Frontend\Services;  

use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use App\Services\BaseService;

/**
 * Service for managing wishlist data and operations
 */
final class WishlistService extends BaseService
{
    /**
     * Get all data needed for the wishlist page
     */
    public function getWishlistPageData(): array
    {
        try {
            return [
                'hero' => $this->getHeroSection(),
                'wishlist_items' => $this->getWishlistItems(),
                'recommended_items' => $this->getRecommendedItems(),
                'wishlist_stats' => $this->getWishlistStats(),
                'collections' => $this->getWishlistCollections(),
                'similar_dishes' => $this->getSimilarDishes(),
            ];
        } catch (\Throwable $e) {
            report($e);
            return [
                'error' => 'Failed to load wishlist data: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get hero section data
     */
    private function getHeroSection(): array
    {
        return [
            'title' => 'Your Wishlist',
            'subtitle' => 'Saved for Later',
            'description' => 'Discover all your favorite dishes and restaurants that you\'ve saved for later. Easily manage your wishlist and add items to your cart.',
            'image' => '/images/wishlist-hero.jpg',
            'stats' => [
                ['label' => 'Saved Items', 'value' => '24'],
                ['label' => 'Collections', 'value' => '5'],
                ['label' => 'Restaurants', 'value' => '12'],
                ['label' => 'Days Saved', 'value' => '30+'],
            ]
        ];
    }

    /**
     * Get wishlist items with dummy data
     */
    private function getWishlistItems(): array
    {
        $items = [];
        
        for ($i = 1; $i <= 8; $i++) {
            $price = rand(899, 2599) / 100;
            $discounted = rand(0, 1) === 1;
            $discountPercent = $discounted ? rand(10, 30) : 0;
            $originalPrice = $discounted ? round($price * (100 / (100 - $discountPercent)), 2) : $price;
            
            $items[] = [
                'id' => $i,
                'name' => $this->getFoodName($i),
                'slug' => Str::slug($this->getFoodName($i)),
                'description' => 'Delicious ' . $this->getFoodName($i) . ' prepared with fresh ingredients and our special sauce.',
                'price' => $price,
                'currency' => '$',
                'discount_percent' => $discountPercent,
                'original_price' => $originalPrice,
                'image' => '/images/dishes/dish-' . rand(1, 10) . '.jpg',
                'rating' => (rand(35, 50) / 10),
                'reviews_count' => rand(10, 200),
                'is_available' => rand(0, 9) > 0, // 90% available
                'is_popular' => rand(0, 1),
                'date_added' => now()->subDays(rand(1, 30))->format('Y-m-d H:i:s'),
                'restaurant' => [
                    'id' => rand(1, 20),
                    'name' => $this->getRestaurantName(),
                    'slug' => Str::slug($this->getRestaurantName()),
                    'logo' => '/images/restaurants/logo-' . rand(1, 10) . '.jpg',
                    'delivery_time' => rand(15, 45) . '-' . rand(45, 60) . ' min',
                    'delivery_fee' => (rand(199, 499) / 100),
                    'rating' => (rand(35, 50) / 10),
                ]
            ];
        }
        
        return $items;
    }

    /**
     * Get recommended items based on wishlist
     */
    private function getRecommendedItems(): array
    {
        $items = [];
        
        for ($i = 1; $i <= 10; $i++) {
            $price = rand(599, 1899) / 100;
            $discounted = rand(0, 1) === 1;
            $discountPercent = $discounted ? rand(10, 30) : 0;
            $originalPrice = $discounted ? round($price * (100 / (100 - $discountPercent)), 2) : $price;
            
            $items[] = [
                'id' => $i + 100, // To ensure unique IDs
                'name' => $this->getFoodName($i + 10), // Different foods from wishlist
                'slug' => Str::slug($this->getFoodName($i + 10)),
                'description' => 'Try our ' . $this->getFoodName($i + 10) . ' - one of our most popular dishes!',
                'price' => $price,
                'currency' => '$',
                'discount_percent' => $discountPercent,
                'original_price' => $originalPrice,
                'image' => '/images/dishes/dish-' . rand(1, 10) . '.jpg',
                'rating' => (rand(35, 50) / 10),
                'reviews_count' => rand(10, 200),
                'in_stock' => true,
                'is_popular' => rand(0, 1) === 1,
                'restaurant' => [
                    'id' => rand(1, 20),
                    'name' => $this->getRestaurantName(),
                    'slug' => Str::slug($this->getRestaurantName()),
                    'logo' => '/images/restaurants/logo-' . rand(1, 10) . '.jpg',
                    'delivery_time' => rand(15, 45) . '-' . rand(45, 60) . ' min',
                ]
            ];
        }
        
        return $items;
    }

    /**
     * Get wishlist statistics
     */
    private function getWishlistStats(): array
    {
        return [
            'total_items' => rand(20, 50),
            'total_value' => rand(10000, 50000) / 100,
            'most_saved_category' => $this->getRandomCategory(),
            'avg_item_price' => rand(899, 1599) / 100,
            'price_drops' => rand(2, 8),
            'saved_days' => rand(10, 90),
        ];
    }

    /**
     * Get wishlist collections (categories/folders)
     */
    private function getWishlistCollections(): array
    {
        $collections = [
            [
                'id' => 1,
                'name' => 'Favorites',
                'icon' => 'heart',
                'count' => rand(5, 20),
                'color' => 'red',
            ],
            [
                'id' => 2,
                'name' => 'Weekend Treats',
                'icon' => 'calendar',
                'count' => rand(3, 10),
                'color' => 'blue',
            ],
            [
                'id' => 3,
                'name' => 'Healthy Options',
                'icon' => 'leaf',
                'count' => rand(3, 10),
                'color' => 'green',
            ],
            [
                'id' => 4,
                'name' => 'Special Occasions',
                'icon' => 'gift',
                'count' => rand(3, 8),
                'color' => 'purple',
            ],
            [
                'id' => 5,
                'name' => 'Quick Lunches',
                'icon' => 'clock',
                'count' => rand(5, 15),
                'color' => 'orange',
            ],
        ];
        
        return $collections;
    }

    /**
     * Get similar dishes to what's in the wishlist
     */
    private function getSimilarDishes(): array
    {
        $items = [];
        
        for ($i = 1; $i <= 6; $i++) {
            $price = rand(799, 1999) / 100;
            
            $items[] = [
                'id' => $i + 200, // To ensure unique IDs
                'name' => $this->getFoodName($i + 20), // Different foods
                'slug' => Str::slug($this->getFoodName($i + 20)),
                'image' => '/images/dishes/dish-' . rand(1, 10) . '.jpg',
                'price' => $price,
                'currency' => '$',
                'rating' => (rand(35, 50) / 10),
                'restaurant' => [
                    'name' => $this->getRestaurantName(),
                    'slug' => Str::slug($this->getRestaurantName()),
                ],
                'preparation_time' => rand(10, 30) . ' min',
                'category' => $this->getRandomCategory(),
            ];
        }
        
        return $items;
    }

    /**
     * Helper method to get food names
     */
    private function getFoodName(int $seed): string
    {
        $foods = [
            'Margherita Pizza', 'Chicken Alfredo', 'Beef Burger', 'Caesar Salad',
            'Sushi Platter', 'Pad Thai', 'Butter Chicken', 'Fish and Chips',
            'Beef Steak', 'Vegetable Stir Fry', 'Mushroom Risotto', 'BBQ Ribs',
            'Shrimp Pasta', 'Lamb Kebabs', 'Falafel Wrap', 'Ramen Noodles',
            'Beef Tacos', 'Greek Gyros', 'Chicken Biryani', 'Veggie Burger',
            'Seafood Paella', 'Beef Lasagna', 'Chicken Shawarma', 'Miso Soup',
            'Vegetable Curry', 'Cheese Fondue', 'Spring Rolls', 'Beef Pho',
            'Grilled Salmon', 'Chocolate Cake', 'Apple Pie'
        ];
        
        return $foods[($seed - 1) % count($foods)];
    }

    /**
     * Helper method to get restaurant names
     */
    private function getRestaurantName(): string
    {
        $prefixes = ['The', 'La', 'El', 'Le', 'Royal', 'Golden', 'Silver', 'Blue', 'Green', 'Red'];
        $nouns = ['Dragon', 'Palace', 'Garden', 'Kitchen', 'Bistro', 'Grill', 'Diner', 'Table', 'Spoon', 'Fork'];
        $suffixes = ['Restaurant', 'Eatery', 'Cuisine', 'House', 'Bar & Grill', 'Cafe', 'Brasserie', 'Trattoria', 'Steakhouse', 'Pizzeria'];
        
        return $prefixes[array_rand($prefixes)] . ' ' . $nouns[array_rand($nouns)] . ' ' . $suffixes[array_rand($suffixes)];
    }

    /**
     * Helper method to get random category
     */
    private function getRandomCategory(): string
    {
        $categories = [
            'Italian', 'Indian', 'Chinese', 'Thai', 'Mexican', 'Japanese', 
            'American', 'Mediterranean', 'Lebanese', 'French', 'Greek', 'Korean'
        ];
        
        return $categories[array_rand($categories)];
    }
} 