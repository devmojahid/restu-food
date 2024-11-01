import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Switch } from "@/Components/ui/switch";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import {
  Shield,
  Smartphone,
  Key,
  History,
  Globe,
  AlertTriangle,
  Check,
  X,
  Clock,
  LogOut,
} from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Separator } from "@/Components/ui/separator";
import { useForm } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";

export default function SecuritySettings() {
  const [showTwoFactorDialog, setShowTwoFactorDialog] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [recoveryCode, setRecoveryCode] = useState(null);

  const { data, setData, post, processing } = useForm({
    two_factor_enabled: false,
    two_factor_code: "",
    login_notifications: true,
    suspicious_activity_alerts: true,
    require_2fa_for_sensitive_operations: false,
  });

  // Mock login history data
  const loginHistory = [
    {
      id: 1,
      device: "Chrome on Windows",
      location: "London, UK",
      ip: "192.168.1.1",
      timestamp: "2024-03-20 14:30:00",
      status: "success",
    },
    {
      id: 2,
      device: "Safari on iPhone",
      location: "New York, USA",
      ip: "192.168.1.2",
      timestamp: "2024-03-19 09:15:00",
      status: "success",
    },
    {
      id: 3,
      device: "Firefox on Mac",
      location: "Paris, France",
      ip: "192.168.1.3",
      timestamp: "2024-03-18 18:45:00",
      status: "failed",
    },
  ];

  const handleTwoFactorToggle = async (checked) => {
    if (checked) {
      // In a real app, this would make an API call to generate QR code
      setQrCode("mock-qr-code-url");
      setRecoveryCode("XXXX-XXXX-XXXX-XXXX");
      setShowTwoFactorDialog(true);
    } else {
      setData("two_factor_enabled", false);
    }
  };

  const confirmTwoFactor = () => {
    // Verify 2FA code and enable
    post(route("security.2fa.enable"), {
      onSuccess: () => {
        setShowTwoFactorDialog(false);
        setData("two_factor_enabled", true);
      },
    });
  };

  const getStatusBadge = (status) => {
    if (status === "success") {
      return (
        <Badge variant="success" className="font-normal">
          Successful
        </Badge>
      );
    }
    return (
      <Badge variant="destructive" className="font-normal">
        Failed
      </Badge>
    );
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Security Settings</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your account's security preferences and settings
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          {/* Two-Factor Authentication */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium">
                  Enable Two-Factor Authentication
                </Label>
                <p className="text-sm text-muted-foreground">
                  Secure your account with 2FA authentication
                </p>
              </div>
              <Switch
                checked={data.two_factor_enabled}
                onCheckedChange={handleTwoFactorToggle}
              />
            </div>

            {data.two_factor_enabled && (
              <Alert>
                <Check className="h-4 w-4" />
                <AlertDescription>
                  Two-factor authentication is enabled. Your account is secure.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Separator />

          {/* Security Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Security Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  Configure how you want to be notified about security events
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">
                    Login Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone logs into your account
                  </p>
                </div>
                <Switch
                  checked={data.login_notifications}
                  onCheckedChange={(checked) =>
                    setData("login_notifications", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">
                    Suspicious Activity Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts about suspicious activity on your account
                  </p>
                </div>
                <Switch
                  checked={data.suspicious_activity_alerts}
                  onCheckedChange={(checked) =>
                    setData("suspicious_activity_alerts", checked)
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Recent Login Activity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Recent Login Activity</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor recent login attempts to your account
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {loginHistory.map((login) => (
                <div
                  key={login.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 space-x-4 rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{login.device}</span>
                      {getStatusBadge(login.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>
                        {login.location} • IP: {login.ip}
                      </p>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{login.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  {login.status === "success" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Revoke Access
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2FA Setup Dialog */}
        <Dialog
          open={showTwoFactorDialog}
          onOpenChange={setShowTwoFactorDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
              <DialogDescription>
                Scan the QR code below with your authenticator app to get
                started
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* QR Code Display */}
              <div className="flex justify-center p-4 bg-muted rounded-lg">
                <div className="w-48 h-48 bg-primary/10 flex items-center justify-center">
                  {/* Replace with actual QR code component */}
                  <p className="text-sm text-muted-foreground">QR Code</p>
                </div>
              </div>

              {/* Recovery Codes */}
              <div className="space-y-2">
                <Label>Recovery Code</Label>
                <Alert>
                  <AlertDescription className="font-mono">
                    {recoveryCode}
                  </AlertDescription>
                </Alert>
                <p className="text-sm text-muted-foreground">
                  Save this recovery code in a secure place. You'll need it if
                  you lose access to your authenticator app.
                </p>
              </div>

              {/* Verification Code Input */}
              <div className="space-y-2">
                <Label htmlFor="verification_code">
                  Enter Verification Code
                </Label>
                <Input
                  id="verification_code"
                  value={data.two_factor_code}
                  onChange={(e) => setData("two_factor_code", e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowTwoFactorDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={confirmTwoFactor} disabled={processing}>
                {processing ? "Verifying..." : "Enable 2FA"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
