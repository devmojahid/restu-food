<?php

declare(strict_types=1);

namespace Modules\Frontend\Services;  

use Illuminate\Support\Facades\Cache;
use App\Models\Restaurant;

final class Restaurant2Service extends BaseService
{
    /**
     * Get all data for the restaurant2 page
     */
    public function getRestaurant2PageData(): array
    {
        // Use caching for better performance
        return Cache::remember('restaurant2_page_data', 3600, function () {
            return [
                'hero' => $this->getHeroSection(),
                'restaurants' => $this->getRestaurants(),
                'featuredRestaurants' => $this->getFeaturedRestaurants(),
                'popularCuisines' => $this->getPopularCuisines(),
                'topRatedRestaurants' => $this->getTopRatedRestaurants(),
                'nearbyRestaurants' => $this->getNearbyRestaurants(),
                'trendingRestaurants' => $this->getTrendingRestaurants(),
                'filters' => $this->getFilters(),
                'stats' => $this->getStats(),
                'categories' => $this->getCategories(),
            ];
        });
    }

    /**
     * Get hero section data
     */
    private function getHeroSection(): array
    {
        return [
            'title' => 'Discover Extraordinary Dining Experiences',
            'subtitle' => 'Find Your Next Culinary Adventure',
            'description' => 'Browse through thousands of restaurants, from local favorites to international cuisine. Enjoy special offers, fast delivery, and personalized recommendations.',
            'image' => '/images/hero/restaurants-hero.jpg',
            'featured_cuisines' => [
                ['id' => 1, 'name' => 'Italian'],
                ['id' => 2, 'name' => 'Japanese'],
                ['id' => 3, 'name' => 'Indian'],
                ['id' => 4, 'name' => 'Mexican'],
                ['id' => 5, 'name' => 'Thai'],
                ['id' => 6, 'name' => 'Mediterranean'],
            ],
            'search_suggestions' => [
                'Popular Searches' => [
                    'Pizza', 'Sushi', 'Burger', 'Vegetarian', 'Healthy', 'Breakfast', 'Dinner', 'Lunch'
                ],
                'Cuisine Types' => [
                    'Italian', 'Chinese', 'Japanese', 'Indian', 'Thai', 'Mexican', 'French', 'Korean'
                ],
                'Popular Dishes' => [
                    'Margherita Pizza', 'Butter Chicken', 'Sushi Rolls', 'Pad Thai', 'Tacos', 'Ramen', 'Burger'
                ]
            ],
            'stats' => [
                ['label' => 'Restaurants', 'value' => '2,500+', 'icon' => 'Store'],
                ['label' => 'Cuisine Types', 'value' => '60+', 'icon' => 'Utensils'],
                ['label' => 'Cities Covered', 'value' => '25+', 'icon' => 'MapPin'],
                ['label' => 'Happy Customers', 'value' => '250K+', 'icon' => 'Users'],
            ],
        ];
    }

