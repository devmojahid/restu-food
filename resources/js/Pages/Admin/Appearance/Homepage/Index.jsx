import React, { useState, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { PageEditorProvider } from "@/Components/Admin/PageBuilder/PageEditorContext";
import SectionNavigation from "@/Components/Admin/PageBuilder/SectionNavigation";
import SectionContent from "@/Components/Admin/PageBuilder/SectionContent";
import ClientFeedbackSection from "./Sections/ClientFeedbackSection";
import TopCategoriesSection from "./Sections/TopCategoriesSection";
import WhyChooseUsSection from "./Sections/WhyChooseUsSection";
import HeroSection from "./Sections/HeroSection";
import GlobalSettingsSection from "./Sections/GlobalSettingsSection";
import FeaturedRestaurantsSection from "./Sections/FeaturedRestaurantsSection";
import GuideModal from "./Partials/GuideModal";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { AlertCircle, CheckCircle2, RefreshCw, LayoutTemplate, Eye, Settings, Brush, Clock, HelpCircle } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";

const SECTIONS = [
  { id: 'hero', label: 'Hero Section', default: true },
  { id: 'featured_restaurants', label: 'Featured Restaurants' },
  { id: 'top_categories', label: 'Top Categories' },
  { id: 'why_choose_us', label: 'Why Choose Us' },
  { id: 'client_feedback', label: 'Client Feedback' },
  { id: 'global_settings', label: 'Global Settings' },
];

const HomepageEditor = ({ homepageOptions = {}, defaults = {}, dynamicData = {}, error }) => {
  const { flash } = usePage().props;
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Handle flash messages from backend
    if (flash?.success) {
      setNotification({
        type: 'success',
        message: flash.success
      });
    } else if (flash?.error) {
      setNotification({
        type: 'error',
        message: flash.error
      });
    } else if (error) {
      setNotification({
        type: 'error',
        message: error
      });
    }

    // Auto-dismiss notification after 5 seconds
    const timer = setTimeout(() => {
      setNotification(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [flash, error]);

  // Initialize form data with existing options or defaults
  const initialData = Object.keys(homepageOptions).length > 0 ? homepageOptions : defaults;
  const defaultSection = SECTIONS.find(section => section.default)?.id || 'hero';

  // Handle critical error state
  if (error && !Object.keys(homepageOptions).length) {
    return (
      <AdminLayout>
        <Head title="Homepage Editor - Error" />
        <div className="container mx-auto py-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-red-200">
            <div className="bg-red-50 p-4 border-b border-red-200">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <h2 className="text-lg font-medium text-red-800">Failed to load homepage settings</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6 bg-red-50 p-4 rounded-md text-sm text-red-700">
                {error}
              </div>

              <h3 className="font-medium mb-2">Possible solutions:</h3>
              <ul className="list-disc pl-5 mb-6 text-gray-700 space-y-1">
                <li>Check database schema for missing columns mentioned in the error</li>
                <li>Run database migrations if needed</li>
                <li>Clear application cache with <code className="bg-gray-100 px-2 py-1 rounded">php artisan cache:clear</code></li>
                <li>Check server logs for more detailed error information</li>
              </ul>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </Button>
                <Button
                  onClick={() => {
                    setIsLoading(true);
                    window.location.reload();
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh Page
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head title="Homepage Editor" />

      {/* Notification Alert */}
      {notification && (
        <div className="container mx-auto py-4">
          <Alert
            variant={notification.type === 'error' ? "destructive" : "default"}
            className={notification.type === 'success' ? "border-green-500 bg-green-50 text-green-800" : ""}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {notification.type === 'success' ? "Success" : "Error"}
            </AlertTitle>
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Database Integrity Warnings */}
      {usePage().props.warnings?.length > 0 && (
        <div className="container mx-auto py-4">
          <Alert variant="warning" className="border-amber-500 bg-amber-50 text-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-700" />
            <AlertTitle>Database Structure Warnings</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-2">The following database integrity issues were detected:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {usePage().props.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm">
                These issues may affect the functionality of the page builder.
                Some features might not work as expected.
              </p>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <PageEditorProvider
        initialData={initialData}
        saveUrl={route('app.appearance.homepage.update')}
        defaultActiveSection={defaultSection} // Pass the default section to the provider
      >
        <div className="container mx-auto py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Homepage Builder</h1>
            <div className="flex items-center gap-2">
              <GuideModal
                trigger={
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Help Guide
                  </Button>
                }
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('/', '_blank')}
                className="flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" /></svg>
                Preview Homepage
              </Button>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <LayoutTemplate className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Active Sections</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Object.entries(initialData).filter(([key, value]) => key.endsWith('_enabled') && value === true).length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Sections currently visible on homepage
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <Brush className="h-5 w-5 text-purple-500" />
                  <CardTitle className="text-base">Style</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: initialData.primary_color || '#22C55E' }}
                  />
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: initialData.secondary_color || '#0EA5E9' }}
                  />
                  <div className="text-sm font-medium">
                    {initialData.color_scheme?.charAt(0).toUpperCase() + initialData.color_scheme?.slice(1) || 'System'}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {initialData.font_heading || 'Inter'} / {initialData.font_body || 'Inter'} fonts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-amber-500" />
                  <CardTitle className="text-base">Layout</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {initialData.layout_width?.charAt(0).toUpperCase() + initialData.layout_width?.slice(1) || 'Contained'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {initialData.section_spacing?.charAt(0).toUpperCase() + initialData.section_spacing?.slice(1) || 'Medium'} spacing
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-base">Last Updated</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {new Date().toLocaleDateString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Click save to update changes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Hero Preview */}
          <div className="mb-8 overflow-hidden rounded-lg border hidden">
            <div className="bg-muted p-2 border-b flex justify-between items-center">
              <div className="text-sm font-medium flex items-center">
                <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                Hero Section Preview
              </div>
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => document.getElementById('section-hero')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Edit Hero
                </Button>
              </div>
            </div>
            <div className="bg-background">
              <div
                className="relative h-[160px] overflow-hidden"
                style={{
                  backgroundImage: initialData.hero_image ? `url(${initialData.hero_image})` : 'linear-gradient(to right, #22C55E, #0EA5E9)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-black/40 flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-xl">
                      <h3 className="text-lg text-white font-bold">{initialData.hero_title || 'Hero Title'}</h3>
                      <p className="text-xs text-white/80 mt-1 line-clamp-1">{initialData.hero_subtitle || 'Hero subtitle text goes here'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Main Content Area */}
            <div className="col-span-12 lg:col-span-8">
              {SECTIONS.map(section => (
                <SectionContent key={section.id} section={section}>
                  {section.id === 'hero' && (
                    <HeroSection />
                  )}
                  {section.id === 'featured_restaurants' && (
                    <FeaturedRestaurantsSection />
                  )}
                  {section.id === 'client_feedback' && (
                    <ClientFeedbackSection />
                  )}
                  {section.id === 'top_categories' && (
                    <TopCategoriesSection />
                  )}
                  {section.id === 'why_choose_us' && (
                    <WhyChooseUsSection />
                  )}
                  {section.id === 'global_settings' && (
                    <GlobalSettingsSection />
                  )}
                </SectionContent>
              ))}
            </div>

            {/* Right Sidebar */}
            <div className="col-span-12 lg:col-span-4">
              <SectionNavigation sections={SECTIONS} />

              {/* Dynamic data info panel - useful for developers */}
              {process.env.NODE_ENV === 'development' && Object.keys(dynamicData).length > 0 && (
                <Card className="mt-6">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2 text-sm text-slate-700">Available Dynamic Data</h3>
                    <div className="text-xs text-slate-500 space-y-1 max-h-48 overflow-y-auto pr-1">
                      {Object.keys(dynamicData).map(key => (
                        <div key={key} className="flex justify-between">
                          <span className="font-mono">{key}:</span>
                          <span>{Array.isArray(dynamicData[key]) ?
                            `${dynamicData[key].length} items` :
                            typeof dynamicData[key] === 'object' ?
                              'Object' : dynamicData[key]}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </PageEditorProvider>
    </AdminLayout>
  );
};

export default HomepageEditor;
