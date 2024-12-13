<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\Admin\DeliveryTrackingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class DeliveryTrackingController extends Controller
{
    public function __construct(
        private readonly DeliveryTrackingService $trackingService
    ) {}

    public function show(int $orderId): Response
    {
        // $order = Order::with(['delivery.driver', 'restaurant'])
        //     ->where('id', $orderId)
        //     ->first();

        // if (!$order) {
        //     throw new NotFoundHttpException('Order not found');
        // }

        // Add dummy data for development
        $order = Order::find(2);

        $order = $this->trackingService->getDummyOrderData($order);
       
        if (!$order->delivery) {
            return Inertia::render('Dashboard/Customer/DeliveryTracking', [
                'order' => $order,
                'error' => 'No delivery information available for this order'
            ]);
        }

        return Inertia::render('Dashboard/Customer/DeliveryTracking', [
            'order' => $order,
            'deliveryData' => [
                'history' => $this->trackingService->getDummyLocationHistory($order->delivery->id),
                'stats' => $this->trackingService->getDummyDeliveryStats($order->delivery->id)
            ]
        ]);
    }
} 