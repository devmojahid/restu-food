<?php

declare(strict_types=1);

namespace Modules\Frontend\Services;  

use App\Services\BaseService;
use Illuminate\Support\Facades\Cache;

final class ElectronicsService extends BaseService
{
    /**
     * Get all data needed for electronics page
     */
    public function getElectronicsPageData(): array
    {
        // Cache the data for 1 hour in production
        $cacheTtl = app()->environment('production') ? 3600 : 5;

        // In production, implement caching
        // return Cache::remember('electronics_page_data', $cacheTtl, function () {
            return [
                'hero' => $this->getHeroSection(),
                'featuredProducts' => $this->getFeaturedProducts(),
                'popularCategories' => $this->getPopularCategories(),
                'newArrivals' => $this->getNewArrivals(),
                'dealOfTheDay' => $this->getDealOfTheDay(),
                'trendingProducts' => $this->getTrendingProducts(),
                'brands' => $this->getBrands(),
                'testimonials' => $this->getTestimonials(),
                'stats' => $this->getStats(),
                'newsletterSection' => $this->getNewsletterSection(),
                'promoSections' => $this->getPromoSections(),
            ];
        // });
    }
    
    /**
     * Get hero section data
     */
    private function getHeroSection(): array
    {
        return [
            'slides' => [
                [
                    'id' => 1,
                    'title' => 'Next-Gen Electronics',
                    'subtitle' => 'Upgrade Your Tech',
                    'description' => 'Discover cutting-edge gadgets and smart devices that will transform your digital experience.',
                    'image' => '/images/electronics/hero1.jpg',
                    'cta' => [
                        'primary' => [
                            'text' => 'Shop Now',
                            'link' => '/electronics/products'
                        ],
                        'secondary' => [
                            'text' => 'View Deals',
                            'link' => '/electronics/deals'
                        ]
                    ],
                    'badge' => 'New Collection'
                ],
                [
                    'id' => 2,
                    'title' => 'Smart Home Devices',
                    'subtitle' => 'Transform Your Living Space',
                    'description' => 'Control your home with voice commands, automate routines, and enjoy ultimate convenience.',
                    'image' => '/images/electronics/hero2.jpg',
                    'cta' => [
                        'primary' => [
                            'text' => 'Explore Smart Home',
                            'link' => '/electronics/smart-home'
                        ],
                        'secondary' => [
                            'text' => 'View Deals',
                            'link' => '/electronics/deals'
                        ]
                    ],
                    'badge' => 'Popular'
                ],
                [
                    'id' => 3,
                    'title' => 'Premium Headphones',
                    'subtitle' => 'Immersive Audio Experience',
                    'description' => 'Dive into crystal-clear sound with noise cancellation and premium comfort.',
                    'image' => '/images/electronics/hero3.jpg',
                    'cta' => [
                        'primary' => [
                            'text' => 'Shop Headphones',
                            'link' => '/electronics/headphones'
                        ],
                        'secondary' => [
                            'text' => 'View Deals',
                            'link' => '/electronics/deals'
                        ]
                    ],
                    'badge' => 'Top Rated'
                ]
            ],
            'type' => 'slider'
        ];
    }
    
