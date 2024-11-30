<?php

namespace App\Services\Dashboard;

use Carbon\Carbon;

class CustomerDashboardService
{
    public function getData($userId)
    {
        return [
            'summary_stats' => $this->getSummaryStats($userId),
            'order_history' => $this->getOrderHistory($userId),
            'favorite_restaurants' => $this->getFavoriteRestaurants($userId),
            'rewards_points' => $this->getRewardsPoints($userId),
            'recent_activity' => $this->getRecentActivity($userId),
            'analytics_data' => $this->getAnalyticsData($userId),
            'current_orders' => $this->getCurrentOrders($userId),
            'recommendations' => $this->getRecommendations($userId)
        ];
    }

    private function getSummaryStats($userId)
    {
        return [
            'total_orders' => [
                'value' => rand(10, 50),
                'growth' => rand(-10, 30),
                'label' => 'Total Orders',
                'icon' => 'shopping-bag'
            ],
            'total_spent' => [
                'value' => rand(500, 2000),
                'growth' => rand(-5, 25),
                'label' => 'Total Spent',
                'icon' => 'dollar-sign'
            ],
            'avg_order_value' => [
                'value' => rand(30, 100),
                'growth' => rand(-8, 20),
                'label' => 'Average Order',
                'icon' => 'trending-up'
            ],
            'rewards_level' => [
                'value' => collect(['Bronze', 'Silver', 'Gold', 'Platinum'])->random(),
                'points' => rand(100, 1000),
                'label' => 'Rewards Level',
                'icon' => 'award'
            ]
        ];
    }

    private function getOrderHistory($userId)
    {
        return collect(range(1, 10))->map(function($index) {
            $status = collect(['delivered', 'processing', 'cancelled'])->random();
            $total = rand(20, 200);
            
            return [
                'id' => "ORD-" . str_pad((string)$index, 5, '0', STR_PAD_LEFT),
                'restaurant' => [
                    'name' => fake()->company(),
                    'logo' => "https://ui-avatars.com/api/?name=" . urlencode(fake()->company()) . "&background=random",
                    'rating' => round(rand(35, 50) / 10, 1)
                ],
                'items' => collect(range(1, rand(1, 5)))->map(function() {
                    return [
                        'name' => fake()->words(3, true),
                        'quantity' => rand(1, 3),
                        'price' => rand(8, 30),
                        'options' => collect(range(1, rand(0, 2)))->map(function() {
                            return [
                                'name' => fake()->word(),
                                'value' => fake()->words(2, true)
                            ];
                        })->values()
                    ];
                })->values(),
                'total' => $total,
                'status' => $status,
                'delivery_status' => $status === 'delivered' ? 'delivered' : collect(['assigned', 'picked', 'on_way'])->random(),
                'payment_method' => collect(['credit_card', 'debit_card', 'cash', 'wallet'])->random(),
                'created_at' => now()->subDays(rand(1, 30))->format('Y-m-d H:i:s'),
                'delivery_time' => rand(20, 60),
                'rating' => $status === 'delivered' ? rand(3, 5) : null,
                'review' => $status === 'delivered' ? fake()->sentence() : null
            ];
        })->values();
    }

    private function getFavoriteRestaurants($userId)
    {
        return collect(range(1, 6))->map(function() {
            $name = fake()->company();
            return [
                'id' => rand(1, 100),
                'name' => $name,
                'logo' => "https://ui-avatars.com/api/?name=" . urlencode($name) . "&background=random",
                'cuisine' => collect(['Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese'])->random(),
                'rating' => round(rand(35, 50) / 10, 1),
                'delivery_time' => rand(15, 45) . ' min',
                'min_order' => rand(10, 30),
                'delivery_fee' => rand(0, 10),
                'total_orders' => rand(3, 20),
                'last_order' => now()->subDays(rand(1, 30))->format('Y-m-d'),
                'status' => collect(['open', 'closed', 'busy'])->random(),
                'distance' => round(rand(5, 50) / 10, 1) . ' km',
                'offers' => rand(0, 1) ? [
                    'type' => collect(['discount', 'free_delivery'])->random(),
                    'value' => rand(10, 30) . '%'
                ] : null
            ];
        })->values();
    }

