<?php

use App\Models\Order;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
*/

// Private channel for authenticated users
Broadcast::channel('user.{id}', function (User $user, int $id) {
    return $user->id === $id;
});

// Private channel for restaurants
Broadcast::channel('restaurant.{id}', function (User $user, int $id) {
    return $user->restaurants()->where('id', $id)->exists() || 
           $user->hasRole(['Admin', 'Restaurant']);
});

// Private channel for specific orders
Broadcast::channel('order.{id}', function (User $user, int $id) {
    $order = Order::findOrFail($id);
    return $user->id === $order->customer_id || 
           $user->id === $order->delivery_person_id ||
           $user->restaurants()->where('id', $order->restaurant_id)->exists() ||
           $user->hasRole('Admin');
});

// Private channel for kitchen staff
Broadcast::channel('kitchen.{restaurantId}', function (User $user, int $restaurantId) {
    return $user->restaurants()->where('id', $restaurantId)->exists() || 
           $user->hasRole(['Kitchen Staff', 'Admin']);
});

// Private channel for delivery staff
Broadcast::channel('delivery', function (User $user) {
    return $user->hasRole(['Delivery Staff', 'Admin']);
});

// Private channel for notifications
Broadcast::channel('notifications', function (User $user) {
    return ['id' => $user->id, 'name' => $user->name];
});
