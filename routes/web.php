<?php

use App\Http\Controllers\Admin\{
    BecomeController,
    BlogController,
    CategoryController,
    CouponController,
    CurrencyController,
    DashboardController,
    DeliveryStaffApplicationController,
    FileController,
    KitchenStaffApplicationController,
    ProductAttributeController,
    ProductController,
    RestaurantController,
    ReviewController,
    RoleController,
    UserController,
    OptionsController,
    ProductAddonCategoryController,
    ProductAddonController,
    RestaurantApplicationController,
    SystemController,
    ZoneController
};


use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\RestaurantStatsController;
use App\Http\Controllers\Admin\RestaurantFavoriteController;
use App\Http\Controllers\Admin\KitchenOrderController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\Restaurant\KitchenStaffController;
use App\Http\Controllers\Frontend\{
    HomeController,
    MenuController,
    OfferController,
    PageController
};
use App\Http\Controllers\Admin\KitchenController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\DeliveryLocationController;
use App\Http\Controllers\DeliveryTrackingController;

/*
|--------------------------------------------------------------------------
| Welcome/Landing Page Route
|--------------------------------------------------------------------------
*/
// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

/*
|--------------------------------------------------------------------------
| Authentication Required Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
    // File Management
    Route::post('app/files/upload', [FileController::class, 'upload']);
    Route::delete('app/files/{file}', [FileController::class, 'destroy']);
    
    // User Profile Updates
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::put('/users/{user}/meta', [UserController::class, 'updateMeta'])->name('users.meta.update');
    Route::put('/users/{user}/avatar', [UserController::class, 'updateAvatar'])->name('users.avatar.update');
    
    // Currency Switching
    Route::post('currency/switch', [\App\Http\Controllers\CurrencyController::class, 'switch'])
        ->name('currency.switch');

    // Orders
    Route::post('/orders/create', [OrderController::class, 'create'])->name('orders.create');
});

/*
|--------------------------------------------------------------------------
| Authenticated & Verified Routes
|--------------------------------------------------------------------------
*/
Route::prefix('app')->name('app.')->middleware(['auth'])->group(function () {
    // Profile Management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    /*
    |--------------------------------------------------------------------------
    | Content Management Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('blogs')->name('blogs.')->group(function () {
        // Blog Management
        Route::resource('/', BlogController::class);
        Route::get('{blog}/preview', [BlogController::class, 'preview'])->name('preview');
        Route::delete('bulk-delete', [BlogController::class, 'bulkDelete'])->name('bulk-delete');
        Route::put('bulk-status', [BlogController::class, 'bulkUpdateStatus'])->name('bulk-status');
    
    });

    // Category Management with Permissions
    Route::group(['prefix' => 'categories', 'as' => 'categories.'], function () {
        Route::get('/', [CategoryController::class, 'index'])->name('index');
        Route::post('/', [CategoryController::class, 'store'])
            // ->middleware('permission:category.create')
            ->name('store');
        Route::get('/{category}', [CategoryController::class, 'show'])
            // ->middleware('permission:category.list')
            ->name('show');
        Route::put('/{category}', [CategoryController::class, 'update'])
            // ->middleware('permission:category.edit')
            ->name('update');
        Route::delete('/{category}', [CategoryController::class, 'destroy'])
            // ->middleware('permission:category.delete')
            ->name('destroy');
        Route::put('/reorder', [CategoryController::class, 'reorder'])
            // ->middleware('permission:category.edit')
            ->name('reorder');
        Route::put('/{category}/move', [CategoryController::class, 'move'])
            // ->middleware('permission:category.edit')
            ->name('move');
        Route::put('/{category}/status', [CategoryController::class, 'updateStatus'])
        // ->middleware('permission:category.edit')
            ->name('status');
        Route::delete('/bulk-delete', [CategoryController::class, 'bulkDelete'])
            // ->middleware('permission:category.delete')
            ->name('bulk-delete');
        Route::put('/bulk-status', [CategoryController::class, 'bulkUpdateStatus'])
            // ->middleware('permission:category.edit')
            ->name('bulk-status');
    });

    /*
    |--------------------------------------------------------------------------
    | User & Role Management Routes
    |--------------------------------------------------------------------------
    */
    // Users Management
    Route::group(['prefix' => 'users', 'as' => 'users.'], function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::get('/create', [UserController::class, 'create'])->name('create');
        Route::post('/', [UserController::class, 'store'])->name('store');
        Route::get('/{user}', [UserController::class, 'show'])->name('show');
        Route::get('/{user}/edit', [UserController::class, 'edit'])->name('edit');
        Route::put('/{user}', [UserController::class, 'update'])->name('update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
        Route::delete('/bulk-delete', [UserController::class, 'bulkDelete'])->name('bulk-delete');
        Route::put('/bulk-status', [UserController::class, 'bulkUpdateStatus'])->name('bulk-status');
    });

    Route::prefix('roles')->name('roles.')->group(function () {
        // Roles Management
        Route::resource('/', RoleController::class);
        Route::put('{role}/permissions', [RoleController::class, 'updatePermissions'])
            ->name('permissions.update');
    });

    /*
    |--------------------------------------------------------------------------
    | E-commerce Related Routes
    |--------------------------------------------------------------------------
    */
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

        // Main product routes - Move this AFTER the addons routes
        Route::resource('/', ProductController::class);
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
    

    /*
    |--------------------------------------------------------------------------
    | Restaurant Management Routes
    |--------------------------------------------------------------------------
    */

    // Restaurant Stats Routes
    Route::group([
        'prefix' => 'restaurants',
        'as' => 'restaurants.',
        'middleware' => ['role:Admin|Restaurant']
        ], function () {
        Route::get('stats', [RestaurantStatsController::class, 'index'])->name('stats');
        Route::post('stats/filter', [RestaurantStatsController::class, 'filter'])->name('stats.filter');
        Route::get('stats/export', [RestaurantStatsController::class, 'export'])
            ->middleware('permission:export-stats')
            ->name('stats.export');
    });

    // Restaurant Applications Management
    Route::group([
        'prefix' => 'restaurants/applications',
        'as' => 'restaurants.applications.',
    ], function () {
        Route::get('/', [RestaurantApplicationController::class, 'index'])->name('index');
        Route::post('/', [RestaurantApplicationController::class, 'store'])->name('store');
        Route::get('/{inquiry}', [RestaurantApplicationController::class, 'show'])->name('show');
        Route::post('/{inquiry}/approve', [RestaurantApplicationController::class, 'approve'])->name('approve');
        Route::post('/{inquiry}/reject', [RestaurantApplicationController::class, 'reject'])->name('reject');
        Route::post('/bulk-approve', [RestaurantApplicationController::class, 'bulkApprove'])->name('bulk-approve');
    });

    
    // Kitchen Staff Application Routes
    Route::group([
        'prefix' => 'kitchen-staff/applications',
        'as' => 'kitchen-staff.applications.',
    ], function () {
        Route::get('/', [KitchenStaffApplicationController::class, 'index'])->name('index');
        Route::post('/', [KitchenStaffApplicationController::class, 'store'])->name('store');
        Route::get('/{inquiry}', [KitchenStaffApplicationController::class, 'show'])->name('show');
        Route::post('/{inquiry}/approve', [KitchenStaffApplicationController::class, 'approve'])->name('approve');
        Route::post('/{inquiry}/reject', [KitchenStaffApplicationController::class, 'reject'])->name('reject');
        Route::post('/bulk-approve', [KitchenStaffApplicationController::class, 'bulkApprove'])->name('bulk-approve');
    });

    // Admin-Only Restaurant Management
    Route::group([
        'prefix' => 'restaurants',
        'as' => 'restaurants.',
        'middleware' => ['role:Admin']
        ], function () {
        Route::get('pending', [RestaurantController::class, 'pending'])->name('pending');
        Route::post('{restaurant}/approve', [RestaurantController::class, 'approve'])->name('approve');
        Route::post('{restaurant}/reject', [RestaurantController::class, 'reject'])->name('reject');
        Route::post('bulk-approve', [RestaurantController::class, 'bulkApprove'])->name('bulk-approve');
    });

    Route::group([
        'prefix' => 'delivery-staff/applications',
        'as' => 'delivery-staff.applications.',
        'middleware' => ['auth']
    ], function () {
        Route::get('/', [DeliveryStaffApplicationController::class, 'index'])->name('index');
        Route::post('/', [DeliveryStaffApplicationController::class, 'store'])->name('store');
        Route::get('/{inquiry}', [DeliveryStaffApplicationController::class, 'show'])->name('show');
        Route::post('/{inquiry}/approve', [DeliveryStaffApplicationController::class, 'approve'])->name('approve');
        Route::post('/{inquiry}/reject', [DeliveryStaffApplicationController::class, 'reject'])->name('reject');
        Route::post('/bulk-approve', [DeliveryStaffApplicationController::class, 'bulkApprove'])->name('bulk-approve');
        Route::post('/bulk-reject', [DeliveryStaffApplicationController::class, 'bulkReject'])->name('bulk-reject');
    });
    

    /*
    |--------------------------------------------------------------------------
    | Settings & Configuration Routes
    |--------------------------------------------------------------------------
    */
    // Options Management
    Route::group(['prefix' => 'options', 'as' => 'options.'], function () {
        Route::get('/', [OptionsController::class, 'index'])->name('index');
        Route::post('/', [OptionsController::class, 'store'])->name('store');
        Route::delete('{key}', [OptionsController::class, 'destroy'])->name('destroy');
    });

    // Settings Management
    Route::group(['prefix' => 'settings', 'as' => 'settings.'], function () {
        // Route::get('/', [SettingsController::class, 'index'])->name('index');
        // Route::get('/', [SettingsController::class, 'index'])->name('index');
        Route::get('/', function () {
            return Inertia::render('Admin/Settings/Index');
        })->name('index');
        Route::get('/store', function () {
            return Inertia::render('Admin/Settings/Store/Index');
        })->name('store');
        // Route::post('/store/update', [SettingsController::class, 'storeUpdate'])->name('store.update');
        // Route::get('/profile', [SettingsController::class, 'profile'])->name('profile');
        Route::get('/profile', function () {
            //
        })->name('profile');
        // Route::post('/profile/update', [SettingsController::class, 'profileUpdate'])->name('profile.update');
        // Route::get('/email', [SettingsController::class, 'email'])->name('email');
        Route::get('/email', [OptionsController::class, 'email'])->name('email');
        // Route::post('/email/update', [SettingsController::class, 'emailUpdate'])->name('email.update');
        // Route::get('/security', [SettingsController::class, 'security'])->name('security');
        Route::get('/security', function () {
            return Inertia::render('Admin/Settings/Security/Index');
        })->name('security');
        // Route::post('/security/update', [SettingsController::class, 'securityUpdate'])->name('security.update');
        // Route::get('/localization', [SettingsController::class, 'localization'])->name('localization');
        Route::get('/localization', function () {
            //
        })->name('localization');

        Route::get('/theme', function () {
            //
        })->name('theme');
        Route::get('/display', function () {
            //
        })->name('display');
        Route::get('/payments', function () {
            //
        })->name('payments');
        Route::get('/shipping', function () {
            //
        })->name('shipping');
        Route::get('/taxes', function () {
            //
        })->name('taxes');
        Route::get('/media', function () {
            //
        })->name('media');
        Route::get('/seo', function () {
            //
        })->name('seo');
        Route::get('/google', function () {
            //
        })->name('google');
        Route::get('/social', function () {
            //
        })->name('social');
        Route::get('/api', function () {
            //
        })->name('api');
        Route::get('/cache', function () {
            //
        })->name('cache');
        Route::get('/logs', function () {
            //
        })->name('logs');
        Route::get('/notifications', function () {
            //
        })->name('notifications');
        // Route::post('/localization/update', [SettingsController::class, 'localizationUpdate'])->name('localization.update');
        // Add more routes as needed
        Route::get('/auth', [OptionsController::class, 'auth'])->name('auth');

        // System Administration Routes
        Route::get('/system', function () {
            return Inertia::render('Admin/Settings/System/Index');
        })->name('system');
        
        Route::get('/system/health', [SystemController::class, 'health'])->name('system.health');
        Route::get('/system/logs', [SystemController::class, 'logs'])->name('system.logs');
        Route::get('/system/activity', [SystemController::class, 'activity'])->name('system.activity');
        Route::post('/system/cache/clear', [SystemController::class, 'clearCache'])->name('system.cache.clear');
        Route::get('/system/updates', [SystemController::class, 'updates'])->name('system.updates');
    });

    // Currency Settings
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('currencies', [CurrencyController::class, 'index'])->name('currencies.index');
        Route::post('currencies', [CurrencyController::class, 'store'])->name('currencies.store');
        Route::put('currencies/{currency}', [CurrencyController::class, 'update'])->name('currencies.update');
        Route::delete('currencies/{currency}', [CurrencyController::class, 'destroy'])->name('currencies.destroy');
        Route::post('currencies/update-rates', [CurrencyController::class, 'updateRates'])->name('currencies.update-rates');
        Route::put('currencies/{currency}/toggle', [CurrencyController::class, 'toggleStatus'])->name('currencies.toggle');
        Route::post('currencies/bulk-action', [CurrencyController::class, 'bulkAction'])->name('currencies.bulk-action');
        Route::post('currencies/convert', [CurrencyController::class, 'convert'])->name('currencies.convert');
    });

     // Zone Management Routes
     
     Route::group(['prefix' => 'logistics', 'as' => 'logistics.'], function () {
        Route::group(['prefix' => 'zones', 'as' => 'zones.'], function () {
            Route::get('/', [ZoneController::class, 'index'])->name('index');
            Route::post('/', [ZoneController::class, 'store'])->name('store');
            Route::get('/{zone}', [ZoneController::class, 'show'])->name('show');
            Route::put('/{zone}', [ZoneController::class, 'update'])->name('update');
            Route::delete('/{zone}', [ZoneController::class, 'destroy'])->name('destroy');
            Route::post('/bulk-action', [ZoneController::class, 'bulkAction'])->name('bulk-action');
            Route::post('/{zone}/status', [ZoneController::class, 'toggleStatus'])->name('toggle-status');
            Route::get('/search', [ZoneController::class, 'search'])->name('search');
            Route::post('/validate-coordinates', [ZoneController::class, 'validateCoordinates'])->name('validate-coordinates');
        });
    });

    // Become Managemenet
    Route::prefix('become')->name('become.')->group(function () {
        Route::get('/restaurant', [BecomeController::class, 'restaurant'])->name('restaurant');
        Route::get('/kitchen/staff', [BecomeController::class, 'kitchen'])->name('kitchen');
        Route::get('/delivery/staff', [BecomeController::class, 'delivery'])->name('delivery');
    });

    // Admin routes
    Route::middleware(['role:Admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        // Other admin routes...
    });

    // Restaurant routes
    Route::middleware(['role:Restaurant'])->prefix('restaurant')->name('restaurant.')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        // Other restaurant routes...
    });

    // Similar route groups for other roles...

    // Favorites Management
    Route::prefix('favorites')->name('favorites.')->group(function () {
        Route::get('/', [RestaurantFavoriteController::class, 'index'])->name('index');
        Route::post('/{restaurant}/toggle', [RestaurantFavoriteController::class, 'toggle'])->name('toggle');
        Route::post('/{restaurant}/note', [RestaurantFavoriteController::class, 'addNote'])->name('note');
    });

    // Kitchen Routes
    Route::prefix('kitchen')->name('kitchen.')->middleware(['role:Kitchen Staff'])->group(function () {
        Route::put('orders/{order}/status', [KitchenOrderController::class, 'updateStatus'])->name('orders.status');
        Route::post('orders/{order}/assign', [KitchenOrderController::class, 'assignStaff'])->name('orders.assign');
        Route::post('orders/{order}/notes', [KitchenOrderController::class, 'addNote'])->name('orders.notes');
        Route::put('orders/{order}/progress', [KitchenOrderController::class, 'updatePreparationProgress'])->name('orders.progress');
        Route::get('load', [KitchenOrderController::class, 'getKitchenLoad'])->name('load');
    });

    Route::middleware(['role:Admin|Restaurant'])->group(function () {
        Route::prefix('products-management')->name('products-management.')->group(function () {
            Route::get('/reports', [ProductController::class, 'reports'])->name('reports');
            Route::get('/analytics', [ProductController::class, 'analytics'])->name('analytics');
            Route::get('/stats', [ProductController::class, 'stats'])->name('stats');
        });
    });

    // Product Attributes
    Route::prefix('product-attributes')->name('product-attributes.')->group(function () {
        Route::get('/', [ProductAttributeController::class, 'index'])->name('index');
        Route::post('/', [ProductAttributeController::class, 'store'])
            // ->middleware('permission:product-attributes.create')
            ->name('store');
        Route::get('/{attribute}', [ProductAttributeController::class, 'show'])
            // ->middleware('permission:product-attributes.list')
            ->name('show');
        Route::get('/{attribute}/edit', [ProductAttributeController::class, 'edit'])
            // ->middleware('permission:product-attributes.edit')
            ->name('edit');
        Route::put('/{attribute}', [ProductAttributeController::class, 'update'])
            // ->middleware('permission:product-attributes.edit')
            ->name('update');
        Route::delete('/{attribute}', [ProductAttributeController::class, 'destroy'])
            // ->middleware('permission:product-attributes.delete')
            ->name('destroy');
        Route::put('/reorder', [ProductAttributeController::class, 'updateOrder'])
            // ->middleware('permission:product-attributes.edit')
            ->name('reorder');
        Route::put('/{attribute}/status', [ProductAttributeController::class, 'updateStatus'])
            ->name('status');
            // ->middleware('permission:product-attributes.edit');
        Route::delete('/bulk-delete', [ProductAttributeController::class, 'bulkDelete'])
            // ->middleware('permission:product-attributes.delete')
            ->name('bulk-delete');
        Route::put('/bulk-status', [ProductAttributeController::class, 'bulkUpdateStatus'])
            // ->middleware('permission:product-attributes.edit')
            ->name('bulk-status');
        Route::get('/{attribute}/values', [ProductAttributeController::class, 'getValues'])
            ->name('values');
        Route::put('/{attribute}/values', [ProductAttributeController::class, 'updateValues'])
            // ->middleware('permission:product-attributes.edit')
            ->name('values.update');
    });

    // Add this inside your auth middleware group
    Route::get('/delivery/track/{orderId}', [DeliveryTrackingController::class, 'show'])
        ->name('delivery.track');

    // Add these routes inside your auth middleware group
    Route::middleware(['auth'])->group(function () {
        Route::prefix('delivery/device')->name('delivery.device.')->group(function () {
            Route::post('pair', [DeliveryTrackingController::class, 'pairDevice'])
                ->name('pair');
            Route::post('unpair', [DeliveryTrackingController::class, 'unpairDevice'])
                ->name('unpair');
            Route::get('active/{deliveryId}', [DeliveryTrackingController::class, 'getActiveDevices'])
                ->name('active');
        });
    });

    // Add this inside your auth middleware group
    Route::post('/contact/submit', [PageController::class, 'submitContact'])->name('contact.submit');

});

