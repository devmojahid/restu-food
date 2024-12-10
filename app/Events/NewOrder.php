<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class NewOrder implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Order $order
    ) {}

    public function broadcastAs()
    {
        return 'NewOrder';
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("restaurant.{$this->order->restaurant_id}.orders")
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'order' => $this->order->load(['items.product', 'customer', 'restaurant']),
            'notification' => [
                'title' => 'New Order Received',
                'message' => "Order #{$this->order->order_number} received from {$this->order->customer->name}",
                'type' => 'new_order',
                'created_at' => now()->toISOString()
            ]
        ];
    }
} 