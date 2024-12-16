<?php

declare(strict_types=1);

namespace App\Services\Frontend;

use App\Services\BaseService;
use App\Models\Restaurant;
use Illuminate\Support\Facades\Cache;

final class RestaurantService extends BaseService
{
    public function getRestaurantData(Restaurant $restaurant): array
    {
        // Cache restaurant data for better performance
        // return Cache::remember("restaurant.{$restaurant->id}", 3600, function () use ($restaurant) {
            return [
                'details' => $this->getRestaurantDetails($restaurant),
                'menu' => $this->getRestaurantMenu($restaurant),
                'reviews' => $this->getRestaurantReviews($restaurant),
                'gallery' => $this->getRestaurantGallery($restaurant),
                'location' => $this->getLocationData($restaurant),
                'hours' => $this->getBusinessHours($restaurant),
                'features' => $this->getFeatures($restaurant),
                'similarRestaurants' => $this->getSimilarRestaurants($restaurant),
                'offers' => $this->getActiveOffers($restaurant),
            ];
        // });
    }

    private function getRestaurantDetails(Restaurant $restaurant): array
    {
        return [
            'id' => $restaurant->id,
            'name' => $restaurant->name,
            'slug' => $restaurant->slug,
            'description' => $restaurant->description,
            'logo' => $restaurant->logo_url,
            'cover_image' => $restaurant->cover_image_url,
            // 'cuisine_types' => $restaurant->cuisineTypes->pluck('name'),
            'cuisine_types' => ['Italian', 'Japanese', 'Mexican', 'Indian' ],
            'rating' => [
                'average' => $restaurant->average_rating,
                'count' => $restaurant->reviews_count,
                'breakdown' => [
                    5 => $restaurant->five_star_reviews_count,
                    4 => $restaurant->four_star_reviews_count,
                    3 => $restaurant->three_star_reviews_count,
                    2 => $restaurant->two_star_reviews_count,
                    1 => $restaurant->one_star_reviews_count,
                ]
            ],
            // 'tags' => $restaurant->tags->pluck('name'),
            'tags' => ['Italian', 'Japanese', 'Mexican', 'Indian' ],
            'badges' => $restaurant->badges,
            'delivery_info' => [
                'minimum_order' => $restaurant->minimum_order,
                'delivery_fee' => $restaurant->delivery_fee,
                'estimated_time' => $restaurant->estimated_delivery_time,
                'free_delivery_over' => $restaurant->free_delivery_over,
            ],
            'contact' => [
                'phone' => $restaurant->phone,
                'email' => $restaurant->email,
                'website' => $restaurant->website,
            ]
        ];
    }

    private function getRestaurantMenu(Restaurant $restaurant): array
    {
        // return $restaurant->menuCategories()
        //     ->with(['items' => function ($query) {
        //         $query->active()
        //             ->with(['variations', 'addons', 'allergens', 'media']);
        //     }])
        //     ->active()
        //     ->ordered()
        //     ->get()
        //     ->map(function ($category) {
        //         return [
        //             'id' => $category->id,
        //             'name' => $category->name,
        //             'description' => $category->description,
        //             'items' => $category->items->map(function ($item) {
        //                 return [
        //                     'id' => $item->id,
        //                     'name' => $item->name,
        //                     'description' => $item->description,
        //                     'price' => $item->price,
        //                     'image' => $item->image_url,
        //                     'is_vegetarian' => $item->is_vegetarian,
        //                     'is_vegan' => $item->is_vegan,
        //                     'is_spicy' => $item->is_spicy,
        //                     'allergens' => $item->allergens->pluck('name'),
        //                     'variations' => $item->variations,
        //                     'addons' => $item->addons,
        //                     'preparation_time' => $item->preparation_time,
        //                     'calories' => $item->calories,
        //                     'rating' => $item->average_rating,
        //                     'reviews_count' => $item->reviews_count,
        //                     'is_popular' => $item->is_popular,
        //                     'is_new' => $item->is_new,
        //                 ];
        //             })
        //         ];
        //     })
        //     ->toArray();

        return [];
    }

