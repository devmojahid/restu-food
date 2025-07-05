<?php

use Illuminate\Support\Facades\Route;
use Modules\Frontend\Http\Controllers\FrontendController;
use Inertia\Inertia;

use App\Http\Controllers\Frontend\{
    HomeController,
    MenuController,
    OfferController,
    PageController,
    CartController,
    Cart2Controller,
    WishlistController,
    CheckoutController,
    Checkout2Controller,
    Checkout3Controller,
    SupportController,
    ElectronicsController,
    OrderTrackingController,
    LegalController,
    RewardsController,
    FoodMenu2Controller,
    ShopController
};

use App\Http\Controllers\Frontend\RestaurantController as FrontendRestaurantController;


Route::get('/test', function () {
    return Inertia::module('Frontend::Index');
});

// Frontend Routes
Route::name('frontend.')->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/about', [PageController::class, 'about'])->name('about');
    Route::get('/menu', [MenuController::class, 'index'])->name('menu');
    Route::get('/menu/{menu}', [MenuController::class, 'show'])->name('menu.show');
    Route::get('/restaurants', [PageController::class, 'restaurants'])->name('restaurants');
    Route::get('/restaurants2', [PageController::class, 'restaurants2'])->name('restaurants2');
    Route::get('/restaurant-detail/{slug?}', [PageController::class, 'restaurantDetail'])->name('restaurant-detail');
    Route::get('/restaurant-detail2/{slug?}', [PageController::class, 'restaurantDetail2'])->name('restaurant-detail2');
    
    // Chef Routes
    Route::get('/chef', [PageController::class, 'chef'])->name('chef');
    Route::get('/chef/{slug}', [PageController::class, 'chefDetail'])->name('chef.show');
    
    Route::get('/electronics', [ElectronicsController::class, 'index'])->name('electronics');
    Route::get('/offers', [OfferController::class, 'index'])->name('offers');
    Route::get('/offers/{id}', [OfferController::class, 'show'])->name('offers.show');
    Route::post('/offers/{id}/claim', [OfferController::class, 'claim'])->name('offers.claim');
    Route::get('/contact', [PageController::class, 'contact'])->name('contact');
    
    // Partner pages
    Route::get('/become-restaurant', [PageController::class, 'becomeRestaurant'])->name('become-restaurant');
    Route::get('/kitchen-staff', [PageController::class, 'kitchenStaff'])->name('kitchen-staff');
    Route::get('/delivery-staff', [PageController::class, 'deliveryStaff'])->name('delivery-staff');
    Route::get('/become-vendor', [PageController::class, 'becomeVendor'])->name('become-vendor');

    // Food Menu 2 Routes
    Route::prefix('food-menu')->name('food-menu.')->group(function () {
        Route::get('/', [FoodMenu2Controller::class, 'index'])->name('index');
        Route::get('/category/{slug}', [FoodMenu2Controller::class, 'category'])->name('category');
        Route::get('/details2/{slug}', [FoodMenu2Controller::class, 'showDetails2'])->name('details2');
        Route::get('/{slug}', [FoodMenu2Controller::class, 'show'])->name('show');
    });
    // Shop Routes
    Route::get('/shop', [ShopController::class, 'index'])->name('shop');
    Route::get('/shop2', [ShopController::class, 'shop2'])->name('shop2');
    Route::get('/shop/{slug}', [ShopController::class, 'show'])->name('shop.show');
    
     // Legal Pages Routes
    //  Route::prefix('legal')->name('legal.')->group(function () {
    //     Route::get('/terms', [LegalController::class, 'terms'])->name('terms');
    //     Route::get('/privacy', [LegalController::class, 'privacy'])->name('privacy');
    //     Route::get('/refund', [LegalController::class, 'refund'])->name('refund');
    //     Route::get('/cookie', [LegalController::class, 'cookie'])->name('cookie');
    //     Route::get('/cancellation', [LegalController::class, 'cancellation'])->name('cancellation');
    // });
    // Rewards/Loyalty Program Routes
    Route::get('/rewards', [RewardsController::class, 'index'])->name('rewards');
    Route::get('/rewards/history', [RewardsController::class, 'history'])->name('rewards.history');
    Route::get('/rewards/my-rewards', [RewardsController::class, 'myRewards'])->name('rewards.my-rewards');
    Route::get('/rewards/{id}', [RewardsController::class, 'showReward'])->name('rewards.show');
    Route::post('/rewards/{id}/redeem', [RewardsController::class, 'redeemReward'])->name('rewards.redeem');
    
    Route::get('/legal/{slug}', [LegalController::class, 'index'])->name('legal');
    
    // Support/Help Center Routes
    Route::get('/support', [SupportController::class, 'index'])->name('support');
    Route::post('/support/ticket', [SupportController::class, 'submitTicket'])->name('support.ticket');
    Route::post('/support/chat', [SupportController::class, 'startChat'])->name('support.chat');
    
    Route::get('/restaurant/{restaurant}', [FrontendRestaurantController::class, 'show'])->name('restaurant.single');
    Route::get('/blogs', [PageController::class, 'blogs'])->name('blogs');
    Route::get('/blog/{slug}', [PageController::class, 'blogSingle'])->name('blog.single');
    
    // Order Tracking Routes
    Route::get('/order-tracking', [OrderTrackingController::class, 'index'])->name('order.tracking');
    Route::get('/order-tracking/{orderNumber}', [OrderTrackingController::class, 'show'])->name('order.tracking.show');
    
    // Cart Routes
    Route::get('/cart', [CartController::class, 'index'])->name('cart');
    Route::put('/cart/items/{itemId}', [CartController::class, 'updateQuantity'])->name('cart.update');
    Route::delete('/cart/items/{itemId}', [CartController::class, 'removeItem'])->name('cart.remove');
    Route::post('/cart/promo-code', [CartController::class, 'applyPromoCode'])->name('cart.promo');
    
    // Enhanced Cart2 Routes
    Route::get('/cart2', [Cart2Controller::class, 'index'])->name('cart2');
    Route::post('/cart2/promo-code', [Cart2Controller::class, 'applyPromoCode'])->name('cart2.promo');
    Route::put('/cart2/items/update-quantity', [Cart2Controller::class, 'updateQuantity'])->name('cart2.update-quantity');
    Route::delete('/cart2/items/remove', [Cart2Controller::class, 'removeItem'])->name('cart2.remove-item');
    Route::post('/cart2/items/save-for-later', [Cart2Controller::class, 'saveForLater'])->name('cart2.save-for-later');
    Route::post('/cart2/items/move-to-cart', [Cart2Controller::class, 'moveToCart'])->name('cart2.move-to-cart');
    Route::post('/cart2/checkout', [Cart2Controller::class, 'checkout'])->name('cart2.checkout');
    
    // Checkout Routes
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
    Route::post('/checkout/process', [CheckoutController::class, 'processCheckout'])->name('checkout.process');
    Route::put('/checkout/address', [CheckoutController::class, 'updateShippingAddress'])->name('checkout.address');
    Route::put('/checkout/payment', [CheckoutController::class, 'updatePaymentMethod'])->name('checkout.payment');
    Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');
    Route::get('/tracking/{id}', [CheckoutController::class, 'tracking'])->name('tracking');
    
    // Checkout2 Routes
    Route::get('/checkout2', [Checkout2Controller::class, 'index'])->name('checkout2');
    Route::post('/checkout2/process', [Checkout2Controller::class, 'processCheckout'])->name('checkout2.process');
    Route::put('/checkout2/address', [Checkout2Controller::class, 'updateAddress'])->name('checkout2.address');
    Route::put('/checkout2/payment', [Checkout2Controller::class, 'updatePayment'])->name('checkout2.payment');
    Route::post('/checkout2/promo', [Checkout2Controller::class, 'applyPromoCode'])->name('checkout2.promo');
    Route::get('/checkout2/success', [Checkout2Controller::class, 'success'])->name('checkout2.success');
    
    // Checkout3 Routes - Express Single-Page Checkout
    Route::get('/checkout3', [Checkout3Controller::class, 'index'])->name('checkout3');
    Route::post('/checkout3/process', [Checkout3Controller::class, 'processCheckout'])->name('checkout3.process');
    Route::post('/checkout3/promo', [Checkout3Controller::class, 'applyPromoCode'])->name('checkout3.promo');
    Route::get('/checkout3/success', [Checkout3Controller::class, 'success'])->name('checkout3.success');
    
    // Menu Routes
    Route::prefix('menu')->name('menu.')->group(function () {
        Route::get('/', [MenuController::class, 'index'])->name('index');
        Route::get('/category/{slug}', [MenuController::class, 'category'])->name('category');
        Route::get('/{slug}', [MenuController::class, 'show'])->name('show');
    });

    // Wishlist Routes
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist');
    Route::post('/wishlist/add', [WishlistController::class, 'addToWishlist'])->name('wishlist.add');
    Route::post('/wishlist/remove', [WishlistController::class, 'removeFromWishlist'])->name('wishlist.remove');
    Route::post('/wishlist/move-to-cart', [WishlistController::class, 'moveToCart'])->name('wishlist.move_to_cart');
    Route::post('/wishlist/collection', [WishlistController::class, 'manageCollection'])->name('wishlist.collection');
    Route::post('/wishlist/clear', [WishlistController::class, 'clearWishlist'])->name('wishlist.clear');

    // Wishlist2 Routes
    Route::get('/wishlist2', [WishlistController::class, 'showWishlist2'])->name('wishlist2');
    Route::post('/wishlist2/add', [WishlistController::class, 'addToWishlist2'])->name('wishlist2.add');
    Route::delete('/wishlist2/remove', [WishlistController::class, 'removeFromWishlist2'])->name('wishlist2.remove');
    Route::post('/wishlist2/move-to-cart', [WishlistController::class, 'moveToCart2'])->name('wishlist2.move_to_cart');
    Route::post('/wishlist2/manage-collection', [WishlistController::class, 'manageCollection2'])->name('wishlist2.manage_collection');
    Route::delete('/wishlist2/clear', [WishlistController::class, 'clearWishlist2'])->name('wishlist2.clear');
    
    Route::post('/contact', [PageController::class, 'submitContact'])->name('contact.submit');
    
    Route::get('/blog', [PageController::class, 'blogs'])->name('blog.index');
});
