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
            'cuisine_types' => $restaurant->cuisineTypes->pluck('name'),
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
            'tags' => $restaurant->tags->pluck('name'),
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
        return $restaurant->menuCategories()
            ->with(['items' => function ($query) {
                $query->active()
                    ->with(['variations', 'addons', 'allergens', 'media']);
            }])
            ->active()
            ->ordered()
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'description' => $category->description,
                    'items' => $category->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'name' => $item->name,
                            'description' => $item->description,
                            'price' => $item->price,
                            'image' => $item->image_url,
                            'is_vegetarian' => $item->is_vegetarian,
                            'is_vegan' => $item->is_vegan,
                            'is_spicy' => $item->is_spicy,
                            'allergens' => $item->allergens->pluck('name'),
                            'variations' => $item->variations,
                            'addons' => $item->addons,
                            'preparation_time' => $item->preparation_time,
                            'calories' => $item->calories,
                            'rating' => $item->average_rating,
                            'reviews_count' => $item->reviews_count,
                            'is_popular' => $item->is_popular,
                            'is_new' => $item->is_new,
                        ];
                    })
                ];
            })
            ->toArray();
    }

    private function getRestaurantReviews(Restaurant $restaurant): array
    {
        return [
            'summary' => [
                'average_rating' => $restaurant->average_rating,
                'total_reviews' => $restaurant->reviews_count,
                'rating_breakdown' => [
                    'food' => $restaurant->food_rating,
                    'service' => $restaurant->service_rating,
                    'ambience' => $restaurant->ambience_rating,
                    'value' => $restaurant->value_rating
                ]
            ],
            'reviews' => $restaurant->reviews()
                ->with(['user', 'media'])
                ->latest()
                ->paginate(10)
                ->through(fn ($review) => [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'images' => $review->getMedia('reviews')->map->getUrl(),
                    'created_at' => $review->created_at->diffForHumans(),
                    'user' => [
                        'name' => $review->user->name,
                        'avatar' => $review->user->avatar_url,
                        'reviews_count' => $review->user->reviews_count
                    ]
                ])
        ];
    }

    private function getRestaurantGallery(Restaurant $restaurant): array
    {
        return $restaurant->getMedia('gallery')
            ->map(function ($media) {
                return [
                    'id' => $media->id,
                    'url' => $media->getUrl(),
                    'thumbnail' => $media->getUrl('thumbnail'),
                    'caption' => $media->getCustomProperty('caption'),
                    'type' => $media->getCustomProperty('type', 'image')
                ];
            })
            ->toArray();
    }

    private function getLocationData(Restaurant $restaurant): array
    {
        return [
            'address' => [
                'street' => $restaurant->street,
                'city' => $restaurant->city,
                'state' => $restaurant->state,
                'postal_code' => $restaurant->postal_code,
                'country' => $restaurant->country,
                'formatted' => $restaurant->full_address
            ],
            'coordinates' => [
                'latitude' => $restaurant->latitude,
                'longitude' => $restaurant->longitude
            ],
            'delivery_zones' => $restaurant->deliveryZones->map(function ($zone) {
                return [
                    'id' => $zone->id,
                    'name' => $zone->name,
                    'coordinates' => $zone->coordinates,
                    'delivery_fee' => $zone->delivery_fee,
                    'minimum_order' => $zone->minimum_order,
                    'estimated_time' => $zone->estimated_delivery_time
                ];
            })
        ];
    }

    private function getBusinessHours(Restaurant $restaurant): array
    {
        return $restaurant->businessHours
            ->groupBy('day')
            ->map(function ($hours) {
                return $hours->map(function ($hour) {
                    return [
                        'opens_at' => $hour->opens_at,
                        'closes_at' => $hour->closes_at,
                        'is_closed' => $hour->is_closed
                    ];
                });
            })
            ->toArray();
    }

    private function getFeatures(Restaurant $restaurant): array
    {
        return [
            'amenities' => $restaurant->amenities->pluck('name'),
            'payment_methods' => $restaurant->paymentMethods->pluck('name'),
            'services' => [
                'dine_in' => $restaurant->has_dine_in,
                'takeaway' => $restaurant->has_takeaway,
                'delivery' => $restaurant->has_delivery,
                'reservations' => $restaurant->accepts_reservations
            ],
            'certifications' => $restaurant->certifications->pluck('name'),
            'safety_measures' => $restaurant->safetyMeasures->pluck('name')
        ];
    }

    private function getSimilarRestaurants(Restaurant $restaurant): array
    {
        return Restaurant::active()
            ->where('id', '!=', $restaurant->id)
            ->whereHas('cuisineTypes', function ($query) use ($restaurant) {
                $query->whereIn('id', $restaurant->cuisineTypes->pluck('id'));
            })
            ->inRandomOrder()
            ->limit(4)
            ->get()
            ->map(function ($similar) {
                return [
                    'id' => $similar->id,
                    'name' => $similar->name,
                    'slug' => $similar->slug,
                    'image' => $similar->cover_image_url,
                    'cuisine_types' => $similar->cuisineTypes->pluck('name'),
                    'rating' => $similar->average_rating,
                    'delivery_time' => $similar->estimated_delivery_time
                ];
            })
            ->toArray();
    }

    private function getActiveOffers(Restaurant $restaurant): array
    {
        return $restaurant->offers()
            ->active()
            ->get()
            ->map(function ($offer) {
                return [
                    'id' => $offer->id,
                    'title' => $offer->title,
                    'description' => $offer->description,
                    'code' => $offer->code,
                    'discount_type' => $offer->discount_type,
                    'discount_value' => $offer->discount_value,
                    'minimum_order' => $offer->minimum_order,
                    'expires_at' => $offer->expires_at?->format('Y-m-d H:i:s'),
                    'terms' => $offer->terms
                ];
            })
            ->toArray();
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
        return [
            'title' => 'Find Your Favorite Food',
            'subtitle' => 'Order food from the best restaurants in your area',
            'image' => asset('images/hero/restaurant-hero.jpg'),
            'featured_cuisines' => $this->getFeaturedCuisines(),
            'search_suggestions' => $this->getSearchSuggestions(),
        ];
    }

    private function getFeaturedCuisines(int $limit = 6): array
    {
        // return \App\Models\CuisineType::withCount('restaurants')
        //     ->orderBy('restaurants_count', 'desc')
        //     ->take($limit)
        //     ->get()
        //     ->map(function ($cuisine) {
        //         return [
        //             'id' => $cuisine->id,
        //             'name' => $cuisine->name,
        //             'slug' => $cuisine->slug,
        //             'icon' => $cuisine->icon,
        //             'image' => $cuisine->image_url,
        //             'restaurants_count' => $cuisine->restaurants_count
        //         ];
        //     })
        //     ->toArray();

        // add some dummy data for testing
        return [
            'id' => 1,
            'name' => 'Italian',
            'slug' => 'italian',
            'icon' => 'fa-solid fa-pizza-slice',
            'image' => 'https://via.placeholder.com/150',
            'restaurants_count' => 10
        ];
    }

    private function getSearchSuggestions(): array
    {
        return [
            'Popular searches' => [
                'Pizza', 'Burger', 'Sushi', 'Chinese', 'Indian', 'Italian'
            ],
            'Trending now' => [
                'Healthy Food', 'Vegan', 'Desserts', 'BBQ'
            ]
        ];
    }

    private function getRestaurants(): array
    {
        return Restaurant::active()
            ->with(['cuisineTypes', 'tags'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->orderBy('reviews_avg_rating', 'desc')
            ->paginate(12)
            ->through(function ($restaurant) {
                return [
                    'id' => $restaurant->id,
                    'name' => $restaurant->name,
                    'slug' => $restaurant->slug,
                    'logo' => $restaurant->logo_url,
                    'cover_image' => $restaurant->cover_image_url,
                    'cuisine_types' => $restaurant->cuisineTypes->pluck('name'),
                    'tags' => $restaurant->tags->pluck('name'),
                    'rating' => round($restaurant->reviews_avg_rating, 1),
                    'reviews_count' => $restaurant->reviews_count,
                    'delivery_time' => $restaurant->estimated_delivery_time,
                    'minimum_order' => $restaurant->minimum_order,
                    'delivery_fee' => $restaurant->delivery_fee,
                    'is_featured' => $restaurant->is_featured,
                    'is_new' => $restaurant->created_at->gt(now()->subDays(30)),
                    'distance' => $this->calculateDistance($restaurant)
                ];
            })
            ->toArray();
    }

    private function getFeaturedRestaurants(int $limit = 8): array
    {
        return Restaurant::active()
            ->featured()
            ->with(['cuisineTypes', 'tags'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->inRandomOrder()
            ->take($limit)
            ->get()
            ->map(function ($restaurant) {
                return [
                    'id' => $restaurant->id,
                    'name' => $restaurant->name,
                    'slug' => $restaurant->slug,
                    'logo' => $restaurant->logo_url,
                    'cover_image' => $restaurant->cover_image_url,
                    'cuisine_types' => $restaurant->cuisineTypes->pluck('name'),
                    'tags' => $restaurant->tags->pluck('name'),
                    'rating' => round($restaurant->reviews_avg_rating, 1),
                    'reviews_count' => $restaurant->reviews_count,
                    'delivery_time' => $restaurant->estimated_delivery_time,
                    'minimum_order' => $restaurant->minimum_order,
                    'delivery_fee' => $restaurant->delivery_fee,
                    'promotion' => $restaurant->current_promotion,
                    'distance' => $this->calculateDistance($restaurant)
                ];
            })
            ->toArray();
    }

    private function getPopularCuisines(int $limit = 12): array
    {
        return \App\Models\CuisineType::withCount('restaurants')
            ->having('restaurants_count', '>', 0)
            ->orderBy('restaurants_count', 'desc')
            ->take($limit)
            ->get()
            ->map(function ($cuisine) {
                return [
                    'id' => $cuisine->id,
                    'name' => $cuisine->name,
                    'slug' => $cuisine->slug,
                    'icon' => $cuisine->icon,
                    'image' => $cuisine->image_url,
                    'restaurants_count' => $cuisine->restaurants_count,
                    'description' => $cuisine->description
                ];
            })
            ->toArray();
    }

    private function getFilters(): array
    {
        return [
            'cuisines' => \App\Models\CuisineType::select('id', 'name')
                ->withCount('restaurants')
                ->having('restaurants_count', '>', 0)
                ->orderBy('name')
                ->get(),
            'price_ranges' => [
                ['min' => 0, 'max' => 15, 'label' => '$'],
                ['min' => 15, 'max' => 30, 'label' => '$$'],
                ['min' => 30, 'max' => 50, 'label' => '$$$'],
                ['min' => 50, 'max' => null, 'label' => '$$$$'],
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
        return Cache::remember('restaurant_stats', 3600, function () {
            return [
                'total_restaurants' => Restaurant::active()->count(),
                'total_cuisines' => \App\Models\CuisineType::count(),
                'total_orders' => \App\Models\Order::completed()->count(),
                'total_reviews' => \App\Models\Review::published()->count(),
                'average_delivery_time' => Restaurant::avg('estimated_delivery_time'),
                'popular_cuisines' => \App\Models\CuisineType::withCount('restaurants')
                    ->orderBy('restaurants_count', 'desc')
                    ->take(5)
                    ->get()
                    ->pluck('name'),
                'top_rated_restaurants' => Restaurant::active()
                    ->withAvg('reviews', 'rating')
                    ->orderBy('reviews_avg_rating', 'desc')
                    ->take(5)
                    ->get()
                    ->pluck('name')
            ];
        });
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