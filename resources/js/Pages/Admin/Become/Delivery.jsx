import React from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Home, Truck } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";
import DeliveryApplicationForm from "./Partials/Delivery/ApplicationForm";

const BecomeDelivery = () => {
  return (
    <AdminLayout>
      <Head title="Delivery Staff Application" />
      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "dashboard", icon: Home },
            { label: "Become a Delivery Staff", icon: Truck },
          ]}
        />

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Delivery Staff Application</h1>
          <p className="text-muted-foreground mt-2">
            Fill out the form below to apply as a delivery staff member
          </p>
        </div>

        <DeliveryApplicationForm />
      </div>
    </AdminLayout>
  );
};

export default BecomeDelivery;
