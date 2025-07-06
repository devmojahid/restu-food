import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import SettingsLayout from "../Index";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { ScrollArea } from "@/Components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  AlertTriangle,
  Download,
  FileText,
  Filter,
  RefreshCw,
  Search,
  Trash2,
  XCircle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { useToast } from "@/Components/ui/use-toast";
import { cn } from "@/lib/utils";
import { format as formatDate } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Alert, AlertDescription } from "@/Components/ui/alert";

const LogLevelBadge = ({ level }) => {
  const variants = {
    error: "destructive",
    warning: "warning",
    info: "secondary",
    debug: "outline",
  };

  const icons = {
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
    debug: CheckCircle,
  };

  const Icon = icons[level] || Info;

  return (
    <Badge variant={variants[level] || "default"} className="capitalize">
      <Icon className="w-3 h-3 mr-1" />
      {level}
    </Badge>
  );
};

const LogDetailDialog = ({ log, open, onClose }) => {
  if (!log) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Log Details</DialogTitle>
          <DialogDescription>
            Detailed information about the log entry
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                {formatDate(new Date(log.date), "PPP")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                {formatDate(new Date(log.date), "HH:mm:ss")}
              </span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Level</h4>
            <LogLevelBadge level={log.level} />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Environment</h4>
            <Badge variant="outline">{log.environment}</Badge>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Message</h4>
            <Alert>
              <AlertDescription>{log.message}</AlertDescription>
            </Alert>
          </div>
          {log.context && Object.keys(log.context).length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1">Context</h4>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                {JSON.stringify(log.context, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function Logs({ logs = [] }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedEnvironment, setSelectedEnvironment] = useState("all");
  const [selectedLog, setSelectedLog] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showLogDetail, setShowLogDetail] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const environments = useMemo(() => 
    [...new Set(logs.map(log => log.environment))],
    [logs]
  );

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch = searchTerm === "" || 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.environment.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLevel = selectedLevel === "all" || log.level === selectedLevel;
      const matchesEnvironment = selectedEnvironment === "all" || 
        log.environment === selectedEnvironment;

      return matchesSearch && matchesLevel && matchesEnvironment;
    });
  }, [logs, searchTerm, selectedLevel, selectedEnvironment]);

  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(handleRefresh, 30000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    router.reload({
      preserveScroll: true,
      onSuccess: () => {
        setIsLoading(false);
        toast({
          title: "Success",
          description: "Logs refreshed successfully",
        });
      },
      onError: () => {
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to refresh logs",
          variant: "destructive",
        });
      },
    });
  }, [toast]);

  const handleClearLogs = useCallback(() => {
    router.post(route("app.settings.system.cache.clear"), {
      type: 'logs',
      _method: 'POST'
    }, {
      preserveScroll: true,
      preserveState: true,
      onBefore: () => {
        setIsLoading(true);
        setShowClearConfirm(false);
      },
      onSuccess: () => {
        setIsLoading(false);
        toast({
          title: "Success",
          description: "System logs cleared successfully",
          duration: 3000,
        });
        
        router.visit(window.location.pathname, {
          only: ['logs'],
          preserveScroll: true,
          preserveState: false,
          onSuccess: () => {
            setSearchTerm("");
            setSelectedLevel("all");
            setSelectedEnvironment("all");
            setSelectedLog(null);
          }
        });
      },
      onError: (error) => {
        setIsLoading(false);
        toast({
          title: "Error",
          description: error?.message || "Failed to clear system logs. Please try again.",
          variant: "destructive",
          duration: 5000,
        });
      },
      onFinish: () => setIsLoading(false),
    });
  }, []);

  const handleDownloadLogs = useCallback((format = 'json') => {
    try {
      let content, filename;
      const timestamp = formatDate(new Date(), "yyyy-MM-dd-HHmmss");
      
      if (format === 'json') {
        content = new Blob(
          [JSON.stringify(filteredLogs, null, 2)], 
          { type: 'application/json' }
        );
        filename = `system-logs-${timestamp}.json`;
      } else if (format === 'csv') {
        const headers = ['Timestamp', 'Level', 'Environment', 'Message', 'Context'];
        const rows = filteredLogs.map(log => [
          formatDate(new Date(log.date), "yyyy-MM-dd HH:mm:ss"),
          log.level,
          log.environment,
          log.message.replace(/,/g, ';'), // Escape commas
          log.context ? JSON.stringify(log.context).replace(/,/g, ';') : ''
        ]);
        
        const csvContent = [
          headers.join(','),
          ...rows.map(row => row.join(','))
        ].join('\n');
        
        content = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        filename = `system-logs-${timestamp}.csv`;
      } else if (format === 'txt') {
        const textContent = filteredLogs.map(log => 
          `[${formatDate(new Date(log.date), "yyyy-MM-dd HH:mm:ss")}] ${log.level.toUpperCase()}: ${log.message}`
        ).join('\n');
        
        content = new Blob([textContent], { type: 'text/plain' });
        filename = `system-logs-${timestamp}.txt`;
      }

      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: `Logs exported successfully as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export logs. Please try again.",
        variant: "destructive",
      });
    }
  }, [filteredLogs]);

  const exportOptions = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="min-w-[120px] justify-between hover:bg-accent"
        >
          <span className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56"
        sideOffset={5}
      >
        <DropdownMenuItem 
          onClick={() => handleDownloadLogs('json')}
          className="flex items-center gap-2 px-3 py-2 hover:bg-accent cursor-pointer"
        >
          <FileText className="h-4 w-4 shrink-0" />
          <span className="flex-1">Export as JSON</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleDownloadLogs('csv')}
          className="flex items-center gap-2 px-3 py-2 hover:bg-accent cursor-pointer"
        >
          <Table className="h-4 w-4 shrink-0" />
          <span className="flex-1">Export as CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleDownloadLogs('txt')}
          className="flex items-center gap-2 px-3 py-2 hover:bg-accent cursor-pointer"
        >
          <FileText className="h-4 w-4 shrink-0" />
          <span className="flex-1">Export as Text</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const ClearLogsConfirmDialog = () => (
    <Dialog 
      open={showClearConfirm} 
      onOpenChange={(open) => {
        if (!isLoading) setShowClearConfirm(open);
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Clear System Logs
          </DialogTitle>
          <DialogDescription className="pt-2">
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This action will permanently delete all system logs. This cannot be undone.
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to proceed with clearing all system logs?
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setShowClearConfirm(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleClearLogs}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Clearing Logs...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Clear All Logs
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const clearLogsButton = (
    <Button
      variant="destructive"
      size="sm"
      onClick={() => setShowClearConfirm(true)}
      disabled={isLoading || filteredLogs.length === 0}
      className="hover:bg-destructive/90 gap-2"
    >
      {isLoading ? (
        <>
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Clearing...</span>
        </>
      ) : (
        <>
          <Trash2 className="h-4 w-4" />
          <span>Clear Logs</span>
        </>
      )}
    </Button>
  );

  if (!logs) {
    return (
      <SettingsLayout>
        <Card>
          <CardContent className="flex items-center justify-center h-[400px]">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout>
      <Head title="System Logs" />

      <Card>
        <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg font-medium">System Logs</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage system logs
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="hover:bg-accent"
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
              className="hover:bg-accent"
            >
              <RefreshCw
                className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")}
              />
              Refresh
            </Button>
            {exportOptions}
            {clearLogsButton}
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Environments</SelectItem>
                {environments.map((env) => (
                  <SelectItem key={env} value={env}>
                    {env}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Logs Table */}
          <ScrollArea className="h-[600px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Date</TableHead>
                  <TableHead className="w-[100px]">Level</TableHead>
                  <TableHead className="w-[120px]">Environment</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log, index) => (
                  <TableRow 
                    key={index}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => {
                      setSelectedLog(log);
                      setShowLogDetail(true);
                    }}
                  >
                    <TableCell className="font-mono text-xs">
                      {formatDate(new Date(log.date), "yyyy-MM-dd HH:mm:ss")}
                    </TableCell>
                    <TableCell>
                      <LogLevelBadge level={log.level} />
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.environment}
                    </TableCell>
                    <TableCell className="max-w-xl">
                      <div className="truncate">
                        {log.message}
                      </div>
                      {log.context && Object.keys(log.context).length > 0 && (
                        <Badge variant="outline" className="mt-1">
                          Has Context
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">No logs found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Log Detail Dialog */}
      <LogDetailDialog
        log={selectedLog}
        open={showLogDetail}
        onClose={() => {
          setShowLogDetail(false);
          setSelectedLog(null);
        }}
      />

      {/* Add confirmation dialog */}
      <ClearLogsConfirmDialog />
    </SettingsLayout>
  );
} 