<?php

declare(strict_types=1);

namespace App\Services\Frontend;

use App\Services\BaseService;
use Illuminate\Support\Facades\Cache;

final class MenuService extends BaseService
{
    public function getMenuPageData(): array
    {
        // In production, implement caching
        // return Cache::remember('menu_page_data', 3600, function () {
            return [
                'categories' => $this->getCategories(),
                'menuItems' => $this->getMenuItems(),
                'filters' => $this->getFilters(),
                'stats' => $this->getStats()
            ];
        // });
    }

    private function getCategories(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Pizza',
                'slug' => 'pizza',
                'icon' => '🍕',
                'image' => '/images/categories/pizza.jpg',
                'description' => 'Handcrafted pizzas with fresh toppings',
                'items_count' => 25,
                'is_popular' => true,
                'order' => 1
            ],
            [
                'id' => 2,
                'name' => 'Burgers',
                'slug' => 'burgers',
                'icon' => '🍔',
                'image' => '/images/categories/burgers.jpg',
                'description' => 'Juicy burgers with premium ingredients',
                'items_count' => 15,
                'is_popular' => true,
                'order' => 2
            ],
            // Add more categories...
        ];
    }

    private function getMenuItems(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Margherita Pizza',
                'slug' => 'margherita-pizza',
                'description' => 'Fresh tomatoes, mozzarella, basil, and olive oil',
                'price' => 14.99,
                'image' => '/images/menu/margherita-pizza.jpg',
                'category' => [
                    'id' => 1,
                    'name' => 'Pizza',
                    'slug' => 'pizza'
                ],
                'rating' => 4.8,
                'reviews_count' => 124,
                'preparation_time' => '20-25',
                'calories' => '800',
                'is_vegetarian' => true,
                'is_spicy' => false,
                'is_popular' => true,
                'allergens' => ['Gluten', 'Dairy'],
                'variations' => [
                    [
                        'name' => 'Size',
                        'options' => [
                            ['name' => 'Small (10")', 'price' => 14.99],
                            ['name' => 'Medium (12")', 'price' => 18.99],
                            ['name' => 'Large (14")', 'price' => 22.99]
                        ]
                    ],
                    [
                        'name' => 'Crust',
                        'options' => [
                            ['name' => 'Thin', 'price' => 0],
                            ['name' => 'Thick', 'price' => 2],
                            ['name' => 'Stuffed', 'price' => 4]
                        ]
                    ]
                ],
                'addons' => [
                    [
                        'name' => 'Extra Cheese',
                        'price' => 2.50
                    ],
                    [
                        'name' => 'Extra Basil',
                        'price' => 1.00
                    ],
                    [
                        'name' => 'Garlic Oil Drizzle',
                        'price' => 1.50
                    ]
                ]
            ],
            // Add more menu items...
        ];
    }

    private function getFilters(): array
    {
        return [
            'categories' => [
                ['id' => 1, 'name' => 'Pizza', 'count' => 25],
                ['id' => 2, 'name' => 'Burgers', 'count' => 15],
                ['id' => 3, 'name' => 'Pasta', 'count' => 20],
                ['id' => 4, 'name' => 'Salads', 'count' => 12],
                ['id' => 5, 'name' => 'Desserts', 'count' => 18]
            ],
            'price_ranges' => [
                ['min' => 0, 'max' => 10, 'label' => 'Under $10'],
                ['min' => 10, 'max' => 20, 'label' => '$10 - $20'],
                ['min' => 20, 'max' => 30, 'label' => '$20 - $30'],
                ['min' => 30, 'max' => null, 'label' => 'Over $30']
            ],
            'dietary' => [
                'vegetarian' => 'Vegetarian',
                'vegan' => 'Vegan',
                'gluten_free' => 'Gluten Free',
                'dairy_free' => 'Dairy Free'
            ],
            'sort_options' => [
                'recommended' => 'Recommended',
                'price_asc' => 'Price: Low to High',
                'price_desc' => 'Price: High to Low',
                'rating' => 'Highest Rated',
                'popularity' => 'Most Popular'
            ]
        ];
    }

    private function getStats(): array
    {
        return [
            'total_items' => 150,
            'categories_count' => 8,
            'average_rating' => 4.7,
            'total_reviews' => 1500,
            'popular_categories' => [
                'Pizza',
                'Burgers',
                'Pasta',
                'Desserts'
            ],
            'top_rated_items' => [
                'Margherita Pizza',
                'Classic Burger',
                'Chocolate Lava Cake'
            ]
        ];
    }

    public function getMenuItemDetails(string $slug): array
    {
        // Implement actual database queries in production
        return [
            'item' => [
                // Item details
            ],
            'relatedItems' => [
                // Related items
            ],
            'reviews' => [
                // Reviews
            ]
        ];
    }

    public function getCategoryDetails(string $slug): array
    {
        // Implement actual database queries in production
        return [
            'category' => [
                // Category details
            ],
            'items' => [
                // Category items
            ],
            'filters' => $this->getFilters()
        ];
    }
} 