    /**
     * Get restaurant listings data
     */
    private function getRestaurants(): array
    {
        $restaurants = [];
        
        // Define image paths for different restaurant types
        $imagePaths = [
            '/images/restaurants/italian-restaurant.jpg',
            '/images/restaurants/japanese-restaurant.jpg',
            '/images/restaurants/indian-restaurant.jpg',
            '/images/restaurants/american-restaurant.jpg',
            '/images/restaurants/thai-restaurant.jpg',
            '/images/restaurants/mexican-restaurant.jpg',
            '/images/restaurants/mediterranean-restaurant.jpg',
            '/images/restaurants/chinese-restaurant.jpg',
            '/images/restaurants/fusion-restaurant.jpg',
            '/images/restaurants/french-restaurant.jpg',
            '/images/restaurants/korean-restaurant.jpg',
            '/images/restaurants/vegetarian-restaurant.jpg',
        ];
        
        // Restaurant names
        $names = [
            'Bella Italia', 'Sakura Garden', 'Spice Route', 'Burger & Co', 'Thai Orchid',
            'El Mariachi', 'Olive Garden', 'Golden Dragon', 'Fusion Kitchen', 'Petit Paris',
            'Seoul Garden', 'Green Leaf', 'Ocean Breeze', 'Taste of India', 'Mamma Mia',
            'Sushi Express', 'Texas Grill', 'Bangkok Street', 'La Fiesta', 'Mediterranean Oasis',
            'Dragon Palace', 'Urban Plates', 'French Corner', 'Korean BBQ', 'Veggie Delight'
        ];
        
        // Categories
        $categories = [
            ['Italian', 'Pizza', 'Pasta'],
            ['Japanese', 'Sushi', 'Ramen'],
            ['Indian', 'Curry', 'Vegetarian'],
            ['American', 'Burgers', 'Steaks'],
            ['Thai', 'Noodles', 'Spicy'],
            ['Mexican', 'Tacos', 'Burritos'],
            ['Mediterranean', 'Healthy', 'Seafood'],
            ['Chinese', 'Dim Sum', 'Noodles'],
            ['Fusion', 'Modern', 'Innovative'],
            ['French', 'Fine Dining', 'Pastries'],
            ['Korean', 'BBQ', 'Bibimbap'],
            ['Vegetarian', 'Vegan', 'Healthy'],
        ];
        
        // Locations
        $locations = [
            'Downtown', 'North End', 'West Side', 'South District', 'Eastville',
            'Harbor View', 'Central Square', 'Riverside', 'University Area', 'Old Town',
            'Theater District', 'Financial District', 'Arts Quarter', 'Marina Bay', 'Parkside'
        ];
        
        // Create 25 restaurant entries
        for ($i = 1; $i <= 25; $i++) {
            $categoryIndex = ($i - 1) % count($categories);
            $imageIndex = $categoryIndex % count($imagePaths);
            $nameIndex = ($i - 1) % count($names);
            $locationIndex = ($i - 1) % count($locations);
            
            $restaurant = [
                'id' => $i,
                'name' => $names[$nameIndex] . ' ' . ($i > count($names) ? ($i - count($names)) : ''),
                'image' => $imagePaths[$imageIndex],
                'categories' => $categories[$categoryIndex],
                'rating' => round(mt_rand(35, 50) / 10, 1),
                'price_range' => str_repeat('$', mt_rand(1, 4)),
                'location' => $locations[$locationIndex],
                'distance' => mt_rand(1, 15),
                'delivery_time' => mt_rand(15, 30) . '-' . mt_rand(30, 60) . ' min',
                'delivery_fee' => '$' . number_format(mt_rand(1, 5) + mt_rand(0, 99) / 100, 2),
                'is_featured' => $i <= 8,
                'offer' => $i % 4 === 0 ? 'Free delivery on orders over $25' : ($i % 7 === 0 ? '20% off your first order' : null),
            ];
            
            // Add trending status to some restaurants
            if ($i % 5 === 0) {
                $restaurant['is_trending'] = true;
            }
            
            // Add top rated status to restaurants with rating 4.7+
            if ($restaurant['rating'] >= 4.7) {
                $restaurant['is_top_rated'] = true;
            }
            
            $restaurants[] = $restaurant;
        }
        
        return [
            'data' => $restaurants,
            'total' => count($restaurants),
            'per_page' => 12,
            'current_page' => 1,
            'last_page' => (int) ceil(count($restaurants) / 12),
        ];
    }

    /**
     * Get featured restaurants
     */
    private function getFeaturedRestaurants(): array
    {
        return array_filter($this->getRestaurants()['data'], function ($restaurant) {
            return $restaurant['is_featured'] ?? false;
        });
    }

    /**
     * Get top rated restaurants
     */
    private function getTopRatedRestaurants(): array
    {
        $restaurants = $this->getRestaurants()['data'];
        
        // Sort by rating
        usort($restaurants, function ($a, $b) {
            return $b['rating'] <=> $a['rating'];
        });
        
        // Return top 5
        return array_slice($restaurants, 0, 6);
    }

    /**
     * Get trending restaurants
     */
    private function getTrendingRestaurants(): array
    {
        return array_filter($this->getRestaurants()['data'], function ($restaurant) {
            return $restaurant['is_trending'] ?? false;
        });
    }

    /**
     * Get nearby restaurants
     */
    private function getNearbyRestaurants(): array
    {
        $restaurants = $this->getRestaurants()['data'];
        
        // Sort by distance
        usort($restaurants, function ($a, $b) {
            return $a['distance'] <=> $b['distance'];
        });
        
        // Return top 6
        return array_slice($restaurants, 0, 6);
    }

