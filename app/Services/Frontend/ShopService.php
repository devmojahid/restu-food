<?php

declare(strict_types=1);

namespace App\Services\Frontend;

use App\Services\BaseService;

final class ShopService extends BaseService
{
    public function getShopPageData(array $filters = []): array
    {
        return [
            'hero' => $this->getHeroSection(),
            'featuredProducts' => $this->getFeaturedProducts(),
            'products' => $this->getProducts($filters),
            'categories' => $this->getCategories(),
            'brands' => $this->getBrands(),
            'filters' => $this->getFiltersData(),
            'popularProducts' => $this->getPopularProducts(),
            'newArrivals' => $this->getNewArrivals(),
            'dealOfTheDay' => $this->getDealOfTheDay(),
            'testimonials' => $this->getTestimonials(),
            'banner' => $this->getBannerSection(),
        ];
    }

    public function getProductDetailData(string $slug): array
    {
        return [
            'product' => $this->getProductDetails($slug),
            'relatedProducts' => $this->getRelatedProducts($slug),
            'reviews' => $this->getProductReviews($slug),
            'faqs' => $this->getProductFaqs($slug),
        ];
    }

    private function getHeroSection(): array
    {
        return [
            'title' => 'Premium Food Market',
            'subtitle' => 'Shop Quality Ingredients',
            'description' => 'Discover our carefully selected range of premium food products and ingredients for your culinary adventures.',
            'image' => '/images/shop/hero.jpg',
            'stats' => [
                ['label' => 'Products', 'value' => '1000+'],
                ['label' => 'Brands', 'value' => '50+'],
                ['label' => 'Categories', 'value' => '25+'],
                ['label' => 'Customers', 'value' => '50K+'],
            ]
        ];
    }

