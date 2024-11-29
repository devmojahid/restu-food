import React from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Home, Store, FileText } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";
import ApplicationList from "./Partials/List/Index";
import StatsCard from "./Partials/Stats/StatsCard";

const RestaurantApplications = ({ applications, filters, stats }) => {
  return (
    <AdminLayout>
      <Head title="Restaurant Applications" />
      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "dashboard", icon: Home },
            { label: "Restaurants", href: "app.restaurants.index", icon: Store },
            { label: "Applications", icon: FileText },
          ]}
        />

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Restaurant Applications</h1>
          <p className="text-muted-foreground mt-2">
            Manage and review restaurant partnership applications
          </p>
        </div>

        <StatsCard stats={stats} />
        <ApplicationList applications={applications} filters={filters} />
      </div>
    </AdminLayout>
  );
};

export default RestaurantApplications; 