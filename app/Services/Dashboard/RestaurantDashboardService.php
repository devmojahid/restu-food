<?php

namespace App\Services\Dashboard;

use Carbon\Carbon;

class RestaurantDashboardService
{
    public function getData($restaurantId)
    {
        return [
            'summary_stats' => $this->getSummaryStats($restaurantId),
            'orders_overview' => $this->getOrdersOverview($restaurantId),
            'menu_performance' => $this->getMenuPerformance($restaurantId),
            'customer_insights' => $this->getCustomerInsights($restaurantId),
            'analytics_data' => $this->getAnalyticsData($restaurantId),
            'recent_orders' => $this->getRecentOrders($restaurantId),
            'revenue_stats' => $this->getRevenueStats($restaurantId),
            'staff_performance' => $this->getStaffPerformance($restaurantId),
        ];
    }

    private function getSummaryStats($restaurantId)
    {
        return [
            'total_revenue' => [
                'value' => rand(5000, 20000),
                'growth' => rand(-10, 30),
                'label' => 'Total Revenue',
                'icon' => 'dollar-sign'
            ],
            'total_orders' => [
                'value' => rand(100, 500),
                'growth' => rand(-5, 25),
                'label' => 'Total Orders',
                'icon' => 'shopping-bag'
            ],
            'avg_order_value' => [
                'value' => rand(30, 100),
                'growth' => rand(-8, 20),
                'label' => 'Average Order Value',
                'icon' => 'trending-up'
            ],
            'customer_satisfaction' => [
                'value' => rand(85, 98),
                'growth' => rand(-2, 10),
                'label' => 'Customer Satisfaction',
                'icon' => 'smile'
            ]
        ];
    }

    private function getAnalyticsData($restaurantId)
    {
        return [
            'hourly_orders' => collect(range(0, 23))->map(function($hour) {
                return [
                    'hour' => sprintf('%02d:00', $hour),
                    'orders' => rand(5, 50),
                    'revenue' => rand(150, 1500),
                    'avg_order_value' => rand(25, 75)
                ];
            })->values(),

            'daily_revenue' => collect(range(1, 7))->map(function($day) {
                return [
                    'date' => now()->subDays(7 - $day)->format('Y-m-d'),
                    'revenue' => rand(1000, 5000),
                    'orders' => rand(20, 100),
                    'customers' => rand(15, 80)
                ];
            })->values(),

            'popular_times' => collect(range(0, 23))->map(function($hour) {
                return [
                    'hour' => sprintf('%02d:00', $hour),
                    'traffic' => rand(0, 100),
                    'capacity' => rand(20, 100)
                ];
            })->values(),

            'customer_trends' => [
                'new_customers' => rand(10, 50),
                'returning_customers' => rand(50, 200),
                'avg_visit_frequency' => round(rand(10, 30) / 10, 1),
                'customer_retention' => rand(60, 90)
            ],

            'performance_metrics' => [
                'order_completion_rate' => rand(85, 99),
                'avg_preparation_time' => rand(15, 45),
                'order_accuracy' => rand(90, 99),
                'customer_satisfaction' => rand(85, 98)
            ]
        ];
    }

    private function getRecentOrders($restaurantId)
    {
        return collect(range(1, 10))->map(function($index) {
            $status = collect(['pending', 'preparing', 'ready', 'delivered', 'cancelled'])->random();
            $orderTotal = rand(20, 200);
            
            return [
                'id' => "ORD-" . str_pad((string)$index, 5, '0', STR_PAD_LEFT),
                'customer' => [
                    'name' => fake()->name(),
                    'type' => collect(['new', 'regular', 'vip'])->random(),
                    'orders_count' => rand(1, 50)
                ],
                'items' => collect(range(1, rand(1, 5)))->map(function() {
                    return [
                        'name' => fake()->words(3, true),
                        'quantity' => rand(1, 3),
                        'price' => rand(8, 30),
                        'special_instructions' => rand(0, 1) ? fake()->sentence() : null
                    ];
                })->values(),
                'total' => $orderTotal,
                'status' => $status,
                'payment_status' => collect(['paid', 'pending', 'failed'])->random(),
                'payment_method' => collect(['cash', 'card', 'wallet'])->random(),
                'created_at' => now()->subMinutes(rand(1, 180))->format('Y-m-d H:i:s'),
                'preparation_time' => rand(15, 45),
                'table_number' => rand(1, 20),
                'is_takeaway' => (bool)rand(0, 1)
            ];
        })->values();
    }

    private function getOrdersOverview($restaurantId)
    {
        return [
            'current_orders' => [
                'pending' => rand(5, 20),
                'preparing' => rand(10, 30),
                'ready' => rand(5, 15),
                'delivered' => rand(50, 200),
                'cancelled' => rand(1, 10),
            ],
            'order_trends' => collect(range(1, 24))->map(function($hour) {
                return [
                    'hour' => sprintf('%02d:00', $hour - 1),
                    'orders' => rand(5, 30),
                    'completed' => rand(5, 25),
                    'cancelled' => rand(0, 5)
                ];
            })->values(),
            'peak_hours' => [
                'lunch' => ['start' => '11:00', 'end' => '14:00', 'avg_orders' => rand(20, 50)],
                'dinner' => ['start' => '18:00', 'end' => '21:00', 'avg_orders' => rand(30, 60)]
            ]
        ];
    }

