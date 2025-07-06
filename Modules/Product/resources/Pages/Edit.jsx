import React from "react";
import { Head } from "@inertiajs/react";
import Form from "./Partials/Edit/Index";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Package, Home, Edit as EditIcon } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";

const EditProduct = ({ product, restaurants, categories, globalAttributes }) => {
  return (
    <AdminLayout>
      <Head title={`Edit Product: ${product.name}`} />
      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "dashboard", icon: Home },
            { label: "Products", href: "app.products.index", icon: Package },
            { label: `Edit: ${product.name}`, icon: EditIcon },
          ]}
        />

        <Form 
          product={product}
          restaurants={restaurants} 
          categories={categories}
          globalAttributes={globalAttributes}
        />
      </div>
    </AdminLayout>
  );
};

export default EditProduct; 