    /**
     * Get featured products for showcase
     */
    private function getFeaturedProducts(): array
    {
        return [
            'title' => 'Featured Products',
            'subtitle' => 'Discover our carefully selected premium electronics',
            'viewAllLink' => '/electronics/featured',
            'layout' => 'grid',
            'products' => [
                [
                    'id' => 1,
                    'name' => 'Sony WH-1000XM5',
                    'slug' => 'sony-wh-1000xm5',
                    'category' => 'Headphones',
                    'price' => 399.99,
                    'sale_price' => 349.99,
                    'image' => '/images/electronics/products/headphones1.jpg',
                    'rating' => 4.9,
                    'reviews_count' => 1245,
                    'in_stock' => true,
                    'description' => 'Industry-leading noise cancellation with exceptional sound quality',
                    'badges' => ['Featured', 'Best Seller'],
                    'is_new' => true,
                    'discount_percentage' => 13
                ],
                [
                    'id' => 2,
                    'name' => 'MacBook Pro M2',
                    'slug' => 'macbook-pro-m2',
                    'category' => 'Laptops',
                    'price' => 1999.99,
                    'sale_price' => 1899.99,
                    'image' => '/images/electronics/products/laptop1.jpg',
                    'rating' => 4.8,
                    'reviews_count' => 938,
                    'in_stock' => true,
                    'description' => 'Powerful performance with all-day battery life',
                    'badges' => ['Featured', 'Premium'],
                    'is_new' => true,
                    'discount_percentage' => 5
                ],
                [
                    'id' => 3,
                    'name' => 'Samsung Galaxy S23 Ultra',
                    'slug' => 'samsung-galaxy-s23-ultra',
                    'category' => 'Smartphones',
                    'price' => 1199.99,
                    'sale_price' => 1099.99,
                    'image' => '/images/electronics/products/smartphone1.jpg',
                    'rating' => 4.7,
                    'reviews_count' => 1532,
                    'in_stock' => true,
                    'description' => 'Revolutionary camera system with 200MP main sensor',
                    'badges' => ['Featured', 'Top Rated'],
                    'is_new' => false,
                    'discount_percentage' => 8
                ],
                [
                    'id' => 4,
                    'name' => 'Amazon Echo Dot (5th Gen)',
                    'slug' => 'amazon-echo-dot-5th-gen',
                    'category' => 'Smart Home',
                    'price' => 49.99,
                    'sale_price' => 39.99,
                    'image' => '/images/electronics/products/smarthome1.jpg',
                    'rating' => 4.6,
                    'reviews_count' => 3245,
                    'in_stock' => true,
                    'description' => 'Compact smart speaker with improved sound and Alexa',
                    'badges' => ['Featured', 'Value'],
                    'is_new' => false,
                    'discount_percentage' => 20
                ],
                [
                    'id' => 5,
                    'name' => 'LG C2 OLED 65" TV',
                    'slug' => 'lg-c2-oled-65-tv',
                    'category' => 'TVs',
                    'price' => 2499.99,
                    'sale_price' => 1999.99,
                    'image' => '/images/electronics/products/tv1.jpg',
                    'rating' => 4.9,
                    'reviews_count' => 742,
                    'in_stock' => true,
                    'description' => 'Stunning OLED display with perfect blacks',
                    'badges' => ['Featured', 'Premium'],
                    'is_new' => false,
                    'discount_percentage' => 20
                ],
                [
                    'id' => 6,
                    'name' => 'iPad Pro M2',
                    'slug' => 'ipad-pro-m2',
                    'category' => 'Tablets',
                    'price' => 1099.99,
                    'sale_price' => 999.99,
                    'image' => '/images/electronics/products/tablet1.jpg',
                    'rating' => 4.8,
                    'reviews_count' => 623,
                    'in_stock' => true,
                    'description' => 'Powerful tablet with stunning display',
                    'badges' => ['Featured', 'Premium'],
                    'is_new' => true,
                    'discount_percentage' => 9
                ],
                [
                    'id' => 7,
                    'name' => 'Sonos Arc Soundbar',
                    'slug' => 'sonos-arc-soundbar',
                    'category' => 'Audio',
                    'price' => 899.99,
                    'sale_price' => 799.99,
                    'image' => '/images/electronics/products/audio1.jpg',
                    'rating' => 4.7,
                    'reviews_count' => 418,
                    'in_stock' => true,
                    'description' => 'Premium soundbar with Dolby Atmos',
                    'badges' => ['Featured', 'Premium'],
                    'is_new' => false,
                    'discount_percentage' => 11
                ],
                [
                    'id' => 8,
                    'name' => 'Nintendo Switch OLED',
                    'slug' => 'nintendo-switch-oled',
                    'category' => 'Gaming',
                    'price' => 349.99,
                    'sale_price' => 329.99,
                    'image' => '/images/electronics/products/gaming1.jpg',
                    'rating' => 4.8,
                    'reviews_count' => 2175,
                    'in_stock' => true,
                    'description' => 'Enhanced gaming experience with vibrant OLED display',
                    'badges' => ['Featured', 'Popular'],
                    'is_new' => false,
                    'discount_percentage' => 6
                ]
            ]
        ];
    }
    
