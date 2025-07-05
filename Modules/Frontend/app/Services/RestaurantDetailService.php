<?php

declare(strict_types=1);

namespace Modules\Frontend\Services;  

use App\Services\BaseService;
use App\Models\Restaurant;
use Illuminate\Support\Facades\Cache;

final class RestaurantDetailService extends BaseService
{
    /**
     * Get all data for the restaurant detail page
     */
    public function getRestaurantDetailData(string $slug = null): array
    {
        // Use caching for better performance
        return Cache::remember("restaurant_detail_page_data_{$slug}", 3600, function () use ($slug) {
            return [
                'hero' => $this->getHeroSection(),
                'restaurant' => $this->getRestaurantData($slug),
                'menu' => $this->getMenuSection(),
                'gallery' => $this->getGallerySection(),
                'reviews' => $this->getReviewsSection(),
                'about' => $this->getAboutSection(),
                'location' => $this->getLocationSection(),
                'bookingInfo' => $this->getBookingInfo(),
                'schedule' => $this->getScheduleData(),
                'chefs' => $this->getChefsData(),
                'offers' => $this->getOffersData(),
                'faqs' => $this->getFaqsData(),
                'similarRestaurants' => $this->getSimilarRestaurants(),
                'insights' => $this->getInsightData(),
            ];
        });
    }

    /**
     * Get hero section data
     */
    private function getHeroSection(): array
    {
        return [
            'backgroundImage' => '/images/restaurants/restaurant-hero-bg.jpg',
            'overlayColor' => 'rgba(0, 0, 0, 0.5)',
            'breadcrumbs' => [
                ['label' => 'Home', 'link' => '/'],
                ['label' => 'Restaurants', 'link' => '/restaurants'],
                ['label' => 'Restaurant Detail', 'link' => null],
            ],
        ];
    }

    /**
     * Get restaurant main data
     */
    private function getRestaurantData(string $slug = null): array
    {
        return [
            'id' => 1,
            'name' => 'Gourmet Haven',
            'slug' => $slug ?? 'gourmet-haven',
            'description' => 'An upscale dining experience featuring contemporary cuisine made with locally-sourced ingredients. Our chefs blend traditional techniques with modern innovation to create unforgettable culinary experiences.',
            'longDescription' => 'Gourmet Haven was established in 2015 by renowned chef Michael Reynolds, who sought to create a restaurant that celebrates local ingredients while incorporating global flavors and techniques. The space was designed by award-winning interior designer Sarah Chen, featuring a blend of modern aesthetics with warm, natural elements to create an inviting atmosphere for guests.

Our culinary philosophy centers on respecting ingredients and showcasing their natural flavors. We work directly with local farmers, foragers, and fishermen to source the freshest seasonal produce, sustainable seafood, and ethically raised meats. Our menu changes regularly to reflect what\'s available and at its peak.

The restaurant has earned numerous accolades, including three Michelin stars, a James Beard Award for Outstanding Restaurant, and has been consistently ranked among the top 50 restaurants in the world.',
            'logoUrl' => '/images/restaurants/gourmet-haven-logo.png',
            'coverImage' => '/images/restaurants/gourmet-haven-cover.jpg',
            'cuisineTypes' => ['Contemporary', 'Farm-to-Table', 'Fusion'],
            'priceRange' => '$$$',
            'rating' => 4.8,
            'reviewsCount' => 328,
            'isVerified' => true,
            'isOpen' => true,
            'distance' => 2.4,
            'badges' => ['Michelin Star', 'Award Winning', 'Vegan Options'],
            'tags' => ['romantic', 'outdoor seating', 'live music', 'wine selection'],
            'contactInfo' => [
                'phone' => '+1 (555) 123-4567',
                'email' => 'reservations@gourmethaven.com',
                'website' => 'https://www.gourmethaven.com',
                'socialMedia' => [
                    'facebook' => 'https://facebook.com/gourmethaven',
                    'instagram' => 'https://instagram.com/gourmethaven',
                    'twitter' => 'https://twitter.com/gourmethaven',
                ]
            ],
            'features' => [
                'dineIn' => true,
                'takeaway' => true,
                'delivery' => true,
                'reservations' => true,
                'outdoorSeating' => true,
                'privateEvents' => true,
                'wifi' => true,
                'parking' => 'Valet',
                'alcohol' => 'Full Bar',
                'liveMusic' => 'Weekends',
                'creditCards' => true,
                'accessibility' => true,
            ],
            'statistics' => [
                'averageRating' => 4.8,
                'totalReviews' => 328,
                'satisfactionRate' => 96,
                'averageWaitTime' => '15 min',
                'totalDishes' => 42,
                'monthlyVisitors' => 3800,
            ]
        ];
    }

