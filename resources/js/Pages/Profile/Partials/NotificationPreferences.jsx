import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Switch } from "@/Components/ui/switch";
import { Label } from "@/Components/ui/label";
import {
  Bell,
  Mail,
  Shield,
  MessageSquare,
  Star,
  Clock,
  Check,
} from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Separator } from "@/Components/ui/separator";
import { useForm } from "@inertiajs/react";

export default function NotificationPreferences() {
  const { data, setData, patch, processing, recentlySuccessful } = useForm({
    notifications: {
      email: {
        security_alerts: true,
        account_updates: true,
        newsletter: false,
        marketing: false,
      },
      push: {
        security_alerts: true,
        account_updates: true,
        new_features: true,
        system_updates: false,
      },
      desktop: {
        login_alerts: true,
        security_events: true,
        account_activity: false,
      },
    },
    communication_preferences: {
      email_frequency: "daily",
      digest_enabled: true,
      quiet_hours: {
        enabled: false,
        start: "22:00",
        end: "07:00",
      },
    },
  });

  const updatePreferences = (e) => {
    e.preventDefault();
    patch(route("profile.notifications.update"));
  };

  const notificationCategories = [
    {
      title: "Email Notifications",
      icon: Mail,
      description: "Configure how you receive email notifications",
      settings: [
        {
          key: "security_alerts",
          label: "Security Alerts",
          description: "Get notified about security-related events",
          path: "notifications.email.security_alerts",
        },
        {
          key: "account_updates",
          label: "Account Updates",
          description: "Receive updates about your account activity",
          path: "notifications.email.account_updates",
        },
        {
          key: "newsletter",
          label: "Newsletter",
          description: "Receive our weekly newsletter",
          path: "notifications.email.newsletter",
        },
        {
          key: "marketing",
          label: "Marketing Communications",
          description: "Receive marketing and promotional emails",
          path: "notifications.email.marketing",
        },
      ],
    },
    {
      title: "Push Notifications",
      icon: Bell,
      description: "Manage your mobile push notifications",
      settings: [
        {
          key: "security_alerts",
          label: "Security Alerts",
          description: "Instant notifications for security events",
          path: "notifications.push.security_alerts",
        },
        {
          key: "account_updates",
          label: "Account Updates",
          description: "Updates about your account status",
          path: "notifications.push.account_updates",
        },
        {
          key: "new_features",
          label: "New Features",
          description: "Be the first to know about new features",
          path: "notifications.push.new_features",
        },
        {
          key: "system_updates",
          label: "System Updates",
          description: "Get notified about system maintenance",
          path: "notifications.push.system_updates",
        },
      ],
    },
    {
      title: "Desktop Notifications",
      icon: MessageSquare,
      description: "Control browser notifications",
      settings: [
        {
          key: "login_alerts",
          label: "Login Alerts",
          description: "Get notified of new login attempts",
          path: "notifications.desktop.login_alerts",
        },
        {
          key: "security_events",
          label: "Security Events",
          description: "Important security-related notifications",
          path: "notifications.desktop.security_events",
        },
        {
          key: "account_activity",
          label: "Account Activity",
          description: "Updates about your account activity",
          path: "notifications.desktop.account_activity",
        },
      ],
    },
  ];

  const updateNestedValue = (path, value) => {
    const keys = path.split(".");
    const newData = { ...data };
    let current = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setData(newData);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Notification Preferences</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage how you receive notifications and updates
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={updatePreferences} className="space-y-8">
          {/* Notification Categories */}
          {notificationCategories.map((category, index) => (
            <div key={category.title} className="space-y-4">
              <div className="flex items-center gap-2">
                <category.icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {category.settings.map((setting) => (
                  <div
                    key={setting.key}
                    className="flex items-start justify-between space-x-4 rounded-lg border p-4"
                  >
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">
                        {setting.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {setting.description}
                      </p>
                    </div>
                    <Switch
                      checked={
                        data.notifications[
                          category.title.split(" ")[0].toLowerCase()
                        ][setting.key]
                      }
                      onCheckedChange={(checked) =>
                        updateNestedValue(setting.path, checked)
                      }
                    />
                  </div>
                ))}
              </div>

              {index < notificationCategories.length - 1 && (
                <Separator className="my-6" />
              )}
            </div>
          ))}

          {/* Communication Preferences */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Quiet Hours</h3>
                <p className="text-sm text-muted-foreground">
                  Set times when you don't want to receive notifications
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium">
                  Enable Quiet Hours
                </Label>
                <p className="text-sm text-muted-foreground">
                  Pause notifications during specific hours
                </p>
              </div>
              <Switch
                checked={data.communication_preferences.quiet_hours.enabled}
                onCheckedChange={(checked) =>
                  setData({
                    ...data,
                    communication_preferences: {
                      ...data.communication_preferences,
                      quiet_hours: {
                        ...data.communication_preferences.quiet_hours,
                        enabled: checked,
                      },
                    },
                  })
                }
              />
            </div>

            {data.communication_preferences.quiet_hours.enabled && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="start_time">Start Time</Label>
                  <input
                    type="time"
                    id="start_time"
                    value={data.communication_preferences.quiet_hours.start}
                    onChange={(e) =>
                      setData({
                        ...data,
                        communication_preferences: {
                          ...data.communication_preferences,
                          quiet_hours: {
                            ...data.communication_preferences.quiet_hours,
                            start: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_time">End Time</Label>
                  <input
                    type="time"
                    id="end_time"
                    value={data.communication_preferences.quiet_hours.end}
                    onChange={(e) =>
                      setData({
                        ...data,
                        communication_preferences: {
                          ...data.communication_preferences,
                          quiet_hours: {
                            ...data.communication_preferences.quiet_hours,
                            end: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={processing}>
              {processing ? (
                "Saving..."
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save Preferences
                </>
              )}
            </Button>

            {recentlySuccessful && (
              <p className="text-sm text-muted-foreground">
                Preferences saved successfully.
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
