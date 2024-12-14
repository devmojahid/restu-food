import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import SettingsLayout from "../Index";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import {
  Activity,
  Database,
  Server,
  CircuitBoard,
  HardDrive,
  Cpu,
  RefreshCw,
  Router,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Disc,
  Network,
  Shield,
  Settings,
  MemoryStick,
  Trash,
  Download,
  Zap,
  Database as DbIcon,
  Table,
  Globe2,
  Timer,
  ShieldCheck,
  LineChart,
  BarChart,
  PieChart,
  ArrowUp,
  ArrowDown,
  Minus,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/Components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Skeleton } from "@/Components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/Components/ui/tooltip";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { 
  Line, 
  Area, 
  Bar, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, trend, status, className, children }) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend > 0) return <ArrowUp className="h-4 w-4 text-success animate-bounce" />;
    if (trend < 0) return <ArrowDown className="h-4 w-4 text-destructive animate-bounce" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card className={cn(
      "hover:shadow-lg transition-all duration-300 border-l-4",
      status === 'critical' ? 'border-l-destructive' :
      status === 'warning' ? 'border-l-warning' :
      'border-l-success',
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <div className={cn(
              "p-2 rounded-lg",
              status === 'critical' ? 'bg-red-100' :
              status === 'warning' ? 'bg-yellow-100' :
              'bg-green-100'
            )}>
              <Icon className={cn(
                "h-4 w-4",
                status === 'critical' ? 'text-red-600' :
                status === 'warning' ? 'text-yellow-600' :
                'text-green-600'
              )} />
            </div>
            <div>
              <h3 className="text-sm font-medium leading-none">{title}</h3>
              {children && <p className="text-xs text-muted-foreground mt-1">{children}</p>}
            </div>
          </div>
          {status && (
            <Badge variant={status.toLowerCase()} className="animate-pulse">
              {status}
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between pt-4">
          <div className="text-2xl font-bold">{value}</div>
          {trend !== undefined && (
            <div className="flex items-center space-x-1">
              {getTrendIcon()}
              <span className="text-xs text-muted-foreground">
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Performance Chart Component
const PerformanceChart = ({ data }) => {
  const chartData = useMemo(() => {
    return data.map(point => ({
      time: point.timestamp,
      CPU: point.cpu_usage,
      Memory: point.memory_usage,
      'Disk I/O': point.disk_io?.writes_per_sec || 0,
      Network: point.network_stats?.bandwidth_usage?.rx || 0
    }));
  }, [data]);

  const colors = {
    CPU: '#8884d8',
    Memory: '#82ca9d',
    'Disk I/O': '#ffc658',
    Network: '#ff7c43'
  };

  return (
    <div className="w-full h-[400px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <Area
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            {Object.entries(colors).map(([key, color]) => (
              <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            className="stroke-muted/30"
            vertical={false}
          />
          <XAxis 
            dataKey="time" 
            stroke="currentColor" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="currentColor"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <RechartsTooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3">
                  <p className="font-medium text-sm mb-2">{label}</p>
                  <div className="space-y-1">
                    {payload.map((entry, index) => (
                      <p 
                        key={index} 
                        className="text-sm" 
                        style={{ color: entry.color }}
                      >
                        {entry.name}: {entry.value.toFixed(2)}%
                      </p>
                    ))}
                  </div>
                </div>
              );
            }}
          />
          {Object.entries(colors).map(([key, color]) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              fill={`url(#gradient-${key})`}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          ))}
        </Area>
      </ResponsiveContainer>
    </div>
  );
};

// Enhanced System Status Component
const SystemStatus = ({ status, onRefresh }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'healthy': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Badge variant={getStatusColor(status)} className="px-3 py-1">
        <div className="flex items-center gap-2">
          {status === 'healthy' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          System {status}
        </div>
      </Badge>
      <Button variant="outline" size="sm" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
    </div>
  );
};

// Enhanced Resource Usage Component
const ResourceUsage = ({ title, used, total, percentage, icon: Icon }) => {
  const getStatusColor = (percentage) => {
    if (percentage >= 90) return 'bg-gradient-to-r from-red-500 to-red-600';
    if (percentage >= 70) return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    return 'bg-gradient-to-r from-green-500 to-green-600';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={cn(
            "p-2 rounded-lg",
            percentage >= 90 ? 'bg-red-100' : 
            percentage >= 70 ? 'bg-yellow-100' : 
            'bg-green-100'
          )}>
            <Icon className={cn(
              "h-4 w-4",
              percentage >= 90 ? 'text-red-600' : 
              percentage >= 70 ? 'text-yellow-600' : 
              'text-green-600'
            )} />
          </div>
          <span className="text-sm font-medium">{title}</span>
        </div>
        <Badge variant={
          percentage >= 90 ? 'destructive' : 
          percentage >= 70 ? 'warning' : 
          'success'
        }>
          {percentage}%
        </Badge>
      </div>
      <div className="relative h-2.5 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-500 ease-in-out rounded-full",
            getStatusColor(percentage)
          )}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{used}</span>
        <span>{total}</span>
      </div>
    </div>
  );
};

// Main Health Component
export default function SystemHealth({ healthData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Enhanced handleRefresh with Inertia
  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    router.reload({
      only: ['healthData'],
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setIsLoading(false);
        setLastUpdated(new Date());
        toast({
          title: "Success",
          description: "System health data refreshed",
        });
      },
      onError: () => {
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to refresh system health data",
          variant: "destructive",
        });
      },
    });
  }, []);

  // Enhanced handleClearCache
  const handleClearCache = useCallback(() => {
    router.post(route('app.settings.system.cache.clear'), {}, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Cache cleared successfully",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to clear cache",
          variant: "destructive",
        });
      },
    });
  }, []);

  // Enhanced handleCheckUpdates
  const handleCheckUpdates = useCallback(() => {
    router.get(route('app.settings.system.updates'), {}, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: (response) => {
        toast({
          title: "Update Check Complete",
          description: response.updates_available 
            ? `${response.available_updates} updates available` 
            : "Your system is up to date",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to check for updates",
          variant: "destructive",
        });
      },
    });
  }, []);

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(handleRefresh, 30000);
    return () => clearInterval(interval);
  }, [handleRefresh]);

  const { systemStatus, systemMessage } = useMemo(() => {
    const cpuCritical = healthData.cpu_usage > 90;
    const memoryCritical = healthData.memory_usage > 90;
    const diskCritical = healthData.storage.free_space / healthData.storage.total_space < 0.1;

    if (cpuCritical || memoryCritical || diskCritical) {
      return { 
        systemStatus: 'critical', 
        systemMessage: 'System resources critical' 
      };
    }

    const cpuWarning = healthData.cpu_usage > 70;
    const memoryWarning = healthData.memory_usage > 70;
    const diskWarning = healthData.storage.free_space / healthData.storage.total_space < 0.2;

    if (cpuWarning || memoryWarning || diskWarning) {
      return { 
        systemStatus: 'warning', 
        systemMessage: 'System resources warning' 
      };
    }

    return { 
      systemStatus: 'healthy', 
      systemMessage: 'All systems operational' 
    };
  }, [healthData]);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status) => {
    return status ? 'success' : 'destructive';
  };

  const getStorageUsage = () => {
    const used = healthData.storage.total_space - healthData.storage.free_space;
    const percentage = (used / healthData.storage.total_space) * 100;
    return {
      used: formatBytes(used),
      total: formatBytes(healthData.storage.total_space),
      percentage: percentage.toFixed(1)
    };
  };

  const getSystemStatus = () => {
    const checks = [
      healthData.database.status,
      healthData.cache.status,
      healthData.storage.writable,
    ];
    
    const passedChecks = checks.filter(Boolean).length;
    const totalChecks = checks.length;
    
    return {
      status: passedChecks === totalChecks ? 'healthy' : 'warning',
      percentage: (passedChecks / totalChecks) * 100,
    };
  };

  const storage = getStorageUsage();
  const systemChecks = getSystemStatus();

  const getHealthScore = () => {
    const metrics = {
      database: healthData.database.status ? 25 : 0,
      cache: healthData.cache.status ? 25 : 0,
      storage: healthData.storage.writable ? 25 : 0,
      memory: healthData.memory_usage < parseInt(healthData.max_memory) * 0.8 ? 25 : 0
    };
    
    return Object.values(metrics).reduce((a, b) => a + b, 0);
  };

  const renderHealthIndicator = (score) => {
    let color = 'text-red-500';
    if (score >= 90) color = 'text-green-500';
    else if (score >= 70) color = 'text-yellow-500';
    else if (score >= 50) color = 'text-orange-500';
    
    return (
      <div className="flex items-center gap-2">
        <Gauge className={cn("h-8 w-8", color)} />
        <div>
          <div className={cn("text-2xl font-bold", color)}>{score}%</div>
          <div className="text-sm text-muted-foreground">Health Score</div>
        </div>
      </div>
    );
  };

  return (
    <SettingsLayout>
      <Head title="System Health" />
      <TooltipProvider>
        <div className="space-y-6">
          {/* Header with System Status */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">System Health</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {renderHealthIndicator(getHealthScore())}
              <SystemStatus 
                status={systemStatus} 
                message={systemMessage}
                onRefresh={handleRefresh} 
              />
            </div>
          </div>

          {/* Enhanced System Alerts */}
          {systemStatus !== 'healthy' && (
            <Alert 
              variant={systemStatus === 'critical' ? 'destructive' : 'warning'} 
              className="animate-pulse"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {systemMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Enhanced System Overview Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="w-full justify-start overflow-x-auto no-scrollbar p-0 bg-transparent border-b rounded-none">
              {["overview", "server", "database", "performance"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className={cn(
                    "flex-1 sm:flex-none min-w-[120px] data-[state=active]:bg-background",
                    "border-b-2 border-transparent data-[state=active]:border-primary",
                    "rounded-none px-4 py-2 font-medium transition-all",
                    "hover:text-primary hover:bg-muted/50"
                  )}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* System Health Score */}
                <MetricCard
                  title="System Health"
                  value={`${getHealthScore()}%`}
                  icon={Gauge}
                  status={systemStatus}
                />

                {/* System Checks */}
                <MetricCard
                  title="System Checks"
                  value={`${systemChecks.percentage}%`}
                  icon={CheckCircle2}
                  status={systemChecks.status}
                />

                {/* Storage Usage */}
                <MetricCard
                  title="Storage Usage"
                  value={storage.percentage + '%'}
                  icon={HardDrive}
                  status={storage.percentage > 90 ? 'critical' : 
                          storage.percentage > 70 ? 'warning' : 'healthy'}
                />
              </div>
            </TabsContent>

            <TabsContent value="server" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* CPU Information */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <ResourceUsage
                        title="CPU Load"
                        used={`${healthData.cpu_usage}%`}
                        total="100%"
                        percentage={healthData.cpu_usage}
                        icon={Cpu}
                      />
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Model</span>
                          <span>{healthData.cpu_info?.model || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Cores</span>
                          <span>{healthData.cpu_info?.cores || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Frequency</span>
                          <span>{healthData.cpu_info?.frequency || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Memory Usage */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                    <MemoryStick className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <ResourceUsage
                        title="Memory"
                        used={formatBytes(healthData.memory_usage)}
                        total={healthData.max_memory}
                        percentage={(healthData.memory_usage / parseInt(healthData.max_memory)) * 100}
                        icon={MemoryStick}
                      />
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Peak Usage</span>
                          <span>{formatBytes(healthData.memory_peak || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Limit</span>
                          <span>{healthData.max_memory}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Storage Information */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Storage</CardTitle>
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <ResourceUsage
                        title="Disk Space"
                        used={storage.used}
                        total={storage.total}
                        percentage={parseFloat(storage.percentage)}
                        icon={HardDrive}
                      />
                      <div className="pt-2">
                        <Badge variant={healthData.storage.writable ? 'outline' : 'destructive'}>
                          {healthData.storage.writable ? 'Writable' : 'Not Writable'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Server Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Server Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Software</div>
                      <div className="text-sm text-muted-foreground">{healthData.server}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">PHP Version</div>
                      <div className="text-sm text-muted-foreground">{healthData.php_version}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Laravel Version</div>
                      <div className="text-sm text-muted-foreground">{healthData.laravel_version}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Server Time</div>
                      <div className="text-sm text-muted-foreground">{healthData.server_time}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Timezone</div>
                      <div className="text-sm text-muted-foreground">{healthData.timezone}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">SSL Status</div>
                      <Badge variant={healthData.ssl_enabled ? "success" : "warning"}>
                        {healthData.ssl_enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="database" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Database Overview */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Database Overview</CardTitle>
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Connection</span>
                        <Badge variant={healthData.database.status ? "success" : "destructive"}>
                          {healthData.database.status ? "Connected" : "Disconnected"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Database Size</span>
                        <span className="text-sm font-medium">{healthData.database.size}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Tables</span>
                        <span className="text-sm font-medium">{healthData.database.tables}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cache Status */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Cache Status</CardTitle>
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Driver</span>
                        <span className="text-sm font-medium">{healthData.cache.driver}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge variant={healthData.cache.status ? "success" : "destructive"}>
                          {healthData.cache.status ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Cache Size</span>
                        <span className="text-sm font-medium">
                          {formatBytes(healthData.cache.size || 0)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-primary" />
                    Performance Trends
                  </CardTitle>
                  <CardDescription>
                    System performance metrics over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <PerformanceChart data={healthData.load_trends || []} />
                  </div>
                </CardContent>
              </Card>

              {/* Add more performance metrics cards */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Add detailed performance metric cards */}
                <MetricCard
                  title="Response Time"
                  value={`${healthData.performance_metrics?.response_time?.time_ms || 0}ms`}
                  icon={Timer}
                  status={healthData.performance_metrics?.response_time?.status ? 'healthy' : 'warning'}
                />
                
                <MetricCard
                  title="Database Queries"
                  value={healthData.performance_metrics?.database_queries?.total_queries || 0}
                  icon={Database}
                  status={healthData.performance_metrics?.database_queries?.slow_queries > 0 ? 'warning' : 'healthy'}
                />
                
                <MetricCard
                  title="Cache Hit Rate"
                  value={`${healthData.performance_metrics?.cache_hits?.hit_rate || 0}%`}
                  icon={Zap}
                  status={healthData.performance_metrics?.cache_hits?.hit_rate > 80 ? 'healthy' : 'warning'}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleClearCache}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Cache
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.post(route('app.settings.system.optimize'))}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Optimize
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.get(route('app.settings.system.logs'))}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Logs
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCheckUpdates}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Check Updates
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    </SettingsLayout>
  );
} 