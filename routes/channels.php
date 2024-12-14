<?php

use App\Models\Order;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Cache;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
*/


Broadcast::routes(['middleware' => ['web']]);
// Private channel for authenticated users
Broadcast::channel('user.{id}', function (User $user, int $id) {
    return $user->id === $id;
});

// Private channel for restaurants
Broadcast::channel('restaurant.{restaurantId}.orders', function ($user, $restaurantId) {
    // return $user->restaurant_id == $restaurantId || 
    //        $user->hasRole(['Admin', 'Restaurant']) ||
    //        $user->hasPermission('view-restaurant-orders');
    // return (int) $user->restaurant->id === (int) $restaurantId;
    // return true;
    return $user->restaurants()->where('id', $restaurantId)->exists() || $user->hasRole('Admin');
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

// Private channel for orders
Broadcast::channel('orders', function ($user) {
    return $user && in_array($user->role, ['admin', 'restaurant_owner', 'staff']);
});

// Private channel for restaurant notifications
Broadcast::channel('restaurant.{restaurantId}.notifications', function ($user, $restaurantId) {
    return $user->restaurants()->where('id', $restaurantId)->exists() || 
           $user->hasRole(['Admin', 'Restaurant']) ||
           $user->hasPermission('view-restaurant-notifications');
});

// Private channel for specific deliveries
Broadcast::channel('delivery.{deliveryId}', function ($user, $deliveryId) {
    $delivery = App\Models\Delivery::find($deliveryId);
    return $user && (
        $user->id === $delivery?->driver_id ||
        $user->id === $delivery?->order?->customer_id ||
        $user->hasRole('Admin')
    );
});

/**
 * Broadcast::channel('delivery.{deliveryId}', function (User $user, int $deliveryId) {
    return $user->id === Delivery::findOrFail($deliveryId)->delivery_person_id || 
           $user->hasRole('Admin');
 */
// Private channel for delivery tracking
Broadcast::channel('delivery.tracking.{orderId}', function (User $user, int $orderId) {
    $order = Order::findOrFail($orderId);
    return $user->id === $order->customer_id || 
           $user->id === $order->delivery_person_id ||
           $user->restaurants()->where('id', $order->restaurant_id)->exists() ||
           $user->hasRole('Admin');
});

// Private channel for device-specific updates
// Broadcast::channel('delivery.{deliveryId}.device.{deviceId}', function ($user, $deliveryId, $deviceId) {
//     $delivery = App\Models\Delivery::find($deliveryId);
//     $devices = Cache::get("delivery_devices:{$deliveryId}", []);
    
//     return $user && (
//         isset($devices[$deviceId]) && 
//         ($user->id === $delivery?->driver_id ||
//          $user->id === $delivery?->order?->customer_id ||
//          $user->hasRole('Admin'))
//     );
// });

Broadcast::channel('delivery.{deliveryId}.device.{deviceId}', function ($user, $deliveryId, $deviceId) {
    $delivery = App\Models\Delivery::find($deliveryId);
    $devices = Cache::get("delivery_devices:{$deliveryId}", []);
    
    // return $user && (
    //     isset($devices[$deviceId]) && 
    //     ($user->id === $delivery?->driver_id ||
    //      $user->id === $delivery?->order?->customer_id ||
    //      $user->hasRole('Admin'))
    // );
    return true;
});
