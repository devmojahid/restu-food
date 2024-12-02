import React from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Home, ChefHat, FileText } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";
import ApplicationList from "./Partials/List/Index";
import StatsCard from "./Partials/Stats/StatsCard";

const KitchenStaffApplications = ({ applications, filters, restaurants, stats }) => {
  return (
    <AdminLayout>
      <Head title="Kitchen Staff Applications" />
      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "dashboard", icon: Home },
            { label: "Kitchen Staff", href: "app.kitchen-staff.applications.index", icon: ChefHat },
            { label: "Applications", icon: FileText },
          ]}
        />

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Kitchen Staff Applications</h1>
          <p className="text-muted-foreground mt-2">
            Manage and review kitchen staff applications
          </p>
        </div>

        <StatsCard stats={stats} />
        <ApplicationList 
          applications={applications} 
          filters={filters} 
          restaurants={restaurants}
        />
      </div>
    </AdminLayout>
  );
};

export default KitchenStaffApplications; 