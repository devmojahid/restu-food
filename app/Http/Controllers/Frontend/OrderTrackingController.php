<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\Frontend\OrderTrackingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Response;
use Inertia\Inertia;

final class OrderTrackingController extends Controller
{
    public function __construct(
        private readonly OrderTrackingService $orderTrackingService
    ) {}

    /**
     * Display the order tracking page
     */
    public function index(Request $request): Response
    {
        $orderNumber = $request->query('order_number');
        
        try {
            $data = $this->orderTrackingService->getOrderTrackingPageData($orderNumber);
            
            return Inertia::render('Frontend/OrderTracking/Index', $data);
        } catch (\Throwable $e) {
            $errorMessage = $this->getSafeErrorMessage($e);
            
            return $this->renderFallbackPage($errorMessage);
        }
    }

    /**
     * Show a specific order by ID
     */
    public function show(string $orderNumber): Response
    {
        try {
            $data = $this->orderTrackingService->getOrderTrackingPageData($orderNumber);
            
            return Inertia::render('Frontend/OrderTracking/Index', $data);
        } catch (\Throwable $e) {
            $errorMessage = $this->getSafeErrorMessage($e);
            
            return $this->renderFallbackPage($errorMessage);
        }
    }

    /**
     * Get a safe error message for the user
     */
    private function getSafeErrorMessage(\Throwable $e): string
    {
        // Log detailed error but return generic message for production
        Log::error('Order tracking error: ' . $e->getMessage(), [
            'exception' => $e,
            'trace' => $e->getTraceAsString()
        ]);
        
        // Only show detailed error in development
        if (config('app.debug')) {
            return $e->getMessage();
        }
        
        return 'We encountered an issue while loading the order tracking information. Please try again later.';
    }

    /**
     * Render a fallback page with minimal data when there's an error
     */
    private function renderFallbackPage(string $errorMessage = null): Response
    {
        return Inertia::render('Frontend/OrderTracking/Index', [
            'hero' => [
                'title' => 'Track Your Order',
                'subtitle' => 'Real-time updates',
                'description' => 'Stay updated with your food delivery status in real-time.',
                'image' => '/images/hero-tracking.jpg'
            ],
            'error' => $errorMessage
        ]);
    }
} 