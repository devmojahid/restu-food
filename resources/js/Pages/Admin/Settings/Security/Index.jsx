import React from "react";
import { Head, useForm } from "@inertiajs/react";
import SettingsLayout from "../Index";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Switch } from "@/Components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Shield, AlertTriangle, Key } from "lucide-react";

export default function SecuritySettings() {
  const { data, setData, post, processing, errors } = useForm({
    two_factor_enabled: false,
    login_attempts: 5,
    password_expiry_days: 90,
    password_requirements: {
      min_length: 8,
      require_uppercase: true,
      require_numbers: true,
      require_symbols: true,
    },
    session_lifetime: 120,
    remember_me_lifetime: 5,
    api_token_expiry: 30,
    allowed_ips: [],
    blocked_ips: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("admin.settings.security.update"));
  };

  return (
    <SettingsLayout>
      <Head title="Security Settings" />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Authentication Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={data.two_factor_enabled}
                    onCheckedChange={(checked) =>
                      setData("two_factor_enabled", checked)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Maximum Login Attempts</Label>
                  <Input
                    type="number"
                    value={data.login_attempts}
                    onChange={(e) =>
                      setData("login_attempts", parseInt(e.target.value))
                    }
                    min="1"
                    max="10"
                  />
                  <p className="text-sm text-muted-foreground">
                    Number of failed attempts before account lockout
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Session Lifetime (minutes)</Label>
                  <Input
                    type="number"
                    value={data.session_lifetime}
                    onChange={(e) =>
                      setData("session_lifetime", parseInt(e.target.value))
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password Policy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Minimum Length</Label>
                    <Input
                      type="number"
                      value={data.password_requirements.min_length}
                      onChange={(e) =>
                        setData("password_requirements", {
                          ...data.password_requirements,
                          min_length: parseInt(e.target.value),
                        })
                      }
                      min="6"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Password Expiry (days)</Label>
                    <Input
                      type="number"
                      value={data.password_expiry_days}
                      onChange={(e) =>
                        setData(
                          "password_expiry_days",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={data.password_requirements.require_uppercase}
                      onCheckedChange={(checked) =>
                        setData("password_requirements", {
                          ...data.password_requirements,
                          require_uppercase: checked,
                        })
                      }
                    />
                    <Label>Require uppercase letters</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={data.password_requirements.require_numbers}
                      onCheckedChange={(checked) =>
                        setData("password_requirements", {
                          ...data.password_requirements,
                          require_numbers: checked,
                        })
                      }
                    />
                    <Label>Require numbers</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={data.password_requirements.require_symbols}
                      onCheckedChange={(checked) =>
                        setData("password_requirements", {
                          ...data.password_requirements,
                          require_symbols: checked,
                        })
                      }
                    />
                    <Label>Require special characters</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">API Security</h3>
                <div className="space-y-2">
                  <Label>API Token Expiry (days)</Label>
                  <Input
                    type="number"
                    value={data.api_token_expiry}
                    onChange={(e) =>
                      setData("api_token_expiry", parseInt(e.target.value))
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">IP Access Control</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Allowed IP Addresses</Label>
                    <Textarea
                      value={data.allowed_ips.join("\n")}
                      onChange={(e) =>
                        setData(
                          "allowed_ips",
                          e.target.value.split("\n").filter(Boolean)
                        )
                      }
                      placeholder="Enter one IP per line"
                      className="h-32"
                    />
                    <p className="text-sm text-muted-foreground">
                      Leave empty to allow all IPs
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Blocked IP Addresses</Label>
                    <Textarea
                      value={data.blocked_ips.join("\n")}
                      onChange={(e) =>
                        setData(
                          "blocked_ips",
                          e.target.value.split("\n").filter(Boolean)
                        )
                      }
                      placeholder="Enter one IP per line"
                      className="h-32"
                    />
                  </div>
                </div>
              </div>

              <Alert variant="warning" className="mt-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important Security Notice</AlertTitle>
                <AlertDescription>
                  Changes to security settings may require users to
                  re-authenticate. Make sure to communicate these changes to
                  your team.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                  {processing ? "Saving..." : "Save Security Settings"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
}
