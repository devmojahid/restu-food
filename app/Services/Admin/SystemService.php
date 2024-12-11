<?php

declare(strict_types=1);

namespace App\Services\Admin;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Collection;

final class SystemService
{
    private function getSystemLoad(): array
    {
        try {
            if (PHP_OS_FAMILY === 'Linux') {
                $load = Process::run('cat /proc/loadavg')->output();
                $loads = array_slice(explode(' ', $load), 0, 3);
                return array_map('floatval', $loads);
            }
            
            if (function_exists('\sys_getloadavg')) {
                return \sys_getloadavg();
            }
        } catch (\Exception $e) {
            Log::warning('Failed to get system load: ' . $e->getMessage());
        }
        
        return [0, 0, 0];
    }

    public function getSystemHealth(): array
    {
        $loadAvg = $this->getSystemLoad();
        $cpuUsage = $this->getCpuUsage();
        $cpuInfo = $this->getCpuInfo();
        $metrics = $this->getSystemMetrics();
        
        return [
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
            'cpu_usage' => $cpuUsage,
            'load_average' => $loadAvg,
            'uptime' => $this->getSystemUptime(),
            'cpu_info' => $cpuInfo,
            'server_time' => now()->format('Y-m-d H:i:s'),
            'timezone' => config('app.timezone'),
            'ssl_enabled' => $this->isSSLEnabled(),
            'disk_io' => $metrics['disk_io'],
            'network_stats' => $metrics['network_stats'],
            'process_count' => $metrics['process_count'],
            'last_boot' => $metrics['last_boot'],
            'load_trends' => $metrics['load_trends'],
            'database' => [
                'connection' => config('database.default'),
                'status' => $this->checkDatabaseConnection(),
                'size' => $this->getDatabaseSize(),
                'tables' => $this->getTableCount(),
            ],
            'cache' => [
                'driver' => config('cache.default'),
                'status' => Cache::store()->get('health-check-' . time(), true),
                'size' => $this->getCacheSize(),
            ],
            'storage' => [
                'writable' => is_writable(storage_path()),
                'free_space' => disk_free_space(storage_path()),
                'total_space' => disk_total_space(storage_path()),
            ],
            'memory_usage' => memory_get_usage(true),
            'max_memory' => ini_get('memory_limit'),
        ];
    }

    public function getErrorLogs(int $lines = 100): array
    {
        $logFile = storage_path('logs/laravel.log');
        if (!File::exists($logFile)) {
            return [];
        }

        $logs = [];
        $pattern = '/^\[(?<date>.*)\]\s(?<env>\w+)\.(?<type>\w+):(?<message>.*)/m';
        
        $content = File::tail($logFile, $lines);
        preg_match_all($pattern, $content, $matches, PREG_SET_ORDER);

        foreach ($matches as $match) {
            $logs[] = [
                'date' => $match['date'],
                'environment' => $match['env'],
                'type' => $match['type'],
                'message' => trim($match['message']),
            ];
        }

        return array_reverse($logs);
    }

    public function getActivityLogs(int $limit = 50): array
    {
        return DB::table('activity_log')
            ->select('description', 'causer_type', 'causer_id', 'created_at', 'properties')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(function ($log) {
                return [
                    'description' => $log->description,
                    'causer' => $log->causer_type ? class_basename($log->causer_type) . ':' . $log->causer_id : 'System',
                    'created_at' => $log->created_at,
                    'properties' => json_decode($log->properties, true),
                ];
            })
            ->toArray();
    }

    public function clearCache(): void
    {
        Artisan::call('cache:clear');
        Artisan::call('config:clear');
        Artisan::call('route:clear');
        Artisan::call('view:clear');
        Cache::flush();
    }

    public function getUpdateInfo(): array
    {
        return [
            'current_version' => config('app.version', '1.0.0'),
            'latest_version' => $this->checkLatestVersion(),
            'last_checked' => now()->toDateTimeString(),
            'changelog' => $this->getChangelogEntries(),
        ];
    }

