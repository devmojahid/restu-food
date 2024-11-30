<?php

namespace App\Services\Dashboard;

use Carbon\Carbon;

class AdminDashboardService
{
    public function getData()
    {
        return [
            'summary_stats' => $this->getSummaryStats(),
            'revenue_overview' => $this->getRevenueOverview(),
            'recent_orders' => $this->getRecentOrders(),
            'performance_analytics' => $this->getPerformanceAnalytics(),
        ];
    }

    private function getSummaryStats()
    {
        return [
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
        ];
    }

    private function getRevenueOverview()
    {
        return [
            'today' => $this->getDailyRevenue(),
            'weekly' => $this->getWeeklyRevenue(),
            'monthly' => $this->getMonthlyRevenue()
        ];
    }

    private function getDailyRevenue()
    {
        return [
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
        ];
    }

    private function getRecentOrders()
    {
        return collect(range(1, 10))->map(function($index) {
            return [
                'id' => "ORD-" . str_pad((string)$index, 5, '0', STR_PAD_LEFT),
                'customer' => [
                    'name' => fake()->name(),
                    'email' => fake()->email(),
                    'avatar' => "https://ui-avatars.com/api/?name=" . urlencode(fake()->name()),
                ],
                'total' => rand(50, 300),
                'status' => collect(['pending', 'processing', 'completed'])->random(),
                'created_at' => now()->subMinutes(rand(1, 1440))->format('Y-m-d H:i:s'),
            ];
        })->values();
    }

    private function getPerformanceAnalytics()
    {
        return [
            'orders' => [
                'total' => rand(1500, 3000),
                'growth' => rand(5, 25),
                'chart_data' => collect(range(1, 24))->map(function($hour) {
                    return [
                        'hour' => sprintf('%02d:00', $hour - 1),
                        'orders' => rand(20, 100),
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
                    ];
                })->values()
            ],
        ];
    }

    private function getWeeklyRevenue()
    {
        return [
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
        ];
    }

    private function getMonthlyRevenue()
    {
        return [
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
        ];
    }

    // Add other private methods for weekly, monthly revenue etc.
} 