<?php

declare(strict_types=1);

namespace Modules\SettingsManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\SettingsManagement\Services\SystemUpdateService;    
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Modules\SettingsManagement\Services\SystemService;

final class SystemController extends Controller
{
    public function __construct(
        private readonly SystemUpdateService $systemUpdateService,
        private readonly SystemService $systemService
    ) {}

    public function health(): Response
    {
        $healthData = $this->systemService->getSystemHealth();
        
        return Inertia::module('SettingsManagement::System/Health', [
            'healthData' => $healthData
        ]);
    }

    public function logs(): Response
    {
        $logs = $this->systemService->getErrorLogs();
        
        return Inertia::module('SettingsManagement::System/Logs', [
            'logs' => $logs
        ]);
    }

    public function activity(): Response
    {
        $activities = $this->systemService->getActivityLogs();
        
        return Inertia::module('SettingsManagement::System/Activity', [
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

    public function updates(Request $request): Response
    {
        $updateInfo = $this->systemUpdateService->checkForUpdates($request->boolean('force', false));
        $requirements = $this->systemUpdateService->getSystemRequirements();

        return Inertia::module('SettingsManagement::System/Updates', [ 
            'currentVersion' => config('app.version', '1.0.0'),
            'latestVersion' => $updateInfo['latest_version'],
            'changelog' => $updateInfo['changelog'],
            'updateInfo' => [
                'installed_date' => config('app.installed_at', now()->subDays(30))->format('Y-m-d H:i:s'),
                'last_checked' => now()->format('Y-m-d H:i:s'),
                'latest_release_date' => $updateInfo['release_date'],
                'requirements' => $requirements,
                'compatibility' => [
                    'php' => $requirements['php']['compatible'],
                    'mysql' => $requirements['mysql']['compatible'],
                ],
                'current_php_version' => $requirements['php']['current'],
                'current_mysql_version' => $requirements['mysql']['current'],
            ]
        ]);
    }

    public function performUpdate(Request $request)
    {
        $request->validate([
            'version' => 'required|string'
        ]);

        return $this->systemUpdateService->performUpdate($request->version);
    }

    public function uploadUpdate(Request $request)
    {
        $request->validate([
            'update_file' => 'required|file|mimes:zip|max:51200' // 50MB max
        ]);

        $file = $request->file('update_file');
        $path = $file->storeAs('updates/manual', 'update.zip');

        return response()->json([
            'success' => true,
            'message' => 'Update package uploaded successfully',
            'path' => $path
        ]);
    }

    public function runUpdateStep(Request $request)
    {
        $request->validate([
            'step' => 'required|string|in:download,verify,backup,extract,files,database,assets,cleanup'
        ]);

        try {
            $result = match ($request->step) {
                'download' => $this->systemUpdateService->downloadLatestUpdate(),
                'verify' => $this->systemUpdateService->verifyUpdatePackage(),
                'backup' => $this->systemUpdateService->createBackup(),
                'extract' => $this->systemUpdateService->extractUpdate(),
                'files' => $this->systemUpdateService->updateFiles(),
                'database' => $this->systemUpdateService->updateDatabase(),
                'assets' => $this->systemUpdateService->publishAssets(),
                'cleanup' => $this->systemUpdateService->cleanup(),
            };

            return response()->json([
                'success' => true,
                'message' => "Step '{$request->step}' completed successfully",
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function checkRequirements()
    {
        return response()->json([
            'requirements' => $this->systemUpdateService->getSystemRequirements()
        ]);
    }

    public function downloadBackup(Request $request)
    {
        $request->validate([
            'type' => 'required|string|in:database,files'
        ]);

        $backupPath = storage_path('app/updates/backup');
        $filename = match ($request->type) {
            'database' => 'backup-' . now()->format('Y-m-d-His') . '.sql',
            'files' => 'backup-' . now()->format('Y-m-d-His') . '.zip',
        };

        if (!file_exists($backupPath . '/' . $filename)) {
            abort(404, 'Backup file not found');
        }

        return response()->download($backupPath . '/' . $filename);
    }
} 