<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;

class RestaurantFavoriteController extends Controller
{
    public function index(Request $request): Response
    {
        $favorites = $request->user()
            ->favoriteRestaurants()
            ->with(['cuisine', 'ratings'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Customer/Favorites/Index', [
            'favorites' => $favorites
        ]);
    }

    public function toggle(Request $request, Restaurant $restaurant): JsonResponse
    {
        $user = $request->user();
        
        if ($user->favoriteRestaurants()->where('restaurant_id', $restaurant->id)->exists()) {
            $user->favoriteRestaurants()->detach($restaurant->id);
            $message = 'Restaurant removed from favorites';
            $status = false;
        } else {
            $user->favoriteRestaurants()->attach($restaurant->id, [
                'notes' => $request->input('notes')
            ]);
            $message = 'Restaurant added to favorites';
            $status = true;
        }

        return response()->json([
            'message' => $message,
            'status' => $status
        ]);
    }

    public function addNote(Request $request, Restaurant $restaurant): JsonResponse
    {
        $request->validate([
            'notes' => 'required|string|max:500'
        ]);

        $request->user()->favoriteRestaurants()->updateExistingPivot(
            $restaurant->id,
            ['notes' => $request->input('notes')]
        );

        return response()->json([
            'message' => 'Note updated successfully'
        ]);
    }
} 