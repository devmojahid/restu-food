<?php

namespace App\Http\Controllers;

use App\Services\DeliveryLocationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DeliveryLocationController extends Controller
{
    public function __construct(private DeliveryLocationService $trackingService)
    {
        //
    }

    public function pairDevice(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'delivery_id' => 'required|integer',
                'device_id' => 'required|string',
                'role' => 'required|in:customer,driver'
            ]);

            $this->trackingService->pairDevice(
                deliveryId: $validated['delivery_id'],
                deviceId: $validated['device_id'],
                role: $validated['role']
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Device paired successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Device pairing failed: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to pair device'
            ], 500);
        }
    }

    public function unpairDevice(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'delivery_id' => 'required|integer',
                'device_id' => 'required|string'
            ]);

            $this->trackingService->unpairDevice(
                deliveryId: $validated['delivery_id'],
                deviceId: $validated['device_id']
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Device unpaired successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Device unpairing failed: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to unpair device'
            ], 500);
        }
    }
} 