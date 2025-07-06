import React from "react";
import { Head, Link } from "@inertiajs/react";
import Table from "./Partials/List/Index";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Home, Package, Plus, ArrowLeft } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";

export default function Index({ products }) {
  return (
    <AdminLayout>
      <Head title="Products List" />
      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "dashboard", icon: Home },
            { label: "Products", href: "products", icon: Package },
          ]}
        />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 space-y-4 sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            List Products
          </h2>
          <div className="flex space-x-2">
            <Link className="link-button-secondary" href="products">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
            </Link>
            <Link className="link-button-primary" href="products/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Product
            </Link>
          </div>
        </div>
        <Table products={products} />
      </div>
    </AdminLayout>
  );
} 