import React, { useState, useCallback } from "react";
import { Head, useForm } from "@inertiajs/react";
import SettingsLayout from "../Index";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Progress } from "@/Components/ui/progress";
import { Badge } from "@/Components/ui/badge";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { FileUploader } from "@/Components/Admin/Filesystem/FileUploader";
import {
  Download,
  Upload,
  RefreshCw,
  Database,
  FileText,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Info,
  Package,
  ArrowUpCircle,
  Loader2,
  Shield,
  History,
  Settings,
  HardDrive,
} from "lucide-react";
import { useToast } from "@/Components/ui/use-toast";
import { cn } from "@/lib/utils";

const UpdateStep = ({ 
  title, 
  description, 
  icon: Icon, 
  status, 
  progress, 
  onRun,
  isRunning 
}) => {
  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg bg-card">
      <div className={cn(
        "p-2 rounded-full",
        status === 'completed' ? 'bg-green-100' :
        status === 'failed' ? 'bg-red-100' :
        status === 'running' ? 'bg-blue-100' :
        'bg-gray-100'
      )}>
        <Icon className={cn(
          "h-5 w-5",
          status === 'completed' ? 'text-green-600' :
          status === 'failed' ? 'text-red-600' :
          status === 'running' ? 'text-blue-600' :
          'text-gray-600'
        )} />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {status !== 'completed' && (
            <Button 
              variant={status === 'failed' ? "destructive" : "secondary"}
              size="sm"
              onClick={onRun}
              disabled={isRunning || status === 'running'}
            >
              {isRunning || status === 'running' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  {status === 'failed' ? 'Retry' : 'Run'}
                </>
              )}
            </Button>
          )}
        </div>
        {(progress !== undefined && progress > 0) && (
          <Progress value={progress} className="h-2" />
        )}
        {status === 'completed' && (
          <Badge variant="success" className="mt-2">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )}
        {status === 'failed' && (
          <Badge variant="destructive" className="mt-2">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )}
      </div>
    </div>
  );
};

