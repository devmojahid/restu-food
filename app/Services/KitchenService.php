<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\Order;
use Illuminate\Support\Collection;

class KitchenService
{
    public function getDashboardStats(): array
    {
        $now = Carbon::now();
        $today = $now->startOfDay();

        return [
            'pending_orders_count' => $this->getPendingOrdersCount(),
            'processing_orders_count' => $this->getProcessingOrdersCount(),
            'completed_orders_count' => $this->getCompletedOrdersCount(),
            'delayed_orders_count' => $this->getDelayedOrdersCount(),
            'analytics_data' => $this->getAnalyticsData(),
            'priority_alerts' => $this->getPriorityAlerts(),
            'kitchen_status' => $this->getKitchenStatus(),
            'pending_orders' => $this->getPendingOrders(),
            'processing_orders' => $this->getProcessingOrders(),
            'metrics' => $this->getMetrics(),
        ];
    }

    private function getPendingOrdersCount(): int
    {
        return Order::where('status', 'pending')
            ->whereDate('created_at', today())
            ->count();
    }

    private function getProcessingOrdersCount(): int
    {
        return Order::where('status', 'processing')
            ->whereDate('created_at', today())
            ->count();
    }

    private function getCompletedOrdersCount(): int
    {
        return Order::where('status', 'completed')
            ->whereDate('created_at', today())
            ->count();
    }

    private function getDelayedOrdersCount(): int
    {
        return Order::where('status', 'processing')
            ->where('estimated_completion_time', '<', now())
            ->count();
    }

    private function getPendingOrders(): Collection
    {
        return Order::where('status', 'pending')
            ->with(['items', 'customer'])
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'table_number' => $order->table_number,
                    'elapsed_time' => Carbon::parse($order->created_at)->diffInMinutes(),
                    'estimated_time' => 30, // Replace with actual calculation
                    'is_priority' => $order->is_priority,
                    'status' => $order->status,
                    'items' => $order->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'name' => $item->name,
                            'quantity' => $item->quantity,
                            'special_instructions' => $item->special_instructions,
                            'preparation_time' => $item->preparation_time,
                        ];
                    }),
                ];
            });
    }

    private function getAnalyticsData(): array
    {
        // Generate dummy data for charts
        $volume = collect(range(0, 23))->map(function ($hour) {
            return [
                'time' => Carbon::today()->addHours($hour)->format('Y-m-d H:i:s'),
                'orders' => rand(5, 30),
                'completion_rate' => rand(85, 98),
            ];
        });

        $prep_times = collect(range(0, 23))->map(function ($hour) {
            return [
                'time' => Carbon::today()->addHours($hour)->format('Y-m-d H:i:s'),
                'prep_time' => rand(15, 45),
            ];
        });

        return [
            'volume' => $volume,
            'prep_times' => $prep_times,
            'metrics' => [
                'efficiency_score' => rand(85, 95),
                'avg_wait_time' => rand(20, 35),
                'staff_utilization' => rand(75, 90),
            ],
        ];
    }

    private function getPriorityAlerts(): array
    {
        return [
            [
                'id' => 1,
                'message' => 'VIP Order #123 requires immediate attention',
                'time' => Carbon::now()->subMinutes(5)->format('Y-m-d H:i:s'),
                'level' => 'high',
            ],
            [
                'id' => 2,
                'message' => 'Order #456 is approaching target time',
                'time' => Carbon::now()->subMinutes(10)->format('Y-m-d H:i:s'),
                'level' => 'medium',
            ],
            [
                'id' => 3,
                'message' => 'Special dietary requirements for Order #789',
                'time' => Carbon::now()->subMinutes(15)->format('Y-m-d H:i:s'),
                'level' => 'info',
            ],
        ];
    }

    private function getKitchenStatus(): array
    {
        return [
            [
                'name' => 'Grill Station',
                'status' => 'Active',
                'staff' => 2,
                'load' => 75,
            ],
            [
                'name' => 'Cold Kitchen',
                'status' => 'Active',
                'staff' => 1,
                'load' => 45,
            ],
            [
                'name' => 'Hot Kitchen',
                'status' => 'Active',
                'staff' => 3,
                'load' => 85,
            ],
            [
                'name' => 'Dessert Station',
                'status' => 'Active',
                'staff' => 1,
                'load' => 30,
            ],
        ];
    }

    private function getProcessingOrders(): Collection
    {
        // Dummy processing orders with detailed steps
        return collect([
            [
                'id' => 101,
                'table_number' => 5,
                'elapsed_time' => 15,
                'estimated_time' => 30,
                'is_priority' => true,
                'status' => 'in_progress',
                'steps' => [
                    [
                        'name' => 'Appetizer Preparation',
                        'station' => 'coldline',
                        'status' => 'completed',
                        'progress' => 100,
                        'temperature' => null,
                    ],
                    [
                        'name' => 'Main Course Cooking',
                        'station' => 'grill',
                        'status' => 'in_progress',
                        'progress' => 60,
                        'temperature' => '165',
                        'is_critical' => true,
                    ],
                    [
                        'name' => 'Sauce Preparation',
                        'station' => 'hotline',
                        'status' => 'pending',
                        'progress' => 0,
                        'temperature' => null,
                    ],
                ],
            ],
            // Add more dummy orders...
        ]);
    }

    private function getMetrics(): array
    {
        return [
            'efficiency_score' => 92,
            'avg_wait_time' => 25,
            'staff_utilization' => 85,
            'order_accuracy' => 98,
            'customer_satisfaction' => 4.5,
            'peak_hours' => [
                'lunch' => ['11:00', '14:00'],
                'dinner' => ['18:00', '21:00'],
            ],
            'staff_performance' => [
                'total_staff' => 8,
                'active_staff' => 6,
                'efficiency_rating' => 4.2,
            ],
        ];
    }

    private function calculateEstimatedTime(Order $order): int
    {
        // Add logic to calculate estimated preparation time based on:
        // - Number of items
        // - Type of dishes
        // - Kitchen load
        // - Historical data
        return 30; // Default 30 minutes
    }

    private function getKitchenLoad(): float
    {
        $activeOrders = Order::whereIn('status', ['pending', 'processing'])->count();
        $maxCapacity = 50; // Configure based on kitchen capacity
        return min(($activeOrders / $maxCapacity) * 100, 100);
    }

    private function getStaffEfficiency(): float
    {
        // Add logic to calculate staff efficiency based on:
        // - Orders completed on time
        // - Average preparation time
        // - Quality checks
        return 85.5; // Example return
    }

    // Add more helper methods for other stats...
} 