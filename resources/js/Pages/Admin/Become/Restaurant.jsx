import React from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Home, Store } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";
import RestaurantApplicationForm from "./Partials/Restaurant/ApplicationForm";

const BecomeRestaurant = () => {
  return (
    <AdminLayout>
      <Head title="Restaurant Application" />
      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "dashboard", icon: Home },
            { label: "Become a Restaurant", icon: Store },
          ]}
        />

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Restaurant Application</h1>
          <p className="text-muted-foreground mt-2">
            Fill out the form below to apply for a restaurant partnership
          </p>
        </div>

        <RestaurantApplicationForm />
      </div>
    </AdminLayout>
  );
};

export default BecomeRestaurant;
