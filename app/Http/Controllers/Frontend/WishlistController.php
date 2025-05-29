<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\Frontend\WishlistService;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;

/**
 * Controller for managing wishlist page and operations
 */
final class WishlistController extends Controller
{
    public function __construct(
        private readonly WishlistService $wishlistService
    ) {}

    /**
     * Display the wishlist page
     */
    public function index(): Response
    {
        try {
            $data = $this->wishlistService->getWishlistPageData();
            
            // Check if there's an error in the data
            if (isset($data['error'])) {
                return Inertia::render('Frontend/Wishlist/Index', [
                    'error' => $data['error']
                ]);
            }
            
            return Inertia::render('Frontend/Wishlist/Index', $data);
        } catch (\Throwable $e) {
            report($e);
            
            return Inertia::render('Frontend/Wishlist/Index', [
                'error' => 'An error occurred while loading the wishlist page.'
            ]);
        }
    }

    /**
     * Add an item to the wishlist
     */
    public function addToWishlist(Request $request)
    {
        try {
            $validated = $request->validate([
                'item_id' => 'required|integer',
                'type' => 'required|string|in:dish,restaurant',
            ]);
            
            // Here you would typically handle the logic to add an item to wishlist
            // For now, we'll just return a success response
            
            return response()->json([
                'success' => true,
                'message' => 'Item added to wishlist successfully'
            ]);
        } catch (\Throwable $e) {
            report($e);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to add item to wishlist: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove an item from the wishlist
     */
    public function removeFromWishlist(Request $request)
    {
        try {
            $validated = $request->validate([
                'item_id' => 'required|integer',
            ]);
            
            // Here you would typically handle the logic to remove an item from wishlist
            
            return response()->json([
                'success' => true,
                'message' => 'Item removed from wishlist successfully'
            ]);
        } catch (\Throwable $e) {
            report($e);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove item from wishlist: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Move an item from wishlist to cart
     */
    public function moveToCart(Request $request)
    {
        try {
            $validated = $request->validate([
                'item_id' => 'required|integer',
                'quantity' => 'sometimes|integer|min:1',
            ]);
            
            $quantity = $validated['quantity'] ?? 1;
            
            // Here you would typically handle the logic to move an item to cart
            
            return response()->json([
                'success' => true,
                'message' => 'Item moved to cart successfully'
            ]);
        } catch (\Throwable $e) {
            report($e);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to move item to cart: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create or update a collection
     */
    public function manageCollection(Request $request)
    {
        try {
            $validated = $request->validate([
                'collection_id' => 'sometimes|integer',
                'name' => 'required|string|max:50',
                'icon' => 'sometimes|string',
                'color' => 'sometimes|string',
            ]);
            
            // Here you would typically handle the logic to create or update a collection
            
            return response()->json([
                'success' => true,
                'message' => 'Collection ' . (isset($validated['collection_id']) ? 'updated' : 'created') . ' successfully'
            ]);
        } catch (\Throwable $e) {
            report($e);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to manage collection: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clear all items from wishlist
     */
    public function clearWishlist()
    {
        try {
            // Here you would typically handle the logic to clear the wishlist
            
            return response()->json([
                'success' => true,
                'message' => 'Wishlist cleared successfully'
            ]);
        } catch (\Throwable $e) {
            report($e);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear wishlist: ' . $e->getMessage()
            ], 500);
        }
    }
} 