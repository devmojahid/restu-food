<?php

declare(strict_types=1);

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

final class DeliveryStatusUpdated implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $deliveryId,
        public int $orderId,
        public string $status,
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
        return 'status.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'delivery_id' => $this->deliveryId,
            'order_id' => $this->orderId,
            'status' => $this->status,
            'metadata' => $this->metadata,
            'timestamp' => now()->timestamp
        ];
    }
} 