    /**
     * Get menu section data
     */
    private function getMenuSection(): array
    {
        return [
            'categories' => [
                [
                    'id' => 1,
                    'name' => 'Appetizers',
                    'description' => 'Start your culinary journey with our delightful appetizers',
                    'image' => '/images/menu/appetizers.jpg',
                    'items' => [
                        [
                            'id' => 101,
                            'name' => 'Truffle Arancini',
                            'description' => 'Crispy risotto balls with black truffle and mozzarella',
                            'price' => 18.00,
                            'image' => '/images/menu/truffle-arancini.jpg',
                            'isPopular' => true,
                            'isVegetarian' => true,
                            'allergens' => ['Dairy', 'Gluten'],
                            'calories' => 320,
                        ],
                        [
                            'id' => 102,
                            'name' => 'Citrus Cured Salmon',
                            'description' => 'House-cured salmon with citrus, dill, and mustard sauce',
                            'price' => 22.00,
                            'image' => '/images/menu/citrus-salmon.jpg',
                            'isPopular' => false,
                            'allergens' => ['Fish'],
                            'calories' => 280,
                        ],
                    ]
                ],
                [
                    'id' => 2,
                    'name' => 'Main Courses',
                    'description' => 'Exquisite main dishes crafted with the finest ingredients',
                    'image' => '/images/menu/main-courses.jpg',
                    'items' => [
                        [
                            'id' => 201,
                            'name' => 'Wagyu Beef Tenderloin',
                            'description' => 'Grade A5 Japanese Wagyu with truffle jus and seasonal vegetables',
                            'price' => 65.00,
                            'image' => '/images/menu/wagyu-tenderloin.jpg',
                            'isPopular' => true,
                            'allergens' => [],
                            'calories' => 580,
                        ],
                        [
                            'id' => 202,
                            'name' => 'Wild Mushroom Risotto',
                            'description' => 'Creamy Arborio rice with foraged mushrooms and aged Parmesan',
                            'price' => 28.00,
                            'image' => '/images/menu/mushroom-risotto.jpg',
                            'isVegetarian' => true,
                            'allergens' => ['Dairy'],
                            'calories' => 520,
                        ],
                    ]
                ],
                [
                    'id' => 3,
                    'name' => 'Desserts',
                    'description' => 'Complete your meal with our delectable dessert selection',
                    'image' => '/images/menu/desserts.jpg',
                    'items' => [
                        [
                            'id' => 301,
                            'name' => 'Vanilla Bean Crème Brûlée',
                            'description' => 'Classic custard with Madagascar vanilla and caramelized sugar',
                            'price' => 14.00,
                            'image' => '/images/menu/creme-brulee.jpg',
                            'isPopular' => true,
                            'isVegetarian' => true,
                            'allergens' => ['Dairy', 'Eggs'],
                            'calories' => 380,
                        ],
                        [
                            'id' => 302,
                            'name' => 'Chocolate Soufflé',
                            'description' => 'Warm chocolate soufflé with salted caramel ice cream',
                            'price' => 16.00,
                            'image' => '/images/menu/chocolate-souffle.jpg',
                            'isVegetarian' => true,
                            'allergens' => ['Dairy', 'Eggs', 'Gluten'],
                            'calories' => 450,
                        ],
                    ]
                ],
            ],
            'specialMenus' => [
                [
                    'id' => 1,
                    'name' => 'Chef\'s Tasting Menu',
                    'description' => 'A curated selection of our chef\'s signature dishes',
                    'price' => 120.00,
                    'items' => ['Amuse Bouche', 'Citrus Cured Salmon', 'Lobster Bisque', 'Wagyu Beef Tenderloin', 'Cheese Selection', 'Chocolate Soufflé'],
                    'image' => '/images/menu/tasting-menu.jpg',
                ],
                [
                    'id' => 2,
                    'name' => 'Vegetarian Tasting Menu',
                    'description' => 'A plant-based journey through our seasonal offerings',
                    'price' => 95.00,
                    'items' => ['Vegetable Amuse Bouche', 'Heirloom Tomato Salad', 'Roasted Beet Soup', 'Wild Mushroom Risotto', 'Seasonal Sorbet', 'Vanilla Bean Crème Brûlée'],
                    'image' => '/images/menu/vegetarian-menu.jpg',
                ],
            ],
            'wine_pairings' => true,
            'dietary_options' => ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'],
        ];
    }

