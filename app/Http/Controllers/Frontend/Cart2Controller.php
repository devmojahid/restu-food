<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\Frontend\Cart2Service;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;

final class Cart2Controller extends Controller
{
    public function __construct(
        private readonly Cart2Service $cart2Service
    ) {}

    /**
     * Display the enhanced Cart2 page
     * 
     * @return Response
     */
    public function index(): Response
    {
        try {
            $data = $this->cart2Service->getCart2PageData();
            return Inertia::render('Frontend/Cart2/Index', $data);
        } catch (\Throwable $e) {
            report($e);
            
            return Inertia::render('Frontend/Cart2/Index', [
                'hero' => [
                    'title' => 'Your Shopping Cart',
                    'subtitle' => 'Review & Checkout',
                    'description' => 'Review your items, apply promo codes, and complete your purchase',
                    'image' => '/images/hero/cart-hero.jpg',
                ],
                'cart_items' => [],
                'recommended_items' => [],
                'recent_items' => [],
                'saved_for_later' => [],
                'error' => 'Unable to load cart data. Please try again later.'
            ]);
        }
    }

    /**
     * Apply a promo code to the cart
     * 
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function applyPromoCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:50'
        ]);

        // In a real application, we would validate the promo code here
        // For demo purposes, we'll just redirect back with a success message
        
        return redirect()->back()->with('success', 'Promo code applied successfully!');
    }

    /**
     * Update the quantity of an item in the cart
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateQuantity(Request $request)
    {
        $request->validate([
            'item_id' => 'required|integer',
            'quantity' => 'required|integer|min:0'
        ]);

        // In a real application, we would update the cart here
        // For demo purposes, we'll just return a success response
        
        return response()->json([
            'success' => true,
            'message' => 'Item quantity updated successfully!'
        ]);
    }

    /**
     * Remove an item from the cart
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeItem(Request $request)
    {
        $request->validate([
            'item_id' => 'required|integer'
        ]);

        // In a real application, we would remove the item from the cart here
        // For demo purposes, we'll just return a success response
        
        return response()->json([
            'success' => true,
            'message' => 'Item removed from cart successfully!'
        ]);
    }

    /**
     * Save an item for later
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function saveForLater(Request $request)
    {
        $request->validate([
            'item_id' => 'required|integer'
        ]);

        // In a real application, we would save the item for later here
        // For demo purposes, we'll just return a success response
        
        return response()->json([
            'success' => true,
            'message' => 'Item saved for later successfully!'
        ]);
    }

    /**
     * Move an item from saved for later to the cart
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function moveToCart(Request $request)
    {
        $request->validate([
            'item_id' => 'required|integer'
        ]);

        // In a real application, we would move the item to the cart here
        // For demo purposes, we'll just return a success response
        
        return response()->json([
            'success' => true,
            'message' => 'Item moved to cart successfully!'
        ]);
    }

    /**
     * Proceed to checkout
     * 
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function checkout(Request $request)
    {
        // In a real application, we would validate the cart and redirect to checkout
        // For demo purposes, we'll just redirect back with a success message
        
        return redirect()->back()->with('success', 'Proceeding to checkout...');
    }
} 