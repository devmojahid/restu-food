import React, { useState, useCallback } from "react";
import { Head, useForm } from "@inertiajs/react";
import SettingsLayout from "../Index";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Switch } from "@/Components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/Components/ui/tabs";
import {
  Loader2,
  Save,
  Settings,
  Github,
  Facebook,
  Mail,
  Linkedin,
  Globe,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/Components/ui/use-toast";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { cn } from "@/lib/utils";

const GoogleIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className={cn("h-5 w-5", className)}
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

const AuthSettings = ({ authOptions = {}, defaults = {} }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("social");

  const { data, setData, post, processing, errors } = useForm({
    options: [
      // Social Login Settings
      {
        key: 'social_login_enabled',
        value: authOptions?.social_login_enabled ?? defaults?.social_login_enabled ?? false
      },
      {
        key: 'google_login_enabled',
        value: authOptions?.google_login_enabled ?? defaults?.google_login_enabled ?? false
      },
      {
        key: 'google_client_id',
        value: authOptions?.google_client_id ?? defaults?.google_client_id ?? ''
      },
      {
        key: 'google_client_secret',
        value: authOptions?.google_client_secret ?? defaults?.google_client_secret ?? ''
      },
      {
        key: 'facebook_login_enabled',
        value: authOptions?.facebook_login_enabled ?? defaults?.facebook_login_enabled ?? false
      },
      {
        key: 'facebook_client_id',
        value: authOptions?.facebook_client_id ?? defaults?.facebook_client_id ?? ''
      },
      {
        key: 'facebook_client_secret',
        value: authOptions?.facebook_client_secret ?? defaults?.facebook_client_secret ?? ''
      },
      {
        key: 'github_login_enabled',
        value: authOptions?.github_login_enabled ?? defaults?.github_login_enabled ?? false
      },
      {
        key: 'github_client_id',
        value: authOptions?.github_client_id ?? defaults?.github_client_id ?? ''
      },
      {
        key: 'github_client_secret',
        value: authOptions?.github_client_secret ?? defaults?.github_client_secret ?? ''
      },
      {
        key: 'linkedin_login_enabled',
        value: authOptions?.linkedin_login_enabled ?? defaults?.linkedin_login_enabled ?? false
      },
      {
        key: 'linkedin_client_id',
        value: authOptions?.linkedin_client_id ?? defaults?.linkedin_client_id ?? ''
      },
      {
        key: 'linkedin_client_secret',
        value: authOptions?.linkedin_client_secret ?? defaults?.linkedin_client_secret ?? ''
      },
      // reCAPTCHA Settings
      {
        key: 'captcha_enabled',
        value: authOptions?.captcha_enabled ?? defaults?.captcha_enabled ?? false
      },
      {
        key: 'captcha_type',
        value: authOptions?.captcha_type ?? defaults?.captcha_type ?? 'v2_invisible'
      },
      {
        key: 'recaptcha_site_key',
        value: authOptions?.recaptcha_site_key ?? defaults?.recaptcha_site_key ?? ''
      },
      {
        key: 'recaptcha_secret_key',
        value: authOptions?.recaptcha_secret_key ?? defaults?.recaptcha_secret_key ?? ''
      },
      // Add email verification option
      {
        key: 'email_verification_enabled',
        value: authOptions?.email_verification_enabled ?? defaults?.email_verification_enabled ?? true
      },
    ],
    group: 'auth'
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    post(route('options.store'), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Authentication settings saved successfully",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to save settings",
          variant: "destructive",
        });
      }
    });
  };

  const actionButtons = (
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
  );

  return (
    <SettingsLayout actions={actionButtons}>
      <Head title="Authentication Settings" />
      <div className="space-y-6">
        <Card>
          <CardHeader className="border-b p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Authentication Settings</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                  Configure social login and security settings
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="social" className="mt-6" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="social">Social Login</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="social" className="space-y-6">
                {/* Global Social Login Switch */}
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable Social Login</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to sign in using social media accounts
                    </p>
                  </div>
                  <Switch
                    checked={getOptionValue('social_login_enabled')}
                    onCheckedChange={(checked) => updateOption('social_login_enabled', checked)}
                  />
                </div>

                {/* Google */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <GoogleIcon className="h-5 w-5" />
                      <Label className="text-base">Google Login</Label>
                    </div>
                    <Switch
                      checked={getOptionValue('google_login_enabled')}
                      onCheckedChange={(checked) => updateOption('google_login_enabled', checked)}
                      disabled={!getOptionValue('social_login_enabled')}
                    />
                  </div>
                  
                  <div className="grid gap-4 pl-7">
                    <div className="space-y-2">
                      <Label>Client ID</Label>
                      <Input
                        placeholder="Enter Google Client ID"
                        value={getOptionValue('google_client_id')}
                        onChange={(e) => updateOption('google_client_id', e.target.value)}
                        disabled={!getOptionValue('google_login_enabled') || !getOptionValue('social_login_enabled')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Client Secret</Label>
                      <Input
                        type="password"
                        placeholder="Enter Google Client Secret"
                        value={getOptionValue('google_client_secret')}
                        onChange={(e) => updateOption('google_client_secret', e.target.value)}
                        disabled={!getOptionValue('google_login_enabled') || !getOptionValue('social_login_enabled')}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Callback URL: {window.location.origin}/auth/google/callback
                    </p>
                  </div>
                </div>

                {/* Facebook */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Facebook className="h-5 w-5" />
                      <Label className="text-base">Facebook Login</Label>
                    </div>
                    <Switch
                      checked={getOptionValue('facebook_login_enabled')}
                      onCheckedChange={(checked) => updateOption('facebook_login_enabled', checked)}
                      disabled={!getOptionValue('social_login_enabled')}
                    />
                  </div>
                  
                  <div className="grid gap-4 pl-7">
                    <div className="space-y-2">
                      <Label>Client ID</Label>
                      <Input
                        placeholder="Enter Facebook Client ID"
                        value={getOptionValue('facebook_client_id')}
                        onChange={(e) => updateOption('facebook_client_id', e.target.value)}
                        disabled={!getOptionValue('facebook_login_enabled') || !getOptionValue('social_login_enabled')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Client Secret</Label>
                      <Input
                        type="password"
                        placeholder="Enter Facebook Client Secret"
                        value={getOptionValue('facebook_client_secret')}
                        onChange={(e) => updateOption('facebook_client_secret', e.target.value)}
                        disabled={!getOptionValue('facebook_login_enabled') || !getOptionValue('social_login_enabled')}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Callback URL: {window.location.origin}/auth/facebook/callback
                    </p>
                  </div>
                </div>

                {/* GitHub */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Github className="h-5 w-5" />
                      <Label className="text-base">GitHub Login</Label>
                    </div>
                    <Switch
                      checked={getOptionValue('github_login_enabled')}
                      onCheckedChange={(checked) => updateOption('github_login_enabled', checked)}
                      disabled={!getOptionValue('social_login_enabled')}
                    />
                  </div>
                  
                  <div className="grid gap-4 pl-7">
                    <div className="space-y-2">
                      <Label>Client ID</Label>
                      <Input
                        placeholder="Enter GitHub Client ID"
                        value={getOptionValue('github_client_id')}
                        onChange={(e) => updateOption('github_client_id', e.target.value)}
                        disabled={!getOptionValue('github_login_enabled') || !getOptionValue('social_login_enabled')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Client Secret</Label>
                      <Input
                        type="password"
                        placeholder="Enter GitHub Client Secret"
                        value={getOptionValue('github_client_secret')}
                        onChange={(e) => updateOption('github_client_secret', e.target.value)}
                        disabled={!getOptionValue('github_login_enabled') || !getOptionValue('social_login_enabled')}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Callback URL: {window.location.origin}/auth/github/callback
                    </p>
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Linkedin className="h-5 w-5" />
                      <Label className="text-base">LinkedIn Login</Label>
                    </div>
                    <Switch
                      checked={getOptionValue('linkedin_login_enabled')}
                      onCheckedChange={(checked) => updateOption('linkedin_login_enabled', checked)}
                      disabled={!getOptionValue('social_login_enabled')}
                    />
                  </div>
                  
                  <div className="grid gap-4 pl-7">
                    <div className="space-y-2">
                      <Label>Client ID</Label>
                      <Input
                        placeholder="Enter LinkedIn Client ID"
                        value={getOptionValue('linkedin_client_id')}
                        onChange={(e) => updateOption('linkedin_client_id', e.target.value)}
                        disabled={!getOptionValue('linkedin_login_enabled') || !getOptionValue('social_login_enabled')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Client Secret</Label>
                      <Input
                        type="password"
                        placeholder="Enter LinkedIn Client Secret"
                        value={getOptionValue('linkedin_client_secret')}
                        onChange={(e) => updateOption('linkedin_client_secret', e.target.value)}
                        disabled={!getOptionValue('linkedin_login_enabled') || !getOptionValue('social_login_enabled')}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Callback URL: {window.location.origin}/auth/linkedin/callback
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                {/* Email Verification Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Verification</Label>
                      <p className="text-sm text-muted-foreground">
                        Require users to verify their email address before accessing the system
                      </p>
                    </div>
                    <Switch
                      checked={getOptionValue('email_verification_enabled')}
                      onCheckedChange={(checked) => updateOption('email_verification_enabled', checked)}
                    />
                  </div>
                  
                  {getOptionValue('email_verification_enabled') && (
                    <div className="rounded-lg border p-3 bg-muted/50">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>
                          Users will receive a verification email after registration
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* reCAPTCHA Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">Enable reCAPTCHA</Label>
                      <p className="text-sm text-muted-foreground">
                        Protect your forms from spam and abuse
                      </p>
                    </div>
                    <Switch
                      checked={getOptionValue('captcha_enabled')}
                      onCheckedChange={(checked) => updateOption('captcha_enabled', checked)}
                    />
                  </div>

                  <div className="space-y-4 pl-7">
                    <div className="space-y-2">
                      <Label>reCAPTCHA Type</Label>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        value={getOptionValue('captcha_type')}
                        onChange={(e) => updateOption('captcha_type', e.target.value)}
                        disabled={!getOptionValue('captcha_enabled')}
                      >
                        <option value="v2_invisible">reCAPTCHA v2 (Invisible)</option>
                        <option value="v2_checkbox">reCAPTCHA v2 (Checkbox)</option>
                        <option value="v3">reCAPTCHA v3</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Site Key</Label>
                      <Input
                        placeholder="Enter reCAPTCHA Site Key"
                        value={getOptionValue('recaptcha_site_key')}
                        onChange={(e) => updateOption('recaptcha_site_key', e.target.value)}
                        disabled={!getOptionValue('captcha_enabled')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Secret Key</Label>
                      <Input
                        type="password"
                        placeholder="Enter reCAPTCHA Secret Key"
                        value={getOptionValue('recaptcha_secret_key')}
                        onChange={(e) => updateOption('recaptcha_secret_key', e.target.value)}
                        disabled={!getOptionValue('captcha_enabled')}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
};

export default AuthSettings; 