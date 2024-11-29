<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Order;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

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
                $restaurant = $user->restaurant;
                $data['stats'] = [
                    'pending_orders' => Order::where('restaurant_id', $restaurant?->id)
                        ->where('status', 'pending')
                        ->count(),
                    'processing_orders' => Order::where('restaurant_id', $restaurant?->id)
                        ->where('status', 'processing')
                        ->count(),
                    'recent_orders' => Order::where('restaurant_id', $restaurant?->id)
                        ->whereIn('status', ['pending', 'processing'])
                        ->with(['user'])
                        ->latest()
                        ->take(5)
                        ->get(),
                ];
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
                $data['stats'] = [
                    'orders' => Order::where('user_id', $user->id)->count(),
                    'recent_orders' => Order::where('user_id', $user->id)
                        ->with(['restaurant'])
                        ->latest()
                        ->take(5)
                        ->get(),
                ];
        }

        // Render the appropriate dashboard view based on role
        return Inertia::render("Dashboard/{$role->name}/Index", $data);
    }
}
