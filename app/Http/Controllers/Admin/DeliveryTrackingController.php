<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Controller;
final class DeliveryTrackingController extends Controller
{
    public function show(Order $order): Response
    {
        // Ensure the user can view this order
        // $this->authorize('view', $order);

        // Load necessary relationships
        $order->load(['delivery.driver', 'restaurant']);

        return Inertia::render('Dashboard/Customer/DeliveryTracking', [
            'order' => $order
        ]);
    }
} 