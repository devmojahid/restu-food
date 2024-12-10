<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\Admin\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

final class OrderController extends Controller
{
    public function __construct(
        private readonly OrderService $orderService
    ) {}

    public function index(): Response
    {
        $orders = Order::with(['customer', 'restaurant', 'items'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:approved,rejected,preparing,completed,cancelled',
                'reason' => 'nullable|string|max:500'
            ]);

            $order = $this->orderService->updateOrderStatus(
                $order,
                $validated['status'],
                $validated['reason'] ?? null
            );

            return response()->json([
                'success' => true,
                'message' => 'Order status updated successfully',
                'order' => $order
            ]);
        } catch (\Exception $e) {
            Log::error('Order status update failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order status'
            ], 500);
        }
    }

    public function assignDelivery(Request $request, Order $order)
    {
        try {
            $validated = $request->validate([
                'delivery_person_id' => 'required|exists:users,id'
            ]);

            $deliveryPerson = User::findOrFail($validated['delivery_person_id']);
            
            $order = $this->orderService->assignDeliveryPerson($order, $deliveryPerson);

            return response()->json([
                'success' => true,
                'message' => 'Delivery person assigned successfully',
                'order' => $order
            ]);
        } catch (\Exception $e) {
            Log::error('Delivery assignment failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to assign delivery person'
            ], 500);
        }
    }
} 