    private function getRestaurantReviews(Restaurant $restaurant): array
    {
        return [];
        // return [
        //     'summary' => [
        //         'average_rating' => $restaurant->average_rating,
        //         'total_reviews' => $restaurant->reviews_count,
        //         'rating_breakdown' => [
        //             'food' => $restaurant->food_rating,
        //             'service' => $restaurant->service_rating,
        //             'ambience' => $restaurant->ambience_rating,
        //             'value' => $restaurant->value_rating
        //         ]
        //     ],
        //     'reviews' => $restaurant->reviews()
        //         ->with(['user', 'media'])
        //         ->latest()
        //         ->paginate(10)
        //         ->through(fn ($review) => [
        //             'id' => $review->id,
        //             'rating' => $review->rating,
        //             'comment' => $review->comment,
        //             'images' => $review->getMedia('reviews')->map->getUrl(),
        //             'created_at' => $review->created_at->diffForHumans(),
        //             'user' => [
        //                 'name' => $review->user->name,
        //                 'avatar' => $review->user->avatar_url,
        //                 'reviews_count' => $review->user->reviews_count
        //             ]
        //         ])
        // ];
    }

    private function getRestaurantGallery(Restaurant $restaurant): array
    {
        return [];
        // return $restaurant->getMedia('gallery')
        //     ->map(function ($media) {
        //         return [
        //             'id' => $media->id,
        //             'url' => $media->getUrl(),
        //             'thumbnail' => $media->getUrl('thumbnail'),
        //             'caption' => $media->getCustomProperty('caption'),
        //             'type' => $media->getCustomProperty('type', 'image')
        //         ];
        //     })
        //     ->toArray();
    }

    private function getLocationData(Restaurant $restaurant): array
    {
        return [];
        // return [
        //     'address' => [
        //         'street' => $restaurant->street,
        //         'city' => $restaurant->city,
        //         'state' => $restaurant->state,
        //         'postal_code' => $restaurant->postal_code,
        //         'country' => $restaurant->country,
        //         'formatted' => $restaurant->full_address
        //     ],
        //     'coordinates' => [
        //         'latitude' => $restaurant->latitude,
        //         'longitude' => $restaurant->longitude
        //     ],
        //     'delivery_zones' => $restaurant->deliveryZones->map(function ($zone) {
        //         return [
        //             'id' => $zone->id,
        //             'name' => $zone->name,
        //             'coordinates' => $zone->coordinates,
        //             'delivery_fee' => $zone->delivery_fee,
        //             'minimum_order' => $zone->minimum_order,
        //             'estimated_time' => $zone->estimated_delivery_time
        //         ];
        //     })
        // ];
    }

    private function getBusinessHours(Restaurant $restaurant): array
    {
        return [];
        // return $restaurant->businessHours
        //     ->groupBy('day')
        //     ->map(function ($hours) {
        //         return $hours->map(function ($hour) {
        //             return [
        //                 'opens_at' => $hour->opens_at,
        //                 'closes_at' => $hour->closes_at,
        //                 'is_closed' => $hour->is_closed
        //             ];
        //         });
        //     })
        //     ->toArray();
    }

    private function getFeatures(Restaurant $restaurant): array
    {
        return [];
        // return [
        //     'amenities' => $restaurant->amenities->pluck('name'),
        //     'payment_methods' => $restaurant->paymentMethods->pluck('name'),
        //     'services' => [
        //         'dine_in' => $restaurant->has_dine_in,
        //         'takeaway' => $restaurant->has_takeaway,
        //         'delivery' => $restaurant->has_delivery,
        //         'reservations' => $restaurant->accepts_reservations
        //     ],
        //     'certifications' => $restaurant->certifications->pluck('name'),
        //     'safety_measures' => $restaurant->safetyMeasures->pluck('name')
        // ];
    }

    private function getSimilarRestaurants(Restaurant $restaurant): array
    {
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


        // return Restaurant::active()
        //     ->where('id', '!=', $restaurant->id)
        //     ->whereHas('cuisineTypes', function ($query) use ($restaurant) {
        //         $query->whereIn('id', $restaurant->cuisineTypes->pluck('id'));
        //     })
        //     ->inRandomOrder()
        //     ->limit(4)
        //     ->get()
        //     ->map(function ($similar) {
        //         return [
        //             'id' => $similar->id,
        //             'name' => $similar->name,
        //             'slug' => $similar->slug,
        //             'image' => $similar->cover_image_url,
        //             'cuisine_types' => $similar->cuisineTypes->pluck('name'),
        //             'rating' => $similar->average_rating,
        //             'delivery_time' => $similar->estimated_delivery_time
        //         ];
        //     })
        //     ->toArray();
    }

