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

        $data = [
            'userRole' => $role->name,
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ];

        // Add role-specific dashboard data
        // switch ($role->name) {
        //     case 'Admin':
        //         $data['stats'] = [
        //             'users' => User::count(),
        //             'restaurants' => Restaurant::count(),
        //             'orders' => Order::count(),
        //             'blogs' => Blog::count(),
        //         ];
        //         break;
        //     case 'Branch Manager':
        //         $data['stats'] = [
        //             'orders' => Order::where('restaurant_id', $user->restaurant_id)->count(),
        //             'revenue' => Order::where('restaurant_id', $user->restaurant_id)
        //                 ->where('status', 'completed')
        //                 ->sum('total'),
        //         ];
        //         break;
        //     case 'Kitchen Staff':
        //         $data['stats'] = [
        //             'pending_orders' => Order::where('restaurant_id', $user->restaurant_id)
        //                 ->where('status', 'pending')
        //                 ->count(),
        //         ];
        //         break;
        //     case 'Delivery Personnel':
        //         $data['stats'] = [
        //             'assigned_orders' => Order::where('delivery_person_id', $user->id)
        //                 ->whereIn('status', ['assigned', 'picked_up'])
        //                 ->count(),
        //         ];
        //         break;
        //     default:
        //         $data['stats'] = [
        //             'orders' => Order::where('user_id', $user->id)->count(),
        //         ];
        // }

        return Inertia::render('Admin/Dashboard/Index', $data);
    }
}
