<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\Admin\DeliveryTrackingService;
use App\Services\Admin\DeliverySimulatorService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Http\JsonResponse;

final class DeliveryTrackingController extends Controller
{
    public function __construct(
        private readonly DeliveryTrackingService $trackingService,
        private readonly DeliverySimulatorService $simulatorService
    ) {}

    public function show(int $orderId): Response
    {
        // Create dummy order data for testing
        $dummyOrder = (object)[
            'id' => $orderId,
            'order_number' => 'ORD-' . str_pad((string) $orderId, 6, '0', STR_PAD_LEFT),
            'status' => 'in_transit',
            'delivery' => (object)[
                'id' => 1,
                'driver' => (object)[
                    'id' => 1,
                    'name' => 'John Driver',
                    'phone' => '+1234567890',
                    'rating' => 4.8,
                    'total_deliveries' => 1250,
                ],
                'current_location' => [
                    'lat' => 23.8153,
                    'lng' => 90.4175
                ],
                'status' => 'in_transit',
                'pickup_time' => now()->subMinutes(20),
                'estimated_arrival' => now()->addMinutes(15),
            ],
            'restaurant' => (object)[
                'id' => 1,
                'name' => 'Tasty Restaurant',
                'address' => '123 Restaurant St',
                'phone' => '+1987654321',
                'location' => [
                    'lat' => 23.8203,
                    'lng' => 90.4225
                ]
            ],
            'delivery_location' => [
                'lat' => 23.8303,
                'lng' => 90.4325
            ],
            'delivery_address' => '456 Customer Ave',
            'delivery_instructions' => 'Ring doorbell twice',
            'estimated_delivery_time' => '30 minutes',
            'created_at' => now()->subHours(1),
            'confirmed_at' => now()->subMinutes(55),
            'preparing_at' => now()->subMinutes(40),
            'ready_at' => now()->subMinutes(25),
            'picked_up_at' => now()->subMinutes(20),
            'items' => [
                [
                    'name' => 'Chicken Burger',
                    'quantity' => 2,
                    'special_instructions' => 'Extra cheese'
                ],
                [
                    'name' => 'French Fries',
                    'quantity' => 1,
                    'special_instructions' => 'Extra crispy'
                ]
            ]
        ];

        // Convert dummy order to Order model instance for consistency
        $order = new Order();
        foreach (get_object_vars($dummyOrder) as $key => $value) {
            $order->$key = $value;
        }

        // Generate route for simulation
        $route = $this->trackingService->generateDeliveryRoute(
            $dummyOrder->restaurant->location,
            $dummyOrder->delivery_location
        );

        // Start location simulation
        $this->simulatorService->startSimulation(
            deliveryId: $dummyOrder->delivery->id,
            orderId: $dummyOrder->id,
            route: $route
        );

        // Add dummy delivery data
        $deliveryData = [
            'history' => $this->trackingService->getDummyLocationHistory($order->delivery->id),
            'stats' => $this->trackingService->getDummyDeliveryStats($order->delivery->id)
        ];

        return Inertia::render('Dashboard/Customer/DeliveryTracking', [
            'order' => $order,
            'deliveryData' => $deliveryData
        ]);
    }

    public function pairDevice(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'delivery_id' => 'required|integer',
            'device_id' => 'required|string',
            'role' => 'required|in:customer,driver'
        ]);

        $this->simulatorService->pairDevice(
            deliveryId: $validated['delivery_id'],
            deviceId: $validated['device_id'],
            role: $validated['role']
        );

        return response()->json(['message' => 'Device paired successfully']);
    }

    public function unpairDevice(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'delivery_id' => 'required|integer',
            'device_id' => 'required|string'
        ]);

        $this->simulatorService->unpairDevice(
            deliveryId: $validated['delivery_id'],
            deviceId: $validated['device_id']
        );

        return response()->json(['message' => 'Device unpaired successfully']);
    }

    public function getActiveDevices(int $deliveryId): JsonResponse
    {
        $devices = $this->simulatorService->getActiveDevices($deliveryId);
        return response()->json(['devices' => $devices]);
    }
} 