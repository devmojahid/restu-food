<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Dashboard\AdminDashboardService;
use App\Services\Dashboard\RestaurantDashboardService;
use App\Services\Dashboard\CustomerDashboardService;
use App\Services\Dashboard\KitchenDashboardService;
use App\Services\Dashboard\DeliveryDashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller
{
    public function __construct(
        private readonly AdminDashboardService $adminDashboardService,
        private readonly RestaurantDashboardService $restaurantDashboardService,
        private readonly CustomerDashboardService $customerDashboardService,
        private readonly KitchenDashboardService $kitchenDashboardService,
        private readonly DeliveryDashboardService $deliveryDashboardService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $role = $user->roles->first();

        // Get the appropriate dashboard service based on role
        $dashboardData = match ($role->name) {
            'Customer' => app(CustomerDashboardService::class)->getData($user->id),
            'Restaurant' => app(RestaurantDashboardService::class)->getData($user->id),
            'Kitchen' => app(KitchenDashboardService::class)->getData($user->id),
            'Delivery' => app(DeliveryDashboardService::class)->getData($user->id),
            default => app(AdminDashboardService::class)->getData(),
        };

        return Inertia::render("Dashboard/{$role->name}/Index", [
            'userRole' => $role->name,
            'permissions' => $user->getAllPermissions()->pluck('name'),
            'stats' => $dashboardData // Make sure this is passed correctly
        ]);
    }

    private function getPerformanceMetrics(): array
    {
        return [
            'customer_satisfaction' => [
                'current' => 98,
                'previous' => 96,
                'target' => 99,
                'trend' => [65, 74, 85, 82, 90, 95, 98]
            ],
            'avg_order_time' => [
                'current' => 24,
                'previous' => 29,
                'target' => 20,
                'trend' => [30, 28, 26, 24, 25, 24, 24]
            ],
            'revenue_per_order' => [
                'current' => 42.50,
                'previous' => 39.30,
                'target' => 45.00,
                'trend' => [35, 38, 40, 39, 41, 42, 42.5]
            ],
            'completion_rate' => [
                'current' => 95,
                'previous' => 94,
                'target' => 98,
                'trend' => [90, 92, 93, 94, 94, 95, 95]
            ]
        ];
    }

    private function getRealtimeStats(): array
    {
        return [
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
            ]
        ];
    }
}
