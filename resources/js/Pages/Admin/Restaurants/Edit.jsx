import React from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import Form from "./Partials/Form/Index";
import { Store, Home, ArrowLeft } from "lucide-react";
import { Link } from "@inertiajs/react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";

const EditRestaurant = ({ restaurant }) => {
  const breadcrumbItems = [
    { label: "Dashboard", href: "dashboard", icon: Home },
    { label: "Restaurants", href: "app.restaurants.index", icon: Store },
    { label: "Edit Restaurant" },
  ];

  return (
    <AdminLayout>
      <Head title={`Edit Restaurant: ${restaurant.name}`} />

      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb items={breadcrumbItems} />

        <Form
          restaurant={restaurant}
          submitUrl={route("app.restaurants.update", restaurant.id)}
          method="put"
        />
      </div>
    </AdminLayout>
  );
};

export default EditRestaurant; 