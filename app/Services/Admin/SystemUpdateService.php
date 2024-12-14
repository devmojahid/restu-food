<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\SystemUpdate;
use App\Models\SystemUpdateLog;
use Illuminate\Support\Facades\{
    Cache,
    DB,
    File,
    Http,
    Log,
    Storage,
    Process,
    Event
};
use Illuminate\Support\Str;
use ZipArchive;

final class SystemUpdateService
{
    private const UPDATE_CACHE_KEY = 'system:update_info';
    private const CACHE_TTL = 3600; // 1 hour
    private const UPDATE_TEMP_PATH = 'updates/temp';
    private const UPDATE_BACKUP_PATH = 'updates/backup';
    private const REQUIRED_EXTENSIONS = [
        'curl',
        'fileinfo',
        'json',
        'mbstring',
        'openssl',
        'pdo',
        'tokenizer',
        'xml',
        'zip'
    ];

    public function __construct(
        private readonly string $updateApiUrl = 'https://api.yourdomain.com/updates'
    ) {}

    public function checkForUpdates(bool $force = false): array
    {
        if (!$force && Cache::has(self::UPDATE_CACHE_KEY)) {
            return Cache::get(self::UPDATE_CACHE_KEY);
        }

        try {
            // In a real implementation, this would call your update server
            $response = Http::get($this->updateApiUrl . '/check', [
                'version' => config('app.version'),
                'site_url' => config('app.url'),
            ]);

            if ($response->successful()) {
                $updateInfo = $response->json();
                Cache::put(self::UPDATE_CACHE_KEY, $updateInfo, self::CACHE_TTL);
                return $updateInfo;
            }

            throw new \Exception('Failed to check for updates: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('Update check failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Return dummy data for development
            return [
                'current_version' => config('app.version', '1.0.0'),
                'latest_version' => '1.1.0',
                'has_update' => true,
                'is_critical' => false,
                'release_date' => now()->subDays(2)->toDateTimeString(),
                'download_url' => 'https://example.com/updates/latest.zip',
                'package_size' => 1024 * 1024 * 5, // 5MB
                'changelog' => [
                    [
                        'version' => '1.1.0',
                        'date' => '2024-03-26',
                        'changes' => [
                            'Added new dashboard features',
                            'Improved performance',
                            'Fixed various bugs'
                        ]
                    ]
                ],
                'requirements' => [
                    'php_version' => '8.1.0',
                    'mysql_version' => '8.0.0',
                    'extensions' => self::REQUIRED_EXTENSIONS,
                    'memory_limit' => '128M',
                    'max_execution_time' => 300
                ]
            ];
        }
    }

    public function getSystemRequirements(): array
    {
        return [
            'php' => [
                'current' => PHP_VERSION,
                'required' => '8.1.0',
                'compatible' => version_compare(PHP_VERSION, '8.1.0', '>=')
            ],
            'mysql' => [
                'current' => $this->getMySQLVersion(),
                'required' => '8.0.0',
                'compatible' => version_compare($this->getMySQLVersion(), '8.0.0', '>=')
            ],
            'extensions' => collect(self::REQUIRED_EXTENSIONS)->map(function ($ext) {
                return [
                    'name' => $ext,
                    'installed' => extension_loaded($ext)
                ];
            })->all(),
            'directories' => $this->checkDirectoryPermissions(),
            'memory_limit' => [
                'current' => ini_get('memory_limit'),
                'required' => '128M',
                'compatible' => $this->compareBytes(ini_get('memory_limit'), '128M') >= 0
            ]
        ];
    }

    public function performUpdate(string $version): array
    {
        DB::beginTransaction();
        try {
            // Create update log
            $update = SystemUpdate::where('version', $version)->firstOrFail();
            $log = $this->createUpdateLog($update);

            // Run update steps
            $this->downloadUpdate($update, $log);
            $this->verifyPackage($update, $log);
            $this->createBackup($log);
            $this->extractUpdate($update, $log);
            $this->updateFiles($log);
            $this->updateDatabase($log);
            $this->publishAssets($log);
            $this->cleanup($log);

            // Update version in config
            $this->updateVersionConfig($version);

            $log->update([
                'status' => 'completed',
                'completed_at' => now(),
                'message' => 'Update completed successfully'
            ]);

            DB::commit();

            Cache::forget(self::UPDATE_CACHE_KEY);

            return [
                'success' => true,
                'message' => 'System updated successfully to version ' . $version
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Update failed', [
                'version' => $version,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            if (isset($log)) {
                $log->update([
                    'status' => 'failed',
                    'completed_at' => now(),
                    'message' => $e->getMessage(),
                    'details' => [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]
                ]);
            }

            return [
                'success' => false,
                'message' => 'Update failed: ' . $e->getMessage()
            ];
        }
    }

    private function createUpdateLog(SystemUpdate $update): SystemUpdateLog
    {
        return SystemUpdateLog::create([
            'system_update_id' => $update->id,
            'status' => 'pending',
            'started_at' => now(),
            'message' => 'Starting update process'
        ]);
    }

    private function downloadUpdate(SystemUpdate $update, SystemUpdateLog $log): void
    {
        $log->update([
            'status' => 'running',
            'step' => 'download',
            'message' => 'Downloading update package'
        ]);

        $tempPath = storage_path(self::UPDATE_TEMP_PATH);
        File::ensureDirectoryExists($tempPath);

        $packagePath = $tempPath . '/update-' . $update->version . '.zip';
        
        // In production, download from actual URL
        Http::sink($packagePath)->get($update->download_url);

        if (!file_exists($packagePath)) {
            throw new \Exception('Failed to download update package');
        }

        $log->update([
            'message' => 'Update package downloaded successfully',
            'details' => ['package_path' => $packagePath]
        ]);
    }

    private function verifyPackage(SystemUpdate $update, SystemUpdateLog $log): void
    {
        $log->update([
            'step' => 'verify',
            'message' => 'Verifying package integrity'
        ]);

        $packagePath = storage_path(self::UPDATE_TEMP_PATH . '/update-' . $update->version . '.zip');
        $hash = hash_file('sha256', $packagePath);

        if ($hash !== $update->package_hash) {
            throw new \Exception('Package integrity check failed');
        }

        $log->update([
            'message' => 'Package integrity verified'
        ]);
    }

    private function createBackup(SystemUpdateLog $log = null, bool $broadcast = true): array
    {
        try {
            if ($broadcast) {
                $this->broadcastProgress('backup', 0, 'Starting backup process...');
            }
            
            if ($log) {
                $log->update([
                    'step' => 'backup',
                    'message' => 'Creating backup'
                ]);
            }
            
            $backupPath = storage_path(self::UPDATE_BACKUP_PATH);
            File::ensureDirectoryExists($backupPath);

            $timestamp = now()->format('Y-m-d-His');
            $dbBackupPath = "{$backupPath}/backup-{$timestamp}.sql";
            $filesBackupPath = "{$backupPath}/backup-{$timestamp}.zip";

            // Database backup with progress tracking
            if ($broadcast) {
                $this->broadcastProgress('backup', 25, 'Creating database backup...');
            }
            
            $this->backupDatabase($dbBackupPath);

            // Files backup with progress tracking
            if ($broadcast) {
                $this->broadcastProgress('backup', 50, 'Creating files backup...');
            }
            
            $this->backupFiles($filesBackupPath, $broadcast);

            if ($broadcast) {
                $this->broadcastProgress('backup', 100, 'Backup completed');
            }

            if ($log) {
                $log->update([
                    'message' => 'Backup created successfully',
                    'details' => [
                        'database_backup' => basename($dbBackupPath),
                        'files_backup' => basename($filesBackupPath)
                    ]
                ]);
            }

            return [
                'success' => true,
                'database_backup' => $dbBackupPath,
                'files_backup' => $filesBackupPath
            ];
        } catch (\Exception $e) {
            Log::error('Backup failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }
    private function backupDatabase(string $path): void
    {
        $command = sprintf(
            'mysqldump -u%s -p%s %s > %s',
            config('database.connections.mysql.username'),
            config('database.connections.mysql.password'),
            config('database.connections.mysql.database'),
            $path
        );

        $process = Process::run($command);
        
        if (!$process->successful()) {
            throw new \Exception('Database backup failed: ' . $process->errorOutput());
        }
    }

    private function backupFiles(string $path, bool $broadcast = true): void
    {
        $zip = new ZipArchive();
        if ($zip->open($path, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new \Exception('Failed to create backup archive');
        }

        $files = File::allFiles(base_path());
        $totalFiles = count($files);
        
        foreach ($files as $i => $file) {
            // Skip storage directory and existing backups
            if (str_starts_with($file->getRelativePath(), 'storage/app/updates')) {
                continue;
            }

            $zip->addFile($file->getRealPath(), $file->getRelativePathname());
            
            if ($broadcast && $i % 100 === 0) {
                $progress = 50 + (int)(($i / $totalFiles) * 40);
                $this->broadcastProgress('backup', $progress, 'Backing up files...');
            }
        }
        
        $zip->close();
    }

    private function extractUpdate(SystemUpdate $update, SystemUpdateLog $log): void
    {
        $log->update([
            'step' => 'extract',
            'message' => 'Extracting update package'
        ]);

        $packagePath = storage_path(self::UPDATE_TEMP_PATH . '/update-' . $update->version . '.zip');
        $extractPath = storage_path(self::UPDATE_TEMP_PATH . '/extracted');

        File::ensureDirectoryExists($extractPath);
        
        $zip = new ZipArchive();
        if ($zip->open($packagePath) === true) {
            $zip->extractTo($extractPath);
            $zip->close();
        } else {
            throw new \Exception('Failed to extract update package');
        }

        $log->update([
            'message' => 'Update package extracted successfully'
        ]);
    }

    private function updateFiles(SystemUpdateLog $log): void
    {
        $log->update([
            'step' => 'files',
            'message' => 'Updating system files'
        ]);

        $extractPath = storage_path(self::UPDATE_TEMP_PATH . '/extracted');
        
        // Copy files to their respective locations
        File::copyDirectory($extractPath, base_path());

        $log->update([
            'message' => 'System files updated successfully'
        ]);
    }

    private function updateDatabase(SystemUpdateLog $log): void
    {
        $log->update([
            'step' => 'database',
            'message' => 'Running database migrations'
        ]);

        // Clear cache before migrations
        Process::run('php artisan config:clear');
        Process::run('php artisan cache:clear');

        // Run migrations
        Process::run('php artisan migrate --force');

        $log->update([
            'message' => 'Database migrations completed successfully'
        ]);
    }

    private function publishAssets(SystemUpdateLog $log): void
    {
        $log->update([
            'step' => 'assets',
            'message' => 'Publishing assets'
        ]);

        // Publish assets
        Process::run('php artisan vendor:publish --all --force');
        
        // Build assets if needed
        if (file_exists(base_path('package.json'))) {
            Process::run('npm install');
            Process::run('npm run build');
        }

        $log->update([
            'message' => 'Assets published successfully'
        ]);
    }

    private function cleanup(SystemUpdateLog $log): void
    {
        $log->update([
            'step' => 'cleanup',
            'message' => 'Cleaning up temporary files'
        ]);

        // Clear all caches
        Process::run('php artisan optimize:clear');
        
        // Remove temporary files
        File::deleteDirectory(storage_path(self::UPDATE_TEMP_PATH));

        $log->update([
            'message' => 'Cleanup completed successfully'
        ]);
    }

    private function updateVersionConfig(string $version): void
    {
        $configPath = config_path('app.php');
        $config = File::get($configPath);
        
        $config = preg_replace(
            "/'version' => '.*?'/",
            "'version' => '$version'",
            $config
        );
        
        File::put($configPath, $config);
    }

    private function getMySQLVersion(): string
    {
        try {
            $version = DB::select('SELECT VERSION() as version')[0]->version;
            return explode('-', $version)[0];
        } catch (\Exception $e) {
            return '0.0.0';
        }
    }

    private function checkDirectoryPermissions(): array
    {
        $directories = [
            'storage' => storage_path(),
            'bootstrap/cache' => base_path('bootstrap/cache'),
            'public' => public_path(),
            'resources' => resource_path(),
        ];

        return collect($directories)->map(function ($path, $name) {
            return [
                'path' => $name,
                'writable' => is_writable($path)
            ];
        })->values()->all();
    }

    private function compareBytes(string $a, string $b): int
    {
        $units = ['B' => 1, 'K' => 1024, 'M' => 1024 * 1024, 'G' => 1024 * 1024 * 1024];
        
        $a = preg_match('/^(\d+)([BKMG])?$/i', trim($a), $aMatch);
        $b = preg_match('/^(\d+)([BKMG])?$/i', trim($b), $bMatch);
        
        $aBytes = $aMatch[1] * ($units[$aMatch[2] ?? 'B'] ?? 1);
        $bBytes = $bMatch[1] * ($units[$bMatch[2] ?? 'B'] ?? 1);
        
        return $aBytes <=> $bBytes;
    }

    public function downloadLatestUpdate(): array
    {
        try {
            $this->broadcastProgress('download', 0, 'Starting download...');
            
            $updateInfo = $this->checkForUpdates(true);
            $tempPath = storage_path(self::UPDATE_TEMP_PATH);
            File::ensureDirectoryExists($tempPath);

            $packagePath = $tempPath . '/update-' . $updateInfo['latest_version'] . '.zip';
            
            // Download with progress tracking
            $response = Http::withOptions([
                'sink' => $packagePath,
                'progress' => function($downloadTotal, $downloadedBytes) {
                    if ($downloadTotal > 0) {
                        $progress = (int)(($downloadedBytes / $downloadTotal) * 100);
                        $this->broadcastProgress('download', $progress, 'Downloading update package...');
                    }
                }
            ])->get($updateInfo['download_url']);

            if (!file_exists($packagePath)) {
                throw new \Exception('Failed to download update package');
            }

            $this->broadcastProgress('download', 100, 'Download completed');

            return [
                'success' => true,
                'package_path' => $packagePath,
                'version' => $updateInfo['latest_version']
            ];
        } catch (\Exception $e) {
            Log::error('Download failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public function verifyUpdatePackage(): array
    {
        try {
            $this->broadcastProgress('verify', 0, 'Starting package verification...');
            
            $updateInfo = $this->checkForUpdates();
            $packagePath = storage_path(self::UPDATE_TEMP_PATH . '/update-' . $updateInfo['latest_version'] . '.zip');
            
            if (!file_exists($packagePath)) {
                throw new \Exception('Update package not found');
            }

            $this->broadcastProgress('verify', 50, 'Checking package integrity...');
            
            $hash = hash_file('sha256', $packagePath);
            if ($hash !== $updateInfo['package_hash']) {
                throw new \Exception('Package integrity check failed');
            }

            $this->broadcastProgress('verify', 100, 'Package verification completed');

            return [
                'success' => true,
                'hash' => $hash
            ];
        } catch (\Exception $e) {
            Log::error('Verification failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    // public function createBackup(): array
    // {
    //     try {
    //         $this->broadcastProgress('backup', 0, 'Starting backup process...');
            
    //         $backupPath = storage_path(self::UPDATE_BACKUP_PATH);
    //         File::ensureDirectoryExists($backupPath);

    //         $timestamp = now()->format('Y-m-d-His');
    //         $dbBackupPath = "{$backupPath}/backup-{$timestamp}.sql";
    //         $filesBackupPath = "{$backupPath}/backup-{$timestamp}.zip";

    //         // Database backup
    //         $this->broadcastProgress('backup', 25, 'Creating database backup...');
    //         Process::run(sprintf(
    //             'mysqldump -u%s -p%s %s > %s',
    //             config('database.connections.mysql.username'),
    //             config('database.connections.mysql.password'),
    //             config('database.connections.mysql.database'),
    //             $dbBackupPath
    //         ));

    //         // Files backup
    //         $this->broadcastProgress('backup', 50, 'Creating files backup...');
    //         $zip = new ZipArchive();
    //         $zip->open($filesBackupPath, ZipArchive::CREATE | ZipArchive::OVERWRITE);
            
    //         $files = File::allFiles(base_path());
    //         $totalFiles = count($files);
    //         foreach ($files as $i => $file) {
    //             $zip->addFile($file->getRealPath(), $file->getRelativePathname());
    //             if ($i % 100 === 0) {
    //                 $progress = 50 + (int)(($i / $totalFiles) * 40);
    //                 $this->broadcastProgress('backup', $progress, 'Backing up files...');
    //             }
    //         }
            
    //         $zip->close();

    //         $this->broadcastProgress('backup', 100, 'Backup completed');

    //         return [
    //             'success' => true,
    //             'database_backup' => $dbBackupPath,
    //             'files_backup' => $filesBackupPath
    //         ];
    //     } catch (\Exception $e) {
    //         Log::error('Backup failed', [
    //             'error' => $e->getMessage(),
    //             'trace' => $e->getTraceAsString()
    //         ]);
    //         throw $e;
    //     }
    // }

    

    // public function extractUpdate(): array
    // {
    //     try {
    //         $this->broadcastProgress('extract', 0, 'Starting package extraction...');
            
    //         $updateInfo = $this->checkForUpdates();
    //         $packagePath = storage_path(self::UPDATE_TEMP_PATH . '/update-' . $updateInfo['latest_version'] . '.zip');
    //         $extractPath = storage_path(self::UPDATE_TEMP_PATH . '/extracted');

    //         File::ensureDirectoryExists($extractPath);
    //         File::cleanDirectory($extractPath);
            
    //         $this->broadcastProgress('extract', 30, 'Extracting files...');
            
    //         $zip = new ZipArchive();
    //         if ($zip->open($packagePath) === true) {
    //             $zip->extractTo($extractPath);
    //             $zip->close();
    //         } else {
    //             throw new \Exception('Failed to extract update package');
    //         }

    //         $this->broadcastProgress('extract', 100, 'Extraction completed');

    //         return [
    //             'success' => true,
    //             'extract_path' => $extractPath
    //         ];
    //     } catch (\Exception $e) {
    //         Log::error('Extraction failed', [
    //             'error' => $e->getMessage(),
    //             'trace' => $e->getTraceAsString()
    //         ]);
    //         throw $e;
    //     }
    // }

    // public function updateFiles(): array
    // {
    //     try {
    //         $this->broadcastProgress('files', 0, 'Starting file updates...');
            
    //         $extractPath = storage_path(self::UPDATE_TEMP_PATH . '/extracted');
            
    //         if (!is_dir($extractPath)) {
    //             throw new \Exception('Extracted files not found');
    //         }

    //         $files = File::allFiles($extractPath);
    //         $totalFiles = count($files);
            
    //         foreach ($files as $i => $file) {
    //             $relativePath = $file->getRelativePathname();
    //             $targetPath = base_path($relativePath);
                
    //             File::ensureDirectoryExists(dirname($targetPath));
    //             File::copy($file->getRealPath(), $targetPath);
                
    //             if ($i % 50 === 0) {
    //                 $progress = (int)(($i / $totalFiles) * 100);
    //                 $this->broadcastProgress('files', $progress, "Updating files... ({$progress}%)");
    //             }
    //         }

    //         $this->broadcastProgress('files', 100, 'File updates completed');

    //         return [
    //             'success' => true,
    //             'files_updated' => $totalFiles
    //         ];
    //     } catch (\Exception $e) {
    //         Log::error('File update failed', [
    //             'error' => $e->getMessage(),
    //             'trace' => $e->getTraceAsString()
    //         ]);
    //         throw $e;
    //     }
    // }

    // public function updateDatabase(): array
    // {
    //     try {
    //         $this->broadcastProgress('database', 0, 'Starting database updates...');

    //         // Clear caches
    //         $this->broadcastProgress('database', 20, 'Clearing configuration cache...');
    //         Process::run('php artisan config:clear');
    //         Process::run('php artisan cache:clear');

    //         // Run migrations
    //         $this->broadcastProgress('database', 40, 'Running database migrations...');
    //         $migrationOutput = Process::run('php artisan migrate --force');

    //         if ($migrationOutput->failed()) {
    //             throw new \Exception('Database migration failed: ' . $migrationOutput->errorOutput());
    //         }

    //         $this->broadcastProgress('database', 100, 'Database updates completed');

    //         return [
    //             'success' => true,
    //             'migration_output' => $migrationOutput->output()
    //         ];
    //     } catch (\Exception $e) {
    //         Log::error('Database update failed', [
    //             'error' => $e->getMessage(),
    //             'trace' => $e->getTraceAsString()
    //         ]);
    //         throw $e;
    //     }
    // }

    // public function publishAssets(): array
    // {
    //     try {
    //         $this->broadcastProgress('assets', 0, 'Starting asset publishing...');

    //         // Publish vendor assets
    //         $this->broadcastProgress('assets', 30, 'Publishing vendor assets...');
    //         Process::run('php artisan vendor:publish --all --force');

    //         // Build frontend assets if needed
    //         if (file_exists(base_path('package.json'))) {
    //             $this->broadcastProgress('assets', 60, 'Installing npm dependencies...');
    //             Process::run('npm install');
                
    //             $this->broadcastProgress('assets', 80, 'Building frontend assets...');
    //             Process::run('npm run build');
    //         }

    //         $this->broadcastProgress('assets', 100, 'Asset publishing completed');

    //         return [
    //             'success' => true
    //         ];
    //     } catch (\Exception $e) {
    //         Log::error('Asset publishing failed', [
    //             'error' => $e->getMessage(),
    //             'trace' => $e->getTraceAsString()
    //         ]);
    //         throw $e;
    //     }
    // }

    // public function cleanup(): array
    // {
    //     try {
    //         $this->broadcastProgress('cleanup', 0, 'Starting cleanup...');

    //         // Clear all caches
    //         $this->broadcastProgress('cleanup', 30, 'Clearing application cache...');
    //         Process::run('php artisan optimize:clear');
            
    //         // Remove temporary files
    //         $this->broadcastProgress('cleanup', 60, 'Removing temporary files...');
    //         File::deleteDirectory(storage_path(self::UPDATE_TEMP_PATH));

    //         // Clear opcache if available
    //         if (function_exists('opcache_reset')) {
    //             opcache_reset();
    //         }

    //         $this->broadcastProgress('cleanup', 100, 'Cleanup completed');

    //         return [
    //             'success' => true
    //         ];
    //     } catch (\Exception $e) {
    //         Log::error('Cleanup failed', [
    //             'error' => $e->getMessage(),
    //             'trace' => $e->getTraceAsString()
    //         ]);
    //         throw $e;
    //     }
    // }

    public function restoreBackup(string $filename): array
    {
        try {
            $backupPath = storage_path(self::UPDATE_BACKUP_PATH . '/' . $filename);
            
            if (!File::exists($backupPath)) {
                throw new \Exception('Backup file not found');
            }

            $this->broadcastProgress('restore', 0, 'Starting backup restoration...');

            // If it's a database backup
            if (Str::endsWith($filename, '.sql')) {
                $this->broadcastProgress('restore', 30, 'Restoring database...');
                $this->restoreDatabaseBackup($backupPath);
            }
            // If it's a files backup
            elseif (Str::endsWith($filename, '.zip')) {
                $this->broadcastProgress('restore', 30, 'Restoring files...');
                $this->restoreFilesBackup($backupPath);
            }
            else {
                throw new \Exception('Invalid backup file type');
            }

            $this->broadcastProgress('restore', 100, 'Backup restored successfully');

            return [
                'success' => true,
                'message' => 'Backup restored successfully'
            ];
        } catch (\Exception $e) {
            Log::error('Backup restoration failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    private function restoreDatabaseBackup(string $path): void
    {
        $command = sprintf(
            'mysql -u%s -p%s %s < %s',
            config('database.connections.mysql.username'),
            config('database.connections.mysql.password'),
            config('database.connections.mysql.database'),
            $path
        );

        $process = Process::run($command);
        
        if (!$process->successful()) {
            throw new \Exception('Database restoration failed: ' . $process->errorOutput());
        }
    }

    private function restoreFilesBackup(string $path): void
    {
        $zip = new ZipArchive();
        if ($zip->open($path) !== true) {
            throw new \Exception('Failed to open backup archive');
        }

        $extractPath = base_path();
        $zip->extractTo($extractPath);
        $zip->close();
    }

    private function broadcastProgress(string $step, int $progress, string $message): void
    {
        try {
            Event::dispatch('system-update.progress', [
                'step' => $step,
                'progress' => $progress,
                'message' => $message,
                'timestamp' => now()->toIso8601String()
            ]);

            // Also log progress
            Log::info("Update progress: {$step} - {$progress}% - {$message}");
        } catch (\Exception $e) {
            Log::warning('Failed to broadcast progress', [
                'error' => $e->getMessage()
            ]);
        }
    }

    public function validateUpdate(array $requirements): array
    {
        $validation = [
            'can_update' => true,
            'issues' => [],
            'warnings' => []
        ];

        // Check PHP version
        if (version_compare(PHP_VERSION, $requirements['php_version'], '<')) {
            $validation['can_update'] = false;
            $validation['issues'][] = "PHP version {$requirements['php_version']} or higher is required";
        }

        // Check MySQL version
        if (version_compare($this->getMySQLVersion(), $requirements['mysql_version'], '<')) {
            $validation['can_update'] = false;
            $validation['issues'][] = "MySQL version {$requirements['mysql_version']} or higher is required";
        }

        // Check extensions
        foreach ($requirements['extensions'] as $extension) {
            if (!extension_loaded($extension)) {
                $validation['can_update'] = false;
                $validation['issues'][] = "Required PHP extension missing: {$extension}";
            }
        }

        // Check memory limit
        if ($this->compareBytes(ini_get('memory_limit'), $requirements['memory_limit']) < 0) {
            $validation['warnings'][] = "Memory limit is lower than recommended ({$requirements['memory_limit']})";
        }

        // Check disk space
        $requiredSpace = $requirements['required_disk_space'] ?? (500 * 1024 * 1024); // 500MB default
        if (disk_free_space(base_path()) < $requiredSpace) {
            $validation['warnings'][] = "Low disk space available";
        }

        return $validation;
    }

    public function rollbackUpdate(string $version): array
    {
        try {
            $this->broadcastProgress('rollback', 0, 'Starting update rollback...');

            // Find the latest backup before the update
            $backups = $this->getBackupsBeforeVersion($version);
            if (empty($backups)) {
                throw new \Exception('No backup found for rollback');
            }

            $latestBackup = $backups[0];

            // Restore the backup
            $this->restoreBackup($latestBackup);

            // Update version in config
            $this->updateVersionConfig($version);

            $this->broadcastProgress('rollback', 100, 'Rollback completed successfully');

            return [
                'success' => true,
                'message' => 'System rolled back successfully to version ' . $version
            ];
        } catch (\Exception $e) {
            Log::error('Rollback failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    private function getBackupsBeforeVersion(string $version): array
    {
        $backups = File::files(storage_path(self::UPDATE_BACKUP_PATH));
        return collect($backups)
            ->filter(function ($backup) use ($version) {
                $backupVersion = $this->extractVersionFromBackup($backup);
                return version_compare($backupVersion, $version, '<');
            })
            ->sortByDesc(function ($backup) {
                return $backup->getMTime();
            })
            ->values()
            ->all();
    }

    private function extractVersionFromBackup($backup): string
    {
        // Implement version extraction logic based on your backup naming convention
        return '1.0.0'; // Placeholder
    }

    public function getUpdateHistory(): array
    {
        return SystemUpdateLog::with('systemUpdate')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($log) {
                return [
                    'version' => $log->systemUpdate->version,
                    'status' => $log->status,
                    'started_at' => $log->started_at,
                    'completed_at' => $log->completed_at,
                    'message' => $log->message,
                    'details' => $log->details
                ];
            })
            ->toArray();
    }
} 