    /**
     * Get gallery section data
     */
    private function getGallerySection(): array
    {
        return [
            'title' => 'Our Restaurant Gallery',
            'description' => 'Take a visual tour of our elegant space and exquisite dishes',
            'images' => [
                [
                    'id' => 1,
                    'url' => '/images/gallery/interior-1.jpg',
                    'thumbnail' => '/images/gallery/thumbnails/interior-1.jpg',
                    'caption' => 'Main Dining Area',
                    'category' => 'Interior',
                ],
                [
                    'id' => 2,
                    'url' => '/images/gallery/food-1.jpg',
                    'thumbnail' => '/images/gallery/thumbnails/food-1.jpg',
                    'caption' => 'Wagyu Beef Tenderloin',
                    'category' => 'Food',
                ],
                [
                    'id' => 3,
                    'url' => '/images/gallery/interior-2.jpg',
                    'thumbnail' => '/images/gallery/thumbnails/interior-2.jpg',
                    'caption' => 'Private Dining Room',
                    'category' => 'Interior',
                ],
                [
                    'id' => 4,
                    'url' => '/images/gallery/food-2.jpg',
                    'thumbnail' => '/images/gallery/thumbnails/food-2.jpg',
                    'caption' => 'Truffle Arancini',
                    'category' => 'Food',
                ],
                [
                    'id' => 5,
                    'url' => '/images/gallery/bar-1.jpg',
                    'thumbnail' => '/images/gallery/thumbnails/bar-1.jpg',
                    'caption' => 'Craft Cocktail Bar',
                    'category' => 'Bar',
                ],
                [
                    'id' => 6,
                    'url' => '/images/gallery/food-3.jpg',
                    'thumbnail' => '/images/gallery/thumbnails/food-3.jpg',
                    'caption' => 'Chocolate Soufflé',
                    'category' => 'Desserts',
                ],
            ],
            'categories' => ['All', 'Interior', 'Food', 'Bar', 'Desserts', 'Events'],
            'videos' => [
                [
                    'id' => 1,
                    'url' => 'https://www.youtube.com/embed/example1',
                    'thumbnail' => '/images/gallery/video-thumbnail-1.jpg',
                    'title' => 'Behind the Scenes: Kitchen Tour',
                ],
                [
                    'id' => 2,
                    'url' => 'https://www.youtube.com/embed/example2',
                    'thumbnail' => '/images/gallery/video-thumbnail-2.jpg',
                    'title' => 'Chef\'s Special Preparation',
                ],
            ],
        ];
    }

