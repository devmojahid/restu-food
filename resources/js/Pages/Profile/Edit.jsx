import { Head } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
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
  Settings,
  Download,
  Menu,
} from "lucide-react";
import NotificationPreferences from "./Partials/NotificationPreferences";
import SecuritySettings from "./Partials/SecuritySettings";
import ActivityLog from "./Partials/ActivityLog";
import ConnectedDevices from "./Partials/ConnectedDevices";
import ApiTokens from "./Partials/ApiTokens";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Button } from "@/Components/ui/button";
import { ChevronUp } from "lucide-react";

export default function Edit({ mustVerifyEmail, status }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const tabs = [
    {
      value: "profile",
      label: "Profile Information",
      icon: User,
      description: "Update your account details",
      component: UpdateProfileInformationForm,
      props: { mustVerifyEmail, status },
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

  const handleTabChange = (value) => {
    setActiveTab(value);
    setShowMobileMenu(false);
  };

  return (
    <AdminLayout>
      <Head title="Profile Settings" />

      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 min-h-screen">
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
          <div
            className={cn(
              "lg:col-span-3 col-span-12",
              "lg:block",
              !showMobileMenu && !isMobile ? "block" : "hidden",
              showMobileMenu && isMobile ? "block" : "hidden"
            )}
          >
            <div className="sticky top-6 space-y-2 bg-background p-4 rounded-lg border">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                {tabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => handleTabChange(tab.value)}
                    className={cn(
                      "w-full flex items-center gap-2 p-2 rounded-lg text-sm",
                      "hover:bg-muted transition-colors",
                      "focus:outline-none focus:ring-2 focus:ring-primary/20",
                      activeTab === tab.value && "bg-muted",
                      tab.destructive &&
                        "text-destructive hover:bg-destructive/10"
                    )}
                  >
                    <tab.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </ScrollArea>
            </div>
          </div>

          {/* Main Content - Added min-height and overflow handling */}
          <div className="lg:col-span-9 col-span-12">
            <div className="relative min-h-[600px]">
              {" "}
              {/* Added wrapper with min-height */}
              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="space-y-6"
              >
                {/* Tab Contents - Modified animations */}
                {tabs.map((tab) => (
                  <TabsContent
                    key={tab.value}
                    value={tab.value}
                    className={cn(
                      "mt-0 rounded-lg border shadow-sm",
                      "absolute top-0 left-0 w-full",
                      "transition-all duration-300 ease-in-out",
                      "data-[state=inactive]:opacity-0 data-[state=active]:opacity-100",
                      "data-[state=inactive]:translate-x-2 data-[state=active]:translate-x-0",
                      "data-[state=inactive]:pointer-events-none data-[state=active]:pointer-events-auto",
                      tab.destructive && "border-destructive/50"
                    )}
                    style={{
                      transform: "translate3d(0, 0, 0)", // Force GPU acceleration
                    }}
                  >
                    <tab.component {...tab.props} />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Optional: Add a scroll to top button for better UX */}
      <ScrollToTop />
    </AdminLayout>
  );
}

// Add a scroll to top button component
function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "fixed bottom-8 right-8 z-50 rounded-full transition-all duration-300",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
      onClick={scrollToTop}
    >
      <ChevronUp className="h-4 w-4" />
    </Button>
  );
}