    /**
     * Get popular categories
     */
    private function getPopularCategories(): array
    {
        return [
            'title' => 'Shop by Category',
            'subtitle' => 'Browse our top categories',
            'viewAllLink' => '/electronics/categories',
            'categories' => [
                [
                    'id' => 1,
                    'name' => 'Smartphones',
                    'slug' => 'smartphones',
                    'image' => '/images/electronics/categories/smartphones.jpg',
                    'icon' => 'Smartphone',
                    'description' => 'Latest smartphones from top brands',
                    'product_count' => 287,
                    'featured' => true,
                    'trending' => true
                ],
                [
                    'id' => 2,
                    'name' => 'Laptops',
                    'slug' => 'laptops',
                    'image' => '/images/electronics/categories/laptops.jpg',
                    'icon' => 'Laptop',
                    'description' => 'Powerful laptops for work and play',
                    'product_count' => 154,
                    'featured' => true,
                    'trending' => false
                ],
                [
                    'id' => 3,
                    'name' => 'Smart Home',
                    'slug' => 'smart-home',
                    'image' => '/images/electronics/categories/smarthome.jpg',
                    'icon' => 'Home',
                    'description' => 'Make your home smarter',
                    'product_count' => 98,
                    'featured' => true,
                    'trending' => true
                ],
                [
                    'id' => 4,
                    'name' => 'Audio',
                    'slug' => 'audio',
                    'image' => '/images/electronics/categories/audio.jpg',
                    'icon' => 'Headphones',
                    'description' => 'Immersive sound experience',
                    'product_count' => 215,
                    'featured' => true,
                    'trending' => false
                ],
                [
                    'id' => 5,
                    'name' => 'Cameras',
                    'slug' => 'cameras',
                    'image' => '/images/electronics/categories/cameras.jpg',
                    'icon' => 'Camera',
                    'description' => 'Capture moments perfectly',
                    'product_count' => 67,
                    'featured' => true,
                    'trending' => false
                ],
                [
                    'id' => 6,
                    'name' => 'TVs',
                    'slug' => 'tvs',
                    'image' => '/images/electronics/categories/tvs.jpg',
                    'icon' => 'Tv',
                    'description' => 'Stunning visual experiences',
                    'product_count' => 89,
                    'featured' => true,
                    'trending' => false
                ],
                [
                    'id' => 7,
                    'name' => 'Wearables',
                    'slug' => 'wearables',
                    'image' => '/images/electronics/categories/wearables.jpg',
                    'icon' => 'Watch',
                    'description' => 'Stay connected on the go',
                    'product_count' => 124,
                    'featured' => true,
                    'trending' => true
                ],
                [
                    'id' => 8,
                    'name' => 'Gaming',
                    'slug' => 'gaming',
                    'image' => '/images/electronics/categories/gaming.jpg',
                    'icon' => 'Gamepad2',
                    'description' => 'Level up your gaming experience',
                    'product_count' => 176,
                    'featured' => true,
                    'trending' => true
                ]
            ]
        ];
    }
    
