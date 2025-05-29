<?php

declare(strict_types=1);

namespace App\Services\Frontend;

use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use App\Services\BaseService;

/**
 * Service for handling Wishlist2 related functionality
 */
final class Wishlist2Service extends BaseService
{
    /**
     * Get all data required for the enhanced wishlist2 page
     */
    public function getWishlist2PageData(): array
    {
        try {
            return [
                'hero' => $this->getHeroSection(),
                'wishlist_items' => $this->getWishlistItems(),
                'collections' => $this->getWishlistCollections(),
                'recommended_items' => $this->getRecommendedItems(),
                'trending_now' => $this->getTrendingItems(),
                'recently_viewed' => $this->getRecentlyViewedItems(),
                'wishlist_stats' => $this->getWishlistStats(),
                'similar_dishes' => $this->getSimilarDishes(),
                'price_drops' => $this->getPriceDropItems(),
                'user_preferences' => $this->getUserPreferences(),
            ];
        } catch (\Throwable $e) {
            // Log error and return minimal data
            logger()->error('Error fetching wishlist2 data: ' . $e->getMessage(), [
                'exception' => $e,
            ]);
            
            return [
                'hero' => $this->getHeroSection(),
                'error' => 'We encountered an issue loading your complete wishlist. Some items may not be displayed.',
                'wishlist_items' => [],
                'collections' => [],
                'recommended_items' => [],
                'wishlist_stats' => $this->getWishlistStats(),
            ];
        }
    }
    
    /**
     * Get hero section data with enhanced visuals
     */
    private function getHeroSection(): array
    {
        return [
            'title' => 'Your Wishlist Collection',
            'subtitle' => 'Save, organize and discover your favorite dishes',
            'description' => 'Keep track of the dishes you love. Create collections, compare prices, and get notified about deals on your saved items.',
            'image' => '/images/wishlist-hero-bg.jpg',
            'background_pattern' => 'grid',
            'animation_type' => 'parallax',
            'stats' => [
                [
                    'icon' => 'Heart',
                    'label' => 'Saved Items',
                    'value' => '24',
                    'color' => 'text-red-500'
                ],
                [
                    'icon' => 'Tag',
                    'label' => 'Price Drops',
                    'value' => '7',
                    'color' => 'text-green-500'
                ],
                [
                    'icon' => 'Clock',
                    'label' => 'Limited Offers',
                    'value' => '3',
                    'color' => 'text-blue-500'
                ],
                [
                    'icon' => 'FolderHeart',
                    'label' => 'Collections',
                    'value' => '5',
                    'color' => 'text-purple-500'
                ]
            ],
            'cta' => [
                'primary' => [
                    'text' => 'Start Shopping',
                    'link' => '/restaurants'
                ],
                'secondary' => [
                    'text' => 'Browse Collections',
                    'link' => '#collections'
                ]
            ]
        ];
    }
    
