import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import SettingsLayout from "../Index";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Skeleton } from "@/Components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  History,
  Search,
  Filter,
  RefreshCw,
  User,
  Calendar,
  Clock,
  Tag,
  FileText,
  Activity as ActivityIcon,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  LogIn,
  Download,
  Share2,
  Settings,
  AlertTriangle,
  Shield,
  Database,
  Zap,
  BarChart as BarChartIcon,
  Loader2,
} from "lucide-react";
import { useToast } from "@/Components/ui/use-toast";
import { format as formatDate } from "date-fns";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ResponsiveContainer } from "recharts";
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip,
  CartesianGrid 
} from "recharts";

const activityTypes = {
  create: { icon: Plus, color: 'green', label: 'Create' },
  update: { icon: Pencil, color: 'blue', label: 'Update' },
  delete: { icon: Trash2, color: 'red', label: 'Delete' },
  login: { icon: LogIn, color: 'purple', label: 'Login' },
  export: { icon: Download, color: 'orange', label: 'Export' },
  share: { icon: Share2, color: 'pink', label: 'Share' },
  settings: { icon: Settings, color: 'gray', label: 'Settings' },
  warning: { icon: AlertTriangle, color: 'yellow', label: 'Warning' },
  security: { icon: Shield, color: 'indigo', label: 'Security' },
  database: { icon: Database, color: 'cyan', label: 'Database' },
  system: { icon: Zap, color: 'violet', label: 'System' },
  report: { icon: BarChartIcon, color: 'teal', label: 'Report' },
};

