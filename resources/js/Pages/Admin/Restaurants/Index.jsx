import React from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import ListRestaurants from "./Partials/List/Index";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "@inertiajs/react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";
import RestaurantStats from "./Partials/Stats/Index";

export default function Index({ restaurants, filters }) {
  const breadcrumbItems = [
    { label: "Dashboard", href: "dashboard" },
    { label: "Restaurants", href: "app.restaurants.index" },
  ];

  return (
    <AdminLayout>
      <Head title="Restaurants List" />

      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            Manage Restaurants
          </h2>
          <div className="flex space-x-2">
            <Link
              className="link-button-secondary"
              href={route("app.restaurants.index")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>
            <Link
              className="link-button-primary"
              href={route("app.restaurants.create")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Restaurant
            </Link>
          </div>
        </div>

        <RestaurantStats />
        
        <ListRestaurants restaurants={restaurants} />
      </div>
    </AdminLayout>
  );
} 