    /**
     * Get user's wishlist items with enhanced metadata
     */
    private function getWishlistItems(): array
    {
        $items = [];
        
        // Generate 12 random items with more detailed info
        for ($i = 0; $i < 12; $i++) {
            $price = round(mt_rand(799, 2999) / 100, 2);
            $discount = mt_rand(0, 10) > 7 ? mt_rand(10, 30) : 0;
            $originalPrice = $discount > 0 ? round($price * (100 / (100 - $discount)), 2) : $price;
            
            $inStock = mt_rand(0, 10) > 2;
            
            $restaurant = $this->getRestaurantName();
            $randomDate = now()->subDays(mt_rand(1, 60));
            
            $items[] = [
                'id' => $i + 1,
                'name' => $this->getFoodName($i),
                'slug' => Str::slug($this->getFoodName($i)),
                'image' => '/images/dishes/' . mt_rand(1, 12) . '.jpg',
                'restaurant' => [
                    'name' => $restaurant,
                    'slug' => Str::slug($restaurant),
                    'logo' => '/images/restaurants/logo-' . mt_rand(1, 8) . '.png',
                    'rating' => mt_rand(35, 50) / 10,
                    'delivery_time' => mt_rand(15, 45) . '-' . mt_rand(45, 60) . ' min',
                    'delivery_fee' => '$' . mt_rand(1, 6) . '.99'
                ],
                'category' => $this->getRandomCategory(),
                'description' => 'Delicious ' . $this->getFoodName($i) . ' prepared with fresh ingredients and our special sauce.',
                'price' => $price,
                'original_price' => $originalPrice,
                'discount' => $discount,
                'currency' => '$',
                'rating' => mt_rand(35, 50) / 10,
                'reviews_count' => mt_rand(10, 500),
                'date_added' => $randomDate->format('Y-m-d H:i:s'),
                'date_added_formatted' => $randomDate->diffForHumans(),
                'calories' => mt_rand(250, 800),
                'preparation_time' => mt_rand(10, 30) . ' min',
                'collection_id' => mt_rand(0, 5),
                'in_stock' => $inStock,
                'stock_status' => $inStock ? 'In Stock' : 'Out of Stock',
                'availability' => $inStock ? 'Available' : 'Unavailable until ' . now()->addDays(mt_rand(1, 7))->format('M d'),
                'labels' => $this->generateRandomLabels(),
                'price_history' => $this->generatePriceHistory($price),
                'customization_options' => $this->generateCustomizationOptions(),
                'nutritional_info' => $this->generateNutritionalInfo(),
                'featured' => mt_rand(0, 10) > 8,
                'limited_time' => mt_rand(0, 10) > 8,
                'note' => mt_rand(0, 10) > 8 ? 'Order extra sauce on the side!' : null,
            ];
        }
        
        return $items;
    }
    
    /**
     * Get enhanced recommendations based on user behavior
     */
    private function getRecommendedItems(): array
    {
        $items = [];
        
        // Generate 8 random recommended items
        for ($i = 0; $i < 8; $i++) {
            $price = round(mt_rand(799, 2999) / 100, 2);
            $discount = mt_rand(0, 10) > 7 ? mt_rand(10, 30) : 0;
            $originalPrice = $discount > 0 ? round($price * (100 / (100 - $discount)), 2) : $price;
            
            $restaurant = $this->getRestaurantName();
            
            $items[] = [
                'id' => 100 + $i,
                'name' => $this->getFoodName($i + 20),
                'slug' => Str::slug($this->getFoodName($i + 20)),
                'image' => '/images/dishes/' . mt_rand(1, 12) . '.jpg',
                'restaurant' => [
                    'name' => $restaurant,
                    'slug' => Str::slug($restaurant),
                    'logo' => '/images/restaurants/logo-' . mt_rand(1, 8) . '.png',
                ],
                'category' => $this->getRandomCategory(),
                'price' => $price,
                'original_price' => $originalPrice,
                'discount' => $discount,
                'currency' => '$',
                'rating' => mt_rand(35, 50) / 10,
                'reviews_count' => mt_rand(10, 500),
                'calories' => mt_rand(250, 800),
                'preparation_time' => mt_rand(10, 30) . ' min',
                'recommendation_reason' => $this->getRecommendationReason(),
                'similarity_score' => mt_rand(70, 99),
                'trending_score' => mt_rand(0, 100),
            ];
        }
        
        return $items;
    }
    
