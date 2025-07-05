<?php

declare(strict_types=1);

namespace Modules\Frontend\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Frontend\Services\CartService; 
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;

final class CartController extends Controller
{
    public function __construct(
        private readonly CartService $cartService
    ) {}

    /**
     * Display the cart page
     */
    public function index(): Response
    {
        try {
            $data = $this->cartService->getCartPageData();
            
            return Inertia::module('Frontend::Cart/Index', $data);  
        } catch (\Throwable $e) {
            report($e);
            
            return $this->renderFallbackPage($this->getSafeErrorMessage($e));
        }
    }

    /**
     * Update cart item quantity
     */
    public function updateQuantity(Request $request, string $itemId): JsonResponse
    {
        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:99',
            ]);

            // In a real application, you would update the cart in the database/session
            // For this demo, we'll just return a success response
            
            return response()->json([
                'success' => true,
                'message' => 'Cart updated successfully',
            ]);
        } catch (\Throwable $e) {
            report($e);
            
            return response()->json([
                'success' => false,
                'message' => $this->getSafeErrorMessage($e),
            ], 500);
        }
    }

    /**
     * Remove cart item
     */
    public function removeItem(string $itemId): JsonResponse
    {
        try {
            // In a real application, you would remove the item from the cart in the database/session
            // For this demo, we'll just return a success response
            
            return response()->json([
                'success' => true,
                'message' => 'Item removed from cart',
            ]);
        } catch (\Throwable $e) {
            report($e);
            
            return response()->json([
                'success' => false,
                'message' => $this->getSafeErrorMessage($e),
            ], 500);
        }
    }

    /**
     * Apply promo code
     */
    public function applyPromoCode(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'code' => 'required|string|max:20',
            ]);

            // In a real application, you would validate and apply the promo code
            // For this demo, we'll just return a success response
            
            return response()->json([
                'success' => true,
                'message' => 'Promo code applied successfully',
                'discount' => 10, // Example discount percentage
            ]);
        } catch (\Throwable $e) {
            report($e);
            
            return response()->json([
                'success' => false,
                'message' => $this->getSafeErrorMessage($e),
            ], 500);
        }
    }

    /**
     * Get a safe error message for the user
     */
    private function getSafeErrorMessage(\Throwable $e): string
    {
        if (app()->environment('production')) {
            return 'An error occurred while processing your request. Please try again later.';
        }

        return $e->getMessage();
    }

    /**
     * Render a fallback page if an error occurs
     */
    private function renderFallbackPage(string $errorMessage = null): Response
    {
        return Inertia::module('Frontend::Cart/Index', [
            'hero' => [
                'title' => 'Your Cart',
                'subtitle' => 'Complete Your Order',
                'description' => 'Review your cart, select delivery options, and proceed to checkout.',
                'image' => '/images/hero-cart.jpg',
                'stats' => [],
            ],
            'cart_items' => [],
            'summary' => [
                'subtotal' => 0,
                'tax' => 0,
                'delivery_fee' => 3.99,
                'discount' => 0,
                'total' => 0,
                'currency' => 'USD',
            ],
            'addresses' => [],
            'payment_methods' => [],
            'promo_codes' => [],
            'recommended_items' => [],
            'error' => $errorMessage ?? 'Failed to load cart data. Please try again later.',
        ]);
    }
} 