<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class DeliveryLocationUpdated implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public function __construct(
        public array $location,
        public int $deliveryId,
        public int $orderId,
        public array $metadata = []
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('order.'.$this->orderId),
            new PrivateChannel('delivery.'.$this->deliveryId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'location.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'location' => $this->location,
            'delivery_id' => $this->deliveryId,
            'order_id' => $this->orderId,
            'metadata' => $this->metadata,
            'timestamp' => now()->timestamp
        ];
    }
} 