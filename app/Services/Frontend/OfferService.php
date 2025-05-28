<?php

declare(strict_types=1);

namespace App\Services\Frontend;

use App\Models\Offer;
use App\Services\BaseService;
use Illuminate\Support\Str;

final class OfferService extends BaseService
{
    public function getOffersPageData(): array
    {
        try {
            return [
                'hero' => $this->getHeroSection(),
                'featured_offers' => $this->getFeaturedOffers(),
                'categories' => $this->getOfferCategories(),
                'latest_offers' => $this->getLatestOffers(),
                'popular_offers' => $this->getPopularOffers(),
                'stats' => $this->getStats(),
            ];
        } catch (\Throwable $e) {
            logger()->error('Error fetching offers page data: ' . $e->getMessage(), [
                'exception' => $e,
            ]);
            
            return [
                'hero' => $this->getHeroSection(),
                'featured_offers' => [],
                'categories' => [],
                'latest_offers' => [],
                'popular_offers' => [],
                'stats' => $this->getStats(),
                'error' => 'Failed to load some offers data. Please try again later.'
            ];
        }
    }

    private function getHeroSection(): array
    {
        return [
            'title' => 'Exclusive Offers & Discounts',
            'subtitle' => 'Save Big Today',
            'description' => 'Discover amazing deals on your favorite restaurants and dishes. Limited time offers updated daily.',
            'image' => '/images/offers-hero.jpg',
            'stats' => [
                ['label' => 'Active Offers', 'value' => '200+'],
                ['label' => 'Partner Restaurants', 'value' => '500+'],
                ['label' => 'Average Savings', 'value' => '25%'],
                ['label' => 'Happy Customers', 'value' => '100K+']
            ]
        ];
    }

    private function getFeaturedOffers(): array
    {
        return [
            [
                'id' => 1,
                'title' => 'Weekend Special: 30% Off',
                'description' => 'Get 30% off on all orders above $50 this weekend.',
                'image' => '/images/offers/offer-1.jpg',
                'discount' => 30,
                'code' => 'WEEKEND30',
                'valid_until' => '2023-08-31',
                'restaurant' => [
                    'id' => 1,
                    'name' => 'Pizza Paradise',
                    'logo' => '/images/restaurants/logo-1.jpg',
                    'rating' => 4.8
                ]
            ],
            [
                'id' => 2,
                'title' => 'Buy 1 Get 1 Free',
                'description' => 'Buy any main course and get another one free.',
                'image' => '/images/offers/offer-2.jpg',
                'discount' => 50,
                'code' => 'BOGO2023',
                'valid_until' => '2023-09-15',
                'restaurant' => [
                    'id' => 2,
                    'name' => 'Burger Bliss',
                    'logo' => '/images/restaurants/logo-2.jpg',
                    'rating' => 4.6
                ]
            ],
            [
                'id' => 3,
                'title' => 'Free Delivery All Day',
                'description' => 'Enjoy free delivery on all orders today.',
                'image' => '/images/offers/offer-3.jpg',
                'discount' => 100,
                'code' => 'FREEDEL',
                'valid_until' => '2023-08-25',
                'restaurant' => [
                    'id' => 3,
                    'name' => 'Taco Fiesta',
                    'logo' => '/images/restaurants/logo-3.jpg',
                    'rating' => 4.5
                ]
            ],
            [
                'id' => 4,
                'title' => 'First Order: 50% Off',
                'description' => 'New customers get 50% off on their first order.',
                'image' => '/images/offers/offer-4.jpg',
                'discount' => 50,
                'code' => 'FIRST50',
                'valid_until' => '2023-12-31',
                'restaurant' => [
                    'id' => 4,
                    'name' => 'Sushi Supreme',
                    'logo' => '/images/restaurants/logo-4.jpg',
                    'rating' => 4.9
                ]
            ],
        ];
    }

