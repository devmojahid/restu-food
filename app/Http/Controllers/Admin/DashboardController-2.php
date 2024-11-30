<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Order;
use App\Models\Restaurant;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\KitchenService;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

final class DashboardController extends Controller
{
    public function index()
    {
        try {
            $now = Carbon::now();
            
            // Generate dummy data for dashboard
            $dashboardData = [
                'summary_stats' => [
                    'total_revenue' => [
                        'value' => rand(500000, 1000000),
                        'growth' => rand(5, 15),
                        'label' => 'Total Revenue',
                        'icon' => 'dollar-sign'
                    ],
                    'total_orders' => [
                        'value' => rand(5000, 10000),
                        'growth' => rand(8, 20),
                        'label' => 'Total Orders',
                        'icon' => 'shopping-bag'
                    ],
                    'active_customers' => [
                        'value' => rand(1000, 5000),
                        'growth' => rand(10, 25),
                        'label' => 'Active Customers',
                        'icon' => 'users'
                    ],
                    'avg_order_value' => [
                        'value' => rand(50, 150),
                        'growth' => rand(-5, 15),
                        'label' => 'Average Order Value',
                        'icon' => 'trending-up'
                    ]
                ],
                'revenue_overview' => [
                    'today' => [
                        'total' => rand(5000, 15000),
                        'growth' => rand(5, 25),
                        'orders' => rand(50, 150),
                        'hourly_data' => collect(range(0, 23))->map(function($hour) {
                            return [
                                'hour' => sprintf('%02d:00', $hour),
                                'revenue' => rand(200, 1000),
                                'orders' => rand(5, 20),
                                'avg_order_value' => rand(30, 80)
                            ];
                        })->values()
                    ],
                    'weekly' => [
                        'total' => rand(35000, 75000),
                        'growth' => rand(8, 30),
                        'orders' => rand(350, 750),
                        'daily_data' => collect(range(1, 7))->map(function($day) {
                            return [
                                'date' => now()->subDays(7 - $day)->format('Y-m-d'),
                                'revenue' => rand(5000, 15000),
                                'orders' => rand(50, 150),
                                'avg_order_value' => rand(40, 90)
                            ];
                        })->values()
                    ],
                    'monthly' => [
                        'total' => rand(150000, 300000),
                        'growth' => rand(10, 35),
                        'orders' => rand(1500, 3000),
                        'weekly_data' => collect(range(1, 4))->map(function($week) {
                            return [
                                'week' => "Week $week",
                                'revenue' => rand(35000, 75000),
                                'orders' => rand(350, 750),
                                'avg_order_value' => rand(45, 95)
                            ];
                        })->values()
                    ]
                ],
                'recent_orders' => collect(range(1, 10))->map(function($index) {
                    $status = collect(['pending', 'processing', 'completed', 'cancelled'])->random();
                    $orderTotal = rand(50, 300);
                    $items = rand(1, 5);
                    $customerName = fake()->name();
                    $restaurantName = fake()->company();
                    
                    return [
                        'id' => "ORD-" . str_pad((string)$index, 5, '0', STR_PAD_LEFT),
                        'customer' => [
                            'name' => $customerName,
                            'email' => fake()->email(),
                            'avatar' => "https://ui-avatars.com/api/?name=" . urlencode($customerName) . "&background=random",
                            'type' => collect(['new', 'regular', 'vip'])->random(),
                        ],
                        'items' => $items,
                        'total' => $orderTotal,
                        'status' => $status,
                        'status_color' => [
                            'pending' => 'yellow',
                            'processing' => 'blue',
                            'completed' => 'green',
                            'cancelled' => 'red'
                        ][$status],
                        'payment_status' => collect(['paid', 'pending', 'failed'])->random(),
                        'payment_method' => collect(['credit_card', 'debit_card', 'cash', 'wallet'])->random(),
                        'created_at' => now()->subMinutes(rand(1, 1440))->format('Y-m-d H:i:s'),
                        'restaurant' => [
                            'name' => $restaurantName,
                            'logo' => "https://ui-avatars.com/api/?name=" . urlencode($restaurantName) . "&background=random",
                            'rating' => round(rand(35, 50) / 10, 1),
                            'preparation_time' => rand(15, 45) . ' min'
                        ],
                        'delivery' => [
                            'status' => collect(['assigned', 'picked', 'on_way', 'delivered'])->random(),
                            'time' => rand(20, 60) . ' min',
                            'driver' => fake()->name(),
                            'vehicle' => collect(['bike', 'scooter', 'car'])->random(),
                        ],
                        'items_detail' => collect(range(1, $items))->map(function() {
                            return [
                                'name' => fake()->words(rand(2, 4), true),
                                'quantity' => rand(1, 3),
                                'price' => rand(10, 50),
                                'options' => collect(range(1, rand(0, 3)))->map(function() {
                                    return [
                                        'name' => fake()->word(),
                                        'value' => fake()->words(2, true)
                                    ];
                                })->values()
                            ];
                        })->values()
                    ];
                })->values(),
                'performance_analytics' => [
                    'orders' => [
                        'total' => rand(1500, 3000),
                        'growth' => rand(5, 25),
                        'chart_data' => collect(range(1, 24))->map(function($hour) {
                            return [
                                'hour' => sprintf('%02d:00', $hour - 1),
                                'orders' => rand(20, 100),
                                'completed' => rand(15, 90),
                                'cancelled' => rand(0, 10)
                            ];
                        })->values()
                    ],
                    'revenue' => [
                        'total' => rand(150000, 300000),
                        'growth' => rand(8, 30),
                        'chart_data' => collect(range(1, 30))->map(function($day) {
                            return [
                                'date' => now()->subDays(30 - $day)->format('Y-m-d'),
                                'revenue' => rand(5000, 15000),
                                'orders' => rand(50, 150),
                                'avg_order' => rand(40, 100)
                            ];
                        })->values()
                    ],
                    'customers' => [
                        'total' => rand(5000, 10000),
                        'new_today' => rand(50, 200),
                        'growth' => rand(5, 20),
                        'segments' => [
                            ['name' => 'New', 'value' => rand(20, 30), 'color' => '#3B82F6'],
                            ['name' => 'Regular', 'value' => rand(40, 50), 'color' => '#10B981'],
                            ['name' => 'VIP', 'value' => rand(20, 30), 'color' => '#6366F1']
                        ],
                        'retention_rate' => rand(70, 90)
                    ],
                    'top_restaurants' => collect(range(1, 5))->map(function($index) {
                        $name = fake()->company();
                        return [
                            'name' => $name,
                            'logo' => "https://ui-avatars.com/api/?name=" . urlencode($name) . "&background=random",
                            'orders' => rand(100, 500),
                            'revenue' => rand(10000, 50000),
                            'rating' => round(rand(35, 50) / 10, 1),
                            'growth' => rand(-10, 30),
                            'popular_items' => rand(3, 8),
                            'avg_preparation_time' => rand(15, 45)
                        ];
                    })->values(),
                    'popular_items' => collect(range(1, 5))->map(function($index) {
                        return [
                            'name' => fake()->words(rand(2, 4), true),
                            'category' => collect(['Burgers', 'Pizza', 'Sushi', 'Salads', 'Desserts'])->random(),
                            'orders' => rand(50, 200),
                            'revenue' => rand(5000, 20000),
                            'rating' => round(rand(35, 50) / 10, 1),
                            'growth' => rand(-10, 30),
                            'in_stock' => rand(0, 1),
                            'price' => rand(10, 50)
                        ];
                    })->values(),
                    'metrics' => [
                        'avg_order_value' => [
                            'value' => rand(50, 150),
                            'growth' => rand(-5, 15)
                        ],
                        'avg_preparation_time' => [
                            'value' => rand(15, 45),
                            'growth' => rand(-10, 10)
                        ],
                        'order_completion_rate' => [
                            'value' => rand(85, 98),
                            'growth' => rand(-2, 5)
                        ],
                        'customer_satisfaction' => [
                            'value' => rand(85, 98),
                            'growth' => rand(-3, 8)
                        ]
                    ]
                ]
            ];

            return Inertia::render('Dashboard/Admin/Index', [
                'dashboardData' => $dashboardData
            ]);
        } catch (\Exception $e) {
            Log::error('Dashboard Error: ' . $e->getMessage());
            return back()->with('error', 'Error loading dashboard data');
        }
    }
}
