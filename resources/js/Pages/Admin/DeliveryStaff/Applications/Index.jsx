import React from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Home, Truck, FileText } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";
import ApplicationList from "./Partials/List/Index";
import StatsCard from "./Partials/Stats/StatsCard";

const DeliveryStaffApplications = ({ applications, filters, statistics, vehicleTypes }) => {
  return (
    <AdminLayout>
      <Head title="Delivery Staff Applications" />
      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "dashboard", icon: Home },
            { label: "Delivery Staff", href: "app.delivery-staff.applications.index", icon: Truck },
            { label: "Applications", icon: FileText },
          ]}
        />

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Delivery Staff Applications</h1>
          <p className="text-muted-foreground mt-2">
            Manage and review delivery staff partnership applications
          </p>
        </div>

        <StatsCard stats={statistics} />
        <ApplicationList 
          applications={applications} 
          filters={filters} 
          vehicleTypes={vehicleTypes}
        />
      </div>
    </AdminLayout>
  );
};

export default DeliveryStaffApplications; 