<?php

use App\Http\Controllers\Admin\{
    BlogController,
    CategoryController,
    CouponController,
    CurrencyController,
    DashboardController,
    FileController,
    ProductAttributeController,
    ProductController,
    RestaurantController,
    ReviewController,
    RoleController,
    UserController
};
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\OptionsController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\RestaurantStatsController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth'])->group(function () {
    Route::post('app/files/upload', [FileController::class, 'upload']);
    Route::delete('app/files/{file}', [FileController::class, 'destroy']);
    // User profile routes
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::put('/users/{user}/meta', [UserController::class, 'updateMeta'])->name('users.meta.update');
    Route::put('/users/{user}/avatar', [UserController::class, 'updateAvatar'])->name('users.avatar.update');
});

// Route::get('admin/dashboard', function () {
//     return Inertia::render('Admin/Dashboard/Index');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::prefix('app')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    /*
    * Blogs
    */
    Route::name('app.')->group(function () {
        Route::resource('blogs', BlogController::class);
        Route::get('blogs/{blog}/preview', [BlogController::class, 'preview'])->name('blogs.preview');
        Route::delete('blogs/bulk-delete', [BlogController::class, 'bulkDelete'])->name('blogs.bulk-delete');
        Route::put('blogs/bulk-status', [BlogController::class, 'bulkUpdateStatus'])->name('blogs.bulk-status');
        /*
        * Categories
        */
        Route::name('app.')->group(function () {
            // Categories routes with permissions
            Route::group(['prefix' => 'categories', 'as' => 'categories.'], function () {
                Route::get('/', [CategoryController::class, 'index'])->name('index');
                Route::post('/', [CategoryController::class, 'store'])
                    ->middleware('permission:category.create')
                    ->name('store');
                Route::get('/{category}', [CategoryController::class, 'show'])
                    ->middleware('permission:category.list')
                    ->name('show');
                Route::put('/{category}', [CategoryController::class, 'update'])
                    ->middleware('permission:category.edit')
                    ->name('update');
                Route::delete('/{category}', [CategoryController::class, 'destroy'])
                    ->middleware('permission:category.delete')
                    ->name('destroy');
                Route::put('/reorder', [CategoryController::class, 'reorder'])
                    ->middleware('permission:category.edit')
                    ->name('reorder');
                Route::put('/{category}/move', [CategoryController::class, 'move'])
                    ->middleware('permission:category.edit')
                    ->name('move');
                Route::put('/{category}/status', [CategoryController::class, 'updateStatus'])
                    ->name('status')
                    ->middleware('permission:category.edit');
                Route::delete('/bulk-delete', [CategoryController::class, 'bulkDelete'])
                    ->middleware('permission:category.delete')
                    ->name('bulk-delete');
                Route::put('/bulk-status', [CategoryController::class, 'bulkUpdateStatus'])
                    ->middleware('permission:category.edit')
                    ->name('bulk-status');
            });
        });
    });
    /**
     * Users Management
     */
    Route::group(['prefix' => 'users', 'as' => 'app.users.'], function () {
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
    Route::name('app.')->group(function () {
        /**
         * Roles Management
         */
        Route::resource('roles', RoleController::class);
        Route::put('roles/{role}/permissions', [RoleController::class, 'updatePermissions'])
            ->name('roles.permissions.update');
        
        /**
         * Categories Management
         */
        Route::resource('categories', CategoryController::class);
        Route::put('categories/reorder', [CategoryController::class, 'reorder'])->name('categories.reorder');
        Route::put('categories/{category}/move', [CategoryController::class, 'move'])->name('categories.move');
        Route::put('categories/{category}/status', [CategoryController::class, 'updateStatus'])->name('categories.status');

        /**
         * Products Management
         */
        Route::resource('products', ProductController::class);
    });

    // Options Management Routes
    Route::group(['prefix' => 'options', 'as' => 'options.'], function () {
        Route::get('/', [OptionsController::class, 'index'])->name('index');
        Route::post('/', [OptionsController::class, 'store'])->name('store');
        Route::delete('{key}', [OptionsController::class, 'destroy'])->name('destroy');
    });

    /*
    * Settings
    */
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
    });

    Route::name('app.')->group(function () {
        // Product Attributes routes
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
        Route::group(['prefix' => 'reviews', 'as' => 'reviews.'], function () {
            Route::get('/', [ReviewController::class, 'index'])->name('index');
            Route::get('/{review}', [ReviewController::class, 'show'])->name('show');
            Route::put('/{review}/approve', [ReviewController::class, 'approve'])->name('approve');
            Route::put('/{review}/reject', [ReviewController::class, 'reject'])->name('reject');
            Route::delete('/{review}', [ReviewController::class, 'destroy'])->name('destroy');
            Route::post('/bulk-approve', [ReviewController::class, 'bulkApprove'])->name('bulk-approve');
            Route::post('/bulk-reject', [ReviewController::class, 'bulkReject'])->name('bulk-reject');
            Route::delete('/bulk-delete', [ReviewController::class, 'bulkDelete'])->name('bulk-delete');
            Route::post('/{review}/vote', [ReviewController::class, 'vote'])->name('vote');
            Route::post('/{review}/report', [ReviewController::class, 'report'])->name('report');
            Route::post('/{review}/reply', [ReviewController::class, 'reply'])->name('reply');
        });
    });

    // Restaurant Management Routes with Role-Based Access
    Route::middleware(['auth', 'verified'])->prefix('app')->name('app.')->group(function () {
        // Restaurant Stats Routes - Available to Restaurant Owners and Admins
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

        // Restaurant Management Routes - Admin Only
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

        // Restaurant Dashboard Routes - Restaurant Staff
        // Route::group([
        //     'prefix' => 'restaurants',
        //     'as' => 'restaurants.',
        //     'middleware' => ['role:Restaurant|Kitchen Staff']
        // ], function () {
        //     Route::get('dashboard', [RestaurantDashboardController::class, 'index'])->name('dashboard');
        //     Route::get('orders', [RestaurantOrderController::class, 'index'])->name('orders.index');
        //     Route::get('menu', [RestaurantMenuController::class, 'index'])->name('menu.index');
        //     Route::get('staff', [RestaurantStaffController::class, 'index'])
        //         ->middleware('permission:manage-staff')
        //         ->name('staff.index');
        // });
    });

});


