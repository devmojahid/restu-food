<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class NewOrder implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly Order $order
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('notifications'),
            new PrivateChannel("restaurant.{$this->order->restaurant_id}"),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'order' => [
                'id' => $this->order->id,
                'total' => $this->order->total,
                'status' => $this->order->status,
                'customer' => [
                    'name' => $this->order->user->name,
                ],
            ],
        ];
    }
} 