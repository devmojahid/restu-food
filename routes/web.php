<?php

use App\Http\Controllers\Admin\{
    BlogController,
    CategoryController,
    DashboardController,
    FileController,
    RoleController,
    UserController
};
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
                    ->middleware('permission:create categories')
                    ->name('store');
                Route::get('/{category}', [CategoryController::class, 'show'])
                    ->middleware('permission:view categories')
                    ->name('show');
                Route::put('/{category}', [CategoryController::class, 'update'])
                    ->middleware('permission:edit categories')
                    ->name('update');
                Route::delete('/{category}', [CategoryController::class, 'destroy'])
                    ->middleware('permission:delete categories')
                    ->name('destroy');
                Route::put('/reorder', [CategoryController::class, 'reorder'])
                    ->middleware('permission:edit categories')
                    ->name('reorder');
                Route::put('/{category}/move', [CategoryController::class, 'move'])
                    ->middleware('permission:edit categories')
                    ->name('move');
                Route::put('/{category}/status', [CategoryController::class, 'updateStatus'])
                    ->middleware('permission:edit categories')
                    ->name('status');
                Route::delete('/bulk-delete', [CategoryController::class, 'bulkDelete'])
                    ->middleware('permission:delete categories')
                    ->name('bulk-delete');
                Route::put('/bulk-status', [CategoryController::class, 'bulkUpdateStatus'])
                    ->middleware('permission:edit categories')
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

    /**
     * Roles Management
     */
    Route::name('app.')->group(function () {
        Route::resource('roles', RoleController::class);
        Route::put('roles/{role}/permissions', [RoleController::class, 'updatePermissions'])
            ->name('roles.permissions.update');
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
            //
        })->name('store');
        // Route::post('/store/update', [SettingsController::class, 'storeUpdate'])->name('store.update');
        // Route::get('/profile', [SettingsController::class, 'profile'])->name('profile');
        Route::get('/profile', function () {
            //
        })->name('profile');
        // Route::post('/profile/update', [SettingsController::class, 'profileUpdate'])->name('profile.update');
        // Route::get('/email', [SettingsController::class, 'email'])->name('email');
        Route::get('/email', function () {
            return Inertia::render('Admin/Settings/Email/Index');
        })->name('email');
        // Route::post('/email/update', [SettingsController::class, 'emailUpdate'])->name('email.update');
        // Route::get('/security', [SettingsController::class, 'security'])->name('security');
        Route::get('/security', function () {
            //
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
    });

    /**
     * Categories Management
     */
    Route::name('app.')->group(function () {
        Route::resource('categories', CategoryController::class);
        Route::put('categories/reorder', [CategoryController::class, 'reorder'])->name('categories.reorder');
        Route::put('categories/{category}/move', [CategoryController::class, 'move'])->name('categories.move');
        Route::put('categories/{category}/status', [CategoryController::class, 'updateStatus'])->name('categories.status');
    });
});


Route::middleware(['auth', 'role:Admin|Branch Manager|Kitchen Staff|Delivery Personnel|Customer'])->group(function () {
    Route::get('app/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

require __DIR__ . '/auth.php';