/*
|--------------------------------------------------------------------------
| Role-Based Dashboard Access
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:Admin|Restaurant|Kitchen|Delivery|Customer'])->group(function () {
    Route::get('app/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

/*
|--------------------------------------------------------------------------
| Restaurant Public Routes
|--------------------------------------------------------------------------
*/
Route::group(['prefix' => 'app/restaurants', 'as' => 'app.restaurants.'], function () {
    Route::get('/', [RestaurantController::class, 'index'])->name('index');
    Route::get('/create', [RestaurantController::class, 'create'])->name('create'); 
    Route::get('{restaurant}', [RestaurantController::class, 'show'])->name('show');
    Route::get('{restaurant}/edit', [RestaurantController::class, 'edit'])->name('edit');
    Route::put('{restaurant}', [RestaurantController::class, 'update'])->name('update');
    Route::delete('{restaurant}', [RestaurantController::class, 'destroy'])->name('destroy');
    Route::get('stats', [RestaurantStatsController::class, 'index'])->name('stats');
    Route::post('stats/filter', [RestaurantStatsController::class, 'filter'])->name('stats.filter');
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/
Route::get('api/restaurants/stats', [RestaurantStatsController::class, 'index'])
    ->name('api.restaurants.stats')
    ->middleware(['auth']);
Route::get('/api/products/stats', [ProductController::class, 'apiStats'])
    ->name('api.products.stats')
    ->middleware(['auth']);
Route::post('/api/orders/export', [OrderController::class, 'export'])
    ->name('api.orders.export')
    ->middleware(['auth']);
Route::post('/api/orders/update-status', [OrderController::class, 'updateStatus'])
    ->name('orders.update-status')
    ->middleware(['auth']);
// Include authentication routes
require __DIR__ . '/auth.php';


// Kitchen Staff Dashboard Routes
// Route::middleware(['role:Kitchen Staff'])->prefix('kitchen')->name('kitchen.')->group(function () {
//     Route::get('/dashboard', [KitchenDashboardController::class, 'index'])->name('dashboard');
//     Route::get('/orders', [KitchenOrderController::class, 'index'])->name('orders.index');
//     Route::put('/orders/{order}/status', [KitchenOrderController::class, 'updateStatus'])->name('orders.status');
//     Route::get('/schedule', [KitchenScheduleController::class, 'index'])->name('schedule.index');
// });

// Restaurant Kitchen Staff Management Routes
Route::middleware(['auth', 'role:Restaurant'])->group(function () {
    Route::prefix('restaurant/kitchen-staff')->name('restaurant.kitchen-staff.')->group(function () {
        Route::get('/', [KitchenStaffController::class, 'index'])->name('index');
        Route::get('/{inquiry}', [KitchenStaffController::class, 'show'])->name('show');
        Route::put('/{inquiry}/status', [KitchenStaffController::class, 'updateStatus'])->name('status.update');
        Route::post('/{inquiry}/interview', [KitchenStaffController::class, 'scheduleInterview'])->name('interview.schedule');
    });
});

// Add these routes inside your auth middleware group
// Route::group([
//     'prefix' => 'delivery-staff/applications',
//     'as' => 'delivery-staff.applications.',
// ], function () {
//     Route::get('/', [DeliveryStaffApplicationController::class, 'index'])->name('index');
//     Route::post('/', [DeliveryStaffApplicationController::class, 'store'])->name('store');
//     Route::get('/{inquiry}', [DeliveryStaffApplicationController::class, 'show'])->name('show');
//     Route::post('/{inquiry}/approve', [DeliveryStaffApplicationController::class, 'approve'])->name('approve');
//     Route::post('/{inquiry}/reject', [DeliveryStaffApplicationController::class, 'reject'])->name('reject');
//     Route::post('/bulk-approve', [DeliveryStaffApplicationController::class, 'bulkApprove'])->name('bulk-approve');
// });

// Add these routes inside your auth middleware group

// Frontend Routes
Route::name('frontend.')->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/about', [PageController::class, 'about'])->name('about');
    Route::get('/menu', [MenuController::class, 'index'])->name('menu');
    Route::get('/menu/{menu}', [MenuController::class, 'show'])->name('menu.show');
    Route::get('/restaurants', [PageController::class, 'restaurants'])->name('restaurants');
    Route::get('/offers', [OfferController::class, 'index'])->name('offers');
    Route::get('/contact', [PageController::class, 'contact'])->name('contact');
    Route::get('/restaurant/{restaurant}', [PageController::class, 'restaurantSingle'])->name('restaurant.single');
    Route::get('/blogs', [PageController::class, 'blogs'])->name('blogs');
    Route::get('/blog/{blog}', [PageController::class, 'blogSingle'])->name('blog.single');
});