    private function getFeaturedProducts(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Premium Olive Oil',
                'slug' => 'premium-olive-oil',
                'price' => 24.99,
                'sale_price' => 19.99,
                'on_sale' => true,
                'discount_percentage' => 20,
                'image' => '/images/shop/products/olive-oil.jpg',
                'rating' => 4.8,
                'reviews_count' => 124,
                'category' => 'Oils & Vinegars',
                'brand' => 'Organic Farms',
                'is_featured' => true,
                'in_stock' => true,
                'stock_quantity' => 50,
                'description' => 'Cold-pressed extra virgin olive oil from Mediterranean olives.',
                'is_new' => false,
                'is_bestseller' => true,
                'tags' => ['organic', 'extra-virgin', 'cooking'],
            ],
            [
                'id' => 2,
                'name' => 'Artisan Pasta Set',
                'slug' => 'artisan-pasta-set',
                'price' => 18.99,
                'sale_price' => null,
                'on_sale' => false,
                'discount_percentage' => 0,
                'image' => '/images/shop/products/pasta.jpg',
                'rating' => 4.6,
                'reviews_count' => 86,
                'category' => 'Pasta & Grains',
                'brand' => 'Italian Delights',
                'is_featured' => true,
                'in_stock' => true,
                'stock_quantity' => 35,
                'description' => 'Set of 4 artisanal Italian pasta varieties, bronze-cut for superior sauce adhesion.',
                'is_new' => true,
                'is_bestseller' => false,
                'tags' => ['italian', 'pasta', 'gourmet'],
            ],
            [
                'id' => 3,
                'name' => 'Truffle Honey',
                'slug' => 'truffle-honey',
                'price' => 29.99,
                'sale_price' => 24.99,
                'on_sale' => true,
                'discount_percentage' => 17,
                'image' => '/images/shop/products/truffle-honey.jpg',
                'rating' => 4.9,
                'reviews_count' => 52,
                'category' => 'Condiments',
                'brand' => 'Luxury Tastes',
                'is_featured' => true,
                'in_stock' => true,
                'stock_quantity' => 15,
                'description' => 'Wild flower honey infused with black truffle essence. Perfect for cheese pairings.',
                'is_new' => false,
                'is_bestseller' => true,
                'tags' => ['truffle', 'honey', 'gourmet'],
            ],
            [
                'id' => 4,
                'name' => 'Smoked Sea Salt',
                'slug' => 'smoked-sea-salt',
                'price' => 14.99,
                'sale_price' => null,
                'on_sale' => false,
                'discount_percentage' => 0,
                'image' => '/images/shop/products/sea-salt.jpg',
                'rating' => 4.7,
                'reviews_count' => 73,
                'category' => 'Spices & Seasonings',
                'brand' => 'Sea Essentials',
                'is_featured' => true,
                'in_stock' => true,
                'stock_quantity' => 42,
                'description' => 'Hand-harvested sea salt, naturally smoked over oak wood. Adds depth to any dish.',
                'is_new' => true,
                'is_bestseller' => false,
                'tags' => ['salt', 'seasoning', 'smoked'],
            ],
        ];
    }

    private function getProducts(array $filters = []): array
    {
        $products = [
            // Additional products beyond featured ones
            [
                'id' => 5,
                'name' => 'Organic Quinoa',
                'slug' => 'organic-quinoa',
                'price' => 12.99,
                'sale_price' => 9.99,
                'on_sale' => true,
                'discount_percentage' => 23,
                'image' => '/images/shop/products/quinoa.jpg',
                'rating' => 4.5,
                'reviews_count' => 64,
                'category' => 'Pasta & Grains',
                'brand' => 'Organic Farms',
                'is_featured' => false,
                'in_stock' => true,
                'stock_quantity' => 100,
                'description' => 'Premium organic white quinoa. High in protein and gluten-free.',
                'is_new' => false,
                'is_bestseller' => true,
                'tags' => ['organic', 'grain', 'gluten-free'],
            ],
            [
                'id' => 6,
                'name' => 'Balsamic Glaze',
                'slug' => 'balsamic-glaze',
                'price' => 16.99,
                'sale_price' => null,
                'on_sale' => false,
                'discount_percentage' => 0,
                'image' => '/images/shop/products/balsamic.jpg',
                'rating' => 4.7,
                'reviews_count' => 41,
                'category' => 'Oils & Vinegars',
                'brand' => 'Italian Delights',
                'is_featured' => false,
                'in_stock' => true,
                'stock_quantity' => 30,
                'description' => 'Aged balsamic vinegar reduced to a sweet glaze. Perfect for salads and desserts.',
                'is_new' => true,
                'is_bestseller' => false,
                'tags' => ['italian', 'vinegar', 'condiment'],
            ],
            // Add at least 8 more products here
        ];

        // Basic filtering based on passed filters
        if (!empty($filters)) {
            if (isset($filters['category']) && $filters['category']) {
                $products = array_filter($products, fn($p) => $p['category'] === $filters['category']);
            }
            
            if (isset($filters['brand']) && $filters['brand']) {
                $products = array_filter($products, fn($p) => $p['brand'] === $filters['brand']);
            }
            
            if (isset($filters['price']) && $filters['price']) {
                // Example implementation for price filtering
                list($min, $max) = explode('-', $filters['price']);
                $products = array_filter($products, fn($p) => 
                    $p['sale_price'] ? $p['sale_price'] >= $min && $p['sale_price'] <= $max :
                    $p['price'] >= $min && $p['price'] <= $max
                );
            }
            
            // Sorting
            if (isset($filters['sort'])) {
                switch ($filters['sort']) {
                    case 'price_low':
                        usort($products, fn($a, $b) => ($a['sale_price'] ?? $a['price']) <=> ($b['sale_price'] ?? $b['price']));
                        break;
                    case 'price_high':
                        usort($products, fn($a, $b) => ($b['sale_price'] ?? $b['price']) <=> ($a['sale_price'] ?? $a['price']));
                        break;
                    case 'newest':
                        usort($products, fn($a, $b) => $b['is_new'] <=> $a['is_new']);
                        break;
                    case 'rating':
                        usort($products, fn($a, $b) => $b['rating'] <=> $a['rating']);
                        break;
                    case 'popular':
                    default:
                        usort($products, fn($a, $b) => $b['reviews_count'] <=> $a['reviews_count']);
                        break;
                }
            }
        }

        return array_values($products); // Re-index array after filtering
    }

    private function getCategories(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Oils & Vinegars',
                'slug' => 'oils-vinegars',
                'count' => 24,
                'image' => '/images/shop/categories/oils.jpg',
                'featured' => true,
            ],
            [
                'id' => 2,
                'name' => 'Pasta & Grains',
                'slug' => 'pasta-grains',
                'count' => 36,
                'image' => '/images/shop/categories/pasta.jpg',
                'featured' => true,
            ],
            [
                'id' => 3,
                'name' => 'Spices & Seasonings',
                'slug' => 'spices-seasonings',
                'count' => 42,
                'image' => '/images/shop/categories/spices.jpg',
                'featured' => true,
            ],
            [
                'id' => 4,
                'name' => 'Condiments',
                'slug' => 'condiments',
                'count' => 28,
                'image' => '/images/shop/categories/condiments.jpg',
                'featured' => true,
            ],
            [
                'id' => 5,
                'name' => 'Baking Essentials',
                'slug' => 'baking-essentials',
                'count' => 31,
                'image' => '/images/shop/categories/baking.jpg',
                'featured' => false,
            ],
            [
                'id' => 6,
                'name' => 'Specialty Foods',
                'slug' => 'specialty-foods',
                'count' => 19,
                'image' => '/images/shop/categories/specialty.jpg',
                'featured' => false,
            ],
        ];
    }

    private function getBrands(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Organic Farms',
                'slug' => 'organic-farms',
                'logo' => '/images/shop/brands/organic-farms.png',
                'count' => 42,
                'featured' => true,
            ],
            [
                'id' => 2,
                'name' => 'Italian Delights',
                'slug' => 'italian-delights',
                'logo' => '/images/shop/brands/italian-delights.png',
                'count' => 36,
                'featured' => true,
            ],
            [
                'id' => 3,
                'name' => 'Luxury Tastes',
                'slug' => 'luxury-tastes',
                'logo' => '/images/shop/brands/luxury-tastes.png',
                'count' => 18,
                'featured' => true,
            ],
            [
                'id' => 4,
                'name' => 'Sea Essentials',
                'slug' => 'sea-essentials',
                'logo' => '/images/shop/brands/sea-essentials.png',
                'count' => 24,
                'featured' => true,
            ],
            [
                'id' => 5,
                'name' => 'Spice World',
                'slug' => 'spice-world',
                'logo' => '/images/shop/brands/spice-world.png',
                'count' => 30,
                'featured' => false,
            ],
        ];
    }

    private function getFiltersData(): array
    {
        return [
            'price_ranges' => [
                ['id' => 1, 'label' => 'Under $10', 'value' => '0-10'],
                ['id' => 2, 'label' => '$10 - $25', 'value' => '10-25'],
                ['id' => 3, 'label' => '$25 - $50', 'value' => '25-50'],
                ['id' => 4, 'label' => 'Over $50', 'value' => '50-1000'],
            ],
            'sort_options' => [
                ['id' => 1, 'label' => 'Most Popular', 'value' => 'popular'],
                ['id' => 2, 'label' => 'Highest Rated', 'value' => 'rating'],
                ['id' => 3, 'label' => 'Newest First', 'value' => 'newest'],
                ['id' => 4, 'label' => 'Price: Low to High', 'value' => 'price_low'],
                ['id' => 5, 'label' => 'Price: High to Low', 'value' => 'price_high'],
            ],
            'dietary' => [
                ['id' => 1, 'label' => 'Organic', 'value' => 'organic'],
                ['id' => 2, 'label' => 'Gluten-Free', 'value' => 'gluten-free'],
                ['id' => 3, 'label' => 'Vegan', 'value' => 'vegan'],
                ['id' => 4, 'label' => 'Non-GMO', 'value' => 'non-gmo'],
            ],
            'ratings' => [
                ['id' => 1, 'label' => '4 Stars & Above', 'value' => 4],
                ['id' => 2, 'label' => '3 Stars & Above', 'value' => 3],
                ['id' => 3, 'label' => '2 Stars & Above', 'value' => 2],
                ['id' => 4, 'label' => '1 Star & Above', 'value' => 1],
            ],
        ];
    }

    private function getPopularProducts(): array
    {
        // Normally you'd query the database for this
        // Returning some sample data for now
        return array_slice($this->getFeaturedProducts(), 0, 3);
    }

    private function getNewArrivals(): array
    {
        // Return products with is_new flag
        $allProducts = array_merge($this->getFeaturedProducts(), $this->getProducts());
        return array_filter($allProducts, fn($p) => $p['is_new'] === true);
    }

    private function getDealOfTheDay(): array
    {
        return [
            'id' => 10,
            'name' => 'Gourmet Spice Collection',
            'slug' => 'gourmet-spice-collection',
            'price' => 49.99,
            'sale_price' => 29.99,
            'on_sale' => true,
            'discount_percentage' => 40,
            'image' => '/images/shop/products/spice-collection.jpg',
            'images' => [
                '/images/shop/products/spice-collection.jpg',
                '/images/shop/products/spice-collection-2.jpg',
                '/images/shop/products/spice-collection-3.jpg',
            ],
            'rating' => 4.9,
            'reviews_count' => 128,
            'category' => 'Spices & Seasonings',
            'brand' => 'Luxury Tastes',
            'in_stock' => true,
            'stock_quantity' => 10,
            'description' => 'Premium collection of 12 hand-selected spices from around the world, packaged in elegant glass jars.',
            'features' => [
                '12 premium spices',
                'Ethically sourced',
                'No additives or preservatives',
                'Recipe booklet included',
            ],
            'expires_at' => '2023-12-31T23:59:59',
            'limited_quantity' => true,
            'remaining' => 10,
        ];
    }

    private function getTestimonials(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Julia Martinez',
                'image' => '/images/testimonials/user1.jpg',
                'rating' => 5,
                'text' => 'The quality of ingredients from this shop is exceptional. I\'ve completely transformed my home cooking!',
                'date' => '2023-10-15',
                'verified_purchase' => true,
            ],
            [
                'id' => 2,
                'name' => 'Michael Chen',
                'image' => '/images/testimonials/user2.jpg',
                'rating' => 4,
                'text' => 'Fast shipping and excellent packaging. The artisan pasta was some of the best I\'ve ever tasted outside of Italy.',
                'date' => '2023-09-22',
                'verified_purchase' => true,
            ],
            [
                'id' => 3,
                'name' => 'Sarah Johnson',
                'image' => '/images/testimonials/user3.jpg',
                'rating' => 5,
                'text' => 'The truffle honey is incredible. A little pricey but absolutely worth every penny for special occasions.',
                'date' => '2023-11-03',
                'verified_purchase' => true,
            ],
        ];
    }

    private function getBannerSection(): array
    {
        return [
            'title' => 'Seasonal Specialties',
            'subtitle' => 'Limited Time Offer',
            'description' => 'Discover our exclusive collection of seasonal products. Perfect for holiday cooking and gift giving.',
            'image' => '/images/shop/banner-seasonal.jpg',
            'button_text' => 'Shop Collection',
            'button_link' => '/shop?category=seasonal',
            'expires_at' => '2023-12-25T23:59:59',
        ];
    }

    private function getProductDetails(string $slug): array
    {
        // In a real app, this would fetch from DB
        // For demo, return hardcoded data that matches the slug
        $allProducts = array_merge($this->getFeaturedProducts(), $this->getProducts());
        
        foreach ($allProducts as $product) {
            if ($product['slug'] === $slug) {
                // Add additional product details
                return array_merge($product, [
                    'long_description' => 'Detailed product description would go here. This would include information about the origin, production methods, flavor profile, and suggested uses.',
                    'specifications' => [
                        'Weight' => '250g',
                        'Dimensions' => '10 × 5 × 5 cm',
                        'Ingredients' => 'Organic ingredients list',
                        'Allergies' => 'May contain traces of nuts',
                        'Storage' => 'Store in a cool, dry place',
                        'Country of Origin' => 'Italy',
                    ],
                    'images' => [
                        $product['image'],
                        str_replace('.jpg', '-2.jpg', $product['image']),
                        str_replace('.jpg', '-3.jpg', $product['image']),
                    ],
                    'features' => [
                        'Premium quality',
                        'Ethically sourced',
                        'Award-winning taste',
                        'No artificial additives',
                    ],
                    'videos' => [
                        [
                            'thumbnail' => '/images/shop/products/video-thumb.jpg',
                            'url' => 'https://www.youtube.com/watch?v=example',
                            'title' => 'Product Overview',
                        ]
                    ],
                    'nutritional_info' => [
                        'Calories' => '120 per serving',
                        'Fat' => '10g',
                        'Carbohydrates' => '0g',
                        'Protein' => '0g',
                        'Sodium' => '0mg',
                    ],
                ]);
            }
        }
        
        // Return default data if product not found
        return [
            'id' => 0,
            'name' => 'Product Not Found',
            'slug' => 'product-not-found',
            'price' => 0,
            'image' => '/images/shop/products/placeholder.jpg',
            'description' => 'The requested product could not be found.',
            'in_stock' => false,
        ];
    }

    private function getRelatedProducts(string $slug): array
    {
        // In a real app, would find related products based on category, tags, etc.
        // For demo, just return some products
        return array_slice($this->getFeaturedProducts(), 0, 4);
    }

    private function getProductReviews(string $slug): array
    {
        return [
            [
                'id' => 1,
                'user_name' => 'Thomas Anderson',
                'user_image' => '/images/testimonials/user4.jpg',
                'rating' => 5,
                'title' => 'Exceptional Quality',
                'text' => 'This product exceeded my expectations. Will definitely buy again!',
                'date' => '2023-11-05',
                'verified_purchase' => true,
                'helpful_count' => 12,
                'images' => [
                    '/images/shop/reviews/review-1.jpg',
                ],
            ],
            [
                'id' => 2,
                'user_name' => 'Emma Clark',
                'user_image' => '/images/testimonials/user5.jpg',
                'rating' => 4,
                'title' => 'Great Value',
                'text' => 'Really good quality for the price. Packaging was also very nice.',
                'date' => '2023-10-22',
                'verified_purchase' => true,
                'helpful_count' => 8,
                'images' => [],
            ],
        ];
    }

    private function getProductFaqs(string $slug): array
    {
        return [
            [
                'question' => 'Is this product organic?',
                'answer' => 'Yes, this product is certified organic by the USDA.',
            ],
            [
                'question' => 'What is the shelf life?',
                'answer' => 'The product has a shelf life of 24 months when stored properly in a cool, dry place.',
            ],
            [
                'question' => 'Is the packaging recyclable?',
                'answer' => 'Yes, our packaging is 100% recyclable and made from sustainable materials.',
            ],
        ];
    }
} 