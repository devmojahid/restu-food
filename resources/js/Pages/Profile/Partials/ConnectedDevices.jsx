import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  LogOut,
  Shield,
  MapPin,
  Clock,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function ConnectedDevices() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const { post, processing } = useForm();

  // Mock connected devices data
  const devices = [
    {
      id: 1,
      type: "desktop",
      name: "Windows PC - Chrome",
      browser: "Chrome 122.0.0",
      os: "Windows 11",
      ip: "192.168.1.1",
      location: "London, UK",
      lastActive: "2024-03-20T14:30:00",
      isCurrent: true,
    },
    {
      id: 2,
      type: "mobile",
      name: "iPhone 15 Pro - Safari",
      browser: "Safari 17.0",
      os: "iOS 17.4",
      ip: "192.168.1.2",
      location: "New York, USA",
      lastActive: "2024-03-19T09:15:00",
      isCurrent: false,
    },
    {
      id: 3,
      type: "tablet",
      name: "iPad Air - Safari",
      browser: "Safari 17.0",
      os: "iPadOS 17.4",
      ip: "192.168.1.3",
      location: "Paris, France",
      lastActive: "2024-03-18T18:45:00",
      isCurrent: false,
    },
  ];

  const getDeviceIcon = (type) => {
    switch (type) {
      case "mobile":
        return Smartphone;
      case "tablet":
        return Tablet;
      case "desktop":
        return Monitor;
      default:
        return Laptop;
    }
  };

  const handleLogout = (device) => {
    setSelectedDevice(device);
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    post(route("profile.devices.logout", { device: selectedDevice.id }), {
      onSuccess: () => {
        setShowLogoutDialog(false);
        setSelectedDevice(null);
      },
    });
  };

  const logoutAllDevices = () => {
    post(route("profile.devices.logout.all"));
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Connected Devices</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage devices that are currently signed in to your account
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Current Device Alert */}
          <Alert className="bg-primary/10 border-primary/20">
            <Shield className="h-4 w-4 text-primary" />
            <AlertDescription className="text-primary">
              You're currently signed in on this device
            </AlertDescription>
          </Alert>

          {/* Device List */}
          <div className="space-y-4">
            {devices.map((device) => {
              const DeviceIcon = getDeviceIcon(device.type);
              return (
                <div
                  key={device.id}
                  className={cn(
                    "flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border",
                    device.isCurrent && "bg-muted/50"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-full p-2 bg-primary/10">
                      <DeviceIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{device.name}</h3>
                        {device.isCurrent && (
                          <Badge variant="secondary" className="font-normal">
                            Current Device
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p className="flex items-center gap-1">
                          <Info className="h-3.5 w-3.5" />
                          {device.browser} • {device.os}
                        </p>
                        <p className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {device.location} • IP: {device.ip}
                        </p>
                        <p className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          Last active:{" "}
                          {format(new Date(device.lastActive), "PPp")}
                        </p>
                      </div>
                    </div>
                  </div>
                  {!device.isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 text-destructive hover:text-destructive"
                      onClick={() => handleLogout(device)}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sign Out All Devices */}
          <div className="flex flex-col gap-4 rounded-lg border border-destructive/50 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
              <div className="space-y-1">
                <h3 className="font-medium text-destructive">
                  Sign Out All Other Devices
                </h3>
                <p className="text-sm text-muted-foreground">
                  This will sign you out from all devices except your current
                  one. You'll need to sign in again on those devices.
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              className="sm:self-start"
              onClick={logoutAllDevices}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out All Other Devices
            </Button>
          </div>
        </div>

        {/* Logout Confirmation Dialog */}
        <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sign Out Device</DialogTitle>
              <DialogDescription>
                Are you sure you want to sign out from this device?
                {selectedDevice && (
                  <div className="mt-2 p-2 rounded-md bg-muted">
                    <p className="font-medium">{selectedDevice.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedDevice.location}
                    </p>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowLogoutDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmLogout}
                disabled={processing}
              >
                {processing ? "Signing Out..." : "Sign Out"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
