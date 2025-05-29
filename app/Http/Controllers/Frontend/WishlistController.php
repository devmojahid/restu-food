<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\Frontend\WishlistService;
use App\Services\Frontend\Wishlist2Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller for wishlist and wishlist2 functionality
 */
final class WishlistController extends Controller
{
    public function __construct(
        private readonly WishlistService $wishlistService,
        private readonly Wishlist2Service $wishlist2Service
    ) {}
    
    /**
     * Display the wishlist page with items
     */
    public function index(): Response
    {
        $data = $this->wishlistService->getWishlistPageData();
        
        return Inertia::render('Frontend/Wishlist/Index', $data);
    }
    
    /**
     * Display the enhanced wishlist2 page with items
     */
    public function showWishlist2(): Response
    {
        $data = $this->wishlist2Service->getWishlist2PageData();
        
        return Inertia::render('Frontend/Wishlist2/Index', $data);
    }
    
    /**
     * Add an item to wishlist
     */
    public function addToWishlist(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'dish_id' => 'required|integer',
            'collection_id' => 'nullable|integer',
        ]);
        
        $result = $this->wishlistService->addItemToWishlist(
            $validated['dish_id'],
            $validated['collection_id'] ?? null
        );
        
        if ($request->wantsJson()) {
            return response()->json([
                'success' => $result,
                'message' => $result ? 'Item added to wishlist' : 'Failed to add item to wishlist',
            ]);
        }
        
        return redirect()->back()->with(
            $result ? 'success' : 'error',
            $result ? 'Item added to wishlist' : 'Failed to add item to wishlist'
        );
    }
    
    /**
     * Add an item to wishlist2
     */
    public function addToWishlist2(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'dish_id' => 'required|integer',
            'collection_id' => 'nullable|integer',
        ]);
        
        $result = $this->wishlist2Service->addItemToWishlist(
            $validated['dish_id'],
            $validated['collection_id'] ?? null
        );
        
        if ($request->wantsJson()) {
            return response()->json([
                'success' => $result,
                'message' => $result ? 'Item added to wishlist' : 'Failed to add item to wishlist',
            ]);
        }
        
        return redirect()->back()->with(
            $result ? 'success' : 'error',
            $result ? 'Item added to wishlist' : 'Failed to add item to wishlist'
        );
    }
    
    /**
     * Remove an item from wishlist
     */
    public function removeFromWishlist(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'item_id' => 'required|integer',
        ]);
        
        $result = $this->wishlistService->removeItemFromWishlist($validated['item_id']);
        
        if ($request->wantsJson()) {
            return response()->json([
                'success' => $result,
                'message' => $result ? 'Item removed from wishlist' : 'Failed to remove item from wishlist',
            ]);
        }
        
        return redirect()->back()->with(
            $result ? 'success' : 'error',
            $result ? 'Item removed from wishlist' : 'Failed to remove item from wishlist'
        );
    }
    
    /**
     * Remove an item from wishlist2
     */
    public function removeFromWishlist2(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'item_id' => 'required|integer',
        ]);
        
        $result = $this->wishlist2Service->removeItemFromWishlist($validated['item_id']);
        
        if ($request->wantsJson()) {
            return response()->json([
                'success' => $result,
                'message' => $result ? 'Item removed from wishlist' : 'Failed to remove item from wishlist',
            ]);
        }
        
        return redirect()->back()->with(
            $result ? 'success' : 'error',
            $result ? 'Item removed from wishlist' : 'Failed to remove item from wishlist'
        );
    }
    
    /**
     * Move an item from wishlist to cart
     */
    public function moveToCart(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'item_id' => 'required|integer',
            'quantity' => 'nullable|integer|min:1',
        ]);
        
        $result = $this->wishlistService->moveItemToCart(
            $validated['item_id'],
            $validated['quantity'] ?? 1
        );
        
        if ($request->wantsJson()) {
            return response()->json([
                'success' => $result,
                'message' => $result ? 'Item moved to cart' : 'Failed to move item to cart',
            ]);
        }
        
        return redirect()->back()->with(
            $result ? 'success' : 'error',
            $result ? 'Item moved to cart' : 'Failed to move item to cart'
        );
    }
    
    /**
     * Move an item from wishlist2 to cart
     */
    public function moveToCart2(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'item_id' => 'required|integer',
            'quantity' => 'nullable|integer|min:1',
        ]);
        
        $result = $this->wishlist2Service->moveItemToCart(
            $validated['item_id'],
            $validated['quantity'] ?? 1
        );
        
        if ($request->wantsJson()) {
            return response()->json([
                'success' => $result,
                'message' => $result ? 'Item moved to cart' : 'Failed to move item to cart',
            ]);
        }
        
        return redirect()->back()->with(
            $result ? 'success' : 'error',
            $result ? 'Item moved to cart' : 'Failed to move item to cart'
        );
    }
    
    /**
     * Manage collection (create, update, delete)
     */
    public function manageCollection(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'action' => 'required|string|in:create,update,delete',
            'collection_id' => 'nullable|required_if:action,update,delete|integer',
            'name' => 'nullable|required_if:action,create,update|string|max:255',
        ]);
        
        $result = $this->wishlistService->manageCollection(
            $validated['action'],
            $validated['collection_id'] ?? null,
            $validated['name'] ?? null
        );
        
        if ($request->wantsJson()) {
            return response()->json([
                'success' => $result,
                'message' => $result ? 'Collection updated successfully' : 'Failed to update collection',
            ]);
        }
        
        return redirect()->back()->with(
            $result ? 'success' : 'error',
            $result ? 'Collection updated successfully' : 'Failed to update collection'
        );
    }
    
    /**
     * Manage wishlist2 collection (create, update, delete)
     */
    public function manageCollection2(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'action' => 'required|string|in:create,update,delete',
            'collection_id' => 'nullable|required_if:action,update,delete|integer',
            'name' => 'nullable|required_if:action,create,update|string|max:255',
        ]);
        
        $result = $this->wishlist2Service->manageCollection(
            $validated['action'],
            $validated['collection_id'] ?? null,
            $validated['name'] ?? null
        );
        
        if ($request->wantsJson()) {
            return response()->json([
                'success' => $result,
                'message' => $result ? 'Collection updated successfully' : 'Failed to update collection',
            ]);
        }
        
        return redirect()->back()->with(
            $result ? 'success' : 'error',
            $result ? 'Collection updated successfully' : 'Failed to update collection'
        );
    }
    
    /**
     * Clear all items from wishlist
     */
    public function clearWishlist(Request $request): JsonResponse|RedirectResponse
    {
        $result = $this->wishlistService->clearWishlist();
        
        if ($request->wantsJson()) {
            return response()->json([
                'success' => $result,
                'message' => $result ? 'Wishlist cleared' : 'Failed to clear wishlist',
            ]);
        }
        
        return redirect()->back()->with(
            $result ? 'success' : 'error',
            $result ? 'Wishlist cleared' : 'Failed to clear wishlist'
        );
    }
    
    /**
     * Clear all items from wishlist2
     */
    public function clearWishlist2(Request $request): JsonResponse|RedirectResponse
    {
        $result = $this->wishlist2Service->clearWishlist();
        
        if ($request->wantsJson()) {
            return response()->json([
                'success' => $result,
                'message' => $result ? 'Wishlist cleared' : 'Failed to clear wishlist',
            ]);
        }
        
        return redirect()->back()->with(
            $result ? 'success' : 'error',
            $result ? 'Wishlist cleared' : 'Failed to clear wishlist'
        );
    }
} 