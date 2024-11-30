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

final class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $role = $user->roles->first();

        // Base data for all roles
        $data = [
            'userRole' => $role->name,
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ];

        // Add role-specific dashboard data
        switch ($role->name) {
            case 'Admin':
                $now = now();
                $thirtyDaysAgo = $now->copy()->subDays(30);
                
                $dailyStats = Order::selectRaw('
                    DATE(created_at) as date,
                    COUNT(*) as orders,
                    SUM(total) as revenue,
                    COUNT(DISTINCT user_id) as unique_customers,
                    SUM(total) / COUNT(*) as avg_order_value
                ')
                ->whereBetween('created_at', [$thirtyDaysAgo, $now])
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->map(function ($stat) {
                    $visitors = rand(500, 2000); // Replace with actual visitor data
                    $orders = $stat->orders;
                    
                    return [
                        'date' => $stat->date,
                        'orders' => $orders,
                        'revenue' => (float) $stat->revenue,
                        'visitors' => $visitors,
                        'conversion_rate' => round(($orders / $visitors) * 100, 2),
                        'unique_customers' => $stat->unique_customers,
                        'avg_order_value' => round($stat->avg_order_value, 2),
                        'new_customers' => rand(10, 50), // Replace with actual new customer data
                        'returning_customers' => $stat->unique_customers - rand(10, 50), // Replace with actual returning customer data
                    ];
                });

                $data['stats'] = [
                    'users' => User::count(),
                    'restaurants' => Restaurant::count(),
                    'orders' => Order::count(),
                    'blogs' => Blog::count(),
                    'recent_orders' => Order::with(['user', 'restaurant'])
                        ->latest()
                        ->take(5)
                        ->get(),
                    'recent_users' => User::latest()
                        ->take(5)
                        ->get(),
                    'analytics_data' => $dailyStats,
                    'performance_metrics' => [
                        'total_revenue' => $dailyStats->sum('revenue'),
                        'total_orders' => $dailyStats->sum('orders'),
                        'avg_order_value' => $dailyStats->avg('avg_order_value'),
                        'conversion_rate' => $dailyStats->avg('conversion_rate'),
                        'unique_customers' => $dailyStats->sum('unique_customers'),
                        'new_customers' => $dailyStats->sum('new_customers'),
                        'returning_customers' => $dailyStats->sum('returning_customers'),
                    ]
                ];
                break;

            case 'Restaurant':
                $restaurant = $user->restaurants()->first();
                $data['stats'] = [
                    'orders' => Order::where('restaurant_id', $restaurant?->id)->count(),
                    'revenue' => Order::where('restaurant_id', $restaurant?->id)
                        ->where('status', 'completed')
                        ->sum('total'),
                    'pending_orders' => Order::where('restaurant_id', $restaurant?->id)
                        ->where('status', 'pending')
                        ->count(),
                    'recent_orders' => Order::where('restaurant_id', $restaurant?->id)
                        ->with(['user'])
                        ->latest()
                        ->take(5)
                        ->get(),
                ];
                break;

            case 'Kitchen Staff':
                $kitchenService = new KitchenService();
                $data['stats'] = $kitchenService->getDashboardStats();
                break;

            case 'Delivery Personnel':
                $data['stats'] = [
                    'assigned_orders' => Order::where('delivery_person_id', $user->id)
                        ->whereIn('status', ['assigned', 'picked_up'])
                        ->count(),
                    'completed_orders' => Order::where('delivery_person_id', $user->id)
                        ->where('status', 'completed')
                        ->count(),
                    'recent_orders' => Order::where('delivery_person_id', $user->id)
                        ->with(['user', 'restaurant'])
                        ->latest()
                        ->take(5)
                        ->get(),
                ];
                break;

            default: // Customer
                $now = now();
                $thirtyDaysAgo = $now->copy()->subDays(30);
                
                $customerStats = Order::where('user_id', $user->id)
                    ->selectRaw('
                        DATE(created_at) as date,
                        COUNT(*) as orders,
                        SUM(total) as spent
                    ')
                    ->whereBetween('created_at', [$thirtyDaysAgo, $now])
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get();

                // Get recent activity
                $recentActivity = collect();
                
                // Add orders to activity
                $recentOrders = Order::where('user_id', $user->id)
                    ->latest()
                    ->take(5)
                    ->get()
                    ->map(function ($order) {
                        return [
                            'type' => 'order',
                            'icon' => 'ShoppingBag',
                            'description' => "Placed order #{$order->id} at {$order->restaurant->name}",
                            'created_at' => $order->created_at,
                        ];
                    });
                $recentActivity = $recentActivity->concat($recentOrders);

                // Add reviews to activity
                $recentReviews = Review::where('user_id', $user->id)
                    ->latest()
                    ->take(5)
                    ->get()
                    ->map(function ($review) {
                        return [
                            'type' => 'review',
                            'icon' => 'Star',
                            'description' => "Reviewed {$review->restaurant->name}",
                            'created_at' => $review->created_at,
                        ];
                    });
                $recentActivity = $recentActivity->concat($recentReviews);

                // Sort all activity by date
                $recentActivity = $recentActivity->sortByDesc('created_at')->values();

                $data['stats'] = [
                    'total_orders' => Order::where('user_id', $user->id)->count(),
                    'favorite_restaurants_count' => $user->favoriteRestaurants()->count(),
                    'avg_delivery_time' => 30, // Replace with actual calculation
                    'avg_rating' => 4.5, // Replace with actual calculation
                    'rewards_points' => $user->rewards_points ?? 0,
                    'recent_orders' => Order::where('user_id', $user->id)
                        ->with(['restaurant'])
                        ->latest()
                        ->take(5)
                        ->get(),
                    'favorite_restaurants' => $user->favoriteRestaurants()
                        ->with(['cuisine', 'ratings'])
                        ->take(4)
                        ->get(),
                    'analytics_data' => $customerStats,
                    'recent_activity' => $recentActivity,
                    'performance_metrics' => [
                        'order_frequency' => $customerStats->avg('orders'),
                        'avg_order_value' => $customerStats->avg('spent'),
                        'total_spent' => $customerStats->sum('spent'),
                        'orders_this_month' => $customerStats->sum('orders')
                    ]
                ];
                break;
        }

        // Add performance metrics data
        $data['performance_metrics'] = [
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

        // Add real-time stats data
        $data['realtime_stats'] = [
            'orders' => [
                'current' => Order::whereDate('created_at', today())->count(),
                'trend' => Order::selectRaw('HOUR(created_at) as hour, COUNT(*) as count')
                    ->whereDate('created_at', today())
                    ->groupBy('hour')
                    ->get()
                    ->pluck('count', 'hour')
                    ->toArray()
            ],
            'revenue' => [
                'current' => Order::whereDate('created_at', today())->sum('total'),
                'trend' => Order::selectRaw('HOUR(created_at) as hour, SUM(total) as total')
                    ->whereDate('created_at', today())
                    ->groupBy('hour')
                    ->get()
                    ->pluck('total', 'hour')
                    ->toArray()
            ]
        ];

        // Render the appropriate dashboard view based on role
        return Inertia::render("Dashboard/{$role->name}/Index", $data);
    }
}
