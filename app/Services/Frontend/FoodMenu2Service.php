<?php

declare(strict_types=1);

namespace App\Services\Frontend;

use App\Services\BaseService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

final class FoodMenu2Service extends BaseService
{
    public function getFoodMenu2PageData(): array
    {
        try {
            return [
                'hero' => $this->getHeroSection(),
                'categories' => $this->getCategories(),
                'menuItems' => $this->getMenuItems(),
                'featuredItems' => $this->getFeaturedItems(),
                'popularCombos' => $this->getPopularCombos(),
                'nutritionalGuide' => $this->getNutritionalGuide(),
                'filters' => $this->getFilters(),
                'stats' => $this->getStats()
            ];
        } catch (\Throwable $e) {
            logger()->error('Error fetching food menu data: ' . $e->getMessage(), [
                'exception' => $e,
            ]);
            
            return [
                'hero' => $this->getHeroSection(),
                'categories' => [],
                'menuItems' => [],
                'featuredItems' => [],
                'popularCombos' => [],
                'nutritionalGuide' => [],
                'filters' => $this->getFilters(),
                'stats' => $this->getStats(),
                'error' => 'Failed to load some menu data. Please try again later.'
            ];
        }
    }

    private function getHeroSection(): array
    {
        return [
            'title' => 'Explore Our Delicious Menu',
            'subtitle' => 'Crafted with Passion',
            'description' => 'Discover a world of flavors with our carefully curated menu items, prepared by expert chefs using only the freshest ingredients.',
            'image' => '/images/food-menu/hero-banner.jpg',
            'cta' => [
                'text' => 'Browse Menu',
                'link' => '#category-navigation'
            ],
            'stats' => [
                ['label' => 'Menu Items', 'value' => '200+'],
                ['label' => 'Categories', 'value' => '12'],
                ['label' => 'Restaurants', 'value' => '50+'],
                ['label' => 'Happy Customers', 'value' => '100K+']
            ]
        ];
    }

