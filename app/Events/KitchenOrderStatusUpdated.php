<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class KitchenOrderStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $order;
    public $status;
    public $updatedBy;

    public function __construct($order, $status, $updatedBy)
    {
        $this->order = $order;
        $this->status = $status;
        $this->updatedBy = $updatedBy;
    }

    public function broadcastOn()
    {
        return [
            new Channel('kitchen'),
            new Channel('order.'.$this->order->id)
        ];
    }
} 