    private function checkDatabaseConnection(): bool
    {
        try {
            DB::connection()->getPdo();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    private function checkLatestVersion(): string
    {
        // Implement version checking logic here
        // This could involve checking a remote API or file
        return '1.0.0'; // Placeholder
    }

    private function getChangelogEntries(): array
    {
        // Implement changelog retrieval logic here
        return [
            [
                'version' => '1.0.0',
                'date' => '2024-03-20',
                'changes' => [
                    'Initial release',
                ],
            ],
        ];
    }

    private function getCpuUsage(): float
    {
        try {
            if (PHP_OS_FAMILY === 'Linux') {
                $cpu = Process::run("top -bn1 | grep 'Cpu(s)' | awk '{print $2}'");
                if ($cpu->successful()) {
                    return (float) $cpu->output();
                }
            }
            
            $load = $this->getSystemLoad();
            $cores = $this->getCpuCores();
            return round($load[0] * 100 / max($cores, 1), 2);
        } catch (\Exception $e) {
            Log::warning('Failed to get CPU usage: ' . $e->getMessage());
            return 0;
        }
    }

    private function getCpuCores(): int
    {
        try {
            if (PHP_OS_FAMILY === 'Linux') {
                $cores = Process::run('nproc')->output();
                return (int) $cores;
            }
            
            return (int) shell_exec('sysctl -n hw.ncpu') ?: 1;
        } catch (\Exception $e) {
            Log::warning('Failed to get CPU cores: ' . $e->getMessage());
            return 1;
        }
    }

    private function isSSLEnabled(): bool
    {
        return request()->secure() || 
               env('FORCE_HTTPS', false) || 
               config('app.env') === 'production';
    }

    private function getDatabaseSize(): string
    {
        try {
            if (config('database.default') === 'mysql') {
                $size = DB::select("
                    SELECT SUM(data_length + index_length) AS size 
                    FROM information_schema.TABLES 
                    WHERE table_schema = ?
                ", [config('database.connections.mysql.database')]);
                
                return $this->formatBytes($size[0]->size ?? 0);
            }
            return 'N/A';
        } catch (\Exception $e) {
            Log::warning('Failed to get database size: ' . $e->getMessage());
            return 'N/A';
        }
    }

    private function getTableCount(): int
    {
        try {
            return count(DB::select("SHOW TABLES"));
        } catch (\Exception $e) {
            Log::warning('Failed to get table count: ' . $e->getMessage());
            return 0;
        }
    }

    private function formatBytes($bytes, $precision = 2): string
    {
        $bytes = floatval($bytes);
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        if ($bytes === 0) {
            return '0 ' . $units[0];
        }
        $pow = floor(log($bytes, 1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, $precision) . ' ' . $units[$pow];
    }

    private function getSystemUptime(): string
    {
        if (PHP_OS_FAMILY === 'Linux') {
            $uptime = shell_exec('uptime -p');
            return trim($uptime ?: 'N/A');
        }
        return 'N/A';
    }

    private function getCacheSize(): int
    {
        try {
            if (config('cache.default') === 'redis') {
                return Redis::info()['used_memory'] ?? 0;
            }
            return 0;
        } catch (\Exception $e) {
            return 0;
        }
    }

    private function getCpuInfo(): array
    {
        $cpuInfo = [
            'cores' => $this->getCpuCores(),
            'model' => 'Unknown',
            'frequency' => 'Unknown'
        ];

        if (PHP_OS_FAMILY === 'Linux') {
            try {
                $cpuinfo = file_get_contents('/proc/cpuinfo');
                if ($cpuinfo !== false) {
                    // Get CPU Model
                    preg_match('/model name\s+:\s+(.+)$/m', $cpuinfo, $model);
                    if (isset($model[1])) {
                        $cpuInfo['model'] = trim($model[1]);
                    }

                    // Get CPU Frequency
                    preg_match('/cpu MHz\s+:\s+(.+)$/m', $cpuinfo, $freq);
                    if (isset($freq[1])) {
                        $cpuInfo['frequency'] = round(floatval($freq[1])) . ' MHz';
                    }

                    // Get CPU Cores from /proc/cpuinfo
                    preg_match_all('/^processor/m', $cpuinfo, $processors);
                    if (!empty($processors[0])) {
                        $cpuInfo['cores'] = count($processors[0]);
                    }
                }
            } catch (\Exception $e) {
                Log::warning('Failed to read CPU info: ' . $e->getMessage());
            }
        } elseif (PHP_OS_FAMILY === 'Darwin') { // macOS
            try {
                // Get CPU cores on macOS
                $cores = shell_exec('sysctl -n hw.ncpu');
                if ($cores !== false) {
                    $cpuInfo['cores'] = (int) $cores;
                }

                // Get CPU model on macOS
                $model = shell_exec('sysctl -n machdep.cpu.brand_string');
                if ($model !== false) {
                    $cpuInfo['model'] = trim($model);
                }

                // Get CPU frequency on macOS
                $freq = shell_exec('sysctl -n hw.cpufrequency');
                if ($freq !== false) {
                    $cpuInfo['frequency'] = round((int) $freq / 1000000) . ' MHz';
                }
            } catch (\Exception $e) {
                Log::warning('Failed to get macOS CPU info: ' . $e->getMessage());
            }
        } elseif (PHP_OS_FAMILY === 'Windows') {
            try {
                // Get CPU info on Windows using wmic
                $wmic = shell_exec('wmic cpu get NumberOfCores,Name,MaxClockSpeed /value');
                if ($wmic !== false) {
                    // Get cores
                    preg_match('/NumberOfCores=(\d+)/', $wmic, $cores);
                    if (isset($cores[1])) {
                        $cpuInfo['cores'] = (int) $cores[1];
                    }

                    // Get model
                    preg_match('/Name=(.+)/', $wmic, $name);
                    if (isset($name[1])) {
                        $cpuInfo['model'] = trim($name[1]);
                    }

                    // Get frequency
                    preg_match('/MaxClockSpeed=(\d+)/', $wmic, $speed);
                    if (isset($speed[1])) {
                        $cpuInfo['frequency'] = $speed[1] . ' MHz';
                    }
                }
            } catch (\Exception $e) {
                Log::warning('Failed to get Windows CPU info: ' . $e->getMessage());
            }
        }

        return $cpuInfo;
    }

    private function getSystemMetrics(): array
    {
        return [
            'disk_io' => $this->getDiskIO(),
            'network_stats' => $this->getNetworkStats(),
            'process_count' => $this->getProcessCount(),
            'last_boot' => $this->getLastBoot(),
            'load_trends' => $this->getLoadTrends(),
            'php_metrics' => $this->getPHPMetrics(),
            'server_metrics' => $this->getServerMetrics(),
        ];
    }

    private function getDiskIO(): array
    {
        try {
            if (PHP_OS_FAMILY === 'Linux') {
                $iostat = Process::run('iostat -d -k 1 1')->output();
                preg_match('/\d+\.\d+\s+\d+\.\d+\s+(\d+\.\d+)\s+(\d+\.\d+)/', $iostat, $matches);
                return [
                    'reads_per_sec' => $matches[1] ?? 0,
                    'writes_per_sec' => $matches[2] ?? 0,
                    'disk_usage' => $this->getDiskUsage(),
                ];
            }
        } catch (\Exception $e) {
            Log::warning('Failed to get disk I/O stats: ' . $e->getMessage());
        }
        return [
            'reads_per_sec' => 0,
            'writes_per_sec' => 0,
            'disk_usage' => $this->getDiskUsage(),
        ];
    }

    private function getDiskUsage(): array
    {
        $path = storage_path();
        return [
            'total' => $this->formatBytes(disk_total_space($path)),
            'free' => $this->formatBytes(disk_free_space($path)),
            'used' => $this->formatBytes(disk_total_space($path) - disk_free_space($path)),
            'usage_percent' => round((1 - (disk_free_space($path) / disk_total_space($path))) * 100, 2),
        ];
    }

    private function getNetworkStats(): array
    {
        try {
            if (PHP_OS_FAMILY === 'Linux') {
                $netstat = Process::run('netstat -i | grep -v "Kernel"')->output();
                $stats = [
                    'interfaces' => [],
                    'connections' => 0,
                    'active_connections' => $this->getActiveConnections(),
                    'bandwidth_usage' => $this->getBandwidthUsage(),
                ];
                
                foreach (explode("\n", trim($netstat)) as $line) {
                    if (preg_match('/^(\w+)/', $line, $matches)) {
                        $stats['interfaces'][] = $matches[1];
                    }
                }
                
                $connections = Process::run('netstat -an | grep ESTABLISHED | wc -l')->output();
                $stats['connections'] = (int) trim($connections);
                
                return $stats;
            }
            return [
                'interfaces' => [],
                'connections' => 0,
                'active_connections' => [],
                'bandwidth_usage' => ['rx' => 0, 'tx' => 0],
            ];
        } catch (\Exception $e) {
            Log::warning('Failed to get network stats: ' . $e->getMessage());
            return [
                'interfaces' => [],
                'connections' => 0,
                'active_connections' => [],
                'bandwidth_usage' => ['rx' => 0, 'tx' => 0],
            ];
        }
    }

    private function getActiveConnections(): array
    {
        try {
            if (PHP_OS_FAMILY === 'Linux') {
                $connections = Process::run('netstat -ntu | grep ESTABLISHED')->output();
                $active = [];
                foreach (explode("\n", trim($connections)) as $line) {
                    if (preg_match('/(\S+):(\d+)\s+(\S+):(\d+)/', $line, $matches)) {
                        $active[] = [
                            'local' => $matches[1] . ':' . $matches[2],
                            'remote' => $matches[3] . ':' . $matches[4],
                        ];
                    }
                }
                return array_slice($active, 0, 10); // Return only top 10 connections
            }
        } catch (\Exception $e) {
            Log::warning('Failed to get active connections: ' . $e->getMessage());
        }
        return [];
    }

    private function getBandwidthUsage(): array
    {
        try {
            if (PHP_OS_FAMILY === 'Linux') {
                $rx = Process::run("cat /sys/class/net/$(ip route | grep default | awk '{print $5}')/statistics/rx_bytes")->output();
                $tx = Process::run("cat /sys/class/net/$(ip route | grep default | awk '{print $5}')/statistics/tx_bytes")->output();
                return [
                    'rx' => $this->formatBytes((int) $rx),
                    'tx' => $this->formatBytes((int) $tx),
                ];
            }
        } catch (\Exception $e) {
            Log::warning('Failed to get bandwidth usage: ' . $e->getMessage());
        }
        return ['rx' => '0 B', 'tx' => '0 B'];
    }

    private function getProcessCount(): int
    {
        try {
            if (PHP_OS_FAMILY === 'Linux') {
                $count = Process::run('ps aux | wc -l')->output();
                return (int) trim($count) - 1;
            }
        } catch (\Exception $e) {
            Log::warning('Failed to get process count: ' . $e->getMessage());
        }
        return 0;
    }

    private function getLastBoot(): string
    {
        try {
            if (PHP_OS_FAMILY === 'Linux') {
                $uptime = Process::run('who -b')->output();
                preg_match('/system boot\s+(.+)/', $uptime, $matches);
                return $matches[1] ?? 'N/A';
            }
        } catch (\Exception $e) {
            Log::warning('Failed to get last boot time: ' . $e->getMessage());
        }
        return 'N/A';
    }

    private function getLoadTrends(): array
    {
        try {
            $trends = Collection::times(5, function ($i) {
                $load = $this->getSystemLoad();
                if ($i < 4) sleep(1);
                return [
                    'timestamp' => now()->subMinutes($i)->format('H:i:s'),
                    'load' => $load[0],
                    'cpu_usage' => $this->getCpuUsage(),
                    'memory_usage' => $this->getMemoryUsagePercentage(),
                ];
            });
            return $trends->reverse()->values()->all();
        } catch (\Exception $e) {
            Log::warning('Failed to get load trends: ' . $e->getMessage());
            return [];
        }
    }

    private function getPHPMetrics(): array
    {
        return [
            'opcache_enabled' => function_exists('opcache_get_status'),
            'extensions' => get_loaded_extensions(),
            'memory_limit' => ini_get('memory_limit'),
            'max_execution_time' => ini_get('max_execution_time'),
            'upload_max_filesize' => ini_get('upload_max_filesize'),
            'post_max_size' => ini_get('post_max_size'),
        ];
    }

    private function getServerMetrics(): array
    {
        return [
            'hostname' => gethostname(),
            'os' => PHP_OS_FAMILY,
            'architecture' => php_uname('m'),
            'web_server' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
            'php_version' => PHP_VERSION,
            'ssl_info' => $this->getSSLInfo(),
        ];
    }

    private function getSSLInfo(): array
    {
        $ssl = [];
        if ($this->isSSLEnabled()) {
            $ssl['enabled'] = true;
            if (isset($_SERVER['SSL_PROTOCOL'])) {
                $ssl['protocol'] = $_SERVER['SSL_PROTOCOL'];
            }
            if (isset($_SERVER['SSL_CIPHER'])) {
                $ssl['cipher'] = $_SERVER['SSL_CIPHER'];
            }
        } else {
            $ssl['enabled'] = false;
        }
        return $ssl;
    }

    private function getMemoryUsagePercentage(): float
    {
        $memoryLimit = $this->parseMemoryLimit(ini_get('memory_limit'));
        $memoryUsage = memory_get_usage(true);
        return round(($memoryUsage / $memoryLimit) * 100, 2);
    }

    private function parseMemoryLimit(string $memoryLimit): int
    {
        $unit = strtoupper(substr($memoryLimit, -1));
        $value = (int) substr($memoryLimit, 0, -1);
        
        return match($unit) {
            'K' => $value * 1024,
            'M' => $value * 1024 * 1024,
            'G' => $value * 1024 * 1024 * 1024,
            default => (int) $memoryLimit,
        };
    }
} 