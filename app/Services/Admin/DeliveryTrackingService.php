<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\Delivery;
use App\Models\DeliveryLocation;
use App\Models\Order;
use App\Events\DeliveryLocationUpdated;
use App\Events\DeliveryStatusUpdated;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

final class DeliveryTrackingService
{
    public function __construct(
        private readonly DeliveryService $deliveryService
    ) {}

    public function updateLocation(int $deliveryId, array $location, array $metadata = []): void
    {
        $delivery = Delivery::with(['order', 'driver'])->findOrFail($deliveryId);
        
        // Update current location
        $delivery->update([
            'current_location' => $location,
            'last_location_update' => now(),
        ]);

        // Store location history
        DeliveryLocation::create([
            'delivery_id' => $deliveryId,
            'latitude' => $location['lat'],
            'longitude' => $location['lng'],
            'recorded_at' => now(),
        ]);

        // Calculate ETA and update metadata
        $eta = $this->calculateETA($location, $delivery->order->delivery_location);
        if ($eta) {
            $metadata['estimated_time'] = $eta;
        }

        // Broadcast location update
        broadcast(new DeliveryLocationUpdated(
            location: $location,
            deliveryId: $deliveryId,
            orderId: $delivery->order_id,
            metadata: array_merge($metadata, [
                'updated_at' => now()->toIso8601String(),
                'driver_name' => $delivery->driver->name,
                'driver_phone' => $delivery->driver->phone,
            ])
        ))->toOthers();

        // Clear cache
        $this->clearLocationCache($deliveryId);
    }

    public function updateDeliveryStatus(int $deliveryId, string $status): void
    {
        $delivery = Delivery::findOrFail($deliveryId);
        
        $delivery->update([
            'status' => $status,
            'status_updated_at' => now(),
        ]);

        // Update order status if needed
        if ($status === 'delivered') {
            $delivery->order->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);
        }