    /**
     * Get popular cuisines
     */
    private function getPopularCuisines(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Italian',
                'image' => '/images/cuisines/italian.jpg',
                'restaurant_count' => 42,
                'popular_dishes' => ['Pizza', 'Pasta', 'Risotto']
            ],
            [
                'id' => 2,
                'name' => 'Japanese',
                'image' => '/images/cuisines/japanese.jpg',
                'restaurant_count' => 36,
                'popular_dishes' => ['Sushi', 'Ramen', 'Tempura']
            ],
            [
                'id' => 3,
                'name' => 'Indian',
                'image' => '/images/cuisines/indian.jpg',
                'restaurant_count' => 28,
                'popular_dishes' => ['Curry', 'Biryani', 'Naan']
            ],
            [
                'id' => 4,
                'name' => 'Mexican',
                'image' => '/images/cuisines/mexican.jpg',
                'restaurant_count' => 34,
                'popular_dishes' => ['Tacos', 'Burritos', 'Enchiladas']
            ],
            [
                'id' => 5,
                'name' => 'Chinese',
                'image' => '/images/cuisines/chinese.jpg',
                'restaurant_count' => 45,
                'popular_dishes' => ['Dim Sum', 'Noodles', 'Peking Duck']
            ],
            [
                'id' => 6,
                'name' => 'Thai',
                'image' => '/images/cuisines/thai.jpg',
                'restaurant_count' => 22,
                'popular_dishes' => ['Pad Thai', 'Green Curry', 'Tom Yum']
            ],
            [
                'id' => 7,
                'name' => 'Mediterranean',
                'image' => '/images/cuisines/mediterranean.jpg',
                'restaurant_count' => 18,
                'popular_dishes' => ['Hummus', 'Falafel', 'Shawarma']
            ],
            [
                'id' => 8,
                'name' => 'American',
                'image' => '/images/cuisines/american.jpg',
                'restaurant_count' => 53,
                'popular_dishes' => ['Burgers', 'BBQ', 'Fried Chicken']
            ],
        ];
    }

    /**
     * Get filter options
     */
    private function getFilters(): array
    {
        return [
            'cuisines' => [
                'Italian', 'Japanese', 'Indian', 'Chinese', 'Thai', 'American', 'Mexican',
                'Mediterranean', 'French', 'Korean', 'Vietnamese', 'Middle Eastern',
                'Greek', 'Spanish', 'Turkish', 'Lebanese', 'Brazilian', 'Vegetarian', 'Vegan'
            ],
            'dietary' => [
                'Vegetarian', 'Vegan', 'Halal', 'Gluten-Free', 'Kosher',
                'Dairy-Free', 'Nut-Free', 'Organic', 'Low-Carb', 'Sugar-Free'
            ],
            'features' => [
                'Outdoor Seating', 'Delivery', 'Takeout', 'Reservations',
                'Group Friendly', 'Kids Friendly', 'Accepts Credit Cards',
                'Wheelchair Accessible', 'Free Wi-Fi', 'Alcohol Served'
            ],
            'price_ranges' => ['$', '$$', '$$$', '$$$$'],
            'sort_options' => [
                ['id' => 'recommended', 'name' => 'Recommended'],
                ['id' => 'rating_desc', 'name' => 'Rating (high to low)'],
                ['id' => 'distance_asc', 'name' => 'Distance'],
                ['id' => 'delivery_time_asc', 'name' => 'Delivery Time'],
                ['id' => 'price_asc', 'name' => 'Price (low to high)'],
                ['id' => 'price_desc', 'name' => 'Price (high to low)'],
            ],
        ];
    }

    /**
     * Get stats for the page
     */
    private function getStats(): array
    {
        return [
            ['label' => 'Restaurants', 'value' => '2,500+', 'icon' => 'Store'],
            ['label' => 'Cuisines', 'value' => '60+', 'icon' => 'Utensils'],
            ['label' => 'Cities', 'value' => '25+', 'icon' => 'MapPin'],
            ['label' => 'Happy Customers', 'value' => '250K+', 'icon' => 'Users'],
        ];
    }

    /**
     * Get restaurant categories
     */
    private function getCategories(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Fine Dining',
                'image' => '/images/categories/fine-dining.jpg',
                'description' => 'Exquisite culinary experiences with premium service',
                'count' => 45,
            ],
            [
                'id' => 2,
                'name' => 'Casual Dining',
                'image' => '/images/categories/casual-dining.jpg',
                'description' => 'Relaxed atmosphere with quality food',
                'count' => 120,
            ],
            [
                'id' => 3,
                'name' => 'Fast Food',
                'image' => '/images/categories/fast-food.jpg',
                'description' => 'Quick and convenient meals',
                'count' => 95,
            ],
            [
                'id' => 4,
                'name' => 'Cafés',
                'image' => '/images/categories/cafes.jpg',
                'description' => 'Coffee, light bites, and relaxed ambiance',
                'count' => 78,
            ],
            [
                'id' => 5,
                'name' => 'Food Trucks',
                'image' => '/images/categories/food-trucks.jpg',
                'description' => 'Mobile eateries with diverse offerings',
                'count' => 40,
            ],
            [
                'id' => 6,
                'name' => 'Pubs & Bars',
                'image' => '/images/categories/pubs.jpg',
                'description' => 'Drinks with quality food options',
                'count' => 65,
            ],
            [
                'id' => 7,
                'name' => 'Buffet',
                'image' => '/images/categories/buffet.jpg',
                'description' => 'All-you-can-eat dining experiences',
                'count' => 28,
            ],
            [
                'id' => 8,
                'name' => 'Food Delivery Only',
                'image' => '/images/categories/delivery-only.jpg',
                'description' => 'Restaurants specializing in delivery service',
                'count' => 52,
            ],
        ];
    }

    /**
     * Calculate distance between user and restaurant (dummy function)
     */
    private function calculateDistance(Restaurant $restaurant): float
    {
        // This would normally use real geolocation data
        return rand(1, 10) / 2.5;
    }
} 