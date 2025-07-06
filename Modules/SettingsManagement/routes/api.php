<?php

use Illuminate\Support\Facades\Route;
use Modules\SettingsManagement\Http\Controllers\SettingsManagementController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('settingsmanagements', SettingsManagementController::class)->names('settingsmanagement');
});
