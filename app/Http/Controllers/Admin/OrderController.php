<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\Admin\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

    public function create(Request $request)
    {
        try {
            $request->validate([
                'dish_id' => 'required|exists:products,id',
                'quantity' => 'required|integer|min:1',
                'special_instructions' => 'nullable|string',
                'is_test_order' => 'boolean'
            ]);

            // Get the product details with restaurant relationship
            $product = Product::with('restaurant')->findOrFail($request->dish_id);
            
            // Create order data
            $orderData = [
                'user_id' => Auth::id(),
                'restaurant_id' => $product->restaurant_id,
                'order_number' => 'ORD-' . strtoupper(uniqid()),
                'items' => [
                    [
                        'product_id' => $product->id,
                        'quantity' => $request->quantity,
                        'unit_price' => $product->getCurrentPrice(),
                        'special_instructions' => $request->special_instructions
                    ]
                ],
                'subtotal' => $product->getCurrentPrice() * $request->quantity,
                'tax' => ($product->getCurrentPrice() * $request->quantity) * 0.1,
                'delivery_fee' => 5.00,
                'total' => ($product->getCurrentPrice() * $request->quantity) * 1.1 + 5.00,
                'payment_method' => 'card',
                'is_takeaway' => false,
                'status' => 'pending',
                'is_test_order' => $request->is_test_order ?? false
            ];

            // Get or create guest user if not authenticated
            $user = Auth::user() ?? User::firstOrCreate(
                ['email' => 'guest@example.com'],
                [
                    'name' => 'Guest User',
                    'password' => bcrypt(uniqid()),
                    'role' => 'customer'
                ]
            );

            // Create the order using the service
            $order = $this->orderService->createOrder($orderData, $user);

            // Return JSON response for XHR requests
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Order created successfully',
                    'order' => $order->load(['items.product', 'customer', 'restaurant'])
                ]);
            }

            // Return redirect with flash data for normal requests
            return back()->with([
                'success' => true,
                'message' => 'Order created successfully',
                'order' => $order->load(['items.product', 'customer', 'restaurant'])
            ]);

        } catch (\Exception $e) {
            Log::error('Order creation failed: ' . $e->getMessage(), [
                'request' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);

            dd($e->getMessage());

            if ($request->wantsJson()) {
                return response()->json([
                    'error' => true,
                    'message' => 'Failed to create order. Please try again.'
                ], 422);
            }

            return back()->with('error', 'Failed to create order. Please try again.');
        }
    }
} 