    /**
     * Get new arrivals products
     */
    private function getNewArrivals(): array
    {
        return [
            'title' => 'New Arrivals',
            'subtitle' => 'Check out our latest products',
            'viewAllLink' => '/electronics/new-arrivals',
            'layout' => 'slider',
            'products' => [
                [
                    'id' => 9,
                    'name' => 'iPhone 15 Pro',
                    'slug' => 'iphone-15-pro',
                    'category' => 'Smartphones',
                    'price' => 999.99,
                    'image' => '/images/electronics/products/iphone15.jpg',
                    'rating' => 4.9,
                    'reviews_count' => 76,
                    'in_stock' => true,
                    'description' => 'The most advanced iPhone yet',
                    'badges' => ['New', 'Premium'],
                    'is_new' => true,
                ],
                [
                    'id' => 10,
                    'name' => 'Samsung Frame TV 2023',
                    'slug' => 'samsung-frame-tv-2023',
                    'category' => 'TVs',
                    'price' => 1499.99,
                    'image' => '/images/electronics/products/frametv.jpg',
                    'rating' => 4.7,
                    'reviews_count' => 42,
                    'in_stock' => true,
                    'description' => 'TV that transforms into art',
                    'badges' => ['New', 'Design'],
                    'is_new' => true,
                ],
                [
                    'id' => 11,
                    'name' => 'Bose QuietComfort Ultra',
                    'slug' => 'bose-quietcomfort-ultra',
                    'category' => 'Headphones',
                    'price' => 429.99,
                    'image' => '/images/electronics/products/bose.jpg',
                    'rating' => 4.8,
                    'reviews_count' => 38,
                    'in_stock' => true,
                    'description' => 'Next-generation noise cancellation',
                    'badges' => ['New', 'Premium'],
                    'is_new' => true,
                ],
                [
                    'id' => 12,
                    'name' => 'DJI Mini 4 Pro',
                    'slug' => 'dji-mini-4-pro',
                    'category' => 'Drones',
                    'price' => 759.99,
                    'image' => '/images/electronics/products/drone.jpg',
                    'rating' => 4.9,
                    'reviews_count' => 29,
                    'in_stock' => true,
                    'description' => 'Compact drone with professional features',
                    'badges' => ['New', 'Premium'],
                    'is_new' => true,
                ],
                [
                    'id' => 13,
                    'name' => 'Google Pixel 8 Pro',
                    'slug' => 'google-pixel-8-pro',
                    'category' => 'Smartphones',
                    'price' => 899.99,
                    'image' => '/images/electronics/products/pixel.jpg',
                    'rating' => 4.8,
                    'reviews_count' => 54,
                    'in_stock' => true,
                    'description' => 'Computational photography powerhouse',
                    'badges' => ['New', 'Camera'],
                    'is_new' => true,
                ],
                [
                    'id' => 14,
                    'name' => 'Apple Watch Series 9',
                    'slug' => 'apple-watch-series-9',
                    'category' => 'Wearables',
                    'price' => 399.99,
                    'image' => '/images/electronics/products/applewatch.jpg',
                    'rating' => 4.9,
                    'reviews_count' => 87,
                    'in_stock' => true,
                    'description' => 'Advanced health features and bright display',
                    'badges' => ['New', 'Health'],
                    'is_new' => true,
                ]
            ]
        ];
    }
    
    /**
     * Get deal of the day product
     */
    private function getDealOfTheDay(): array
    {
        return [
            'title' => 'Deal of the Day',
            'subtitle' => 'Limited time offer - save big!',
            'product' => [
                'id' => 15,
                'name' => 'Samsung 65" QN90B Neo QLED TV',
                'slug' => 'samsung-65-qn90b-neo-qled-tv',
                'category' => 'TVs',
                'price' => 2199.99,
                'sale_price' => 1499.99,
                'image' => '/images/electronics/products/samsung-tv.jpg',
                'gallery' => [
                    '/images/electronics/products/samsung-tv-1.jpg',
                    '/images/electronics/products/samsung-tv-2.jpg',
                    '/images/electronics/products/samsung-tv-3.jpg'
                ],
                'rating' => 4.9,
                'reviews_count' => 347,
                'in_stock' => true,
                'description' => 'Experience brilliant colors and exceptional contrast with Samsung\'s Neo QLED technology.',
                'highlights' => [
                    '4K UHD resolution',
                    'Neo Quantum Processor with AI',
                    'Anti-glare screen',
                    'Object Tracking Sound',
                    'Gaming Hub & Motion Xcelerator Turbo+'
                ],
                'discount_percentage' => 32,
                'countdown' => '2023-12-31T23:59:59',
                'stock_quantity' => 21,
                'sold_count' => 79
            ]
        ];
    }
    