    /**
     * Get reviews section data
     */
    private function getReviewsSection(): array
    {
        return [
            'summary' => [
                'average_rating' => 4.8,
                'total_reviews' => 328,
                'rating_breakdown' => [
                    5 => 75, // percentage
                    4 => 20,
                    3 => 3,
                    2 => 1,
                    1 => 1,
                ],
                'category_ratings' => [
                    'food' => 4.9,
                    'service' => 4.7,
                    'ambience' => 4.8,
                    'value' => 4.5,
                ],
            ],
            'reviews' => [
                [
                    'id' => 1,
                    'user' => [
                        'name' => 'Emily Johnson',
                        'avatar' => '/images/avatars/emily.jpg',
                        'reviews_count' => 42,
                        'is_verified' => true,
                    ],
                    'rating' => 5,
                    'title' => 'An extraordinary dining experience',
                    'comment' => 'Everything about this restaurant exceeded my expectations. The food was exquisite, service impeccable, and the atmosphere perfect for our anniversary dinner. The wagyu beef tenderloin was cooked to perfection, and the wine pairing recommended by the sommelier complemented our meal beautifully.',
                    'date' => '2023-06-15',
                    'images' => ['/images/reviews/emily-review-1.jpg', '/images/reviews/emily-review-2.jpg'],
                    'likes' => 28,
                    'category_ratings' => [
                        'food' => 5,
                        'service' => 5,
                        'ambience' => 5,
                        'value' => 4,
                    ],
                    'visit_type' => 'Special Occasion',
                ],
                [
                    'id' => 2,
                    'user' => [
                        'name' => 'Michael Chen',
                        'avatar' => '/images/avatars/michael.jpg',
                        'reviews_count' => 17,
                        'is_verified' => true,
                    ],
                    'rating' => 4,
                    'title' => 'Excellent food, slightly noisy',
                    'comment' => 'The culinary experience was outstanding. Chef Reynolds attention to detail is evident in every dish. The truffle arancini were the highlight of our meal. My only criticism would be that the main dining area became quite noisy as the evening progressed, making conversation challenging at times.',
                    'date' => '2023-05-22',
                    'images' => [],
                    'likes' => 12,
                    'category_ratings' => [
                        'food' => 5,
                        'service' => 4,
                        'ambience' => 3,
                        'value' => 4,
                    ],
                    'visit_type' => 'Business Dinner',
                ],
                [
                    'id' => 3,
                    'user' => [
                        'name' => 'Sophia Rodriguez',
                        'avatar' => '/images/avatars/sophia.jpg',
                        'reviews_count' => 31,
                        'is_verified' => true,
                    ],
                    'rating' => 5,
                    'title' => 'Perfect vegetarian options',
                    'comment' => 'As a vegetarian, I often struggle at fine dining establishments, but Gourmet Haven exceeded all expectations. The vegetarian tasting menu was thoughtfully crafted and every bit as luxurious as the regular menu. The wild mushroom risotto was incredibly flavorful and the staff was knowledgeable about all ingredients.',
                    'date' => '2023-04-18',
                    'images' => ['/images/reviews/sophia-review-1.jpg'],
                    'likes' => 35,
                    'category_ratings' => [
                        'food' => 5,
                        'service' => 5,
                        'ambience' => 5,
                        'value' => 5,
                    ],
                    'visit_type' => 'Casual Dining',
                ],
            ],
        ];
    }

    /**
     * Get about section data
     */
    private function getAboutSection(): array
    {
        return [
            'title' => 'About Gourmet Haven',
            'mission' => 'To create memorable dining experiences that celebrate the finest local ingredients through innovative culinary techniques.',
            'history' => 'Founded in 2015 by Chef Michael Reynolds, Gourmet Haven quickly established itself as a culinary destination. The restaurant earned its first Michelin star within 18 months of opening and has since been recognized with numerous awards for its commitment to excellence and sustainability.',
            'philosophy' => 'We believe in honoring each ingredient, supporting local producers, and creating dishes that surprise and delight our guests. Sustainability is at the core of our operation, from our kitchen practices to our carefully selected suppliers.',
            'milestones' => [
                ['year' => 2015, 'event' => 'Restaurant opening'],
                ['year' => 2016, 'event' => 'First Michelin star awarded'],
                ['year' => 2018, 'event' => 'Expansion with private dining room'],
                ['year' => 2020, 'event' => 'Launch of sustainable farming partnership'],
                ['year' => 2022, 'event' => 'James Beard Award for Outstanding Restaurant'],
            ],
            'images' => [
                '/images/about/chef-portrait.jpg',
                '/images/about/restaurant-exterior.jpg',
                '/images/about/kitchen-team.jpg',
            ],
        ];
    }

