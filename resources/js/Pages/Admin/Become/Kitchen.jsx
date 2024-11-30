import React from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Home, ChefHat } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";
import KitchenStaffApplicationForm from "./Partials/Kitchen/ApplicationForm";

const BecomeKitchenStaff = ({ restaurants }) => {
  return (
    <AdminLayout>
      <Head title="Kitchen Staff Application" />
      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "dashboard", icon: Home },
            { label: "Become Kitchen Staff", icon: ChefHat },
          ]}
        />

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Kitchen Staff Application</h1>
          <p className="text-muted-foreground mt-2">
            Fill out the form below to apply for a kitchen staff position
          </p>
        </div>

        <KitchenStaffApplicationForm restaurants={restaurants} />
      </div>
    </AdminLayout>
  );
};

export default BecomeKitchenStaff;