Route::middleware(['auth', 'role:Admin|Restaurant|Kitchen Staff|Delivery Personnel|Customer'])->group(function () {
    Route::get('app/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// Currency routes
Route::middleware(['auth'])->prefix('app/settings')->name('app.settings.')->group(function () {
    Route::get('currencies', [CurrencyController::class, 'index'])->name('currencies.index');
    Route::post('currencies', [CurrencyController::class, 'store'])->name('currencies.store');
    Route::put('currencies/{currency}', [CurrencyController::class, 'update'])->name('currencies.update');
    Route::delete('currencies/{currency}', [CurrencyController::class, 'destroy'])->name('currencies.destroy');
    Route::post('currencies/update-rates', [CurrencyController::class, 'updateRates'])->name('currencies.update-rates');
    Route::put('currencies/{currency}/toggle', [CurrencyController::class, 'toggleStatus'])->name('currencies.toggle');
    Route::post('currencies/bulk-action', [CurrencyController::class, 'bulkAction'])->name('currencies.bulk-action');
    Route::post('currencies/convert', [CurrencyController::class, 'convert'])->name('currencies.convert');
});

Route::post('currency/switch', [\App\Http\Controllers\CurrencyController::class, 'switch'])
    ->middleware(['auth'])
    ->name('currency.switch');

require __DIR__ . '/auth.php';

// Restaurant Stats API
Route::get('api/restaurants/stats', [RestaurantStatsController::class, 'index'])
    ->name('api.restaurants.stats')
    ->middleware(['auth']);

// Restaurant Stats Routes
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
