import React from "react";
import { Head } from "@inertiajs/react";
import Form from "./Partials/Create/Index";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Plus, Home, Package } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";

const CreateProduct = ({ restaurants, categories, globalAttributes }) => {
  return (
    <AdminLayout>
      <Head title="Create Product" />
      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "dashboard", icon: Home },
            { label: "Products", href: "app.products.index", icon: Package },
            { label: "Create Product", icon: Plus },
          ]}
        />

        <Form 
          restaurants={restaurants} 
          categories={categories}
          globalAttributes={globalAttributes}
        />
      </div>
    </AdminLayout>
  );
};

export default CreateProduct; 