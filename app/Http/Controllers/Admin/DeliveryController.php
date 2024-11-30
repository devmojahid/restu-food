<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\DeliveryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Events\DeliveryLocationUpdated;
use App\Events\DeliveryStatusChanged;

class DeliveryController extends Controller
{
    public function __construct(private DeliveryService $deliveryService)
    {
    }

    public function updateLocation(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $user = $request->user();
        
        // Update delivery person's location
        $user->update([
            'last_latitude' => $validated['latitude'],
            'last_longitude' => $validated['longitude'],
            'last_location_update' => now(),
        ]);

        // Broadcast location update
        broadcast(new DeliveryLocationUpdated($user))->toOthers();

        return response()->json([
            'message' => 'Location updated successfully'
        ]);
    }

    public function updateStatus(Request $request, $deliveryId): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:picked_up,delivered,cancelled',
            'location' => 'required|array',
            'location.latitude' => 'required|numeric',
            'location.longitude' => 'required|numeric',
            'notes' => 'nullable|string',
        ]);

        $delivery = $this->deliveryService->updateDeliveryStatus(
            $deliveryId,
            $validated['status'],
            $validated['location'],
            $validated['notes'] ?? null
        );

        // Broadcast status update
        broadcast(new DeliveryStatusChanged($delivery))->toOthers();

        return response()->json([
            'message' => 'Delivery status updated successfully',
            'delivery' => $delivery
        ]);
    }

    // Add more controller methods...
} 