    /**
     * Get trending products
     */
    private function getTrendingProducts(): array
    {
        return [
            'title' => 'Trending Right Now',
            'subtitle' => 'See what customers are loving',
            'viewAllLink' => '/electronics/trending',
            'layout' => 'grid',
            'products' => [
                [
                    'id' => 16,
                    'name' => 'Apple AirPods Pro 2',
                    'slug' => 'apple-airpods-pro-2',
                    'category' => 'Audio',
                    'price' => 249.99,
                    'sale_price' => 229.99,
                    'image' => '/images/electronics/products/airpods.jpg',
                    'rating' => 4.8,
                    'reviews_count' => 3456,
                    'in_stock' => true,
                    'description' => 'Immersive sound with active noise cancellation',
                    'badges' => ['Trending', 'Popular'],
                    'is_new' => false,
                    'discount_percentage' => 8
                ],
                [
                    'id' => 17,
                    'name' => 'Sony PlayStation 5',
                    'slug' => 'sony-playstation-5',
                    'category' => 'Gaming',
                    'price' => 499.99,
                    'sale_price' => null,
                    'image' => '/images/electronics/products/ps5.jpg',
                    'rating' => 4.9,
                    'reviews_count' => 5243,
                    'in_stock' => true,
                    'description' => 'Next-generation gaming console',
                    'badges' => ['Trending', 'Popular'],
                    'is_new' => false,
                    'discount_percentage' => 0
                ],
                [
                    'id' => 18,
                    'name' => 'Dyson V15 Detect',
                    'slug' => 'dyson-v15-detect',
                    'category' => 'Home Appliances',
                    'price' => 749.99,
                    'sale_price' => 649.99,
                    'image' => '/images/electronics/products/dyson.jpg',
                    'rating' => 4.7,
                    'reviews_count' => 1876,
                    'in_stock' => true,
                    'description' => 'Advanced vacuum with laser dust detection',
                    'badges' => ['Trending', 'Premium'],
                    'is_new' => false,
                    'discount_percentage' => 13
                ],
                [
                    'id' => 19,
                    'name' => 'GoPro HERO11 Black',
                    'slug' => 'gopro-hero11-black',
                    'category' => 'Cameras',
                    'price' => 499.99,
                    'sale_price' => 449.99,
                    'image' => '/images/electronics/products/gopro.jpg',
                    'rating' => 4.8,
                    'reviews_count' => 932,
                    'in_stock' => true,
                    'description' => 'Waterproof action camera with 5.3K video',
                    'badges' => ['Trending', 'Adventure'],
                    'is_new' => false,
                    'discount_percentage' => 10
                ],
            ]
        ];
    }
    
    /**
     * Get popular brands
     */
    private function getBrands(): array
    {
        return [
            'title' => 'Shop by Brand',
            'subtitle' => 'Discover products from top manufacturers',
            'viewAllLink' => '/electronics/brands',
            'brands' => [
                [
                    'id' => 1,
                    'name' => 'Apple',
                    'slug' => 'apple',
                    'logo' => '/images/electronics/brands/apple.png',
                    'featured' => true
                ],
                [
                    'id' => 2,
                    'name' => 'Samsung',
                    'slug' => 'samsung',
                    'logo' => '/images/electronics/brands/samsung.png',
                    'featured' => true
                ],
                [
                    'id' => 3,
                    'name' => 'Sony',
                    'slug' => 'sony',
                    'logo' => '/images/electronics/brands/sony.png',
                    'featured' => true
                ],
                [
                    'id' => 4,
                    'name' => 'Microsoft',
                    'slug' => 'microsoft',
                    'logo' => '/images/electronics/brands/microsoft.png',
                    'featured' => true
                ],
                [
                    'id' => 5,
                    'name' => 'Google',
                    'slug' => 'google',
                    'logo' => '/images/electronics/brands/google.png',
                    'featured' => true
                ],
                [
                    'id' => 6,
                    'name' => 'LG',
                    'slug' => 'lg',
                    'logo' => '/images/electronics/brands/lg.png',
                    'featured' => true
                ],
                [
                    'id' => 7,
                    'name' => 'Bose',
                    'slug' => 'bose',
                    'logo' => '/images/electronics/brands/bose.png',
                    'featured' => true
                ],
                [
                    'id' => 8,
                    'name' => 'Dell',
                    'slug' => 'dell',
                    'logo' => '/images/electronics/brands/dell.png',
                    'featured' => true
                ]
            ]
        ];
    }
    