    /**
     * Get location section data
     */
    private function getLocationSection(): array
    {
        return [
            'address' => [
                'street' => '123 Culinary Avenue',
                'city' => 'San Francisco',
                'state' => 'CA',
                'zip' => '94105',
                'country' => 'United States',
                'formatted' => '123 Culinary Avenue, San Francisco, CA 94105',
            ],
            'coordinates' => [
                'latitude' => 37.7749,
                'longitude' => -122.4194,
            ],
            'hours' => [
                'monday' => ['17:00', '23:00'],
                'tuesday' => ['17:00', '23:00'],
                'wednesday' => ['17:00', '23:00'],
                'thursday' => ['17:00', '23:00'],
                'friday' => ['17:00', '00:00'],
                'saturday' => ['16:00', '00:00'],
                'sunday' => ['16:00', '22:00'],
            ],
            'parking' => [
                'valet' => true,
                'street' => true,
                'garage' => [
                    'name' => 'Downtown Parking Garage',
                    'distance' => '0.2 miles',
                    'address' => '150 Pine Street',
                ],
            ],
            'public_transport' => [
                [
                    'type' => 'Subway',
                    'line' => 'Red Line',
                    'station' => 'Montgomery Street Station',
                    'distance' => '0.4 miles',
                ],
                [
                    'type' => 'Bus',
                    'line' => '38 Geary',
                    'stop' => 'Market & 3rd',
                    'distance' => '0.3 miles',
                ],
            ],
            'nearby_landmarks' => [
                'Union Square' => '0.7 miles',
                'Ferry Building' => '1.2 miles',
                'Museum of Modern Art' => '0.5 miles',
            ],
        ];
    }

    /**
     * Get booking information
     */
    private function getBookingInfo(): array
    {
        return [
            'minimum_party_size' => 1,
            'maximum_party_size' => 12,
            'reservation_required' => true,
            'reservation_window' => [
                'advance_days' => 60,
                'latest' => 'Same day (subject to availability)',
            ],
            'private_events' => [
                'available' => true,
                'min_guests' => 10,
                'max_guests' => 40,
                'contact_email' => 'events@gourmethaven.com',
                'spaces' => [
                    [
                        'name' => 'Wine Cellar',
                        'capacity' => 12,
                        'minimum_spend' => 1500,
                        'image' => '/images/spaces/wine-cellar.jpg',
                    ],
                    [
                        'name' => 'Garden Room',
                        'capacity' => 25,
                        'minimum_spend' => 2500,
                        'image' => '/images/spaces/garden-room.jpg',
                    ],
                    [
                        'name' => 'Full Restaurant Buyout',
                        'capacity' => 80,
                        'minimum_spend' => 10000,
                        'image' => '/images/spaces/full-restaurant.jpg',
                    ],
                ],
            ],
            'deposit_required' => true,
            'cancellation_policy' => '48 hours notice required for full refund. Cancellations within 48 hours are subject to a 50% charge.',
            'special_requests' => [
                'dietary_restrictions' => true,
                'special_occasions' => true,
                'wine_pre_selection' => true,
            ],
        ];
    }

    /**
     * Get restaurant schedule data
     */
    private function getScheduleData(): array
    {
        return [
            'regular_hours' => [
                'monday' => ['17:00', '23:00'],
                'tuesday' => ['17:00', '23:00'],
                'wednesday' => ['17:00', '23:00'],
                'thursday' => ['17:00', '23:00'],
                'friday' => ['17:00', '00:00'],
                'saturday' => ['16:00', '00:00'],
                'sunday' => ['16:00', '22:00'],
            ],
            'bar_hours' => [
                'monday' => ['16:00', '00:00'],
                'tuesday' => ['16:00', '00:00'],
                'wednesday' => ['16:00', '00:00'],
                'thursday' => ['16:00', '00:00'],
                'friday' => ['16:00', '01:00'],
                'saturday' => ['15:00', '01:00'],
                'sunday' => ['15:00', '23:00'],
            ],
            'happy_hour' => [
                'monday' => ['16:00', '18:00'],
                'tuesday' => ['16:00', '18:00'],
                'wednesday' => ['16:00', '18:00'],
                'thursday' => ['16:00', '18:00'],
                'friday' => ['16:00', '18:00'],
                'saturday' => null,
                'sunday' => null,
            ],
            'special_events' => [
                [
                    'name' => 'Wine Tasting Tuesdays',
                    'description' => 'Join our sommelier for a curated wine tasting experience',
                    'day' => 'tuesday',
                    'time' => '18:00',
                    'price' => 45,
                    'reservation_required' => true,
                ],
                [
                    'name' => 'Chef\'s Table Experience',
                    'description' => 'Exclusive dining at our chef\'s table with special menu',
                    'day' => 'thursday',
                    'time' => '19:00',
                    'price' => 150,
                    'reservation_required' => true,
                ],
                [
                    'name' => 'Jazz Night',
                    'description' => 'Live jazz music while you dine',
                    'day' => 'friday',
                    'time' => '20:00',
                    'price' => null,
                    'reservation_required' => false,
                ],
            ],
            'holiday_schedule' => [
                [
                    'date' => '2023-12-24',
                    'hours' => ['16:00', '22:00'],
                    'special_menu' => 'Christmas Eve Prix Fixe',
                ],
                [
                    'date' => '2023-12-25',
                    'hours' => ['closed'],
                    'special_menu' => null,
                ],
                [
                    'date' => '2023-12-31',
                    'hours' => ['17:00', '01:00'],
                    'special_menu' => 'New Year\'s Eve Celebration',
                ],
            ],
        ];
    }

