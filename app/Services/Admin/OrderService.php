<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Events\NewOrder;
use App\Events\OrderStatusUpdated;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Product;

final class OrderService
{
    public function createOrder(array $data, User $customer): Order
    {
        try {
            Log::info('Creating order with data:', ['data' => $data]);

            return DB::transaction(function () use ($data, $customer) {
                // Create the order
                $order = Order::create([
                    'user_id' => $data['user_id'] ?? $customer->id,
                    'customer_id' => $customer->id,
                    'restaurant_id' => $data['restaurant_id'],
                    'order_number' => $data['order_number'],
                    'subtotal' => $data['subtotal'],
                    'tax' => $data['tax'],
                    'delivery_fee' => $data['delivery_fee'],
                    'total' => $data['total'],
                    'status' => $data['status'] ?? 'pending',
                    'payment_status' => $data['payment_status'] ?? 'pending',
                    'payment_method' => $data['payment_method'],
                    'is_takeaway' => $data['is_takeaway'] ?? false,
                    'notes' => $data['notes'] ?? null,
                    'delivery_address' => $data['delivery_address'] ?? null,
                    'delivery_latitude' => $data['delivery_latitude'] ?? null,
                    'delivery_longitude' => $data['delivery_longitude'] ?? null,
                    'special_instructions' => $data['special_instructions'] ?? null,
                    'estimated_delivery_time' => $this->calculateEstimatedDeliveryTime(),
                    'is_test_order' => $data['is_test_order'] ?? false,
                ]);

                Log::info('Order created:', ['order_id' => $order->id]);

                // Create order items
                foreach ($data['items'] as $item) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'subtotal' => $item['quantity'] * $item['unit_price'],
                        'special_instructions' => $item['special_instructions'] ?? null,
                    ]);
                }

                Log::info('Order items created for order:', ['order_id' => $order->id]);

                // Load relationships for broadcasting
                $order->load(['items.product', 'customer', 'restaurant']);

                // Broadcast new order event
                broadcast(new NewOrder($order));

                return $order;
            });
        } catch (\Exception $e) {
            Log::error('Order creation failed: ' . $e->getMessage(), [
                'data' => $data,
                'customer_id' => $customer->id,
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public function updateOrderStatus(Order $order, string $status, ?string $reason = null): Order
    {
        try {
            DB::transaction(function () use ($order, $status, $reason) {
                $order->update([
                    'status' => $status,
                    'notes' => $reason ? $order->notes . "\nStatus changed to {$status}: {$reason}" : $order->notes
                ]);

                // Broadcast status update
                broadcast(new OrderStatusUpdated($order))->toOthers();
            });

            return $order->fresh();
        } catch (\Exception $e) {
            Log::error('Order status update failed: ' . $e->getMessage());
            throw $e;
        }
    }

    public function assignDeliveryPerson(Order $order, User $deliveryPerson): Order
    {
        try {
            return DB::transaction(function () use ($order, $deliveryPerson) {
                $order->update([
                    'delivery_person_id' => $deliveryPerson->id,
                    'status' => 'out_for_delivery'
                ]);

                // Broadcast assignment event
                broadcast(new OrderDeliveryAssigned($order))->toOthers();

                return $order->fresh();
            });
        } catch (\Exception $e) {
            Log::error('Delivery person assignment failed: ' . $e->getMessage());
            throw $e;
        }
    }

    private function generateOrderNumber(): string
    {
        $prefix = 'ORD';
        $timestamp = now()->format('Ymd');
        $random = str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT);
        
        return "{$prefix}-{$timestamp}-{$random}";
    }

    private function calculateEstimatedDeliveryTime(): string
    {
        // Add logic to calculate based on distance, traffic, etc.
        return now()->addMinutes(45)->toDateTimeString();
    }
} 