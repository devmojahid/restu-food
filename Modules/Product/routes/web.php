<?php

use Illuminate\Support\Facades\Route;
use Modules\Product\Http\Controllers\{
    ProductController
};

    /*
    |--------------------------------------------------------------------------
    | E-commerce Related Routes
    |--------------------------------------------------------------------------
    */
    
    // Main product routes - Move this AFTER the addons routes
    Route::resource('products', ProductController::class);
    Route::prefix('products')->name('products.')->group(function () {
        // Add-ons Management - Move these routes BEFORE the resource route
        Route::prefix('addons')->name('addons.')
            ->middleware(['auth', 'role:Admin|Restaurant'])
            ->group(function () {
                Route::get('/', [ProductAddonController::class, 'index'])->name('index');
                Route::post('/', [ProductAddonController::class, 'store'])->name('store');
                Route::put('/{addon}', [ProductAddonController::class, 'update'])->name('update');
                Route::delete('/{addon}', [ProductAddonController::class, 'destroy'])->name('destroy');
                Route::post('/bulk-action', [ProductAddonController::class, 'bulkAction'])->name('bulk-action');
                Route::put('/order', [ProductAddonController::class, 'updateOrder'])->name('order');
            });
    });

    // Coupons Management
    Route::group(['prefix' => 'coupons', 'as' => 'coupons.'], function () {
        Route::get('/', [CouponController::class, 'index'])->name('index');
        Route::post('/', [CouponController::class, 'store'])
            // ->middleware('permission:coupon.create')
            ->name('store');
        Route::put('/{coupon}', [CouponController::class, 'update'])
            // ->middleware('permission:coupon.edit')
            ->name('update');
        Route::delete('/{coupon}', [CouponController::class, 'destroy'])
            // ->middleware('permission:coupon.delete')
            ->name('destroy');
        Route::put('/{coupon}/status', [CouponController::class, 'updateStatus'])
            // ->middleware('permission:coupon.edit')
            ->name('status');
        Route::delete('/bulk-delete', [CouponController::class, 'bulkDelete'])
            // ->middleware('permission:coupon.delete')
            ->name('bulk-delete');
        Route::put('/bulk-status', [CouponController::class, 'bulkUpdateStatus'])
            // ->middleware('permission:coupon.edit')
            ->name('bulk-status');
        Route::post('/validate', [CouponController::class, 'validate'])
            ->name('validate');
        Route::get('/{coupon}/usage', [CouponController::class, 'usage'])
            // ->middleware('permission:coupon.view')
            ->name('usage');
        Route::get('/{coupon}/settings', [CouponController::class, 'settings'])
            // ->middleware('permission:coupon.edit')
            ->name('settings');
    });

    // Reviews Management
    Route::prefix('reviews')->name('reviews.')->group(function () {
        Route::get('/', [ReviewController::class, 'index'])->name('index');
        Route::post('/orders/{order}', [ReviewController::class, 'store'])->name('store');
        Route::put('/{review}', [ReviewController::class, 'update'])->name('update');
        Route::delete('/{review}', [ReviewController::class, 'destroy'])->name('destroy');
    });