    /**
     * Get chefs data
     */
    private function getChefsData(): array
    {
        return [
            [
                'name' => 'Michael Reynolds',
                'position' => 'Executive Chef & Owner',
                'image' => '/images/chefs/michael-reynolds.jpg',
                'bio' => 'With over 20 years of culinary experience, Chef Michael Reynolds brings his passion for seasonal ingredients and global techniques to every dish at Gourmet Haven. After training in France and working at Michelin-starred restaurants across Europe, he returned to the United States to open his dream restaurant.',
                'awards' => ['James Beard Award', 'Food & Wine Best New Chef'],
                'signature_dish' => 'Wagyu Beef Tenderloin',
            ],
            [
                'name' => 'Isabelle Park',
                'position' => 'Chef de Cuisine',
                'image' => '/images/chefs/isabelle-park.jpg',
                'bio' => 'Chef Isabelle brings a wealth of experience from her time at renowned restaurants in Seoul, Tokyo, and New York. Her expertise in balancing flavors and textures elevates every dish on the menu.',
                'awards' => ['Rising Star Chef Award'],
                'signature_dish' => 'Citrus Cured Salmon',
            ],
            [
                'name' => 'Daniel Moreno',
                'position' => 'Pastry Chef',
                'image' => '/images/chefs/daniel-moreno.jpg',
                'bio' => 'After training at the Culinary Institute of America, Chef Daniel refined his skills in Paris before joining Gourmet Haven. His innovative approach to desserts combines classic techniques with unexpected flavors.',
                'awards' => ['Best Pastry Chef 2021'],
                'signature_dish' => 'Chocolate Soufflé',
            ],
        ];
    }

    /**
     * Get special offers data
     */
    private function getOffersData(): array
    {
        return [
            [
                'id' => 1,
                'title' => 'Weekday Lunch Special',
                'description' => 'Enjoy a two-course lunch with a glass of wine for $45',
                'code' => 'LUNCH45',
                'discount_type' => 'fixed_price',
                'discount_value' => 45,
                'minimum_order' => null,
                'valid_from' => '2023-05-01',
                'valid_until' => '2023-12-31',
                'image' => '/images/offers/lunch-special.jpg',
                'terms' => 'Available Monday-Thursday, 12:00-14:30. Not valid with other offers.',
                'is_featured' => true,
            ],
            [
                'id' => 2,
                'title' => 'Anniversary Special',
                'description' => 'Complimentary champagne toast for couples celebrating their anniversary',
                'code' => 'CELEBRATE',
                'discount_type' => 'freebie',
                'discount_value' => null,
                'minimum_order' => null,
                'valid_from' => '2023-01-01',
                'valid_until' => '2023-12-31',
                'image' => '/images/offers/anniversary.jpg',
                'terms' => 'Must mention when booking. Proof of anniversary may be requested.',
                'is_featured' => false,
            ],
            [
                'id' => 3,
                'title' => 'Summer Tasting Menu',
                'description' => '15% off our seven-course summer tasting menu',
                'code' => 'SUMMER23',
                'discount_type' => 'percentage',
                'discount_value' => 15,
                'minimum_order' => null,
                'valid_from' => '2023-06-01',
                'valid_until' => '2023-08-31',
                'image' => '/images/offers/summer-menu.jpg',
                'terms' => 'Valid any day of the week. Reservation required.',
                'is_featured' => true,
            ],
        ];
    }

