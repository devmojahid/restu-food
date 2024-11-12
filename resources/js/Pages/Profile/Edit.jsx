import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Tabs, TabsContent } from "@/Components/ui/tabs";
import { Card, CardHeader, CardTitle } from "@/Components/ui/card";
import { cn } from "@/lib/utils";
import {
  User,
  Lock,
  Trash2,
  Bell,
  Shield,
  History,
  Smartphone,
  Key,
  Menu,
  ChevronUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";

// Import all form components
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import NotificationPreferences from "./Partials/NotificationPreferences";
import SecuritySettings from "./Partials/SecuritySettings";
import ActivityLog from "./Partials/ActivityLog";
import ConnectedDevices from "./Partials/ConnectedDevices";
import ApiTokens from "./Partials/ApiTokens";

export default function Edit({ mustVerifyEmail, status, user_meta }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleTabChange = (value) => {
    setActiveTab(value);
    setShowMobileMenu(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabs = [
    {
      value: "profile",
      label: "Profile Information",
      icon: User,
      description: "Update your account details",
      component: UpdateProfileInformationForm,
      props: { mustVerifyEmail, status, user_meta },
    },
    {
      value: "security",
      label: "Password & Security",
      icon: Shield,
      description: "Manage your security settings",
      component: SecuritySettings,
    },
    {
      value: "notifications",
      label: "Notifications",
      icon: Bell,
      description: "Configure notification preferences",
      component: NotificationPreferences,
    },
    {
      value: "devices",
      label: "Connected Devices",
      icon: Smartphone,
      description: "Manage your connected devices",
      component: ConnectedDevices,
    },
    {
      value: "activity",
      label: "Activity Log",
      icon: History,
      description: "View your account activity",
      component: ActivityLog,
    },
    {
      value: "api",
      label: "API Tokens",
      icon: Key,
      description: "Manage API access tokens",
      component: ApiTokens,
    },
    {
      value: "danger",
      label: "Danger Zone",
      icon: Trash2,
      description: "Delete your account",
      component: DeleteUserForm,
      destructive: true,
    },
  ];

  return (
    <AdminLayout>
      <Head title="Profile Settings" />

      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <Card className="mb-6 border-none shadow-sm bg-gradient-to-r from-primary/10 via-primary/5 to-background">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
                  Profile Settings
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage your account settings and preferences
                </p>
              </div>
              {isMobile && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className={cn(
            "lg:col-span-3 col-span-12",
            "lg:block",
            !showMobileMenu && !isMobile ? "block" : "hidden",
            showMobileMenu && isMobile ? "block" : "hidden"
          )}>
            <Card className="border shadow-sm">
              <div className="p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => handleTabChange(tab.value)}
                    className={cn(
                      "w-full flex items-center gap-2 p-2 rounded-lg text-sm",
                      "hover:bg-muted transition-colors",
                      "focus:outline-none focus:ring-2 focus:ring-primary/20",
                      activeTab === tab.value && "bg-muted",
                      tab.destructive && "text-destructive hover:bg-destructive/10"
                    )}
                  >
                    <tab.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 col-span-12">
            <Tabs value={activeTab} className="space-y-6">
              {tabs.map((tab) => (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "mt-0 focus-visible:outline-none focus-visible:ring-0",
                    "data-[state=active]:animate-in data-[state=inactive]:animate-out",
                    "data-[state=inactive]:slide-out-to-left data-[state=active]:slide-in-from-right",
                    "duration-200 ease-in-out"
                  )}
                >
                  <tab.component {...tab.props} />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "fixed bottom-8 right-8 z-50 rounded-full transition-all duration-300",
          "bg-background/80 backdrop-blur-sm hover:bg-background",
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
        onClick={scrollToTop}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
    </AdminLayout>
  );
}