    /**
     * Get customer testimonials
     */
    private function getTestimonials(): array
    {
        return [
            'title' => 'What Our Customers Say',
            'subtitle' => 'Real experiences from tech enthusiasts',
            'testimonials' => [
                [
                    'id' => 1,
                    'name' => 'Alex Johnson',
                    'role' => 'Tech Enthusiast',
                    'avatar' => '/images/electronics/testimonials/person1.jpg',
                    'text' => 'The delivery was incredibly fast, and the product exceeded my expectations. The 4K display is absolutely stunning, and the performance is top-notch.',
                    'rating' => 5,
                    'product' => 'LG C2 OLED TV',
                    'date' => '2023-10-15',
                    'verified_purchase' => true,
                    'helpful_count' => 42
                ],
                [
                    'id' => 2,
                    'name' => 'Sarah Miller',
                    'role' => 'Digital Nomad',
                    'avatar' => '/images/electronics/testimonials/person2.jpg',
                    'text' => 'As someone who works remotely, having reliable tech is crucial. The MacBook Pro M2 has been a game-changer for my productivity. Battery life is incredible!',
                    'rating' => 5,
                    'product' => 'MacBook Pro M2',
                    'date' => '2023-09-28',
                    'verified_purchase' => true,
                    'helpful_count' => 36
                ],
                [
                    'id' => 3,
                    'name' => 'David Chen',
                    'role' => 'Audiophile',
                    'avatar' => '/images/electronics/testimonials/person3.jpg',
                    'text' => 'The Sony WH-1000XM5 headphones have the best noise cancellation I\'ve ever experienced. Perfect for my daily commute and flights. Worth every penny!',
                    'rating' => 5,
                    'product' => 'Sony WH-1000XM5',
                    'date' => '2023-10-05',
                    'verified_purchase' => true,
                    'helpful_count' => 29
                ],
                [
                    'id' => 4,
                    'name' => 'Emily Rodriguez',
                    'role' => 'Content Creator',
                    'avatar' => '/images/electronics/testimonials/person4.jpg',
                    'text' => 'I use the Galaxy S23 Ultra for my YouTube content, and the camera quality is mind-blowing. My subscribers have noticed the improvement in video quality right away!',
                    'rating' => 4,
                    'product' => 'Samsung Galaxy S23 Ultra',
                    'date' => '2023-09-12',
                    'verified_purchase' => true,
                    'helpful_count' => 57
                ]
            ]
        ];
    }
    
    /**
     * Get site statistics
     */
    private function getStats(): array
    {
        return [
            [
                'label' => 'Happy Customers',
                'value' => '100K+',
                'icon' => 'Users'
            ],
            [
                'label' => 'Products Available',
                'value' => '10K+',
                'icon' => 'Package'
            ],
            [
                'label' => 'Brands',
                'value' => '500+',
                'icon' => 'Store'
            ],
            [
                'label' => 'Same-Day Delivery',
                'value' => '98%',
                'icon' => 'Truck'
            ]
        ];
    }
    
    /**
     * Get newsletter section data
     */
    private function getNewsletterSection(): array
    {
        return [
            'title' => 'Stay Updated',
            'subtitle' => 'Subscribe to our newsletter for exclusive deals and tech news',
            'description' => 'Be the first to know about new products, special offers, and tech tips.',
            'image' => '/images/electronics/newsletter-bg.jpg',
            'placeholder' => 'Enter your email address',
            'button_text' => 'Subscribe',
            'privacy_text' => 'We respect your privacy. Unsubscribe at any time.',
            'benefits' => [
                'Exclusive deals and discounts',
                'New product announcements',
                'Tech tips and tutorials',
                'Industry news and updates'
            ]
        ];
    }
    
    /**
     * Get promotional sections
     */
    private function getPromoSections(): array
    {
        return [
            [
                'title' => 'Student Discount',
                'subtitle' => 'Save 10% on laptops and tablets',
                'description' => 'Verify your student status and get an instant discount on your next purchase.',
                'image' => '/images/electronics/promo-student.jpg',
                'cta' => [
                    'text' => 'Verify Now',
                    'link' => '/electronics/student-discount'
                ],
                'background_color' => 'bg-blue-50'
            ],
            [
                'title' => 'Trade-In Program',
                'subtitle' => 'Upgrade your devices',
                'description' => 'Trade in your old electronics for credit toward new purchases.',
                'image' => '/images/electronics/promo-tradein.jpg',
                'cta' => [
                    'text' => 'Learn More',
                    'link' => '/electronics/trade-in'
                ],
                'background_color' => 'bg-green-50'
            ],
            [
                'title' => 'Extended Warranty',
                'subtitle' => 'Peace of mind for years to come',
                'description' => 'Protect your investment with our premium care package.',
                'image' => '/images/electronics/promo-warranty.jpg',
                'cta' => [
                    'text' => 'View Plans',
                    'link' => '/electronics/warranty'
                ],
                'background_color' => 'bg-purple-50'
            ]
        ];
    }
} 