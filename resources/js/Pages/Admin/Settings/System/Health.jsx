import React, { useState } from "react";
import { Head } from "@inertiajs/react";
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
  ShieldCheck
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/Components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Skeleton } from "@/Components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/Components/ui/tooltip";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { router } from "@inertiajs/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";

export default function SystemHealth({ healthData }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [showDetails, setShowDetails] = useState(false);
  
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

  const handleRefresh = () => {
    setIsLoading(true);
    router.reload({ 
      preserveScroll: true,
      onSuccess: () => {
        setIsLoading(false);
        setLastUpdated(new Date());
        toast({
          title: "Success",
          description: "System health data has been updated",
        });
      },
      onError: () => {
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to update system health data",
          variant: "destructive",
        });
      }
    });
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
  const systemStatus = getSystemStatus();

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
              <div className="flex items-center gap-2">
                <Alert className={cn(
                  "w-auto h-9 px-3 py-0 flex items-center",
                  systemStatus.status === 'healthy' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                )}>
                  {systemStatus.status === 'healthy' ? (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 mr-2" />
                  )}
                  <AlertDescription className="font-medium">
                    System {systemStatus.status === 'healthy' ? 'Healthy' : 'Warning'}
                  </AlertDescription>
                </Alert>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setShowDetails(!showDetails)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Toggle Details View
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* System Overview Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="server">Server</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* System Overview */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Server Info */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Server</CardTitle>
                    <Server className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-muted-foreground">Software</div>
                        <div className="font-medium">{healthData.server}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">PHP Version</div>
                        <div className="font-medium">{healthData.php_version}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Laravel Version</div>
                        <div className="font-medium">{healthData.laravel_version}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Add System Metrics Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">System Metrics</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px] pr-4">
                      <div className="space-y-4">
                        {/* CPU Usage */}
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">CPU Usage</div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{healthData.cpu_usage || '0'}%</span>
                            </div>
                            <Progress value={healthData.cpu_usage || 0} className="h-1" />
                          </div>
                          {showDetails && (
                            <div className="mt-2 space-y-1">
                              <div className="text-xs text-muted-foreground">
                                CPU Model: {healthData.cpu_info?.model || 'Unknown'}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Cores: {healthData.cpu_info?.cores || 1}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Frequency: {healthData.cpu_info?.frequency || 'Unknown'}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Load Average */}
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Load Average</div>
                          <div className="flex gap-2">
                            {(healthData.load_average || []).map((load, i) => (
                              <Tooltip key={`load-${i}`}>
                                <TooltipTrigger asChild>
                                  <Badge variant="outline">
                                    {load}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {i === 0 ? '1 min' : i === 1 ? '5 min' : '15 min'}
                                </TooltipContent>
                              </Tooltip>
                            ))}
                          </div>
                        </div>
                        
                        {/* Uptime */}
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">System Uptime</div>
                          <div className="font-medium">
                            {healthData.uptime || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Database Status */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Database</CardTitle>
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-muted-foreground">Connection</div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{healthData.database.connection}</span>
                          <Badge variant={getStatusColor(healthData.database.status)}>
                            {healthData.database.status ? 'Connected' : 'Disconnected'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cache Status */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cache</CardTitle>
                    <MemoryStick className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs text-muted-foreground">Driver</div>
                          <div className="font-medium">{healthData.cache.driver}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Status</div>
                          <Badge variant={getStatusColor(healthData.cache.status)}>
                            {healthData.cache.status ? 'Available' : 'Unavailable'}
                          </Badge>
                        </div>
                        {showDetails && (
                          <div>
                            <div className="text-xs text-muted-foreground">Cache Size</div>
                            <div className="font-medium">
                              {formatBytes(healthData.cache.size || 0)}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="server" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Server Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Time</span>
                      <span className="text-sm font-medium">
                        {healthData.server_time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Timezone
                      </span>
                      <span className="text-sm font-medium">
                        {healthData.timezone}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">SSL</span>
                      <Badge variant={healthData.ssl_enabled ? "success" : "warning"}>
                        {healthData.ssl_enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                {/* ... more server info cards ... */}
              </div>
            </TabsContent>

            <TabsContent value="database" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        Database Overview
                      </CardTitle>
                      <DbIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Connection
                      </span>
                      <Badge variant={healthData.database.status ? "success" : "destructive"}>
                        {healthData.database.status ? "Connected" : "Disconnected"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Database Size
                      </span>
                      <span className="text-sm font-medium">
                        {healthData.database.size}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Total Tables
                      </span>
                      <span className="text-sm font-medium">
                        {healthData.database.tables}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Add Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.post(route('app.settings.system.cache.clear'))}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear Cache
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Clear application cache</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.post(route('app.settings.system.logs.clear'))}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Clear Logs
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Clear system logs</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.post(route('app.settings.system.optimize'))}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Optimize
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Optimize application</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.get(route('app.settings.system.updates'))}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Check Updates
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Check for system updates</TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>

          {/* Storage and Memory */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Storage Usage */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {storage.used} used of {storage.total}
                      </span>
                      <span className="font-medium">{storage.percentage}%</span>
                    </div>
                    <Progress value={parseFloat(storage.percentage)} />
                  </div>
                  
                  <div className="pt-2">
                    <Badge variant={healthData.storage.writable ? 'outline' : 'destructive'}>
                      {healthData.storage.writable ? 'Writable' : 'Not Writable'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Memory Usage */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Memory</CardTitle>
                <CircuitBoard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Current Usage</div>
                      <div className="font-medium">{formatBytes(healthData.memory_usage)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Memory Limit</div>
                      <div className="font-medium">{healthData.max_memory}</div>
                    </div>
                    {showDetails && (
                      <>
                        <div>
                          <div className="text-xs text-muted-foreground">Peak Usage</div>
                          <div className="font-medium">
                            {formatBytes(healthData.memory_peak || 0)}
                          </div>
                        </div>
                        <div className="mt-2">
                          <Progress 
                            value={(healthData.memory_usage / parseInt(healthData.max_memory)) * 100} 
                            className="h-2"
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Add Refresh Button */}
          <div className="absolute top-4 right-4">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className={cn(
                "w-4 h-4 mr-2",
                isLoading && "animate-spin"
              )} />
              {isLoading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>
      </TooltipProvider>
    </SettingsLayout>
  );
} 