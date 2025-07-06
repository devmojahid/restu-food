<?php

use Illuminate\Support\Facades\Route;
use Modules\Blog\Http\Controllers\BlogController;

/*
|--------------------------------------------------------------------------
| Content Management Routes
|--------------------------------------------------------------------------
*/
Route::prefix('app')->name('app.')->middleware(['auth'])->group(function () {
    Route::resource('blogs', BlogController::class);
    Route::prefix('blogs')->name('blogs.')->group(function () {
        // Blog Management
        Route::get('{blog}/preview', [BlogController::class, 'preview'])->name('preview');
        Route::delete('bulk-delete', [BlogController::class, 'bulkDelete'])->name('bulk-delete');
        Route::put('bulk-status', [BlogController::class, 'bulkUpdateStatus'])->name('bulk-status');
    
    });
});