        broadcast(new DeliveryStatusUpdated(
            deliveryId: $deliveryId,
            orderId: $delivery->order_id,
            status: $status,
            metadata: [
                'updated_at' => now()->toIso8601String(),
                'location' => $delivery->current_location,
            ]
        ))->toOthers();
    }

    public function getLocationHistory(int $deliveryId, ?int $limit = null): Collection
    {
        // For development, return dummy data
        return collect($this->getDummyLocations())
            ->when($limit, fn($collection) => $collection->take($limit))
            ->map(function ($location) {
                return (object) $location;
            });
    }

    public function getActiveDeliveries(): Collection
    {
        return Cache::remember('active_deliveries', 300, function () {
            return Delivery::with(['order', 'driver'])
                ->whereIn('status', ['assigned', 'picked_up', 'in_transit'])
                ->get();
        });
    }

    private function calculateETA(array $origin, array $destination): ?string
    {
        try {
            $response = Http::get('https://maps.googleapis.com/maps/api/distancematrix/json', [
                'origins' => "{$origin['lat']},{$origin['lng']}",
                'destinations' => "{$destination['lat']},{$destination['lng']}",
                'key' => config('services.google.maps_api_key'),
                'mode' => 'driving',
                'traffic_model' => 'best_guess',
                'departure_time' => 'now',
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['rows'][0]['elements'][0]['duration_in_traffic']['text'] ?? 
                       $data['rows'][0]['elements'][0]['duration']['text'] ?? null;
            }
        } catch (\Exception $e) {
            \Log::error('Failed to calculate ETA: ' . $e->getMessage());
        }

        return null;
    }

    private function clearLocationCache(int $deliveryId): void
    {
        Cache::tags(['delivery_locations'])->forget("delivery:{$deliveryId}:location");
        Cache::forget('active_deliveries');
    }

    public function getDeliveryStats(int $deliveryId): array
    {
        // For development, return dummy stats
        return [
            'total_distance' => 5.2, // kilometers
            'total_time' => 45, // minutes
            'average_speed' => 25.5, // km/h
            'stops_made' => collect([
                [
                    'latitude' => 23.8153,
                    'longitude' => 90.4175,
                    'duration' => '5 minutes',
                    'timestamp' => now()->subMinutes(20)->toIso8601String(),
                ]
            ]),
            'status_history' => collect([
                [
                    'status' => 'assigned',
                    'timestamp' => now()->subMinutes(45)->toIso8601String(),
                ],
                [
                    'status' => 'picked_up',
                    'timestamp' => now()->subMinutes(30)->toIso8601String(),
                ],
                [
                    'status' => 'in_transit',
                    'timestamp' => now()->subMinutes(25)->toIso8601String(),
                ]
            ]),
        ];
    }

    private function getDummyLocations(): array
    {
        return [
            [
                'id' => 1,
                'delivery_id' => 2,
                'latitude' => 23.8103,
                'longitude' => 90.4125,
                'recorded_at' => now()->subMinutes(30),
                'created_at' => now()->subMinutes(30),
                'updated_at' => now()->subMinutes(30),
            ],
            [
                'id' => 2,
                'delivery_id' => 2,
                'latitude' => 23.8153,
                'longitude' => 90.4175,
                'recorded_at' => now()->subMinutes(20),
                'created_at' => now()->subMinutes(20),
                'updated_at' => now()->subMinutes(20),
            ],
            [
                'id' => 3,
                'delivery_id' => 2,
                'latitude' => 23.8203,
                'longitude' => 90.4225,
                'recorded_at' => now()->subMinutes(10),
                'created_at' => now()->subMinutes(10),
                'updated_at' => now()->subMinutes(10),
            ],
        ];
    }

    public function getDummyOrderData(Order $order): Order
    {
        // Basic order info
        // $order->order_number = 'ORD-' . str_pad($order->id, 6, '0', STR_PAD_LEFT);
        $order->order_number = 'ORD-' . str_pad((string) $order->id, 6, '0', STR_PAD_LEFT);
        $order->total = 45.99;
        $order->status = 'in_transit';
        $order->payment_method = 'Credit Card';
        $order->transaction_id = 'TXN-' . rand(100000, 999999);

        // Timestamps for timeline
        $order->created_at = now()->subHours(2);
        $order->payment_confirmed_at = now()->subHours(1)->subMinutes(55);
        $order->confirmed_at = now()->subHours(1)->subMinutes(50);
        $order->preparing_at = now()->subHours(1)->subMinutes(40);
        $order->driver_assigned_at = now()->subHours(1)->subMinutes(30);
        $order->picked_up_at = now()->subHours(1)->subMinutes(20);
        $order->estimated_delivery_time = now()->addMinutes(15)->format('H:i');

        // Restaurant info
        $order->restaurant->name = 'Tasty Bites Restaurant';
        $order->restaurant->address = '123 Food Street, Cuisine City';
        $order->restaurant->phone = '+1234567890';
        $order->restaurant->location = [
            'lat' => 23.8203,
            'lng' => 90.4225
        ];

        // Delivery info
        if ($order->delivery) {
            $order->delivery->driver->name = 'John Driver';
            $order->delivery->driver->phone = '+1987654321';
            $order->delivery->driver->rating = 4.8;
            $order->delivery->driver->total_deliveries = 1250;
            $order->delivery->vehicle_type = 'Motorcycle';
            $order->delivery->vehicle_number = 'DL-1234';
            $order->delivery->current_location = [
                'lat' => 23.8153,
                'lng' => 90.4175
            ];
            $order->delivery->status = 'in_transit';
            $order->delivery->pickup_time = now()->subMinutes(20);
            $order->delivery->estimated_arrival = now()->addMinutes(15);
        }

        // Delivery location
        $order->delivery_location = [
            'lat' => 23.8303,
            'lng' => 90.4325
        ];
        $order->delivery_address = '456 Customer Lane, Delivery City';
        $order->delivery_instructions = 'Please ring the doorbell twice';

        // Order items
        $order->items = collect([
            [
                'name' => 'Chicken Burger',
                'quantity' => 2,
                'price' => 12.99,
                'special_instructions' => 'Extra cheese'
            ],
            [
                'name' => 'French Fries',
                'quantity' => 1,
                'price' => 4.99,
                'special_instructions' => 'Extra crispy'
            ],
            [
                'name' => 'Coca Cola',
                'quantity' => 2,
                'price' => 2.99,
                'special_instructions' => 'With ice'
            ]
        ]);

        return $order;
    }

    public function getDummyLocationHistory(int $deliveryId): Collection
    {
        return collect([
            [
                'id' => 1,
                'delivery_id' => $deliveryId,
                'latitude' => 23.8203,
                'longitude' => 90.4225,
                'recorded_at' => now()->subMinutes(30),
                'created_at' => now()->subMinutes(30),
                'updated_at' => now()->subMinutes(30),
                'metadata' => [
                    'speed' => '30 km/h',
                    'heading' => 'North',
                    'accuracy' => '5m'
                ]
            ],
            [
                'id' => 2,
                'delivery_id' => $deliveryId,
                'latitude' => 23.8153,
                'longitude' => 90.4175,
                'recorded_at' => now()->subMinutes(20),
                'created_at' => now()->subMinutes(20),
                'updated_at' => now()->subMinutes(20),
                'metadata' => [
                    'speed' => '25 km/h',
                    'heading' => 'Northeast',
                    'accuracy' => '4m'
                ]
            ],
            [
                'id' => 3,
                'delivery_id' => $deliveryId,
                'latitude' => 23.8103,
                'longitude' => 90.4125,
                'recorded_at' => now()->subMinutes(10),
                'created_at' => now()->subMinutes(10),
                'updated_at' => now()->subMinutes(10),
                'metadata' => [
                    'speed' => '35 km/h',
                    'heading' => 'East',
                    'accuracy' => '3m'
                ]
            ]
        ]);
    }

    public function getDummyDeliveryStats(int $deliveryId): array
    {
        return [
            'total_distance' => 5.2,
            'total_time' => 45,
            'average_speed' => 25.5,
            'stops_made' => collect([
                [
                    'latitude' => 23.8153,
                    'longitude' => 90.4175,
                    'duration' => '5 minutes',
                    'reason' => 'Traffic Signal',
                    'timestamp' => now()->subMinutes(20)->toIso8601String(),
                ]
            ]),
            'status_history' => collect([
                [
                    'status' => 'assigned',
                    'timestamp' => now()->subMinutes(45)->toIso8601String(),
                    'note' => 'Driver assigned to order'
                ],
                [
                    'status' => 'picked_up',
                    'timestamp' => now()->subMinutes(30)->toIso8601String(),
                    'note' => 'Order picked up from restaurant'
                ],
                [
                    'status' => 'in_transit',
                    'timestamp' => now()->subMinutes(25)->toIso8601String(),
                    'note' => 'On the way to delivery location'
                ]
            ]),
            'delivery_metrics' => [
                'estimated_time_remaining' => '15 minutes',
                'distance_to_destination' => '2.3 km',
                'current_speed' => '30 km/h',
                'traffic_conditions' => 'Moderate',
                'weather_conditions' => 'Clear'
            ]
        ];
    }
} 