    /**
     * Get FAQs data
     */
    private function getFaqsData(): array
    {
        return [
            [
                'question' => 'Do you accommodate dietary restrictions?',
                'answer' => 'Yes, we accommodate a wide range of dietary needs including vegetarian, vegan, gluten-free, and food allergies. Please inform us of any dietary restrictions when making your reservation, and our chefs will be happy to prepare suitable alternatives.',
            ],
            [
                'question' => 'Is there a dress code?',
                'answer' => 'We suggest smart casual attire. While we don\'t strictly enforce a dress code, we recommend collared shirts for gentlemen. Athletic wear, flip-flops, and shorts are not recommended for evening dining.',
            ],
            [
                'question' => 'Do you offer gift cards?',
                'answer' => 'Yes, we offer gift cards in any denomination. They can be purchased in-person at the restaurant or online through our website.',
            ],
            [
                'question' => 'Can I make special arrangements for a celebration?',
                'answer' => 'Absolutely! Please mention any special occasions when making your reservation. We offer custom cakes, floral arrangements, and other special touches with advance notice.',
            ],
            [
                'question' => 'Is the restaurant wheelchair accessible?',
                'answer' => 'Yes, our restaurant is fully wheelchair accessible. We have a ramp at the entrance and accessible restrooms. If you require any additional accommodations, please let us know when making your reservation.',
            ],
        ];
    }

    /**
     * Get similar restaurants data
     */
    private function getSimilarRestaurants(): array
    {
        return [
            [
                'id' => 2,
                'name' => 'Azure Bistro',
                'slug' => 'azure-bistro',
                'image' => '/images/restaurants/azure-bistro.jpg',
                'cuisineTypes' => ['Mediterranean', 'French'],
                'priceRange' => '$$$',
                'rating' => 4.6,
                'reviewsCount' => 215,
                'distance' => 1.8,
                'estimatedDeliveryTime' => '35-45',
                'isOpen' => true,
            ],
            [
                'id' => 3,
                'name' => 'Sakura Japanese',
                'slug' => 'sakura-japanese',
                'image' => '/images/restaurants/sakura.jpg',
                'cuisineTypes' => ['Japanese', 'Sushi'],
                'priceRange' => '$$',
                'rating' => 4.7,
                'reviewsCount' => 342,
                'distance' => 2.2,
                'estimatedDeliveryTime' => '30-40',
                'isOpen' => true,
            ],
            [
                'id' => 4,
                'name' => 'Trattoria Milano',
                'slug' => 'trattoria-milano',
                'image' => '/images/restaurants/trattoria.jpg',
                'cuisineTypes' => ['Italian', 'Mediterranean'],
                'priceRange' => '$$',
                'rating' => 4.5,
                'reviewsCount' => 278,
                'distance' => 1.5,
                'estimatedDeliveryTime' => '25-40',
                'isOpen' => true,
            ],
            [
                'id' => 5,
                'name' => 'Spice Route',
                'slug' => 'spice-route',
                'image' => '/images/restaurants/spice-route.jpg',
                'cuisineTypes' => ['Indian', 'Contemporary'],
                'priceRange' => '$$',
                'rating' => 4.4,
                'reviewsCount' => 189,
                'distance' => 2.7,
                'estimatedDeliveryTime' => '40-50',
                'isOpen' => false,
            ],
        ];
    }

    /**
     * Get restaurant insight data
     */
    private function getInsightData(): array
    {
        return [
            'mostOrderedDishes' => [
                'Wagyu Beef Tenderloin',
                'Truffle Arancini',
                'Chocolate Soufflé',
            ],
            'peakHours' => [
                'friday' => '19:00-21:00',
                'saturday' => '19:00-21:30',
                'overall' => '19:00-21:00',
            ],
            'customerFavorites' => [
                'dishes' => ['Wagyu Beef Tenderloin', 'Wild Mushroom Risotto'],
                'wines' => ['Pinot Noir, Willamette Valley', 'Chardonnay, Sonoma Coast'],
                'desserts' => ['Chocolate Soufflé', 'Vanilla Bean Crème Brûlée'],
            ],
            'sustainability' => [
                'local_sourcing' => 85, // percentage
                'organic_ingredients' => 78,
                'waste_reduction' => 90,
                'partnerships' => [
                    'Local Farmers Collective',
                    'Sustainable Seafood Initiative',
                    'Food Waste Reduction Program',
                ],
            ],
        ];
    }
} 