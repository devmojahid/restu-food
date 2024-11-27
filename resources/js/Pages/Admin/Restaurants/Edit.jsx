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
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            Edit Restaurant
          </h2>
          <Link
            className="link-button-secondary"
            href={route("app.restaurants.index")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
          </Link>
        </div>

        <Form 
          initialData={restaurant}
          submitUrl={route("app.restaurants.update", restaurant.id)}
          method="put"
        />
      </div>
    </AdminLayout>
  );
};

export default EditRestaurant; 