    private function getCategories(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Pizza',
                'slug' => 'pizza',
                'icon' => 'Pizza',
                'image' => '/images/categories/pizza.jpg',
                'description' => 'Handcrafted pizzas with fresh toppings',
                'items_count' => 25,
                'is_popular' => true,
                'order' => 1,
                'color' => 'bg-gradient-to-r from-red-500 to-orange-500',
                'featured_dish' => 'Margherita Pizza',
                'dietary_options' => ['Vegetarian available', 'Gluten-free option']
            ],
            [
                'id' => 2,
                'name' => 'Burgers',
                'slug' => 'burgers',
                'icon' => 'Beef',
                'image' => '/images/categories/burgers.jpg',
                'description' => 'Juicy burgers with premium ingredients',
                'items_count' => 15,
                'is_popular' => true,
                'order' => 2,
                'color' => 'bg-gradient-to-r from-amber-500 to-yellow-500',
                'featured_dish' => 'Classic Cheeseburger',
                'dietary_options' => ['Vegetarian option', 'Plant-based option']
            ],
            [
                'id' => 3,
                'name' => 'Pasta',
                'slug' => 'pasta',
                'icon' => 'Utensils',
                'image' => '/images/categories/pasta.jpg',
                'description' => 'Authentic Italian pasta dishes',
                'items_count' => 20,
                'is_popular' => true,
                'order' => 3,
                'color' => 'bg-gradient-to-r from-yellow-500 to-green-500',
                'featured_dish' => 'Spaghetti Carbonara',
                'dietary_options' => ['Vegetarian option', 'Gluten-free option']
            ],
            [
                'id' => 4,
                'name' => 'Salads',
                'slug' => 'salads',
                'icon' => 'Salad',
                'image' => '/images/categories/salads.jpg',
                'description' => 'Fresh and healthy salad options',
                'items_count' => 12,
                'is_popular' => false,
                'order' => 4,
                'color' => 'bg-gradient-to-r from-green-500 to-teal-500',
                'featured_dish' => 'Mediterranean Salad',
                'dietary_options' => ['Vegan', 'Gluten-free']
            ],
            [
                'id' => 5,
                'name' => 'Desserts',
                'slug' => 'desserts',
                'icon' => 'IceCream',
                'image' => '/images/categories/desserts.jpg',
                'description' => 'Sweet treats to satisfy your cravings',
                'items_count' => 18,
                'is_popular' => true,
                'order' => 5,
                'color' => 'bg-gradient-to-r from-blue-500 to-indigo-500',
                'featured_dish' => 'Chocolate Lava Cake',
                'dietary_options' => ['Vegetarian', 'Gluten-free option']
            ],
            [
                'id' => 6,
                'name' => 'Beverages',
                'slug' => 'beverages',
                'icon' => 'Coffee',
                'image' => '/images/categories/beverages.jpg',
                'description' => 'Refreshing drinks and beverages',
                'items_count' => 22,
                'is_popular' => false,
                'order' => 6,
                'color' => 'bg-gradient-to-r from-purple-500 to-pink-500',
                'featured_dish' => 'Mango Smoothie',
                'dietary_options' => ['Vegan options', 'Dairy-free options']
            ],
            [
                'id' => 7,
                'name' => 'Appetizers',
                'slug' => 'appetizers',
                'icon' => 'Soup',
                'image' => '/images/categories/appetizers.jpg',
                'description' => 'Perfect starters for any meal',
                'items_count' => 16,
                'is_popular' => false,
                'order' => 7,
                'color' => 'bg-gradient-to-r from-pink-500 to-rose-500',
                'featured_dish' => 'Loaded Nachos',
                'dietary_options' => ['Vegetarian option', 'Gluten-free option']
            ],
            [
                'id' => 8,
                'name' => 'Seafood',
                'slug' => 'seafood',
                'icon' => 'Fish',
                'image' => '/images/categories/seafood.jpg',
                'description' => 'Fresh seafood dishes from the ocean',
                'items_count' => 14,
                'is_popular' => false,
                'order' => 8,
                'color' => 'bg-gradient-to-r from-cyan-500 to-blue-500',
                'featured_dish' => 'Grilled Salmon',
                'dietary_options' => ['Gluten-free', 'High-protein']
            ]
        ];
    }

    private function getMenuItems(): array
    {
        $items = [];
        $categories = $this->getCategories();
        
        foreach ($categories as $categoryIndex => $category) {
            // Generate 4-8 items per category
            $itemCount = rand(4, 8);
            
            for ($i = 1; $i <= $itemCount; $i++) {
                $id = count($items) + 1;
                $isVegetarian = (bool) rand(0, 1);
                $isSpicy = (bool) rand(0, 1);
                $isPopular = (bool) rand(0, 1);
                $hasDiscount = rand(0, 10) > 7; // 30% chance of discount
                $discount = $hasDiscount ? rand(10, 30) : null;
                
                $price = rand(999, 2999) / 100; // Random price between $9.99 and $29.99
                $calories = rand(200, 1200);
                $preparationTime = (rand(10, 45) . '-' . rand(15, 60)) . ' mins';
                $rating = rand(35, 50) / 10; // Random rating between 3.5 and 5.0
                $reviewsCount = rand(10, 200);
                
                $items[] = [
                    'id' => $id,
                    'name' => 'Menu Item ' . $id . ' (' . $category['name'] . ')',
                    'slug' => 'menu-item-' . $id . '-' . Str::slug($category['name']),
                    'description' => 'Delicious ' . strtolower($category['name']) . ' prepared with fresh ingredients and our special recipe.',
                    'price' => $price,
                    'discount' => $discount,
                    'image' => '/images/menu/item-' . rand(1, 10) . '.jpg',
                    'category' => [
                        'id' => $category['id'],
                        'name' => $category['name'],
                        'slug' => $category['slug']
                    ],
                    'rating' => $rating,
                    'reviews_count' => $reviewsCount,
                    'preparation_time' => $preparationTime,
                    'calories' => $calories,
                    'is_vegetarian' => $isVegetarian,
                    'is_spicy' => $isSpicy,
                    'is_popular' => $isPopular,
                    'is_new' => $id % 7 === 0, // Every 7th item is new
                    'allergens' => $this->getRandomAllergens(),
                    'nutritional_info' => [
                        'calories' => $calories,
                        'protein' => rand(5, 30) . 'g',
                        'carbs' => rand(10, 100) . 'g',
                        'fat' => rand(5, 30) . 'g',
                        'fiber' => rand(1, 10) . 'g',
                        'sodium' => rand(100, 1000) . 'mg'
                    ],
                    'variations' => $this->getItemVariations($category['name']),
                    'addons' => $this->getItemAddons($category['name'])
                ];
            }
        }
        
        return $items;
    }

    private function getRandomAllergens(): array
    {
        $allergens = ['Gluten', 'Dairy', 'Eggs', 'Soy', 'Nuts', 'Shellfish', 'Fish', 'Wheat'];
        $result = [];
        $count = rand(0, 3); // 0-3 allergens per item
        
        for ($i = 0; $i < $count; $i++) {
            $allergen = $allergens[array_rand($allergens)];
            if (!in_array($allergen, $result)) {
                $result[] = $allergen;
            }
        }
        
        return $result;
    }

    private function getItemVariations(string $categoryName): array
    {
        $variations = [];
        
        switch ($categoryName) {
            case 'Pizza':
                $variations = [
                    [
                        'name' => 'Size',
                        'required' => true,
                        'options' => [
                            ['name' => 'Small (10")', 'price' => 0],
                            ['name' => 'Medium (12")', 'price' => 4],
                            ['name' => 'Large (14")', 'price' => 7],
                            ['name' => 'Extra Large (16")', 'price' => 10]
                        ]
                    ],
                    [
                        'name' => 'Crust',
                        'required' => true,
                        'options' => [
                            ['name' => 'Thin', 'price' => 0],
                            ['name' => 'Classic', 'price' => 0],
                            ['name' => 'Deep Dish', 'price' => 2],
                            ['name' => 'Stuffed Crust', 'price' => 3]
                        ]
                    ]
                ];
                break;
            
            case 'Burgers':
                $variations = [
                    [
                        'name' => 'Patty Type',
                        'required' => true,
                        'options' => [
                            ['name' => 'Beef', 'price' => 0],
                            ['name' => 'Chicken', 'price' => 0],
                            ['name' => 'Veggie', 'price' => 0],
                            ['name' => 'Beyond Meat', 'price' => 2]
                        ]
                    ],
                    [
                        'name' => 'Cheese',
                        'required' => false,
                        'options' => [
                            ['name' => 'American', 'price' => 1],
                            ['name' => 'Cheddar', 'price' => 1],
                            ['name' => 'Swiss', 'price' => 1.5],
                            ['name' => 'Blue Cheese', 'price' => 2]
                        ]
                    ]
                ];
                break;
            
            case 'Pasta':
                $variations = [
                    [
                        'name' => 'Pasta Type',
                        'required' => true,
                        'options' => [
                            ['name' => 'Spaghetti', 'price' => 0],
                            ['name' => 'Penne', 'price' => 0],
                            ['name' => 'Fettuccine', 'price' => 0],
                            ['name' => 'Gluten-Free', 'price' => 2]
                        ]
                    ],
                    [
                        'name' => 'Sauce',
                        'required' => true,
                        'options' => [
                            ['name' => 'Marinara', 'price' => 0],
                            ['name' => 'Alfredo', 'price' => 1],
                            ['name' => 'Pesto', 'price' => 1.5],
                            ['name' => 'Rosé', 'price' => 1]
                        ]
                    ]
                ];
                break;
            
            default:
                // Generic variations for other categories
                $variations = [
                    [
                        'name' => 'Size',
                        'required' => true,
                        'options' => [
                            ['name' => 'Regular', 'price' => 0],
                            ['name' => 'Large', 'price' => 3]
                        ]
                    ]
                ];
        }
        
        return $variations;
    }

    private function getItemAddons(string $categoryName): array
    {
        $addons = [];
        
        switch ($categoryName) {
            case 'Pizza':
                $addons = [
                    ['name' => 'Extra Cheese', 'price' => 2.50],
                    ['name' => 'Pepperoni', 'price' => 2.00],
                    ['name' => 'Mushrooms', 'price' => 1.50],
                    ['name' => 'Bell Peppers', 'price' => 1.00],
                    ['name' => 'Olives', 'price' => 1.00],
                    ['name' => 'Onions', 'price' => 1.00],
                    ['name' => 'Chicken', 'price' => 3.00],
                    ['name' => 'Italian Sausage', 'price' => 2.50]
                ];
                break;
            
            case 'Burgers':
                $addons = [
                    ['name' => 'Bacon', 'price' => 2.00],
                    ['name' => 'Avocado', 'price' => 2.50],
                    ['name' => 'Fried Egg', 'price' => 1.50],
                    ['name' => 'Mushrooms', 'price' => 1.00],
                    ['name' => 'Jalapeños', 'price' => 0.75],
                    ['name' => 'Caramelized Onions', 'price' => 1.00],
                    ['name' => 'Extra Patty', 'price' => 4.00]
                ];
                break;
            
            case 'Pasta':
                $addons = [
                    ['name' => 'Grilled Chicken', 'price' => 3.50],
                    ['name' => 'Italian Sausage', 'price' => 3.00],
                    ['name' => 'Shrimp', 'price' => 4.50],
                    ['name' => 'Meatballs', 'price' => 3.50],
                    ['name' => 'Extra Cheese', 'price' => 2.00],
                    ['name' => 'Broccoli', 'price' => 1.50],
                    ['name' => 'Spinach', 'price' => 1.50]
                ];
                break;
            
            default:
                // Generic addons for other categories
                $addons = [
                    ['name' => 'Extra Portion', 'price' => 3.00],
                    ['name' => 'Side of Sauce', 'price' => 1.00],
                    ['name' => 'Premium Topping', 'price' => 2.00]
                ];
        }
        
        // Randomize the number of addons (3-6)
        shuffle($addons);
        return array_slice($addons, 0, rand(3, min(6, count($addons))));
    }

    private function getFeaturedItems(): array
    {
        $allItems = $this->getMenuItems();
        shuffle($allItems);
        
        // Select 6 random items as featured
        $featuredItems = array_slice($allItems, 0, 6);
        
        foreach ($featuredItems as &$item) {
            // Add featured badge and description
            $item['featured_badge'] = 'Chef\'s Special';
            $item['featured_description'] = 'One of our most loved dishes, selected by our head chef.';
            $item['promotion'] = rand(0, 1) ? 'Limited Time Offer' : null;
        }
        
        return $featuredItems;
    }

    private function getPopularCombos(): array
    {
        $allItems = $this->getMenuItems();
        
        $combos = [
            [
                'id' => 1,
                'name' => 'Family Feast',
                'slug' => 'family-feast',
                'description' => 'Perfect combo for the whole family. Includes multiple dishes to satisfy everyone.',
                'image' => '/images/combos/family-feast.jpg',
                'price' => 49.99,
                'original_price' => 64.99,
                'items' => [
                    $this->findRandomItemByCategory($allItems, 'Pizza', 2),
                    $this->findRandomItemByCategory($allItems, 'Appetizers', 1),
                    $this->findRandomItemByCategory($allItems, 'Beverages', 4)
                ],
                'serves' => '4-6 people',
                'popular_pairings' => ['Desserts', 'Salads'],
                'is_limited_time' => false
            ],
            [
                'id' => 2,
                'name' => 'Date Night Special',
                'slug' => 'date-night-special',
                'description' => 'Romantic dinner for two with premium selections. Perfect for a special evening.',
                'image' => '/images/combos/date-night.jpg',
                'price' => 39.99,
                'original_price' => 49.99,
                'items' => [
                    $this->findRandomItemByCategory($allItems, 'Pasta', 2),
                    $this->findRandomItemByCategory($allItems, 'Salads', 1),
                    $this->findRandomItemByCategory($allItems, 'Desserts', 1),
                    $this->findRandomItemByCategory($allItems, 'Beverages', 2)
                ],
                'serves' => '2 people',
                'popular_pairings' => ['Appetizers'],
                'is_limited_time' => false
            ],
            [
                'id' => 3,
                'name' => 'Party Pack',
                'slug' => 'party-pack',
                'description' => 'Feed the crowd with this generous combo pack. Great for gatherings and celebrations.',
                'image' => '/images/combos/party-pack.jpg',
                'price' => 79.99,
                'original_price' => 99.99,
                'items' => [
                    $this->findRandomItemByCategory($allItems, 'Pizza', 3),
                    $this->findRandomItemByCategory($allItems, 'Burgers', 4),
                    $this->findRandomItemByCategory($allItems, 'Appetizers', 3),
                    $this->findRandomItemByCategory($allItems, 'Beverages', 6)
                ],
                'serves' => '8-10 people',
                'popular_pairings' => ['Desserts', 'Salads'],
                'is_limited_time' => false
            ],
            [
                'id' => 4,
                'name' => 'Healthy Choice Bundle',
                'slug' => 'healthy-choice-bundle',
                'description' => 'Nutritious and delicious options for the health-conscious. Balanced meal with lower calories.',
                'image' => '/images/combos/healthy-choice.jpg',
                'price' => 34.99,
                'original_price' => 44.99,
                'items' => [
                    $this->findRandomItemByCategory($allItems, 'Salads', 2),
                    $this->findRandomItemByCategory($allItems, 'Seafood', 1),
                    $this->findRandomItemByCategory($allItems, 'Beverages', 2)
                ],
                'serves' => '2 people',
                'popular_pairings' => ['Appetizers'],
                'is_limited_time' => true,
                'nutritional_highlights' => ['Low calorie', 'High protein', 'Nutrient-rich']
            ]
        ];
        
        return $combos;
    }

    private function findRandomItemByCategory(array $items, string $categoryName, int $count = 1): array
    {
        $filteredItems = array_filter($items, function($item) use ($categoryName) {
            return $item['category']['name'] === $categoryName;
        });
        
        if (empty($filteredItems)) {
            // Return an empty array if no items found in the category
            return [];
        }
        
        // Get random items from the filtered list
        $randomItems = array_rand(array_flip($filteredItems), min($count, count($filteredItems)));
        
        // If only one item requested and we didn't get an array, wrap it
        if ($count === 1 && !is_array($randomItems)) {
            return [$randomItems];
        }
        
        return $randomItems;
    }

    private function getNutritionalGuide(): array
    {
        return [
            'categories' => [
                [
                    'name' => 'Low-Calorie Options',
                    'icon' => 'Leaf',
                    'description' => 'Meals under 600 calories',
                    'items' => [
                        [
                            'name' => 'Mediterranean Salad',
                            'calories' => 450,
                            'protein' => '15g',
                            'carbs' => '30g',
                            'fat' => '28g'
                        ],
                        [
                            'name' => 'Grilled Chicken Bowl',
                            'calories' => 550,
                            'protein' => '35g',
                            'carbs' => '45g',
                            'fat' => '20g'
                        ]
                    ]
                ],
                [
                    'name' => 'High-Protein Meals',
                    'icon' => 'Beef',
                    'description' => 'Meals with 25g+ protein',
                    'items' => [
                        [
                            'name' => 'Steak & Vegetables',
                            'calories' => 720,
                            'protein' => '42g',
                            'carbs' => '25g',
                            'fat' => '30g'
                        ],
                        [
                            'name' => 'Grilled Salmon',
                            'calories' => 650,
                            'protein' => '38g',
                            'carbs' => '15g',
                            'fat' => '25g'
                        ]
                    ]
                ],
                [
                    'name' => 'Vegetarian Favorites',
                    'icon' => 'Salad',
                    'description' => 'Meat-free meal options',
                    'items' => [
                        [
                            'name' => 'Veggie Pasta',
                            'calories' => 700,
                            'protein' => '18g',
                            'carbs' => '90g',
                            'fat' => '22g'
                        ],
                        [
                            'name' => 'Veggie Burger',
                            'calories' => 580,
                            'protein' => '22g',
                            'carbs' => '65g',
                            'fat' => '25g'
                        ]
                    ]
                ],
                [
                    'name' => 'Gluten-Free Choices',
                    'icon' => 'Pizza',
                    'description' => 'Meals without gluten',
                    'items' => [
                        [
                            'name' => 'Cauliflower Crust Pizza',
                            'calories' => 780,
                            'protein' => '25g',
                            'carbs' => '40g',
                            'fat' => '32g'
                        ],
                        [
                            'name' => 'Rice Bowl',
                            'calories' => 650,
                            'protein' => '28g',
                            'carbs' => '75g',
                            'fat' => '22g'
                        ]
                    ]
                ]
            ],
            'allergen_information' => [
                'gluten' => ['Pizza (except GF crust)', 'Pasta (except GF option)', 'Burgers (with bun)'],
                'dairy' => ['Pizzas with cheese', 'Creamy pastas', 'Cheesecake'],
                'nuts' => ['Some desserts', 'Certain salads', 'Pesto pasta'],
                'shellfish' => ['Seafood platters', 'Some pasta dishes']
            ],
            'dietary_guides' => [
                'vegan' => ['Veggie Burger (no cheese)', 'Garden Salad', 'Fruit Platter'],
                'keto' => ['Steak & Vegetables', 'Grilled Salmon', 'Caesar Salad (no croutons)'],
                'paleo' => ['Grilled Meats', 'Vegetable Sides', 'Fruit Desserts']
            ]
        ];
    }

    private function getFilters(): array
    {
        return [
            'categories' => array_map(function($category) {
                return [
                    'id' => $category['id'],
                    'name' => $category['name'],
                    'count' => $category['items_count']
                ];
            }, $this->getCategories()),
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
                'dairy_free' => 'Dairy Free',
                'low_calorie' => 'Low Calorie',
                'high_protein' => 'High Protein',
                'spicy' => 'Spicy',
                'nut_free' => 'Nut Free'
            ],
            'sort_options' => [
                'recommended' => 'Recommended',
                'price_asc' => 'Price: Low to High',
                'price_desc' => 'Price: High to Low',
                'rating' => 'Highest Rated',
                'popularity' => 'Most Popular',
                'newest' => 'Newest Items'
            ],
            'meal_type' => [
                'breakfast' => 'Breakfast',
                'lunch' => 'Lunch',
                'dinner' => 'Dinner',
                'snack' => 'Snack',
                'dessert' => 'Dessert'
            ],
            'preparation_time' => [
                'quick' => 'Quick (Under 15 min)',
                'medium' => 'Medium (15-30 min)',
                'slow' => 'Slow (Over 30 min)'
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
            ],
            'average_preparation_time' => '25 mins',
            'price_range' => [
                'min' => 5.99,
                'max' => 35.99,
                'average' => 18.50
            ],
            'dietary_breakdown' => [
                'vegetarian' => '35%',
                'vegan' => '20%',
                'gluten_free' => '15%',
                'dairy_free' => '25%'
            ]
        ];
    }

    public function getMenuItemDetails(string $slug): array
    {
        $allItems = $this->getMenuItems();
        
        // Find the requested item
        $item = array_filter($allItems, function($menuItem) use ($slug) {
            return $menuItem['slug'] === $slug;
        });
        
        if (empty($item)) {
            return [
                'item' => null,
                'relatedItems' => [],
                'reviews' => [],
                'error' => 'Menu item not found'
            ];
        }
        
        $item = reset($item);
        
        // Get related items from the same category
        $relatedItems = array_filter($allItems, function($menuItem) use ($item) {
            return $menuItem['category']['id'] === $item['category']['id'] && $menuItem['id'] !== $item['id'];
        });
        
        // Limit to 4 related items
        $relatedItems = array_slice($relatedItems, 0, 4);
        
        // Generate random reviews
        $reviews = $this->generateRandomReviews($item);
        
        return [
            'item' => $item,
            'relatedItems' => $relatedItems,
            'reviews' => $reviews
        ];
    }

    private function generateRandomReviews(array $item): array
    {
        $reviews = [];
        $reviewCount = rand(5, 15);
        
        for ($i = 1; $i <= $reviewCount; $i++) {
            $rating = rand(3, 5); // Most reviews are positive (3-5 stars)
            $reviews[] = [
                'id' => $i,
                'user_name' => 'Customer ' . rand(1000, 9999),
                'rating' => $rating,
                'date' => date('Y-m-d', strtotime('-' . rand(1, 60) . ' days')),
                'comment' => $this->getRandomReviewComment($rating, $item['name']),
                'likes' => rand(0, 50),
                'verified_purchase' => (bool) rand(0, 1)
            ];
        }
        
        return $reviews;
    }

    private function getRandomReviewComment(int $rating, string $itemName): string
    {
        $positiveComments = [
            "Absolutely loved the {item}! The flavors were amazing.",
            "The {item} exceeded my expectations. Will order again!",
            "Best {item} I've had in a long time. Highly recommend!",
            "The {item} was delicious and arrived hot. Perfect!",
            "Great taste and portion size for the {item}."
        ];
        
        $neutralComments = [
            "The {item} was good, but not amazing.",
            "Decent {item}, reasonable for the price.",
            "The {item} was okay, might try something else next time.",
            "Not bad, but I've had better {item} elsewhere.",
            "Acceptable quality for the {item}, nothing special."
        ];
        
        $negativeComments = [
            "Disappointed with the {item}, not as described.",
            "The {item} was cold when it arrived.",
            "Would not recommend the {item}, taste was off.",
            "Expected more from the {item} given the price.",
            "Unfortunately the {item} didn't meet expectations."
        ];
        
        if ($rating >= 4) {
            $comment = $positiveComments[array_rand($positiveComments)];
        } elseif ($rating == 3) {
            $comment = $neutralComments[array_rand($neutralComments)];
        } else {
            $comment = $negativeComments[array_rand($negativeComments)];
        }
        
        return str_replace('{item}', $itemName, $comment);
    }

    public function getCategoryDetails(string $slug): array
    {
        $categories = $this->getCategories();
        $menuItems = $this->getMenuItems();
        
        // Find the requested category
        $category = array_filter($categories, function($cat) use ($slug) {
            return $cat['slug'] === $slug;
        });
        
        if (empty($category)) {
            return [
                'category' => null,
                'items' => [],
                'filters' => $this->getFilters(),
                'error' => 'Category not found'
            ];
        }
        
        $category = reset($category);
        
        // Filter items by category
        $categoryItems = array_filter($menuItems, function($item) use ($category) {
            return $item['category']['id'] === $category['id'];
        });
        
        return [
            'category' => $category,
            'items' => $categoryItems,
            'filters' => $this->getFilters()
        ];
    }
} 