const ChangelogDialog = ({ open, onClose, changelog }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-2xl max-h-[80vh]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Changelog
        </DialogTitle>
      </DialogHeader>
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-6">
          {changelog.map((entry, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Version {entry.version}</h3>
                <Badge variant="outline">{entry.date}</Badge>
              </div>
              <div className="space-y-2">
                {entry.changes.map((change, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <div className="w-1 h-1 rounded-full bg-primary mt-2" />
                    <span>{change}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>
);

const SystemUpdates = ({ currentVersion, latestVersion, changelog, updateInfo }) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateSteps, setUpdateSteps] = useState({
    download: { status: 'pending', progress: 0 },
    systemFiles: { status: 'pending', progress: 0 },
    database: { status: 'pending', progress: 0 },
    coreAssets: { status: 'pending', progress: 0 },
    packageAssets: { status: 'pending', progress: 0 },
    cleanup: { status: 'pending', progress: 0 },
  });
  const [showManualUpdate, setShowManualUpdate] = useState(false);

  const { data, setData, post, processing } = useForm({
    updateFile: null,
  });

  const handleOneClickUpdate = useCallback(async () => {
    setIsUpdating(true);
    setUpdateProgress(0);

    try {
      // Simulate update process
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setUpdateProgress(i);
      }

      toast({
        title: "Update Successful",
        description: "The system has been updated to the latest version.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "An error occurred during the update process.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
      setUpdateProgress(0);
    }
  }, [toast]);

  const handleManualUpdate = useCallback((files) => {
    setData('updateFile', files[0]);
  }, [setData]);

  const runUpdateStep = useCallback(async (step) => {
    setUpdateSteps(prev => ({
      ...prev,
      [step]: { ...prev[step], status: 'running', progress: 0 }
    }));

    try {
      // Simulate step progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUpdateSteps(prev => ({
          ...prev,
          [step]: { ...prev[step], progress: i }
        }));
      }

      setUpdateSteps(prev => ({
        ...prev,
        [step]: { status: 'completed', progress: 100 }
      }));

      toast({
        title: "Step Completed",
        description: `Successfully completed the ${step} step.`,
      });
    } catch (error) {
      setUpdateSteps(prev => ({
        ...prev,
        [step]: { status: 'failed', progress: 0 }
      }));

      toast({
        title: "Step Failed",
        description: `Failed to complete the ${step} step.`,
        variant: "destructive",
      });
    }
  }, [toast]);

  const updateStepsList = [
    {
      key: 'download',
      title: 'Download Update Files',
      description: 'Download the latest update package from the server',
      icon: Download,
    },
    {
      key: 'systemFiles',
      title: 'Update System Files',
      description: 'Update core system files and directories',
      icon: HardDrive,
    },
    {
      key: 'database',
      title: 'Update Database',
      description: 'Run database migrations and updates',
      icon: Database,
    },
    {
      key: 'coreAssets',
      title: 'Publish Core Assets',
      description: 'Update and publish core system assets',
      icon: FileText,
    },
    {
      key: 'packageAssets',
      title: 'Publish Package Assets',
      description: 'Update and publish third-party package assets',
      icon: Package,
    },
    {
      key: 'cleanup',
      title: 'Clean Up',
      description: 'Remove temporary files and clear caches',
      icon: Trash2,
    },
  ];

  return (
    <SettingsLayout>
      <Head title="System Updates" />

      <div className="space-y-6">
        {/* System Status Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Current Version Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                Current Version
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <Badge variant="outline" className="text-lg">
                    v{currentVersion}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Installed On</span>
                  <span>{updateInfo.installed_date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Checked</span>
                  <span>{updateInfo.last_checked}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Latest Version Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpCircle className="h-5 w-5 text-muted-foreground" />
                Latest Version
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Latest Version</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-lg">
                      v{latestVersion}
                    </Badge>
                    {latestVersion > currentVersion && (
                      <Badge variant="success">Update Available</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Release Date</span>
                  <span>{updateInfo.latest_release_date}</span>
                </div>
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => setShowChangelog(true)}
                >
                  <History className="h-4 w-4 mr-2" />
                  View Changelog
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pre-update Checks and Warnings */}
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-600">
            <strong>Important:</strong> Please ensure you have a complete backup of your server files and database before proceeding with any updates.
          </AlertDescription>
        </Alert>

        {/* Update Options */}
        <Card>
          <CardHeader>
            <CardTitle>Update Options</CardTitle>
            <CardDescription>
              Choose your preferred method to update the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* One-Click Update */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Automatic Update</h3>
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                <div className="space-y-1">
                  <p className="font-medium">One-Click Update</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically download and install the latest update
                  </p>
                </div>
                <Button
                  onClick={handleOneClickUpdate}
                  disabled={isUpdating || processing || currentVersion === latestVersion}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Update Now
                    </>
                  )}
                </Button>
              </div>
              {isUpdating && (
                <Progress value={updateProgress} className="h-2" />
              )}
            </div>

            {/* Manual Update Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Manual Update</h3>
              
              {/* Upload Update Package */}
              <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Upload Update Package</p>
                    <p className="text-sm text-muted-foreground">
                      Upload a ZIP file containing the update package
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowManualUpdate(true)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Package
                  </Button>
                </div>
              </div>

              {/* Step by Step Update */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Step by Step Update</h4>
                  <Badge variant="outline">Advanced</Badge>
                </div>
                <div className="space-y-3">
                  {updateStepsList.map((step) => (
                    <UpdateStep
                      key={step.key}
                      title={step.title}
                      description={step.description}
                      icon={step.icon}
                      status={updateSteps[step.key].status}
                      progress={updateSteps[step.key].progress}
                      onRun={() => runUpdateStep(step.key)}
                      isRunning={updateSteps[step.key].status === 'running'}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Requirements & Compatibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Requirements & Compatibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* PHP Version */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">PHP Version</p>
                  <p className="text-sm text-muted-foreground">
                    Minimum required: {updateInfo.requirements.php_version}
                  </p>
                </div>
                <Badge variant={
                  updateInfo.compatibility.php ? "success" : "destructive"
                }>
                  {updateInfo.current_php_version}
                </Badge>
              </div>

              {/* MySQL Version */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">MySQL Version</p>
                  <p className="text-sm text-muted-foreground">
                    Minimum required: {updateInfo.requirements.mysql_version}
                  </p>
                </div>
                <Badge variant={
                  updateInfo.compatibility.mysql ? "success" : "destructive"
                }>
                  {updateInfo.current_mysql_version}
                </Badge>
              </div>

              {/* Required Extensions */}
              <div className="space-y-2">
                <p className="font-medium">Required Extensions</p>
                <div className="grid grid-cols-2 gap-2">
                  {updateInfo.requirements.extensions.map((ext) => (
                    <div 
                      key={ext.name}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span>{ext.name}</span>
                      <Badge variant={ext.installed ? "success" : "destructive"}>
                        {ext.installed ? "Installed" : "Missing"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Directory Permissions */}
              <div className="space-y-2">
                <p className="font-medium">Directory Permissions</p>
                <div className="grid grid-cols-2 gap-2">
                  {updateInfo.requirements.directories.map((dir) => (
                    <div 
                      key={dir.path}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span className="text-sm font-mono">{dir.path}</span>
                      <Badge variant={dir.writable ? "success" : "destructive"}>
                        {dir.writable ? "Writable" : "Not Writable"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manual Update Dialog */}
      <Dialog open={showManualUpdate} onOpenChange={setShowManualUpdate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Update Package</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <FileUploader
              maxFiles={1}
              fileType="zip"
              onUpload={handleManualUpdate}
              value={data.updateFile}
              description="Upload a ZIP file containing the update package"
            />
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Only upload update packages from trusted sources to prevent security issues.
              </AlertDescription>
            </Alert>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowManualUpdate(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={!data.updateFile || processing}
                onClick={() => {
                  // Handle manual update upload
                  setShowManualUpdate(false);
                }}
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload & Install
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Changelog Dialog */}
      <ChangelogDialog
        open={showChangelog}
        onClose={() => setShowChangelog(false)}
        changelog={changelog}
      />
    </SettingsLayout>
  );
};

export default SystemUpdates; 