// Add these routes inside your auth middleware group
Route::middleware(['auth', 'role:Kitchen Staff'])->group(function () {
    Route::prefix('app/kitchen')->name('kitchen.')->group(function () {
        Route::get('/', [KitchenController::class, 'index'])->name('index');
        Route::put('/orders/{order}/status', [KitchenController::class, 'updateStatus'])->name('orders.status');
    });
});

Route::middleware(['auth'])->group(function () {
    Route::prefix('app/delivery')->name('delivery.')->group(function () {
        Route::post('location/update', [DeliveryLocationController::class, 'update'])
            ->name('location.update');
        Route::get('location/history/{deliveryId}', [DeliveryLocationController::class, 'history'])
            ->name('location.history');
        Route::get('stats/{deliveryId}', [DeliveryLocationController::class, 'stats'])
            ->name('stats');
        Route::put('{deliveryId}/status', [DeliveryLocationController::class, 'updateStatus'])
            ->name('status.update');
        
        // Add device pairing routes
        Route::post('device/pair', [DeliveryLocationController::class, 'pairDevice'])
            ->name('device.pair');
        Route::post('device/unpair', [DeliveryLocationController::class, 'unpairDevice'])
            ->name('device.unpair');
        Route::get('device/active/{deliveryId}', [DeliveryLocationController::class, 'getActiveDevices'])
            ->name('device.active');
    });
});


Route::prefix('app/settings/system')->name('app.settings.system.')->group(function () {
    Route::get('/updates', [SystemController::class, 'updates'])->name('updates');
    Route::post('/updates/perform', [SystemController::class, 'performUpdate'])->name('updates.perform');
    Route::post('/updates/upload', [SystemController::class, 'uploadUpdate'])->name('updates.upload');
    Route::post('/updates/step', [SystemController::class, 'runUpdateStep'])->name('updates.step');
    Route::get('/updates/requirements', [SystemController::class, 'checkRequirements'])->name('updates.requirements');
    Route::get('/updates/backup/{type}', [SystemController::class, 'downloadBackup'])->name('updates.backup');
});

// Route Redirects
Route::redirect('/admin', '/app/dashboard');
Route::redirect('/admin/dashboard', '/app/dashboard');
