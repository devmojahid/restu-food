<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use Modules\SettingsManagement\Http\Controllers\{
    CurrencyController,
    OptionsController,
    SystemController,
};


Route::prefix('app')->name('app.')->middleware(['auth'])->group(function () {
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
            return Inertia::module('SettingsManagement::Index'); 
        })->name('index');
        Route::get('/store', function () {
            return Inertia::module('SettingsManagement::Store/Index');
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
            return Inertia::module('SettingsManagement::Security/Index');
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
            return Inertia::module('SettingsManagement::System/Index');
        })->name('system');
        
        Route::get('/system/health', [SystemController::class, 'health'])->name('system.health');
        Route::get('/system/logs', [SystemController::class, 'logs'])->name('system.logs');
        Route::get('/system/activity', [SystemController::class, 'activity'])->name('system.activity');
        Route::post('/system/cache/clear', [SystemController::class, 'clearCache'])->name('system.cache.clear');
        Route::get('/system/updates', [SystemController::class, 'updates'])->name('system.updates');

        Route::prefix('/system')->name('system.')->group(function () {
            Route::get('/updates', [SystemController::class, 'updates'])->name('updates');
            Route::post('/updates/perform', [SystemController::class, 'performUpdate'])->name('updates.perform');
            Route::post('/updates/upload', [SystemController::class, 'uploadUpdate'])->name('updates.upload');
            Route::post('/updates/step', [SystemController::class, 'runUpdateStep'])->name('updates.step');
            Route::get('/updates/requirements', [SystemController::class, 'checkRequirements'])->name('updates.requirements');
            Route::get('/updates/backup/{type}', [SystemController::class, 'downloadBackup'])->name('updates.backup');
        });

        // Currency Settings
        Route::get('currencies', [CurrencyController::class, 'index'])->name('currencies.index');
        Route::post('currencies', [CurrencyController::class, 'store'])->name('currencies.store');
        Route::put('currencies/{currency}', [CurrencyController::class, 'update'])->name('currencies.update');
        Route::delete('currencies/{currency}', [CurrencyController::class, 'destroy'])->name('currencies.destroy');
        Route::post('currencies/update-rates', [CurrencyController::class, 'updateRates'])->name('currencies.update-rates');
        Route::put('currencies/{currency}/toggle', [CurrencyController::class, 'toggleStatus'])->name('currencies.toggle');
        Route::post('currencies/bulk-action', [CurrencyController::class, 'bulkAction'])->name('currencies.bulk-action');
        Route::post('currencies/convert', [CurrencyController::class, 'convert'])->name('currencies.convert');

        Route::post('currency/switch', [CurrencyController::class, 'switch'])
        ->name('currency.switch');
    });

});