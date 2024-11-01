import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Monitor,
  Bell,
  Palette,
  Wrench,
  User,
  Building2,
  Mail,
  CreditCard,
  Lock,
  Languages,
  Upload,
  Search,
  Chrome,
  Share2,
  Webhook,
  Database,
  RefreshCw,
  FileText,
  Settings as SettingsIcon,
  DollarSign,
  Truck,
  BarChart,
  Globe,
  Cloud,
  Users,
  ShieldCheck,
  Smartphone,
  Boxes,
  Gauge,
  MessageSquare,
  Save,
  Menu,
  ChevronRight,
  X,
} from "lucide-react";
import SidebarNav from "./Components/SidebarNav";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Card, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Head } from "@inertiajs/react";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Input } from "@/Components/ui/input";
import { usePage } from "@inertiajs/react";

const Index = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSettings, setRecentSettings] = useState([]);
  const { url } = usePage();

  // Filter settings based on search
  const filteredItems = useMemo(() => {
    if (!searchQuery) return sidebarNavItems;

    return sidebarNavItems
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [searchQuery, sidebarNavItems]);

  // Track recently visited settings
  const handleSettingVisit = useCallback((item) => {
    setRecentSettings((prev) => {
      const newRecent = [
        item,
        ...prev.filter((i) => i.href !== item.href),
      ].slice(0, 5);
      localStorage.setItem("recentSettings", JSON.stringify(newRecent));
      return newRecent;
    });
  }, []);

  // Load recent settings on mount
  useEffect(() => {
    const saved = localStorage.getItem("recentSettings");
    if (saved) {
      setRecentSettings(JSON.parse(saved));
    }
  }, []);

  return (
    <AdminLayout>
      <Head title="Settings" />

      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Card className="mb-4 border-none shadow-sm bg-gradient-to-r from-primary/10 via-primary/5 to-background">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    Settings
                  </CardTitle>
                  {/* Show current section */}
                  {getCurrentSection(url) && (
                    <>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      <span className="text-lg font-medium text-muted-foreground">
                        {getCurrentSection(url)}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Manage your application settings and preferences
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 text-destructive hover:bg-destructive/10 border-destructive/20"
                >
                  <RefreshCw className="h-4 w-4 mr-1.5" />
                  Reset All
                </Button>
                <Button size="sm" className="h-9 shadow-sm">
                  <Save className="h-4 w-4 mr-1.5" />
                  Save Changes
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Search and Mobile Toggle */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Sidebar */}
          <aside
            className={cn(
              "lg:w-80 transition-all duration-300",
              "fixed inset-y-0 left-0 z-50 lg:relative lg:z-0",
              "bg-background lg:bg-transparent",
              "lg:translate-x-0",
              sidebarOpen ? "translate-x-0" : "-translate-x-full",
              "lg:block"
            )}
          >
            <div className="sticky top-6 h-[calc(100vh-8rem)] overflow-hidden">
              <ScrollArea className="h-full pr-4">
                <SidebarNav
                  items={filteredItems}
                  currentUrl={url}
                  onItemClick={(item) => {
                    setSidebarOpen(false);
                    handleSettingVisit(item);
                  }}
                />
              </ScrollArea>
            </div>
          </aside>

          {/* Backdrop */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 lg:hidden z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="space-y-4">{children}</div>
          </main>
        </div>
      </div>
    </AdminLayout>
  );
};

// Helper function to get current section name
const getCurrentSection = (url) => {
  const section = url.split("/").pop();
  return section
    ? section
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";
};

export default Index;

// Enhanced sidebar navigation items with better organization
const sidebarNavItems = [
  {
    title: "General",
    badge: "Core",
    items: [
      {
        title: "Store Information",
        icon: <Building2 size={18} />,
        href: route("admin.settings.store"),
        description: "Basic store details and information",
        status: { label: "Required", variant: "default" },
        tooltip: "Configure your store's basic information and contact details",
      },
      {
        title: "Profile",
        icon: <User size={18} />,
        href: route("admin.settings.profile"),
        description: "Your account settings and preferences",
        status: { label: "Active", variant: "success" },
      },
      {
        title: "Email Settings",
        icon: <Mail size={18} />,
        href: route("admin.settings.email"),
        description: "Email configuration and templates",
        status: { label: "Setup Required", variant: "warning" },
      },
    ],
  },
  {
    title: "Appearance",
    badge: "UI",
    items: [
      {
        title: "Theme",
        icon: <Palette size={18} />,
        href: route("admin.settings.theme"),
        description: "Customize your store's appearance",
        status: { label: "Pro", variant: "default" },
        tooltip: "Advanced theme customization options (Pro feature)",
      },
      {
        title: "Display",
        icon: <Monitor size={18} />,
        href: route("admin.settings.display"),
        description: "Layout and display preferences",
        status: { label: "Pro", variant: "default" },
        tooltip: "Advanced display customization options (Pro feature)",
      },
    ],
  },
  {
    title: "Commerce",
    badge: "E-commerce",
    items: [
      {
        title: "Payment Methods",
        icon: <CreditCard size={18} />,
        href: route("admin.settings.payments"),
        description: "Configure payment gateways",
        status: { label: "Pro", variant: "default" },
        tooltip: "Advanced payment methods customization options (Pro feature)",
      },
      {
        title: "Shipping",
        icon: <Truck size={18} />,
        href: route("admin.settings.shipping"),
        description: "Shipping zones and methods",
        status: { label: "Pro", variant: "default" },
        tooltip: "Advanced shipping customization options (Pro feature)",
      },
      {
        title: "Taxes",
        icon: <BarChart size={18} />,
        href: route("admin.settings.taxes"),
        description: "Tax rates and configurations",
        status: { label: "Pro", variant: "default" },
        tooltip: "Advanced tax customization options (Pro feature)",
      },
    ],
  },
  {
    title: "System",
    badge: "Security",
    items: [
      {
        title: "Security",
        icon: <Lock size={18} />,
        href: route("admin.settings.security"),
        description: "Security settings and authentication",
        status: { label: "Pro", variant: "default" },
        tooltip: "Advanced security customization options (Pro feature)",
      },
      {
        title: "Localization",
        icon: <Languages size={18} />,
        href: route("admin.settings.localization"),
        description: "Language and regional settings",
        status: { label: "Pro", variant: "default" },
        tooltip: "Advanced localization customization options (Pro feature)",
      },
      {
        title: "Media Storage",
        icon: <Upload size={18} />,
        href: route("admin.settings.media"),
        description: "File storage and upload settings",
        status: { label: "Pro", variant: "default" },
        tooltip: "Advanced media storage customization options (Pro feature)",
      },
    ],
  },
  {
    title: "Integrations",
    badge: "Marketing",
    items: [
      {
        title: "SEO",
        icon: <Search size={18} />,
        href: route("admin.settings.seo"),
        description: "Search engine optimization settings",
        status: { label: "Pro", variant: "default" },
        tooltip: "Advanced SEO customization options (Pro feature)",
      },
      {
        title: "Google Services",
        icon: <Chrome size={18} />,
        href: route("admin.settings.google"),
        description: "Google Analytics and services",
        status: { label: "Pro", variant: "default" },
        tooltip: "Advanced Google services customization options (Pro feature)",
      },
      {
        title: "Social Media",
        icon: <Share2 size={18} />,
        href: route("admin.settings.social"),
        description: "Social media connections",
        status: { label: "Pro", variant: "default" },
        tooltip:
          "Advanced social media connections customization options (Pro feature)",
      },
      {
        title: "API Keys",
        icon: <Webhook size={18} />,
        href: route("admin.settings.api"),
        description: "API configuration and keys",
        status: { label: "Pro", variant: "default" },
        tooltip: "Advanced API customization options (Pro feature)",
      },
    ],
  },
  {
    title: "Advanced",
    badge: "Developer",
    items: [
      {
        title: "Cache",
        icon: <RefreshCw size={18} />,
        href: route("admin.settings.cache"),
        description: "Cache management",
        status: { label: "Pro", variant: "default" },
        tooltip:
          "Advanced cache management customization options (Pro feature)",
      },
      {
        title: "Logs",
        icon: <FileText size={18} />,
        href: route("admin.settings.logs"),
        description: "System logs and debugging",
        status: { label: "Pro", variant: "default" },
        tooltip: "Advanced logs management customization options (Pro feature)",
      },
      {
        title: "Notifications",
        icon: <Bell size={18} />,
        href: route("admin.settings.notifications"),
        description: "Notification preferences",
        status: { label: "Pro", variant: "default" },
        tooltip:
          "Advanced notification preferences customization options (Pro feature)",
      },
    ],
  },
];