    private function getActiveOffers(Restaurant $restaurant): array
    {
        return [];
        // return $restaurant->offers()
        //     ->active()
        //     ->get()
        //     ->map(function ($offer) {
        //         return [
        //             'id' => $offer->id,
        //             'title' => $offer->title,
        //             'description' => $offer->description,
        //             'code' => $offer->code,
        //             'discount_type' => $offer->discount_type,
        //             'discount_value' => $offer->discount_value,
        //             'minimum_order' => $offer->minimum_order,
        //             'expires_at' => $offer->expires_at?->format('Y-m-d H:i:s'),
        //             'terms' => $offer->terms
        //         ];
        //     })
        //     ->toArray();
    }

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
        // Comment out original implementation
        // return [
        //     'title' => 'Find Your Favorite Food',
        //     'subtitle' => 'Order food from the best restaurants in your area',
        //     'image' => asset('images/hero/restaurant-hero.jpg'),
        //     'featured_cuisines' => $this->getFeaturedCuisines(),
        //     'search_suggestions' => $this->getSearchSuggestions(),
        // ];

        // Dummy data
        return [
            'title' => 'Find Your Favorite Food',
            'subtitle' => 'Order food from the best restaurants in your area',
            'image' => 'https://via.placeholder.com/1920x1080',
            'featured_cuisines' => [
                [
                    'id' => 1,
                    'name' => 'Italian',
                    'slug' => 'italian',
                    'icon' => 'fa-pizza-slice',
                    'image' => 'https://via.placeholder.com/150',
                    'restaurants_count' => 12
                ],
                [
                    'id' => 2,
                    'name' => 'Japanese',
                    'slug' => 'japanese',
                    'icon' => 'fa-bowl-rice',
                    'image' => 'https://via.placeholder.com/150',
                    'restaurants_count' => 8
                ],
                // Add more dummy cuisines...
            ],
            'search_suggestions' => [
                'Popular searches' => ['Pizza', 'Burger', 'Sushi'],
                'Trending now' => ['Healthy Food', 'Vegan', 'BBQ']
            ]
        ];
    }

    private function getRestaurants(): array
    {

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

        
        // Comment out original implementation
        // return Restaurant::active()...

        // Dummy data
        // $restaurants = [];
        // for ($i = 1; $i <= 12; $i++) {
        //     $restaurants[] = [
        //         'id' => $i,
        //         'name' => "Restaurant $i",
        //         'slug' => "restaurant-$i",
        //         'logo' => "https://via.placeholder.com/80",
        //         'cover_image' => "https://via.placeholder.com/800x400",
        //         'cuisine_types' => ['Italian', 'American'],
        //         'tags' => ['Family Friendly', 'Outdoor Seating'],
        //         'rating' => rand(35, 50) / 10,
        //         'reviews_count' => rand(10, 100),
        //         'delivery_time' => rand(20, 60),
        //         'minimum_order' => rand(10, 30),
        //         'delivery_fee' => rand(2, 8),
        //         'is_featured' => rand(0, 1),
        //         'is_new' => rand(0, 1),
        //         'distance' => rand(1, 10)
        //     ];
        // }

        // return [
        //     'data' => $restaurants,
        //     'total' => 50,
        //     'per_page' => 12,
        //     'current_page' => 1,
        //     'last_page' => 5
        // ];
    }

    private function getFeaturedRestaurants(int $limit = 8): array
    {
        // Comment out original implementation
        // return Restaurant::active()...

        // Dummy data
        $restaurants = [];
        for ($i = 1; $i <= $limit; $i++) {
            $restaurants[] = [
                'id' => $i,
                'name' => "Featured Restaurant $i",
                'slug' => "featured-restaurant-$i",
                'logo' => "https://via.placeholder.com/80",
                'cover_image' => "https://via.placeholder.com/800x400",
                'cuisine_types' => ['Italian', 'Mediterranean'],
                'tags' => ['Trending', 'Popular'],
                'rating' => rand(40, 50) / 10,
                'reviews_count' => rand(50, 200),
                'delivery_time' => rand(15, 45),
                'minimum_order' => rand(15, 40),
                'delivery_fee' => rand(0, 5),
                'promotion' => rand(0, 1) ? '20% OFF' : null,
                'distance' => rand(1, 8)
            ];
        }

        return $restaurants;
    }

    private function getPopularCuisines(int $limit = 12): array
    {
        // Comment out original implementation
        // return \App\Models\CuisineType::withCount...

        // Dummy data
        $cuisines = [
            ['id' => 1, 'name' => 'Italian', 'slug' => 'italian', 'icon' => 'fa-pizza-slice', 'image' => 'https://via.placeholder.com/200', 'restaurants_count' => 15, 'description' => 'Authentic Italian cuisine'],
            ['id' => 2, 'name' => 'Japanese', 'slug' => 'japanese', 'icon' => 'fa-bowl-rice', 'image' => 'https://via.placeholder.com/200', 'restaurants_count' => 12, 'description' => 'Traditional Japanese dishes'],
            ['id' => 3, 'name' => 'Mexican', 'slug' => 'mexican', 'icon' => 'fa-pepper-hot', 'image' => 'https://via.placeholder.com/200', 'restaurants_count' => 10, 'description' => 'Spicy Mexican favorites'],
            ['id' => 4, 'name' => 'Indian', 'slug' => 'indian', 'icon' => 'fa-bowl-food', 'image' => 'https://via.placeholder.com/200', 'restaurants_count' => 8, 'description' => 'Flavorful Indian cuisine']
        ];

        return array_slice($cuisines, 0, $limit);
    }

    private function getFilters(): array
    {
        // Comment out original implementation
        // return [...

        // Dummy data
        return [
            'cuisines' => [
                ['id' => 1, 'name' => 'Italian', 'restaurants_count' => 15],
                ['id' => 2, 'name' => 'Japanese', 'restaurants_count' => 12],
                ['id' => 3, 'name' => 'Mexican', 'restaurants_count' => 10],
                ['id' => 4, 'name' => 'Indian', 'restaurants_count' => 8]
            ],
            'price_ranges' => [
                ['min' => 0, 'max' => 15, 'label' => '$'],
                ['min' => 15, 'max' => 30, 'label' => '$$'],
                ['min' => 30, 'max' => 50, 'label' => '$$$'],
                ['min' => 50, 'max' => null, 'label' => '$$$$']
            ],
            'dietary' => [
                'vegetarian' => 'Vegetarian Options',
                'vegan' => 'Vegan Options',
                'halal' => 'Halal',
                'gluten_free' => 'Gluten Free'
            ],
            'features' => [
                'delivery' => 'Delivery',
                'takeaway' => 'Takeaway',
                'dine_in' => 'Dine-in',
                'outdoor_seating' => 'Outdoor Seating',
                'parking' => 'Parking Available',
                'wifi' => 'Free WiFi'
            ],
            'sort_options' => [
                'rating' => 'Rating',
                'delivery_time' => 'Delivery Time',
                'minimum_order' => 'Minimum Order',
                'distance' => 'Distance'
            ]
        ];
    }

    private function getStats(): array
    {
        // Comment out original implementation
        // return Cache::remember...

        // Dummy data
        return [
            'total_restaurants' => 150,
            'total_cuisines' => 20,
            'total_orders' => 5000,
            'total_reviews' => 3500,
            'average_delivery_time' => 30,
            'popular_cuisines' => ['Italian', 'Japanese', 'Mexican', 'Indian', 'Thai'],
            'top_rated_restaurants' => [
                'Pizza Palace',
                'Sushi Master',
                'Taco Heaven',
                'Curry House',
                'Pasta Paradise'
            ]
        ];
    }

    private function calculateDistance(Restaurant $restaurant): float
    {
        // Get user's location from session or default location
        $userLat = session('user_latitude', config('app.default_latitude'));
        $userLng = session('user_longitude', config('app.default_longitude'));

        // Calculate distance using Haversine formula
        $earthRadius = 6371; // Earth's radius in kilometers

        $latDelta = deg2rad($restaurant->latitude - $userLat);
        $lngDelta = deg2rad($restaurant->longitude - $userLng);

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
            cos(deg2rad($userLat)) * cos(deg2rad($restaurant->latitude)) *
            sin($lngDelta / 2) * sin($lngDelta / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        $distance = $earthRadius * $c;

        return round($distance, 1);
    }
}