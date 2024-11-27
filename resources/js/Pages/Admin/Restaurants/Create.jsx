import React from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import Form from "./Partials/Form/Index";
import { Store, Home } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";

const CreateRestaurant = () => {
  return (
    <AdminLayout>
      <Head title="Create Restaurant" />
      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "dashboard", icon: Home },
            { label: "Restaurants", href: "app.restaurants.index", icon: Store },
            { label: "Create Restaurant" },
          ]}
        />

        <Form />
      </div>
    </AdminLayout>
  );
};

export default CreateRestaurant; 