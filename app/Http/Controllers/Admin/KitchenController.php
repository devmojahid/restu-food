<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Events\KitchenOrderStatusUpdated;
use App\Services\Admin\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

final class KitchenController extends Controller
{
    public function __construct(
        private readonly OrderService $orderService
    ) {}

    public function index(): Response
    {
        $orders = Order::with(['customer', 'items.product', 'restaurant'])
            ->where('restaurant_id', Auth::user()->restaurant_id)
            ->whereIn('status', ['pending', 'preparing'])
            ->latest()
            ->get();

        return Inertia::render('Admin/Kitchen/Index', [
            'orders' => $orders
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:preparing,completed,cancelled'
            ]);

            $order = $this->orderService->updateOrderStatus(
                $order,
                $validated['status']
            );

            // Broadcast to kitchen channel
            broadcast(new KitchenOrderStatusUpdated(
                $order,
                $validated['status'],
                Auth::user()
            ))->toOthers();

            return response()->json([
                'success' => true,
                'message' => 'Order status updated successfully',
                'order' => $order
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order status'
            ], 500);
        }
    }
} 