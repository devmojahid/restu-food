<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Response;
use Inertia\Inertia;

class ReviewController extends Controller
{
    use AuthorizesRequests;

    public function __construct()
    {
        $this->authorizeResource(Review::class, 'review');
    }

    public function index(Request $request): Response
    {
        $reviews = $request->user()
            ->reviews()
            ->with(['restaurant', 'order'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Customer/Reviews/Index', [
            'reviews' => $reviews
        ]);
    }

    public function store(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'rating' => 'required|numeric|min:1|max:5',
            'comment' => 'required|string|min:10',
            'images.*' => 'nullable|image|max:2048'
        ]);

        $images = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('reviews', 'public');
                $images[] = $path;
            }
        }

        $review = Review::create([
            'user_id' => $request->user()->id,
            'restaurant_id' => $order->restaurant_id,
            'order_id' => $order->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'images' => $images,
        ]);

        return response()->json([
            'message' => 'Review submitted successfully',
            'review' => $review
        ]);
    }

    public function update(Request $request, Review $review): JsonResponse
    {
        if (! Gate::allows('update-review', $review)) {
            abort(403);
        }

        $validated = $request->validate([
            'rating' => 'required|numeric|min:1|max:5',
            'comment' => 'required|string|min:10',
            'images.*' => 'nullable|image|max:2048'
        ]);

        $images = $review->images ?? [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('reviews', 'public');
                $images[] = $path;
            }
        }

        $review->update([
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'images' => $images,
        ]);

        return response()->json([
            'message' => 'Review updated successfully',
            'review' => $review
        ]);
    }

    public function destroy(Review $review): JsonResponse
    {
        if (! Gate::allows('delete-review', $review)) {
            abort(403);
        }
        
        $review->delete();

        return response()->json([
            'message' => 'Review deleted successfully'
        ]);
    }
} 