    private function getRewardsPoints($userId)
    {
        return [
            'current_points' => rand(100, 1000),
            'lifetime_points' => rand(1000, 5000),
            'next_level' => [
                'name' => collect(['Silver', 'Gold', 'Platinum'])->random(),
                'points_needed' => rand(50, 200)
            ],
            'points_history' => collect(range(1, 5))->map(function() {
                return [
                    'amount' => rand(10, 50),
                    'type' => collect(['earned', 'redeemed'])->random(),
                    'description' => fake()->sentence(),
                    'date' => now()->subDays(rand(1, 30))->format('Y-m-d H:i:s')
                ];
            })->values(),
            'available_rewards' => collect(range(1, 3))->map(function() {
                return [
                    'name' => fake()->words(3, true),
                    'points_required' => rand(50, 200),
                    'description' => fake()->sentence(),
                    'expires_at' => now()->addDays(rand(5, 30))->format('Y-m-d')
                ];
            })->values()
        ];
    }

    private function getRecentActivity($userId)
    {
        return collect(range(1, 15))->map(function() {
            $type = collect(['order', 'review', 'reward', 'favorite', 'achievement'])->random();
            
            $baseActivity = [
                'id' => rand(1, 1000),
                'type' => $type,
                'created_at' => now()->subHours(rand(1, 168))->format('Y-m-d H:i:s'),
                'read' => (bool)rand(0, 1)
            ];

            switch ($type) {
                case 'order':
                    return array_merge($baseActivity, [
                        'icon' => 'shopping-bag',
                        'color' => 'blue',
                        'title' => 'New Order Placed',
                        'description' => 'You placed an order at ' . fake()->company(),
                        'amount' => rand(20, 200),
                        'order_id' => 'ORD-' . str_pad((string)rand(1, 99999), 5, '0', STR_PAD_LEFT)
                    ]);
                case 'review':
                    return array_merge($baseActivity, [
                        'icon' => 'star',
                        'color' => 'yellow',
                        'title' => 'Review Posted',
                        'description' => 'You reviewed ' . fake()->company(),
                        'rating' => rand(3, 5),
                        'review' => fake()->sentence()
                    ]);
                case 'reward':
                    return array_merge($baseActivity, [
                        'icon' => 'gift',
                        'color' => 'green',
                        'title' => 'Reward Earned',
                        'description' => 'You earned ' . rand(10, 50) . ' points',
                        'points' => rand(10, 50),
                        'reward_type' => collect(['order', 'review', 'referral'])->random()
                    ]);
                case 'favorite':
                    return array_merge($baseActivity, [
                        'icon' => 'heart',
                        'color' => 'red',
                        'title' => 'New Favorite',
                        'description' => 'You added ' . fake()->company() . ' to favorites',
                        'restaurant_id' => rand(1, 100)
                    ]);
                default: // achievement
                    return array_merge($baseActivity, [
                        'icon' => 'award',
                        'color' => 'purple',
                        'title' => 'Achievement Unlocked',
                        'description' => collect([
                            'Ordered from 5 different restaurants',
                            'Completed 10 orders',
                            'First review posted',
                            'Referred a friend'
                        ])->random(),
                        'badge' => fake()->word()
                    ]);
            }
        })->values();
    }

    private function getAnalyticsData($userId)
    {
        // Generate daily data for the last 7 days
        $dailyData = collect(range(1, 7))->map(function($day) {
            $date = now()->subDays(7 - $day);
            $orders = rand(1, 10);
            $amount = $orders * rand(20, 100);
            
            return [
                'date' => $date->format('Y-m-d'),
                'orders' => $orders,
                'amount' => $amount,
                'avg_order' => round($amount / $orders, 2)
            ];
        })->values();

        // Generate monthly data for the last 12 months
        $monthlyData = collect(range(1, 12))->map(function($month) {
            $date = now()->subMonths(12 - $month);
            $orders = rand(30, 100);
            $amount = $orders * rand(20, 100);
            
            return [
                'month' => $date->format('M'),
                'orders' => $orders,
                'amount' => $amount,
                'avg_order' => round($amount / $orders, 2)
            ];
        })->values();

        // Generate spending categories
        $categories = collect([
            'Fast Food' => rand(500, 2000),
            'Fine Dining' => rand(1000, 3000),
            'Cafe' => rand(300, 800),
            'Desserts' => rand(200, 500),
            'Beverages' => rand(100, 400)
        ])->map(function($amount, $name) {
            return [
                'name' => $name,
                'amount' => $amount,
                'orders' => rand(10, 50),
                'percentage' => rand(10, 40)
            ];
        })->values();

        return [
            'order_trends' => [
                'daily' => $dailyData,
                'monthly' => $monthlyData
            ],
            'spending_analysis' => [
                'categories' => $categories,
                'time_of_day' => [
                    'morning' => rand(10, 30),
                    'afternoon' => rand(20, 40),
                    'evening' => rand(30, 50),
                    'night' => rand(10, 20)
                ]
            ],
            'preferences' => [
                'cuisines' => collect(['Italian', 'Chinese', 'Indian', 'Mexican'])->map(function($cuisine) {
                    return [
                        'name' => $cuisine,
                        'orders' => rand(5, 20),
                        'percentage' => rand(10, 40)
                    ];
                })->values(),
                'payment_methods' => [
                    'credit_card' => rand(40, 60),
                    'debit_card' => rand(20, 40),
                    'cash' => rand(10, 20),
                    'wallet' => rand(5, 15)
                ]
            ],
            'summary' => [
                'total_orders' => rand(100, 500),
                'total_spending' => rand(2000, 10000),
                'avg_order_value' => rand(30, 100),
                'most_ordered_category' => collect(['Fast Food', 'Fine Dining', 'Cafe'])->random(),
                'favorite_restaurant' => fake()->company(),
                'peak_ordering_time' => collect(['Lunch', 'Dinner', 'Late Night'])->random()
            ]
        ];
    }