    /**
     * Get enhanced trending items with popularity metrics
     */
    private function getTrendingItems(): array
    {
        $items = [];
        
        // Generate 6 trending items
        for ($i = 0; $i < 6; $i++) {
            $price = round(mt_rand(799, 2999) / 100, 2);
            $discount = mt_rand(0, 10) > 5 ? mt_rand(10, 30) : 0; // More likely to have discounts
            $originalPrice = $discount > 0 ? round($price * (100 / (100 - $discount)), 2) : $price;
            
            $restaurant = $this->getRestaurantName();
            
            $items[] = [
                'id' => 200 + $i,
                'name' => $this->getFoodName($i + 40),
                'slug' => Str::slug($this->getFoodName($i + 40)),
                'image' => '/images/dishes/' . mt_rand(1, 12) . '.jpg',
                'restaurant' => [
                    'name' => $restaurant,
                    'slug' => Str::slug($restaurant),
                    'logo' => '/images/restaurants/logo-' . mt_rand(1, 8) . '.png',
                ],
                'category' => $this->getRandomCategory(),
                'price' => $price,
                'original_price' => $originalPrice,
                'discount' => $discount,
                'currency' => '$',
                'rating' => mt_rand(40, 50) / 10, // Higher ratings for trending
                'reviews_count' => mt_rand(100, 1000), // More reviews
                'trending_rank' => $i + 1,
                'popularity_growth' => mt_rand(30, 200) . '%',
                'views_last_week' => mt_rand(1000, 5000),
                'orders_last_week' => mt_rand(100, 1000),
                'trending_since' => now()->subDays(mt_rand(1, 14))->format('M d'),
                'buzz_factor' => mt_rand(70, 99),
            ];
        }
        
        return $items;
    }
    
    /**
     * Get recently viewed items with view history
     */
    private function getRecentlyViewedItems(): array
    {
        $items = [];
        
        // Generate 6 recently viewed items
        for ($i = 0; $i < 6; $i++) {
            $price = round(mt_rand(799, 2999) / 100, 2);
            $restaurant = $this->getRestaurantName();
            $viewedAt = now()->subHours(mt_rand(1, 48));
            
            $items[] = [
                'id' => 300 + $i,
                'name' => $this->getFoodName($i + 60),
                'slug' => Str::slug($this->getFoodName($i + 60)),
                'image' => '/images/dishes/' . mt_rand(1, 12) . '.jpg',
                'restaurant' => [
                    'name' => $restaurant,
                    'slug' => Str::slug($restaurant),
                ],
                'category' => $this->getRandomCategory(),
                'price' => $price,
                'currency' => '$',
                'rating' => mt_rand(35, 50) / 10,
                'viewed_at' => $viewedAt->format('Y-m-d H:i:s'),
                'viewed_at_formatted' => $viewedAt->diffForHumans(),
                'view_count' => mt_rand(1, 5),
                'last_position' => 'Product Page',
            ];
        }
        
        return $items;
    }
    
    /**
     * Get enhanced wishlist statistics with visual data
     */
    private function getWishlistStats(): array
    {
        return [
            'total_items' => 24,
            'total_value' => 352.75,
            'average_price' => 14.70,
            'price_range' => [
                'min' => 7.99,
                'max' => 29.99,
            ],
            'most_expensive_item' => [
                'name' => 'Premium Wagyu Burger',
                'price' => 29.99,
                'image' => '/images/dishes/7.jpg',
            ],
            'oldest_item' => [
                'name' => 'Margherita Pizza',
                'added' => '3 months ago',
                'image' => '/images/dishes/2.jpg',
            ],
            'collections' => [
                'total' => 5,
                'most_items' => 'Favorites',
            ],
            'category_distribution' => [
                ['name' => 'Italian', 'count' => 7, 'percentage' => 29],
                ['name' => 'Asian', 'count' => 5, 'percentage' => 21],
                ['name' => 'Mexican', 'count' => 4, 'percentage' => 17],
                ['name' => 'Desserts', 'count' => 4, 'percentage' => 17],
                ['name' => 'Others', 'count' => 4, 'percentage' => 16],
            ],
            'price_distribution' => [
                ['range' => 'Under $10', 'count' => 5, 'percentage' => 21],
                ['range' => '$10-$15', 'count' => 9, 'percentage' => 37],
                ['range' => '$15-$20', 'count' => 6, 'percentage' => 25],
                ['range' => 'Over $20', 'count' => 4, 'percentage' => 17],
            ],
            'discount_stats' => [
                'items_with_discount' => 7,
                'average_discount' => 18,
                'total_savings' => 42.35,
            ],
            'activity' => [
                'last_added' => '2 hours ago',
                'most_active_day' => 'Friday',
                'items_added_this_week' => 3,
            ],
            'smart_recommendations' => [
                'categories_to_explore' => ['Greek', 'Indian', 'Vegan'],
                'price_sweet_spot' => '$12-$18',
            ],
        ];
    }
    