const ActivityLogItem = ({ activity, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getActivityIcon = (type) => {
    const activityType = activityTypes[type?.toLowerCase()];
    if (!activityType) return <ActivityIcon className="h-4 w-4 text-gray-500" />;
    const Icon = activityType.icon;
    return <Icon className={`h-4 w-4 text-${activityType.color}-500`} />;
  };

  const getActivityColor = (type) => {
    const activityType = activityTypes[type?.toLowerCase()];
    if (!activityType) return 'bg-gray-50 border-gray-100';
    return `bg-${activityType.color}-50 border-${activityType.color}-100`;
  };

  const getSeverityBadge = (severity) => {
    const variants = {
      low: 'secondary',
      medium: 'warning',
      high: 'destructive',
    };
    return (
      <Badge variant={variants[severity] || 'secondary'}>
        {severity?.toUpperCase()}
      </Badge>
    );
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn(
        "rounded-lg border p-4 mb-4 transition-all duration-200",
        getActivityColor(activity.type)
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 rounded-full bg-white">
            {getActivityIcon(activity.type)}
          </div>
          <div>
            <h4 className="text-sm font-medium">{activity.description}</h4>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span>{activity.causer || 'System'}</span>
              <span>•</span>
              <Calendar className="h-3 w-3" />
              <span>{formatDate(new Date(activity.created_at), 'PPP')}</span>
              <span>•</span>
              <Clock className="h-3 w-3" />
              <span>{formatDate(new Date(activity.created_at), 'p')}</span>
            </div>
          </div>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <div className="flex items-center gap-2">
          {activity.severity && getSeverityBadge(activity.severity)}
          {activity.tags?.map((tag, index) => (
            <Badge key={index} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <CollapsibleContent className="mt-4">
        <div className="rounded-lg bg-white p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Activity Type
              </label>
              <p className="text-sm">{activity.type || 'N/A'}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Performed By
              </label>
              <p className="text-sm">{activity.causer || 'System'}</p>
            </div>
          </div>
          {activity.properties && (
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Additional Details
              </label>
              <pre className="mt-1 text-xs bg-muted p-2 rounded-md overflow-x-auto">
                {JSON.stringify(activity.properties, null, 2)}
              </pre>
            </div>
          )}
          {activity.ip_address && (
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                IP Address
              </label>
              <p className="text-sm font-mono">{activity.ip_address}</p>
            </div>
          )}
          {activity.user_agent && (
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                User Agent
              </label>
              <p className="text-sm font-mono truncate">{activity.user_agent}</p>
            </div>
          )}
          {activity.related_items?.length > 0 && (
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Related Items
              </label>
              <div className="mt-1 space-y-1">
                {activity.related_items.map((item, index) => (
                  <div key={index} className="text-sm flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-${item.color}-500`} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const ActivityStats = ({ stats }) => {
  const items = [
    {
      title: "Total Activities",
      value: stats.total,
      icon: ActivityIcon,
      description: "Total number of logged activities",
      trend: stats.trend,
    },
    {
      title: "Today's Activities",
      value: stats.today,
      icon: Calendar,
      description: "Activities logged today",
    },
    {
      title: "Active Users",
      value: stats.active_users,
      icon: User,
      description: "Users with recent activity",
    },
    {
      title: "System Events",
      value: stats.system_events,
      icon: Settings,
      description: "Automated system activities",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <div className={cn(
                    "p-2 rounded-lg",
                    "bg-primary/10"
                  )}>
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-medium">{item.title}</h3>
                </div>
                {item.trend && (
                  <Badge variant={item.trend > 0 ? "success" : "secondary"}>
                    {item.trend > 0 ? "+" : ""}{item.trend}%
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between pt-4">
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

const ActivityStatsSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
    {[1, 2, 3, 4].map((i) => (
      <Card key={i} className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const ActivityChartSkeleton = () => (
  <Card className="col-span-2">
    <CardHeader>
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent>
      <div className="h-[300px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </CardContent>
  </Card>
);

const ActivityChart = ({ data, isLoading }) => {
  const chartData = useMemo(() => {
    return data.map(point => ({
      date: formatDate(new Date(point.date), 'MMM dd'),
      activities: point.count,
      type: point.type
    }));
  }, [data]);

  if (isLoading) return <ActivityChartSkeleton />;

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChartIcon className="h-5 w-5 text-primary" />
          <span>Activity Trends</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis 
                dataKey="date" 
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
                tickFormatter={(value) => `${value}`}
              />
              <RechartsTooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3">
                      <p className="font-medium text-sm mb-2">{label}</p>
                      {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-sm">
                            {entry.name}: {entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
              <Bar 
                dataKey="activities" 
                fill="currentColor" 
                className="fill-primary/80"
                radius={[4, 4, 0, 0]}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const FilterBar = ({ searchTerm, setSearchTerm, selectedType, setSelectedType, handleExport }) => (
  <div className="flex flex-col sm:flex-row gap-4 mb-6 sticky top-0 bg-background/95 backdrop-blur-sm p-4 -mx-4 border-b z-10">
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search activities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
    <div className="flex gap-2">
      <Select value={selectedType} onValueChange={setSelectedType}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {Object.entries(activityTypes).map(([key, type]) => (
            <SelectItem key={key} value={key}>
              <div className="flex items-center gap-2">
                <type.icon className={`h-4 w-4 text-${type.color}-500`} />
                <span>{type.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleExport('csv')}>
            <FileText className="h-4 w-4 mr-2" />
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('json')}>
            <Database className="h-4 w-4 mr-2" />
            Export as JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('pdf')}>
            <FileText className="h-4 w-4 mr-2" />
            Export as PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
);


const DUMMY_DATA = {
  stats: {
    total: 1247,
    today: 89,
    active_users: 34,
    system_events: 156,
    trend: 12.5
  },
  chartData: [
    { date: '2024-03-20', count: 45, type: 'all' },
    { date: '2024-03-21', count: 62, type: 'all' },
    { date: '2024-03-22', count: 38, type: 'all' },
    { date: '2024-03-23', count: 78, type: 'all' },
    { date: '2024-03-24', count: 51, type: 'all' },
    { date: '2024-03-25', count: 89, type: 'all' },
    { date: '2024-03-26', count: 65, type: 'all' },
  ],
  activities: [
    {
      id: 1,
      type: 'create',
      description: 'Created new product "Spicy Chicken Burger"',
      causer: 'John Doe',
      causer_type: 'Admin',
      created_at: '2024-03-26T14:30:00',
      properties: {
        product_id: 123,
        category: 'Food',
        price: 9.99,
        status: 'active'
      },
      severity: 'low',
      tags: ['product', 'menu'],
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      related_items: [
        { label: 'Category: Fast Food', color: 'blue' },
        { label: 'Menu: Lunch', color: 'green' }
      ]
    },
    {
      id: 2,
      type: 'update',
      description: 'Updated order status to "Delivered"',
      causer: 'Jane Smith',
      causer_type: 'Delivery',
      created_at: '2024-03-26T14:15:00',
      properties: {
        order_id: 'ORD-2024-001',
        old_status: 'In Transit',
        new_status: 'Delivered',
        customer: 'Mike Johnson'
      },
      severity: 'medium',
      tags: ['order', 'delivery'],
      ip_address: '192.168.1.101',
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      related_items: [
        { label: 'Customer: Mike Johnson', color: 'purple' },
        { label: 'Order: #2024-001', color: 'orange' }
      ]
    },
    {
      id: 3,
      type: 'security',
      description: 'Failed login attempt detected',
      causer: 'System',
      causer_type: 'System',
      created_at: '2024-03-26T14:00:00',
      properties: {
        ip_address: '203.0.113.1',
        attempt_count: 3,
        username: 'unknown_user'
      },
      severity: 'high',
      tags: ['security', 'auth'],
      ip_address: '203.0.113.1',
      user_agent: 'Unknown',
    },
    {
      id: 4,
      type: 'database',
      description: 'Database backup completed',
      causer: 'System',
      causer_type: 'System',
      created_at: '2024-03-26T13:45:00',
      properties: {
        size: '256MB',
        duration: '120s',
        files_backed_up: 1250
      },
      severity: 'low',
      tags: ['backup', 'maintenance'],
      ip_address: 'localhost',
      user_agent: 'System Cron',
    },
    {
      id: 5,
      type: 'warning',
      description: 'Low inventory alert for "French Fries"',
      causer: 'Inventory System',
      causer_type: 'System',
      created_at: '2024-03-26T13:30:00',
      properties: {
        product_id: 456,
        current_stock: 50,
        threshold: 100,
        reorder_quantity: 500
      },
      severity: 'medium',
      tags: ['inventory', 'alert'],
      ip_address: 'localhost',
      user_agent: 'System Monitor',
      related_items: [
        { label: 'Product: French Fries', color: 'yellow' },
        { label: 'Category: Sides', color: 'blue' }
      ]
    }
  ]
};

export default function Activity({ activities = [], stats = {}, chartData = [] }) {

  activities = DUMMY_DATA.activities, 
  stats = DUMMY_DATA.stats, 
  chartData = DUMMY_DATA.chartData 

  const [isLoading, setIsLoading] = useState(false);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const { toast } = useToast();

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    router.reload({
      preserveScroll: true,
      onSuccess: () => {
        setIsLoading(false);
        toast({
          title: "Success",
          description: "Activity logs refreshed successfully",
        });
      },
      onError: () => {
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to refresh activity logs",
          variant: "destructive",
        });
      },
    });
  }, []);

  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(handleRefresh, 30000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, handleRefresh]);

  useEffect(() => {
    const timer = setTimeout(() => setIsChartLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      searchTerm === "" ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.causer?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      selectedType === "all" || activity.type === selectedType;

    return matchesSearch && matchesType;
  });

  const handleExport = async (format) => {
    try {
      const response = await fetch(`/api/activity-logs/export?format=${format}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `activity-logs-${format}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export activity logs",
        variant: "destructive",
      });
    }
  };

  return (
    <SettingsLayout>
      <Head title="Activity Logs" />

      <div className="space-y-6">
        {isLoading ? <ActivityStatsSkeleton /> : <ActivityStats stats={stats} />}
        
        <ActivityChart data={chartData} isLoading={isChartLoading} />

        <Card>
          <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg font-medium">Activity Logs</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Monitor and track system activities
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={cn(
                  "hover:bg-accent",
                  autoRefresh && "bg-accent/50"
                )}
              >
                <RefreshCw
                  className={cn(
                    "h-4 w-4 mr-2",
                    autoRefresh && "animate-spin"
                  )}
                />
                {autoRefresh ? "Auto-refreshing" : "Auto-refresh"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw
                  className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")}
                />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <FilterBar 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              handleExport={handleExport}
            />

            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {filteredActivities.map((activity, index) => (
                  <ActivityLogItem 
                    key={index} 
                    activity={activity} 
                    index={index}
                  />
                ))}
                {filteredActivities.length === 0 && (
                  <div className="text-center py-8">
                    <History className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">No activities found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
} 