    private function getOfferCategories(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'New User Offers',
                'icon' => 'UserPlus',
                'slug' => 'new-user-offers',
                'description' => 'Special deals for first-time customers',
                'count' => 12,
                'background' => 'bg-gradient-to-r from-blue-500 to-indigo-600'
            ],
            [
                'id' => 2,
                'name' => 'Weekend Specials',
                'icon' => 'Calendar',
                'slug' => 'weekend-specials',
                'description' => 'Great deals for your weekend meals',
                'count' => 15,
                'background' => 'bg-gradient-to-r from-orange-500 to-pink-500'
            ],
            [
                'id' => 3,
                'name' => 'Buy One Get One',
                'icon' => 'Gift',
                'slug' => 'buy-one-get-one',
                'description' => 'Double the food for the same price',
                'count' => 8,
                'background' => 'bg-gradient-to-r from-green-500 to-teal-500'
            ],
            [
                'id' => 4,
                'name' => 'Free Delivery',
                'icon' => 'Truck',
                'slug' => 'free-delivery',
                'description' => 'No delivery fee on select restaurants',
                'count' => 20,
                'background' => 'bg-gradient-to-r from-purple-500 to-violet-600'
            ],
            [
                'id' => 5,
                'name' => 'Happy Hour',
                'icon' => 'Clock',
                'slug' => 'happy-hour',
                'description' => 'Limited time offers during specific hours',
                'count' => 10,
                'background' => 'bg-gradient-to-r from-yellow-500 to-amber-600'
            ],
            [
                'id' => 6,
                'name' => 'Seasonal Promotions',
                'icon' => 'Sparkles',
                'slug' => 'seasonal-promotions',
                'description' => 'Special offers for holidays and seasons',
                'count' => 14,
                'background' => 'bg-gradient-to-r from-red-500 to-rose-600'
            ],
        ];
    }

    private function getLatestOffers(): array
    {
        return [
            [
                'id' => 5,
                'title' => 'Summer Coolers: 25% Off',
                'description' => 'Beat the heat with 25% off on all cold beverages.',
                'image' => '/images/offers/offer-5.jpg',
                'discount' => 25,
                'code' => 'SUMMER25',
                'valid_until' => '2023-09-30',
                'created_at' => '2023-08-10T10:00:00',
                'restaurant' => [
                    'id' => 5,
                    'name' => 'Juice Junction',
                    'logo' => '/images/restaurants/logo-5.jpg',
                    'rating' => 4.7
                ],
                'category' => 'Seasonal Promotions'
            ],
            [
                'id' => 6,
                'title' => 'Lunch Special: 20% Off',
                'description' => 'Enjoy 20% off on all lunch orders between 12 PM and 3 PM.',
                'image' => '/images/offers/offer-6.jpg',
                'discount' => 20,
                'code' => 'LUNCH20',
                'valid_until' => '2023-09-15',
                'created_at' => '2023-08-08T15:30:00',
                'restaurant' => [
                    'id' => 6,
                    'name' => 'Pasta Palace',
                    'logo' => '/images/restaurants/logo-6.jpg',
                    'rating' => 4.5
                ],
                'category' => 'Happy Hour'
            ],
            [
                'id' => 7,
                'title' => 'Family Bundle: 15% Off',
                'description' => 'Save 15% on family-sized meal bundles.',
                'image' => '/images/offers/offer-7.jpg',
                'discount' => 15,
                'code' => 'FAMILY15',
                'valid_until' => '2023-10-31',
                'created_at' => '2023-08-05T12:45:00',
                'restaurant' => [
                    'id' => 7,
                    'name' => 'Chicken Champion',
                    'logo' => '/images/restaurants/logo-7.jpg',
                    'rating' => 4.6
                ],
                'category' => 'Weekend Specials'
            ],
            [
                'id' => 8,
                'title' => 'App-Exclusive: 10% Off',
                'description' => 'Get 10% off on all orders placed through our mobile app.',
                'image' => '/images/offers/offer-8.jpg',
                'discount' => 10,
                'code' => 'APP10',
                'valid_until' => '2023-12-31',
                'created_at' => '2023-08-01T09:15:00',
                'restaurant' => [
                    'id' => 8,
                    'name' => 'Noodle Nirvana',
                    'logo' => '/images/restaurants/logo-8.jpg',
                    'rating' => 4.4
                ],
                'category' => 'New User Offers'
            ],
        ];
    }

    private function getPopularOffers(): array
    {
        return [
            [
                'id' => 9,
                'title' => 'Happy Hour: 40% Off',
                'description' => 'Get 40% off on selected items from 4 PM to 7 PM.',
                'image' => '/images/offers/offer-9.jpg',
                'discount' => 40,
                'code' => 'HAPPY40',
                'valid_until' => '2023-09-30',
                'popularity_score' => 98,
                'claimed_count' => 1250,
                'restaurant' => [
                    'id' => 9,
                    'name' => 'Bar & Grill Co.',
                    'logo' => '/images/restaurants/logo-9.jpg',
                    'rating' => 4.8
                ],
                'category' => 'Happy Hour'
            ],
            [
                'id' => 10,
                'title' => 'Dessert Delight: 35% Off',
                'description' => 'Satisfy your sweet tooth with 35% off on all desserts.',
                'image' => '/images/offers/offer-10.jpg',
                'discount' => 35,
                'code' => 'SWEET35',
                'valid_until' => '2023-09-15',
                'popularity_score' => 95,
                'claimed_count' => 1050,
                'restaurant' => [
                    'id' => 10,
                    'name' => 'Dessert Dreams',
                    'logo' => '/images/restaurants/logo-10.jpg',
                    'rating' => 4.9
                ],
                'category' => 'Weekend Specials'
            ],
            [
                'id' => 11,
                'title' => 'Health Food: 30% Off',
                'description' => 'Get 30% off on all salads and healthy bowls.',
                'image' => '/images/offers/offer-11.jpg',
                'discount' => 30,
                'code' => 'HEALTH30',
                'valid_until' => '2023-10-15',
                'popularity_score' => 92,
                'claimed_count' => 950,
                'restaurant' => [
                    'id' => 11,
                    'name' => 'Green Goodness',
                    'logo' => '/images/restaurants/logo-11.jpg',
                    'rating' => 4.7
                ],
                'category' => 'Seasonal Promotions'
            ],
            [
                'id' => 12,
                'title' => 'Breakfast Bundle: 25% Off',
                'description' => 'Start your day with 25% off on breakfast combos.',
                'image' => '/images/offers/offer-12.jpg',
                'discount' => 25,
                'code' => 'MORNING25',
                'valid_until' => '2023-09-30',
                'popularity_score' => 90,
                'claimed_count' => 875,
                'restaurant' => [
                    'id' => 12,
                    'name' => 'Morning Munch',
                    'logo' => '/images/restaurants/logo-12.jpg',
                    'rating' => 4.6
                ],
                'category' => 'Buy One Get One'
            ],
        ];
    }

    private function getStats(): array
    {
        return [
            ['label' => 'Active Offers', 'value' => '200+', 'icon' => 'Tag'],
            ['label' => 'Partner Restaurants', 'value' => '500+', 'icon' => 'Store'],
            ['label' => 'Average Savings', 'value' => '25%', 'icon' => 'Percent'],
            ['label' => 'Happy Customers', 'value' => '100K+', 'icon' => 'Users']
        ];
    }

    public function getOfferDetails(int $id): ?array
    {
        try {
            $allOffers = array_merge(
                $this->getFeaturedOffers(),
                $this->getLatestOffers(),
                $this->getPopularOffers()
            );
            
            $offer = collect($allOffers)->firstWhere('id', $id);
            
            if (!$offer) {
                return null;
            }
            
            // Add additional details for single offer view
            $offer['terms_conditions'] = [
                'Offer valid until ' . $offer['valid_until'],
                'Cannot be combined with other offers',
                'Valid for dine-in and takeout orders',
                'Discount applies to food items only',
                'Restaurant reserves the right to modify or cancel the offer'
            ];
            
            $offer['how_to_redeem'] = [
                'Enter promo code ' . $offer['code'] . ' at checkout',
                'Show this offer to the restaurant staff',
                'Valid ID may be required for verification',
                'Offer subject to availability'
            ];
            
            return $offer;
        } catch (\Throwable $e) {
            logger()->error('Error fetching offer details: ' . $e->getMessage(), [
                'exception' => $e,
                'offer_id' => $id
            ]);
            
            return null;
        }
    }
} 