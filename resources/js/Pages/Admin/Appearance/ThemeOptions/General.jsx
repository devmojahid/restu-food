import React, { useState, useCallback } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/Components/ui/tabs";
import {
  Loader2,
  Save,
  Upload,
  AlertCircle,
  Settings,
  Layout,
  Image as ImageIcon,
  Type,
  Palette,
  SquareCode,
  PencilRuler,
  Globe,
  Share2,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Clock,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "@/Components/ui/use-toast";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { cn } from "@/lib/utils";
import { Switch } from "@/Components/ui/switch";
import { Separator } from "@/Components/ui/separator";
import { Link } from "@inertiajs/react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";

const ThemeOptions = ({ themeOptions = {}, defaults = {} }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [isUploading, setIsUploading] = useState(false);

  // Initialize form with saved values from database
  const { data, setData, post, processing, errors } = useForm({
    options: [
      // Site Identity
      {
        key: 'site_logo',
        value: themeOptions?.site_logo ?? defaults?.site_logo ?? ''
      },
      {
        key: 'site_favicon',
        value: themeOptions?.site_favicon ?? defaults?.site_favicon ?? ''
      },
      {
        key: 'site_title',
        value: themeOptions?.site_title ?? defaults?.site_title ?? ''
      },
      {
        key: 'site_tagline',
        value: themeOptions?.site_tagline ?? defaults?.site_tagline ?? ''
      },
      // Header Settings
      {
        key: 'header_style',
        value: themeOptions?.header_style ?? defaults?.header_style ?? 'default'
      },
      {
        key: 'sticky_header',
        value: themeOptions?.sticky_header ?? defaults?.sticky_header ?? true
      },
      {
        key: 'show_search',
        value: themeOptions?.show_search ?? defaults?.show_search ?? true
      },
      {
        key: 'show_cart',
        value: themeOptions?.show_cart ?? defaults?.show_cart ?? true
      },
      // Footer Settings
      {
        key: 'footer_style',
        value: themeOptions?.footer_style ?? defaults?.footer_style ?? 'default'
      },
      {
        key: 'footer_logo',
        value: themeOptions?.footer_logo ?? defaults?.footer_logo ?? ''
      },
      {
        key: 'footer_text',
        value: themeOptions?.footer_text ?? defaults?.footer_text ?? ''
      },
      {
        key: 'copyright_text',
        value: themeOptions?.copyright_text ?? defaults?.copyright_text ?? ''
      },
      // Contact Information
      {
        key: 'contact_phone',
        value: themeOptions?.contact_phone ?? defaults?.contact_phone ?? ''
      },
      {
        key: 'contact_email',
        value: themeOptions?.contact_email ?? defaults?.contact_email ?? ''
      },
      {
        key: 'contact_address',
        value: themeOptions?.contact_address ?? defaults?.contact_address ?? ''
      },
      {
        key: 'business_hours',
        value: themeOptions?.business_hours ?? defaults?.business_hours ?? ''
      },
      // Social Media
      {
        key: 'social_facebook',
        value: themeOptions?.social_facebook ?? defaults?.social_facebook ?? ''
      },
      {
        key: 'social_twitter',
        value: themeOptions?.social_twitter ?? defaults?.social_twitter ?? ''
      },
      {
        key: 'social_instagram',
        value: themeOptions?.social_instagram ?? defaults?.social_instagram ?? ''
      },
      {
        key: 'social_linkedin',
        value: themeOptions?.social_linkedin ?? defaults?.social_linkedin ?? ''
      },
      {
        key: 'social_youtube',
        value: themeOptions?.social_youtube ?? defaults?.social_youtube ?? ''
      },
      // Colors & Typography
      {
        key: 'primary_color',
        value: themeOptions?.primary_color ?? defaults?.primary_color ?? '#3b82f6'
      },
      {
        key: 'secondary_color',
        value: themeOptions?.secondary_color ?? defaults?.secondary_color ?? '#10b981'
      },
      {
        key: 'heading_font',
        value: themeOptions?.heading_font ?? defaults?.heading_font ?? 'Inter'
      },
      {
        key: 'body_font',
        value: themeOptions?.body_font ?? defaults?.body_font ?? 'Inter'
      }
    ],
    group: 'theme'
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
    post(route('app.options.store'), {
      preserveScroll: true,
      onSuccess: () => {
        // Handle success if needed
      },
      onError: () => {
        // Handle error if needed
      }
    });
  };

  const handleFileUpload = useCallback(async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(route('app.files.upload'), {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        updateOption(key, data.url);
        toast({
          title: "Success",
          description: "File uploaded successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [updateOption]);

  const breadcrumbItems = [
    { label: "Dashboard", href: "dashboard" },
    { label: "Appearance", href: "dashboard" },
    { label: "Theme Options", href: "dashboard" },
  ];

  const actionButtons = (
    <div className="flex items-center gap-2">
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
    </div>
  );

  const SelectWrapper = ({ value, onValueChange, placeholder, children }) => (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        side="bottom"
        align="start"
        className="w-[var(--radix-select-trigger-width)] z-[60]"
      >
        {children}
      </SelectContent>
    </Select>
  );

  return (
    <AdminLayout>
      <Head title="Theme Options" />
      <div className="relative min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 pb-20">
          <div className="space-y-6">
            <Breadcrumb items={breadcrumbItems} />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight">Theme Options</h2>
                <p className="text-muted-foreground">
                  Customize your website's appearance and functionality
                </p>
              </div>
              {actionButtons}
            </div>

            <Card className="relative overflow-visible">
              <div className="flex flex-col md:flex-row">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 border-b md:border-b-0 md:border-r">
                  <nav className="p-4 space-y-2">
                    <button
                      onClick={() => setActiveTab("general")}
                      className={cn(
                        "flex items-center w-full px-4 py-2 text-sm rounded-lg",
                        activeTab === "general"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      General
                    </button>
                    <button
                      onClick={() => setActiveTab("header")}
                      className={cn(
                        "flex items-center w-full px-4 py-2 text-sm rounded-lg",
                        activeTab === "header"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <PencilRuler className="w-4 h-4 mr-2" />
                      Header
                    </button>
                    <button
                      onClick={() => setActiveTab("footer")}
                      className={cn(
                        "flex items-center w-full px-4 py-2 text-sm rounded-lg",
                        activeTab === "footer"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <SquareCode className="w-4 h-4 mr-2" />
                      Footer
                    </button>
                    <button
                      onClick={() => setActiveTab("typography")}
                      className={cn(
                        "flex items-center w-full px-4 py-2 text-sm rounded-lg",
                        activeTab === "typography"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <Type className="w-4 h-4 mr-2" />
                      Typography
                    </button>
                    <button
                      onClick={() => setActiveTab("social")}
                      className={cn(
                        "flex items-center w-full px-4 py-2 text-sm rounded-lg",
                        activeTab === "social"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Social
                    </button>
                  </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6">
                  <div className={cn("space-y-6", activeTab !== "general" && "hidden")}>
                    {/* Site Identity Section */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium">Site Identity</h3>
                        <p className="text-sm text-muted-foreground">
                          Manage your site's logo, favicon, and basic information
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Logo Upload */}
                        <div className="space-y-2">
                          <Label>Site Logo</Label>
                          <div className="flex items-center gap-4">
                            {getOptionValue('site_logo') && (
                              <img
                                src={getOptionValue('site_logo')}
                                alt="Site Logo"
                                className="h-12 w-auto"
                              />
                            )}
                            <div className="flex-1">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, 'site_logo')}
                                disabled={isUploading}
                                className="cursor-pointer"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Recommended size: 200x60px
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Favicon Upload */}
                        <div className="space-y-2">
                          <Label>Favicon</Label>
                          <div className="flex items-center gap-4">
                            {getOptionValue('site_favicon') && (
                              <img
                                src={getOptionValue('site_favicon')}
                                alt="Favicon"
                                className="h-8 w-auto"
                              />
                            )}
                            <div className="flex-1">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, 'site_favicon')}
                                disabled={isUploading}
                                className="cursor-pointer"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Recommended size: 32x32px
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Site Title */}
                        <div className="space-y-2">
                          <Label required>Site Title</Label>
                          <Input
                            value={getOptionValue('site_title')}
                            onChange={(e) => updateOption('site_title', e.target.value)}
                            placeholder="Enter site title"
                          />
                        </div>

                        {/* Tagline */}
                        <div className="space-y-2">
                          <Label>Tagline</Label>
                          <Input
                            value={getOptionValue('site_tagline')}
                            onChange={(e) => updateOption('site_tagline', e.target.value)}
                            placeholder="Enter site tagline"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Contact Information Section */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium">Contact Information</h3>
                        <p className="text-sm text-muted-foreground">
                          Set up your business contact details
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-9"
                              value={getOptionValue('contact_phone')}
                              onChange={(e) => updateOption('contact_phone', e.target.value)}
                              placeholder="+1 (555) 000-0000"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-9"
                              type="email"
                              value={getOptionValue('contact_email')}
                              onChange={(e) => updateOption('contact_email', e.target.value)}
                              placeholder="contact@example.com"
                            />
                          </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label>Address</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Textarea
                              className="pl-9 min-h-[80px] resize-none"
                              value={getOptionValue('contact_address')}
                              onChange={(e) => updateOption('contact_address', e.target.value)}
                              placeholder="Enter your business address"
                            />
                          </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label>Business Hours</Label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Textarea
                              className="pl-9 min-h-[80px] resize-none"
                              value={getOptionValue('business_hours')}
                              onChange={(e) => updateOption('business_hours', e.target.value)}
                              placeholder="Monday - Friday: 9:00 AM - 5:00 PM&#10;Saturday: 10:00 AM - 3:00 PM&#10;Sunday: Closed"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Settings */}
                  <div className={cn("space-y-6", activeTab !== "header" && "hidden")}>
                    <div>
                      <h3 className="text-lg font-medium">Header Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Customize your website's header appearance and functionality
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <Label>Header Style</Label>
                        <SelectWrapper
                          value={getOptionValue('header_style')}
                          onValueChange={(value) => updateOption('header_style', value)}
                          placeholder="Select header style"
                        >
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="centered">Centered</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="modern">Modern</SelectItem>
                        </SelectWrapper>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Sticky Header</Label>
                            <p className="text-sm text-muted-foreground">
                              Keep the header fixed at the top while scrolling
                            </p>
                          </div>
                          <Switch
                            checked={getOptionValue('sticky_header')}
                            onCheckedChange={(checked) => updateOption('sticky_header', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Show Search</Label>
                            <p className="text-sm text-muted-foreground">
                              Display search bar in header
                            </p>
                          </div>
                          <Switch
                            checked={getOptionValue('show_search')}
                            onCheckedChange={(checked) => updateOption('show_search', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Show Cart</Label>
                            <p className="text-sm text-muted-foreground">
                              Display shopping cart icon in header
                            </p>
                          </div>
                          <Switch
                            checked={getOptionValue('show_cart')}
                            onCheckedChange={(checked) => updateOption('show_cart', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Settings */}
                  <div className={cn("space-y-6", activeTab !== "footer" && "hidden")}>
                    <div>
                      <h3 className="text-lg font-medium">Footer Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Customize your website's footer appearance and content
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Footer Style</Label>
                        <Select
                          value={getOptionValue('footer_style')}
                          onValueChange={(value) => updateOption('footer_style', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select footer style" />
                          </SelectTrigger>
                          <SelectContent side="bottom" align="start" position="popper" className="w-[--radix-select-trigger-width] z-50">
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="simple">Simple</SelectItem>
                            <SelectItem value="modern">Modern</SelectItem>
                            <SelectItem value="minimal">Minimal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Footer Logo</Label>
                        <div className="flex items-center gap-4">
                          {getOptionValue('footer_logo') && (
                            <img
                              src={getOptionValue('footer_logo')}
                              alt="Footer Logo"
                              className="h-12 w-auto"
                            />
                          )}
                          <div className="flex-1">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'footer_logo')}
                              disabled={isUploading}
                              className="cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label>Footer Text</Label>
                        <Textarea
                          value={getOptionValue('footer_text')}
                          onChange={(e) => updateOption('footer_text', e.target.value)}
                          placeholder="Enter footer text or description"
                          className="min-h-[100px] resize-none"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label>Copyright Text</Label>
                        <Input
                          value={getOptionValue('copyright_text')}
                          onChange={(e) => updateOption('copyright_text', e.target.value)}
                          placeholder="© 2024 Your Company. All rights reserved."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Typography Settings */}
                  <div className={cn("space-y-6", activeTab !== "typography" && "hidden")}>
                    <div>
                      <h3 className="text-lg font-medium">Typography & Colors</h3>
                      <p className="text-sm text-muted-foreground">
                        Customize your website's fonts and color scheme
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Primary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={getOptionValue('primary_color')}
                            onChange={(e) => updateOption('primary_color', e.target.value)}
                            className="w-16 p-1 h-10"
                          />
                          <Input
                            type="text"
                            value={getOptionValue('primary_color')}
                            onChange={(e) => updateOption('primary_color', e.target.value)}
                            placeholder="#000000"
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Secondary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={getOptionValue('secondary_color')}
                            onChange={(e) => updateOption('secondary_color', e.target.value)}
                            className="w-16 p-1 h-10"
                          />
                          <Input
                            type="text"
                            value={getOptionValue('secondary_color')}
                            onChange={(e) => updateOption('secondary_color', e.target.value)}
                            placeholder="#000000"
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Heading Font</Label>
                        <Select
                          value={getOptionValue('heading_font')}
                          onValueChange={(value) => updateOption('heading_font', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select heading font" />
                          </SelectTrigger>
                          <SelectContent side="bottom" align="start" position="popper" className="w-[--radix-select-trigger-width] z-50">
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Roboto">Roboto</SelectItem>
                            <SelectItem value="Open Sans">Open Sans</SelectItem>
                            <SelectItem value="Poppins">Poppins</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Body Font</Label>
                        <Select
                          value={getOptionValue('body_font')}
                          onValueChange={(value) => updateOption('body_font', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select body font" />
                          </SelectTrigger>
                          <SelectContent side="bottom" align="start" position="popper" className="w-[--radix-select-trigger-width] z-50">
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Roboto">Roboto</SelectItem>
                            <SelectItem value="Open Sans">Open Sans</SelectItem>
                            <SelectItem value="Poppins">Poppins</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Social Media Settings */}
                  <div className={cn("space-y-6", activeTab !== "social" && "hidden")}>
                    <div>
                      <h3 className="text-lg font-medium">Social Media Links</h3>
                      <p className="text-sm text-muted-foreground">
                        Connect your social media accounts
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Facebook</Label>
                        <div className="relative">
                          <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            className="pl-9"
                            value={getOptionValue('social_facebook')}
                            onChange={(e) => updateOption('social_facebook', e.target.value)}
                            placeholder="https://facebook.com/yourpage"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Twitter</Label>
                        <div className="relative">
                          <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            className="pl-9"
                            value={getOptionValue('social_twitter')}
                            onChange={(e) => updateOption('social_twitter', e.target.value)}
                            placeholder="https://twitter.com/yourhandle"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Instagram</Label>
                        <div className="relative">
                          <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            className="pl-9"
                            value={getOptionValue('social_instagram')}
                            onChange={(e) => updateOption('social_instagram', e.target.value)}
                            placeholder="https://instagram.com/yourprofile"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>LinkedIn</Label>
                        <div className="relative">
                          <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            className="pl-9"
                            value={getOptionValue('social_linkedin')}
                            onChange={(e) => updateOption('social_linkedin', e.target.value)}
                            placeholder="https://linkedin.com/company/yourcompany"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>YouTube</Label>
                        <div className="relative">
                          <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            className="pl-9"
                            value={getOptionValue('social_youtube')}
                            onChange={(e) => updateOption('social_youtube', e.target.value)}
                            placeholder="https://youtube.com/yourchannel"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="fixed bottom-0 inset-x-0 z-50 border-t bg-background/80 backdrop-blur-sm md:left-64 dark:border-gray-800">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex justify-end">
              {actionButtons}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ThemeOptions;
