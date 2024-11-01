import React from "react";
import { Head, useForm } from "@inertiajs/react";
import SettingsLayout from "../Index";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Switch } from "@/Components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Settings, FileText, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EmailSettings() {
  const { data, setData, post, processing, errors } = useForm({
    mail_driver: "smtp",
    mail_host: "",
    mail_port: "",
    mail_username: "",
    mail_password: "",
    mail_encryption: "tls",
    mail_from_address: "",
    mail_from_name: "",
    notification_templates: {
      order_confirmation: {
        subject: "",
        content: "",
        enabled: true,
      },
      shipping_update: {
        subject: "",
        content: "",
        enabled: true,
      },
      password_reset: {
        subject: "",
        content: "",
        enabled: true,
      },
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("admin.settings.email.update"));
  };

  return (
    <SettingsLayout>
      <Head title="Email Settings" />

      <div className="space-y-6">
        <Tabs defaultValue="configuration" className="space-y-6">
          <div className="bg-muted/50 p-1 rounded-lg">
            <TabsList className="w-full flex justify-start gap-1 bg-transparent">
              {[
                {
                  value: "configuration",
                  label: "Configuration",
                  icon: Settings,
                  description: "Server settings and credentials",
                },
                {
                  value: "templates",
                  label: "Email Templates",
                  icon: FileText,
                  description: "Customize email templates",
                },
                {
                  value: "notifications",
                  label: "Notifications",
                  icon: Bell,
                  description: "Email notification settings",
                },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "flex-1 relative px-4 py-3",
                    "data-[state=active]:bg-background",
                    "data-[state=active]:text-foreground",
                    "data-[state=active]:shadow-sm",
                    "rounded-md transition-all duration-200",
                    "hover:bg-background/60",
                    "border border-transparent",
                    "data-[state=active]:border-border/50"
                  )}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2">
                      <tab.icon className="h-4 w-4" />
                      <span className="font-medium">{tab.label}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground hidden sm:block">
                      {tab.description}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 right-0 h-0.5 rounded-full",
                      "transition-all duration-200",
                      "data-[state=active]:bg-primary",
                      "data-[state=active]:opacity-100",
                      "opacity-0"
                    )}
                  />
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent
            value="configuration"
            className={cn(
              "mt-6 rounded-lg border shadow-sm",
              "transition-all duration-300",
              "data-[state=active]:animate-in",
              "data-[state=inactive]:animate-out",
              "data-[state=inactive]:fade-out-0",
              "data-[state=active]:fade-in-0",
              "data-[state=inactive]:zoom-out-95",
              "data-[state=active]:zoom-in-95"
            )}
          >
            <Card className="border-0 shadow-none">
              <CardHeader className="px-6 py-4 border-b">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Email Configuration</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Configure your email server settings and credentials
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Mail Driver</Label>
                      <Select
                        value={data.mail_driver}
                        onValueChange={(value) => setData("mail_driver", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select mail driver" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="smtp">SMTP</SelectItem>
                          <SelectItem value="mailgun">Mailgun</SelectItem>
                          <SelectItem value="ses">Amazon SES</SelectItem>
                          <SelectItem value="postmark">Postmark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Mail Host</Label>
                      <Input
                        value={data.mail_host}
                        onChange={(e) => setData("mail_host", e.target.value)}
                        placeholder="smtp.example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Mail Port</Label>
                      <Input
                        value={data.mail_port}
                        onChange={(e) => setData("mail_port", e.target.value)}
                        placeholder="587"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Mail Username</Label>
                      <Input
                        value={data.mail_username}
                        onChange={(e) =>
                          setData("mail_username", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Mail Password</Label>
                      <Input
                        type="password"
                        value={data.mail_password}
                        onChange={(e) =>
                          setData("mail_password", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Encryption</Label>
                      <Select
                        value={data.mail_encryption}
                        onValueChange={(value) =>
                          setData("mail_encryption", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select encryption" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tls">TLS</SelectItem>
                          <SelectItem value="ssl">SSL</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>From Address</Label>
                      <Input
                        value={data.mail_from_address}
                        onChange={(e) =>
                          setData("mail_from_address", e.target.value)
                        }
                        placeholder="noreply@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>From Name</Label>
                      <Input
                        value={data.mail_from_name}
                        onChange={(e) =>
                          setData("mail_from_name", e.target.value)
                        }
                        placeholder="Your Company Name"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={processing}>
                      {processing ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="templates"
            className={cn(
              "mt-6 rounded-lg border shadow-sm",
              "transition-all duration-300",
              "data-[state=active]:animate-in",
              "data-[state=inactive]:animate-out",
              "data-[state=inactive]:fade-out-0",
              "data-[state=active]:fade-in-0",
              "data-[state=inactive]:zoom-out-95",
              "data-[state=active]:zoom-in-95"
            )}
          >
            <Card className="border-0 shadow-none">
              <CardHeader className="px-6 py-4 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Email Templates</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground mt-1.5">
                  Customize your email templates and notification messages
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  {Object.entries(data.notification_templates).map(
                    ([key, template]) => (
                      <div
                        key={key}
                        className={cn(
                          "space-y-4 pb-8",
                          "border-b border-border/40 last:border-0 last:pb-0"
                        )}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h3 className="text-lg font-medium capitalize">
                              {key.replace(/_/g, " ")}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Configure the{" "}
                              {key.replace(/_/g, " ").toLowerCase()} email
                              template
                            </p>
                          </div>
                          <Switch
                            checked={template.enabled}
                            onCheckedChange={(checked) =>
                              setData("notification_templates", {
                                ...data.notification_templates,
                                [key]: { ...template, enabled: checked },
                              })
                            }
                          />
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Subject</Label>
                            <Input
                              value={template.subject}
                              onChange={(e) =>
                                setData("notification_templates", {
                                  ...data.notification_templates,
                                  [key]: {
                                    ...template,
                                    subject: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2 sm:col-span-2">
                            <Label>Content</Label>
                            <Textarea
                              value={template.content}
                              onChange={(e) =>
                                setData("notification_templates", {
                                  ...data.notification_templates,
                                  [key]: {
                                    ...template,
                                    content: e.target.value,
                                  },
                                })
                              }
                              className="min-h-[200px]"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="notifications"
            className={cn(
              "mt-6 rounded-lg border shadow-sm",
              "transition-all duration-300",
              "data-[state=active]:animate-in",
              "data-[state=inactive]:animate-out",
              "data-[state=inactive]:fade-out-0",
              "data-[state=active]:fade-in-0",
              "data-[state=inactive]:zoom-out-95",
              "data-[state=active]:zoom-in-95"
            )}
          >
            <Card className="border-0 shadow-none">
              <CardHeader className="px-6 py-4 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Notifications</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground mt-1.5">
                  Configure email notification settings
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  {Object.entries(data.notification_templates).map(
                    ([key, template]) => (
                      <div
                        key={key}
                        className={cn(
                          "space-y-4 pb-8",
                          "border-b border-border/40 last:border-0 last:pb-0"
                        )}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h3 className="text-lg font-medium capitalize">
                              {key.replace(/_/g, " ")}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Configure the{" "}
                              {key.replace(/_/g, " ").toLowerCase()} email
                              template
                            </p>
                          </div>
                          <Switch
                            checked={template.enabled}
                            onCheckedChange={(checked) =>
                              setData("notification_templates", {
                                ...data.notification_templates,
                                [key]: { ...template, enabled: checked },
                              })
                            }
                          />
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Subject</Label>
                            <Input
                              value={template.subject}
                              onChange={(e) =>
                                setData("notification_templates", {
                                  ...data.notification_templates,
                                  [key]: {
                                    ...template,
                                    subject: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2 sm:col-span-2">
                            <Label>Content</Label>
                            <Textarea
                              value={template.content}
                              onChange={(e) =>
                                setData("notification_templates", {
                                  ...data.notification_templates,
                                  [key]: {
                                    ...template,
                                    content: e.target.value,
                                  },
                                })
                              }
                              className="min-h-[200px]"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SettingsLayout>
  );
}
