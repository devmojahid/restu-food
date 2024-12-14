<?php

declare(strict_types=1);

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

final class DeliveryDeviceUpdate implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $deliveryId,
        public string $deviceId,
        public string $role,
        public array $data
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("delivery.{$this->deliveryId}.device.{$this->deviceId}"),
            new PrivateChannel("delivery.{$this->deliveryId}")
        ];
    }

    public function broadcastAs(): string
    {
        return 'device.update';
    }
} 