    private function getCurrentOrders($userId)
    {
        return collect(range(1, rand(0, 3)))->map(function($index) {
            $status = collect(['preparing', 'ready', 'on_way'])->random();
            
            return [
                'id' => "ORD-" . str_pad((string)rand(1, 99999), 5, '0', STR_PAD_LEFT),
                'restaurant' => [
                    'name' => fake()->company(),
                    'logo' => "https://ui-avatars.com/api/?name=" . urlencode(fake()->company()) . "&background=random",
                    'phone' => fake()->phoneNumber()
                ],
                'status' => $status,
                'ordered_at' => now()->subMinutes(rand(5, 60))->format('Y-m-d H:i:s'),
                'estimated_delivery' => now()->addMinutes(rand(10, 45))->format('Y-m-d H:i:s'),
                'items' => collect(range(1, rand(1, 4)))->map(function() {
                    return [
                        'name' => fake()->words(3, true),
                        'quantity' => rand(1, 3),
                        'price' => rand(8, 30),
                        'notes' => rand(0, 1) ? fake()->sentence() : null
                    ];
                })->values(),
                'delivery' => [
                    'driver_name' => $status === 'on_way' ? fake()->name() : null,
                    'driver_phone' => $status === 'on_way' ? fake()->phoneNumber() : null,
                    'live_location' => $status === 'on_way' ? [
                        'lat' => fake()->latitude(),
                        'lng' => fake()->longitude()
                    ] : null,
                    'status_updates' => collect(range(1, 3))->map(function() {
                        return [
                            'status' => collect(['order_confirmed', 'preparing', 'ready', 'picked_up'])->random(),
                            'time' => now()->subMinutes(rand(5, 30))->format('Y-m-d H:i:s')
                        ];
                    })->values()
                ]
            ];
        })->values();
    }

    private function getRecommendations($userId)
    {
        return [
            'restaurants' => collect(range(1, 5))->map(function() {
                $name = fake()->company();
                return [
                    'id' => rand(1, 100),
                    'name' => $name,
                    'logo' => "https://ui-avatars.com/api/?name=" . urlencode($name) . "&background=random",
                    'cuisine' => collect(['Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese'])->random(),
                    'rating' => round(rand(35, 50) / 10, 1),
                    'distance' => round(rand(5, 50) / 10, 1) . ' km',
                    'delivery_time' => rand(15, 45) . ' min',
                    'reason' => collect([
                        'Based on your past orders',
                        'Popular in your area',
                        'Similar to your favorites',
                        'New restaurant'
                    ])->random()
                ];
            })->values(),
            'dishes' => collect(range(1, 6))->map(function() {
                return [
                    'name' => fake()->words(3, true),
                    'restaurant' => fake()->company(),
                    'price' => rand(8, 30),
                    'image' => "https://picsum.photos/200/200?random=" . rand(1, 1000),
                    'rating' => round(rand(35, 50) / 10, 1),
                    'category' => collect(['Main Course', 'Appetizer', 'Dessert', 'Beverage'])->random(),
                    'reason' => collect([
                        'Popular choice',
                        'You might like this',
                        'Trending now',
                        'Seasonal special'
                    ])->random()
                ];
            })->values()
        ];
    }
} 