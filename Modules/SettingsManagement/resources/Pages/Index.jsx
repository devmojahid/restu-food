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
  AlertTriangle,
  History,
  Download,
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

const Index = ({ children, actions, className, contentClassName }) => {
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

      <div className="container mx-auto py-2 sm:py-3 px-1 sm:px-2 lg:px-1">
        {/* Simplified header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
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
        </div>

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
        {/* Fixed Bottom Action Bar with Mobile Support */}
        {actions && (
          <div className="mt-8 max-xs:mt-28">
            <div className="fixed bottom-0 right-0 left-0 lg:left-[256px] bg-background/80 backdrop-blur-sm border-t z-50">
              <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4">
                <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3">
                  {actions}
                </div>
              </div>
            </div>
          </div>
        )}
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
        href: route("app.settings.store"),
        description: "Basic store details and information",
        status: { label: "Required", variant: "default" },
        tooltip: "Configure your store's basic information and contact details",
      },
      {
        title: "Email Settings",
        icon: <Mail size={18} />,
        href: route("app.settings.email"),
        description: "Email configuration and templates",
        status: { label: "Setup Required", variant: "warning" },
      },
    ],
  },
  {
    title: "System Administration",
    badge: "Admin",
    items: [
      {
        title: "System Health",
        icon: <Gauge size={18} />,
        href: route("app.settings.system.health"),
        description: "Monitor system status and performance",
      },
      {
        title: "Error Logs",
        icon: <AlertTriangle size={18} />,
        href: route("app.settings.system.logs"),
        description: "View system error logs",
      },
      {
        title: "Activity Logs",
        icon: <History size={18} />,
        href: route("app.settings.system.activity"),
        description: "Monitor user activities",
      },
      {
        title: "Cache Management",
        icon: <RefreshCw size={18} />,
        href: route("app.settings.system"),
        description: "Manage system cache",
      },
      {
        title: "System Updates",
        icon: <Download size={18} />,
        href: route("app.settings.system.updates"),
        description: "Check and manage system updates",
      },
    ],
  },
];
