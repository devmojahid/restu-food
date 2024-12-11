<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\SystemService;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Artisan;

final class SystemController extends Controller
{
    public function __construct(
        private readonly SystemService $systemService
    ) {}

    public function health(): Response
    {
        $healthData = $this->systemService->getSystemHealth();
        
        return Inertia::render('Admin/Settings/System/Health', [
            'healthData' => $healthData
        ]);
    }

    public function logs(): Response
    {
        $logs = $this->systemService->getErrorLogs();
        
        return Inertia::render('Admin/Settings/System/Logs', [
            'logs' => $logs
        ]);
    }

    public function activity(): Response
    {
        $activities = $this->systemService->getActivityLogs();
        
        return Inertia::render('Admin/Settings/System/Activity', [
            'activities' => $activities
        ]);
    }

    public function clearCache(Request $request)
    {
        try {
            $this->systemService->clearCache();
            return back()->with('success', 'Cache cleared successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to clear cache');
        }
    }

    public function updates(): Response
    {
        $updateInfo = $this->systemService->getUpdateInfo();
        
        return Inertia::render('Admin/Settings/System/Updates', [
            'updateInfo' => $updateInfo
        ]);
    }
} 