    private function getMenuPerformance($restaurantId)
    {
        return [
            'top_items' => collect(range(1, 5))->map(function() {
                return [
                    'name' => fake()->words(3, true),
                    'category' => collect(['Main Course', 'Appetizer', 'Dessert', 'Beverage'])->random(),
                    'orders' => rand(50, 200),
                    'revenue' => rand(1000, 5000),
                    'rating' => round(rand(35, 50) / 10, 1),
                    'trend' => rand(-10, 20),
                    'stock_status' => collect(['In Stock', 'Low Stock', 'Out of Stock'])->random()
                ];
            })->values(),
            'categories' => collect(range(1, 4))->map(function() {
                return [
                    'name' => collect(['Main Course', 'Appetizer', 'Dessert', 'Beverage'])->random(),
                    'items_count' => rand(10, 30),
                    'total_orders' => rand(100, 500),
                    'revenue' => rand(5000, 20000),
                    'avg_rating' => round(rand(35, 50) / 10, 1)
                ];
            })->values(),
            'recommendations' => [
                'price_adjustments' => collect(range(1, 3))->map(function() {
                    return [
                        'item' => fake()->words(3, true),
                        'current_price' => rand(10, 50),
                        'suggested_price' => rand(10, 50),
                        'reason' => collect([
                            'High demand, low margin',
                            'Low demand, high price',
                            'Competitive pricing needed'
                        ])->random()
                    ];
                })->values()
            ]
        ];
    }

    private function getCustomerInsights($restaurantId)
    {
        return [
            'segments' => [
                'new' => rand(10, 50),
                'regular' => rand(100, 300),
                'vip' => rand(20, 50),
                'inactive' => rand(50, 150)
            ],
            'satisfaction' => [
                'overall_rating' => round(rand(40, 50) / 10, 1),
                'food_quality' => round(rand(40, 50) / 10, 1),
                'service' => round(rand(40, 50) / 10, 1),
                'ambiance' => round(rand(40, 50) / 10, 1),
                'value' => round(rand(40, 50) / 10, 1)
            ],
            'feedback_summary' => [
                'positive' => rand(50, 200),
                'neutral' => rand(20, 50),
                'negative' => rand(5, 30),
                'recent_comments' => collect(range(1, 5))->map(function() {
                    return [
                        'comment' => fake()->sentence(),
                        'rating' => rand(1, 5),
                        'date' => now()->subHours(rand(1, 48))->format('Y-m-d H:i:s')
                    ];
                })->values()
            ]
        ];
    }

    private function getRevenueStats($restaurantId)
    {
        return [
            'daily_summary' => [
                'total' => rand(5000, 15000),
                'target' => rand(5000, 15000),
                'growth' => rand(-10, 20),
                'breakdown' => [
                    'food' => rand(3000, 10000),
                    'beverages' => rand(1000, 3000),
                    'delivery' => rand(500, 2000),
                    'other' => rand(100, 500)
                ]
            ],
            'payment_methods' => [
                'cash' => rand(20, 40),
                'credit_card' => rand(30, 50),
                'digital_wallet' => rand(10, 30),
                'other' => rand(5, 15)
            ],
            'promotions_impact' => collect(range(1, 3))->map(function() {
                return [
                    'name' => fake()->words(3, true),
                    'revenue_generated' => rand(1000, 5000),
                    'orders' => rand(50, 200),
                    'roi' => rand(10, 30)
                ];
            })->values()
        ];
    }

    private function getStaffPerformance($restaurantId)
    {
        return [
            'overview' => [
                'total_staff' => rand(10, 30),
                'on_duty' => rand(5, 15),
                'efficiency_rate' => rand(85, 98),
                'avg_service_time' => rand(10, 30)
            ],
            'staff_metrics' => collect(range(1, 5))->map(function() {
                return [
                    'name' => fake()->name(),
                    'role' => collect(['Waiter', 'Chef', 'Cashier', 'Manager'])->random(),
                    'orders_handled' => rand(20, 100),
                    'avg_rating' => round(rand(35, 50) / 10, 1),
                    'efficiency' => rand(80, 100),
                    'attendance' => rand(90, 100)
                ];
            })->values(),
            'training_needs' => collect(range(1, 3))->map(function() {
                return [
                    'area' => collect(['Customer Service', 'Food Safety', 'Menu Knowledge'])->random(),
                    'staff_count' => rand(2, 8),
                    'priority' => collect(['High', 'Medium', 'Low'])->random()
                ];
            })->values()
        ];
    }

    // Add other private methods with their implementations...
} 