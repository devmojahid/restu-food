import React, { useState, useCallback } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import SettingsLayout from "../Index";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  Mail,
  Loader2,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  Settings,
  Server,
  AtSign,
  ShieldCheck
} from "lucide-react";
import { useToast } from "@/Components/ui/use-toast";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";

const EmailSettings = ({ emailOptions = {}, defaults = {} }) => {
  const { toast } = useToast();
  const [isTesting, setIsTesting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [isTestEmailValid, setIsTestEmailValid] = useState(true);

  // Initialize form with saved values from database
  const { data, setData, post, processing, errors } = useForm({
    options: [
      {
        key: 'mail_driver',
        value: emailOptions?.mail_driver ?? defaults?.mail_driver ?? 'smtp'
      },
      {
        key: 'mail_host',
        value: emailOptions?.mail_host ?? defaults?.mail_host ?? ''
      },
      {
        key: 'mail_port',
        value: emailOptions?.mail_port ?? defaults?.mail_port ?? '587'
      },
      {
        key: 'mail_username',
        value: emailOptions?.mail_username ?? defaults?.mail_username ?? ''
      },
      {
        key: 'mail_password',
        value: emailOptions?.mail_password ?? defaults?.mail_password ?? ''
      },
      {
        key: 'mail_encryption',
        value: emailOptions?.mail_encryption ?? defaults?.mail_encryption ?? 'tls'
      },
      {
        key: 'mail_from_address',
        value: emailOptions?.mail_from_address ?? defaults?.mail_from_address ?? ''
      },
      {
        key: 'mail_from_name',
        value: emailOptions?.mail_from_name ?? defaults?.mail_from_name ?? ''
      }
    ],
    group: 'email'
  });

  const updateOption = useCallback((key, value) => {
    setData('options', data.options.map(option =>
      option.key === key ? { ...option, value } : option
    ));
  }, [data.options, setData]);

  const getOptionValue = useCallback((key) => {
    const option = data.options.find(opt => opt.key === key);
    return option?.value ?? '';
  }, [data.options]);

  const validateTestEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const handleTestEmailChange = useCallback((e) => {
    const email = e.target.value;
    setTestEmailAddress(email);
    setIsTestEmailValid(validateTestEmail(email));
  }, [validateTestEmail]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = ['mail_driver', 'mail_host', 'mail_port', 'mail_from_address'];
    const missingFields = requiredFields.filter(field => !getOptionValue(field));

    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    post(route('app.options.store'), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Email settings saved successfully",
        });
      },
      onError: (errors) => {
        toast({
          title: "Error",
          description: "Failed to save settings. Please check the form for errors.",
          variant: "destructive",
        });
      }
    });
  };

  const handleTestEmail = () => {
    if (!testEmailAddress || !isTestEmailValid) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    post(route('options.test-email'), {
      data: { test_email: testEmailAddress },
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Test email sent successfully",
        });
        setTestEmailAddress("");
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to send test email. Please check your settings.",
          variant: "destructive",
        });
      },
      onFinish: () => setIsTesting(false)
    });
  };

  const actionButtons = (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={handleTestEmail}
        disabled={isTesting || processing}
        className="w-full sm:w-auto"
      >
        {isTesting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            <span>Testing Email...</span>
          </>
        ) : (
          <>
            <Mail className="w-4 h-4 mr-2" />
            <span>Send Test Email</span>
          </>
        )}
      </Button>
      <Button
        type="submit"
        disabled={processing}
        onClick={handleSubmit}
        className="w-full sm:w-auto"
      >
        {processing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            <span>Saving Changes...</span>
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            <span>Save Changes</span>
          </>
        )}
      </Button>
    </>
  );

  return (
    <SettingsLayout actions={actionButtons}>
      <Head title="Email Settings" />
      <div className="space-y-6">
        <Card>
          <CardHeader className="border-b p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Email Settings</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                  Configure your email server settings and preferences
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="mt-3">
              {/* Show error alert if there are any form errors */}
              {Object.keys(errors).length > 0 && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please correct the errors below.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mail Driver - Full Width */}
                    <div className="md:col-span-2 space-y-2">
                      <Label required>Mail Driver</Label>
                      <Select
                        value={getOptionValue('mail_driver')}
                        onValueChange={(value) => updateOption('mail_driver', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select mail driver" className="text-gray-400" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="smtp">SMTP</SelectItem>
                          <SelectItem value="mailgun">Mailgun</SelectItem>
                          <SelectItem value="ses">Amazon SES</SelectItem>
                          <SelectItem value="postmark">Postmark</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors?.mail_driver && (
                        <p className="text-sm text-destructive mt-1">{errors.mail_driver}</p>
                      )}
                    </div>

                    {/* Server Settings */}
                    <div className="space-y-2">
                      <Label required>SMTP Host</Label>
                      <Input
                        placeholder="smtp.example.com"
                        value={getOptionValue('mail_host')}
                        onChange={(e) => updateOption('mail_host', e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Your mail server hostname
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label required>SMTP Port</Label>
                      <Input
                        type="number"
                        placeholder="587"
                        value={getOptionValue('mail_port')}
                        onChange={(e) => updateOption('mail_port', e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Common ports: 25, 465, 587, 2525
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>SMTP Username</Label>
                      <Input
                        placeholder="username@example.com"
                        value={getOptionValue('mail_username')}
                        onChange={(e) => updateOption('mail_username', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>SMTP Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={getOptionValue('mail_password')}
                          onChange={(e) => updateOption('mail_password', e.target.value)}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Encryption</Label>
                      <Select
                        value={getOptionValue('mail_encryption')}
                        onValueChange={(value) => updateOption('mail_encryption', value)}
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
                      <Label required>From Address</Label>
                      <Input
                        type="email"
                        placeholder="noreply@example.com"
                        value={getOptionValue('mail_from_address')}
                        onChange={(e) => updateOption('mail_from_address', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>From Name</Label>
                      <Input
                        placeholder="Your Company Name"
                        value={getOptionValue('mail_from_name')}
                        onChange={(e) => updateOption('mail_from_name', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <h4 className="font-medium">Test Your Email Configuration</h4>
                      <p className="text-sm text-muted-foreground">
                        Send a test email to verify your settings are working correctly.
                        Make sure to save any changes before testing.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 sm:max-w-md space-y-2">
                        <Label>Test Email Address</Label>
                        <Input
                          type="email"
                          placeholder="Enter test email address"
                          value={testEmailAddress}
                          onChange={handleTestEmailChange}
                          className={cn(
                            "w-full",
                            !isTestEmailValid && testEmailAddress && "border-destructive"
                          )}
                        />
                        {!isTestEmailValid && testEmailAddress && (
                          <p className="text-sm text-destructive">
                            Please enter a valid email address
                          </p>
                        )}
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleTestEmail}
                          disabled={isTesting || !testEmailAddress || !isTestEmailValid}
                          className="w-full sm:w-auto"
                        >
                          {isTesting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Testing...
                            </>
                          ) : (
                            <>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Test
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
};

export default EmailSettings;