    /**
     * Get enhanced wishlist collections with visual elements
     */
    private function getWishlistCollections(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Favorites',
                'description' => 'My all-time favorite dishes from various restaurants',
                'icon' => 'Heart',
                'color' => 'red',
                'item_count' => 8,
                'created_at' => now()->subMonths(2)->format('Y-m-d H:i:s'),
                'last_updated' => now()->subDays(3)->format('Y-m-d H:i:s'),
                'cover_image' => '/images/collections/favorites.jpg',
                'is_default' => true,
                'is_public' => false,
                'total_value' => 124.92,
            ],
            [
                'id' => 2,
                'name' => 'Healthy Options',
                'description' => 'Low-calorie and nutritious meals for health-conscious days',
                'icon' => 'Salad',
                'color' => 'green',
                'item_count' => 6,
                'created_at' => now()->subMonths(1)->format('Y-m-d H:i:s'),
                'last_updated' => now()->subDays(7)->format('Y-m-d H:i:s'),
                'cover_image' => '/images/collections/healthy.jpg',
                'is_default' => false,
                'is_public' => true,
                'total_value' => 87.45,
            ],
            [
                'id' => 3,
                'name' => 'Weekend Treats',
                'description' => 'Special dishes for weekend indulgence',
                'icon' => 'Sparkles',
                'color' => 'purple',
                'item_count' => 5,
                'created_at' => now()->subMonths(1)->format('Y-m-d H:i:s'),
                'last_updated' => now()->subDays(14)->format('Y-m-d H:i:s'),
                'cover_image' => '/images/collections/weekend.jpg',
                'is_default' => false,
                'is_public' => false,
                'total_value' => 92.50,
            ],
            [
                'id' => 4,
                'name' => 'Quick Lunch',
                'description' => 'Fast and delicious options for busy days',
                'icon' => 'Clock',
                'color' => 'blue',
                'item_count' => 3,
                'created_at' => now()->subWeeks(2)->format('Y-m-d H:i:s'),
                'last_updated' => now()->subDays(10)->format('Y-m-d H:i:s'),
                'cover_image' => '/images/collections/lunch.jpg',
                'is_default' => false,
                'is_public' => false,
                'total_value' => 32.97,
            ],
            [
                'id' => 5,
                'name' => 'Party Orders',
                'description' => 'Group-friendly dishes for gatherings and parties',
                'icon' => 'Party',
                'color' => 'yellow',
                'item_count' => 2,
                'created_at' => now()->subWeeks(1)->format('Y-m-d H:i:s'),
                'last_updated' => now()->subDays(1)->format('Y-m-d H:i:s'),
                'cover_image' => '/images/collections/party.jpg',
                'is_default' => false,
                'is_public' => true,
                'total_value' => 54.98,
            ],
        ];
    }
    
    /**
     * Get items with similar taste profile
     */
    private function getSimilarDishes(): array
    {
        $items = [];
        
        // Generate 8 similar dishes
        for ($i = 0; $i < 8; $i++) {
            $price = round(mt_rand(799, 2999) / 100, 2);
            $discount = mt_rand(0, 10) > 7 ? mt_rand(10, 30) : 0;
            $originalPrice = $discount > 0 ? round($price * (100 / (100 - $discount)), 2) : $price;
            
            $restaurant = $this->getRestaurantName();
            
            $items[] = [
                'id' => 400 + $i,
                'name' => $this->getFoodName($i + 80),
                'slug' => Str::slug($this->getFoodName($i + 80)),
                'image' => '/images/dishes/' . mt_rand(1, 12) . '.jpg',
                'restaurant' => [
                    'name' => $restaurant,
                    'slug' => Str::slug($restaurant),
                    'logo' => '/images/restaurants/logo-' . mt_rand(1, 8) . '.png',
                ],
                'category' => $this->getRandomCategory(),
                'price' => $price,
                'original_price' => $originalPrice,
                'discount' => $discount,
                'currency' => '$',
                'rating' => mt_rand(35, 50) / 10,
                'reviews_count' => mt_rand(10, 500),
                'similarity_to' => [
                    'dish' => $this->getFoodName(mt_rand(0, 5)),
                    'score' => mt_rand(85, 99),
                    'aspects' => ['flavor profile', 'ingredients', 'cuisine type'],
                ],
                'in_wishlist' => mt_rand(0, 1) == 1,
            ];
        }
        
        return $items;
    }
    
    /**
     * Get items with price drops
     */
    private function getPriceDropItems(): array
    {
        $items = [];
        
        // Generate 5 items with price drops
        for ($i = 0; $i < 5; $i++) {
            $currentPrice = round(mt_rand(799, 1999) / 100, 2);
            $discount = mt_rand(15, 40);
            $originalPrice = round($currentPrice * (100 / (100 - $discount)), 2);
            
            $restaurant = $this->getRestaurantName();
            $dropDate = now()->subDays(mt_rand(1, 7));
            
            $items[] = [
                'id' => 500 + $i,
                'name' => $this->getFoodName($i + 100),
                'slug' => Str::slug($this->getFoodName($i + 100)),
                'image' => '/images/dishes/' . mt_rand(1, 12) . '.jpg',
                'restaurant' => [
                    'name' => $restaurant,
                    'slug' => Str::slug($restaurant),
                ],
                'price' => $currentPrice,
                'original_price' => $originalPrice,
                'discount' => $discount,
                'currency' => '$',
                'drop_date' => $dropDate->format('Y-m-d H:i:s'),
                'drop_date_formatted' => $dropDate->diffForHumans(),
                'savings' => round($originalPrice - $currentPrice, 2),
                'end_date' => now()->addDays(mt_rand(1, 7))->format('M d'),
                'limited_time' => mt_rand(0, 1) == 1,
            ];
        }
        
        return $items;
    }
    
    /**
     * Get user preferences for enhanced recommendations
     */
    private function getUserPreferences(): array
    {
        return [
            'favorite_cuisines' => ['Italian', 'Mexican', 'Japanese'],
            'dietary_preferences' => ['Vegetarian-friendly'],
            'price_preference' => 'mid-range',
            'spice_level' => 'medium',
            'meal_times' => ['dinner', 'weekend-lunch'],
            'frequently_ordered_from' => [
                'Bella Italia',
                'Tokyo Sushi House',
                'El Taco Grande'
            ],
            'taste_profile' => [
                'savory' => 80,
                'sweet' => 40,
                'spicy' => 60,
                'umami' => 70,
            ],
        ];
    }
    
    /**
     * Generate random food name
     */
    private function getFoodName(int $seed): string
    {
        $prefixes = ['Classic', 'Spicy', 'Homemade', 'Grilled', 'Fresh', 'Crispy', 'Creamy', 'Savory', 'Sweet', 'Tangy', 'Signature', 'Gourmet', 'Deluxe', 'Premium'];
        $dishes = ['Pizza', 'Burger', 'Pasta', 'Taco', 'Sushi Roll', 'Salad', 'Sandwich', 'Curry', 'Noodles', 'Steak', 'Ice Cream', 'Cake', 'Pie', 'Soup', 'Wings', 'Rice Bowl', 'Ramen', 'Burrito', 'Fries', 'Seafood Platter'];
        $suffixes = ['with Fries', 'with Special Sauce', 'with Vegetables', 'Deluxe', 'Supreme', 'Combo', 'Family Size', 'à la Mode', 'with Rice', 'with Salad', 'with Garlic Bread'];
        
        srand($seed);
        
        $usePrefix = rand(0, 2) > 0;
        $useSuffix = rand(0, 2) > 1;
        
        $name = '';
        if ($usePrefix) {
            $name .= $prefixes[array_rand($prefixes)] . ' ';
        }
        
        $name .= $dishes[array_rand($dishes)];
        
        if ($useSuffix) {
            $name .= ' ' . $suffixes[array_rand($suffixes)];
        }
        
        return $name;
    }
    
    /**
     * Generate random restaurant name
     */
    private function getRestaurantName(): string
    {
        $prefixes = ['La', 'El', 'The', 'Royal', 'Golden', 'Silver', 'Blue', 'Green', 'Red', 'Urban', 'City', 'Rustic', 'Modern', 'Traditional', 'Authentic'];
        $mains = ['Kitchen', 'Grill', 'Bistro', 'Restaurant', 'Café', 'Diner', 'Eatery', 'Brasserie', 'Pizzeria', 'Steakhouse', 'Garden', 'Corner', 'Table', 'Plate', 'Spoon', 'Fork'];
        $suffixes = ['House', '& Co.', 'Express', 'Place', 'Spot', 'Junction', 'Hub', 'Shack', 'Palace', 'Lounge', 'Bar', 'Cantina'];
        
        $pattern = mt_rand(1, 4);
        
        switch ($pattern) {
            case 1:
                return $prefixes[array_rand($prefixes)] . ' ' . $mains[array_rand($mains)];
            case 2:
                return $mains[array_rand($mains)] . ' ' . $suffixes[array_rand($suffixes)];
            case 3:
                return $prefixes[array_rand($prefixes)] . ' ' . $mains[array_rand($mains)] . ' ' . $suffixes[array_rand($suffixes)];
            case 4:
                return 'The ' . $mains[array_rand($mains)];
            default:
                return $prefixes[array_rand($prefixes)] . ' ' . $mains[array_rand($mains)];
        }
    }
    
    /**
     * Get random food category
     */
    private function getRandomCategory(): string
    {
        $categories = [
            'Italian', 'Mexican', 'Chinese', 'Japanese', 'Thai', 
            'American', 'Indian', 'French', 'Greek', 'Mediterranean', 
            'BBQ', 'Seafood', 'Vegan', 'Vegetarian', 'Dessert', 
            'Breakfast', 'Burgers', 'Pizza', 'Sushi', 'Salads'
        ];
        
        return $categories[array_rand($categories)];
    }
    
    /**
     * Generate random labels for dishes
     */
    private function generateRandomLabels(): array
    {
        $allLabels = [
            'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 
            'Organic', 'Spicy', 'Low-Calorie', 'High-Protein', 'Keto-Friendly',
            'Best Seller', 'New', 'Chef\'s Special', 'Local Favorite', 'Seasonal'
        ];
        
        $labelCount = mt_rand(0, 3);
        if ($labelCount === 0) {
            return [];
        }
        
        shuffle($allLabels);
        return array_slice($allLabels, 0, $labelCount);
    }
    
    /**
     * Generate price history for a product
     */
    private function generatePriceHistory(float $currentPrice): array
    {
        $history = [];
        $date = now()->subMonths(3);
        $price = $currentPrice * (mt_rand(90, 110) / 100);
        
        for ($i = 0; $i < 6; $i++) {
            $history[] = [
                'date' => $date->format('Y-m-d'),
                'price' => round($price, 2)
            ];
            
            $date = $date->addDays(15);
            $priceChange = mt_rand(-15, 15);
            $price = max(5, $price * (1 + $priceChange / 100));
        }
        
        // Add current price
        $history[] = [
            'date' => now()->format('Y-m-d'),
            'price' => $currentPrice
        ];
        
        return $history;
    }
    
    /**
     * Generate customization options for food items
     */
    private function generateCustomizationOptions(): array
    {
        $options = [];
        
        $hasSize = mt_rand(0, 10) > 3;
        if ($hasSize) {
            $options[] = [
                'name' => 'Size',
                'required' => true,
                'choices' => [
                    ['name' => 'Small', 'price_modifier' => 0],
                    ['name' => 'Medium', 'price_modifier' => 2],
                    ['name' => 'Large', 'price_modifier' => 4],
                ]
            ];
        }
        
        $hasToppings = mt_rand(0, 10) > 4;
        if ($hasToppings) {
            $options[] = [
                'name' => 'Extra Toppings',
                'required' => false,
                'multiple' => true,
                'choices' => [
                    ['name' => 'Cheese', 'price_modifier' => 1],
                    ['name' => 'Bacon', 'price_modifier' => 1.5],
                    ['name' => 'Avocado', 'price_modifier' => 2],
                    ['name' => 'Mushrooms', 'price_modifier' => 1],
                ]
            ];
        }
        
        $hasSides = mt_rand(0, 10) > 5;
        if ($hasSides) {
            $options[] = [
                'name' => 'Side Order',
                'required' => false,
                'choices' => [
                    ['name' => 'French Fries', 'price_modifier' => 3],
                    ['name' => 'Side Salad', 'price_modifier' => 3.5],
                    ['name' => 'Garlic Bread', 'price_modifier' => 2.5],
                ]
            ];
        }
        
        return $options;
    }
    
    /**
     * Generate nutritional information
     */
    private function generateNutritionalInfo(): array
    {
        return [
            'calories' => mt_rand(200, 800),
            'protein' => mt_rand(5, 30) . 'g',
            'carbs' => mt_rand(10, 60) . 'g',
            'fat' => mt_rand(5, 40) . 'g',
            'sodium' => mt_rand(300, 1200) . 'mg',
            'fiber' => mt_rand(0, 10) . 'g',
            'sugar' => mt_rand(1, 20) . 'g',
        ];
    }
    
    /**
     * Generate recommendation reason
     */
    private function getRecommendationReason(): string
    {
        $reasons = [
            'Based on your taste preferences',
            'People who liked your wishlist items also enjoyed this',
            'Top-rated in categories you browse often',
            'Popular with customers like you',
            'From restaurants you have ordered from before',
            'Matches your dietary preferences',
            'Similar to items in your wishlist',
            'Trending in your area',
        ];
        
        return $reasons[array_rand($reasons)];
    }

    /**
     * Add an item to the wishlist
     */
    public function addItemToWishlist(int $dishId, ?int $collectionId = null): bool
    {
        try {
            // Here we would normally add the item to the database
            // For the demo purposes we'll just return true
            return true;
        } catch (\Throwable $e) {
            report($e);
            return false;
        }
    }

    /**
     * Remove an item from the wishlist
     */
    public function removeItemFromWishlist(int $itemId): bool
    {
        try {
            // Here we would normally remove the item from the database
            // For the demo purposes we'll just return true
            return true;
        } catch (\Throwable $e) {
            report($e);
            return false;
        }
    }

    /**
     * Move an item from wishlist to cart
     */
    public function moveItemToCart(int $itemId, int $quantity = 1): bool
    {
        try {
            // Here we would normally move the item to the cart
            // This would involve removing it from the wishlist and adding it to the cart
            // For the demo purposes we'll just return true
            return true;
        } catch (\Throwable $e) {
            report($e);
            return false;
        }
    }

    /**
     * Manage wishlist collections (create, update, delete)
     */
    public function manageCollection(string $action, ?int $collectionId = null, ?string $name = null): bool
    {
        try {
            // Here we would normally manage the collection in the database
            // Based on the action (create, update, delete)
            // For the demo purposes we'll just return true
            return true;
        } catch (\Throwable $e) {
            report($e);
            return false;
        }
    }

    /**
     * Clear all items from the wishlist
     */
    public function clearWishlist(): bool
    {
        try {
            // Here we would normally clear all items from the wishlist
            // For the demo purposes we'll just return true
            return true;
        } catch (\Throwable $e) {
            report($e);
            return false;
        }
    }
} 