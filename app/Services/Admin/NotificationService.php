<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\RestaurantNotification;
use App\Events\NewOrder;

final class NotificationService
{
    public function createOrderNotification(Order $order): void
    {
        // Create persistent notification
        $notification = RestaurantNotification::create([
            'restaurant_id' => $order->restaurant_id,
            'title' => 'New Order Received',
            'message' => "Order #{$order->order_number} received from {$order->customer->name}",
            'type' => 'new_order',
            'data' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'total' => $order->total,
                'items_count' => $order->items->count()
            ]
        ]);

        // Broadcast the notification
        broadcast(new NewOrder($order))->toOthers();
    }
} 